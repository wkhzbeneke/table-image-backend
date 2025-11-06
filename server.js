// server.js — Express backend to handle image generation via OpenAI

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { generateImagePrompt } = require('./builder');
const { OpenAI } = require('openai');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post('/generate', async (req, res) => {
  try {
    const prompt = generateImagePrompt(req.body);
    console.log('Generated Prompt:\n', prompt);

    // Use DALL·E image generation endpoint
    const response = await openai.images.generate({
      prompt,
      model: 'dall-e-3', // or dall-e-2 if using that version
      n: 1,
      size: '1024x1024'
    });

    const imageUrl = response.data[0]?.url;

    if (!imageUrl) {
      throw new Error('No image URL returned by OpenAI.');
    }

    res.json({ imageUrl, prompt });
  } catch (err) {
    console.error('Image generation error:', err);
    res.status(500).json({ error: 'Image generation failed.', details: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
