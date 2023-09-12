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
          removeObjectKeyByPath(penultimate)
        }
        else{
          delete currentObj[lastKey];
        }
        
      }
    }

    hideAndRevealRequiredItems()
    {
      this.requiredItems.forEach(item => {
        if(item.inputType === "key" || item.inputType === "subkey")
        {
          const headers = findHeadersByName(item.name, this.className)

          if(!item.require.value.includes(getValueFromObject(this.workingObject, item.require.name)))
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
          if(!item.require.value.includes(getValueFromObject(this.workingObject, item.require.name)))
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
      if(this.hasList){
        let ids;
        switch(this.name){
          case "case":
            ids = this.list.map(item => item.kind);
            break;  
            default:
              ids = this.list.map(item => item.id || item.name);
              break;
        }
        ids.forEach(id => {
            const checkedClass = id === this.workingObject.id || id === this.workingObject.name || this.workingObject.kind ? "radio-checked" : ""
            objectsContainerHtml+= `<div class="single-object-container"><label class="object-list-element ${checkedClass}"><input type="radio" name="object-list" class="radio-input">${id}</label><div class="delete-icon">🗑️</div></div>`;
          });
            objectsContainerHtml += '<button class="plus-circle add-object"><i class="fas fa-plus"></i></button>'
        }
         else{
             objectsContainerHtml+= `<div class="single-object-container"><label class="object-list-element checked"><input type="radio" name="object-list" class="radio-input">${this.workingObject}</label><div class="delete-icon">🗑️</div></div>`;
        }
      containerList.innerHTML+=objectsContainerHtml 
    }
}