class ObjectFormView extends View{
    constructor(moduleObjectForm){
        super()
       this.moduleObjectForm = moduleObjectForm
    }

    displayObjectForm = (objectFormList) => {
      this.moduleObjectForm.innerHTML = ""
        this.moduleObjectForm.innerHTML = this.createObjectForm(objectFormList)
    }

    createObjectForm = (objectFormList) => {
        let html = ''
        for (const property of objectFormList) {
            const isHide = property.hide ? " hide" : ""
            if(property.inputType.includes("key")){
              let isCollapsed = ""
              if(property.isCollapsed){
                isCollapsed = " " + property.isCollapsed
              }
                const headerName = property.name.substring(property.name.lastIndexOf(".")+1).toUpperCase()
                html += `<div class="property-form${isCollapsed}${isHide}"><div class="${property.inputType}" id="${property.idInput}">${headerName}</div><div class="property-menu">`
                html += this.createObjectForm(property.properties)
            }
            else if(property.inputType === "options"){
              let isCollapsed = ""
              if(property.isCollapsed){
                isCollapsed = " " + property.isCollapsed
              }
                const keyName = property.name.substring(property.name.lastIndexOf(".")+1)
                html += `<div class="key-value${isCollapsed}${isHide}"><div class="key-name">${keyName}:</div>`
                for (const option of property.options) {
                  const isChecked = option.name === property.value ? ' option-checked' : '';
                  html += `<div class="radio-button${isChecked}" id="${property.idInput}">${option.name}</div>`;
                }
            }
            else if(property.inputType === "file"){
              let isCollapsed = ""
              if(property.isCollapsed){
                isCollapsed = " " + property.isCollapsed
              }
              const placeholder = property.inputPlaceholder || ""
              const isError = property.errorMessage && property.errorMessage !== "" ? " error-input" : ""
              const isExpanded = property.isExpanded ? " expanded" : ""
              const keyName = property.name.substring(property.name.lastIndexOf(".")+1)
              html += `<div class="key-value${isCollapsed}${isHide}"><div class="key-name">${keyName}:</div><input type="text" class="key-value-input${isExpanded}${isError}" id="${property.idInput}" value="${property.value}" name="${property.name}" placeholder="${placeholder}"><label class="file-upload"><input type="file" id="${property.idInput}" accept="${property.acceptFiles}" name="${property.name}"/>Wybierz plik</label>`;
            }
            else if(property.inputType === "color"){
              let isCollapsed = ""
              if(property.isCollapsed){
                isCollapsed = " " + property.isCollapsed
              }
              const keyName = property.name.substring(property.name.lastIndexOf(".")+1)
              html += `<div class="key-value${isCollapsed}${isHide}"><div class="key-name">${keyName}:</div><input type="color" class="key-value-input" id="${property.idInput}" value="${property.value}" name="${property.name}">`;
            }
            else if(property.inputType === "string"){
              let isCollapsed = ""
              if(property.isCollapsed){
                isCollapsed = " " + property.isCollapsed
              }
                const placeholder = property.inputPlaceholder || ""
                const isError = property.errorMessage && property.errorMessage !== "" ? " error-input" : ""
                const isExpanded = property.isExpanded ? " expanded" : ""
                const keyName = property.name.substring(property.name.lastIndexOf(".")+1)
                html += `<div class="key-value${isCollapsed}${isHide}"><div class="key-name">${keyName}:</div><input type="text" class="key-value-input${isExpanded}${isError}" id="${property.idInput}" value="${property.value}" name="${property.name}" placeholder="${placeholder}">`;
            }
            else if(property.inputType === "number"){
              let isCollapsed = ""
              if(property.isCollapsed){
                isCollapsed = " " + property.isCollapsed
              }
                const isError = property.isValid ? "" : " error-input"
                const isExpanded = property.isExpanded ? "expanded" : ""
                const keyName = property.name.substring(property.name.lastIndexOf(".")+1)
                html += `<div class="key-value${isCollapsed}${isHide}"><div class="key-name">${keyName}:</div><input type="number" class="key-value-input${isExpanded}${isError}" id="${property.idInput}" step=${property.step} min=${property.min} max=${property.max} value="${property.value}" name="${property.name}">`;
            } 
            else if(property.inputType === "boolean"){
              let isCollapsed = ""
              if(property.isCollapsed){
                isCollapsed = " " + property.isCollapsed
              }
                const isChecked = property.value ? ' slider-checked' : '';
                const keyName = property.name.substring(property.name.lastIndexOf(".")+1)
                html += `<div class="key-value${isCollapsed}${isHide}"><div class="key-name">${keyName}:</div><div class="slider round${isChecked}" id="${property.idInput}" name="${property.name}"></div>`;
            }
            else if(property.inputType === "empty"){
              let isCollapsed = ""
              if(property.isCollapsed){
                isCollapsed = " " + property.isCollapsed
              }
                const keyName = property.name.substring(property.name.lastIndexOf(".")+1)
                html += `<div class="key-value${isCollapsed}${isHide}"><div class="key-name">${keyName}:</div>`;
            } 
            else {
                continue
            }     

            if(property.extraOptions) {
              for (const option of property.extraOptions) {
                const color = this.getExtraButtonColor(option.name)
                const isUsed = option.isUsed ? " extra-option-active" : ""
                html += `<div class="extra-option${isUsed}" id="${property.idInput}" style="--clr:${color}"><span>${option.name}</span><i></i></div>`;
                }
            }
            if (property['tool-tip']) {
              html += this.addToolTip(property)
            }
            html+= `<span class="error-info">${property.errorMessage || ""}</span></div>`
        }
        html += "</div>"
        return html
    }

