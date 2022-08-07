class DirectionInput {
  constructor() {
    this.heldDirections = [];

    this.map = {
      ArrowUp: "up",
      KeyW: "up",
      ArrowDown: "down",
      KeyS: "down",
      ArrowLeft: "left",
      KeyA: "left",
      ArrowRight: "right",
      KeyD: "right",
    };
  }

  init() {
    document.addEventListener("keydown", (e) => {
      const dir = this.map[e.code];
      if (dir && this.heldDirections.indexOf(dir) == -1) {
        this.heldDirections.unshift(dir);
        // console.log(this.heldDirections);
      }
    });

    document.addEventListener("keyup", (e) => {
      const dir = this.map[e.code];
      const idx = this.heldDirections.indexOf(dir);
      if (idx > -1) {
        this.heldDirections.splice(idx, 1);
        // console.log(this.heldDirections);
      }
    });
  }
}
