let currentIndex = 0;
let itemsPerView = 5;

function generateRandomIds(count, max) {
  const ids = new Set();
  while (ids.size < count) {
    ids.add(Math.floor(Math.random() * max) + 1);
  }
  return Array.from(ids);
}

async function loadRandomImages() {
  const randomIds = generateRandomIds(20, 826);

  try {
    const response = await fetch(
      `https://rickandmortyapi.com/api/character/${randomIds.join(",")}`
    );
    const characters = await response.json();

    const charactersArray = Array.isArray(characters)
      ? characters
      : [characters];

    updateCarouselWithCharacters(charactersArray);
  } catch (error) {
    console.error("Error cargando personajes aleatorios:", error);
    loadPageOne();
  }
}

/**
 * Carga la primera página de personajes como respaldo
 */
async function loadPageOne() {
  const res = await fetch("https://rickandmortyapi.com/api/character?page=1");
  const data = await res.json();

  updateCarouselWithCharacters(data.results);
}

/**
 * Actualiza el carrusel con una lista de personajes
 * @param {Array} characters - Lista de personajes a mostrar
 */
function updateCarouselWithCharacters(characters) {
  const carouselInner = document.getElementById("carouselInner");

  carouselInner.innerHTML = characters
    .map(
      (char) => `
        <div class="image-option carousel-item" data-image="${char.image}">
            <img src="${char.image}" alt="${char.name}">
            <p>${char.name}</p>
        </div>`
    )
    .join("");

  document.querySelectorAll(".carousel-item").forEach((item) => {
    item.addEventListener("click", function () {
      const imageUrl = this.getAttribute("data-image");
      selectImage(imageUrl, this);
    });
  });

  document.querySelectorAll(".carousel-item").forEach((item) => {
    item.classList.remove("selected");
  });

  const selectedImageInput = document.getElementById("selectedImage");
  if (selectedImageInput) {
    selectedImageInput.value = "";
  }

  currentIndex = 0;

  updateCarousel();
}

/**
 * Crea la estructura HTML del carrusel
 */
function createCarouselStructure() {
  const container = document.getElementById("imageGrid");
  container.classList.add("carousel-container");

  container.innerHTML = `
    <div class="carousel">
      <button class="carousel-btn prev" id="prevBtn">‹</button>
      <div class="carousel-inner" id="carouselInner"></div>
      <button class="carousel-btn next" id="nextBtn">›</button>
    </div>
  `;

  document.getElementById("prevBtn").addEventListener("click", prevSlide);
  document.getElementById("nextBtn").addEventListener("click", nextSlide);
}

/**
 * Configura el texto de ayuda con el botón de imágenes aleatorias
 */
function setupHintWithButton() {
  const hintParagraph = document.querySelector(".form-hint");
  if (!hintParagraph) return;

  const hintContainer = document.createElement("div");
  hintContainer.className = "form-hint-container";
  hintContainer.style.display = "flex";
  hintContainer.style.justifyContent = "space-between";
  hintContainer.style.alignItems = "center";
  hintContainer.style.marginTop = "1rem";

  const randomButton = document.createElement("button");
  randomButton.id = "randomImagesBtn";
  randomButton.className = "random-btn";
  randomButton.innerHTML = `
    <svg class="btn-icon" viewBox="0 0 24 24" style="width: 16px; height: 16px; margin-right: 5px;">
      <path d="M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26L6.7 14.8c-.45-.83-.7-1.79-.7-2.8 0-3.31 2.69-6 6-6zm6.76 1.74L17.3 9.2c.44.84.7 1.79.7 2.8 0 3.31-2.69 6-6 6v-3l-4 4 4 4v-3c4.42 0 8-3.58 8-8 0-1.57-.46-3.03-1.24-4.26z"/>
    </svg>
    Cargar imágenes aleatorias
  `;

  randomButton.addEventListener("click", loadRandomImages);

  const hintText = document.createElement("span");
  hintText.textContent =
    "Haz clic en una imagen para seleccionarla (se mantendrá resaltada)";

  hintContainer.appendChild(hintText);
  hintContainer.appendChild(randomButton);

  hintParagraph.parentNode.replaceChild(hintContainer, hintParagraph);
}

