const userLocale =
  navigator.languages && navigator.languages.length
    ? navigator.languages[0]
    : navigator.language;

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

// Of inscribed radius
const dotWidth = 1 / 8;
const minDotWidth = 10;
const maxDotWidth = 30;
const showDots = true;

let showCircumscribedCircle = false;
const circleLineWidth = 2;

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

// Canvas
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

const initialWidth = window.innerWidth - 50;
const initialHeight = window.innerHeight - 300;

context.canvas.width = initialWidth;
context.canvas.height = initialHeight;

context.lineWidth = 5;
context.strokeStyle = "#ffffff";

const progressiveColors = [
  [220, 53, 69],
  [253, 126, 20],
  [100, 76, 3],
  [25, 135, 84],
  [106, 16, 142],
];

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
  return (1 / 2) * apothem * outerSideLength * n;
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
  let currentSection = Math.ceil(
    fractionThrough * (progressiveColors.length - 1)
  );
  if (currentSection < 1) {
    currentSection = 1;
  }
  let sections = progressiveColors.length - 1;

  const progressiveColor1 = progressiveColors[currentSection - 1];
  const progressiveColor2 = progressiveColors[currentSection];
  let rangeFractionThrough =
    (fractionThrough - currentSection / sections) * 4 + 1;
  // fraction - section/sections = rangefractionthrough
  const currentColor = [
    (progressiveColor2[0] - progressiveColor1[0]) * rangeFractionThrough +
      progressiveColor1[0],
    (progressiveColor2[1] - progressiveColor1[1]) * rangeFractionThrough +
      progressiveColor1[1],
    (progressiveColor2[2] - progressiveColor1[2]) * rangeFractionThrough +
      progressiveColor1[2],
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
  if (showDots) {
    let totalDotWidth = inscribedRadius * dotWidth;
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
  context.arc(initialWidth / 2, initialHeight / 2, radius, 0, 2 * Math.PI);
  const originalLineWidth = context.lineWidth;
  context.lineWidth = circleLineWidth;
  context.stroke();
  context.lineWidth = originalLineWidth;
}

function writeText() {
  const circleArea = calculateCircleArea(inscribedRadius);
  const polyArea = calculatePolygonArea(inscribedRadius, sides);
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

  drawPolygonInscribed(sides, inscribedRadius);
  if (showCircumscribedCircle) {
    drawCircumscribedCircle(inscribedRadius);
  }

  writePolygonName(sides);
  writeText();
}

updateAll();
