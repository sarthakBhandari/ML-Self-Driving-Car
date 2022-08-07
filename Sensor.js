class Sensor {
  constructor(car) {
    this.car = car;
    this.rayCount = 5;
    this.rayLength = 200;
    this.raySpread = Math.PI / 3;

    this.rays = [];
    this.readings = [];
  }

  update(roadBorders, traffic) {
    this.castRays();

    this.readings = [];
    this.rays.forEach((ray) => {
      this.readings.push(this.getReading(ray, roadBorders, traffic));
    });
  }

  getReading(ray, roadBorders, traffic) {
    let touches = [];

    roadBorders.forEach((border) => {
      const touch = utils.getIntersection(ray[0], ray[1], border[0], border[1]);

      if (touch) {
        touches.push(touch);
      }
    });

    traffic.forEach((c) => {
      for (let i = 0; i < c.polygon.length; i++) {
        const touch = utils.getIntersection(
          ray[0],
          ray[1],
          c.polygon[i],
          c.polygon[(i + 1) % c.polygon.length]
        );

        if (touch) {
          touches.push(touch);
        }
      }
    });

    if (touches.length > 0) {
      const offests = touches.map((touch) => touch.offset);
      const minOffset = Math.min(...offests);
      return touches.find((touch) => touch.offset === minOffset);
    }
    return null;
  }

  castRays() {
    this.rays = [];

    for (let i = 0; i < this.rayCount; i++) {
      const rayAngle =
        utils.linearInterp(
          -this.raySpread / 2,
          this.raySpread / 2,
          this.rayCount == 1 ? 0.5 : i / (this.rayCount - 1)
        ) + this.car.angle;

      const start = { x: this.car.x, y: this.car.y };
      const end = {
        x: this.car.x + Math.sin(rayAngle) * this.rayLength,
        y: this.car.y - Math.cos(rayAngle) * this.rayLength,
      };

      this.rays.push([start, end]);
    }

    // this.rays.push([
    //   { x: this.car.x, y: this.car.y + this.car.height / 2 - 5 },
    //   {
    //     x:
    //       this.car.x +
    //       Math.sin(this.car.angle + Math.PI / 2 + 0.5) * this.rayLength,
    //     y:
    //       this.car.y +
    //       this.car.height / 2 -
    //       5 -
    //       Math.cos(this.car.angle + Math.PI / 2 + 0.5) * this.rayLength,
    //   },
    // ]);
    // this.rays.push([
    //   { x: this.car.x, y: this.car.y + this.car.height / 2 - 5 },
    //   {
    //     x:
    //       this.car.x +
    //       Math.sin(this.car.angle - Math.PI / 2 - 0.5) * this.rayLength,
    //     y:
    //       this.car.y +
    //       this.car.height / 2 -
    //       5 -
    //       Math.cos(this.car.angle - Math.PI / 2 - 0.5) * this.rayLength,
    //   },
    // ]);
  }

  draw(ctx) {
    for (let i = 0; i < this.rayCount; i++) {
      ctx.lineWidth = 2;
      ctx.strokeStyle = "yellow";

      ctx.beginPath();
      ctx.moveTo(this.rays[i][0].x, this.rays[i][0].y);
      ctx.lineTo(this.rays[i][1].x, this.rays[i][1].y);
      ctx.stroke();

      const end = this.readings[i];
      if (end) {
        ctx.lineWidth = 2.2;
        ctx.strokeStyle = "black";

        ctx.beginPath();
        ctx.moveTo(end.x, end.y);
        ctx.lineTo(this.rays[i][1].x, this.rays[i][1].y);
        ctx.stroke();
      }
    }
  }
}
