// apps/api/routes/ai.ts
import { Router } from "express";
import type { FileRef, TestSummary, GeneratedTest } from "../../../packages/shared/src/types";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = Router();

// Load Gemini API key from environment
const genAI = new GoogleGenerativeAI(process.env.AI_API_KEY as string);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

// Rate-limit tracker
let lastRequestTime = 0;
const REQUEST_INTERVAL = 1500; // 1.5 seconds between requests
let requestCount = 0;
const MAX_REQUESTS_PER_MIN = 50; // adjust per your Gemini plan

async function safeAIRequest(prompt: string): Promise<string> {
  // Throttle requests
  const now = Date.now();
  const timeSinceLast = now - lastRequestTime;

  if (timeSinceLast < REQUEST_INTERVAL) {
    await new Promise((resolve) => setTimeout(resolve, REQUEST_INTERVAL - timeSinceLast));
  }

  lastRequestTime = Date.now();

  // Track quota usage
  requestCount++;
  console.log(`📡 AI Requests used: ${requestCount}/${MAX_REQUESTS_PER_MIN} in the last minute`);

  if (requestCount >= MAX_REQUESTS_PER_MIN) {
    console.warn("⚠️ Approaching rate limit — pausing for 60 seconds");
    await new Promise((resolve) => setTimeout(resolve, 60000));
    requestCount = 0;
  }

  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    if (error instanceof Error) {
      console.error("❌ AI request failed:", error.message);
    } else {
      console.error("❌ AI request failed with unknown error:", error);
    }
    return "";
  }
}

// ---- Summaries Endpoint ----
router.post("/summaries", async (req, res) => {
  const { framework, files } = req.body as {
    framework?: string;
    files?: FileRef[];
  };

  if (!framework || !Array.isArray(files) || files.length === 0) {
    return res.status(400).json({
      error: "Invalid request body",
      details: "framework and files[] are required",
    });
  }

  try {
    const BATCH_SIZE = 3;
    const summaries: TestSummary[] = [];

    for (let i = 0; i < files.length; i += BATCH_SIZE) {
      const batch = files.slice(i, i + BATCH_SIZE);

      const prompt = `
You are an AI test generator.
Given these code files, create a JSON array of test summaries for the ${framework} framework.
Each summary should have: { "title": string, "description": string }.

Files:
${batch.map((f) => `${f.path}\n${f.content}`).join("\n\n")}
`;

      const aiResponse = await safeAIRequest(prompt);
      if (!aiResponse) continue;

      try {
        const parsed = JSON.parse(aiResponse.trim());
        summaries.push(...parsed);
      } catch {
        console.error("⚠️ Invalid AI JSON:", aiResponse);
      }
    }

    res.json(summaries);
  } catch (err) {
    if (err instanceof Error) {
      console.error("Error generating summaries:", err.message);
    } else {
      console.error("Unknown error generating summaries:", err);
    }
    res.status(500).json({
      error: "Failed to generate summaries",
      details: err instanceof Error ? err.message : err,
    });
  }
});

// ---- Test Case Generation Endpoint ----
router.post("/generate", async (req, res) => {
  const { framework, summary } = req.body as {
    framework?: string;
    summary?: TestSummary;
  };

  if (!framework || !summary) {
    return res.status(400).json({
      error: "Invalid request body",
      details: "framework and summary are required",
    });
  }

  try {
    const prompt = `
Generate a ${framework} test case for the following summary:
${JSON.stringify(summary, null, 2)}
`;

    const aiResponse = await safeAIRequest(prompt);

    const out: GeneratedTest = {
      filename: `${summary.title.replace(/\s+/g, "_")}.test.ts`,
      code: aiResponse,
    };

    res.json(out);
  } catch (err) {
    if (err instanceof Error) {
      console.error("Error generating test code:", err.message);
    } else {
      console.error("Unknown error generating test code:", err);
    }
    res.status(500).json({
      error: "Failed to generate test code",
      details: err instanceof Error ? err.message : err,
    });
  }
});

export default router;
