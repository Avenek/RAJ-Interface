const cogWheels = document.querySelectorAll(".edit-icon");
const titles = document.querySelectorAll(".container-title");


function  settingForm(e){
    const titleDiv = e.target.parentElement.parentElement.querySelector(".container-title");
    const titleIndex = Array.from(titles).indexOf(titleDiv);

    const input = createInput(titleDiv)

    input.addEventListener("keyup", (event) => changeName(event, titleDiv, input, titleIndex));
    input.addEventListener("blur", (event) => changeName(event, titleDiv, input, titleIndex));

    titleDiv.textContent = "";
    titleDiv.appendChild(input);
    input.focus();
};

function createInput(titleDiv){
    const input = document.createElement("input");
    input.style.width = "200px";
    input.type = "text";
    input.value = titleDiv.textContent;

    return input
}

function changeName(event, titleDiv, input, titleIndex){
    if (event.key === "Enter" || event.type === "blur") {
        const newValue = input.value.trim();
        const errorInfo = titleDiv.nextElementSibling
        if (newValue !== "") {
            titleDiv.textContent = newValue;
            saveSrajContainerState()
            errorInfo.classList.add("hide")
            input.remove();

        } 
        else {
            errorInfo.textContent = "Wprowadź nazwę kategorii!"
            errorInfo.classList.remove("hide")
        }
        
    }
};

cogWheels.forEach((button) => button.addEventListener("click", settingForm));