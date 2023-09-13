let jsonText = document.querySelector(".json-text")
let dynamicData = {
  "characterEffect": {
    "list": [
      {
        "action": "CREATE",
        "id": "obiekt-0",
        "windowTarget": "MAP",
        "target": {
          "kind": "HERO"
        },
        "effect": "TINT",
        "params": {
          "color":{
            "r": {
              "getRandom": {
                "start": 0,
                "end": 255,
                "resultType": "int"
              }
            },
            "g":0,
            "b":0,
            "a":1
          }
        },
        "case": {
          "list": [
            {
              "kind": "ARGUMENT",
              "key": "QUEST",
              "name": "ACTIVE",
              "params": []
            }
          ]
        }
      },
      {
        "action": "CREATE",
        "id": "obiekt-1",
        "windowTarget": "MAP",
        "target": {
          "kind": "HERO"
        },
        "effect": "TINT",
        "params": {
          "color":{
            "r": 255,
            "g":0,
            "b":0,
            "a":1
          }
        }
      }
    ]
  }
};

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
