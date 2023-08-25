

class Container{
    constructor(title, modules) {
        this.title = title
        this.modules = modules
    }

}

function createNewContainer(){
    const containerHTML = `
            <div class="container-title">Nowy kontener</div>
            <p class="error-info hide"></p>
            <button class="edit-icon"><i class="fas fa-cog"></i></button>
            <button class="delete-button">&#128465;</button>
    `;

    const newContainer = document.createElement("div");
    newContainer.classList.add("container")
    newContainer.innerHTML = containerHTML;

    const editIcon = newContainer.querySelector(".edit-icon");
    editIcon.addEventListener("click", settingForm);

    const deleteButton = newContainer.querySelector(".delete-button");
    deleteButton.addEventListener("click", handleDeleteClick);

    return newContainer;
}

function pushNewContainer(){
    const containers = document.querySelectorAll(".container")
    if(containers.length<7)
    {
        const newContainer = createNewContainer()
        const mainContainer = document.querySelector(".sraj-modules-container")
        mainContainer.append(newContainer);
        const storedContainers = JSON.parse(localStorage.getItem('containerConfig'));
        storedContainers.containers.push({title: "Nowy kontener", modules:[]})
        localStorage.setItem('containerConfig', JSON.stringify(storedContainers));
    }
    else
    {
        alert('Nie możesz mieć więcej niż 7 kontenerów.')
    }
}

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

function isContainerEmpty(container) {
    const singleModuleContainers = container.querySelectorAll(".single-module-container");
    return singleModuleContainers.length === 0;
}

function handleDeleteClick(event) {
    const container = event.target.parentNode
    container.remove()
    const storedContainers = JSON.parse(localStorage.getItem('containerConfig'));

    deleteContainerTitle = event.target.parentNode.querySelector('.container-title').textContent
    const toDeleteContainer = storedContainers.containers.find(container => (container.title === deleteContainerTitle && container.modules.length === 0));
    if (toDeleteContainer) {
        const indexToDelete = storedContainers.containers.indexOf(toDeleteContainer);

        if (indexToDelete !== -1) {
            storedContainers.containers.splice(indexToDelete, 1);
            localStorage.setItem('containerConfig', JSON.stringify(storedContainers));
            console.log("Usunięto kontener:", toDeleteContainer);
        } 
        else {
            console.log("Nie znaleziono kontenera do usunięcia.");
        }
    } 
}