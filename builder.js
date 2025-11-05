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
    A photorealistic product image of a handmade ${shape.toLowerCase()} river table, 
    made from polished ${wood} wood with a ${river.toLowerCase()} epoxy river channel 
    filled with translucent resin in shades of ${resinColors}. 
    The epoxy river has a smooth, fluid pattern with subtle marbling or swirls, 
    but no objects or landscapes inside. 
    The table features a ${base.toLowerCase()} base and a ${finish.toLowerCase()} finish. 
    Dimensions: ${sizeDescription}. 
    The scene is isolated on a solid black background with soft, diffused studio lighting. 
    The image should show accurate wood texture, glossy resin shine, and clean craftsmanship. 
    Product photography style, centered view, no props or decorative elements.
  `.trim();
}
