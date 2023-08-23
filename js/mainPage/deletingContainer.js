const deleteButtons = document.querySelectorAll(".delete-button")

// Obsługa kliknięcia na element "X"
function handleDeleteClick(event) {
    const container = event.target.parentNode
    container.remove()
    saveSrajContainerState()
}

// Funkcja, która dodaje element "X" do kontenera w zależności od stanu
function updateContainerWithDeleteElement(container) {
    const isContainerEmptyValue = isContainerEmpty(container);
    const deleteButton = container.querySelector(".delete-button")
    // Jeśli kontener jest pusty i nie ma jeszcze elementu "X", dodaj go
    if (isContainerEmptyValue && deleteButton.classList.contains("hide")) {
       deleteButton.classList.remove("hide")
    }
    // Jeśli kontener nie jest pusty i ma element "X", usuń go
    else if (!isContainerEmptyValue && !deleteButton.classList.contains("hide")) {
        deleteButton.classList.add("hide")
    }
}

// Sprawdzenie, czy kontener jest pusty
function isContainerEmpty(container) {
    const singleModuleContainers = container.querySelectorAll(".single-module-container");
    return singleModuleContainers.length === 0;
}

deleteButtons.forEach(btn => {
    btn.addEventListener("click", handleDeleteClick)
});