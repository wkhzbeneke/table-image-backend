
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');

const app = express();
const port = process.env.PORT || 3000;

require('dotenv').config();

app.use(cors());
app.use(bodyParser.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post('/generate-image', async (req, res) => {
  const { shape, wood, riverStyle, size, resin1, resin2, resin3, finish } = req.body;

  if (!shape || !wood || !size || !resin1 || !finish || !riverStyle) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  const safeShape = String(shape);
  const safeWood = String(wood);
  const safeRiverStyle = String(riverStyle);
  const safeSize = String(size);
  const safeResin1 = String(resin1);
  const safeResin2 = resin2 ? String(resin2) : '';
  const safeResin3 = resin3 ? String(resin3) : '';
  const safeFinish = String(finish);

  const prompt = `Top-down view of a ${safeShape.toLowerCase()} live edge ${safeWood} table, about ${safeSize} inches, with a ${safeRiverStyle} resin river in ${safeResin1}, ${safeResin2}, ${safeResin3}. ${safeFinish} finish. Studio lighting. Detailed wood texture.`;

  try {
    const response = await openai.createImage({
      prompt: prompt,
      n: 1,
      size: '1024x1024',
    });

    const imageUrl = response.data.data[0].url;
    res.json({ imageUrl });
  } catch (error) {
    console.error('OpenAI API error:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Failed to generate image' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
