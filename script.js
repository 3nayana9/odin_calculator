// Math functions
function add(a, b) { return a + b; }
function subtract(a, b) { return a - b; }
function multiply(a, b) { return a * b; }
function divide(a, b) { return b === 0 ? "Err" : a / b; }

function operate(operator, a, b) {
    a = Number(a);
    b = Number(b);
    switch (operator) {
        case "+": return add(a, b);
        case "-": return subtract(a, b);
        case "*": return multiply(a, b);
        case "/": return divide(a, b);
        default: return null;
    }
}

function roundResult(number) {
    if (typeof number === "string") return number;
    return Math.round(number * 1e9) / 1e9;
}

// Calculator state
let firstNumber = "";
let secondNumber = "";
let currentOperator = null;
let justEvaled = false;

const opSymbol = { "+": "+", "-": "−", "*": "×", "/": "÷" };

// DOM references
const display = document.getElementById("display");
const exprDisplay = document.getElementById("expr"); // small top expression bar (add this element to your HTML)
const numberButtons = document.querySelectorAll(".number");
const operatorButtons = document.querySelectorAll(".operator");
const equalsButton = document.getElementById("equals");
const clearButton = document.querySelector(".clear");
const decimalButton = document.getElementById("decimal");
const backspaceButton = document.getElementById("backspace");

function updateExpr() {
    if (!exprDisplay) return;
    if (currentOperator && firstNumber !== "") {
        if (secondNumber !== "") {
            exprDisplay.textContent = firstNumber + " " + opSymbol[currentOperator] + " " + secondNumber;
        } else {
            exprDisplay.textContent = firstNumber + " " + opSymbol[currentOperator];
        }
    } else {
        exprDisplay.textContent = "";
    }
}

// Number input
numberButtons.forEach(button => {
    button.addEventListener("click", () => {
        const digit = button.textContent;

        if (justEvaled) {
            firstNumber = "";
            secondNumber = "";
            currentOperator = null;
            justEvaled = false;
        }

        if (currentOperator === null) {
            if (firstNumber === "0" && digit !== ".") firstNumber = "";
            firstNumber += digit;
            display.textContent = firstNumber;
        } else {
            if (secondNumber === "0" && digit !== ".") secondNumber = "";
            secondNumber += digit;
            display.textContent = secondNumber;
        }

        updateExpr();
    });
});

// Operator input
operatorButtons.forEach(button => {
    button.addEventListener("click", () => {
        if (firstNumber === "") return;

        // Evaluate if second number exists
        if (secondNumber !== "") {
            let result = roundResult(operate(currentOperator, firstNumber, secondNumber));
            firstNumber = String(result);
            secondNumber = "";
            display.textContent = firstNumber;
        }

        currentOperator = button.textContent;
        display.textContent += button.textContent; 
        justEvaled = false;
        updateExpr();
    });
});

// Equals button
equalsButton.addEventListener("click", () => {
    if (firstNumber === "" || secondNumber === "" || currentOperator === null) return;

    const exprStr = firstNumber + " " + opSymbol[currentOperator] + " " + secondNumber;
    let result = roundResult(operate(currentOperator, firstNumber, secondNumber));

    if (exprDisplay) exprDisplay.textContent = exprStr + " =";
    display.textContent = result;

    firstNumber = String(result);
    secondNumber = "";
    currentOperator = null;
    justEvaled = true;
});

// Clear button
clearButton.addEventListener("click", () => {
    firstNumber = "";
    secondNumber = "";
    currentOperator = null;
    justEvaled = false;
    display.textContent = "0";
    if (exprDisplay) exprDisplay.textContent = "";
});

// Decimal button — FIX: check the active number string, not the display
decimalButton.addEventListener("click", () => {
    if (justEvaled) {
        firstNumber = "0";
        secondNumber = "";
        currentOperator = null;
        justEvaled = false;
    }

    if (currentOperator === null) {
        if (firstNumber.includes(".")) return;
        if (firstNumber === "") firstNumber = "0";
        firstNumber += ".";
        display.textContent = firstNumber;
    } else {
        if (secondNumber.includes(".")) return;
        if (secondNumber === "") secondNumber = "0";
        secondNumber += ".";
        display.textContent = secondNumber;
    }

    updateExpr();
});

// Backspace button — FIX: slice the active state variable directly, not display
backspaceButton.addEventListener("click", () => {
    if (justEvaled) return;

    if (currentOperator === null) {
        firstNumber = firstNumber.slice(0, -1);
        display.textContent = firstNumber || "0";
    } else {
        secondNumber = secondNumber.slice(0, -1);
        display.textContent = secondNumber || "0";
    }

    updateExpr();
});