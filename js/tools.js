import { InfoBox, Link } from "./objects.js";


export function loadMCParticles(jsonData, eventNum,
                                infoBoxes, parentLinks, childrenLinks) {
  const eventData = jsonData["Event " + eventNum];
  const mcParticles = Object.values(eventData).find(element => element.collType == "edm4hep::MCParticleCollection");

  for (const [i, particle] of mcParticles.collection.entries()) {
    const box = new InfoBox(i);
    box.pdg = particle.PDG;
    box.genStatus = particle.generatorStatus;
    box.simStatus = particle.simulatorStatus;
    box.momentum = Math.sqrt(Math.pow(particle.momentum.x, 2)
                             + Math.pow(particle.momentum.y, 2)
                             + Math.pow(particle.momentum.z, 2));
    box.momentum = Math.round(box.momentum * 100) / 100;
    box.vertex = Math.sqrt(Math.pow(particle.vertex.x, 2)
                           + Math.pow(particle.vertex.y, 2)
                           + Math.pow(particle.vertex.z, 2));
    box.vertex = Math.round(box.vertex * 100) / 100;
    box.px = Math.round(particle.momentum.x * 100) / 100;
    box.py = Math.round(particle.momentum.y * 100) / 100;
    box.pz = Math.round(particle.momentum.z * 100) / 100;

    box.vx = particle.vertex.x;
    box.vy = particle.vertex.y;
    box.vz = particle.vertex.z;

    box.charge = particle.charge;
    box.time = Math.round(particle.time * 100) / 100;
    box.mass = Math.round(particle.mass * 100) / 100;

    box.name = getName(particle.PDG);
    box.updateTexImg();

    if (particle.parents.length === 0 && particle.daughters.length === 0) {
      box.row = -1;
      console.log("WARNING: Standalone particle!");
    }

    if (particle.parents.length === 0) {
      box.row = 0;
    }

    for (const j in particle.parents) {
      const parentId = particle.parents[j].index;
      box.parents.push(parentId);
      const link = new Link(parseInt(parentLinks.length), parentId, i);
      link.color = "#A00";  // Darkish red
      link.xShift = 3;
      parentLinks.push(link);
      box.parentLinks.push(link.id);
    }

    for (const j in particle.daughters) {
      const childrenId = particle.daughters[j].index;
      box.children.push(childrenId);
      const link = new Link(parseInt(childrenLinks.length), i, childrenId);
      link.color = "#0A0";  // Darkish green
      link.xShift = -3;
      childrenLinks.push(link);
      box.childrenLinks.push(link.id);
    }

    infoBoxes.push(box);
  }

  const getMaxRow = function(parentIds) {
    let maxRow = -1;
    for (const parentId of parentIds) {
      if (infoBoxes[parentId].row === -1) {
        return -1;
      }

      if (infoBoxes[parentId].row > maxRow) {
        maxRow = infoBoxes[parentId].row;
      }
    }

    return maxRow;
  }

  let repeat = true;
  while(repeat) {
    repeat = false;
    for (const infoBox of infoBoxes) {
      if (infoBox.row >= 0) {
        continue;
      }
      const parentRow = getMaxRow(infoBox.parents);
      if (parentRow >= 0) {
        infoBox.row = parentRow + 1;
      } else {
        repeat = true;
      }
    }
  }
}


