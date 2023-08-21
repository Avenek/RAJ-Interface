const cogWheels = document.querySelectorAll(".edit-icon");
const titles = document.querySelectorAll(".container-title");
const defaultTitles = [
    "Moduły związane z postaciami",
    "Moduły związane z mapą",
    "Moduły związane z dialogiem",
    "Pozostałe",
    "Klucze funkcyjne"
];


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
            localStorage.setItem(`title-${titleIndex}`, newValue);
            errorInfo.classList.add("hide")
            input.remove();

        } 
        else {
            errorInfo.textContent = "Wprowadź nazwę kategorii!"
            errorInfo.classList.remove("hide")
        }
        
    }
};

function setTitles() {
    for (let i = 0; i < titles.length; i++) {
        const savedTitle = localStorage.getItem(`title-${i}`);
        titles[i].textContent = savedTitle || defaultTitles[i];
    }
}

// Wywołanie funkcji do ustawiania tytułów po załadowaniu strony
document.addEventListener("DOMContentLoaded", setTitles);
cogWheels.forEach((button) => button.addEventListener("click", settingForm));