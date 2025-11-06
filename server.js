// server.js — Express backend to generate image and return prompt

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
    const prompt = generateImagePrompt(req.body);
    console.log('Prompt for image generation:\n', prompt);

    const imageResponse = await openai.images.generate({
      model: 'dall-e-3',
      prompt: prompt,
      n: 1,
      size: '1024x1024',
      response_format: 'url'
    });

    const imageUrl = imageResponse.data?.[0]?.url;
    if (!imageUrl) throw new Error('No image returned');

    res.json({ prompt, imageUrl });
  } catch (err) {
    console.error('Error generating image:', err);
    res.status(500).json({ error: 'Image generation failed', details: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
