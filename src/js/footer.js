document.addEventListener("DOMContentLoaded", function () {
  // Botón "Volver arriba"
  const backToTopBtn = document.getElementById("backToTop");

  // Scroll suave al hacer clic
  backToTopBtn.addEventListener("click", function (e) {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
});
