import { Toggle } from "./toggle.js";

export class PdgToggle extends Toggle {
  constructor(id) {
    super(id);
  }

  toggle(currentObjects, redraw) {
    const collection =
      currentObjects.datatypes["edm4hep::MCParticle"].collection;
    if (this.isSliderActive) {
      if (collection[0].PDG === undefined) return;
      for (const object of collection) {
        object.updateTexImg(`${object.PDG}`);
      }
    } else {
      if (collection[0].PDG === undefined) return;
      for (const object of collection) {
        object.updateTexImg(`${object.name}`);
      }
    }

    redraw();
  }
}
