let jsonText = document.querySelector(".json-text")
let dynamicData = {}

jsonText.addEventListener("keyup", () => {
    try {
        dynamicData = JSON.parse(jsonText.value)
        jsonText.classList.remove("error-json")
        saveJsonState()
        createSrajModulesMenu(dynamicData);
    }
    catch(error){
        jsonText.classList.add("error-json")
    }
})

function restoreLastJson(){
  const jsonText = document.querySelector(".json-text")
  if(localStorage.getItem('lastJson'))
  {
      savedJson = localStorage.getItem('lastJson');
      dynamicData = JSON.parse(savedJson)
  }
  jsonText.value = JSON.stringify(dynamicData, null, 2);
}

function saveJsonState() {
  localStorage.setItem('lastJson', jsonText.value);
}

function updateJson()
{
  updateJsonTextArea()
  saveJsonState()
  createSrajModulesMenu(dynamicData);
}

function updateJsonTextArea(){
  jsonText = document.querySelector(".json-text")
  try{
    jsonText.value = JSON.stringify(dynamicData, null, 2);
    jsonText.classList.remove("error-json")
    
  }
  catch(error)
  {
    jsonText.classList.add("error-json")
  }

}
