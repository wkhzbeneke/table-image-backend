// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { generateImagePrompt } = require('./builder');
const { OpenAI } = require('openai');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/generate', async (req, res) => {
  try {
    const prompt = generateImagePrompt(req.body);

    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt,
      size: '1024x1024',
      quality: 'standard',
      n: 1,
    });

    const imageUrl = response.data[0].url;
    res.json({ imageUrl });

  } catch (err) {
    console.error('Image generation error:', err.message);
    res.status(500).json({ error: 'Image generation failed.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
