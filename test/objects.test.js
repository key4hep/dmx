import { MCParticle } from "../js/types/objects";
import { Link } from "../js/types/links";

describe("MCParticle", () => {
  let mcParticle;

  beforeEach(() => {
    mcParticle = new MCParticle(1);
    mcParticle.x = 0;
    mcParticle.y = 0;
  });

  afterEach(() => {
    mcParticle = null;
  });

  it("should return true if (x, y) coordinates are within the box", () => {
    const x = 60;
    const y = 120;

    expect(mcParticle.isHere(x, y)).toBe(true);
  });

  it("should return false if x coordinate is outside the box", () => {
    const x = 200;
    const y = 120;

    expect(mcParticle.isHere(x, y)).toBe(false);
  });

  it("should return false if y coordinate is outside the box", () => {
    const x = 50;
    const y = -1;

    expect(mcParticle.isHere(x, y)).toBe(false);
  });

  it("should return true if box is visible within the given area", () => {
    const x = 0;
    const y = 0;
    const width = 200;
    const height = 200;

    expect(mcParticle.isVisible(x, y, width, height)).toBe(true);
  });

  it("should return false if the box is to the right of the area", () => {
    mcParticle.x = 300;
    const x = 0;
    const y = 0;
    const width = 200;
    const height = 200;

    expect(mcParticle.isVisible(x, y, width, height)).toBe(false);
  });

  it("should return false if the box is to the left of the area", () => {
    mcParticle.x = -300;
    const x = 0;
    const y = 0;
    const width = 200;
    const height = 200;

    expect(mcParticle.isVisible(x, y, width, height)).toBe(false);
  });

  it("should return false if the box is below the area", () => {
    mcParticle.y = 300;
    const x = 0;
    const y = 0;
    const width = 200;
    const height = 200;

    expect(mcParticle.isVisible(x, y, width, height)).toBe(false);
  });

  it("should return false if the box is above the area", () => {
    mcParticle.y = -300;
    const x = 0;
    const y = 0;
    const width = 200;
    const height = 200;

    expect(mcParticle.isVisible(x, y, width, height)).toBe(false);
  });
});

describe("Link", () => {
  let link;
  let firstObject, secondObject;

  beforeEach(() => {
    firstObject = new MCParticle(0);
    firstObject.x = 0;
    firstObject.y = 0;
    secondObject = new MCParticle(1);
    secondObject.x = 0;
    secondObject.y = 0;
    link = new Link(firstObject, secondObject);
  });

  it("should construct correctly", () => {
    expect(link.from).toBe(firstObject);
    expect(link.to).toBe(secondObject);
  });

  it("should return true if the link is visible", () => {
    secondObject.x = 140;
    secondObject.y = 250;

    expect(link.isVisible(0, 0, 250, 250)).toBe(true);
  });

  it("should return false if the link is not visible", () => {
    expect(link.isVisible(10, 10, 50, 50)).toBe(false);
  });
});
