import { getRandomInt, deleteElement, addElement, getRandomFood, isCellAvailable, translateSnakeCells, deleteAllElements } from "./utils.js";
import { snakeSize, screenWidth, screenHeight } from "./consts.js";
import { directions, foodTypes } from "./enums.js";

var game = document.getElementById("game");
var snakeCells = document.getElementsByClassName("snake");
var scoreDom = document.getElementById("score");
var startGameBtn = document.getElementById("start-game");
var failSound = new Audio('./resources/soundFail.mp3');
var eatSound = new Audio('./resources/soundEat.mp3');

let snakeCellCoords = [{ X: 60, Y: 0 }, { X: 30, Y: 0 }, { X: 0, Y: 0 }];
let lastCell = null;
let timeSpeed = 300;
let basicFoods = [];
let foods = [];
let score = 0;
let currentDirection = directions.RIGHT;
let directionChanged = false;
let snakeMoveTimeoutId = null;
let basicFoodTimeoutId = null;
let otherFoodTimeoutId = null;

function createInitialSnake(){
  snakeCellCoords.forEach((el, idx) => {
    addElement(["snake"], `snake-cell-${idx}`, game, el);
  })
}

createInitialSnake();

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
  let firstCell = { ...snakeCellCoords[0] };
  let [, ...snakeTeil] = snakeCellCoords;

  if (!isCellAvailable(snakeTeil, firstCell)) {
    let breakIndex = snakeTeil.findIndex(el => (el.X === firstCell.X && el.Y === firstCell.Y)) + 1;
    for (let i = breakIndex; i < snakeCellCoords.length; i++) {
      deleteElement(`snake-cell-${i}`, game);
    }
    snakeCellCoords.splice(breakIndex, snakeCellCoords.length - breakIndex);
    score = Math.round((score / 2) / 10) * 10;
    scoreDom.innerText = score;
  }

  if (currentDirection > 3) currentDirection = 0;
  if (directions[currentDirection] === directions.RIGHT) {
    firstCell.X += snakeSize;

    if (firstCell.X > (screenWidth - snakeSize)) {
      failSound.play();
      alert(`Game over, your score: ${score}`);
      stopGame();
      return;
    }
  }

  if (directions[currentDirection] === directions.BOTTOM) {
    if (firstCell.Y === screenHeight - snakeSize) {
      failSound.play();
      alert(`Game over, your score: ${score}`);
      stopGame();
      return;
    }
    firstCell.Y += snakeSize;
  }

  if (directions[currentDirection] === directions.LEFT) {
    if (firstCell.X === 0) {
      failSound.play();
      alert(`Game over, your score: ${score}`);
      stopGame();
      return;
    }
    firstCell.X -= snakeSize;
  }

  if (directions[currentDirection] === directions.TOP) {
    firstCell.Y -= snakeSize;
    if (firstCell.Y < 0) {
      failSound.play();
      alert(`Game over, your score: ${score}`);
      stopGame();
      return;
    }
  }
  snakeCellCoords.unshift(firstCell);
  lastCell = snakeCellCoords.pop();
  translateSnakeCells(snakeCells, snakeCellCoords);
  directionChanged = false;

  if (basicFoods.length !== 0) {
    let firstCell = { ...snakeCellCoords[0] };
    if (firstCell.X === basicFoods[0].X && firstCell.Y === basicFoods[0].Y) {
      score += 5;
      eatSound.play();
      scoreDom.innerText = score;
      addElement(["snake"], `snake-cell-${snakeCellCoords.length}`, game, lastCell);
      snakeCellCoords = [...snakeCellCoords, lastCell];
      basicFoods.length = 0;
      deleteElement("basicFood", game);
      basicFoodTimeoutId = setTimeout(setBasicFood, 0);
    }
  }

  if (foods.length !== 0) {
    let firstCell = { ...snakeCellCoords[0] };
    if (firstCell.X === foods[0].X && firstCell.Y === foods[0].Y) {
      if (foods[0].type === foodTypes.PEAR) {
        score += 10;
        scoreDom.innerText = score;
        eatSound.play();
        addElement(["snake"], `snake-cell-${snakeCellCoords.length}`, game, lastCell);
        snakeCellCoords = [...snakeCellCoords, lastCell];
      }
      if (foods[0].type === foodTypes.BANANA) {
        score += 50;
        scoreDom.innerText = score;
        eatSound.play();
        addElement(["snake"], `snake-cell-${snakeCellCoords.length}`, game, lastCell);
        snakeCellCoords = [...snakeCellCoords, lastCell];
      }
      if (foods[0].type === foodTypes.BOMB) {
        failSound.play();
        alert(`Game over, your score: ${score}`);
        stopGame();
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
        scoreDom.innerText = score;
      }
      foods.length = 0;
      deleteElement("food", game);
    }
  }

  snakeMoveTimeoutId = setTimeout(snakeMove, timeSpeed);
}

function setBasicFood() {
  let position = createRandomFoodPosition(screenWidth, screenHeight, snakeSize, snakeCellCoords, basicFoods, foods);
  addFood(foodTypes.APPLE, position);
}

function setOtherFood() {
  if (foods.length !== 0) {
    foods.length = 0;
    deleteElement("food", game);
  }
  let position = createRandomFoodPosition(screenWidth, screenHeight, snakeSize, snakeCellCoords, basicFoods, foods);
  let randomFood = getRandomFood(foodTypes);
  addFood(randomFood, position);
  otherFoodTimeoutId = setTimeout(setOtherFood, 10000);
}

function addFood(foodType, position) {
  if (foodType === foodTypes.APPLE) {
    addElement(["food", foodType.toLowerCase()], "basicFood", game, position);
    basicFoods.push(position);
  } else {
    addElement(["food", foodType.toLowerCase()], "food", game, position);
    foods.push({ ...position, type: foodType });
  }
}

function createRandomFoodPosition(screenWidth, screenHeight, snakeSize, snakeCellCoords, basicFoods, foods) {
  let filledCoords = [...snakeCellCoords, ...basicFoods, ...foods];
  let randomPosition = { X: getRandomInt(screenWidth, snakeSize), Y: getRandomInt(screenHeight, snakeSize) };
  let firstSnakeCell = { ...snakeCellCoords[0] };
  while (!isCellAvailable(filledCoords, randomPosition) || (Math.abs(randomPosition.X - firstSnakeCell.X) <= snakeSize && Math.abs(randomPosition.Y - firstSnakeCell.Y) <= snakeSize)) {
    randomPosition = { X: getRandomInt(screenWidth, snakeSize), Y: getRandomInt(screenHeight, snakeSize) };
  }
  return randomPosition;
}

startGameBtn.addEventListener("click", function(){
  stopGame();
  snakeMoveTimeoutId = setTimeout(snakeMove, timeSpeed);
  basicFoodTimeoutId = setTimeout(setBasicFood, 0);
  otherFoodTimeoutId = setTimeout(setOtherFood, 10000);
})

function stopGame(){
  clearTimeout(snakeMoveTimeoutId);
  clearTimeout(basicFoodTimeoutId);
  clearTimeout(otherFoodTimeoutId);
  snakeCellCoords = [{ X: 60, Y: 0 }, { X: 30, Y: 0 }, { X: 0, Y: 0 }];
  lastCell = [];
  timeSpeed = 300;
  basicFoods = [];
  foods = [];
  score = 0;
  scoreDom.innerText = score;
  currentDirection = directions.RIGHT;
  directionChanged = false;
  deleteAllElements(game);
  createInitialSnake();
}


