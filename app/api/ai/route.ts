import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Prompt string is required' }, { status: 400 });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OPENROUTER_API_KEY is not configured in server environment.' },
        { status: 500 }
      );
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://chrisland-gst206-showcase.vercel.app',
        'X-Title': 'Chrisland GST 206 AI Showcase',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // OpenRouter Fallback Routing Array:
        // Automatically fails over across providers if primary hits rate limit (429)
        models: [
          'google/gemini-2.0-flash-exp:free',
          'google/gemini-flash-1.5',
          'meta-llama/llama-3.3-70b-instruct:free',
          'mistralai/mistral-7b-instruct:free',
          'deepseek/deepseek-chat:free'
        ],
        messages: [
          {
            role: 'system',
            content: 'You are an intelligent, empathetic academic AI assistant for Chrisland University GST 206 (AI Literacy, Vibe Coding, and Mental Health Interventions: Stress, Anxiety, and Depression). Provide clear, concise, and helpful answers.'
          },
          { role: 'user', content: prompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `OpenRouter API error: ${response.status}`, details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    const result = data?.choices?.[0]?.message?.content || 'No response generated.';

    return NextResponse.json({ result });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown server error';
    return NextResponse.json({ error: 'Failed to process AI request', details: message }, { status: 500 });
  }
}
