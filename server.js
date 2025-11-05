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

    const response = await fetch('https://api.stability.ai/v1/generation/stable-diffusion-v1-5/text-to-image', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${STABILITY_API_KEY}`,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        text_prompts: [{ text: prompt }],
        cfg_scale: 7,
        height: 512,
        width: 512,
        samples: 1,
        steps: 30
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Stability API error:', error);
      return res.status(500).json({ error: 'Stability API request failed.' });
    }

    const result = await response.json();
    const base64Image = result.artifacts[0].base64;
    const imageUrl = `data:image/png;base64,${base64Image}`;
    res.json({ imageUrl });

  } catch (err) {
    console.error('Server error:', err.message);
    res.status(500).json({ error: 'Image generation failed.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
