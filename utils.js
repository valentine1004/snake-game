export function getRandomInt(max, snakeSize) {
    var div = snakeSize;
    max /= div;
    return (Math.floor(Math.random() * max)) * div;
}

export function getRandomFood(foodTypes) {
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

export function deleteElement(childId, parentElement){
    var elem = document.getElementById(childId);
    parentElement.removeChild(elem);
}

export function deleteAllElements(parentElement){
   parentElement.innerHTML = '';
}

export function addElement(arrayClasses, id, parentElement, position){
    var newElement = document.createElement("div");
    arrayClasses.forEach(el => {
      newElement.classList.add(el);
    })
    newElement.setAttribute('id', id);
    newElement.style.transform = `translate(${position.X}px, ${position.Y}px)`
    parentElement.appendChild(newElement);
}

export function isCellAvailable(cells, currentCell){
  let result = true;
  for(let i = 0; i < cells.length; i++){
    if(cells[i].X === currentCell.X && cells[i].Y === currentCell.Y){
      result = false;
      break;
    }
  }
  return result;
}

export function translateSnakeCells(snakeCells, snakeCellCoords){
  for (let i = 0; i < snakeCells.length; i++) {
    snakeCells[i].style.transform = `translate(${snakeCellCoords[i].X}px, ${snakeCellCoords[i].Y}px)`
  }
}