class ObjectFormView extends View{
    constructor(moduleObjectForm){
        super()
       this.moduleObjectForm = moduleObjectForm
    }

    displayObjectForm = (objectFormList) => {
        this.moduleObjectForm.innerHTML = this.createObjectForm(objectFormList)
    }

    createObjectForm = (objectFormList) => {
        let html = ''
        for (const property of objectFormList) {
            const isHide = property.hide ? " hide" : ""
            if(property.inputType.includes("key")){
                const isCollapsed = property.isCollapsed || ""
                const headerName = property.name.substring(property.name.indexOf(".")+1).toUpperCase()
                html += `<div class="property-form${isCollapsed}${isHide}"><div class="${property.inputType}" id="${property.idInput}">${headerName}</div><div class="property-menu">`
                html += this.createObjectForm(property.properties)
            }
            else if(property.inputType === "options"){
                const isCollapsed = property.isCollapsed ? " collapsed-key" : ""
                const keyName = property.name.substring(property.name.indexOf(".")+1)
                html += `<div class="key-value${isCollapsed}${isHide}"><div class="key-name">${keyName}:</div>`
                for (const option of property.options) {
                  const isChecked = option.isChecked ? ' option-checked' : '';
                  html += `<div class="radio-button${isChecked}" id="${property.idInput}">${option.name}</div>`;
                }
            }
            else if(property.inputType === "string"){
                const isCollapsed = property.isCollapsed || ""
                const placeholder = property.inputPlaceholder || ""
                const isError = property.hide ? "" : " hide"
                const isExpanded = property.isExpanded ? "expanded" : ""
                const keyName = property.name.substring(property.name.indexOf(".")+1)
                html += `<div class="key-value${isCollapsed}${isHide}"><div class="key-name">${keyName}:</div><input type="text" class="${isExpanded}" id="${property.idInput}" value="${property.value}" name="${property.name}" placeholder="${placeholder}"><span class="error-info${isError}">${property.errorMessage || ""}</span>`;
            }
            else if(property.inputType === "number"){
                const isCollapsed = property.isCollapsed || ""
                const isError = property.hide ? "" : " hide"
                const keyName = property.name.substring(property.name.indexOf(".")+1)
                html += `<div class="key-value${isCollapsed}${isHide}"><div class="key-name">${keyName}:</div><input type="number" id="${property.idInput}" step=${property.step} min=${property.min} max=${property.max} value="${property.value}" name="${property.name}"><span class="error-info${isError}">${property.errorMessage || ""}</span>`;
            } 
            else if(property.inputType === "boolean"){
                const isCollapsed = property.isCollapsed || ""
                const isChecked = property.value ? ' slider-checked' : '';
                const keyName = property.name.substring(property.name.indexOf(".")+1)
                html += `<div class="key-value${isCollapsed}${isHide}"><div class="key-name">${keyName}:</div><div class="slider round${isChecked} id="${property.idInput}" name="${property.name}"></div>`;
            }
            else if(property.inputType === "empty"){
                const isCollapsed = property.isCollapsed || ""
                const keyName = property.name.substring(property.name.indexOf(".")+1)
                html += `<div class="key-value${isCollapsed}${isHide}"><div class="key-name">${keyName}:</div>`;
            } 
            else {
                continue
            }     

            if(property.extraOptions) {
              for (const option of property.extraOptions) {
                const color = this.getExtraButtonColor(option.name)
                const isUsed = option.isUsed ? " extra-option-active" : ""
                html += `<div class="extra-option${isUsed}" style="--clr:${color}"><span>${option.name}</span><i></i></div>`;
                }
            }
            if (property['tool-tip']) {
              html += this.addToolTip(property)
            }
            html+= "</div>"
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
        <p class="property-tool-tip-info"><b>Typ zmiennej</b>: ${property.varType.join(", ")}<br><b>Wymagania</b>: ${requirementsInfo.substring(4) || "brak"}<br><b>Opis</b>: ${property['tool-tip']}</p>
      </div>`
    }

    bindCollapseProperty = (handler) => {
      this.moduleObjectForm.addEventListener("click", event => {
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
      this.moduleObjectForm.addEventListener("keyup", event => { 
        if (event.target.tagName === 'INPUT') {
          handler(event.target.id, event.target.value)
        }
      })  
    }
    
}