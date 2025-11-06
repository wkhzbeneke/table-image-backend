// server.js — Express backend to handle image generation
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { generateImagePrompt } = require('./builder');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const { OpenAI } = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post('/generate', async (req, res) => {
  try {
    const prompt = generateImagePrompt(req.body);

    const dalleResponse = await openai.images.generate({
      prompt,
      n: 1,
      size: '1024x1024',
      model: 'dall-e-3',
    });

    const imageUrl = dalleResponse.data[0]?.url;
    if (!imageUrl) throw new Error('No image returned.');

    res.json({ imageUrl });
  } catch (err) {
    console.error('Image generation error:', err.message);
    res.status(500).json({ error: 'Image generation failed.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
