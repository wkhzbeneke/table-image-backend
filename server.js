// server.js — Express backend to handle image generation via GPT-4o

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
    console.log('Generated Prompt:', prompt);

    // Use GPT-4 Turbo to generate image-friendly prompt, not DALL·E directly
    const chatResponse = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'You are a visual design assistant that outputs image prompts for photorealistic rendering.' },
        { role: 'user', content: prompt }
      ]
    });

    const imagePrompt = chatResponse.choices[0]?.message?.content;
    console.log('Image Prompt Sent to DALL·E:', imagePrompt);

    const imageResponse = await openai.images.generate({
      model: 'dall-e-3',
      prompt: imagePrompt,
      n: 1,
      size: '1024x1024'
    });

    const imageUrl = imageResponse.data[0]?.url;
    if (!imageUrl) {
      throw new Error('Image URL missing from OpenAI response');
    }

    res.json({ imageUrl, prompt });
  } catch (err) {
    console.error('Image generation error:', err);
    res.status(500).json({ error: 'Image generation failed.' });
  }
});

// ✅ CRUCIAL: Use the correct Render port
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
