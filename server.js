// server.js (Backend)
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { generateImagePrompt } = require('./builder');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/generate', async (req, res) => {
  try {
    const prompt = generateImagePrompt(req.body);
    res.json({ imageUrl: `https://dummyimage.com/600x400/000/fff&text=${encodeURIComponent(prompt)}` });
  } catch (error) {
    res.status(500).json({ error: 'Image generation failed.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