/**
 * Inicializa el carrusel completo
 */
function initializeCarousel() {
  createCarouselStructure();
  setupHintWithButton();
  loadRandomImages();
}

/**
 * Actualiza la posición del carrusel según el índice actual
 */
function updateCarousel() {
  const carouselInner = document.getElementById("carouselInner");
  const items = document.querySelectorAll(".carousel-item");

  if (items.length === 0) return;

  const itemWidth = items[0].offsetWidth + 25;
  const translateX = -currentIndex * (itemWidth * itemsPerView);
  carouselInner.style.transform = `translateX(${translateX}px)`;

  const totalItems = items.length;
  const totalGroups = Math.ceil(totalItems / itemsPerView);
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  prevBtn.disabled = currentIndex === 0;
  nextBtn.disabled = currentIndex >= totalGroups - 1;

  if (prevBtn.disabled) {
    prevBtn.style.opacity = "0.3";
    prevBtn.style.cursor = "not-allowed";
  } else {
    prevBtn.style.opacity = "1";
    prevBtn.style.cursor = "pointer";
  }

  if (nextBtn.disabled) {
    nextBtn.style.opacity = "0.3";
    nextBtn.style.cursor = "not-allowed";
  } else {
    nextBtn.style.opacity = "1";
    nextBtn.style.cursor = "pointer";
  }
}

function prevSlide() {
  if (currentIndex > 0) {
    currentIndex--;
    updateCarousel();
  }
}

function nextSlide() {
  const items = document.querySelectorAll(".carousel-item");
  const totalItems = items.length;
  const totalGroups = Math.ceil(totalItems / itemsPerView);

  if (currentIndex < totalGroups - 1) {
    currentIndex++;
    updateCarousel();
  }
}

window.selectImage = function (imageUrl, element) {
  document.querySelectorAll(".carousel-item").forEach((item) => {
    item.classList.remove("selected");
  });

  element.classList.add("selected");

  let selectedImageInput = document.getElementById("selectedImage");
  if (!selectedImageInput) {
    selectedImageInput = document.createElement("input");
    selectedImageInput.type = "hidden";
    selectedImageInput.id = "selectedImage";
    selectedImageInput.name = "selectedImage";
    document
      .getElementById("imageGrid")
      .parentNode.appendChild(selectedImageInput);
  }
  selectedImageInput.value = imageUrl;
};

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("characterForm");
  if (form) {
    form.addEventListener("reset", function () {
      document.querySelectorAll(".carousel-item").forEach((item) => {
        item.classList.remove("selected");
      });

      const selectedImageInput = document.getElementById("selectedImage");
      if (selectedImageInput) {
        selectedImageInput.value = "";
      }
    });
  }

  initializeCarousel();
});
/**
 * Actualiza el carrusel cuando cambia el tamaño de la ventana.
 * Se usa un pequeño retraso para evitar múltiples llamadas durante el redimensionamiento.
 */
window.addEventListener("resize", () => {
  setTimeout(updateCarousel, 100);
});

/**
 * Maneja la inicialización de la aplicación y el envío del formulario.
 * - Configura el carrusel y el formulario al cargar el DOM.
 * - Procesa el envío del formulario para crear un nuevo personaje.
 */
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("characterForm");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(form);
    const character = Object.fromEntries(formData.entries());

    const selectedImageInput = document.getElementById("selectedImage");
    if (selectedImageInput && selectedImageInput.value) {
      character.image = selectedImageInput.value;
    }

    let characters = JSON.parse(localStorage.getItem("characters")) || [];

    character.id = Date.now();

    characters.push(character);

    localStorage.setItem("characters", JSON.stringify(characters));

    showNotifi("¡Personaje creado exitosamente!", "success");

    form.reset();
  });
});
