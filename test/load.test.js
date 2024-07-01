import { loadObjects } from "../js/types/load.js";
import json from "./load.json" assert { type: "json" };

test("load a json file with a collection of objects", () => {
  const objects = loadObjects(json, 1, [
    "edm4hep::MCParticle",
    "edm4hep::ReconstructedParticle",
  ]);

  const datatypes = objects.datatypes;

  expect(datatypes["edm4hep::MCParticle"]).toBeDefined();
  expect(datatypes["edm4hep::ReconstructedParticle"]).toBeDefined();

  expect(datatypes["edm4hep::MCParticle"].collection.length).toEqual(3);
  expect(
    datatypes["edm4hep::MCParticle"].collection.map((val) => val.index)
  ).toEqual([0, 1, 2]);
  expect(datatypes["edm4hep::MCParticle"].oneToMany["daughters"]).toBeDefined();
  expect(datatypes["edm4hep::MCParticle"].oneToMany["parents"]).toBeDefined();

  expect(
    datatypes["edm4hep::MCParticle"].oneToMany["daughters"][0].from.index
  ).toEqual(0);
  expect(
    datatypes["edm4hep::MCParticle"].oneToMany["daughters"][0].to.index
  ).toEqual(2);

  expect(datatypes["edm4hep::ReconstructedParticle"].collection.length).toEqual(
    2
  );
  expect(
    datatypes["edm4hep::ReconstructedParticle"].collection.map(
      (val) => val.index
    )
  ).toEqual([0, 1]);
  expect(
    datatypes["edm4hep::ReconstructedParticle"].oneToMany["particles"]
  ).toBeDefined();
  expect(
    datatypes["edm4hep::ReconstructedParticle"].oneToOne["startVertex"]
  ).toBeDefined();
  expect(
    datatypes["edm4hep::ReconstructedParticle"].oneToMany["particles"][0].from
      .index
  ).toEqual(0);
  expect(
    datatypes["edm4hep::ReconstructedParticle"].oneToMany["particles"][0].to
      .index
  ).toEqual(1);
});
