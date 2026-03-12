import axios from 'axios';

export async function callGemini(prompt, options = {}) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error('OPENROUTER_API_KEY not set in environment variables');

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'google/gemma-3-12b-it:free',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: options.maxTokens ?? 4096,
        temperature: options.temperature ?? 0.2
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': 'http://localhost:3000',
          'X-Title': 'STRATOS'
        },
        timeout: 60000
      }
    );

    const text = response.data?.choices?.[0]?.message?.content;
    if (!text) throw new Error('OpenRouter returned empty response');
    return text;

  } catch (error) {
    if (error.response) {
      throw new Error(`OpenRouter API [${error.response.status}]: ${JSON.stringify(error.response.data)}`);
    }
    throw error;
  }
}