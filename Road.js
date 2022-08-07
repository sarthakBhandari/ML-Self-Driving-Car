class Road {
  constructor(x, width, laneCount = 3) {
    this.x = x;
    this.width = width;
    this.laneCount = laneCount;

    this.left = x - width / 2;
    this.right = x + width / 2;

    const infinity = 10000000;
    this.top = -infinity;
    this.bottom = infinity;

    const topLeft = { x: this.left, y: this.top };
    const bottomLeft = { x: this.left, y: this.bottom };
    const topRight = { x: this.right, y: this.top };
    const bottomRight = { x: this.right, y: this.bottom };
    this.borders = [
      [topLeft, bottomLeft],
      [topRight, bottomRight],
    ];
  }

  getLaneCenter(laneIndex) {
    const laneWidth = this.width / this.laneCount;
    if (laneIndex >= this.laneCount) return 0.5 * laneWidth + this.left;
    return laneWidth * laneIndex + 0.5 * laneWidth + this.left;
  }

  draw(ctx) {
    ctx.strokeStyle = "white";
    ctx.lineWidth = 5;

    ctx.setLineDash([20, 20]);
    for (let i = 1; i < this.laneCount; i++) {
      const x = utils.linearInterp(this.left, this.right, i / this.laneCount);
      ctx.beginPath();
      ctx.moveTo(x, this.top);
      ctx.lineTo(x, this.bottom);
      ctx.stroke();
    }

    ctx.setLineDash([]);
    this.borders.forEach((border) => {
      const [top, bottom] = border;
      ctx.beginPath();
      ctx.moveTo(top.x, top.y);
      ctx.lineTo(bottom.x, bottom.y);
      ctx.stroke();
    });
  }
}
