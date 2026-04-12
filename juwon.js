const buttons = document.querySelectorAll(".btn-number, .btn-alt, .btn-operator, .zero, .btn");
const display_area = document.querySelector("#display_area");

function isNumber(n){
    let new_value = Number(n);
    if (!isNaN(new_value) || n === ".") {
        return true;
    } else {
        return false;
    }
}

buttons.forEach(button => {
    button.addEventListener("click", (e) => {
        let cap_value = e.target.innerText;
        
        if (isNumber(cap_value)) {
            if (cap_value === ".") {
                if (!display_area.innerText.includes(".")) {
                    display_area.innerText += cap_value;
                }
            } else {
                if (display_area.innerText === "0") {
                    display_area.innerText = cap_value;
                } else {
                    display_area.innerText += cap_value;
                }
            }
        } else {
            switch (cap_value) {
                case "A/C":
                    display_area.innerText = "0";
                    break;
                case "=":
                    try {
                        display_area.innerText = eval(display_area.innerText);
                    } catch {
                        display_area.innerText = "Error";
                    }
                    break;
                case "+":
                case "-":
                case "*":
                case "/":
                case "%":
                    display_area.innerText += cap_value;
                    break;
                case "+/-":
                    display_area.innerText = display_area.innerText * -1;
                    break;
            }
        }
    });
});
       
