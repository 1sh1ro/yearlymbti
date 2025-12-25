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

请以JSON格式返回结果，结构如下：
{
  "totalApps": 识别到的App数量,
  "highlights": [
    {
      "icon": "图标类型(music/book/film/coffee/trending/calendar/heart/star/zap/award)",
      "label": "数据标签",
      "value": "数据值",
      "subtext": "补充说明(可选)"
    }
  ],
  "summary": "一段有趣的、个性化的年度总结感言（100-200字）",
  "apps": ["识别到的App列表"]
}

重要提示：
- 尽可能识别截图中的所有数据
- 如果某些数据无法识别，可以跳过
- 总结语言要有趣、温暖、富有洞察力
- highlights数组最多包含8个最重要的数据点`;

    const userPrompt = `请分析以下${images.length}张年度报告截图，提取数据并生成汇总报告。报告风格要求：${getStyleDescription(style)}`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-pro',
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
        max_tokens: 2000,
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
    
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      console.error('No content in AI response');
      return new Response(
        JSON.stringify({ error: 'AI 返回内容为空' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse the JSON from the response
    let reportData;
    try {
      // Try to extract JSON from the response (it might be wrapped in markdown code blocks)
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || content.match(/```\s*([\s\S]*?)\s*```/);
      const jsonStr = jsonMatch ? jsonMatch[1] : content;
      reportData = JSON.parse(jsonStr.trim());
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', parseError);
      console.log('Raw content:', content);
      
      // Return a fallback structure with the raw summary
      reportData = {
        totalApps: images.length,
        highlights: [],
        summary: content,
        apps: []
      };
    }

    console.log('Report generated successfully');
    
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
