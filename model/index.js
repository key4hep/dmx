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
  "edm4hep::MCRecoParticleAssociation",
]);

const selectedTypes = Object.entries(datatypes).filter(([key, _]) =>
  configTypes.has(key)
);

const datatypesDefinition = {};

class DataTypeMember {
  constructor(name, unit = null) {
    this.name = name;
    if (unit) this.unit = unit;
  }
}

class Relation {
  constructor(type, name) {
    this.type = type;
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
    let [_, name, unit] = parseString(member);
    if (unit) unit = unit.replace("[", "").replace("]", "");
    newMembers.push(new DataTypeMember(name, unit));
  }

  return newMembers;
};

const parseRelation = (relations) => {
  return relations.map((relation) => {
    const [type, name] = parseString(relation);

    return new Relation(type, name);
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
