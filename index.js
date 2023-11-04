// avoid elements from being dragged
document.ondragstart = () => {
  return false;
};

// flag to track if the mouse button is pressed
let isMouseDown = false;

document.addEventListener("mousedown", () => {
  isMouseDown = true;
});

document.addEventListener("mouseup", () => {
  isMouseDown = false;
});

// SLIDER FUNCTIONALITY >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
const sliderEl = document.querySelector("#grid-range");
const sliderValue = document.querySelector("#value");

function progressScript() {
  const tempSliderValue = sliderEl.value;
  sliderValue.textContent = `(${tempSliderValue} x ${tempSliderValue})`;
  sliderEl.style.background = `linear-gradient(to right, #747474 ${tempSliderValue}%, #fff ${tempSliderValue}%)`;
}

sliderEl.addEventListener("input", () => {
  progressScript();
});

// CONVERT RGB COLOR CODE TO HEX COLOR CODE <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
function rgbToHex(rgb) {
  // Remove the "rgb(" and ")" parts from the input string
  rgb = rgb.slice(4, -1);

  // Split the RGB values into an array
  let rgbValues = rgb.split(",");

  // Convert each RGB value to a hexadecimal string
  let hexValues = rgbValues.map(function (value) {
    // Parse the integer value
    let intValue = parseInt(value);

    // Convert the integer to a hexadecimal string
    let hexValue = intValue.toString(16);

    // Pad the hexadecimal string with a leading zero if necessary
    if (hexValue.length < 2) {
      hexValue = "0" + hexValue;
    }

    return hexValue;
  });

  // Join the hexadecimal values into a single string
  let hexCode = "#" + hexValues.join("");

  return hexCode;
}

// LIGHTEN OR DARKEN HEX COLORS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
function lightenOrDarken(col, amt) {
  let usePound = false;

  if (col[0] == "#") {
    col = col.slice(1);
    usePound = true;
  }

  let num = parseInt(col, 16);

  let r = (num >> 16) & 0xff;
  let g = (num >> 8) & 0xff;
  let b = num & 0xff;

  r = Math.max(0, Math.min(255, r + amt));
  g = Math.max(0, Math.min(255, g + amt));
  b = Math.max(0, Math.min(255, b + amt));

  // Convert the components to padded hexadecimal strings
  r = r.toString(16).padStart(2, "0");
  g = g.toString(16).padStart(2, "0");
  b = b.toString(16).padStart(2, "0");

  return (usePound ? "#" : "") + r + g + b;
}


// TOGGLE GRIDLINES >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
function toggleGridlines() {
  // get grid toggle element
  const gridToggle = document.querySelector("#grid-toggle");

  // get all the squares
  let squares = document.querySelectorAll(".square");

  if (gridToggle.checked) {
    squares.forEach((square) => {
      square.classList.add("grid-active");
    });
  } else {
    squares.forEach((square) => {
      square.classList.remove("grid-active");
    });
  }
}

// PENCIL ACTIVITY <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
// Drawing functionality
function draw(event, pencilColor) {
  if (event.target.style.backgroundColor !== pencilColor)
    event.target.style.backgroundColor = pencilColor;
}

// Shading functionality
function shade(event, pencilColor) {
  // if square has a color, darken it
  if (event.target.style.backgroundColor !== "") {
    // convert square background color from rgb to hex
    let hexSquareBackground = rgbToHex(event.target.style.backgroundColor);

    // Darken the square background color
    event.target.style.backgroundColor = lightenOrDarken(
      hexSquareBackground, -5
    );
  } else {
    // set square background color to pencil color, if square has no color
    event.target.style.backgroundColor = pencilColor;
  }
}


// ERASER ACTIVITY <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
const eraserBtn = document.querySelector("#eraser-btn");

function erase(event, drawingMode) {
  // if mode is draw and the square has color, set the square color to none
  if (drawingMode === "draw" && event.target.style.backgroundColor !== "") {
    event.target.style.backgroundColor = "";
  }

  // if mode is shade and the square has color, lighten the square color
  if (drawingMode === "shade" && event.target.style.backgroundColor !== "") {
    // convert the square color from rgb to hex
    let hexSquareBackground = rgbToHex(event.target.style.backgroundColor);

    event.target.style.backgroundColor = lightenOrDarken(
      hexSquareBackground, 5
    );
  }
}

function checkEraser() {
  if (eraserBtn.classList.contains("active")) {
    return true;
  } else {
    return false;
  }
}

// toggle eraser activity
eraserBtn.addEventListener("click", () => {
  if (eraserBtn.classList.contains("active")) {
    eraserBtn.classList.remove("active");
  } else {
    eraserBtn.classList.add("active");

    if (eyedropBtn.classList.contains("active"))
      eyedropBtn.classList.remove("active");
  }
});


// EYEDROPPER ACTIVITY <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
const eyedropBtn = document.querySelector("#eyedrop-btn");

// toggle eyedrop
eyedropBtn.addEventListener("click", () => {
  if (eyedropBtn.classList.contains("active")) {
    eyedropBtn.classList.remove("active");
  } else {
    eyedropBtn.classList.add("active");

    if (eraserBtn.classList.contains("active"))
      eraserBtn.classList.remove("active");
  }
});

function checkEyedrop() {
  if (eyedropBtn.classList.contains("active")) {
    return true;
  } else {
    return false;
  }
}

