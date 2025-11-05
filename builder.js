function formatResinColor(resin) {
  if (!resin || !resin.name) return null;
  const cleanName = resin.name.replace(/[0-9]/g, '').trim();
  return resin.hex
    ? `${cleanName} (${resin.hex})`
    : cleanName;
}

function generateImagePrompt(data) {
  const {
    shape, wood, river, length, width, diameter,
    resin1, resin2, resin3, base, finish
  } = data;

  const sizeDescription = shape === 'Circle'
    ? `${diameter}-inch diameter`
    : `${length}x${width} inches`;

  const resinColors = [formatResinColor(resin1), formatResinColor(resin2), formatResinColor(resin3)]
    .filter(Boolean)
    .join(', ');

  return `A modern ${shape.toLowerCase()} river table made from live edge ${wood} wood with a ${river.toLowerCase()} channel filled with epoxy resin in ${resinColors}. The table has a ${base.toLowerCase()} base and a ${finish.toLowerCase()} finish. Size: ${sizeDescription}. Smooth, clean epoxy — no water texture or landscape features. Centered product photography on a solid black background with soft, even lighting. The table should look handcrafted, premium, and realistic.`;
}

module.exports = { generateImagePrompt };
