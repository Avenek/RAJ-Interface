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
                const isCollapsed = property.isCollapsed ? " collapsed" : ""
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
                const isCollapsed = property.isCollapsed ? " collapsed-key" : ""
                const placeholder = property.inputPlaceholder || ""
                const isError = property.hide ? "" : " hide"
                const keyName = property.name.substring(property.name.indexOf(".")+1)
                html += `<div class="key-value${isCollapsed}${isHide}"><div class="key-name">${keyName}:</div><input type="text" id="${property.idInput}" value="${property.value}" name="${property.name}" placeholder="${placeholder}"><span class="error-info${isError}">${property.errorMessage || ""}</span>`;
            }
            else if(property.inputType === "number"){
                const isCollapsed = property.isCollapsed ? " collapsed-key" : ""
                const isError = property.hide ? "" : " hide"
                const keyName = property.name.substring(property.name.indexOf(".")+1)
                html += `<div class="key-value${isCollapsed}${isHide}"><div class="key-name">${keyName}:</div><input type="number" id="${property.idInput}" step=${property.step} min=${property.min} max=${property.max} value="${property.value}" name="${property.name}"><span class="error-info${isError}">${property.errorMessage || ""}</span>`;
            } 
            else if(property.inputType === "boolean"){
                const isCollapsed = property.isCollapsed ? " collapsed-key" : ""
                const isChecked = property.value ? ' slider-checked' : '';
                const keyName = property.name.substring(property.name.indexOf(".")+1)
                html += `<div class="key-value${isCollapsed}${isHide}"><div class="key-name">${keyName}:</div><div class="slider round${isChecked} id="${property.idInput}" name="${property.name}"></div>`;
            }
            else if(property.inputType === "empty"){
                const isCollapsed = property.isCollapsed ? " collapsed-key" : ""
                const keyName = property.name.substring(property.name.indexOf(".")+1)
                html += `<div class="key-value${isCollapsed}${isHide}"><div class="key-name">${keyName}:</div>`;
            } 
            else {
                continue
            }     

            if(property.extraOptions) {
              for (const option of property.extraOptions) {
                const color = this.getExtraButtonColor(option.name)
                html += `<div class="extra-option" style="--clr:${color}"><span>${option.name}</span><i></i></div>`;
                }
            }
            if (property['tool-tip']) {
              
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

    
}