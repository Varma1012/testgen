// apps/api/services/aiService.ts
import axios from "axios";

export async function getAIResponse(prompt: string): Promise<string> {
  const provider = process.env.AI_PROVIDER;

  // Create axios instance with high limits for large payloads
  const api = axios.create({
    maxBodyLength: Infinity,
    maxContentLength: Infinity,
  });

  if (provider === "gemini") {
    const r = await api.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${process.env.AI_API_KEY}`,
      { contents: [{ parts: [{ text: prompt }] }] }
    );
    return r.data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  }

  if (provider === "openrouter") {
    const r = await api.post(
      "https://openrouter.ai/api/v1/chat/completions",
      { model: "gpt-4o", messages: [{ role: "user", content: prompt }] },
      { headers: { Authorization: `Bearer ${process.env.AI_API_KEY}` } }
    );
    return r.data.choices?.[0]?.message?.content || "";
  }

  if (provider === "ollama") {
    const r = await api.post("http://localhost:11434/api/generate", {
      model: "llama2",
      prompt
    });
    return r.data.response || "";
  }

  throw new Error(`Unknown AI provider: ${provider}`);
}
