var snake = document.getElementById("snake"); 
var snakeSize = 20;
var coordX = 0;
var coordY = 0;
const screenWidth = 800;
const screenHeight = 600;
const directions = ["right", "bottom", "left", "top"];
var currentDirection = 0;

window.addEventListener("keyup", function (event) {
    if (event.defaultPrevented) {
      return;
    }
    
    switch (event.key) {
      case "ArrowDown":
        currentDirection = 1;
        break;
      case "ArrowUp":
        currentDirection = 3;
        break;
      case "ArrowLeft":
        currentDirection = 2;
        break;
      case "ArrowRight":
        currentDirection = 0;
        break;
      default:
        return; // Quit when this doesn't handle the key event.
    }
  
    // Cancel the default action to avoid it being handled twice
    event.preventDefault();
  }, true);

function snakeMove() {
    if (currentDirection > 3) currentDirection = 0;
    if(directions[currentDirection] === "right"){
        coordX++;
        if(coordX > (screenWidth - snakeSize)){
            alert("Game over");
            return;
        }
    }

    if(directions[currentDirection] === "bottom"){
        coordY++;
        if(coordY === screenHeight - snakeSize){
          alert("Game over");
          return;
        }
    }

    if(directions[currentDirection] === "left"){
        coordX--;
        if(coordX === 0){
          alert("Game over");
          return;
        }
    }

    if(directions[currentDirection] === "top"){
        coordY--;
        if(coordY === 0){
          alert("Game over");
          return;
        }
    }
    snake.style.transform = `translate(${coordX}px, ${coordY}px)`;
    
    window.requestAnimationFrame(snakeMove);
  }
  
window.requestAnimationFrame(snakeMove);

