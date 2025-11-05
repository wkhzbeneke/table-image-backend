// builder.js (Backend: generates descriptive prompts for DALL·E)

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
  return hex ? `${code} resin (color: ${hex})` : code;
}

function generateImagePrompt(data) {
  const {
    shape, wood, river, length, width, diameter,
    resin1, resin2, resin3, base, finish
  } = data;

  let sizeDescription = '';
  if (shape === 'Circle') {
    sizeDescription = `${diameter}-inch diameter`;
  } else {
    sizeDescription = `${length}x${width} inches`;
  }

  const resinDescriptions = [resin1, resin2, resin3]
    .filter(Boolean)
    .map(getColorDescription)
    .join(', ');

  return `
    A high-resolution product photograph of a handmade ${shape.toLowerCase()} river table, 
    crafted from polished ${wood} wood with a ${river.toLowerCase()} style river. 
    The river is filled with ${resinDescriptions}. 
    The table features a ${base.toLowerCase()} base and a ${finish.toLowerCase()} finish. 
    Dimensions: ${sizeDescription}. 
    The scene is set on a solid black background with soft studio lighting. 
    Realistic wood grain, transparent and glossy resin, detailed texture, centered composition.
  `.trim();
}

module.exports = { generateImagePrompt };
