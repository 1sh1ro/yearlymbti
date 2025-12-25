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

    const systemPrompt = `你是一个专业的年度报告分析师。用户会上传多个来自不同App的年度报告截图。

你的任务是：
1. 仔细识别每张截图中的信息，包括App名称、统计数据、排名等
2. 提取关键数据点，如：听歌时长、阅读量、观看时长、消费金额、运动步数等
3. 将所有数据汇总整理成一份有趣的综合年度报告

风格要求：${getStyleDescription(style)}

重要提示：
- 尽可能识别截图中的所有数据
- 如果某些数据无法识别，可以跳过
- 总结语言要有趣、温暖、富有洞察力
- highlights数组最多包含8个最重要的数据点`;

    const userPrompt = `请分析以下${images.length}张年度报告截图，提取数据并生成汇总报告。`;

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
                    description: "一段有趣的、个性化的年度总结感言（100-200字）"
                  },
                  apps: {
                    type: "array",
                    items: { type: "string" },
                    description: "识别到的App名称列表"
                  }
                },
                required: ["totalApps", "highlights", "summary", "apps"]
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