function pickColor(event) {
  // set pencil color to square color
  if (
    event.target.classList.contains("square") &&
    event.target.style.backgroundColor !== ""
  ) {
    let hexSquareBackground = rgbToHex(event.target.style.backgroundColor)
    document.querySelector("#pencil-color").value = hexSquareBackground;
  }

  if (
    event.target.classList.contains("square") &&
    event.target.style.backgroundColor === ""
  ) {
    // let hexSquareBackground = rgbToHex(event.target.style.backgroundColor);
    document.querySelector("#pencil-color").value =
      document.querySelector("#artboard-bg-color").value;
  }
}


// GENERATE ARTBOARD >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
function generateArtboard() {
  // get the range input value
  let gridRangeValue = document.querySelector("#grid-range").value;

  // get the width of the artboard
  const artboardContainer = document.querySelector("#artboard-container");
  let artboardWidth = artboardContainer.offsetWidth;

  // get the size of each square in the grid
  let squareSize = artboardWidth / gridRangeValue;

  // get the background color for the grid
  let artboardBgColor = document.querySelector("#artboard-bg-color").value;

  // clear any existing grid
  artboardContainer.textContent = "";

  // // set the background color of the artboard
  artboardContainer.style.backgroundColor = artboardBgColor;

  // generate the grid
  for (let i = 0; i < gridRangeValue; i++) {
    // create a flex container div
    let flexDiv = document.createElement("div");
    flexDiv.classList.add("flex-container");
    for (let j = 0; j < gridRangeValue; j++) {
      // create a new square div
      let square = document.createElement("div");

      // add class to square div for changing background color
      square.classList.add("square");

      // set the width and height
      square.style.width = squareSize + "px";
      square.style.height = squareSize + "px";

      // set the background color of the artboard
      square.style.backgroundColor = "";
      // square.classList.add("grid-active");

      // add the square to the container
      flexDiv.appendChild(square);
    }
    artboardContainer.appendChild(flexDiv);
  }
}

// CHANGE ARTBOARD BACKGROUND COLOR >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
const artboardBgColor = document.querySelector("#artboard-bg-color");
artboardBgColor.addEventListener("input", () => {
  // get the artboard
  const artboard = document.querySelector("#artboard-container");
  artboard.style.backgroundColor = artboardBgColor.value;
});

// CLEAR BUTTON FUNCTIONALITY >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
const clearBtn = document.querySelector("#clear-btn");

clearBtn.addEventListener("click", () => {
  // get all squares
  let squares = document.querySelectorAll(".square");

  // change background color of each square to none
  squares.forEach((square) => {
    if (square.style.backgroundColor !== "")
      square.style.backgroundColor = "";
  });

  // deactivate eraser button
  if (eraserBtn.classList.contains("active"))
    eraserBtn.classList.remove("active");

  // deactivate eyedrop button
  if (eyedropBtn.classList.contains("active"))
    eyedropBtn.classList.remove("active");
  
});

// WHEN PAGE RELOADS <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
generateArtboard(); // generate the artboard
progressScript(); // set background color of grid slider progress


// ON BUTTON INTERRACTIONS <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
// generate the artboard when the slider is clicked
sliderEl.addEventListener("click", () => {
  generateArtboard(); // generate the artboard
  toggleGridlines(); // get grid line status and set it
  // set eraser inactive
  eraserBtn.classList.remove("active");
});

// toggle gridlines when grid toggler is clicked
const gridlineToggle = document.querySelector("#grid-toggle");
gridlineToggle.addEventListener("input", () => {
  toggleGridlines();
});

// ON CLICKING AND/OR DRAGGING ON THE ARTBOARD CONTAINER <<<<<<<<<<<<<<<<<<<<<<<<<<<<<
const artboardContainer = document.querySelector("#artboard-container");

// draw or shade when the mouse is clicked on a square
artboardContainer.addEventListener("mousedown", (e) => {
  // get the pencil color
  let pencilColor = document.querySelector("#pencil-color").value;

  // get the drawing mode
  let drawingMode = document.querySelector("#drawing-mode").value;

  // check if eraser is active
  let isEraserActive = checkEraser();

  let isEyeDropperActive = checkEyedrop();

  // if eraser is active, erase
  if (isEraserActive) {
    if (e.target.classList.contains("square"))
      erase(e, drawingMode);

  } else {
    if (isEyeDropperActive) {
      pickColor(e);

    } else {
      if (e.target.classList.contains("square") && drawingMode === "draw")
        draw(e, pencilColor);

      if (e.target.classList.contains("square") && drawingMode === "shade")
        shade(e, pencilColor);
    }
  }
});


// draw or shade when mouse is clicked and dragged over a square
artboardContainer.addEventListener("mouseover", (e) => {
  if (isMouseDown && e.target.classList.contains("square")) {
    // get the pencil color
    let pencilColor = document.querySelector("#pencil-color").value;

    // get the drawing mode
    let drawingMode = document.querySelector("#drawing-mode").value;

    // check if eraser is active
    let isEraserActive = checkEraser();

    // check if eyedrop is active
    let isEyeDropperActive = checkEyedrop();

    // if eraser is active, erase
    if (isEraserActive) {
      if (e.target.classList.contains("square"))
        erase(e, drawingMode);

    } else { // if eraser is inactive, draw or shade
      if (isEyeDropperActive) { // if eyedrop is active, pick color
        pickColor(e);

      } else { // if eyedrop is inactive, draw or shade
        if (e.target.classList.contains("square") && drawingMode === "draw")
          draw(e, pencilColor);

        if (e.target.classList.contains("square") && drawingMode === "shade")
          shade(e, pencilColor);
      }
      
    }
  }
});