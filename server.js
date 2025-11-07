import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { generateImagePrompt } from "./builder.js";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post("/generate", async (req, res) => {
  try {
    const prompt = generateImagePrompt(req.body);
    const selectedModel = req.body.model || process.env.IMAGE_MODEL || "dall-e-3";

    console.log(`🖼 Using image model: ${selectedModel}`);
    console.log("Prompt:\n", prompt);

    // 👇 request image from OpenAI
    const imageResponse = await openai.images.generate({
      model: selectedModel,
      prompt,
      size: "1024x1024",
      quality: "high"
    });

    // ✅ handle both URL and Base64 responses
    let imageUrl;
    const imgData = imageResponse.data?.[0];

    if (imgData?.url) {
      imageUrl = imgData.url; // typical for DALL·E 3
    } else if (imgData?.b64_json) {
      imageUrl = `data:image/png;base64,${imgData.b64_json}`; // GPT-Image-1
    }

    if (!imageUrl) {
      console.error("❌ No image returned:", imageResponse);
      throw new Error("No image returned from API");
    }

    res.json({ prompt, imageUrl });

  } catch (err) {
    console.error("❌ Image generation failed:", err);
    res.status(500).json({
      error: "Image generation failed",
      details: err.message
    });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
