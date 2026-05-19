const display = document.getElementById("display");

const numberButtons = document.querySelectorAll(".number");
const operatorButtons = document.querySelectorAll(".operator");

const equalsButton = document.querySelector(".equals");
const clearButton = document.querySelector(".clear");

let firstNumber = "";
let secondNumber = "";
let currentOperator = "";

numberButtons.forEach(button=>{
    button.addEventListener("click",()=>{
        if(currentOperator === ""){
            firstNumber += button.textContent;
            display.textContent = firstNumber;

        }else{
            secondNumber += button.textContent;
            display.textContent += secondNumber;
        }

    });
});

operatorButtons.forEach(button=>{
    button.addEventListener("click",()=>{
        currentOperator = button.textContent;
        display.textContent += currentOperator;
    });
});

equalsButton.addEventListener("click" ,()=>{
    let num1 = Number(firstNumber);
    let num2 = Number(secondNumber);

    let result;

    if(currentOperator === "+") result = num1+num2;
    else if(currentOperator === "-") result = num1-num2;
    else if(currentOperator === '*') result = num1*num2;
    else if(currentOperator === "/") result = num1/num2;

    display.textContent = result;

    firstNumber = result.toString();
    secondNumber = "";
    currentOperator = "";
});

clearButton.addEventListener("click" , ()=>{

    firstNumber = "";
    secondNumber ="";
    currentOperator = "";
    display.textContent = "0";
});
