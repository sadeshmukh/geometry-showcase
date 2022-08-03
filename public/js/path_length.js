const startButton = document.getElementById("startButton");
const pathContainer = document.getElementById("pathContainer");
const pathHeight = 150;
const pathSegments = 6;
const pathGap = 20 / 2;
const verticalTextDistance = 250;
const horizontalTextDistance = 200;
const heightTextColor = "#ffffff";

let path1;
let path1Widths;
let path2;

let userHasGuessed = false;
const guessTop = document.getElementById("guessTop");
const guessBottom = document.getElementById("guessBottom");
const guessContainer = document.getElementById("guessContainer");
const hasGuessedContainer = document.getElementById("hasGuessedContainer");
const correctAnswerHeader = document.getElementById("correctAnswerHeader");
const correctAnswerDetails = document.getElementById("correctAnswerDetails");

let showWidths = false;

const possibleLines = ["straight", "corner", "semicircle"];
// const possibleLines = ["corner"];

// Preset
const arrowHeartPathTop = [
  { width: 200, type: "straight", begins: "center", ends: "outer", index: 0 },
  { width: 200, type: "corner", begins: "outer", ends: "center", index: 1 },
  { width: 200, type: "semicircle", begins: "center", ends: "outer", index: 2 },
  { width: 200, type: "semicircle", begins: "outer", ends: "center", index: 3 },
  { width: 200, type: "straight", begins: "center", ends: "center", index: 4 },
  { width: 200, type: "straight", begins: "center", ends: "outer", index: 5 },
];

const arrowHeartPathBottom = [
  { width: 200, type: "straight", begins: "center", ends: "outer", index: 0 },
  { width: 200, type: "corner", begins: "outer", ends: "center", index: 1 },
  { width: 200, type: "straight", begins: "center", ends: "outer", index: 2 },
  { width: 200, type: "straight", begins: "outer", ends: "center", index: 3 },
  { width: 200, type: "straight", begins: "center", ends: "center", index: 4 },
  { width: 200, type: "straight", begins: "center", ends: "outer", index: 5 },
];

let isHeartPath = false;
const heartButtonContainer = document.getElementById("heartButtonContainer");
const heartBackContainer = document.getElementById("heartBackContainer");
let pathBeforeHeart1 = [];
let pathBeforeHeart2 = [];
let showWidthsBeforeHeart = false;

const youtubeThumbnailText = document.getElementById("youtubeThumbnailText");

// Canvas

const lineColors = [
  "#dc3545",
  "#fd7e14",
  "#ffc107",
  "#198754",
  "#0d6efd",
  "#6610f2",
];

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

const initialWidth = window.innerWidth - 50;
const initialHeight = window.innerHeight - 300;

context.canvas.width = initialWidth;
context.canvas.height = initialHeight;

let defaultLineWidth = 5;
context.lineWidth = 5;
let fontLineWidth = 1;
context.font = "20px 'Nunito'";
const fullPathMinWidth = (initialWidth / 5) * 3;
const fullPathMaxWidth = (initialWidth / 7) * 6;

function roundedRandomNumber(min, max) {
  let retval = Math.floor(Math.random() * (max - min + 1) + min + 1) - 1;
  return retval;
}

function generatePath(pathLength, presetWidths = null) {
  // Path is an array of objects
  // Each object is structured: {width: 1234, type: "corner"}
  // The height is a constant
  let path = [];
  let lastEnd = "center";
  for (let i = 0; i < pathLength; i++) {
    // Generate one
    let end;
    if (lastEnd === "center") {
      end = "outer";
    } else {
      end = "center";
    }
    // Even widths
    let objectWidth;
    if (presetWidths) {
      objectWidth = presetWidths[i];
    } else {
      objectWidth =
        roundedRandomNumber(
          fullPathMinWidth / pathLength / 2,
          fullPathMaxWidth / pathLength / 2
        ) * 2;
    }
    let pathObject = {
      width: objectWidth,
      type: possibleLines[roundedRandomNumber(0, possibleLines.length - 1)],
      begins: lastEnd,
      ends: end,
      index: i,
    };
    lastEnd = end;
    path.push(pathObject);
  }

  return path;
}

