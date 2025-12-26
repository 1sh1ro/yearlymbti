import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AnalysisStage {
  stage: number;
  name: string;
  status: 'pending' | 'processing' | 'completed';
  data?: unknown;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { images, style, strictMode } = await req.json();
    
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

    console.log(`Streaming analysis for ${images.length} images with style: ${style}, strictMode: ${strictMode}`);

    // Create SSE stream
    const encoder = new TextEncoder();
    const stream = new TransformStream();
    const writer = stream.writable.getWriter();

    const sendEvent = async (event: string, data: unknown) => {
      const message = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
      await writer.write(encoder.encode(message));
    };

    // Start async processing
    (async () => {
      try {
        // Stage 1: 识别来源
        await sendEvent('stage', { stage: 1, name: '识别来源', status: 'processing' });
        
        const imageContents = images.map((base64Image: string) => ({
          type: "image_url",
          image_url: {
            url: base64Image.startsWith('data:') ? base64Image : `data:image/jpeg;base64,${base64Image}`
          }
        }));

        // First API call: identify sources
        const sourceResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${LOVABLE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'google/gemini-2.5-flash',
            messages: [
              { 
                role: 'system', 
                content: '你是图像识别专家。请识别每张截图的来源App和年份。只返回识别结果，不要分析。' 
              },
              { 
                role: 'user', 
                content: [
                  { type: 'text', text: `识别这${images.length}张截图的来源App和年份。` },
                  ...imageContents
                ]
              }
            ],
            tools: [{
              type: "function",
              function: {
                name: "identify_sources",
                description: "识别截图来源",
                parameters: {
                  type: "object",
                  properties: {
                    sources: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          app: { type: "string", description: "App名称" },
                          year: { type: "string", description: "年份" }
                        },
                        required: ["app", "year"]
                      }
                    }
                  },
                  required: ["sources"]
                }
              }
            }],
            tool_choice: { type: "function", function: { name: "identify_sources" } }
          }),
        });

        if (!sourceResponse.ok) {
          throw new Error(`识别来源失败: ${sourceResponse.status}`);
        }

        const sourceData = await sourceResponse.json();
        const sourceToolCall = sourceData.choices?.[0]?.message?.tool_calls?.[0];
        let sources = { sources: [] };
        if (sourceToolCall) {
          try {
            sources = JSON.parse(sourceToolCall.function.arguments);
          } catch (e) {
            console.error('Parse sources error:', e);
          }
        }

        await sendEvent('stage', { 
          stage: 1, 
          name: '识别来源', 
          status: 'completed',
          data: {
            count: images.length,
            sources: sources.sources,
            summary: `识别到 ${sources.sources.length} 个 App 的年度报告`
          }
        });

        // Stage 2: 数据抽取
        await sendEvent('stage', { stage: 2, name: '数据抽取', status: 'processing' });

        const strictnessPrompt = strictMode === 'strict' 
          ? '请非常严格地只提取截图中明确可见的数据，不要做任何推测。' 
          : strictMode === 'loose'
          ? '可以适当推测和补充一些合理的数据。'
          : '正常提取截图中的数据。';

        const extractResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${LOVABLE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'google/gemini-2.5-flash',
            messages: [
              { 
                role: 'system', 
                content: `你是数据抽取专家。${strictnessPrompt}提取每个App的关键数据指标。` 
              },
              { 
                role: 'user', 
                content: [
                  { type: 'text', text: `从这${images.length}张年度报告截图中提取所有关键数据。包括时长、次数、金额、排名等。` },
                  ...imageContents
                ]
              }
            ],
            tools: [{
              type: "function",
              function: {
                name: "extract_data",
                description: "提取关键数据",
                parameters: {
                  type: "object",
                  properties: {
                    extractedData: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          app: { type: "string" },
                          metrics: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                label: { type: "string" },
                                value: { type: "string" },
                                type: { type: "string", enum: ["duration", "count", "amount", "rank", "percent", "other"] }
                              },
                              required: ["label", "value", "type"]
                            }
                          }
                        },
                        required: ["app", "metrics"]
                      }
                    }
                  },
                  required: ["extractedData"]
                }
              }
            }],
            tool_choice: { type: "function", function: { name: "extract_data" } }
          }),
        });

        if (!extractResponse.ok) {
          throw new Error(`数据抽取失败: ${extractResponse.status}`);
        }

        const extractData = await extractResponse.json();
        const extractToolCall = extractData.choices?.[0]?.message?.tool_calls?.[0];
        let extracted = { extractedData: [] };
        if (extractToolCall) {
          try {
            extracted = JSON.parse(extractToolCall.function.arguments);
          } catch (e) {
            console.error('Parse extract error:', e);
          }
        }

        await sendEvent('stage', { 
          stage: 2, 
          name: '数据抽取', 
          status: 'completed',
          data: extracted
        });

        // Stage 3: 亮点洞察
        await sendEvent('stage', { stage: 3, name: '亮点洞察', status: 'processing' });

        const insightResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${LOVABLE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'google/gemini-2.5-flash',
            messages: [
              { 
                role: 'system', 
                content: `你是洞察分析师。根据提取的数据生成6-8个最有意思的亮点洞察。风格：${getStyleDescription(style)}` 
              },
              { 
                role: 'user', 
                content: `根据这些数据生成亮点洞察：\n${JSON.stringify(extracted.extractedData, null, 2)}` 
              }
            ],
            tools: [{
              type: "function",
              function: {
                name: "generate_insights",
                description: "生成亮点洞察",
                parameters: {
                  type: "object",
                  properties: {
                    highlights: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          icon: { type: "string", enum: ["music", "book", "film", "coffee", "trending", "calendar", "heart", "star", "zap", "award", "clock", "map", "shopping-cart", "headphones", "gamepad", "camera"] },
                          label: { type: "string" },
                          value: { type: "string" },
                          subtext: { type: "string" }
                        },
                        required: ["icon", "label", "value"]
                      }
                    }
                  },
                  required: ["highlights"]
                }
              }
            }],
            tool_choice: { type: "function", function: { name: "generate_insights" } }
          }),
        });

        if (!insightResponse.ok) {
          throw new Error(`亮点生成失败: ${insightResponse.status}`);
        }

        const insightData = await insightResponse.json();
        const insightToolCall = insightData.choices?.[0]?.message?.tool_calls?.[0];
        let insights = { highlights: [] };
        if (insightToolCall) {
          try {
            insights = JSON.parse(insightToolCall.function.arguments);
          } catch (e) {
            console.error('Parse insights error:', e);
          }
        }

        await sendEvent('stage', { 
          stage: 3, 
          name: '亮点洞察', 
          status: 'completed',
          data: insights
        });

        // Stage 4: MBTI 推断
        await sendEvent('stage', { stage: 4, name: 'MBTI 推断', status: 'processing' });

        const mbtiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${LOVABLE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'google/gemini-2.5-flash',
            messages: [
              { 
                role: 'system', 
                content: `你是心理分析师。根据用户的数字行为数据推断其年度MBTI人格。必须给出每个字母的依据和置信度。
                
判断规则：
- E/I: 社交App活跃度、分享行为、深夜活跃
- N/S: 内容涉猎广度、新鲜事物探索
- T/F: 知识类vs娱乐类内容偏好
- J/P: 使用规律性、作息时间` 
              },
              { 
                role: 'user', 
                content: `根据这些行为数据推断MBTI：\n${JSON.stringify(extracted.extractedData, null, 2)}` 
              }
            ],
            tools: [{
              type: "function",
              function: {
                name: "infer_mbti",
                description: "推断MBTI人格",
                parameters: {
                  type: "object",
                  properties: {
                    type: { type: "string", description: "四字母MBTI类型" },
                    title: { type: "string", description: "有趣的人格称号" },
                    traits: { 
                      type: "array", 
                      items: { type: "string" },
                      description: "4个人格特点" 
                    },
                    explanation: { type: "string", description: "判断解释" },
                    confidence: {
                      type: "object",
                      properties: {
                        EI: { type: "object", properties: { letter: { type: "string" }, confidence: { type: "number" }, reason: { type: "string" } } },
                        NS: { type: "object", properties: { letter: { type: "string" }, confidence: { type: "number" }, reason: { type: "string" } } },
                        TF: { type: "object", properties: { letter: { type: "string" }, confidence: { type: "number" }, reason: { type: "string" } } },
                        JP: { type: "object", properties: { letter: { type: "string" }, confidence: { type: "number" }, reason: { type: "string" } } }
                      }
                    }
                  },
                  required: ["type", "title", "traits", "explanation", "confidence"]
                }
              }
            }],
            tool_choice: { type: "function", function: { name: "infer_mbti" } }
          }),
        });

        if (!mbtiResponse.ok) {
          throw new Error(`MBTI推断失败: ${mbtiResponse.status}`);
        }

        const mbtiData = await mbtiResponse.json();
        const mbtiToolCall = mbtiData.choices?.[0]?.message?.tool_calls?.[0];
        let mbti = { type: "INFP", title: "未知类型", traits: [], explanation: "", confidence: {} };
        if (mbtiToolCall) {
          try {
            mbti = JSON.parse(mbtiToolCall.function.arguments);
          } catch (e) {
            console.error('Parse mbti error:', e);
          }
        }

        await sendEvent('stage', { 
          stage: 4, 
          name: 'MBTI 推断', 
          status: 'completed',
          data: mbti
        });

        // Stage 5: 报告生成
        await sendEvent('stage', { stage: 5, name: '报告生成', status: 'processing' });

        const summaryResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${LOVABLE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'google/gemini-2.5-flash',
            messages: [
              { 
                role: 'system', 
                content: `你是文案大师。根据所有分析结果写一段走心的2025年度感言。风格：${getStyleDescription(style)}。要像朋友写的信，引用具体数据，150-250字。重要：这是2025年的年度报告，请明确提到2025年。` 
              },
              { 
                role: 'user', 
                content: `根据这些分析结果写2025年度感言：
亮点：${JSON.stringify(insights.highlights)}
MBTI：${mbti.type} ${mbti.title}` 
              }
            ],
            tools: [{
              type: "function",
              function: {
                name: "write_summary",
                description: "写年度感言",
                parameters: {
                  type: "object",
                  properties: {
                    summary: { type: "string", description: "年度感言文案" }
                  },
                  required: ["summary"]
                }
              }
            }],
            tool_choice: { type: "function", function: { name: "write_summary" } }
          }),
        });

        if (!summaryResponse.ok) {
          throw new Error(`感言生成失败: ${summaryResponse.status}`);
        }

        const summaryData = await summaryResponse.json();
        const summaryToolCall = summaryData.choices?.[0]?.message?.tool_calls?.[0];
        let summary = "2025年，你的数字足迹记录了精彩的一年。";
        if (summaryToolCall) {
          try {
            const summaryResult = JSON.parse(summaryToolCall.function.arguments);
            summary = summaryResult.summary;
          } catch (e) {
            console.error('Parse summary error:', e);
          }
        }

        // Final report
        const finalReport = {
          totalApps: sources.sources.length,
          apps: sources.sources.map((s: { app: string }) => s.app),
          highlights: insights.highlights,
          summary,
          mbti: {
            type: mbti.type,
            title: mbti.title,
            traits: mbti.traits,
            explanation: mbti.explanation
          },
          extractedData: extracted.extractedData,
          confidence: mbti.confidence
        };

        await sendEvent('stage', { 
          stage: 5, 
          name: '报告生成', 
          status: 'completed',
          data: finalReport
        });

        await sendEvent('complete', { success: true, report: finalReport });
        
      } catch (error) {
        console.error('Streaming analysis error:', error);
        await sendEvent('error', { 
          error: error instanceof Error ? error.message : '分析过程中出现错误' 
        });
      } finally {
        await writer.close();
      }
    })();

    return new Response(stream.readable, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

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
