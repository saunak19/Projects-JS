let inputBox = document.getElementById("inputBox");

function calculateValue(value) {
  let numValue = Number(value);
  let belowAns = document.getElementById("sub-ans");

  if (!isNaN(numValue) && value !== " ") {
    inputBox.value += value;
    return;
  }

  switch (value) {
    case "AC":
      inputBox.value = "";
      belowAns.innerText = "";
      x = "";
      break;

    case "DE":
    case "Backspace":
      inputBox.value = inputBox.value.slice(0, -1);
      break;

    case ".":
      let currentNum = inputBox.value;
      if (!currentNum.includes(".")) {
        inputBox.value += ".";
      }
      break;

    case "%":
      x = inputBox.value;
      operator = "%";
      inputBox.value = "";
      break;

    case "/":
    case "*":
    case "-":
    case "+":
      x = inputBox.value;
      operator = value;
      belowAns.innerText = x + operator;
      inputBox.value = "";
      break;

    case "=":
    case "Enter":
      y = inputBox.value;
      let result;
      switch (operator) {
        case "+":
          result = Number(x) + Number(y);
          break;
        case "-":
          result = Number(x) - Number(y);
          break;
        case "*":
          result = Number(x) * Number(y);
          break;
        case "/":
          result = Number(x) / Number(y);
          break;
        case "%":
          result = (Number(x) * Number(y)) / 100;
          break;
      }
      inputBox.value = "";
      belowAns.innerText = result;
      break;

    case "Escape":
      inputBox.value = "";
      belowAns.innerText = "";
      x = "";
      break;

    default:
      inputBox.value += value;
  }
}

document.querySelectorAll("button").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    let value = e.target.innerText.trim();
    calculateValue(value);
  });
});

document.addEventListener("keydown", (e) => {
  let value = e.key;
  calculateValue(value);
});