function drawPath(path, half) {
  // Find total width of path to center
  let fullPathWidth = 0;
  path.forEach(({ width }) => {
    fullPathWidth += width;
  });

  let contextX = (initialWidth - fullPathWidth) / 2;
  let contextY;
  if (half === "top") {
    contextY = initialHeight / 2 - pathGap;
  } else {
    contextY = initialHeight / 2 + pathGap;
  }

  // Draw height text
  if (!isHeartPath) {
    context.beginPath();
    context.fillStyle = heightTextColor;
    if (half === "top") {
      context.fillText(
        pathHeight.toString() + " pixels tall",
        contextX - horizontalTextDistance,
        contextY - verticalTextDistance / 2
      );
    } else {
      context.fillText(
        pathHeight.toString() + "  pixels tall",
        contextX - horizontalTextDistance,
        contextY + verticalTextDistance / 2
      );
    }
  }

  context.beginPath();
  path.forEach(({ width, type, begins, ends, index }) => {
    let currentColor = lineColors[index % lineColors.length];

    context.fillStyle = currentColor;
    context.strokeStyle = currentColor;

    switch (type) {
      case "straight":
        context.moveTo(contextX, contextY);

        if (ends === "center") {
          if (half === "top") {
            contextY = initialHeight / 2 - pathGap;
          } else {
            contextY = initialHeight / 2 + pathGap;
          }
        } else {
          if (half === "top") {
            contextY = initialHeight / 2 - pathHeight - pathGap;
          } else {
            contextY = initialHeight / 2 + pathHeight + pathGap;
          }
        }

        contextX += width;

        context.lineTo(contextX, contextY);
        context.stroke();

        break;
      case "corner":
        context.moveTo(contextX, contextY);

        if (ends === "center") {
          if (half === "top") {
            contextY = initialHeight / 2 - pathGap;
          } else {
            contextY = initialHeight / 2 + pathGap;
          }
        } else {
          if (half === "top") {
            contextY = initialHeight / 2 - pathHeight - pathGap;
          } else {
            contextY = initialHeight / 2 + pathHeight + pathGap;
          }
        }

        context.lineTo(contextX, contextY);

        contextX += width;

        context.lineTo(contextX, contextY);
        context.stroke();

        break;
      case "semicircle":
        if (half === "top") {
          contextY = initialHeight / 2 - pathHeight / 2 - pathGap;
        } else {
          contextY = initialHeight / 2 + pathHeight / 2 + pathGap;
        }
        contextX += width / 2;
        let angle;

        if (half === "top") {
          if (ends === "center") {
            angle = (1 / 2) * Math.PI - Math.atan(width / pathHeight);
            context.arc(
              contextX,
              contextY,
              Math.sqrt(width ** 2.0 + pathHeight ** 2.0) / 2.0,
              angle + 1 * Math.PI,
              angle + 0 * Math.PI
            );
          } else {
            angle = (1 / 2) * Math.PI - Math.atan(pathHeight / width);
            context.arc(
              contextX,
              contextY,
              Math.sqrt(width ** 2 + pathHeight ** 2) / 2,
              angle + 0.5 * Math.PI,
              angle + 1.5 * Math.PI
            );
          }
        } else {
          if (ends === "center") {
            angle = (1 / 2) * Math.PI - Math.atan(pathHeight / width);
            context.arc(
              contextX,
              contextY,
              Math.sqrt(width ** 2 + pathHeight ** 2) / 2,
              angle + 1.5 * Math.PI,
              angle + 0.5 * Math.PI
            );
          } else {
            angle = (1 / 2) * Math.PI - Math.atan(width / pathHeight);
            context.arc(
              contextX,
              contextY,
              Math.sqrt(width ** 2 + pathHeight ** 2) / 2,
              angle + 0 * Math.PI,
              angle + 1 * Math.PI
            );
          }
        }

        context.stroke();
        contextX += width / 2;
        if (ends === "center") {
          if (half === "top") {
            contextY = initialHeight / 2 - pathGap;
          } else {
            contextY = initialHeight / 2 + pathGap;
          }
        } else {
          if (half === "top") {
            contextY = initialHeight / 2 - pathHeight - pathGap;
          } else {
            contextY = initialHeight / 2 + pathHeight + pathGap;
          }
        }

        break;
      default:
        console.error("Impossible type for path section");
    }

    // Draw text showing segment width
    if (showWidths) {
      context.beginPath();
      if (half === "top") {
        contextY = initialHeight / 2 - pathGap - verticalTextDistance;
      } else {
        contextY = initialHeight / 2 + pathGap + verticalTextDistance;
      }
      context.lineWidth = fontLineWidth;
      context.fillText(
        width.toString() + " pixels wide",
        contextX - width,
        contextY
      );
      context.lineWidth = defaultLineWidth;
      context.stroke();
      // Reset contextY
      if (ends === "center") {
        if (half === "top") {
          contextY = initialHeight / 2 - pathGap;
        } else {
          contextY = initialHeight / 2 + pathGap;
        }
      } else {
        if (half === "top") {
          contextY = initialHeight / 2 - pathHeight - pathGap;
        } else {
          contextY = initialHeight / 2 + pathHeight + pathGap;
        }
      }
    }

    context.beginPath();
  });
}

