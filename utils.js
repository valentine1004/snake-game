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

export function addElement(className, parentElement, position){
    var newElement = document.createElement("div");
    newElement.classList.add(className);
    newElement.style.transform = `translate(${position[0]}px, ${position[1]}px)`
    parentElement.appendChild(newElement);
}