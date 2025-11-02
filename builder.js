
const resinColors = {
    'Arizona1': '#CC0033', 'Arizona State1': '#8C1D40', 'Baylor1': '#154734', 'BYU1': '#002E5D',
    'Central Florida1': '#FFC904', 'Cincinnati1': '#E00122', 'Colorado1': '#CFB87C', 'Houston1': '#C8102E',
    'Iowa State1': '#C8102E', 'Kansas1': '#0051BA', 'Kansas State1': '#512888', 'OSU1': '#FF7300',
    'TCU1': '#4D1979', 'Texas Tech1': '#CC0000', 'Utah1': '#CC0000',
    'Arizona2': '#003366', 'Arizona State2': '#FFC627', 'Baylor2': '#FFB81C', 'BYU2': '#0062B8',
    'Central Florida2': '#BA9B37', 'Cincinnati2': '#000000', 'Colorado2': '#000000', 'Houston2': '#76232F',
    'Iowa State2': '#F1BE48', 'Kansas State2': '#D1D1D1', 'Kansas2': '#E8000D', 'OSU2': '#000000',
    'TCU2': '#A3A9AC', 'Texas Tech2': '#000000', 'Utah2': '#808080', 'West Virginia 2': '#EAAA00',
    'West Virginia 1': '#002855'
};

function populateDropdown(selectId, filterKey = null) {
    const select = document.getElementById(selectId);
    select.innerHTML = '';
    Object.entries(resinColors).forEach(([name, hex]) => {
        if (!filterKey || name.includes(filterKey)) {
            const option = document.createElement('option');
            option.value = name;
            option.textContent = name;
            select.appendChild(option);
        }
    });
    const noneOption = document.createElement('option');
    noneOption.value = "None";
    noneOption.textContent = "None";
    select.appendChild(noneOption);
}

populateDropdown("resinColor1", "1");
populateDropdown("resinColor2", "2");
populateDropdown("resinColor3");

function generateImage() {
    const data = {
        shape: document.getElementById("shape").value,
        woodType: document.getElementById("woodType").value,
        riverStyle: document.getElementById("riverStyle").value,
        length: document.getElementById("length").value,
        width: document.getElementById("width").value,
        diameter: document.getElementById("diameter").value,
        resinColor1: document.getElementById("resinColor1").value,
        resinColor2: document.getElementById("resinColor2").value,
        resinColor3: document.getElementById("resinColor3").value,
        base: document.getElementById("base").value,
        finish: document.getElementById("finish").value
    };

    fetch("https://table-image-backend.onrender.com/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
    .then(resp => resp.blob())
    .then(blob => {
        const imgUrl = URL.createObjectURL(blob);
        document.getElementById("tableImage").src = imgUrl;
    })
    .catch(() => {
        alert("Image generation failed.");
    });
}
