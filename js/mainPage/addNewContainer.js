const addButton = document.querySelector(".plus-circle")

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

    const titles = document.querySelectorAll(".container-title");
    const titleIndex = titles.length;
    localStorage.setItem(`title-${titleIndex}`, "Nowy kontener");

    return newContainer;
}

function pushNewContainer(){
    const containers = document.querySelectorAll(".container")
    if(containers.length<7)
    {
        const newContainer = createNewContainer()
        const mainContainer = document.querySelector(".sraj-modules-container")
        mainContainer.append(newContainer);
        saveState()
    }
    else
    {
        alert('Nie możesz mieć więcej niż 7 kontenerów.')
    }
}

addButton.addEventListener("click", pushNewContainer)