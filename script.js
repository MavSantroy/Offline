/************************************************
 * Global Data Structure (Updated)
 ************************************************/
let characterData = {
  name: "",
  race: "Custom", // Default race
  attributes: {
    str: { base: 0, modifiers: { GE: 0, Cyb: 0, Temp: 0, Art: 0, Psi: 0, Misc: 0, Neg: 0 } },
    dex: { base: 0, modifiers: { GE: 0, Cyb: 0, Temp: 0, Art: 0, Psi: 0, Misc: 0, Neg: 0 } },
    con: { base: 0, modifiers: { GE: 0, Cyb: 0, Temp: 0, Art: 0, Psi: 0, Misc: 0, Neg: 0 } },
    int: { base: 0, modifiers: { GE: 0, Cyb: 0, Temp: 0, Art: 0, Psi: 0, Misc: 0, Neg: 0 } },
    wis: { base: 0, modifiers: { GE: 0, Cyb: 0, Temp: 0, Art: 0, Psi: 0, Misc: 0, Neg: 0 } },
    cha: { base: 0, modifiers: { GE: 0, Cyb: 0, Temp: 0, Art: 0, Psi: 0, Misc: 0, Neg: 0 } },
  },
  characterData.commonStats = {
    lifeEnergy: { base: 0, modifiers: { GE: 0, Cyb: 0, Temp: 0, Art: 0, Psi: 0, Misc: 0, Neg: 0 } },
    rawEnergy: { base: 0, modifiers: { GE: 0, Cyb: 0, Temp: 0, Art: 0, Psi: 0, Misc: 0, Neg: 0 } },
    health: { base: 0, modifiers: { GE: 0, Cyb: 0, Temp: 0, Art: 0, Psi: 0, Misc: 0, Neg: 0 } },
    rangedDefense: { base: 10, modifiers: { GE: 0, Cyb: 0, Temp: 0, Art: 0, Psi: 0, Misc: 0, Neg: 0 } },
    meleeDefense: { base: 10, modifiers: { GE: 0, Cyb: 0, Temp: 0, Art: 0, Psi: 0, Misc: 0, Neg: 0 } },
    initiative: { base: 0, modifiers: { GE: 0, Cyb: 0, Temp: 0, Art: 0, Psi: 0, Misc: 0, Neg: 0 } },
    movement: { base: 0, modifiers: { GE: 0, Cyb: 0, Temp: 0, Art: 0, Psi: 0, Misc: 0, Neg: 0 } },
  };
  
};

/************************************************
 * Race Templates
 ************************************************/
const raceTemplates = {
  Talaxian: {
    attributes: { str: 2, dex: 1, con: 3, int: 0, wis: 0, cha: 0 },
    stats: { baseHP: 15, baseLE: 25, regeneration: "+1hp/day", movement: 15 },
  },
  Thorn: {
    attributes: { str: 0, dex: 1, con: 1, int: 2, wis: 2, cha: 2 },
    stats: { baseHP: 15, baseLE: 10, regeneration: "+2hp/day", movement: 15 },
  },
  Sollox: {
    attributes: { str: 0, dex: 1, con: 0, int: 3, wis: 3, cha: 2 },
    stats: { baseHP: 10, baseLE: 35, regeneration: "+1hp/day", movement: 20 },
  },
  Custom: {
    attributes: { str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0 },
    stats: { baseHP: 0, baseLE: 0, regeneration: "0", movement: 20 },
  },
};


/************************************************
 * On Page Load
 ************************************************/
window.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  initRaceDropdown();
  initSaveAndLoad();  // ✅ Ensure this is here
  updateMainPageAttributes();
  initCombinedModifiersTable();
  initCommonStatsTable();
  startAutosave();
});

/************************************************
 * Navigation Logic
 ************************************************/
function initNavigation() {
  const mainPage = document.getElementById("main-page");
  const modifiersPage = document.getElementById("modifiers-page");

  document.getElementById("main-page-btn").addEventListener("click", () => {
    mainPage.style.display = "block";
    modifiersPage.style.display = "none";
  });

  document.getElementById("modifiers-page-btn").addEventListener("click", () => {
    mainPage.style.display = "none";
    modifiersPage.style.display = "block";
  });
}

/************************************************
 * Main Page Attribute Display
 ************************************************/
function updateMainPageAttributes() {
  Object.keys(characterData.attributes).forEach((attr) => {
    const displayElement = document.getElementById(`${attr}-display`);
    if (displayElement) {
      displayElement.textContent = characterData.attributes[attr].base;
    }
  });

  console.log("Updated main page attributes:", characterData.attributes);
}

