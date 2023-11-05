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
            const isCollapsed = property.isCollapsed ? " collapsed" : ""
            const isHide = property.hide ? " hide" : ""
            if(property.inputType.includes("key")){
                const headerName = property.name.substring(property.name.indexOf(".")+1).toUpperCase()
                html += `<div class="property-form${isCollapsed}${isHide}"><div class="${property.inputType}">${headerName}</div><div class="property-menu">`
                html += this.createObjectForm(property.properties)
                continue
            }
            else if(property.inputType === "options"){
                const keyName = property.name.substring(property.name.indexOf(".")+1)
                html += `<div class="key-value${isCollapsed}${isHide}"><div class="key-name">${keyName}:</div>`
                for (const option of property.options) {
                  const isChecked = option.isChecked ? ' option-checked' : '';
                  html += `<div class="radio-button${isChecked}" id="${property.idInput}">${option.name}</div>`;
                }
                html += "</div>"
            }
            else if(property.inputType === "string"){

            }
            else if(property.inputType === "number"){

            } 
            else if(property.inputType === "boolean"){

            }
            else if(property.inputType === "empty"){

            } 
            else {
                continue
            }     

            if(property.extraOptions) {
              for (const option of property.extraOptions) {

                }
            }
            if (property['tool-tip']) {
              
            }

        }
        html += "</div>"
        return html
    }

    
}