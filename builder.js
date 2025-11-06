// builder.js (Backend: builds descriptive DALL·E prompt for river table)

const colorMap = {
  BYU1: '#002E5D',
  BYU2: '#0062B8',
  Kansas1: '#0051BA',
  Kansas2: '#E8000D',
  Baylor1: '#154734',
  Baylor2: '#FFB81C',
  TCU1: '#4D1979',
  TCU2: '#A3A9AC',
  'Kansas State1': '#512888',
  'Kansas State2': '#D1D1D1',
  'Arizona State1': '#8C1D40',
  'Arizona State2': '#FFC627',
  'Iowa State1': '#C8102E',
  'Iowa State2': '#F1BE48',
  Houston1: '#C8102E',
  Houston2: '#76232F',
  'Texas Tech1': '#CC0000',
  'Texas Tech2': '#000000',
  Utah1: '#CC0000',
  Utah2: '#808080',
  Arizona1: '#CC0033',
  Arizona2: '#003366',
  Colorado1: '#CFB87C',
  Colorado2: '#000000',
  Cincinnati1: '#E00122',
  Cincinnati2: '#000000',
  OSU1: '#FF7300',
  OSU2: '#000000',
  'Central Florida1': '#FFC904',
  'Central Florida2': '#BA9B37',
};

function getColorDescription(code) {
  if (!code) return '';
  const hex = colorMap[code];
  return hex ? `${code} (color: ${hex})` : code;
}

function generateImagePrompt(data) {
  const {
    shape, wood, river, length, width, diameter,
    resin1, resin2, resin3, base, finish
  } = data;

  const sizeDescription =
    shape === 'Circle'
      ? `${diameter}-inch diameter`
      : `${length}x${width} inches`;

  const resinColors = [resin1, resin2, resin3]
    .filter(Boolean)
    .map(getColorDescription)
    .join(', ');

  const prompt = `
    A photorealistic image of a handcrafted ${shape.toLowerCase()} river table featuring a classic three-part composition: two outer planks of ${wood.toLowerCase()} wood flanking a central epoxy resin river. The ${wood.toLowerCase()} shows rich, natural grain with visible knots and polished texture. The resin river blends ${resinColors} in flowing, organic motion, with natural transitions and marbling patterns. The resin appears translucent and glossy with depth and movement. The base of the table is made of ${base.toLowerCase()} and the surface has a ${finish.toLowerCase()} finish. Dimensions: ${sizeDescription}. Captured from a slight angle view with soft studio lighting on a clean black background, showing detailed texture, realistic materials, and high-end craftsmanship.
  `.trim();

  return prompt;
}

module.exports = { generateImagePrompt };
