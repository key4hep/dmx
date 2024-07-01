import { reconnect } from "../js/menu/filter/reconnect.js";
import { loadObjects } from "../js/types/load.js";
import {
  Range,
  Checkbox,
  buildCriteriaFunction,
} from "../js/menu/filter/parameters.js";

let objects = {};

const data = {
  "Event 0": {
    "Collection": {
      "collID": 0,
      "collType": "edm4hep::MCParticleCollection",
      "collection": [
        {
          "momentum": 0,
          "charge": 0,
          "mass": 0,
          "simulatorStatus": 70,
          "parents": [],
          "daughters": [
            {
              "collectionID": 0,
              "index": 1,
            },
          ],
        },
        {
          "momentum": 100,
          "charge": 1,
          "mass": 10,
          "simulatorStatus": 24,
          "daughters": [
            {
              "collectionID": 0,
              "index": 3,
            },
          ],
          "parents": [
            {
              "collectionID": 0,
              "index": 0,
            },
          ],
        },
        {
          "momentum": 200,
          "charge": 2,
          "mass": 20,
          "simulatorStatus": 25,
          "daughters": [
            {
              "collectionID": 0,
              "index": 4,
            },
          ],
          "parents": [
            {
              "collectionID": 0,
              "index": 0,
            },
          ],
        },
        {
          "momentum": 300,
          "charge": 3,
          "mass": 30,
          "simulatorStatus": 26,
          "daughters": [
            {
              "collectionID": 0,
              "index": 4,
            },
          ],
          "parents": [
            {
              "collectionID": 0,
              "index": 1,
            },
          ],
        },
        {
          "momentum": 400,
          "charge": 4,
          "mass": 40,
          "simulatorStatus": 27,
          "parents": [
            {
              "collectionID": 0,
              "index": 2,
            },
            {
              "collectionID": 0,
              "index": 3,
            },
          ],
          "daughters": [],
        },
      ],
    },
  },
};

beforeAll(() => {
  objects = loadObjects(data, 0, ["edm4hep::MCParticle"]);
});

describe("filter by ranges", () => {
  it("filter by a single range parameter", () => {
    const momentum = new Range({
      property: "momentum",
      unit: "GeV",
    });
    momentum.min = 300;
    momentum.max = 1000;
    const rangeFilters = Range.buildFilter([momentum]);
    const criteriaFunction = buildCriteriaFunction(rangeFilters);

    const filteredObjects = reconnect(criteriaFunction, objects);

    expect(
      filteredObjects.datatypes["edm4hep::MCParticle"].collection.map(
        (mcParticle) => mcParticle.index
      )
    ).toEqual([3, 4]);
  });

  it("filter by a combination of ranges", () => {
    const charge = new Range({
      property: "charge",
      unit: "e",
    });
    charge.min = 3;
    const mass = new Range({
      property: "mass",
      unit: "GeV",
    });
    mass.min = 20;
    mass.max = 40;
    const rangeFilters = Range.buildFilter([mass, charge]);
    const criteriaFunction = buildCriteriaFunction(rangeFilters);

    const filteredObjects = reconnect(criteriaFunction, objects);

    expect(
      filteredObjects.datatypes["edm4hep::MCParticle"].collection.map(
        (mcParticle) => mcParticle.index
      )
    ).toEqual([3, 4]);
  });
});

describe("filter by checkboxes", () => {
  it("filter by a single checkbox", () => {
    const simulatorStatus = new Checkbox("simulatorStatus", 23);
    simulatorStatus.checked = true;
    const checkboxFilters = Checkbox.buildFilter([simulatorStatus]);
    const criteriaFunction = buildCriteriaFunction(checkboxFilters);

    const filteredObjects = reconnect(criteriaFunction, objects);

    expect(
      filteredObjects.datatypes["edm4hep::MCParticle"].collection.map(
        (mcParticle) => mcParticle.index
      )
    ).toEqual([]);
  });

  it("filter by a combination of checkboxes", () => {
    const simulatorStatus1 = new Checkbox("simulatorStatus", 23);
    simulatorStatus1.checked = true;
    const simulatorStatus2 = new Checkbox("simulatorStatus", 26);
    simulatorStatus2.checked = true;
    const simulatorStatus3 = new Checkbox("simulatorStatus", 27);
    simulatorStatus3.checked = true;
    const checkboxFilters = Checkbox.buildFilter([
      simulatorStatus1,
      simulatorStatus2,
      simulatorStatus3,
    ]);
    const criteriaFunction = buildCriteriaFunction(checkboxFilters);

    const filteredObjects = reconnect(criteriaFunction, objects);

    expect(
      filteredObjects.datatypes["edm4hep::MCParticle"].collection.map(
        (mcParticle) => mcParticle.index
      )
    ).toEqual([3, 4]);
  });
});

describe("filter by ranges and checkboxes", () => {
  it("show all particles when no kind of filter is applied", () => {
    const charge = new Range({
      property: "charge",
      unit: "e",
    });
    const simulatorStatus = new Checkbox("simulatorStatus", 26);
    const rangeFilters = Range.buildFilter([charge]);
    const checkboxFilters = Checkbox.buildFilter([simulatorStatus]);
    const criteriaFunction = buildCriteriaFunction(
      rangeFilters,
      checkboxFilters
    );

    const filteredObjects = reconnect(criteriaFunction, objects);

    expect(
      filteredObjects.datatypes["edm4hep::MCParticle"].collection.map(
        (mcParticle) => mcParticle.index
      )
    ).toEqual([0, 1, 2, 3, 4]);
  });

  it("filter by a combination of ranges and checkboxes", () => {
    const charge = new Range({
      property: "charge",
      unit: "e",
    });
    charge.max = 3;
    const simulatorStatus = new Checkbox("simulatorStatus", 23);
    simulatorStatus.checked = true;
    const rangeFilters = Range.buildFilter([charge]);
    const checkboxFilters = Checkbox.buildFilter([simulatorStatus]);
    const criteriaFunction = buildCriteriaFunction(
      rangeFilters,
      checkboxFilters
    );

    const filteredObjects = reconnect(criteriaFunction, objects);

    expect(
      filteredObjects.datatypes["edm4hep::MCParticle"].collection.map(
        (mcParticle) => mcParticle.index
      )
    ).toEqual([]);
  });
});
