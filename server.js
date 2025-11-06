// server.js — Express backend to handle image generation via GPT-4o and DALL·E 3

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
    console.log('🧠 Prompt for GPT-4o:\n', prompt);

    const chatResponse = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are a visual design assistant that generates photorealistic prompt descriptions for high-end furniture.'
        },
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    const imagePrompt = chatResponse.choices?.[0]?.message?.content;
    console.log('🎨 Prompt sent to DALL·E:', imagePrompt);

    const imageResponse = await openai.images.generate({
      model: 'dall-e-3',
      prompt: imagePrompt,
      n: 1,
      size: '1024x1024'
    });

    const imageUrl = imageResponse.data?.[0]?.url;
    if (!imageUrl) throw new Error('Image URL missing from OpenAI response');

    res.json({ imageUrl, prompt: imagePrompt });
  } catch (err) {
    console.error('🔥 Image generation error:', err);
    res.status(500).json({ error: 'Image generation failed.' });
  }
});

// Render requires using process.env.PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