function calculatePathLength(path) {
  let pathLength = 0;
  path.forEach(({ width, type }) => {
    switch (type) {
      case "straight":
        pathLength += Math.sqrt(width ** 2 + pathHeight ** 2);
        break;
      case "corner":
        pathLength += width + pathHeight;
        break;
      case "semicircle":
        pathLength += Math.PI * Math.sqrt(width ** 2 + pathHeight ** 2);
        break;
      default:
        console.error("Impossible case");
    }
  });
  return pathLength;
}

function toggleWidths() {
  showWidths = !showWidths;
  redraw();
}

function redraw() {
  context.clearRect(0, 0, initialWidth, initialWidth);

  drawPath(path1, "top");
  drawPath(path2, "bottom");
}

function reset() {
  path1 = generatePath(pathSegments);
  path1Widths = [];
  path1.map(({ width }) => {
    path1Widths.push(width);
  });
  path2 = generatePath(pathSegments, path1Widths);
  showWidths = false;
  redraw();
}

function guess(userInput) {
  userHasGuessed = true;
  let topPathLength = calculatePathLength(path1);
  let bottomPathLength = calculatePathLength(path2);
  console.log(topPathLength, bottomPathLength);
  let userMessage = "";

  if (topPathLength > bottomPathLength && userInput === "top") {
    userMessage = "You were correct!";
  } else if (bottomPathLength > topPathLength && userInput === "bottom") {
    userMessage = "You were correct!";
  } else {
    userMessage = "You were incorrect.";
  }
  if (topPathLength === bottomPathLength) {
    userMessage = "You were kind of correct!";
  }
  correctAnswerHeader.innerText = userMessage;
  let correctAnswerDetailsText = `<p>The top path was approximately ${Math.round(
    topPathLength
  )} pixels long</p>`;
  correctAnswerDetailsText += `<p>The bottom path was approximately ${Math.round(
    bottomPathLength
  )} pixels long.</p>`;
  if (topPathLength > bottomPathLength) {
    if (Math.round(Math.abs(topPathLength - bottomPathLength)) === 0) {
      correctAnswerDetailsText += `<p>The <b>top</b> path was longer by approximately ${
        Math.round((topPathLength - bottomPathLength) * 10) / 10
      } pixels!</p>`;
    } else {
      correctAnswerDetailsText += `<p>The <b>top</b> path was longer by approximately ${Math.round(
        topPathLength - bottomPathLength
      )} pixels!</p>`;
    }
  } else {
    if (Math.round(Math.abs(topPathLength - bottomPathLength)) === 0) {
      correctAnswerDetailsText += `<p>The <b>top</b> path was longer by approximately ${
        Math.round((topPathLength - bottomPathLength) * 10) / 10
      } pixels!</p>`;
    } else {
      correctAnswerDetailsText += `<p>The <b>bottom</b> path was longer by approximately ${Math.round(
        bottomPathLength - topPathLength
      )} pixels!</p>`;
    }
  }
  if (topPathLength === bottomPathLength) {
    correctAnswerDetailsText = `They are <em>exactly the same,</em> at ${topPathLength} pixels!`;
  }
  correctAnswerDetails.innerHTML = correctAnswerDetailsText;

  guessContainer.hidden = true;
  hasGuessedContainer.hidden = false;
}

function unGuess() {
  userHasGuessed = false;
  guessContainer.hidden = false;
  hasGuessedContainer.hidden = true;
}

function heartReset() {
  showWidthsBeforeHeart = showWidths;
  showWidths = false;
  isHeartPath = true;
  youtubeThumbnailText.hidden = false;
  guessContainer.hidden = true;
  heartButtonContainer.hidden = true;
  heartBackContainer.hidden = false;
  pathBeforeHeart1 = [...path1];
  pathBeforeHeart2 = [...path2];
  path1 = [...arrowHeartPathTop];
  path2 = [...arrowHeartPathBottom];
  redraw();
}

function heartBack() {
  showWidths = showWidthsBeforeHeart;
  isHeartPath = false;
  path1 = [...pathBeforeHeart1];
  path2 = [...pathBeforeHeart2];
  if (!userHasGuessed) {
    guessContainer.hidden = false;
  }
  heartButtonContainer.hidden = false;
  heartBackContainer.hidden = true;
  redraw();
}

function hideThumbnailText() {
  youtubeThumbnailText.hidden = true;
}

reset();
