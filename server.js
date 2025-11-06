// server.js — Express backend to handle image generation via DALL·E API

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

// Image generation endpoint
app.post('/generate', async (req, res) => {
  try {
    const prompt = generateImagePrompt(req.body);
    console.log('✅ Generated Prompt:', prompt);

    // Call DALL·E 3 image generation endpoint
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: prompt,
      n: 1,
      size: '1024x1024',
      quality: 'standard',
      response_format: 'url'
    });

    const imageUrl = response.data?.[0]?.url;
    if (!imageUrl) {
      throw new Error('No image URL returned from DALL·E');
    }

    res.json({ imageUrl, prompt }); // Send back image and prompt (for debugging/display)
  } catch (err) {
    console.error('❌ Image generation error:', err.message);
    res.status(500).json({ error: 'Image generation failed.' });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
