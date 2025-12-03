document.addEventListener("DOMContentLoaded", () => {
  const charactersTableBody = document.getElementById("charactersTableBody");
  const noResults = document.getElementById("noResults");
  const tableView = document.getElementById("tableView");

  const totalCharactersEl = document.getElementById("totalCharacters");
  const aliveCountEl = document.getElementById("aliveCount");
  const deadCountEl = document.getElementById("deadCount");
  const unknownCountEl = document.getElementById("unknownCount");

  const currentCountEl = document.getElementById("currentCount");
  const totalCountEl = document.getElementById("totalCount");

  function loadCharacters() {
    const charactersData = localStorage.getItem("characters");
    let characters = [];

    if (charactersData) {
      try {
        characters = JSON.parse(charactersData);
      } catch (error) {
        console.error("Error al parsear los datos de localStorage:", error);
        showNoResults();
        return;
      }
    }

    updateStats(characters);

    const totalChars = characters.length;
    totalCountEl.textContent = totalChars;
    currentCountEl.textContent = totalChars;

    if (characters.length === 0) {
      showNoResults();
    } else {
      hideNoResults();
      renderTable(characters);
    }
  }

  function showNoResults() {
    noResults.style.display = "flex";
    tableView.style.display = "none";
  }

  function hideNoResults() {
    noResults.style.display = "none";
    tableView.style.display = "block";
  }

  function updateStats(characters) {
    const total = characters.length;
    const alive = characters.filter((char) => char.status === "Alive").length;
    const dead = characters.filter((char) => char.status === "Dead").length;
    const unknown = characters.filter(
      (char) => char.status === "unknown"
    ).length;

    totalCharactersEl.textContent = total;
    aliveCountEl.textContent = alive;
    deadCountEl.textContent = dead;
    unknownCountEl.textContent = unknown;
  }

  function renderTable(characters) {
    charactersTableBody.innerHTML = "";

    characters.forEach((char, index) => {
      const row = document.createElement("tr");

      const createdDate = char.created
        ? new Date(char.created).toLocaleDateString()
        : "No especificada";

      const statusClass = `status-${char.status?.toLowerCase() || "unknown"}`;
      const genderClass = `gender-${char.gender?.toLowerCase() || "unknown"}`;

      row.innerHTML = `
        <td>${index + 1}</td>
        <td>
          <div style="display: flex; align-items: center; gap: 10px;">
            <img src="${
              char.image ||
              char.selectedImage ||
              "https://via.placeholder.com/40"
            }" 
                 alt="${char.name}" 
                 style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;">
            <strong>${char.name || "Sin nombre"}</strong>
          </div>
        </td>
        <td>
          <span class="status-badge ${statusClass}">
            ${
              char.status === "Alive"
                ? "Vivo"
                : char.status === "Dead"
                ? "Muerto"
                : "Desconocido"
            }
          </span>
        </td>
        <td>
          <div>
            <div>${char.species || "No especificada"}</div>
            ${
              char.type
                ? `<small style="color: #aaa;">${char.type}</small>`
                : ""
            }
          </div>
        </td>
        <td>
          <span class="gender-badge ${genderClass}">
            ${
              char.gender === "Male"
                ? "Masculino"
                : char.gender === "Female"
                ? "Femenino"
                : char.gender === "Genderless"
                ? "Sin género"
                : "Desconocido"
            }
          </span>
        </td>
        <td>${char.origin || "No especificado"}</td>
        <td>${char.location || "No especificado"}</td>
        <td>${char.episodes || "-"}</td>
        <td>${createdDate}</td>
        <td class="actions-cell">
          <button class="action-btn edit-btn" title="Editar" onclick="editCharacter(${index})">
            <svg viewBox="0 0 24 24">
              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
            </svg>
          </button>
          <button class="action-btn delete-btn" title="Eliminar" onclick="deleteCharacter(${index})">
            <svg viewBox="0 0 24 24">
              <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
            </svg>
          </button>
          <button class="action-btn view-btn-details" title="Ver detalles" onclick="viewCharacterDetails(${index})">
            <svg viewBox="0 0 24 24">
              <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
            </svg>
          </button>
        </td>
      `;

      charactersTableBody.appendChild(row);
    });
  }

  window.editCharacter = function (index) {
    alert(`Editar personaje en índice ${index}`);
  };

  window.deleteCharacter = function (index) {
    if (confirm("¿Estás seguro de que quieres eliminar este personaje?")) {
      const charactersData = localStorage.getItem("characters");
      if (charactersData) {
        const characters = JSON.parse(charactersData);
        characters.splice(index, 1);
        localStorage.setItem("characters", JSON.stringify(characters));
        loadCharacters();
        showNotifi("Personaje eliminado correctamente", "success");
      }
    }
  };

  window.viewCharacterDetails = function (index) {
    const charactersData = localStorage.getItem("characters");
    if (charactersData) {
      const characters = JSON.parse(charactersData);
      const character = characters[index];

      let details = `Nombre: ${character.name || "Sin nombre"}\n`;
      details += `Estado: ${character.status || "Desconocido"}\n`;
      details += `Especie: ${character.species || "No especificada"}\n`;
      if (character.type) details += `Tipo: ${character.type}\n`;
      details += `Género: ${character.gender || "Desconocido"}\n`;
      details += `Origen: ${character.origin || "No especificado"}\n`;
      details += `Ubicación: ${character.location || "No especificado"}\n`;
      if (character.episodes) details += `Episodios: ${character.episodes}\n`;
      if (character.description)
        details += `Descripción: ${character.description}\n`;

      alert(details);
    }
  };

  document.getElementById("tableViewBtn")?.addEventListener("click", () => {
    document.getElementById("tableView").style.display = "block";
    document.getElementById("tableViewBtn").classList.add("active");
  });

  document.getElementById("clearAllFilters")?.addEventListener("click", () => {
    loadCharacters();
  });

  loadCharacters();
});
