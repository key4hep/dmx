import jsYaml from "js-yaml";
import fs from "fs/promises";

const fileRoute = process.argv[2] ?? "model/edm4hep.yaml";
const folderOutput = process.argv[3] ?? "output";

const definitionFile = await fs.readFile(fileRoute, "utf-8");
const definitionObject = jsYaml.load(definitionFile);

const components = definitionObject.components;
const datatypes = definitionObject.datatypes;

const configTypes = new Set([
  "edm4hep::Cluster",
  "edm4hep::ParticleID",
  "edm4hep::MCParticle",
  "edm4hep::Vertex",
  "edm4hep::ReconstructedParticle",
  "edm4hep::Track",
]);

const selectedTypes = Object.entries(datatypes).filter(([key, _]) =>
  configTypes.has(key)
);

const componentsDefinition = {};
const datatypesDefinition = {};

class Component {}

class DataTypeMember {
  constructor(type = null, name, unit = null) {
    if (type) this.type = type;
    this.name = name;
    if (unit) this.unit = unit;
  }
}

class Relation {
  constructor(type = null, name) {
    if (type) this.type = type;
    this.name = name;
  }
}

const parseString = (string) => {
  return string
    .split("//")[0]
    .trim()
    .split(" ")
    .filter((substring) => substring !== "");
};

const parseDatatypesMembers = (members) => {
  const newMembers = [];

  for (const member of members) {
    let [type, name, unit] = parseString(member);
    if (unit) unit = unit.replace("[", "").replace("]", "");
    if (type.includes("edm4hep::")) {
      newMembers.push(new DataTypeMember(type, name, unit));
    } else {
      newMembers.push(new DataTypeMember(null, name, unit));
    }
  }

  return newMembers;
};

const parseRelation = (relations) => {
  return relations.map((relation) => {
    const [type, name] = parseString(relation);
    if (type.includes("edm4hep::")) {
      return new Relation(type, name);
    } else {
      return new Relation(null, name);
    }
  });
};

selectedTypes.forEach(([name, values]) => {
  const members = values["Members"] ?? false;
  let parsedMembers;
  if (members) parsedMembers = parseDatatypesMembers(members);
  const oneToManyRelations = values["OneToManyRelations"] ?? false;
  let parsedOneToManyRelations;
  if (oneToManyRelations)
    parsedOneToManyRelations = parseRelation(oneToManyRelations);
  const oneToOneRelations = values["OneToOneRelations"] ?? false;
  let parsedOneToOneRelations;
  if (oneToOneRelations)
    parsedOneToOneRelations = parseRelation(oneToOneRelations);

  datatypesDefinition[name] = {
    members: parsedMembers,
    oneToManyRelations: parsedOneToManyRelations,
    oneToOneRelations: parsedOneToOneRelations,
  };
});

const output = `export const datatypes = ${JSON.stringify(
  datatypesDefinition,
  null,
  2
)}`;

await fs.writeFile(`${folderOutput}/datatypes.js`, output);
