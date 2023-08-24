function saveSrajContainerState() {
    const mainContainerHTML = document.querySelector('.sraj-modules-container').innerHTML;
    localStorage.setItem('srajContainerState', mainContainerHTML);
}

function restoreSrajContainerState() {
    const srajModuleContainer = document.querySelector(".sraj-modules-container")
    const mainContainerHTML = localStorage.getItem('srajContainerState');
    if (mainContainerHTML) {
        srajModuleContainer.innerHTML = mainContainerHTML;
    }
}

function saveJsonState() {
    const jsonText = document.querySelector(".json-text")
    localStorage.setItem('lastJson', jsonText.value);
}

function restoreLastJson(){
    const jsonText = document.querySelector(".json-text")
    savedJson = localStorage.getItem('lastJson');
    if(savedJson)
    {
    jsonText.value = JSON.stringify(JSON.parse(savedJson), null, 2);
    createSrajModulesMenu(dynamicData);
    }
}

restoreSrajContainerState()
restoreLastJson()

localStorage.clear()