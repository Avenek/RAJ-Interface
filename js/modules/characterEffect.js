const objectProperties = document.querySelector(".object-property-list")

class CharacterEffect {
    constructor(action, id, windowTarget, effect, target, params) {
      this.action = action;
      this.id = id;
      this.windowTarget = windowTarget;
      this.effect = effect;
      this.target = target;
      this.params = params;
    }
  }
  
  class Target {
    constructor(kind, id) {
      this.kind = kind;
      this.id = id;
    }
  }
  
  class Params {
    constructor(duration, color, repeat, delayBefore) {
      this.duration = duration;
      this.color = color;
      this.repeat = repeat;
      this.delayBefore = delayBefore;
    }
  }

  function createObjectMenu(module) {

    if(!dynamicData.hasOwnProperty(module))
    {
        dynamicData.characterEffect={};
    }
    const listID = document.createElement("li")
    listID.classList.add("properties-element")
    listID.textContent = "Lista obiektów:"
    const ids = dynamicData[module].list.map(item => item.id || item.name);
    if(ids.length >0)
    {
      listID.classList.add("drop-down")
      ulID = document.createElement("ul")
      ids.forEach(id => {
        const liElement = document.createElement("li");
        liElement.textContent = id
        ulID.append(liElement)
      });
      listID.append(ulID)
    }
    objectProperties.append(listID)
  }

//createObjectMenu("characterEffect")
function setupRadioButtons(radioButtons) {
    radioButtons.forEach(radioButton => {
        radioButton.addEventListener('click', () => {
            radioButtons.forEach(rb => {
                rb.parentNode.classList.remove('checked');
            });
            radioButton.parentNode.classList.add('checked');
        });
    });
}

// Pobieranie radio buttonów po name
const actionInputs = document.querySelectorAll('input[name="action"]');
const windowTargetInputs = document.querySelectorAll('input[name="windowTarget"]');
const effectInputs = document.querySelectorAll('input[name="effect"]');

// Wywołanie funkcji dla różnych grup radio buttonów
setupRadioButtons(actionInputs);
setupRadioButtons(windowTargetInputs);
setupRadioButtons(effectInputs);