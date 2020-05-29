import { getRandomInt, deleteElement, addElement, getRandomFood, isCellAvailable } from "./utils.js";
import { snakeSize, screenWidth, screenHeight } from "./consts.js";
import { directions, foodTypes } from "./enums.js";

var snakeCells = document.getElementsByClassName("snake");
var game = document.getElementById("game");

let snakeCellCoords = [{X: 150, Y: 0}, {X: 120, Y: 0}, {X: 90, Y: 0}, {X: 60, Y: 0}, {X: 30, Y: 0}, {X: 0, Y: 0}];
let lastCell = [];
let timeSpeed = 300;
let basicFoods = [];
let foods = [];
let score = 0;
let currentDirection = directions.RIGHT;
let directionChanged = false;

for (let i = 0; i < snakeCells.length; i++) {
  snakeCells[i].style.transform = `translate(${snakeCellCoords[i].X}px, ${snakeCellCoords[i].Y}px)`
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
  let firstCell = {...snakeCellCoords[0]};

  let [, ...snakeTeil] = snakeCellCoords;

  
  if(!isCellAvailable(snakeTeil, firstCell)){
    let breakIndex = snakeTeil.findIndex(el => (el.X === firstCell.X && el.Y === firstCell.Y)) + 1;
    for(let i = breakIndex; i < snakeCellCoords.length; i++){
      deleteElement(`snake-cell-${i}`, game);
    }
    snakeCellCoords.splice(breakIndex, snakeCellCoords.length - breakIndex);
    score = Math.round((score / 2) / 10) * 10;
  }

  if (currentDirection > 3) currentDirection = 0;
  if (directions[currentDirection] === directions.RIGHT) {
    firstCell.X += snakeSize;
    snakeCellCoords.unshift(firstCell);
    lastCell = snakeCellCoords.pop();

    if (firstCell.X > (screenWidth - snakeSize)) {
      alert(`Game over, your score: ${score}`);
      return;
    }
  }

  if (directions[currentDirection] === directions.BOTTOM) {
    if (firstCell.Y === screenHeight - snakeSize) {
      alert(`Game over, your score: ${score}`);
      return;
    }
    firstCell.Y += snakeSize;
    snakeCellCoords.unshift(firstCell);
    lastCell = snakeCellCoords.pop();
  }

  if (directions[currentDirection] === directions.LEFT) {
    if (firstCell.X === 0) {
      alert(`Game over, your score: ${score}`);
      return;
    }
    firstCell.X -= snakeSize;
    snakeCellCoords.unshift(firstCell);
    lastCell = snakeCellCoords.pop();
  }

  if (directions[currentDirection] === directions.TOP) {
    firstCell.Y -= snakeSize;
    snakeCellCoords.unshift(firstCell);
    lastCell = snakeCellCoords.pop();
    if (firstCell.Y < 0) {
      alert(`Game over, your score: ${score}`);
      return;
    }
  }

  for (let i = 0; i < snakeCells.length; i++) {
    snakeCells[i].style.transform = `translate(${snakeCellCoords[i].X}px, ${snakeCellCoords[i].Y}px)`
  }

  directionChanged = false;
  if (basicFoods.length !== 0) {
    let firstCell = {...snakeCellCoords[0]};
    if (firstCell.X === basicFoods[0].X && firstCell.Y === basicFoods[0].Y) {
      score += 5;
      addElement("snake", snakeCellCoords.length, game, lastCell);
      snakeCellCoords = [...snakeCellCoords, lastCell];
      console.log('score', score);
      basicFoods.length = 0;
      deleteElement("basicFood", game);
      setTimeout(setBasicFood, 0);
    }
  }

  if (foods.length !== 0) {
    let firstCell = {...snakeCellCoords[0]};
    if (firstCell.X === foods[0].X && firstCell.Y === foods[0].Y) {
      if (foods[0].type === foodTypes.PEAR) {
        score += 10;
        addElement("snake", snakeCellCoords.length, game, lastCell);
        snakeCellCoords = [...snakeCellCoords, lastCell];
      }
      if (foods[0].type === foodTypes.BANANA) {
        score += 50;
        addElement("snake", snakeCellCoords.length, game, lastCell);
        snakeCellCoords = [...snakeCellCoords, lastCell];
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
  setTimeout(setOtherFood, 10000);
}

function addFood(foodType, position) {
  var newFood = document.createElement("div");
  newFood.classList.add("food");
  newFood.classList.add(foodType.toLowerCase());
  newFood.style.transform = `translate(${position.X}px, ${position.Y}px)`;
  if (foodType === foodTypes.APPLE) {
    newFood.setAttribute('id', 'basicFood');
    basicFoods.push(position);
  } else {
    newFood.setAttribute('id', 'food');
    foods.push({ ...position, type: foodType });
  }
  game.appendChild(newFood);
}

function createRandomFoodPosition(screenWidth, screenHeight, snakeSize, snakeCellCoords, basicFoods, foods){
   let filledCoords = [...snakeCellCoords, ...basicFoods, ...foods];
   let randomPosition = {X: getRandomInt(screenWidth, snakeSize), Y: getRandomInt(screenHeight, snakeSize)};
   let firstSnakeCell = {...snakeCellCoords[0]};
   while(!isCellAvailable(filledCoords, randomPosition) || (Math.abs(randomPosition.X - firstSnakeCell.X) <= snakeSize && Math.abs(randomPosition.Y - firstSnakeCell.Y) <= snakeSize)){
      randomPosition = {X: getRandomInt(screenWidth, snakeSize), Y: getRandomInt(screenHeight, snakeSize)};
   }
   return randomPosition;
}

setTimeout(snakeMove, timeSpeed);
setTimeout(setBasicFood, 0);
setTimeout(setOtherFood, 10000);

