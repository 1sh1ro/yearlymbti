import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { images, style } = await req.json();
    
    if (!images || !Array.isArray(images) || images.length === 0) {
      return new Response(
        JSON.stringify({ error: '请至少上传一张截图' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY is not configured');
      return new Response(
        JSON.stringify({ error: 'AI 服务未配置' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Analyzing ${images.length} images with style: ${style}`);

    // Build image content for the API
    const imageContents = images.map((base64Image: string) => ({
      type: "image_url",
      image_url: {
        url: base64Image.startsWith('data:') ? base64Image : `data:image/jpeg;base64,${base64Image}`
      }
    }));

    const systemPrompt = `你是一位专业的数据洞察分析师，擅长从年度报告中挖掘用户画像和行为模式。

## 核心任务
分析用户上传的年度报告截图，生成一份有深度、有温度的个人年度总结。

## 图片识别指南
仔细观察每张截图，提取以下信息：
- **App名称**：识别截图来源（如网易云音乐、微信读书、B站、美团、支付宝等）
- **核心数据**：时长、次数、金额、排名、百分比等具体数值
- **偏好标签**：最爱的歌手/书籍/UP主/美食类型等
- **时间模式**：活跃时段、使用天数、高峰期等
- **特殊成就**：排名、超越百分比、年度标签等

## 年度MBTI人格分析规则
根据数据行为推断用户的"数字人格"：

| 维度 | 选项 | 判断依据 |
|------|------|----------|
| E/I | E外向 | 社交App活跃（微信、微博）、分享行为多、互动数据高 |
| E/I | I内向 | 独处App为主（阅读、听歌、追剧）、创作型消费、深夜活跃 |
| N/S | N直觉 | 内容涉猎广泛、喜欢新鲜事物、探索型用户 |
| N/S | S感知 | 偏好固定内容、重复消费、忠诚型用户 |
| T/F | T思考 | 知识类内容多（学习、科普、新闻）、理性消费 |
| T/F | F情感 | 娱乐生活类多（综艺、情感、美食）、感性消费 |
| J/P | J计划 | 使用规律、早起用户、目标导向型 |
| J/P | P随性 | 使用不规律、深夜党、随心所欲型 |

## 输出风格：${getStyleDescription(style)}

## 质量要求
1. **数据准确**：只写截图中明确看到的数据，不要编造
2. **洞察深刻**：不只是罗列数据，要分析背后的生活方式
3. **MBTI有据**：每个字母的判断都要有具体数据支撑
4. **文案走心**：summary要像朋友写给你的年度信，温暖且有共鸣
5. **称号有趣**：MBTI称号要独特、有画面感，如"赛博夜游神"、"知识囤积症患者"`;

    const userPrompt = `请仔细分析这${images.length}张年度报告截图。

分析步骤：
1. 逐张识别每个App的名称和关键数据
2. 找出最有代表性的6-8个数据亮点
3. 综合所有数据，分析用户的行为模式
4. 基于行为模式推断年度MBTI人格
5. 撰写一段有洞察力的年度感言

请开始分析：`;

    // Use tool calling for structured output
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { 
            role: 'user', 
            content: [
              { type: 'text', text: userPrompt },
              ...imageContents
            ]
          }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "generate_annual_report",
              description: "生成年度报告汇总",
              parameters: {
                type: "object",
                properties: {
                  totalApps: {
                    type: "number",
                    description: "识别到的App数量"
                  },
                  highlights: {
                    type: "array",
                    description: "关键数据亮点，最多8个",
                    items: {
                      type: "object",
                      properties: {
                        icon: {
                          type: "string",
                          enum: ["music", "book", "film", "coffee", "trending", "calendar", "heart", "star", "zap", "award", "clock", "map", "shopping-cart", "headphones", "gamepad", "camera"],
                          description: "图标类型"
                        },
                        label: {
                          type: "string",
                          description: "数据标签，如'年度听歌时长'"
                        },
                        value: {
                          type: "string",
                          description: "数据值，如'1234小时'"
                        },
                        subtext: {
                          type: "string",
                          description: "补充说明，可选"
                        }
                      },
                      required: ["icon", "label", "value"]
                    }
                  },
                  summary: {
                    type: "string",
                    description: "一段走心的年度感言，像朋友写的信，要有具体数据引用、生活洞察、温暖祝福（150-250字）"
                  },
                  apps: {
                    type: "array",
                    items: { type: "string" },
                    description: "识别到的App名称列表，如['网易云音乐', '微信读书', 'B站']"
                  },
                  mbti: {
                    type: "object",
                    description: "基于数据行为的年度MBTI人格分析",
                    properties: {
                      type: {
                        type: "string",
                        description: "四个字母的MBTI类型（如INFP），每个字母必须有数据依据"
                      },
                      title: {
                        type: "string",
                        description: "有趣且有画面感的人格称号，如'赛博夜游神'、'知识囤积症患者'、'深夜emo专家'、'奶茶续命选手'"
                      },
                      traits: {
                        type: "array",
                        items: { type: "string" },
                        description: "4个基于具体数据的人格特点，格式：'特点描述+数据佐证'，如'深夜是你的主场，凌晨1点活跃度最高'"
                      },
                      explanation: {
                        type: "string",
                        description: "解释MBTI判断逻辑，必须引用具体数据，格式：'你的[数据]表明你是[特质]...'（100-180字）"
                      }
                    },
                    required: ["type", "title", "traits", "explanation"]
                  }
                },
                required: ["totalApps", "highlights", "summary", "apps", "mbti"]
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "generate_annual_report" } }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: '请求过于频繁，请稍后再试' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI 额度不足，请充值后再试' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: 'AI 分析失败，请重试' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    console.log('AI response received');
    
    // Extract tool call result
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall || toolCall.function.name !== 'generate_annual_report') {
      console.error('No valid tool call in AI response:', JSON.stringify(data));
      return new Response(
        JSON.stringify({ error: 'AI 返回格式错误' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let reportData;
    try {
      reportData = JSON.parse(toolCall.function.arguments);
      console.log('Report generated successfully with', reportData.highlights?.length || 0, 'highlights');
    } catch (parseError) {
      console.error('Failed to parse tool call arguments:', parseError);
      console.error('Raw arguments:', toolCall.function.arguments);
      return new Response(
        JSON.stringify({ error: 'AI 返回数据解析失败' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    return new Response(
      JSON.stringify({ success: true, report: reportData }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in analyze-reports function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : '分析过程中出现错误' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function getStyleDescription(style: string): string {
  const styles: Record<string, string> = {
    playful: '活力趣味风格 - 用词活泼，多用emoji和感叹号，语气欢快热情',
    minimal: '简约清新风格 - 语言简洁精炼，重点突出，避免冗余',
    retro: '复古怀旧风格 - 带有怀旧感的表达方式，温暖而富有情怀',
    tech: '科技未来风格 - 用词现代、科技感强，可以用一些科技术语',
    artistic: '艺术水彩风格 - 文字优美，富有诗意和艺术气息'
  };
  return styles[style] || styles.playful;
}
