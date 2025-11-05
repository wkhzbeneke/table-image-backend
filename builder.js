// builder.js

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

  const resinColors = [resin1, resin2, resin3].filter(Boolean).join(', ');

  return `
    A high-resolution studio photograph of a handmade ${shape.toLowerCase()} river table, 
    crafted from polished ${wood} wood with a ${river.toLowerCase()} shaped river filled with ${resinColors} resin. 
    The table has a ${base.toLowerCase()} base and a ${finish.toLowerCase()} finish. 
    Dimensions: ${sizeDescription}. 
    Displayed on a solid black background with soft studio lighting. 
    The image should be photorealistic, with accurate wood grain texture, realistic resin transparency and shine, 
    and clear focus. Product photography style, centered composition, no props or background distractions.
  `.trim();
}

module.exports = { generateImagePrompt };
