import { getRandomInt, deleteElement, addElement, getRandomFood } from "./utils.js";
import { snakeSize, screenWidth, screenHeight } from "./consts.js";
import { directions, foodTypes } from "./enums.js";

var snakeCells = document.getElementsByClassName("snake");
var game = document.getElementById("game");

let snakeCellCoords = [[150, 0], [120, 0], [90, 0], [60, 0], [30, 0], [0, 0]];
let lastCell = [];
let timeSpeed = 300;
let basicFoods = [];
let foods = [];
let score = 0;
let currentDirection = directions.RIGHT;
let directionChanged = false;

for (let i = 0; i < snakeCells.length; i++) {
  snakeCells[i].style.transform = `translate(${snakeCellCoords[i][0]}px, ${snakeCellCoords[i][1]}px)`
}

window.addEventListener("keydown", function (event) {
  if (event.defaultPrevented) {
    return;
  }
  switch (event.key) {
    case "ArrowDown":
      if (currentDirection === directions.TOP || directionChanged) break;
      currentDirection = directions.BOTTOM;
      directionChanged = true;
      break;
    case "ArrowUp":
      if (currentDirection === directions.BOTTOM || directionChanged) break;
      currentDirection = directions.TOP;
      directionChanged = true;
      break;
    case "ArrowLeft":
      if (currentDirection === directions.RIGHT || directionChanged) break;
      currentDirection = directions.LEFT;
      directionChanged = true;
      break;
    case "ArrowRight":
      if (currentDirection === directions.LEFT || directionChanged) break;
      currentDirection = directions.RIGHT;
      directionChanged = true;
      break;
    default:
      return;
  }

  event.preventDefault();
}, true);

function snakeMove() {
  let firstCell = snakeCellCoords[0];
  let [X, Y] = firstCell;

  let [, ...snakeTeil] = snakeCellCoords;
  snakeTeil = snakeTeil.map(el => el.toString());

  if (currentDirection > 3) currentDirection = 0;
  if (directions[currentDirection] === directions.RIGHT) {
    X += snakeSize;
    snakeCellCoords.unshift([X, Y]);
    lastCell = snakeCellCoords.pop();
    if (X > (screenWidth - snakeSize) || snakeTeil.includes([X, Y].toString())) {
      alert(`Game over, your score: ${score}`);
      return;
    }
  }

  if (directions[currentDirection] === directions.BOTTOM) {
    if (Y === screenHeight - snakeSize || snakeTeil.includes([X, Y].toString())) {
      alert(`Game over, your score: ${score}`);
      return;
    }
    Y += snakeSize;
    snakeCellCoords.unshift([X, Y]);
    lastCell = snakeCellCoords.pop();
  }

  if (directions[currentDirection] === directions.LEFT) {
    if (X === 0 || snakeTeil.includes([X, Y].toString())) {
      alert(`Game over, your score: ${score}`);
      return;
    }
    X -= snakeSize;
    snakeCellCoords.unshift([X, Y]);
    lastCell = snakeCellCoords.pop();
  }

  if (directions[currentDirection] === directions.TOP) {
    Y -= snakeSize;
    snakeCellCoords.unshift([X, Y]);
    lastCell = snakeCellCoords.pop();
    if (Y < 0 || snakeTeil.includes([X, Y].toString())) {
      alert(`Game over, your score: ${score}`);
      return;
    }
  }

  for (let i = 0; i < snakeCells.length; i++) {
    snakeCells[i].style.transform = `translate(${snakeCellCoords[i][0]}px, ${snakeCellCoords[i][1]}px)`
  }
  directionChanged = false;
  if (basicFoods.length !== 0) {
    let firstCell = snakeCellCoords[0];
    let [X, Y] = firstCell;
    if (X === basicFoods[0].X && Y === basicFoods[0].Y) {
      score += 5;
      snakeCellCoords = [...snakeCellCoords, lastCell];
      addElement("snake", game, lastCell);
      console.log('score', score);
      basicFoods.length = 0;
      deleteElement("basicFood", game);
      setTimeout(setBasicFood, 0);
    }
  }

  if (foods.length !== 0) {
    let firstCell = snakeCellCoords[0];
    let [X, Y] = firstCell;
    if (X === foods[0].X && Y === foods[0].Y) {
      if (foods[0].type === foodTypes.PEAR) {
        score += 10;
        snakeCellCoords = [...snakeCellCoords, lastCell];
        addElement("snake", game, lastCell);
      }
      if (foods[0].type === foodTypes.BANANA) {
        score += 50;
        snakeCellCoords = [...snakeCellCoords, lastCell];
        addElement("snake", game, lastCell);
      }
      if (foods[0].type === foodTypes.BOMB) {
        alert(`Game over, your score: ${score}`);
        return;
      }
      if (foods[0].type === foodTypes.SPEEDUP) {
        timeSpeed /= 2;
      }
      if (foods[0].type === foodTypes.SLOWDOWN) {
        timeSpeed *= 2;
      }
      if (foods[0].type === foodTypes.DOUBLE) {
        score *= 2;
      }
      console.log('score', score);
      foods.length = 0;
      deleteElement("food", game);
    }
  }

  setTimeout(snakeMove, timeSpeed);
}

function setBasicFood() {
  let coordX = getRandomInt(screenWidth, snakeSize);
  let coordY = getRandomInt(screenHeight, snakeSize);
  addFood(foodTypes.APPLE, coordX, coordY);
}

function setOtherFood() {
  if (foods.length !== 0) {
    foods.length = 0;
    deleteElement("food", game);
  }
  let coordX = getRandomInt(screenWidth, snakeSize);
  let coordY = getRandomInt(screenHeight, snakeSize);
  let randomFood = getRandomFood(foodTypes);
  addFood(randomFood, coordX, coordY);
  setTimeout(setOtherFood, 10000);
}

function addFood(foodType, coordX, coordY) {
  var newFood = document.createElement("div");
  newFood.classList.add("food");
  newFood.classList.add(foodType.toLowerCase());
  newFood.style.transform = `translate(${coordX}px, ${coordY}px)`;
  if (foodType === foodTypes.APPLE) {
    newFood.setAttribute('id', 'basicFood');
    basicFoods.push({ X: coordX, Y: coordY });
  } else {
    newFood.setAttribute('id', 'food');
    foods.push({ X: coordX, Y: coordY, type: foodType });
  }
  game.appendChild(newFood);
}

setTimeout(snakeMove, timeSpeed);
setTimeout(setBasicFood, 0);
setTimeout(setOtherFood, 10000);

