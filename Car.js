class Car {
  constructor(
    x,
    y,
    width,
    height,
    controlled = false,
    color = "rgba(0, 94, 255, 1)"
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.controlled = controlled;

    this.speed = 0;
    this.acceleration = 0.2;
    this.maxSpeed = controlled ? 3 : 2;
    this.friction = 0.04;
    this.angle = 0;
    this.damage = false;

    this.direction = {
      heldDirections: ["up"],
    };
    if (controlled) {
      this.sensor = new Sensor(this, controlled);

      this.brain = new NeuralNetwork([
        this.sensor.rayCount,
        this.sensor.rayCount + 1,
        4,
      ]);
      if (controlled === true) {
        this.direction = new DirectionInput();
        this.direction.init();
      }
    }

    this.img = new Image();
    this.img.src = "car.png";
    this.mask = document.createElement("canvas");
    this.mask.width = width;
    this.mask.height = height;

    const maskCtx = this.mask.getContext("2d");
    this.img.onload = () => {
      maskCtx.fillStyle = color;
      maskCtx.rect(0, 0, this.width, this.height);
      maskCtx.fill();

      maskCtx.globalCompositeOperation = "destination-atop";
      maskCtx.drawImage(this.img, 0, 0, this.width, this.height);
    };
  }

  update(roadBorders, traffic) {
    if (!this.damage) {
      this.move();
      this.polygon = this.createPolygon();
      this.damage = this.getDamage(roadBorders, traffic);
    }

    if (this.controlled) {
      this.sensor.update(roadBorders, traffic);

      const inputs = this.sensor.readings.map((r) =>
        r == null ? 0 : 1 - r.offset
      );
      const outputs = NeuralNetwork.feedForward(inputs, this.brain);
      if (this.controlled === "AI") {
        this.direction.heldDirections = [];
        for (let i = 0; i < outputs.length; i++) {
          if (outputs[i]) {
            this.direction.heldDirections.push(utils.keyMap(i));
          }
        }
      }
    }
  }

  getDamage(roadBorders, traffic) {
    for (let i = 0; i < roadBorders.length; i++) {
      if (utils.polysIntersect(this.polygon, roadBorders[i])) return true;
    }
    for (let i = 0; i < traffic.length; i++) {
      if (utils.polysIntersect(this.polygon, traffic[i].polygon)) return true;
    }
    return false;
  }

  createPolygon() {
    let points = [];
    const alpha = Math.atan2(this.width, this.height);
    const hyp = Math.hypot(this.height, this.width) / 2;
    points.push({
      x: this.x + hyp * Math.sin(this.angle + alpha),
      y: this.y - hyp * Math.cos(this.angle + alpha),
    });
    points.push({
      x: this.x + hyp * Math.sin(this.angle - alpha),
      y: this.y - hyp * Math.cos(this.angle - alpha),
    });
    points.push({
      x: this.x + hyp * Math.sin(alpha + this.angle - Math.PI),
      y: this.y - hyp * Math.cos(alpha + this.angle - Math.PI),
    });
    points.push({
      x: this.x + hyp * Math.sin(-alpha + this.angle - Math.PI),
      y: this.y - hyp * Math.cos(-alpha + this.angle - Math.PI),
    });
    return points;
  }

  move() {
    if (this.direction.heldDirections.indexOf("up") > -1) {
      this.speed += this.acceleration;
    }
    if (this.direction.heldDirections.indexOf("down") > -1) {
      this.speed -= this.acceleration;
    }

    if (this.speed > 0) {
      this.speed -= this.friction;
    }
    if (this.speed < 0) {
      this.speed += this.friction;
    }
    if (Math.abs(this.speed) < this.friction) {
      this.speed = 0;
    }
    if (this.speed > this.maxSpeed) {
      this.speed = this.maxSpeed;
    }
    if (this.speed < -this.maxSpeed / 2) {
      this.speed = -this.maxSpeed / 2;
    }

    if (this.direction.heldDirections.indexOf("right") > -1) {
      if (this.speed >= 0) this.angle += 0.02;
      else this.angle -= 0.02;
    }
    if (this.direction.heldDirections.indexOf("left") > -1) {
      if (this.speed >= 0) this.angle -= 0.02;
      else this.angle += 0.02;
    }

    this.y -= Math.cos(this.angle) * this.speed;
    this.x += Math.sin(this.angle) * this.speed;
  }

  draw(ctx, drawSensor = false) {
    if (this.controlled && drawSensor) this.sensor.draw(ctx);

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    if (!this.damage) {
      ctx.drawImage(
        this.mask,
        -this.width / 2,
        -this.height / 2,
        this.width,
        this.height
      );
      ctx.globalCompositeOperation = "multiply";
    }

    ctx.drawImage(
      this.img,
      -this.width / 2,
      -this.height / 2,
      this.width,
      this.height
    );
    ctx.restore();

    // ctx.fillStyle = color;
    // if (this.damage) {
    //   ctx.fillStyle = "red";
    // }

    // ctx.beginPath();
    // ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
    // for (let i = 1; i < this.polygon.length; i++) {
    //   ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
    // }
    ctx.fill();
  }
}
