// builder.js (Backend file for generating image prompts)

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

  return `A custom ${shape} river table made of ${wood} with a ${river} river, size ${sizeDescription}, resin colors ${resin1}, ${resin2}, ${resin3}, ${base} base, and ${finish} finish.`;
}

module.exports = { generateImagePrompt };
