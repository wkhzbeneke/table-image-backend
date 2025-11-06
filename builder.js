// builder.js — Builds descriptive prompts for image generation

export function generateImagePrompt(data) {
  const {
    shape, wood, river, length, width, diameter,
    resin1, resin2, resin3, base, finish
  } = data;

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

  const getColorDescription = (code) => {
    if (!code || code === 'None') return '';
    const hex = colorMap[code];
    return hex ? `${code} (resin color ${hex})` : code;
  };

  const resinColors = [resin1, resin2, resin3]
    .filter(color => color && color !== 'None')
    .map(getColorDescription)
    .join(' and ');

  const sizeText = shape === 'Circle'
    ? `${diameter}-inch round table`
    : `${length}×${width} inch rectangular table`;

  return `
A photorealistic image of a handcrafted ${sizeText} river table made from two live‑edge ${wood} wood slabs with visible knots, swirling grain patterns, and natural edge imperfections. 
Between the slabs flows a central resin river in an organic, fluid shape with ${resinColors}, blending together naturally to mimic hand‑poured epoxy work. 
The resin appears rich and semi‑translucent, catching light with subtle depth. 
The table rests on a modern flat ${base.toLowerCase()} base — not a pedestal — and features a smooth, ${finish.toLowerCase()} finish. 
The scene is lit with soft, diffused natural light in a clean, neutral setting, and viewed from a slightly elevated front angle to showcase the wood texture and resin flow. 
No text or logos — just the table, centered in frame with realistic material details.
`.trim();
}
