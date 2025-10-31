const express = require('express');
const { OpenAI } = require('openai');
const cors = require('cors');
require('dotenv').config();

const app = express();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.use(cors());
app.use(express.json());

app.post('/generate-image', async (req, res) => {
  const { shape, size, resin1, resin2, finish } = req.body;

  const prompt = `Top-down view of a ${shape.toLowerCase()} live edge wood table, about ${size} inches across, with a resin river in ${resin1} and ${resin2}. ${finish} finish. Studio lighting. Detailed wood texture.`;

  try {
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt,
      n: 1,
      size: '1024x1024',
    });

    const imageUrl = response.data[0].url;
    res.json({ imageUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Image generation failed.' });
  }
});

app.listen(3000, () => console.log('🟢 Server running on http://localhost:3000'));
