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

    // Use GPT-4o or GPT-4o-mini for improved visual accuracy
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // change to "gpt-4o" for maximum quality
      messages: [
        {
          role: "system",
          content:
            "You are a photorealistic image generation assistant. Create ultra-realistic renderings of handcrafted furniture and materials exactly as described, with accurate color, scale, and lighting."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      modalities: ["text", "image"],
      response_format: "b64_json" // receive base64 image data
    });

    // Extract base64 image data
    const base64Image =
      response.choices?.[0]?.message?.content?.[0]?.image?.b64_json;

    if (!base64Image) throw new Error("No image returned from GPT-4o");

    // Convert base64 to a data URL for browser display
    const imageUrl = `data:image/png;base64,${base64Image}`;

    // Send prompt and generated image back to frontend
    res.json({ prompt, imageUrl });
  } catch (err) {
    console.error("Error generating image:", err);
    res
      .status(500)
      .json({ error: "Image generation failed", details: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
