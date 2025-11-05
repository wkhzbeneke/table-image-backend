const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fetch = require('node-fetch');
const FormData = require('form-data');
const { generateImagePrompt } = require('./builder');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const STABILITY_API_KEY = process.env.STABILITY_API_KEY;

app.post('/generate', async (req, res) => {
  try {
    const prompt = generateImagePrompt(req.body);

    const form = new FormData();
    form.append('prompt', prompt);
    form.append('model', 'sd3'); // ✅ Correct model ID
    form.append('output_format', 'png');
    form.append('aspect_ratio', '1:1');

    const response = await fetch('https://api.stability.ai/v2beta/stable-image/generate/core', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${STABILITY_API_KEY}`,
        Accept: 'application/json',
        ...form.getHeaders(),
      },
      body: form,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Stability API error:', errorText);
      return res.status(500).json({ error: 'Stability API request failed.' });
    }

    const buffer = await response.arrayBuffer();
    const base64Image = Buffer.from(buffer).toString('base64');
    const imageUrl = `data:image/png;base64,${base64Image}`;

    res.json({ imageUrl });
  } catch (error) {
    console.error('Image generation failed:', error.message);
    res.status(500).json({ error: 'Image generation failed.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
