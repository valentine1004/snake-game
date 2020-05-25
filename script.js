var snake = document.getElementById("snake");
var game = document.getElementById("game");

const snakeSize = 20;
const screenWidth = 800;
const screenHeight = 600;
const directions = {
  RIGHT: "RIGHT",
  BOTTOM: "BOTTOM",
  LEFT: "LEFT",
  TOP: "TOP"
};

const foodTypes = {
  APPLE: "APPLE",
  PEAR: "PEAR",
  BANANA: "BANANA",
  BOMB: "BOMB",
  DOUBLE: "DOUBLE",
  SPEEDUP: "SPEEDUP",
  SLOWUP: "SLOWUP"
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
  [foodTypes.SLOWUP]: {
    color: "#47b9ff"
  }
}

let basicFoods = [];
let foods = [];
let score = 0;
var coordX = 0;
var coordY = 0;
var currentDirection = directions.RIGHT;

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
  if (currentDirection > 3) currentDirection = 0;
  if (directions[currentDirection] === directions.RIGHT) {
    coordX += snakeSize;
    if (coordX > (screenWidth - snakeSize)) {
      alert(`Game over, your score: ${score}`);
      return;
    }
  }

  if (directions[currentDirection] === directions.BOTTOM) {
    if (coordY === screenHeight - snakeSize) {
      alert(`Game over, your score: ${score}`);
      return;
    }
    coordY += snakeSize;
  }

  if (directions[currentDirection] === directions.LEFT) {
    if (coordX === 0) {
      alert(`Game over, your score: ${score}`);
      return;
    }
    coordX -= snakeSize;
  }

  if (directions[currentDirection] === directions.TOP) {
    coordY -= snakeSize;
    if (coordY < 0) {
      alert(`Game over, your score: ${score}`);
      return;
    }

  }
  snake.style.transform = `translate(${coordX}px, ${coordY}px)`;
  if (basicFoods.length !== 0) {
    if (coordX === basicFoods[0].X && coordY === basicFoods[0].Y) {
      score += 5;
      console.log('score', score);
      basicFoods.length = 0;
      deleteElement("basicFood");
      setTimeout(setBasicFood, 0);
    }
  }

  if (foods.length !== 0) {
    if (coordX === foods[0].X && coordY === foods[0].Y) {
      if(foods[0].type === foodTypes.PEAR){
        score += 10;
      }
      if(foods[0].type === foodTypes.BANANA){
        score += 50;
      }
      if(foods[0].type === foodTypes.BOMB){
        alert(`Game over, your score: ${score}`);
        return;
      }
      if(foods[0].type === foodTypes.SPEEDUP){
        // score += 50;
      }
      if(foods[0].type === foodTypes.SLOWUP){
        // score += 50;
      }
      if(foods[0].type === foodTypes.DOUBLE){
        score *= 2;
      }
      console.log('score', score);
      foods.length = 0;
      deleteElement("food");
      setTimeout(setOtherFood, 10000);
    }
  }

  setTimeout(snakeMove, 300);
}

function setBasicFood() {
  let coordX = getRandomInt(0, screenWidth);
  let coordY = getRandomInt(0, screenHeight);
  addFood(foodTypes.APPLE, coordX, coordY);
}

function setOtherFood(){
  if(foods.length !== 0){
    deleteElement("food"); 
  }
  let coordX = getRandomInt(0, screenWidth);
  let coordY = getRandomInt(0, screenHeight);
  addFood(getRandomFood(), coordX, coordY);
  setTimeout(setOtherFood, 10000);
}

function getRandomInt(min, max) {
  var div = snakeSize;
  min /= div;
  max /= div;
  return (Math.floor(Math.random() * max)) * div;
}

function getRandomFood(){
  let random = Math.random();
  if(random > 0.98 || random <= 0.02){
    return foodTypes.SPEEDUP;
  }
  if((random <= 0.98 && random > 0.88) || (random <= 0.12 && random > 0.02)){
    let localRandom = Math.random() >= 0.5;
    if(localRandom){
      return foodTypes.BOMB;
    }else{
      return foodTypes.BANANA;
    }
  }
  if(random > 0.32 && random <= 0.68){
    return foodTypes.PEAR;
  }
  if((random > 0.68 && random <= 0.88) || (random > 0.12 && random <= 0.32)){
    let localRandom = Math.random() >= 0.5;
    if(localRandom){
      return foodTypes.SPEEDUP;
    }else{
      return foodTypes.SLOWUP;
    }
  }
}

function addFood(foodType, coordX, coordY) {
  var newElement = document.createElement("div");
  newElement.classList.add("food");
  newElement.style.background = foodsInfo[foodType].color;
  newElement.style.transform = `translate(${coordX}px, ${coordY}px)`;
  if(foodType === foodTypes.APPLE){
    newElement.setAttribute('id', 'basicFood');
    basicFoods.push({ X: coordX, Y: coordY });
  }else{
    newElement.setAttribute('id', 'food');
    foods.push({ X: coordX, Y: coordY, type: foodType });
  }
  game.appendChild(newElement);
}

function deleteElement(id){
  var elem = document.getElementById(id);
  game.removeChild(elem);
}

setTimeout(snakeMove, 300);
setTimeout(setBasicFood, 0);
setTimeout(setOtherFood, 10000);

