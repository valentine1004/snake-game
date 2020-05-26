import { getRandomInt, deleteElement, addElement } from "./utils.js";
import { snakeSize, screenWidth, screenHeight } from "./consts.js";
import { directions, foodTypes } from "./enums.js";

var snakeCells = document.getElementsByClassName("snake");
var game = document.getElementById("game");

let snakeCellCoords = [[100, 0], [80, 0], [60, 0], [40, 0], [20, 0], [0, 0]];
let lastCell = [];
let timeSpeed = 300;
let basicFoods = [];
let foods = [];
let score = 0;
let currentDirection = directions.RIGHT;

for (let i = 0; i < snakeCells.length; i++) {
  snakeCells[i].style.transform = `translate(${snakeCellCoords[i][0]}px, ${snakeCellCoords[i][1]}px)`
}

const foodsInfo = {
  [foodTypes.APPLE]: {
    color: "#60c955"
  },
  [foodTypes.PEAR]: {
    color: "#ffb963"
  },
  [foodTypes.BANANA]: {
    color: "#fffd70"
  },
  [foodTypes.BOMB]: {
    color: "#000000"
  },
  [foodTypes.DOUBLE]: {
    color: "#aa21ff"
  },
  [foodTypes.SPEEDUP]: {
    color: "#ff1919"
  },
  [foodTypes.SLOWDOWN]: {
    color: "#47b9ff"
  }
}

window.addEventListener("keydown", function (event) {
  if (event.defaultPrevented) {
    return;
  }

  switch (event.key) {
    case "ArrowDown":
      if (currentDirection === directions.TOP) return;
      currentDirection = directions.BOTTOM;
      break;
    case "ArrowUp":
      if (currentDirection === directions.BOTTOM) return;
      currentDirection = directions.TOP;
      break;
    case "ArrowLeft":
      if (currentDirection === directions.RIGHT) return;
      currentDirection = directions.LEFT;
      break;
    case "ArrowRight":
      if (currentDirection === directions.LEFT) return;
      currentDirection = directions.RIGHT;
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
  addFood(getRandomFood(), coordX, coordY);
  setTimeout(setOtherFood, 10000);
}

function getRandomFood() {
  let random = Math.random();
  if (random > 0.98 || random <= 0.02) {
    return foodTypes.DOUBLE;
  }
  if ((random <= 0.98 && random > 0.88) || (random <= 0.12 && random > 0.02)) {
    let localRandom = Math.random() >= 0.5;
    if (localRandom) {
      return foodTypes.BOMB;
    } else {
      return foodTypes.BANANA;
    }
  }
  if (random > 0.32 && random <= 0.68) {
    return foodTypes.PEAR;
  }
  if ((random > 0.68 && random <= 0.88) || (random > 0.12 && random <= 0.32)) {
    let localRandom = Math.random() >= 0.5;
    if (localRandom) {
      return foodTypes.SPEEDUP;
    } else {
      return foodTypes.SLOWDOWN;
    }
  }
}

function addFood(foodType, coordX, coordY) {
  var newFood = document.createElement("div");
  newFood.classList.add("food");
  newFood.style.background = foodsInfo[foodType].color;
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

