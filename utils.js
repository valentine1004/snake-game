export function getRandomInt(max, snakeSize) {
    var div = snakeSize;
    max /= div;
    return (Math.floor(Math.random() * max)) * div;
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