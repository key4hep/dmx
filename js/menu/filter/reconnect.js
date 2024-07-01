import { emptyCopyObject } from "../../lib/copy.js";
import { objectTypes } from "../../types/objects.js";

export function reconnect(criteriaFunction, loadedObjects) {
  const filteredObjects = {};

  emptyCopyObject(loadedObjects, filteredObjects);

  for (const [key, value] of Object.entries(loadedObjects.datatypes)) {
    const filterFunction = objectTypes[key].filter;

    filterFunction(value, filteredObjects.datatypes, criteriaFunction);
  }

  return filteredObjects;
}
