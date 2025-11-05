// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { OpenAI } = require('openai');
const { generateImagePrompt } = require('./builder');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/generate', async (req, res) => {
  try {
    const prompt = generateImagePrompt(req.body);
    const response = await openai.images.generate({
      model: "dall-e-3", // "dall-e-2" is faster/cheaper if needed
      prompt,
      n: 1,
      size: "1024x1024"
    });

    const imageUrl = response.data[0].url;
    res.json({ imageUrl });
  } catch (error) {
    console.error("Image generation failed:", error.message);
    res.status(500).json({ error: 'Image generation failed.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
