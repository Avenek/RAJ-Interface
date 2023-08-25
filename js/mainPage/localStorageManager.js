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

//restoreLastJson()
