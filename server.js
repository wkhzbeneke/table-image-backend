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

    const imageResponse = await openai.images.generate({
      model: selectedModel,
      prompt,
      size: "1024x1024",
      quality: "high",
      response_format: "url" // this works for DALL·E but we’ll handle b64 too
    });

    // ✅ Handle both DALL·E (URL) and GPT-Image (base64) responses
    let imageUrl;

    if (imageResponse.data?.[0]?.url) {
      // DALL·E or GPT image with URL
      imageUrl = imageResponse.data[0].url;
    } else if (imageResponse.data?.[0]?.b64_json) {
      // GPT-Image-1 returns base64-encoded image data
      imageUrl = `data:image/png;base64,${imageResponse.data[0].b64_json}`;
    }

    if (!imageUrl) {
      console.error("❌ No image returned from API:", imageResponse);
      throw new Error("No image returned from API");
    }

    res.json({ prompt, imageUrl });

  } catch (err) {
    console.error("❌ Image generation failed:", err);
    res.status(500).json({ error: "Image generation failed", details: err.message });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