    getExtraButtonColor = (name) => {
      switch(name){
        case "case":
          return "#FF3131"
        case "table":
          return "#0FF0FC"
        case "random":
          return "#FFF01F"
        case "random first index":
          return "#CCFF00"
        case "behavior":
          return "#0096FF"
        case "get character data":
          return "#8A2BE2"
        case "master":
          return"#c0c0c0"
        case "light":
          return "#FFA500"
        case "color":
          return "#FFC0CB"
        case "source":
          return "#964B00"
        case "parent":
          return"#c0c0c0"
        case "target":
          return "#E7EE4F"
        default:
          return "#FF1493"
      }
    }

    addToolTip = (property) =>{
      let requirementsInfo = "";
      let message
      if(property.hasOwnProperty('validation')){
        property['validation'].forEach(valid => {
          switch(valid.name){
            case "minMax":
              message = `Wartość powinna zawierać się w przedziale od ${property.min} do ${property.max}!`
              if(!requirementsInfo.includes(message)){
                requirementsInfo += '<br>'+ message
              }
              break;
            case "unique":
              message = "Wartość tego pola powinna być unikalna i nie może się powtarzać w innych obiektach!"
              if(!requirementsInfo.includes(message)){
                requirementsInfo += '<br>'+ message
              }
              break;
            case "notEqual":
              message = `Wartość tego pola dla typu ${valid.forType} powinna być różna od ${valid.value}!`
              if(!requirementsInfo.includes(message)){
                requirementsInfo += '<br>'+ message
              }
              break;
            case "equal":
              if(valid.value === ""){
                message = `Wartość tego pola dla typu ${valid.forType} powinna być pusta!`
              }
              else{
                message = `Wartość tego pola dla typu ${valid.forType} powinna być równa ${valid.value}!`
              }
              if(!requirementsInfo.includes(message)){
                requirementsInfo += '<br>'+ message
              }
              break;
            case "moreThan":
              message = `Wartość tego pola powinna być większa od `
              if(typeof valid.value === "number"){
                message +=  `wartości ${valid.value}!`
                }
              else{
                message += `wartości klucza ${valid.value}!`
              }
              if(!requirementsInfo.includes(message)){
                requirementsInfo += '<br>'+ message
              }
              break;
            case "lessThan":
              message = `Wartość tego pola powinna być większa od `
              if(typeof valid.value === "number"){
                message +=  `wartości ${valid.value}!`
              }
            else{
                message += `wartości klucza ${valid.value}!`
              }
              if(!requirementsInfo.includes(message)){
                requirementsInfo += '<br>'+ message
              }
              break;
            default:
              break;
          }
        })
      }
      return `<div class="property-tool-tip">
        <i class="property-tool-tip-icon">i</i>
        <p class="property-tool-tip-info"><b>Typ zmiennej</b>: ${property.varType.join(", ")}<br><b>Domyślna wartość</b>: ${property.defaultSraj || "-"}<br><b>Wymagania</b>: ${requirementsInfo.substring(4) || "brak"}<br><b>Opis</b>: ${property['tool-tip']}</p>
      </div>`
    }

   bindCollapseProperty = (handler) => {
      this.moduleObjectForm.addEventListener("mousedown", event => {
        const targetClasses = event.target.classList
        if (targetClasses.contains('key') || targetClasses.contains('subkey') || targetClasses.contains('subSubkey')) {
            handler(event.target.id)
        }
      })  
    }

    bindResizeIfIsTooLongValue = (handler) => {
      this.moduleObjectForm.addEventListener("keyup", event => { 
        if (event.target.type === "text") {
          const isTooLong = event.target.value.length > 30
          isTooLong ? event.target.classList.add("expanded") : event.target.classList.remove("expanded")
          handler(event.target.id)
        }
      })  
    }
    bindEnterValueInInput = (handler) => {
      this.moduleObjectForm.addEventListener("input", event => { 
        if (event.target.tagName === 'INPUT' && event.target.type != "file" && event.target.type != "color") {
          handler(event.target.id, event.target.value)
        }
      })  
    }

    bindUnfocusInput = (handler) => {
      this.moduleObjectForm.addEventListener("focusout", event => { 
        if (event.target.tagName === 'INPUT' && event.target.type != "file" && event.target.type != "color") {
          handler(event.target.id)
        }
      })  
    }

    bindCheckOption = (handler) => {
      this.moduleObjectForm.addEventListener("mousedown", event => { 
        if (event.target.classList.contains("radio-button")) {
          handler(event.target.id, event.target.textContent)
        }
      })  
    }
    
    bindCheckSlider = (handler) => {
      this.moduleObjectForm.addEventListener("mousedown", event => { 
        if (event.target.classList.contains("slider")) {
          handler(event.target.id)
        }
      })  
    }

    bindChooseFile = (handler) => {
      this.moduleObjectForm.addEventListener("change", event => { 
        if (event.target.tagName === 'INPUT' && event.target.type === "file") {
          const input = event.target
          const fileName = input.files[0].name
          handler(input.id, fileName);
        }
      })  
    }

    bindPickColor = (handler) => {
      this.moduleObjectForm.addEventListener("change", event => { 
        if (event.target.tagName === 'INPUT' && event.target.type === "color") {
          const color = event.target.value
          handler(event.target.id, color);
        }
      })  
    }
}