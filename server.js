
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// OpenAI configuration
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY, // Make sure this key is set in your Render environment variables
});
const openai = new OpenAIApi(configuration);

// Route
app.post('/generate-image', async (req, res) => {
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

  try {
    // Safely handle undefined values
    const safeShape = shape || 'rectangle';
    const safeWood = wood || 'walnut';
    const safeRiverStyle = riverStyle || 'inside';
    const safeSize = size || '48x24';
    const safeResin1 = resin1 || 'blue';
    const safeResin2 = resin2 || 'none';
    const safeResin3 = resin3 || 'none';
    const safeFinish = finish || 'matte';

    const prompt = \`Top-down view of a \${safeShape.toLowerCase()} live edge \${safeWood} table, about \${safeSize} inches, with a \${safeRiverStyle} resin river in \${safeResin1}, \${safeResin2}, and \${safeResin3}. \${safeFinish} finish. Studio lighting. Detailed wood texture.\`;

    const aiResponse = await openai.createImage({
      prompt,
      n: 1,
      size: "1024x1024",
    });

    res.json({ imageUrl: aiResponse.data.data[0].url });
  } catch (error) {
    console.error('Error generating image:', error.message);
    res.status(500).json({ error: 'Image generation failed. Please try again later.' });
  }
});

// Start server
app.listen(port, () => {
  console.log(\`Server running on http://localhost:\${port}\`);
});