function getName(pdg) {
  switch (pdg) {
    case 1:
      return "d";
    case -1:
      return "{\\bar d}";
    case 2:
      return "u";
    case -2:
      return "{\\bar u}";
    case 3:
      return "s";
    case -3:
      return "{\\bar s}";
    case 4:
      return "c";
    case -4:
      return "{\\bar c}";
    case 5:
      return "b";
    case -5:
      return "{\\bar b}";
    case 6:
      return "t";
    case -6:
      return "{\\bar t}";
    case 11:
      return "e^{-}";
    case -11:
      return "e^{+}";
    case 12:
      return "\\nu_{e}";
    case -12:
      return "{\\bar \\nu}_{e}";
    case 13:
      return "\\mu^{-}";
    case -13:
      return "\\mu^{+}";
    case 14:
      return "\\nu_{\\mu}";
    case -14:
      return "{\\bar \\nu}_{\\mu}";
    case 15:
      return "\\tau^{-}";
    case -15:
      return "\\tau^{+}";
    case 16:
      return "\\nu_{\\tau}";
    case -16:
      return "{\\bar \\nu}_{\\tau}";
    case 21:
      return "g";
    case 22:
      return "\\gamma";
    case 23:
      return "Z^{0}";
    case 24:
      return "W^{+}";
    case -24:
      return "W^{-}";
    case 25:
      return "H";
    case 111:
      return "\\pi^{0}";
    case 113:
      return "\\rho^{0}(770)";
    case 130:
      return "K^{0}_{L}";
    case 211:
      return "\\pi^{+}";
    case 213:
      return "\\rho(770)^{+}";
    case -213:
      return "\\rho(770)^{-}";
    case -211:
      return "\\pi^{-}";
    case 221:
      return "\\eta";
    case 223:
      return "\\omega(782)";
    case 313:
      return "K^{*}(892)^{0}";
    case 310:
      return "K^{0}_{S}";
    case 311:
      return "K^{0}";
    case -311:
      return "{\\bar K}^{0}";
    case -313:
      return "{\\bar K}^{*}(892)^{0}";
    case 321:
      return "K^{+}";
    case -321:
      return "K^{-}";
    case 323:
      return "K^{*}(892)^{+}";
    case -323:
      return "K^{*}(892)^{-}";
    case 331:
      return "\\eta^{\\prime}(958)";
    case -331:
      return "{\\bar \\eta}^{\\prime}(958)";
    case 333:
      return "\\phi(1020)";
    case 411:
      return "D^{+}";
    case -411:
      return "d^{-}";
    case 413:
      return "D^{*}(2010)^{+}";
    case -413:
      return "{\\bar D}^{*}(2010)^{+}";
    case 415:
      return "D^{*}_{2}(2460)^{+}";
    case 421:
      return "D^{0}";
    case -421:
      return "{\\bar D}^{0}";
    case 423:
      return "D^{*}(2007)^{0}";
    case -423:
      return "{\\bar D}^{*}(2007)^{0}";
    case 431:
      return "D^{+}_{s}";
    case -431:
      return "{\\bar D}^{+}_{s}";
    case 511:
      return "B^{0}";
    case -511:
      return "{\\bar B}^{0}";
    case 513:
      return "B^{*0}";
    case -513:
      return "{\\bar B}^{*0}";
    case 521:
      return "B^{+}";
    case -521:
      return "B^{-}";
    case 523:
      return "B^{*+}";
    case -523:
      return "B^{*-}";
    case 531:
      return "B^{0}_{s}";
    case -531:
      return "{\\bar B}^{0}_{s}";
    case 1114:
      return "\\Delta^{-}";
    case -1114:
      return "{\\bar \\Delta}^{-}";
    case 2112:
      return "n";
    case -2112:
      return "{\\bar n}";
    case 2114:
      return "\\Delta^{0}";
    case 2212:
      return "p";
    case -2212:
      return "{\\bar p}";
    case 2214:
      return "\\Delta^{+}";
    case -2214:
      return "{\\bar \\Delta}^{+}";
    case 2224:
      return "\\Delta^{++}";
    case -2224:
      return "{\\bar \\Delta}^{++}";
    case 3112:
      return "\\Sigma^{-}";
    case 3114:
      return "\\Sigma^{*-}";
    case 3122:
      return "\\Lambda";
    case -3122:
      return "{\\bar \\Lambda}";
    case 3212:
      return "\\Sigma^{0}";
    case -3212:
      return "{\\bar \\Sigma}^{0}";
    case 3222:
      return "\\Sigma^{+}";
    case -3222:
      return "\\Sigma^{-}";
    case 3224:
      return "\\Sigma^{*+}";
    case -3224:
      return "{\\bar \\Sigma}^{*+}";
    case 3312:
      return "\\Xi^{-}";
    case -3312:
      return "{\\bar \\Xi}^{-}";
    case 4114:
      return "\\Sigma^{*0}_{c}";
    case 4122:
      return "\\Lambda^{+}_{c}";
    case -4122:
      return "\\Lambda^{-}_{c}";
    case 4212:
      return "\\Sigma^{+}_{c}";
    case -4212:
      return "\\Sigma^{-}_{c}";
    case 4222:
      return "\\Sigma^{++}";
    case -4222:
      return "\\Sigma^{--}";
    case 5122:
      return "\\Lambda^{0}_{b}";
    case 20213:
      return "a_{1}(1260)^{+}";
    case -20213:
      return "{\\bar a}_{1}(1260)^{+}";
    default:
      console.log("PDG: " + pdg.toString());
      return "PDG: " + pdg.toString();
  }
}
