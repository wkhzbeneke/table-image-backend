
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const OpenAI = require('openai');

const app = express();
const port = process.env.PORT || 3000;

require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.use(cors());
app.use(bodyParser.json());

app.post('/generate-image', async (req, res) => {
  try {
    const {
      shape,
      wood,
      riverStyle,
      size,
      resin1,
      resin2,
      resin3,
      finish
    } = req.body;

    const safe = (val) => val || 'None';
    const prompt = `Top-down view of a ${safe(shape).toLowerCase()} live edge ${safe(wood)} table, about ${safe(size)} inches, with a ${safe(riverStyle)} resin river in ${safe(resin1)}, ${safe(resin2)}, ${safe(resin3)}. ${safe(finish)} finish. Studio lighting. Detailed wood texture.`;

    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: prompt,
      n: 1,
      size: '1024x1024'
    });

    res.json({ imageUrl: response.data[0].url });
  } catch (error) {
    console.error('Error generating image:', error);
    res.status(500).json({ error: 'Image generation failed.' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
