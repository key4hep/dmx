export const colors = {
  "daughters": "#00AA00",
  "parents": "#AA0000",
  "mcreco": "#0000AA",
  "particles": "#AA00AA",
};

export function generateRandomColor() {
  return "#" + ((0xffffff * Math.random()) << 0).toString(16).padStart(6, "0");
}

export class Link {
  // we may create a specific class for each type if needed
  constructor(from, to) {
    this.from = from;
    this.to = to;
    this.color = "#A00";
    this.xShift = 0;
  }

  draw(ctx) {
    const boxFrom = this.from;
    const boxTo = this.to;

    const fromX = boxFrom.x + boxFrom.width / 2;
    const fromY = boxFrom.y + boxFrom.height;
    const toX = boxTo.x + boxTo.width / 2;
    const toY = boxTo.y;

    if (toY > fromY) {
      var cpFromY = (toY - fromY) / 2 + fromY;
      var cpToY = cpFromY;
    } else {
      cpFromY = (fromY - toY) / 2 + fromY;
      cpToY = toY - (fromY - toY) / 2;
    }

    if (toX > fromX) {
      var cpFromX = (toX - fromX) / 4 + fromX;
      var cpToX = (3 * (toX - fromX)) / 4 + fromX;
    } else {
      cpFromX = (3 * (fromX - toX)) / 4 + toX;
      cpToX = (fromX - toX) / 4 + toX;
    }

    /*
    drawCross(ctx, fromX, fromY, "blue");
    drawCross(ctx, toX, toY, "green");
    drawCross(ctx, cpFromX, cpFromY, "yellow");
    drawLine(ctx, fromX, fromY, cpFromX, cpFromY, "yellow")
    drawCross(ctx, cpToX, cpToY, "orange");
    drawLine(ctx, toX, toY, cpToX, cpToY, "orange")
    */

    ctx.save();
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(fromX + this.xShift, fromY);
    ctx.bezierCurveTo(
      cpFromX + this.xShift,
      cpFromY,
      cpToX + this.xShift,
      cpToY,
      toX + this.xShift,
      toY
    );
    ctx.stroke();
    ctx.restore();

    /*
    ctx.save();
    ctx.font = "14px sans-serif";
    ctx.fillStyle = this.color;
    const idText = "ID: " + this.id;
    ctx.fillText(idText,
                 cpToX, cpToY);
    ctx.restore();
    */
  }

  isVisible(x, y, width, height) {
    const boxFrom = this.from;
    const boxTo = this.to;

    const fromX = boxFrom.x + boxFrom.width / 2;
    const fromY = boxFrom.y + boxFrom.height;
    const toX = boxTo.x + boxTo.width / 2;
    const toY = boxTo.y;

    const boxX = Math.min(fromX, toX);
    const boxWidth = Math.abs(fromX - toX);
    const boxY = Math.min(fromY, toY);
    const boxHeight = Math.abs(fromY - toY);

    /*
    console.log("boxX: ", this.boxX);
    console.log("boxY: ", this.boxY);
    console.log("boxWidth: ", this.boxWidth);
    console.log("boxHeight: ", this.boxHeight);
    */

    return (
      x + width > boxX &&
      x < boxX + boxWidth &&
      y + height > boxY &&
      y < boxY + boxHeight
    );
  }
}

export class ParentLink extends Link {
  constructor(from, to) {
    super(to, from);
    this.color = colors["parents"];
    this.xShift = 3;
    // parent is this.from
    // current object is this.to
  }
}

export class DaughterLink extends Link {
  constructor(from, to) {
    super(from, to);
    this.color = colors["daughters"];
    this.xShift = -3;
    // current object is this.from
    // daughter is this.to
  }
}

export class MCRecoParticleAssociation extends Link {
  constructor(from, to, weight) {
    super(from, to);
    this.color = colors["mcreco"];
    this.weight = weight;
  }

  draw(ctx) {
    const boxFrom = this.from;
    const boxTo = this.to;

    const fromX = boxFrom.x + boxFrom.width / 2;
    const fromY = boxFrom.y + boxFrom.height / 2;

    const toX = boxTo.x + boxTo.width / 2;
    const toY = boxTo.y + boxTo.height / 2;

    ctx.save();
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();
    ctx.restore();
  }
}

export class Particles extends Link {
  constructor(from, to) {
    super(from, to);
    this.color = colors["particles"];
  }
}

export const linkTypes = {
  "parents": ParentLink,
  "daughters": DaughterLink,
  "trackerHits": Link,
  "startVertex": Link,
  "particles": Particles,
  "clusters": Link,
  "edm4hep::MCRecoParticleAssociation": MCRecoParticleAssociation,
};
