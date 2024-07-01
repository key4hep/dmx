import { canvas } from "../main.js";

export function recoParticleTree(viewCurrentObjects) {
  const recoCollection =
    viewCurrentObjects.datatypes["edm4hep::ReconstructedParticle"].collection ??
    [];

  if (recoCollection.length === 0) {
    alert("No ReconstructedParticles found in this event.");
  }

  const nodes = new Set();
  const children = new Set();

  for (const recoParticle of recoCollection) {
    const particles = recoParticle.oneToManyRelations["particles"].map(
      (link) => link.to
    );
    nodes.add(`${recoParticle.index}-${recoParticle.collectionId}`);
    for (const recoParticleChild of particles) {
      children.add(
        `${recoParticleChild.index}-${recoParticleChild.collectionId}`
      );
    }
  }

  const rootNodesIds = nodes.difference(children);
  const rootNodes = [];

  recoCollection.forEach((recoParticle) => {
    if (
      rootNodesIds.has(`${recoParticle.index}-${recoParticle.collectionId}`)
    ) {
      rootNodes.push(recoParticle);
    }
  });

  rootNodes.forEach((rootNode) => {
    const stack = [[rootNode, 0]];

    while (stack.length > 0) {
      const [node, row] = stack.pop();
      const id = `${node.index}-${node.collectionId}`;
      if (nodes.has(id)) {
        nodes.delete(id);
        node.row = row;

        const particles = node.oneToManyRelations["particles"];

        particles.forEach((link) => {
          stack.push([link.to, row + 1]);
        });
      }
    }
  });

  const horizontalGap = recoCollection[0].width * 0.4;
  const verticalGap = recoCollection[0].height * 0.3;
  const boxWidth = recoCollection[0].width;
  const boxHeight = recoCollection[0].height;

  const matrix = [];

  recoCollection.forEach((recoParticle) => {
    const row = recoParticle.row;
    if (matrix[row] === undefined) {
      matrix[row] = [];
    }
    matrix[row].push(recoParticle);
  });

  matrix.forEach((row, i) => {
    row.forEach((recoParticle, j) => {
      recoParticle.x = j * horizontalGap + j * boxWidth + horizontalGap;
      recoParticle.y = i * verticalGap + i * boxHeight + verticalGap;
    });
  });

  canvas.width =
    boxWidth * matrix[0].length + horizontalGap * (matrix[0].length + 1);
  canvas.height =
    boxHeight * (matrix.length + 1) + verticalGap * (matrix.length + 2);
}

export function recoParticleTreeScroll() {
  return {
    x: 0,
    y: 0,
  };
}
