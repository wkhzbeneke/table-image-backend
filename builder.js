function generateImagePrompt(data) {
  const {
    shape, wood, river, length, width, diameter,
    resin1, resin2, resin3, base, finish
  } = data;

  const sizeDescription = shape === 'Circle'
    ? `${diameter}-inch diameter`
    : `${length}x${width} inches`;

  const resinColors = [resin1, resin2, resin3].filter(Boolean).join(', ');

  return `A realistic ${shape.toLowerCase()} river table made of ${wood} wood with a ${river.toLowerCase()} epoxy resin river in ${resinColors}. Size: ${sizeDescription}. It has a ${base.toLowerCase()} base and a ${finish.toLowerCase()} finish. Shown on a solid black background with soft lighting. The resin looks smooth and glossy, with no objects or scenery inside. Product photo style.`;
}
