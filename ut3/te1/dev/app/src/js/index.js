// Función para manejar el envío del formulario
function handleFormSubmit(event) {
    event.preventDefault();

    const dh = dw = document.getElementById("size").value;

    if (dh > 1) {
        processImages(dh);
    } else {
        alert("The image size must be greater than 1px");
    }
}

// Función para procesar y mostrar las imágenes
function processImages(dh) {
    const table = document.getElementById('imageList');
    table.innerHTML = '';

    const bh = bw = document.getElementById("border-width").value;
    const bc = document.getElementById("border-color").value.slice(1, 7);
    const sharpen = document.getElementById("image-focus").value;
    const blur = document.getElementById("image-blur").value;

    console.log("Size: " + dh);
    console.log("Border Width: " + bw);
    console.log("Border Color: " + bc);
    console.log("Image Focus: " + sharpen);
    console.log("Image Blur: " + blur);

    const numImages = 20;
    const URL_base = "http://10.109.7.20:90/img/";

    for (let i = 1; i <= numImages; i++) {
        const numberWithZero = i.toString().padStart(2, '0');
        const imageURL = `${URL_base}image${numberWithZero}.jpg?dw=${dh}&dh=${dh}&bw=${bw}&bh=${bh}&bc=${bc}&sharpen=${sharpen}&blur=${blur}`;
        const listItem = document.createElement("li");
        const image = document.createElement("img");
        image.src = imageURL;
        listItem.appendChild(image);
        imageList.appendChild(listItem);
    }
}

// Agregar el event listener al formulario
document.getElementById("data").addEventListener("submit", handleFormSubmit);
