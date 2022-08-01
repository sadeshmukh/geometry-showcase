const roundSidesToPlace = 2;
let sidesHaveChanged = false;

const sidesUpdateButton = document.getElementById("sidesUpdateButton");

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

function onSidesSubmit(event) {
  event.preventDefault();
  let sideA = document.getElementById("triangleSideInputA");
  let sideB = document.getElementById("triangleSideInputB");
  let sideC = document.getElementById("triangleSideInputC");
  let solveForSideDropdown = document.getElementById(
    "solveForSideDropdown"
  ).value;
  console.log(solveForSideDropdown);

  switch (solveForSideDropdown) {
    case "auto":
      if (sideA.value && sideB.value) {
        sideC.value =
          Math.round(Math.sqrt(sideA.value ** 2 + sideB.value ** 2) * 100) /
          100;
      } else if (sideA.value && sideC.value) {
        sideB.value =
          Math.round(Math.sqrt(sideA.value ** 2 + sideC.value ** 2) * 100) /
          100;
      } else if (sideB.value && sideC.value) {
        sideA.value =
          Math.round(Math.sqrt(sideB.value ** 2 + sideB.value ** 2) * 100) /
          100;
      } else {
        console.log("Not enough values to calculate");
        break;
      }
      setSidesHaveChanged(false);
      break;
    case "A":
      if (sideB.value && sideC.value) {
        sideA.value =
          Math.round(Math.sqrt(sideB.value ** 2 + sideC.value ** 2) * 100) /
          100;
        setSidesHaveChanged(false);
      }
      break;
    case "B":
      if (sideA.value && sideC.value) {
        sideB.value =
          Math.round(Math.sqrt(sideA.value ** 2 + sideC.value ** 2) * 100) /
          100;
        setSidesHaveChanged(false);
      }
      break;
    case "C":
      if (sideA.value && sideB.value) {
        sideC.value =
          Math.round(Math.sqrt(sideA.value ** 2 + sideB.value ** 2) * 100) /
          100;
        setSidesHaveChanged(false);
      }
      break;
    default:
      throw "Impossible dropdown value";
  }
  if (solveForSideDropdown === "auto") {
  }
}
