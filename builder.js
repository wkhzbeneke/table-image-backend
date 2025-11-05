function formatResinColor(resin) {
  if (!resin || !resin.name) return null;
  const cleanName = resin.name.replace(/[0-9]/g, '').trim();
  return resin.hex ? `${cleanName} (${resin.hex})` : cleanName;
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
    .filter(Boolean);

  const resinText = resinColors.length > 1
    ? `a blend of epoxy resin in subtle swirls of ${resinColors.join(', ')}`
    : `epoxy resin in ${resinColors.join(', ')}`;

  return `A modern ${shape.toLowerCase()} river table made from polished ${wood} wood with a ${river.toLowerCase()} channel filled with ${resinText}. The table has a ${base.toLowerCase()} base and a ${finish.toLowerCase()} finish. Size: ${sizeDescription}. The epoxy should appear smooth and glossy, with natural-looking color swirls, not marbled or layered. No fantasy or gemstone effects. Studio product photo on a black background, centered, with soft lighting.`;
}

module.exports = { generateImagePrompt };
