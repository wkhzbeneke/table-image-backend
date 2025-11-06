// builder.js — DALL·E prompt generator for realistic river tables

const colorMap = {
  BYU1: '#002E5D', BYU2: '#0062B8',
  Kansas1: '#0051BA', Kansas2: '#E8000D',
  Baylor1: '#154734', Baylor2: '#FFB81C',
  TCU1: '#4D1979', TCU2: '#A3A9AC',
  'Kansas State1': '#512888', 'Kansas State2': '#D1D1D1',
  'Arizona State1': '#8C1D40', 'Arizona State2': '#FFC627',
  'Iowa State1': '#C8102E', 'Iowa State2': '#F1BE48',
  Houston1: '#C8102E', Houston2: '#76232F',
  'Texas Tech1': '#CC0000', 'Texas Tech2': '#000000',
  Utah1: '#CC0000', Utah2: '#808080',
  Arizona1: '#CC0033', Arizona2: '#003366',
  Colorado1: '#CFB87C', Colorado2: '#000000',
  Cincinnati1: '#E00122', Cincinnati2: '#000000',
  OSU1: '#FF7300', OSU2: '#000000',
  'Central Florida1': '#FFC904', 'Central Florida2': '#BA9B37'
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

  const sizeDescription = shape === 'Circle'
    ? `${diameter}-inch round table`
    : `${length}x${width} inch rectangular table`;

  const resinColors = [resin1, resin2, resin3]
    .filter(Boolean)
    .map(getColorDescription)
    .join(', ');

  return `
    A photorealistic handcrafted ${shape.toLowerCase()} river table design featuring two outer planks of rich ${wood} wood with a natural live edge and detailed wood grain. The center resin river flows between the wood slabs in a traditional river table layout, displaying natural fluid patterns with ${resinColors} blended together in swirling, organic motion. The table has a ${finish.toLowerCase()} finish and a ${base.toLowerCase()} base (not pedestal style). Studio lighting enhances the textures of the wood and the transparent, glossy resin. Captured from a top-down or slight angle view to showcase the full tabletop design without any room background or legs.
    Dimensions: ${sizeDescription}.
  `.trim();
}

module.exports = { generateImagePrompt };
