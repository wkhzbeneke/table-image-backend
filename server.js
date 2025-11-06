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

// ---- Image generation endpoint ----
app.post('/generate', async (req, res) => {
  try {
    // Generate the descriptive prompt
    const prompt = generateImagePrompt(req.body);
    console.log('🧠 Prompt sent to DALL·E:', prompt);

    // Generate the image with DALL·E 3
    const dalleResponse = await openai.images.generate({
      model: 'dall-e-3',
      prompt,
      n: 1,
      size: '1024x1024',
      style: 'vivid',
      response_format: 'url'
    });

    // Get the image URL from the API response
    const imageUrl = dalleResponse.data[0]?.url;
    if (!imageUrl) throw new Error('No image URL returned');

    console.log('✅ Image URL:', imageUrl);
    res.json({ imageUrl });
  } catch (err) {
    console.error('❌ Image generation error:', err.message);
    res.status(500).json({ error: 'Image generation failed.' });
  }
});

// ---- Start the server ----
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