/************************************************
 * Initialize Base Attribute Modifier Inputs
 ************************************************/
function initModifierInputs() {
  const inputs = [
    { id: "str-input", key: "str" },
    { id: "dex-input", key: "dex" },
    { id: "con-input", key: "con" },
    { id: "int-input", key: "int" },
    { id: "wis-input", key: "wis" },
    { id: "cha-input", key: "cha" },
  ];

  inputs.forEach((input) => {
    const element = document.getElementById(input.id);

    if (!element) {
      console.warn(`Missing input field: ${input.id}`); // Log missing fields
      return;
    }

    // Set initial value to match character data
    element.value = characterData.attributes[input.key].base;

    // Update characterData when input is changed
    element.addEventListener("input", (e) => {
      characterData.attributes[input.key].base = parseInt(e.target.value) || 0;
      updateMainPageAttributes();
    });
  });
}


/************************************************
 * Initialize Save and Load Buttons (Debugging)
 ************************************************/
function initSaveAndLoad() {
  const saveBtn = document.getElementById("save-btn");
  const loadBtn = document.getElementById("load-btn");

  if (saveBtn) {
    saveBtn.addEventListener("click", saveCharacterToFile);
  }

  if (loadBtn) {
    loadBtn.addEventListener("click", function () {
      console.log("Load button clicked!"); // Debug log
      loadCharacterFromFile();
    });
  } else {
    console.error("Load button not found in the document.");
  }
}

function saveCharacterToFile() {
  const name = document.getElementById("char-name").value.trim();
  if (!name) {
    alert("Please enter a character name before saving.");
    return;
  }

  characterData.name = name;

  const json = JSON.stringify(characterData, null, 2);
  const blob = new Blob([json], { type: "application/json" });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);

  const fileName = `${name}.json`;
  link.download = fileName;
  link.click();
}
/************************************************
 * Load Character (Ensuring Functionality)
 ************************************************/
function loadCharacterFromFile() {
  console.log("Load function started."); // Debug log

  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".json";

  input.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) {
      console.error("No file selected.");
      return;
    }

    console.log("File selected:", file.name);

    const reader = new FileReader();
    reader.onload = () => {
      try {
        console.log("File loaded. Parsing JSON...");
        const data = JSON.parse(reader.result);

        // Ensure required fields exist before merging
        if (!data.attributes || !data.race) {
          alert("Invalid file format: Missing required fields.");
          return;
        }

        console.log("Parsed Data:", data); // Log loaded data
        characterData = deepMerge(characterData, data);
        console.log("Merged Character Data:", characterData); // Log merged data

        // Update UI elements
        updateMainPageAttributes();
        initDirectModifiersTable();

        // Update race dropdown
        const raceDropdown = document.getElementById("race-dropdown");
        if (raceDropdown) {
          raceDropdown.value = characterData.race || "Custom";
        }

        console.log("Load completed successfully.");
      } catch (err) {
        console.error("Error parsing JSON:", err);
        alert("Failed to load character. Invalid file format.");
      }
    };

    reader.readAsText(file);
  });

  console.log("Opening file selection..."); // Debug log
  input.click();
}

/************************************************
 * Autosave Functionality
 ************************************************/
function startAutosave() {
  setInterval(() => {
    localStorage.setItem("autosave-character", JSON.stringify(characterData));
    console.log("Autosaved character data.");
  }, 5000);
}

function loadCharacterData(data) {
  // Merge loaded data with defaults
  characterData = { ...characterData, ...data };

  // Update attributes, race, and modifiers
  updateMainPageAttributes();
  updateModifiersForRace(characterData.race);
}

/************************************************
 * Initialize Race Dropdown (Ensure Inputs Update)
 ************************************************/
function initRaceDropdown() {
  const raceDropdown = document.getElementById("race-dropdown");

  raceDropdown.addEventListener("change", (event) => {
    const selectedRace = event.target.value;
    console.log("Race selected:", selectedRace); // Debug log

    characterData.race = selectedRace; // Store race selection

    if (raceTemplates[selectedRace]) {
      console.log("Applying race template:", raceTemplates[selectedRace]);

      // Update attributes
      Object.keys(characterData.attributes).forEach((attr) => {
        if (raceTemplates[selectedRace].attributes.hasOwnProperty(attr)) {
          characterData.attributes[attr].base = raceTemplates[selectedRace].attributes[attr] || 0;
        }
      });

      // Update UI
      updateMainPageAttributes();
      initModifierInputs(); // ✅ Ensure inputs update properly
    }
  });
}


