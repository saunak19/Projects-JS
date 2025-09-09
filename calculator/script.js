let inputBox = document.getElementById("calInput");

document.querySelectorAll("button").forEach((btn) => {
  btn.addEventListener("click", (e) => calculate(e));
});

function calculate(e) {
  {
    let value = e.target.innerText.trim();
    let numValue = Number(value);
    let belowAns = document.getElementById("sub-ans");
    if (!isNaN(numValue)) {
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
        belowAns.innerText = x;
        inputBox.value = "";
        break;
      case "=":
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
      default:
        inputBox.value += value;
    }
  }
}
