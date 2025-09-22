const API_BASE = "http://localhost:8888"; // FastAPI backend

/**
 * Generate streaming response from the backend
 * @param {string} prompt - user input
 * @param {(token: string) => void} onToken - callback for each streamed token
 */
export async function generate(prompt, onToken) {
  try {
    const res = await fetch(`${API_BASE}/generate_stream`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    if (!res.ok || !res.body) {
      throw new Error("Failed to connect to the backend.");
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder("utf-8");

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value); // ✅ no { stream: true }
      if (chunk) onToken(chunk);
    }
  } catch (err) {
    console.error("Error in generate:", err);
    onToken("\n[Error: Failed to fetch response]");
  }
}

/**
 * Get available models from the backend
 * @returns {Promise<any>} list of models
 */
export async function getModels() {
  try {
    const res = await fetch(`${API_BASE}/models`);
    if (!res.ok) throw new Error("Failed to fetch models");
    return res.json();
  } catch (err) {
    console.error("Error fetching models:", err);
    return [];
  }
}
