import 'dotenv/config';
import express from "express";
import cors from 'cors';
import { GoogleGenAI } from "@google/genai";

const app = express();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post('/api/chat', async (req, res) => {
  const { conversation } = req.body;
  try { 
    if (!Array.isArray(conversation)) throw new Error("Conversation must be an array of messages");
    
    const contents = conversation.map(({ role, text }) => ({
        role,
        parts: [{ text }]
    }));
    
    const response = await ai.models.generateContent({
      model: model,
      contents,
      config: {
        temperature: 1.2,
        systemInstruction: "Kamu adalah ahli gizi yang memberikan rekomendasi makanan sehat dengan bahasa santai, positif, dan mudah dipahami.",
      },
    });
    res.status(200).json({ text: response.text });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
});
