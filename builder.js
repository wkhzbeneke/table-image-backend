
async function generateImage() {
  const shape = document.getElementById('shape').value;
  const wood = document.getElementById('wood').value;
  const river = document.getElementById('river').value;
  const length = document.getElementById('length').value;
  const width = document.getElementById('width').value;
  const diameter = document.getElementById('diameter').value;
  const resinColor1 = document.getElementById('color1').value;
  const resinColor2 = document.getElementById('color2').value;
  const resinColor3 = document.getElementById('color3').value;
  const base = document.getElementById('base').value;
  const finish = document.getElementById('finish').value;

  const response = await fetch('https://billbeneke.com/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      shape, wood, river, length, width, diameter,
      resinColor1, resinColor2, resinColor3, base, finish
    })
  });

  if (!response.ok) {
    alert('Image generation failed.');
    return;
  }

  const data = await response.json();
  document.getElementById('generatedImage').src = data.image_url;
}
