document.addEventListener("DOMContentLoaded", () => {
  const images = [
    "./src/media/wall1.avif",
    "./src/media/wall2.avif",
    "./src/media/wall3.avif",
    "./src/media/wall4.avif",
    "./src/media/wall5.avif",
    "./src/media/wall6.avif",
  ];

  const slidesContainer = document.getElementById("gallerySlides");
  const thumbnailsContainer = document.getElementById("galleryThumbnails");
  const counter = document.getElementById("imageCounter");

  let currentIndex = 0;

  // ==========================
  // 1. Cargar las imágenes
  // ==========================
  images.forEach((src, index) => {
    // Slide principal
    const slide = document.createElement("div");
    slide.classList.add("gallery-slide");
    slide.innerHTML = `<img src="${src}" alt="Wallpaper ${index + 1}">`;
    slidesContainer.appendChild(slide);

    // Thumbnail
    const thumb = document.createElement("div");
    thumb.classList.add("gallery-thumbnail");
    thumb.innerHTML = `<img src="${src}" alt="Thumb ${index + 1}">`;

    thumb.addEventListener("click", () => {
      currentIndex = index;
      updateGallery();
    });

    thumbnailsContainer.appendChild(thumb);
  });

  // ==========================
  // 2. Actualizar carrusel
  // ==========================
  function updateGallery() {
    slidesContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
    counter.textContent = `${currentIndex + 1}/${images.length}`;

    document.querySelectorAll(".gallery-thumbnail").forEach((thumb, index) => {
      thumb.classList.toggle("active", index === currentIndex);
    });
  }

  updateGallery();

  // ==========================
  // 3. Botón siguiente
  // ==========================
  document.getElementById("nextImage").addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % images.length;
    updateGallery();
  });

  // ==========================
  // 4. Botón anterior
  // ==========================
  document.getElementById("prevImage").addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateGallery();
  });
});
