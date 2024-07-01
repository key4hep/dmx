import { mcParticleTree, mcParticleTreeScroll } from "./mcparticletree.js";
import { mcRecoAssociation, preFilterMCReco } from "./mcrecoassociation.js";
import {
  recoParticleTree,
  recoParticleTreeScroll,
} from "./recoparticletree.js";
import { setupMCParticleFilter } from "../filter/mcparticle.js";

export const views = {
  "Monte Carlo Particle Tree": {
    filters: setupMCParticleFilter,
    viewFunction: mcParticleTree,
    scrollFunction: mcParticleTreeScroll,
    preFilterFunction: (currentObjects, viewObjects) => {
      viewObjects.datatypes = {};
      viewObjects.associations = {};
      viewObjects.datatypes["edm4hep::MCParticle"] =
        currentObjects.datatypes["edm4hep::MCParticle"];
    },
  },
  "Reconstructed Particle Tree": {
    filters: () => {},
    viewFunction: recoParticleTree,
    scrollFunction: recoParticleTreeScroll,
    preFilterFunction: (currentObjects, viewObjects) => {
      viewObjects.datatypes = {};
      viewObjects.associations = {};
      viewObjects.datatypes["edm4hep::ReconstructedParticle"] =
        currentObjects.datatypes["edm4hep::ReconstructedParticle"];
    },
  },
  "Monte Carlo-Reconstructed Particle": {
    filters: () => {},
    viewFunction: mcRecoAssociation,
    scrollFunction: () => {
      return { x: (canvas.width - window.innerWidth) / 2, y: 0 };
    },
    preFilterFunction: preFilterMCReco,
  },
};
