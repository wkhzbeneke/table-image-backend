// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fetch = require('node-fetch');
const { generateImagePrompt } = require('./builder');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const STABILITY_API_KEY = process.env.STABILITY_API_KEY;

app.post('/generate', async (req, res) => {
  try {
    const prompt = generateImagePrompt(req.body);

    const response = await fetch('https://api.stability.ai/v2beta/stable-image/generate/core', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${STABILITY_API_KEY}`,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        prompt,
        output_format: 'png',
        model: 'sd3', // or "stable-diffusion-xl-beta"
        aspect_ratio: '1:1'
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Stability API Error:', errText);
      return res.status(500).json({ error: 'Stability API failed' });
    }

    const buffer = await response.arrayBuffer();
    const base64Image = Buffer.from(buffer).toString('base64');
    const imageUrl = `data:image/png;base64,${base64Image}`;

    res.json({ imageUrl });
  } catch (err) {
    console.error('Image generation failed:', err.message);
    res.status(500).json({ error: 'Image generation failed' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
