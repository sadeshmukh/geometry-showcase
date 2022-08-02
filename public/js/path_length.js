const startButton = document.getElementById("startButton");
const pathContainer = document.getElementById("pathContainer");
const pathHeight = 150;
const pathSegments = 6;
const pathGap = 20 / 2;

let path1;
let path1Widths;
let path2;

const possibleLines = ["straight", "corner", "semicircle"];

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
const initialHeight = window.innerHeight - 400;

context.canvas.width = initialWidth;
context.canvas.height = initialHeight;

context.lineWidth = 5;
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
  let fullPathWidth = 0;
  path.forEach(({ width }) => {
    fullPathWidth += width;
  });

  context.beginPath();

  let contextX = (initialWidth - fullPathWidth) / 2;
  let contextY;
  if (half === "top") {
    contextY = initialHeight / 2 - pathGap;
  } else {
    contextY = initialHeight / 2 + pathGap;
  }

  path.forEach(({ width, type, begins, ends, index }) => {
    let currentColor = lineColors[index % lineColors.length];

    context.fillStyle = currentColor;
    context.strokeStyle = currentColor;
    console.log(
      initialHeight / 2 - contextY,
      initialHeight / 2,
      pathHeight,
      half
    );
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

        if (half === "top") {
          if (ends === "center") {
            context.arc(
              contextX,
              contextY,
              Math.sqrt(width ** 2 + pathHeight ** 2) / 2,
              0.25 * Math.PI,
              1.25 * Math.PI
            );
          } else {
            context.arc(
              contextX,
              contextY,
              Math.sqrt(width ** 2 + pathHeight ** 2) / 2,
              0.75 * Math.PI,
              1.75 * Math.PI
            );
          }
        } else {
          if (ends === "center") {
            context.arc(
              contextX,
              contextY,
              Math.sqrt(width ** 2 + pathHeight ** 2) / 2,
              0.75 * Math.PI,
              1.75 * Math.PI
            );
          } else {
            context.arc(
              contextX,
              contextY,
              Math.sqrt(width ** 2 + pathHeight ** 2) / 2,
              0.25 * Math.PI,
              1.25 * Math.PI
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

    context.beginPath();
  });
}

function reset() {
  context.clearRect(0, 0, initialWidth, initialWidth);
  path1 = generatePath(pathSegments);
  path1Widths = [];
  path1.map(({ width }) => {
    path1Widths.push(width);
  });
  path2 = generatePath(pathSegments, path1Widths);

  drawPath(path1, "top");
  drawPath(path2, "bottom");
  //   if (JSON.encode(path1) === JSON.encode(path2)) {
  //     alert("That's kinda cool");
  //   }
}

reset();
