class ConfigurationContainer {
    constructor(index, containerClass, listClass, name) {
      this.currentIndex = index
      this.className = containerClass
      this.listClassName = listClass
      this.name = name
    }

    removeObjectKeyByPath(path) {
      const objects = document.querySelectorAll(`input[name='${path}']`)
      objects.forEach(object => {
        if(object.type === "radio" || object.type === "checkbox")
        {
          object.checked = false
        }
      })
      const keys = path.split('.');
      let currentObj = this.workingObject;
      for (let i = 0; i < keys.length - 1; i++) {
        const currentKey = keys[i];
        if (!currentObj[currentKey] || typeof currentObj[currentKey] !== 'object') {
          return;
        }
        currentObj = currentObj[currentKey];
      }

      const lastKey = keys[keys.length - 1];
      if (currentObj && typeof currentObj === 'object' && lastKey in currentObj) {
        if(Object.keys(currentObj).length===1)
        {
          const lastDotIndex = path.lastIndexOf(".");
          const penultimate = path.substring(0, lastDotIndex);
          this.removeObjectKeyByPath(penultimate)
        }
        else{
          delete currentObj[lastKey];
        }
        
      }
    }

    hideAndRevealRequiredItems()
    {
      let allConditionsAreMet
      this.requiredItems.forEach(item => {
        allConditionsAreMet = true
        if(item.inputType === "key" || item.inputType === "subkey")
        {
          const headers = findHeadersById(item.idInput, this.className)
          for(let i = 0 ; i < item.require.length ; i++) {
            const valueInObject = getValueFromObject(this.workingObject, item.require[i].name)
            if(valueInObject !==null){
             if(!item.require[i].value.includes(valueInObject)){
              allConditionsAreMet = false
              break;
            }
          }
          else if(!item.require[i].value.includes(findObjectByProperty(this.jsonConfig.properties, item.require[i].name, "name").defaultSraj)){
              allConditionsAreMet = false
              break;
            }
          }
          if(!allConditionsAreMet)
          {
              headers.forEach(header => {
                header.parentNode.classList.add("hide")
                header.parentNode.nextElementSibling.classList.add("hide")
              })
          }
          else{
            headers.forEach(header => {
              header.parentNode.classList.remove("hide")
              header.parentNode.nextElementSibling.classList.remove("hide")
            })
          }
        }
        else{
          let inputs
          for(let i = 0 ; i < item.require.length ; i++) {
            const valueInObject = getValueFromObject(this.workingObject, item.require[i].name)
            if(valueInObject !==null){
             if(!item.require[i].value.includes(valueInObject)){
              allConditionsAreMet = false
              break;
            }
          }
            else if(findObjectByProperty(this.jsonConfig.properties, item.require[i].name, "name").defaultSraj && !item.require[i].value.includes(findObjectByProperty(this.jsonConfig.properties, item.require[i].name, "name").defaultSraj)){
              allConditionsAreMet = false
              break;
            }
          }
          if(!allConditionsAreMet)
          {
            if(item.idInput){
              inputs = findInputsById(item.idInput, this.className)
            }
            else{
              inputs = findInputsById(item.name, this.className)
            }
            inputs.forEach(input => {
              if(input.type === "radio" || input.type==="checkbox")
              {
                input.parentNode.parentNode.classList.add("hide")
                input.checked = false
              }
              else{
                input.parentNode.classList.add("hide")
              }
            })
          }
          else{
            if(item.idInput){
              inputs = findInputsById(item.idInput, this.className)
            }
            else{
              inputs = findInputsById(item.name, this.className)
            }
            inputs.forEach(input => {
              if(input.type === "radio" || input.type==="checkbox")
              {
                input.parentNode.parentNode.classList.remove("hide")
              }
              else{
                input.parentNode.classList.remove("hide")
              }
            })
          }
        }
      })
    }

    setObjectKeyByPath(path, value) {

      const keys = path.split('.');
      let currentObj = this.workingObject;
    
      for (let i = 0; i < keys.length - 1; i++) {
        const currentKey = keys[i];
        if (!currentObj[currentKey] || typeof currentObj[currentKey] !== 'object') {
          currentObj[currentKey] = {};
        }
        currentObj = currentObj[currentKey];
      }
      const lastKey = keys[keys.length - 1];
      currentObj[lastKey] = value;
    }

    createObjectList(){
      const containerList = document.querySelector(`.${this.listClassName}`)
      let objectsContainerHtml = ""
      let isChecked = false
      if(this.hasList){
        let ids;
        switch(this.name){
          case "case", "characterHide":
            ids = this.list.map(item => item.kind);
            break;  
            default:
              ids = this.list.map(item => item.id || item.name);
              break;
        }
        ids.forEach(id => {
            let checkedClass = id === this.workingObject.id || id === this.workingObject.name || id === this.workingObject.kind ? "radio-checked" : ""
            if(checkedClass && !isChecked){
              isChecked = true
            }
            else{
              checkedClass = ""
            }
            const drag = this.name === "behavior" ? "true" : "false"
            objectsContainerHtml+= `<div draggable=${drag} class="single-object-container" ><label class="object-list-element ${checkedClass}"><input type="radio" name="object-list" class="radio-input">${id}</label><div class="copy-icon">⧉</div><div class="delete-icon">🗑️</div></div>`;
          });
            objectsContainerHtml += '<div class="plus-circle add-object"><span class="fas fa-plus"></span></div>'
        }
         else{
          let name = this.name
          if(this === keyContainer){
            try{
              name = getLastPartOfTheName(this.event.previousElementSibling.previousElementSibling.name)
            }
            //Dla Randomfirstindex
            catch{
              name = getLastPartOfTheName(this.event.previousElementSibling.textContent)
              name = name.substring(0, name.length-1)
            }
            objectsContainerHtml+= `<div class="single-object-container"><label class="object-list-element radio-checked" checked><input type="radio" name="object-list" class="radio-input">${name}</label><div class="copy-icon">⧉</div><div class="delete-icon">🗑️</div></div>`;
          }
        }
      containerList.innerHTML+=objectsContainerHtml 
    }
}
