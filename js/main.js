let addButton, deleteButtons, cogWheels, singleModulesContainers, toolTips, srajModuleContainers

function loadContent()
{
    const srajContainer = document.querySelector(".sraj-modules-container")
    if(localStorage.getItem('containerConfig') !== null)
    {
        const storedContainers = JSON.parse(localStorage.getItem('containerConfig'));
        const html = createContainersContent(storedContainers)
        srajContainer.innerHTML=html
    }
    else {
        fetch('config/containers.json')
        .then(response => response.json())
        .then(config => {
        const html = createContainersContent(config)
        srajContainer.innerHTML = html;
        localStorage.setItem('containerConfig', JSON.stringify(config));
        })
        .catch(error => {
        console.error('Błąd pobierania:', error);
        })
    }
}

function createContainersContent(data)
{
    let html = ''
    for(const container of data.containers)
    {   
        let containerDiv = `<div class="container">
        <div class="container-title">${container.title}</div>
        <p class="error-info hide"></p>
        <button class="edit-icon"><i class="fas fa-cog"></i></button>`
        containerDiv+= container.modules.length!==0 ? `<button class="delete-button hide">&#128465;</button>\n` : `<button class="delete-button">&#128465;</button>\n`
        for(const oneModule of container.modules)
        {
            containerDiv += `<div class="single-module-container">
            <div class="tool-tip">
                <i class="tool-tip__icon">i</i>
                <p class="tool-tip__info">
                  ${oneModule.tipInfo}
                </p>
              </div>
            <a href=""><button class="glow-on-hover" type="button"><img src="obrazki/${oneModule.name.charAt(0).toLowerCase() + oneModule.name.slice(1)}.png" alt=""><br>${oneModule.name}</button></a>
        </div>\n`
        }
        containerDiv+="</div>"
        html +=containerDiv
    }
    return html
}

function getElements(){
    addButton = document.querySelector(".plus-circle")
    deleteButtons = document.querySelectorAll(".delete-button")
    cogWheels = document.querySelectorAll(".edit-icon");
    singleModulesContainers = document.querySelectorAll(".single-module-container");
    toolTips = document.querySelectorAll(".tool-tip")
    srajModuleContainers = document.querySelector(".sraj-modules-container")
}

function createDOMEvents(){
    addButton.addEventListener("click", pushNewContainer) 
    deleteButtons.forEach(btn => {
        btn.addEventListener("click", handleDeleteClick)
    });
    cogWheels.forEach((button) => button.addEventListener("click", settingForm));
    srajModuleContainers.addEventListener("drop", handleDrop)
    singleModulesContainers.forEach((singleModuleContainer) => {
        singleModuleContainer.addEventListener("dragstart", handleDragStart);
        singleModuleContainer.addEventListener("dragend", handleDragEnd);
        singleModuleContainer.addEventListener("dragover", handleDragOver);
        singleModuleContainer.addEventListener("drop", handleDrop);
    });
    document.addEventListener("dragover", handleDragOver);
    toolTips.forEach(toolTip => {
        toolTip.addEventListener("mouseover", ()=>isHoverToolTip = true)
        toolTip.addEventListener("mouseout", ()=>isHoverToolTip = false)
    })

}

function main(){
    loadContent()
    document.addEventListener("DOMContentLoaded", () => {
        getElements()
        createDOMEvents()
    })
}

main();
const storedContainers = JSON.parse(localStorage.getItem('containerConfig'));
