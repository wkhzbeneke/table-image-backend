// server.js — BACKEND
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { OpenAI } = require('openai');

require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const PORT = process.env.PORT || 3000;

// Simple image prompt generator — customize if needed
function generateImagePrompt(data) {
  const {
    shape,
    woodType,
    riverStyle,
    length,
    width,
    diameter,
    resinColor1,
    resinColor2,
    resinColor3,
    base,
    finish,
  } = data;

  return `A custom epoxy resin river table. Shape: ${shape}. Wood type: ${woodType}. River style: ${riverStyle}. Dimensions: ${length || ''}L x ${width || ''}W x ${diameter || ''}D inches. Resin colors: ${resinColor1}, ${resinColor2}, ${resinColor3}. Base: ${base}. Finish: ${finish}.`;
}

app.post('/generate', async (req, res) => {
  try {
    const prompt = generateImagePrompt(req.body);

    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt,
      n: 1,
      size: '1024x1024',
    });

    const imageUrl = response.data[0].url;
    res.json({ imageUrl });
  } catch (error) {
    console.error('Error generating image:', error);
    res.status(500).json({ error: 'Image generation failed.' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
