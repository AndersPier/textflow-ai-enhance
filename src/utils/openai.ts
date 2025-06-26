
export const analyzeTextWithOpenAI = async (text: string, apiKey: string): Promise<string> => {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful writing assistant. Analyze the provided text and give feedback on writing style, grammar, clarity, and suggestions for improvement. Be constructive and specific in your feedback.'
        },
        {
          role: 'user',
          content: `Please analyze this text and provide feedback:\n\n${text}`
        }
      ],
      max_tokens: 1000,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Failed to analyze text');
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || 'No analysis available';
};
