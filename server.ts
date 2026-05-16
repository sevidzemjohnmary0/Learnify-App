import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // API Routes
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history } = req.body;
      const model = "gemini-3-flash-preview";
      
      const chat = ai.chats.create({
        model,
        config: {
          systemInstruction: `You are Learnify AI, a supportive academic assistant for students in Cameroon. 
          Your goal is to help students continue their education despite disruptions like the Anglophone crisis.
          Provide clear, encouraging, and step-by-step explanations for academic questions. 
          Use local context when appropriate (e.g., GCE curriculum, local examples in Bamenda or Buea).
          Be empathetic to their situation. 
          If asked about "Snap & Solve", explain that you can help with questions uploaded as images too.`,
        },
      });

      // Simple history mapping if provided
      // For now, let's just use the message for simplicity
      const response = await chat.sendMessage({ message });
      res.json({ text: response.text });
    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({ error: "Failed to get AI response" });
    }
  });

  app.post("/api/vision", async (req, res) => {
    try {
      const { image, prompt } = req.body; // image is base64
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: {
          parts: [
            { inlineData: { data: image.split(',')[1] || image, mimeType: "image/jpeg" } }, // strip data:image/jpeg;base64, if present
            { text: prompt || "Explain what this is and solve the problem if it's an academic question." }
          ]
        },
        config: {
          systemInstruction: "You are Learnify AI. Analyze this image of a textbook, notes, or blackboard and provide a clear academic explanation or solution. Be supportive of the student.",
        }
      });
      res.json({ text: response.text });
    } catch (error) {
      console.error("Vision error:", error);
      res.status(500).json({ error: "Failed to analyze image" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
