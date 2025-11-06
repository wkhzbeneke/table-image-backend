// server.js — Improved: uses refined prompt directly for better DALL·E 3 results

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { generateImagePrompt } from './builder.js';
import OpenAI from 'openai';

const app = express();
app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post('/generate', async (req, res) => {
  try {
    const refinedPrompt = generateImagePrompt(req.body);
    console.log('🖼️ Prompt sent to DALL·E 3:\n', refinedPrompt);

    const imageResponse = await openai.images.generate({
      model: 'dall-e-3',
      prompt: refinedPrompt,
      n: 1,
      size: '1024x1024',
      style: 'vivid' // optional: try "natural" if too surreal
    });

    const imageUrl = imageResponse.data?.[0]?.url;
    if (!imageUrl) throw new Error('No image URL returned');

    res.json({ imageUrl, prompt: refinedPrompt });
  } catch (err) {
    console.error('🔥 Error generating image:', err);
    res.status(500).json({ error: 'Image generation failed.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
