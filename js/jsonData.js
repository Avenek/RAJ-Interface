let jsonText = document.querySelector(".json-text")
let dynamicData = {
  "characterEffect": {
    "list":[
      {
        "action"        : "CREATE",
        "id"          : "Sralala",
        "windowTarget"  : "MAP",
        "effect"        : "TINT",
        "target"        : {
          "kind": "NPC", 
          "id": 1
        },
        "params": {
          "duration": 0.2,
          "color"   : {"r": 0, "g":0, "b":0},
          "repeat"  : 2,
          "delayBefore": 10
        }
      },
      {
        "action"        : "REMOVE",
        "id"          : "Testowy tint",
        "windowTarget"  : "MAP",
        "effect"        : "ANIMATION",
        "target"        : {
          "kind": "NPC", 
          "id": 1
        },
        "params": {
        "gifUrl": "characterEffects/kup23-pnacza.gif",        
          "delayAfter": 3,
          "repeat"  : true,
          "position": "LEFT_HAND",
          "behind": true
        }
      }
    ]
  },
  "weather": {
    "list": [
      {
        "action": "CREATE",
        "name": "Snow",
        "speedX": 0,
        "speedY": 0
      },
      {
        "action": "CREATE",
        "name": "Rain",
        "speedX": 2,
        "speedY": -1
      }
    ]
  },
  "mapFilter": {
    "color": {
      "r": 0,
      "g": 0,
      "b": 0,
      "a": 0.2
    }
  },
    "floatObject": {
      "list": [
        {
          "id": "chmura1",
          "action": "CREATE",
          "url": "chmury/obj1.png",
          "x": 9,
          "y": 14,
          "withCreateInstantFadeIn": true,
          "color": {
            "r": 0,
            "g": 0,
            "b": 255,
            "a": 1
          },
          "behavior": {
            "repeat": true,
            "list": [
              {
                "name": "IDLE",
                "duration": 1
              },
              {
                "name": "ROTATION",
                "speed": 2,
                "addAngle": 180
              },
              {
                "name": "IDLE",
                "duration": 1
              }
            ]
          }
        },
        {
          "id": "chmura2",
          "action": "CREATE",
          "url": "chmury/obj1.png",
          "x": 9,
          "y": 14,
          "withCreateInstantFadeIn": true,
          "color": {
            "r": 0,
            "g": 255,
            "b": 0,
            "a": 1
          },
          "behavior": {
            "repeat": true,
            "list": [
              {
                "name": "IDLE",
                "duration": 1
              },
              {
                "name": "MOVE_TO_CORDS",
                "x": 20,
                "y": 15,
                "attachRotation": {
                  "addAngle": 90
                }
              },
              {
                "name": "IDLE",
                "duration": 1
              },
              {
                "name": "MOVE_TO_CORDS",
                "x": 9,
                "y": 20,
                "attachRotation": {
                  "addAngle": -180,
                  "speed": 0.1
                }
              }
            ]
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
