document.getElementById('tableForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const shape = document.getElementById('shape').value;
  const wood = document.getElementById('wood').value;
  const river = document.getElementById('river').value;
  const length = document.getElementById('length').value;
  const width = document.getElementById('width').value;
  const diameter = document.getElementById('diameter').value;
  const resin1 = document.getElementById('resin1').value;
  const resin2 = document.getElementById('resin2').value;
  const resin3 = document.getElementById('resin3').value;
  const base = document.getElementById('base').value;
  const finish = document.getElementById('finish').value;

  const requestData = {
    shape,
    wood,
    river,
    length,
    width,
    diameter,
    resin1,
    resin2,
    resin3,
    base,
    finish
  };

  try {
    const response = await fetch('https://table-image-backend-v2.onrender.com/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    });

    if (!response.ok) {
      throw new Error('Image generation failed');
    }

    const data = await response.json();
    document.getElementById('tableImage').src = data.imageUrl;
  } catch (err) {
    alert(err.message);
    console.error('Error:', err);
  }
});
