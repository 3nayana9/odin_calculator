// ── Math functions ──────────────────────────────────────────────────────────
function add(a, b)      { return a + b; }
function subtract(a, b) { return a - b; }
function multiply(a, b) { return a * b; }
function divide(a, b) {
    if (b === 0) return "Can't divide by zero 😎";
    return a / b;
}

function operate(operator, a, b) {
    a = Number(a);
    b = Number(b);
    switch (operator) {
        case "+": return add(a, b);
        case "-": return subtract(a, b);
        case "*": return multiply(a, b);
        case "/": return divide(a, b);
        default:  return null;
    }
}

function roundResult(number) {
    if (typeof number === "string") return number;
    return Math.round(number * 1e9) / 1e9;
}

// ── State ────────────────────────────────────────────────────────────────────
let firstNumber      = "";
let secondNumber     = "";
let currentOperator  = null;
let justEvaled       = false;

const opSymbol = { "+": "+", "-": "−", "*": "×", "/": "÷" };

// ── DOM references ───────────────────────────────────────────────────────────
const display         = document.getElementById("display");
const exprDisplay     = document.getElementById("expr");
const numberButtons   = document.querySelectorAll(".number");
const operatorButtons = document.querySelectorAll(".operator");
const equalsButton    = document.getElementById("equals");
const clearButton     = document.querySelector(".clear");
const decimalButton   = document.getElementById("decimal");
const backspaceButton = document.getElementById("backspace");

// ── Helpers ──────────────────────────────────────────────────────────────────
function updateExpr() {
    if (!exprDisplay) return;
    if (currentOperator && firstNumber !== "") {
        const sym = opSymbol[currentOperator] || currentOperator;
        exprDisplay.textContent = secondNumber !== ""
            ? firstNumber + " " + sym + " " + secondNumber
            : firstNumber + " " + sym;
    } else {
        exprDisplay.textContent = "";
    }
}

// ── Actions (shared by buttons and keyboard) ──────────────────────────────────

function inputDigit(digit) {
    if (justEvaled) {
        firstNumber     = "";
        secondNumber    = "";
        currentOperator = null;
        justEvaled      = false;
    }

    if (currentOperator === null) {
        if (firstNumber === "0") firstNumber = "";
        firstNumber += digit;
        display.textContent = firstNumber;
    } else {
        if (secondNumber === "0") secondNumber = "";
        secondNumber += digit;
        // Keeps both the first number and current operator visible while typing the second number
        display.textContent = firstNumber + " " + currentOperator + " " + secondNumber;
    }

    updateExpr();
}

function inputOperator(op) {
    if (firstNumber === "") return;

    if (secondNumber === "" && !justEvaled) {
        currentOperator = op;
        display.textContent = firstNumber + " " + currentOperator;
        updateExpr();
        return;
    }

    if (secondNumber !== "") {
        let result  = roundResult(operate(currentOperator, firstNumber, secondNumber));
        firstNumber = String(result);
        secondNumber = "";
    }

    currentOperator = op;
    display.textContent = firstNumber + " " + currentOperator;
    justEvaled      = false;
    updateExpr();
}

function inputEquals() {
    if (firstNumber === "" || secondNumber === "" || currentOperator === null) return;

    const sym     = opSymbol[currentOperator] || currentOperator;
    const exprStr = firstNumber + " " + sym + " " + secondNumber;
    let result    = roundResult(operate(currentOperator, firstNumber, secondNumber));

    if (exprDisplay) exprDisplay.textContent = exprStr + " =";
    display.textContent = result;

    firstNumber     = String(result);
    secondNumber    = "";
    currentOperator = null;
    justEvaled      = true;
}

function inputDecimal() {
    if (justEvaled) {
        firstNumber     = "0";
        secondNumber    = "";
        currentOperator = null;
        justEvaled      = false;
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
        display.textContent = firstNumber + " " + currentOperator + " " + secondNumber;
    }

    updateExpr();
}

function inputBackspace() {
    if (justEvaled) return;

    if (currentOperator === null) {
        firstNumber         = firstNumber.slice(0, -1);
        display.textContent = firstNumber || "0";
    } else if (secondNumber !== "") {
        secondNumber        = secondNumber.slice(0, -1);
        display.textContent = firstNumber + " " + currentOperator + " " + secondNumber;
    } else {
        // If second number is empty, remove the operator entirely
        currentOperator = null;
        display.textContent = firstNumber || "0";
    }

    updateExpr();
}

function inputClear() {
    firstNumber     = "";
    secondNumber    = "";
    currentOperator = null;
    justEvaled      = false;
    display.textContent = "0";
    if (exprDisplay) exprDisplay.textContent = "";
}

// ── Button listeners ──────────────────────────────────────────────────────────

numberButtons.forEach(button => {
    button.addEventListener("click", () => inputDigit(button.textContent.trim()));
});

operatorButtons.forEach(button => {
    button.addEventListener("click", () => inputOperator(button.textContent.trim()));
});

equalsButton.addEventListener("click",    inputEquals);
clearButton.addEventListener("click",     inputClear);
decimalButton.addEventListener("click",   inputDecimal);
backspaceButton.addEventListener("click", inputBackspace);

// ── Keyboard support ──────────────────────────────────────────────────────────

document.addEventListener("keydown", (e) => {
    if (e.key >= "0" && e.key <= "9")            inputDigit(e.key);
    else if (e.key === "+")                       inputOperator("+");
    else if (e.key === "-")                       inputOperator("-");
    else if (e.key === "*")                       inputOperator("*");
    else if (e.key === "/") {
        e.preventDefault();
        inputOperator("/");
    }
    else if (e.key === "Enter" || e.key === "=")  inputEquals();
    else if (e.key === ".")                        inputDecimal();
    else if (e.key === "Backspace")               inputBackspace();
    else if (e.key === "Escape" || e.key === "c" || e.key === "C") inputClear();
});