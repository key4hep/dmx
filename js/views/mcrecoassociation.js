import { canvas } from "../main.js";
import { emptyCopyObject } from "../lib/copy.js";

export function mcRecoAssociation(viewObjects) {
  const associationMCReco =
    viewObjects.associations["edm4hep::MCRecoParticleAssociation"];

  const recoCollection = associationMCReco.map(
    (association) => association.from
  );
  const mcCollection = associationMCReco.map((association) => association.to);

  if (mcCollection.length === 0 || recoCollection.length === 0) {
    alert("No MCRecoAssociation found!");
    return;
  }

  const mcWidth = mcCollection[0].width;
  const recoWidth = recoCollection[0].width;
  const mcHorizontalGap = 0.3 * mcWidth;
  const recoHorizontalGap = 0.3 * recoWidth;
  const gap = 2 * (mcWidth + recoWidth);
  const totalWidth = gap + mcWidth + recoWidth;

  canvas.width =
    totalWidth > window.innerWidth ? totalWidth : window.innerWidth;

  const width = canvas.width;

  const mcHeight = mcCollection[0].height;
  const recoHeight = recoCollection[0].height;
  const mcVerticalGap = 0.3 * mcHeight;
  const recoVerticalGap = 0.3 * recoHeight;

  const mcTotalHeight =
    mcCollection.length * (mcHeight + mcVerticalGap) + mcVerticalGap;
  const recoTotalHeight =
    recoCollection.length * (recoHeight + recoVerticalGap) + recoVerticalGap;

  canvas.height =
    mcTotalHeight > recoTotalHeight ? mcTotalHeight : recoTotalHeight;

  for (const [index, mc] of mcCollection.entries()) {
    mc.y = mcVerticalGap + index * (mcHeight + mcVerticalGap);
    mc.x = width / 2 - mcWidth - mcHorizontalGap;
  }

  for (const [index, reco] of recoCollection.entries()) {
    reco.y = recoVerticalGap + index * (recoHeight + recoVerticalGap);
    reco.x = width / 2 + recoHorizontalGap;
  }
}

export function preFilterMCReco(currentObjects, viewObjects) {
  emptyCopyObject(currentObjects, viewObjects);

  const associationMCReco =
    currentObjects.associations["edm4hep::MCRecoParticleAssociation"];

  const recoCollection = associationMCReco.map(
    (association) => association.from
  );
  const mcCollection = associationMCReco.map((association) => association.to);

  viewObjects.datatypes["edm4hep::ReconstructedParticle"].collection =
    recoCollection;

  mcCollection.forEach((mc) => {
    viewObjects.datatypes["edm4hep::MCParticle"].collection.push(mc);
  });

  viewObjects.associations["edm4hep::MCRecoParticleAssociation"] =
    associationMCReco;
}
