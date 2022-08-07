const carCanvas = document.getElementById("carCanvas");
const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 500;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

// functional buttons
function reload() {
  window.location.reload();
}
let paused = false;
const pauseBtn = document.getElementById("pauseBtn");
function togglePause() {
  if (paused) {
    paused = false;
    pauseBtn.innerText = "⏸︎";
    animate();
  } else {
    paused = true;
    pauseBtn.innerText = "⏺︎";
  }
}
let laneCount = JSON.parse(localStorage.getItem("difficulty")) || 3;
const laneBtn = document.getElementById("difficultyBtn");
laneBtn.innerText = laneCount;
function increaseDifficulty() {
  if (laneCount === 5) window.location.reload();
  localStorage.setItem("difficulty", laneCount + 1);
  window.location.reload();
}
function decreaseDifficulty() {
  if (laneCount === 2) window.location.reload();
  localStorage.setItem("difficulty", laneCount - 1);
  window.location.reload();
}

// functions to save or discard bestBrain
function save() {
  localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
}
function discard() {
  localStorage.removeItem("bestBrain");
}
// generate mutiple cars that are using the neural network
function generateCars(N, road) {
  let cars = [];
  for (let i = 0; i < N; i++) {
    cars.push(new Car(road.getLaneCenter(1), 200, 30, 50, "AI"));
  }
  return cars;
}

// canvas width should be proportional to the number of lanes
carCanvas.width = (200 * laneCount) / 3;

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.92, laneCount);

const N = Math.floor((50 * 3) / laneCount);
const cars = generateCars(N, road);
// cars = [new Car(road.getLaneCenter(1), 200, 30, 50, true)];
let bestCar = cars[0];
// if the bestBrain neuraNetwork is saved, use that for generated cars
const bestBrain = localStorage.getItem("bestBrain");
const defaultBrain = utils.defaultBrain;
for (let i = 0; i < cars.length; i++) {
  if (bestBrain) cars[i].brain = JSON.parse(localStorage.getItem("bestBrain"));
  else cars[i].brain = JSON.parse(defaultBrain);
  if (i != 0) {
    NeuralNetwork.mutate(cars[i].brain, 0.1);
  }
}

// randomly generate traffic
const traffic = [];
const M = Math.floor((50 * laneCount) / 3);
let currentPosition = 50;
for (let i = 0; i < M; i++) {
  const noCars = Math.floor(Math.random() * (laneCount - 1)) + 1;
  let lanes = [...Array(laneCount + 1).keys()].slice(1);
  lanes.sort(() => Math.random() - 0.5);
  lanes = lanes.slice(0, noCars);

  lanes.forEach((lane) => {
    traffic.push(
      new Car(
        road.getLaneCenter(lane),
        currentPosition,
        30,
        50,
        false,
        utils.getRandomColor()
      )
    );
  });

  currentPosition -= (200 * laneCount) / 3;
}

animate();
function animate() {
  traffic.forEach((c) => c.update([], []));
  for (let i = 0; i < cars.length; i++) {
    cars[i].update(road.borders, traffic);
  }

  // the one travelling furthest becomes the "focused/main POV" car
  for (let i = 0; i < cars.length; i++) {
    if (cars[i].y < bestCar.y) bestCar = cars[i];
  }

  carCanvas.height = window.innerHeight; //this also clears the canvas
  networkCanvas.height = window.innerHeight;

  // moving everything relative to the focused car
  carCtx.save();
  carCtx.translate(0, -bestCar.y + carCanvas.height * 0.5);

  road.draw(carCtx);
  traffic.forEach((c) => c.draw(carCtx));
  carCtx.globalAlpha = 0.2;
  cars.forEach((c) => c.draw(carCtx));
  carCtx.globalAlpha = 1;
  bestCar.draw(carCtx, true);

  Visualiser.drawNetwork(networkCtx, bestCar.brain);

  carCtx.restore();
  if (!paused) requestAnimationFrame(animate);
}
