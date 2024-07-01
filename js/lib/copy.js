export function copyObject(source, destiny) {
  for (const [key, value] of Object.entries(source)) {
    destiny[key] = value;
  }
}

export function emptyCopyObject(source, destiny) {
  destiny.datatypes = {};

  for (const [objectType, elements] of Object.entries(source.datatypes)) {
    const { _, oneToMany, oneToOne } = elements;

    destiny.datatypes[objectType] = {
      collection: [],
      oneToMany: {},
      oneToOne: {},
    };

    for (const name in oneToMany) {
      destiny.datatypes[objectType].oneToMany[name] = [];
    }

    for (const name in oneToOne) {
      destiny.datatypes[objectType].oneToOne[name] = [];
    }
  }

  destiny.associations = {};

  for (const key in source.associations) {
    destiny.associations[key] = [];
  }
}
