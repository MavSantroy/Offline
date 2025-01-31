/************************************************
 * Global Data Structure (Updated)
 ************************************************/
let characterData = {
  name: "",
  race: "Custom",
  attributes: {
    str: { base: 0, modifiers: { GE: 0, Cyb: 0, Temp: 0, Art: 0, Psi: 0, Misc: 0, Neg: 0 } },
    dex: { base: 0, modifiers: { GE: 0, Cyb: 0, Temp: 0, Art: 0, Psi: 0, Misc: 0, Neg: 0 } },
    con: { base: 0, modifiers: { GE: 0, Cyb: 0, Temp: 0, Art: 0, Psi: 0, Misc: 0, Neg: 0 } },
    int: { base: 0, modifiers: { GE: 0, Cyb: 0, Temp: 0, Art: 0, Psi: 0, Misc: 0, Neg: 0 } },
    wis: { base: 0, modifiers: { GE: 0, Cyb: 0, Temp: 0, Art: 0, Psi: 0, Misc: 0, Neg: 0 } },
    cha: { base: 0, modifiers: { GE: 0, Cyb: 0, Temp: 0, Art: 0, Psi: 0, Misc: 0, Neg: 0 } },
  },
  commonStats: {
    lifeEnergy: { base: 0, modifiers: { GE: 0, Cyb: 0, Temp: 0, Art: 0, Psi: 0, Misc: 0, Neg: 0 } },
    rawEnergy: { base: 0, modifiers: { GE: 0, Cyb: 0, Temp: 0, Art: 0, Psi: 0, Misc: 0, Neg: 0 } },
    health: { base: 0, modifiers: { GE: 0, Cyb: 0, Temp: 0, Art: 0, Psi: 0, Misc: 0, Neg: 0 } },
    rangedDefense: { base: 10, modifiers: { GE: 0, Cyb: 0, Temp: 0, Art: 0, Psi: 0, Misc: 0, Neg: 0 } },
    meleeDefense: { base: 10, modifiers: { GE: 0, Cyb: 0, Temp: 0, Art: 0, Psi: 0, Misc: 0, Neg: 0 } },
    initiative: { base: 0, modifiers: { GE: 0, Cyb: 0, Temp: 0, Art: 0, Psi: 0, Misc: 0, Neg: 0 } },
    movement: { base: 0, modifiers: { GE: 0, Cyb: 0, Temp: 0, Art: 0, Psi: 0, Misc: 0, Neg: 0 } },
  }
};

/************************************************
 * Race Templates
 ************************************************/
const raceTemplates = {
  Talaxian: { attributes: { str: 2, dex: 1, con: 3, int: 0, wis: 0, cha: 0 } },
  Thorn: { attributes: { str: 0, dex: 1, con: 1, int: 2, wis: 2, cha: 2 } },
  Sollox: { attributes: { str: 0, dex: 1, con: 0, int: 3, wis: 3, cha: 2 } },
  Custom: { attributes: { str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0 } },
};

/************************************************
 * Initialization on Page Load
 ************************************************/
window.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  initRaceDropdown();
  initSaveAndLoad();
  updateMainPageAttributes();
  initCombinedModifiersTable();
  initCommonStatsTable();
  startAutosave();
});

/************************************************
 * Navigation Logic
 ************************************************/
function initNavigation() {
  document.getElementById("main-page-btn").addEventListener("click", () => {
    document.getElementById("main-page").style.display = "block";
    document.getElementById("modifiers-page").style.display = "none";
  });

  document.getElementById("modifiers-page-btn").addEventListener("click", () => {
    document.getElementById("main-page").style.display = "none";
    document.getElementById("modifiers-page").style.display = "block";
  });
}

/************************************************
 * Update Attributes on Main Page
 ************************************************/
function updateMainPageAttributes() {
  Object.keys(characterData.attributes).forEach((attr) => {
    document.getElementById(`${attr}-display`).textContent = characterData.attributes[attr].base;
  });
}

/************************************************
 * Initialize Race Dropdown
 ************************************************/
function initRaceDropdown() {
  document.getElementById("race-dropdown").addEventListener("change", (event) => {
    const selectedRace = event.target.value;
    characterData.race = selectedRace;

    Object.keys(characterData.attributes).forEach((attr) => {
      characterData.attributes[attr].base = raceTemplates[selectedRace]?.attributes[attr] || 0;
    });

    updateMainPageAttributes();
    initCombinedModifiersTable();
  });
}

/************************************************
 * Initialize Save and Load
 ************************************************/
function initSaveAndLoad() {
  document.getElementById("save-btn").addEventListener("click", saveCharacterToFile);
  document.getElementById("load-btn").addEventListener("click", loadCharacterFromFile);
}

/************************************************
 * Save and Load Character
 ************************************************/
function saveCharacterToFile() {
  const json = JSON.stringify(characterData, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const link = document.createElement("a");

  link.href = URL.createObjectURL(blob);
  link.download = `${characterData.name || "character"}.json`;
  link.click();
}

function loadCharacterFromFile() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".json";

  input.addEventListener("change", (e) => {
    const reader = new FileReader();
    reader.onload = () => {
      characterData = JSON.parse(reader.result);
      updateMainPageAttributes();
      initCombinedModifiersTable();
      initCommonStatsTable();
    };
    reader.readAsText(e.target.files[0]);
  });

  input.click();
}

/************************************************
 * Initialize Combined Modifiers Table
 ************************************************/
function initCombinedModifiersTable() {
  const tableBody = document.getElementById("combined-modifiers-table").querySelector("tbody");
  tableBody.innerHTML = "";

  Object.keys(characterData.attributes).forEach((attr) => {
    const row = document.createElement("tr");
    const modifiers = characterData.attributes[attr].modifiers;
    const total = characterData.attributes[attr].base + Object.values(modifiers).reduce((sum, mod) => sum + mod, 0);

    row.innerHTML = `
      <td>${attr.toUpperCase()}</td>
      <td>${total}</td>
      ${Object.keys(modifiers).map(mod => `<td><input type="number" data-attr="${attr}" data-mod="${mod}" value="${modifiers[mod]}" /></td>`).join("")}
    `;

    tableBody.appendChild(row);
  });

  document.querySelectorAll("#combined-modifiers-table input").forEach(input => {
    input.addEventListener("input", (e) => {
      characterData.attributes[e.target.dataset.attr].modifiers[e.target.dataset.mod] = parseInt(e.target.value) || 0;
      initCombinedModifiersTable();
    });
  });
}

/************************************************
 * Initialize Common Stats Table
 ************************************************/
function initCommonStatsTable() {
  const tableBody = document.getElementById("common-stats-table").querySelector("tbody");
  tableBody.innerHTML = "";

  Object.keys(characterData.commonStats).forEach((stat) => {
    const data = characterData.commonStats[stat];
    const total = data.base + Object.values(data.modifiers).reduce((sum, mod) => sum + mod, 0);

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${stat.replace(/([A-Z])/g, " $1")}</td>
      <td>${total}</td>
      ${Object.keys(data.modifiers).map(mod => `<td><input type="number" data-stat="${stat}" data-mod="${mod}" value="${data.modifiers[mod]}" /></td>`).join("")}
    `;

    tableBody.appendChild(row);
  });
}
