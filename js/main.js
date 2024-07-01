import { errorMsg } from "./tools.js";
import { renderEvent } from "./event-number.js";
import { setView, getView } from "./views/views.js";
import { views } from "./views/views-dictionary.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const jsonData = {};

const selectedObjectTypes = {
  types: [
    "edm4hep::MCParticle",
    "edm4hep::ReconstructedParticle",
    "edm4hep::MCRecoParticleAssociation",
  ],
};

function hideInputModal() {
  const modal = document.getElementById("input-modal");

  modal.style.display = "none";
}

function showEventSwitcher() {
  const eventSwitcher = document.getElementById("event-switcher");

  eventSwitcher.style.display = "flex";
}

function showViewsMenu() {
  const viewsMenu = document.getElementById("views");

  viewsMenu.style.display = "flex";
}

document.getElementById("input-file").addEventListener("change", (event) => {
  for (const file of event.target.files) {
    if (!file.name.endsWith("edm4hep.json")) {
      errorMsg("Provided file is not EDM4hep JSON!");
    }

    if (!file.type.endsWith("/json")) {
      errorMsg("ERROR: Provided file is not EDM4hep JSON!");
    }

    const reader = new FileReader();
    reader.addEventListener("load", (event) => {
      const fileText = event.target.result;
      jsonData.data = JSON.parse(fileText);

      const eventNumberInput = document.getElementById("event-number");
      const options = Object.keys(jsonData.data).map((event) =>
        parseInt(event.replace("Event ", ""))
      );
      eventNumberInput.max = Object.keys(options).length - 1;
      if (options.length === 0) {
        errorMsg("No events found in the file!");
        return;
      }
      eventNumberInput.value = options[0];
      document.getElementById("event-selector").style.display = "block";
      const eventOptions = document.getElementById("event-number");
      const eventSelectorMenu = document.getElementById("event-selector-menu");
      eventOptions.replaceChildren();
      eventSelectorMenu.replaceChildren();
      options.forEach((option) => {
        const optionElement = document.createElement("option");
        optionElement.appendChild(document.createTextNode(option));
        eventOptions.appendChild(optionElement);

        const optionElementMenu = document.createElement("div");
        optionElementMenu.className = "event-option";
        optionElementMenu.appendChild(document.createTextNode(option));
        eventSelectorMenu.appendChild(optionElementMenu);
        optionElementMenu.addEventListener("click", () => {
          renderEvent(option);
          eventSelectorMenu.style.display = "none";
        });
      });

      const availableViews = document.getElementById("available-views");
      availableViews.replaceChildren();
      const buttons = [];
      for (const key in views) {
        const button = document.createElement("button");
        button.appendChild(document.createTextNode(key));
        button.className = "view-button";
        button.onclick = (event) => {
          event.preventDefault();
          setView(key);
          for (const otherButton of buttons) {
            if (otherButton !== button) {
              otherButton.style.backgroundColor = "#f1f1f1";
            }
          }
          button.style.backgroundColor = "#c5c5c5";
        };
        buttons.push(button);
        availableViews.appendChild(button);
      }
    });
    reader.readAsText(file);
    break;
  }
});

document
  .getElementById("visualize-button")
  .addEventListener("click", (event) => {
    event.preventDefault();

    if (jsonData.data === undefined) {
      errorMsg("No data loaded!");
      return;
    }

    if (getView() === undefined) {
      errorMsg("No view selected!");
      return;
    }

    const eventNum = document.getElementById("event-number").value;

    hideInputModal();
    showEventSwitcher();
    showViewsMenu();
    renderEvent(eventNum);
  });

export { canvas, ctx, jsonData, selectedObjectTypes };
