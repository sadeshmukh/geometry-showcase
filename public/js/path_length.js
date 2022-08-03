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

const possibleLines = ["straight", "corner", "semicircle"];

// Preset
const arrowHeartPathTop = [
  { width: 200, type: "straight", begins: "center", ends: "outer", index: 0 },
  { width: 200, type: "corner", begins: "outer", ends: "center", index: 1 },
  { width: 200, type: "semicircle", begins: "center", ends: "outer", index: 2 },
  { width: 200, type: "semicircle", begins: "outer", ends: "center", index: 3 },
  { width: 200, type: "straight", begins: "center", ends: "outer", index: 4 },
  { width: 200, type: "corner", begins: "outer", ends: "center", index: 4 },
];

const arrowHeartPathBottom = [
  { width: 200, type: "straight", begins: "center", ends: "outer", index: 0 },
  { width: 200, type: "corner", begins: "outer", ends: "center", index: 1 },
  { width: 200, type: "straight", begins: "center", ends: "outer", index: 2 },
  { width: 200, type: "straight", begins: "outer", ends: "center", index: 3 },
  { width: 200, type: "straight", begins: "center", ends: "outer", index: 4 },
  { width: 200, type: "corner", begins: "outer", ends: "center", index: 4 },
];

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
const initialHeight = window.innerHeight - 200;

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

  context.beginPath();
  path.forEach(({ width, type, begins, ends, index }) => {
    let currentColor = lineColors[index % lineColors.length];

    context.fillStyle = currentColor;
    context.strokeStyle = currentColor;
    // console.log(
    //   initialHeight / 2 - contextY,
    //   initialHeight / 2,
    //   pathHeight,
    //   half
    // );
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
    console.log(contextX, contextY);
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

function heartReset() {
  context.clearRect(0, 0, initialWidth, initialWidth);
  path1 = [...arrowHeartPathTop];
  path2 = [...arrowHeartPathBottom];
  drawPath(path1, "top");
  drawPath(path2, "bottom");
}

reset();
