/**
 * Helper client utility to call the multi-model OpenRouter backend API (/api/ai).
 * Automatically handles failover, errors, and provides safe defaults.
 */
export async function askAI(prompt: string): Promise<{ success: boolean; result?: string; error?: string }> {
  try {
    const trimmed = prompt.trim();
    if (!trimmed) {
      return { success: false, error: 'Please enter a valid question or prompt.' };
    }

    const response = await fetch('/api/ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt: trimmed }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || data.details || 'Failed to retrieve response from AI assistant.'
      };
    }

    return {
      success: true,
      result: data.result || 'No response generated.'
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Network error';
    return {
      success: false,
      error: `Connection error: ${message}. Please verify your internet connection.`
    };
  }
}