/************************************************
 * Initialize Direct Modifiers Table (Ensuring It Exists)
 ************************************************/
function initDirectModifiersTable() {
  const tableBody = document.getElementById("direct-modifiers-table").querySelector("tbody");
  if (!tableBody) {
    console.error("Direct Modifiers Table not found in the document.");
    return;
  }
  tableBody.innerHTML = ""; // Clear existing rows

  Object.keys(characterData.attributes).forEach((attr) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${attr.toUpperCase()}</td>
      ${Object.keys(characterData.attributes[attr].modifiers)
        .map(mod => `<td><input type="number" data-attr="${attr}" data-mod="${mod}" value="${characterData.attributes[attr].modifiers[mod]}" /></td>`)
        .join("")}
      <td id="${attr}-total">${calculateTotalAttribute(attr)}</td>
    `;

    tableBody.appendChild(row);
  });

  document.querySelectorAll("#direct-modifiers-table input").forEach((input) => {
    input.addEventListener("input", (e) => {
      const attr = e.target.dataset.attr;
      const mod = e.target.dataset.mod;
      characterData.attributes[attr].modifiers[mod] = parseInt(e.target.value) || 0;
      document.getElementById(`${attr}-total`).textContent = calculateTotalAttribute(attr);
      updateMainPageAttributes();
    });
  });

  console.log("Direct Modifiers Table initialized.");
}

/************************************************
 * Initialize Combined Modifiers Table
 ************************************************/
function initCombinedModifiersTable() {
  const tableBody = document.getElementById("combined-modifiers-table").querySelector("tbody");
  tableBody.innerHTML = ""; // Clear existing rows

  Object.keys(characterData.attributes).forEach((attr) => {
    const row = document.createElement("tr");

    // Calculate Total
    const base = characterData.attributes[attr].base || 0;
    const racial = raceTemplates[characterData.race]?.attributes[attr] || 0;
    const modifiers = characterData.attributes[attr].modifiers;

    const total =
      base +
      racial +
      Object.values(modifiers).reduce((sum, mod) => sum + (parseInt(mod) || 0), 0);

    // Create Row
    row.innerHTML = `
      <td>${attr.toUpperCase()}</td>
      <td>${total}</td>
      <td>${racial}</td>
      ${Object.keys(modifiers)
        .map(
          (mod) =>
            `<td><input type="number" data-attr="${attr}" data-mod="${mod}" value="${modifiers[mod]}" /></td>`
        )
        .join("")}
    `;

    tableBody.appendChild(row);
  });

  // Add event listeners for modifier inputs
  document.querySelectorAll("#combined-modifiers-table input").forEach((input) => {
    input.addEventListener("input", (e) => {
      const attr = e.target.dataset.attr;
      const mod = e.target.dataset.mod;
      characterData.attributes[attr].modifiers[mod] = parseInt(e.target.value) || 0;

      // Recalculate and update the row's total
      initCombinedModifiersTable();
      updateMainPageAttributes();
    });
  });

  console.log("Combined Modifiers Table initialized.");
}

/************************************************
 * Initialize Common Stats Table
 ************************************************/
function initCommonStatsTable() {
  const tableBody = document.getElementById("common-stats-table").querySelector("tbody");
  if (!tableBody) {
    console.error("Common Stats Table not found in the document.");
    return;
  }
  tableBody.innerHTML = ""; // Clear existing rows

  Object.keys(characterData.commonStats).forEach((stat) => {
    const data = characterData.commonStats[stat];
    const modifiers = data.modifiers;

    // Calculate Total
    const total =
      data.base +
      Object.values(modifiers).reduce((sum, mod) => sum + (parseInt(mod) || 0), 0);

    // Create Row
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${stat.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}</td>
      <td>${total}</td>
      <td><input type="number" data-stat="${stat}" data-mod="base" value="${data.base}" /></td>
      ${Object.keys(modifiers)
        .map(
          (mod) =>
            `<td><input type="number" data-stat="${stat}" data-mod="${mod}" value="${modifiers[mod]}" /></td>`
        )
        .join("")}
    `;

    tableBody.appendChild(row);
  });

  // Add event listeners for modifier inputs
  document.querySelectorAll("#common-stats-table input").forEach((input) => {
    input.addEventListener("input", (e) => {
      const stat = e.target.dataset.stat;
      const mod = e.target.dataset.mod;
      characterData.commonStats[stat][mod] = parseInt(e.target.value) || 0;

      // Recalculate and update the table
      initCommonStatsTable();
    });
  });

  console.log("Common Stats Table initialized.");
}
