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

function createSrajModulesMenu(data) {
  const ulList = document.querySelector(".sraj-modules-menu");
  if (ulList.hasChildNodes()) {
    while (ulList.firstChild) {
      ulList.removeChild(ulList.firstChild);
    }
}
  for (let key in data) {
    const moduleElement = document.createElement("li");
    const aMainElement = document.createElement("a");
    aMainElement.setAttribute("href", `/modules/${key}.html`);
    aMainElement.textContent = key
    aMainElement.textContent=key
    moduleElement.append(aMainElement)
    moduleElement.addEventListener("click", () => {
      window.location.href = aMainElement.getAttribute("href");
    });
    ulList.append(moduleElement)
    if(data[key].hasOwnProperty("list"))
    {
      const idUL = document.createElement("ul");
      idUL.classList.add("submenu")
      const ids = data[key].list.map(item => item.id || item.name);
      ids.forEach(id => {
        const liElement = document.createElement("li"); 
        const aElement = document.createElement("a");
        aElement.setAttribute("href", `/modules/${key}.html`);
        aElement.textContent = id
        liElement.addEventListener("click", () => {
          window.location.href = aElement.getAttribute("href");
        });
        liElement.append(aElement)
        idUL.append(liElement)
      });
      moduleElement.appendChild(idUL);
    }
  }
}

function updateJson()
{
  const jsonText = document.querySelector(".json-text")
  try{
    jsonText.value = JSON.stringify(dynamicData, null, 2);
    jsonText.classList.remove("error-json")
    
  }
  catch(error)
  {
    jsonText.classList.add("error-json")
  }
  saveJsonState()
  createSrajModulesMenu(dynamicData);
}

updateJson()


