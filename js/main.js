let addButton, deleteButtons, cogWheels, singleModulesContainers, toolTips, srajModuleContainers, jsonButtons, moduleButtons

function loadContent()
{
    const srajContainer = document.querySelector(".handle-container")
    if(localStorage.getItem('containerConfig') !== null)
    {
        const storedContainers = JSON.parse(localStorage.getItem('containerConfig'));
        const srajContainerHtml = createContainersContent(storedContainers)
        srajContainer.innerHTML=srajContainerHtml
    }
    else {
        fetch('config/containers.json')
        .then(response => response.json())
        .then(config => {
        const srajContainerHtml = createContainersContent(config)
        srajContainer.innerHTML = srajContainerHtml;
        localStorage.setItem('containerConfig', JSON.stringify(config));
        })
        .catch(error => {
        console.error('Błąd pobierania:', error);
        })
    }
    const buttonsContainer = document.querySelector(".buttons-container")
    const jsonButtonsHtml = createJsonButtons()
    buttonsContainer.innerHTML = jsonButtonsHtml
    restoreLastJson()
}

function createContainersContent(data)
{
    let html ='<div class="sraj-modules-container">'
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
            <a href="/configuration.html"><button class="glow-on-hover" type="button"><img src="obrazki/${oneModule.name.charAt(0).toLowerCase() + oneModule.name.slice(1)}.png" alt=""><br>${oneModule.name}</button></a>
        </div>\n`
        }
        containerDiv+="</div>"
        html +=containerDiv
    }
    html+="</div>"
    return html
}

function restoreLastJson(){
    const jsonText = document.querySelector(".json-text")
    if(localStorage.getItem('lastJson'))
    {
        savedJson = localStorage.getItem('lastJson');
        dynamicData = JSON.parse(savedJson)
    }
    jsonText.value = JSON.stringify(dynamicData, null, 2);
    createSrajModulesMenu(dynamicData);
  }

function getElements(){
    addButton = document.querySelector(".plus-circle")
    deleteButtons = document.querySelectorAll(".delete-button")
    cogWheels = document.querySelectorAll(".edit-icon");
    singleModulesContainers = document.querySelectorAll(".single-module-container");
    toolTips = document.querySelectorAll(".tool-tip")
    srajModuleContainers = document.querySelector(".sraj-modules-container")
    jsonButtons = document.querySelectorAll(".json-buttons")
    moduleButtons = document.querySelectorAll(".glow-on-hover")
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
    jsonButtons.forEach(button => button.addEventListener("click", buttonClick))
    moduleButtons.forEach(button => {
        button.addEventListener("click", () => {
            localStorage.setItem("index", 0)
            localStorage.setItem('module', button.textContent.charAt(0).toLowerCase() + button.textContent.slice(1));
        })
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

