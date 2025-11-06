// server.js — Express backend to handle image generation via GPT‑4o image model

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { generateImagePrompt } = require('./builder');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Import OpenAI SDK
const { OpenAI } = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post('/generate', async (req, res) => {
  try {
    const prompt = generateImagePrompt(req.body);
    console.log('Generated Prompt:', prompt);

    // Call GPT‑4o image generation model ("gpt-image-1" or whichever your account has)
    const response = await openai.chat.completions.create({
      model: 'gpt-image-1',
      messages: [
        { role: 'system', content: 'You are a highly skilled image generation assistant.' },
        { role: 'user', content: prompt }
      ]
    });

    // Extract image URL from response
    const imageUrl = response.choices?.[0]?.message?.content;
    if (!imageUrl) {
      throw new Error('No image URL returned');
    }

    res.json({ imageUrl });
  } catch (err) {
    console.error('Image generation error:', err);
    res.status(500).json({ error: 'Image generation failed.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
