// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fetch = require('node-fetch'); // Required for Stability AI API calls
const { generateImagePrompt } = require('./builder');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Load Stability API key from environment
const STABILITY_API_KEY = process.env.STABILITY_API_KEY || 'YOUR-STABILITY-KEY-HERE';

// /generate route using Stability AI
app.post('/generate', async (req, res) => {
  const prompt = generateImagePrompt(req.body);

  try {
    const response = await fetch('https://api.stability.ai/v2beta/stable-image/generate/core', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STABILITY_API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        prompt,
        output_format: 'png',
        aspect_ratio: '16:9',
        model: 'sd3' // You can change to 'sdxl' if preferred
      })
    });

    const result = await response.json();

    if (result && result.image) {
      // Return the base64 image string
      res.json({ imageUrl: `data:image/png;base64,${result.image}` });
    } else {
      console.error('Image generation failed:', result);
      res.status(500).json({ error: 'Image generation failed.' });
    }
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
