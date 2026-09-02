const MOCK_RESPONSE_PREFIX = 'I understand you\'re asking about';

/**
 * Builds the local (offline) assistant reply used when no OPENAI_API_KEY is configured.
 */
export function buildMockResponse(message: string): string {
  return `${MOCK_RESPONSE_PREFIX}: "${message}". 
As your CloudImage Assistant, I'm here to help with image organization, enhancement, and cloud storage strategies.

Here are some recommendations:
1. **Organize by Date**: Create folders by year/month for easy navigation
2. **Use Descriptive Names**: Name files with content and date (e.g., "vacation-2024-08-12.jpg")
3. **Leverage Metadata**: Use tags for quick filtering and search
4. **Regular Backups**: Ensure important images are always backed up

Would you like specific advice on any of these areas?`;
}

export function isOpenAIConfigured(): boolean {
  return Boolean(process.env.OPENAI_API_KEY);
}

/**
 * Returns an assistant reply. Uses OpenAI when an API key is configured and
 * falls back to the local mock response otherwise (or when the call fails),
 * so the app keeps working without any external service.
 */
export async function generateAssistantResponse(message: string): Promise<string> {
  if (!isOpenAIConfigured()) {
    return buildMockResponse(message);
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content:
              'You are CloudImage Assistant, helping users organize, enhance and store their images.',
          },
          { role: 'user', content: message },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI request failed with status ${response.status}`);
    }

    const data = (await response.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const content = data.choices?.[0]?.message?.content;

    return content?.trim() || buildMockResponse(message);
  } catch (error) {
    console.warn('OpenAI unavailable, falling back to local response:', error);
    return buildMockResponse(message);
  }
}
