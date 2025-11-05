// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fetch = require('node-fetch');
const FormData = require('form-data');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const STABILITY_API_KEY = process.env.STABILITY_API_KEY;

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

  let dimensions = '';
  if (shape === 'Circle') {
    dimensions = `diameter of ${diameter} inches`;
  } else {
    dimensions = `length of ${length} inches and width of ${width} inches`;
  }

  return `A custom epoxy river table with a ${shape} shape, made of ${woodType} wood, featuring a ${riverStyle} river style, ${dimensions}, using resin colors ${resinColor1}, ${resinColor2}, and ${resinColor3}. It has a ${base} base and a ${finish} finish. High quality product photo, realistic lighting.`;
}

app.post('/generate', async (req, res) => {
  try {
    const prompt = generateImagePrompt(req.body);

    const form = new FormData();
    form.append('prompt', prompt);
    form.append('model', 'core');
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
      console.error('Stability API Error:', errorText);
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
