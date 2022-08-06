const userLocale =
  navigator.languages && navigator.languages.length
    ? navigator.languages[0]
    : navigator.language;

// Canvas
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

const initialWidth = window.innerWidth - 50;
const initialHeight = window.innerHeight - 300;

context.canvas.width = initialWidth;
context.canvas.height = initialHeight;

context.lineWidth = 5;
context.strokeStyle = "#ffffff";

const smoothColors = [
  [220, 53, 69],
  [255, 193, 7],
  [25, 135, 84],
  [13, 110, 253],
  [106, 16, 142],
];

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

// Of inscribed radius
const dotWidth = 1 / 8;
const minDotWidth = 10;
const maxDotWidth = 30;

const circleToggle = document.getElementById("circleToggle");
let showCircumscribedCircle = false;
circleToggle.checked = showCircumscribedCircle;
const circleLineWidth = 2;
const circleColor = "#ffffff";

const circleAreaText = document.getElementById("circleAreaText");
const polygonAreaText = document.getElementById("polygonAreaText");
const circlePolygonRatioText = document.getElementById(
  "circlePolygonRatioText"
);

const polygonName = document.getElementById("polygonName");
const regularPolygonNames = {
  3: "Triangle",
  4: "Square",
  5: "Pentagon",
  6: "Hexagon",
  7: "Septagon",
  8: "Octagon",
  9: "Nonagon",
  10: "Decagon",
  11: "Hendecagon",
  12: "Dodecagon",
  13: "Triskaidecagon",
  14: "Tetradecagon",
  15: "Pentadecagon",
  16: "Hexadecagon",
  17: "Heptadecagon",
  18: "Octadecagon",
  19: "Nonadecagon",
  20: "Icosagon",
};

const sizeInput = document.getElementById("sizeInput");
let circumscribedRadius = initialHeight / 7;
const minRadius = circumscribedRadius / 5;
const radiusIncrement = minRadius / 2;
const maxRadius =
  Math.floor((3 * circumscribedRadius) / radiusIncrement) * radiusIncrement;

sizeInput.value = circumscribedRadius;
sizeInput.max = maxRadius;
sizeInput.min = minRadius;
sizeInput.step = radiusIncrement;

const verticesToggle = document.getElementById("verticesToggle");
let showVertices = true;
verticesToggle.checked = showVertices;

function sizeChange({ value }) {
  circumscribedRadius = parseInt(value);
  updateAll();
}

function sidesChange({ value }) {
  sides = parseInt(value);
  updateAll();
}

function circleToggleChange({ checked }) {
  showCircumscribedCircle = checked;
  updateAll();
}

function verticesToggleChange({ checked }) {
  showVertices = checked;
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
  return (apothem * outerSideLength * n) / 2;
}

// Not in use - draws by actually calculating each point, rather than drawPolygonInscribed() which draws points from center
// Also unfinished
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
  // Take difference in rgb values, ex: 50, 100
  // Take fraction, multiply (fraction through) * difference and add to base value
  const fractionThrough = (n - minSides) / (maxSides - minSides);
  let currentSection = Math.ceil(fractionThrough * (smoothColors.length - 1));
  if (currentSection < 1) {
    currentSection = 1;
  }
  let sections = smoothColors.length - 1;

  const smoothColor1 = smoothColors[currentSection - 1];
  const smoothColor2 = smoothColors[currentSection];
  let rangeFractionThrough =
    (fractionThrough - currentSection / sections) * (smoothColors.length - 1) +
    1;
  // fraction - section/sections = rangefractionthrough
  const currentColor = [
    (smoothColor2[0] - smoothColor1[0]) * rangeFractionThrough +
      smoothColor1[0],
    (smoothColor2[1] - smoothColor1[1]) * rangeFractionThrough +
      smoothColor1[1],
    (smoothColor2[2] - smoothColor1[2]) * rangeFractionThrough +
      smoothColor1[2],
  ];
  context.strokeStyle = `rgb(${currentColor[0]}, ${currentColor[1]}, ${currentColor[2]})`;
  context.beginPath();
  for (let i = 0; i < n; i++) {
    contextX = initialWidth / 2 + radius * Math.cos(angle * i + angleOffset);
    contextY = initialHeight / 2 + radius * Math.sin(angle * i + angleOffset);
    context.lineTo(contextX, contextY);
    vertices.push([contextX, contextY]);
  }
  context.closePath();
  context.stroke();

  // Draw dots
  if (showVertices) {
    let totalDotWidth = circumscribedRadius * dotWidth;
    if (totalDotWidth < minDotWidth) {
      totalDotWidth = minDotWidth;
    }
    if (totalDotWidth > maxDotWidth) {
      totalDotWidth = maxDotWidth;
    }
    vertices.forEach(([x, y]) => {
      context.beginPath();

      context.moveTo(x, y - totalDotWidth / 2);
      context.lineTo(x, y + totalDotWidth / 2);
      let originalLineWidth = context.lineWidth;
      context.lineWidth = totalDotWidth;
      context.stroke();
      context.lineWidth = originalLineWidth;
    });
  }
}

function drawCircumscribedCircle(radius) {
  context.beginPath();
  context.strokeStyle = circleColor;
  context.arc(initialWidth / 2, initialHeight / 2, radius, 0, 2 * Math.PI);
  const originalLineWidth = context.lineWidth;
  context.lineWidth = circleLineWidth;
  context.stroke();
  context.lineWidth = originalLineWidth;
}

function writeText() {
  const circleArea = calculateCircleArea(circumscribedRadius);
  const polyArea = calculatePolygonArea(circumscribedRadius, sides);
  const circlePolyRatio = polyArea / circleArea;
  circleAreaText.innerText = `Circle: ${(
    Math.round(circleArea / 10) * 10
  ).toLocaleString(userLocale)} pixels²`;
  polygonAreaText.innerText = `Polygon: ${(
    Math.round(polyArea / 10) * 10
  ).toLocaleString(userLocale)} pixels²`;
  circlePolygonRatioText.innerText = `${
    Math.round(circlePolyRatio * 100) / 100
  } : 1`;
}

function writePolygonName(n) {
  polygonName.innerText = `${regularPolygonNames[n]}: ${n} Sides`;
}

function updateAll() {
  context.clearRect(0, 0, initialWidth, initialHeight);
  if (showCircumscribedCircle) {
    drawCircumscribedCircle(circumscribedRadius);
  }
  drawPolygonInscribed(sides, circumscribedRadius);

  writePolygonName(sides);
  writeText();
}

updateAll();
