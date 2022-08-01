const roundSidesToPlace = 2;
let sidesHaveChanged = false;

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

const initialWidth = window.innerWidth - 50;
const initialHeight = window.innerHeight - 400;

context.canvas.width = initialWidth;
context.canvas.height = initialHeight;

const sidesUpdateButton = document.getElementById("sidesUpdateButton");

const scaleTriangleWidth = initialWidth / 2;
const scaleTriangleHeight = initialHeight / 2;

const notToScaleSpan = document.getElementById("notToScaleSpan");

function setSidesHaveChanged(boolean) {
  sidesHaveChanged = boolean;
  sidesUpdateButton.disabled = !boolean;
  if (sidesHaveChanged) {
    // button enabled
    sidesUpdateButton.classList.remove("btn-secondary");
    sidesUpdateButton.classList.add("btn-success");
  } else {
    sidesUpdateButton.classList.add("btn-secondary");
    sidesUpdateButton.classList.remove("btn-success");
  }
}

function onSidesSubmit(event = false) {
  if (event) {
    event.preventDefault();
  }

  let sideA = document.getElementById("triangleSideInputA");
  let sideAVal = parseInt(sideA.value);
  let sideB = document.getElementById("triangleSideInputB");
  let sideBVal = parseInt(sideB.value);
  let sideC = document.getElementById("triangleSideInputC");
  let sideCVal = parseInt(sideC.value);

  let solveForSideDropdown = document.getElementById(
    "solveForSideDropdown"
  ).value;

  switch (solveForSideDropdown) {
    case "auto":
      console.log(sideAVal, sideBVal, sideCVal);
      if (sideAVal && sideBVal) {
        sideC.value = Math.sqrt(sideAVal ** 2 + sideBVal ** 2);
      } else if (sideAVal && sideCVal) {
        sideB.value = Math.sqrt(sideCVal ** 2 - sideAVal ** 2);
      } else if (sideBVal && sideCVal) {
        sideA.value = Math.sqrt(sideCVal ** 2 - sideBVal ** 2);
      } else {
        console.log("Not enough values to calculate");
        break;
      }
      console.log(sideAVal, sideBVal, sideCVal);
      setSidesHaveChanged(false);
      break;
    case "A":
      if (sideBVal && sideCVal) {
        sideA.value = Math.sqrt(sideCVal ** 2 - sideBVal ** 2);
        setSidesHaveChanged(false);
      }
      break;
    case "B":
      if (sideAVal && sideCVal) {
        sideB.value = Math.sqrt(sideCVal ** 2 - sideAVal ** 2);
        setSidesHaveChanged(false);
      }
      break;
    case "C":
      if (sideAVal && sideBVal) {
        sideC.value = Math.sqrt(sideAVal ** 2 + sideBVal ** 2);
        setSidesHaveChanged(false);
      }
      break;
    default:
      throw "Impossible dropdown value";
  }

  if (!sidesHaveChanged) {
    //  Remove hidden attribute of the "Not to scale"
    notToScaleSpan.hidden = false;
    sideAVal = parseInt(sideA.value);
    sideBVal = parseInt(sideB.value);
    sideCVal = parseInt(sideC.value);
    console.log(sideAVal, sideBVal, sideCVal);
    // side A = width, side B = height
    // Check if ratio of width to intialWidth is greater than height to initialHeight
    let scaleBy;
    if (sideAVal / initialWidth > sideBVal / initialHeight) {
      // If width, we scale by width back to constant
      scaleBy = scaleTriangleWidth / sideAVal;
    } else {
      scaleBy = scaleTriangleHeight / sideBVal;
    }
    sideAVal *= scaleBy;
    sideBVal *= scaleBy;
    sideCVal *= scaleBy;

    // Create coordinates for points of triangle (yoinked from stackoverflow)
    const pointA = [0, 0];
    const pointB = [0, sideBVal];
    const pointC = [];
    pointC[1] =
      (sideBVal * sideBVal + sideAVal * sideAVal - sideCVal * sideCVal) /
      (2 * sideBVal);
    pointC[0] = Math.sqrt(sideAVal ** 2 - pointC[1] ** 2);
    // Draw

    context.clearRect(0, 0, initialWidth, initialHeight);
    context.beginPath();
    context.fillStyle = "#ffffff";
    context.strokeStyle = "#ffffff";
    context.moveTo(
      pointA[0] + (initialWidth - sideAVal) / 2,
      pointA[1] + (initialHeight - sideBVal) / 2
    );

    context.lineTo(
      pointB[0] + (initialWidth - sideAVal) / 2,
      pointB[1] + (initialHeight - sideBVal) / 2
    );

    context.lineTo(
      pointC[0] + (initialWidth - sideAVal) / 2,
      pointC[1] + (initialHeight - sideBVal) / 2
    );
    // Draws line back to original
    context.lineTo(
      pointA[0] + (initialWidth - sideAVal) / 2,
      pointA[1] + (initialHeight - sideBVal) / 2
    );
    context.stroke();
  }
  // Round values

  sideA.value = Math.round(sideA.value * 100) / 100;
  sideB.value = Math.round(sideB.value * 100) / 100;

  sideC.value = Math.round(sideC.value * 100) / 100;
}

onSidesSubmit();
setSidesHaveChanged(true);
