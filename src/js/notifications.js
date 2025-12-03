/**
 * Muestra una notificación visual en la esquina superior derecha de la pantalla.
 *
 * @param {string} message - El mensaje que se mostrará en la notificación.
 * @param {string} type - El tipo de notificación (success, error, warning, info).
 */

function showNotifi(message, type = "success") {
  let notifiContainer = document.getElementById("notifi-container");

  if (!notifiContainer) {
    notifiContainer = document.createElement("div");
    notifiContainer.id = "notifi-container";
    document.body.appendChild(notifiContainer);
  }

  const notifi = document.createElement("div");
  notifi.className = `notifi notifi-${type}`;
  notifi.textContent = message;

  notifiContainer.appendChild(notifi);

  setTimeout(() => {
    notifi.classList.add("show");
  }, 10);

  setTimeout(() => {
    notifi.classList.remove("show");

    setTimeout(() => {
      if (notifiContainer.contains(notifi)) {
        notifiContainer.removeChild(notifi);
      }
    }, 300);
  }, 3000);
}
