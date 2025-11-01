
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

// Hex-to-color name map
const hexToColorName = {
  '#002855': 'navy blue',
  '#002E5D': 'deep blue',
  '#0051BA': 'royal blue',
  '#154734': 'forest green',
  '#4D1979': 'deep purple',
  '#512888': 'indigo',
  '#8C1D40': 'maroon',
  '#C8102E': 'bright red',
  '#CC0000': 'red',
  '#CC0033': 'crimson',
  '#CFB87C': 'champagne gold',
  '#E00122': 'scarlet',
  '#FF7300': 'orange',
  '#FFC904': 'golden yellow',
  '#EAAA00': 'mustard yellow',
  '#0062B8': 'sky blue',
  '#E8000D': 'vivid red',
  '#FFB81C': 'sunshine yellow',
  '#A3A9AC': 'light gray',
  '#D1D1D1': 'silver',
  '#FFC627': 'amber',
  '#F1BE48': 'yellow gold',
  '#76232F': 'dark crimson',
  '#000000': 'black',
  '#808080': 'gray',
  '#003366': 'midnight blue',
  '#BA9B37': 'metallic gold'
};

// Sample resin name to hex lookup
const allResins = {
  'West Virginia 1': '#002855',
  'BYU1': '#002E5D',
  'Kansas1': '#0051BA',
  'Baylor1': '#154734',
  'TCU1': '#4D1979',
  'Kansas State1': '#512888',
  'Arizona State1': '#8C1D40',
  'Iowa State1': '#C8102E',
  'Houston1': '#C8102E',
  'Texas Tech1': '#CC0000',
  'Utah1': '#CC0000',
  'Arizona1': '#CC0033',
  'Colorado1': '#CFB87C',
  'Cincinnati1': '#E00122',
  'OSU1': '#FF7300',
  'Central Florida1': '#FFC904',
  'West Virginia 2': '#EAAA00',
  'BYU2': '#0062B8',
  'Kansas2': '#E8000D',
  'Baylor2': '#FFB81C',
  'TCU2': '#A3A9AC',
  'Kansas State2': '#D1D1D1',
  'Arizona State2': '#FFC627',
  'Iowa State2': '#F1BE48',
  'Houston2': '#76232F',
  'Texas Tech2': '#000000',
  'Utah2': '#808080',
  'Arizona2': '#003366',
  'Colorado2': '#000000',
  'Cincinnati2': '#000000',
  'OSU2': '#000000',
  'Central Florida2': '#BA9B37'
};

// Convert resin name to color name
function getColorName(resinName) {
  const hex = allResins[resinName] || '';
  return hexToColorName[hex] || resinName;
}

app.post('/generate-image', async (req, res) => {
  try {
    const {
      shape,
      wood,
      river,
      size,
      resin1,
      resin2,
      resin3,
      finish
    } = req.body;

    const color1 = getColorName(resin1);
    const color2 = getColorName(resin2);
    const color3 = getColorName(resin3);

    const prompt = `Top-down view of a ${shape} ${wood} table with ${river} resin river design, size ${size}, featuring resin colors: ${color1}, ${color2}, ${color3}. Finished in ${finish}. Studio lighting. Professional woodcraft photography style.`;

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
