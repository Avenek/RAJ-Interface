class ExternalPropertiesButtonView extends View{
    constructor(){
        super()
        this.externalPropertiesButton = null
        
    }

    displayButton = (isExternalPropertiesActive) => {
        if(this.externalPropertiesButton){
            this.externalPropertiesButton.remove()
        }
        this.externalPropertiesButton = this.createElement("div", "external-properties")
        this.externalPropertiesButton.textContent = "EXTERNAL PROPERTIES"
        if(!isExternalPropertiesActive)  {
            this.externalPropertiesButton.classList.add("hide")
        }
        this.root.firstChild.firstChild.append(this.externalPropertiesButton)
    }

    bindClickExternalPropertiesButton = (handler) =>{
        this.externalPropertiesButton.addEventListener("click", event => {
            if (event.target.classList.contains('external-properties')) {
                handler()
            }
        })  
    }
}