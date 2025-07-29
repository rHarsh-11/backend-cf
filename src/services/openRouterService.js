import axios from 'axios';

export const callOpenRouter = async (prompt) => {
  const model = process.env.OPENROUTER_MODEL || 'openai/gpt-4o';

  const systemPrompt = `
You are a helpful AI that only responds with strict JSON like:
{ "jsx": "<button>Hello</button>", "css": "button { color: red; }" }
Do not include markdown, text, or code formatting — only return valid JSON.
`;

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: 0.5,
        max_tokens: 1000
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:3000', // Optional for OpenRouter tracking
          'X-Title': 'Component Generator Playground'
        }
      }
    );

    const reply = response.data.choices?.[0]?.message?.content || '';
    console.log('🧠 AI RAW:', reply);

    // Ensure JSON.parse doesn't fail
    const match = reply.match(/\{[\s\S]*\}/); // try to extract only the JSON object
    if (!match) throw new Error('No JSON found in AI response');

    return JSON.parse(match[0]);
  } catch (err) {
    console.error('❌ OpenRouter error:', err.response?.data || err.message);
    throw new Error('AI model failed to respond or returned invalid JSON');
  }
};

