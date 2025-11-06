// server.js — Express backend to generate image and return prompt using GPT-4o

import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { generateImagePrompt } from "./builder.js";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post("/generate", async (req, res) => {
  try {
    const prompt = generateImagePrompt(req.body);
    console.log("Prompt for image generation:\n", prompt);

    // ✅ Correct GPT-4o image generation call
    const imageResponse = await openai.images.generate({
      model: "gpt-4o-mini",   // or "gpt-4o" for highest quality
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      response_format: "b64_json",
    });

    const base64Image = imageResponse.data?.[0]?.b64_json;
    if (!base64Image) throw new Error("No image returned from GPT-4o");

    const imageUrl = `data:image/png;base64,${base64
