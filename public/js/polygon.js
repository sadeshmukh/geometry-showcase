let sidesInput = document.getElementById("sidesInput");
let sides = 4;
const maxSides = 20;
const minSides = 3;
sidesInput.value = sides;
sidesInput.max = maxSides;
sidesInput.min = minSides;

// For old polygon drawing
let sideLength = 200;
const maxSideLength = 1000;
const minSideLength = 50;
const sideLengthIncrement = 10;

const sizeInput = document.getElementById("sizeInput");
let inscribedRadius = 150;
const maxRadius = 500;
const minRadius = 30;
const radiusIncrement = 5;
sizeInput.value = inscribedRadius;
sizeInput.max = maxRadius;
sizeInput.min = minRadius;
sizeInput.step = radiusIncrement;

const dotWidth = 20;
const showDots = true;

let showCircumscribedCircle = false;
const circleLineWidth = 2;

const circleAreaText = document.getElementById("circleAreaText");
const polygonAreaText = document.getElementById("polygonAreaText");
const circlePolygonRatioText = document.getElementById(
  "circlePolygonRatioText"
);

// Canvas
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

const initialWidth = window.innerWidth - 50;
const initialHeight = window.innerHeight - 300;

context.canvas.width = initialWidth;
context.canvas.height = initialHeight;

context.lineWidth = 5;
context.strokeStyle = "#ffffff";

function sizeChange({ value }) {
  inscribedRadius = parseInt(value);
  updateAll();
}

function sidesChange({ value }) {
  sides = parseInt(value);
  updateAll();
}

function toggleCircleShown() {
  showCircumscribedCircle = !showCircumscribedCircle;
  updateAll();
}

function calculateCircleArea(radius) {
  return Math.PI * radius ** 2;
}

function calculatePolygonArea(radius, n) {
  let angle = Math.PI - Math.PI * ((n - 2) / n);
  const outerSideLength =
    (radius / Math.sin(angle / 2)) * Math.sin(Math.PI - angle);
  const apothem = Math.sqrt(radius ** 2 - (outerSideLength / 2) ** 2);
  console.log(radius, outerSideLength);
  return (1 / 2) * apothem * outerSideLength * n;
}

// Not in use - draws by actually calculating each point, rather than drawPolygonInscribed() which draws points from center
function drawPolygonBySide(n, inputSideLength) {
  // Converted to radians
  let angle = Math.PI - Math.PI * ((n - 2) / n);
  const centerDistance = Math.abs(
    (inputSideLength / Math.sin(Math.PI - angle)) * Math.sin(angle / 2)
  );
  let innerTriangleHeight = Math.abs(Math.sin(angle / 2) * centerDistance);
  if (sides % 2 === 0) {
    innerTriangleHeight *= 2;
  } else {
    innerTriangleHeight += centerDistance;
  }
  const polygonHeight = innerTriangleHeight;
  console.log(centerDistance, polygonHeight);

  let contextX = (initialWidth - inputSideLength) / 2;
  let contextY = (initialHeight - polygonHeight) / 2;
  context.beginPath();
  context.moveTo(contextX, contextY);
  for (let i = 0; i < n; i++) {
    contextX += inputSideLength * Math.cos(angle * i);
    contextY += inputSideLength * Math.sin(angle * i);
    context.lineTo(contextX, contextY);
  }
  context.stroke();
}

function drawPolygonInscribed(n, radius) {
  let angle = (2 * Math.PI) / n;
  let angleOffset = -0.5 * Math.PI;
  let contextX,
    contextY = (0, 0);
  const vertices = [];
  context.beginPath();
  for (let i = 0; i < n; i++) {
    contextX = initialWidth / 2 + radius * Math.cos(angle * i + angleOffset);
    contextY = initialHeight / 2 + radius * Math.sin(angle * i + angleOffset);
    // console.log(radius * Math.cos(angle * i), contextY);
    context.lineTo(contextX, contextY);
    vertices.push([contextX, contextY]);
  }
  context.closePath();
  context.stroke();

  // Draw dots
  if (showDots) {
    vertices.forEach(([x, y]) => {
      context.beginPath();

      context.moveTo(x, y - dotWidth / 2);
      context.lineTo(x, y + dotWidth / 2);
      let originalLineWidth = context.lineWidth;
      context.lineWidth = dotWidth;
      context.stroke();
      context.lineWidth = originalLineWidth;
    });
  }
}

function drawCircumscribedCircle(radius) {
  console.log("hi my name jeff");
  context.beginPath();
  context.arc(
    initialWidth / 2,
    initialHeight / 2,
    radius + Math.ceil(context.lineWidth / 2),
    0,
    2 * Math.PI
  );
  const originalLineWidth = context.lineWidth;
  context.lineWidth = circleLineWidth;
  context.stroke();
  context.lineWidth = originalLineWidth;
}

function writeText() {
  const circleArea = calculateCircleArea(inscribedRadius);
  const polyArea = calculatePolygonArea(inscribedRadius, sides);
  const circlePolyRatio = polyArea / circleArea;
  circleAreaText.innerText = `Area of circle: ${
    Math.round(circleArea / 10) * 10
  } pixels²`;
  polygonAreaText.innerText = `Area of polygon: ${
    Math.round(polyArea / 10) * 10
  } pixels²`;
  circlePolygonRatioText.innerText = `${
    Math.round(circlePolyRatio * 100) / 100
  } : 1`;
}

function updateAll() {
  context.clearRect(0, 0, initialWidth, initialHeight);

  drawPolygonInscribed(sides, inscribedRadius);
  if (showCircumscribedCircle) {
    drawCircumscribedCircle(inscribedRadius);
  }
  writeText();
}

updateAll();
