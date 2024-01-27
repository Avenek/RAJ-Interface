class ExternalPropertiesButtonView extends View{
    constructor(){
        super()
        this.externalPropertiesButton = null
        
    }

    displayButton = (isExternalPropertiesActive) => {
        this.externalPropertiesButton = this.createElement("div", "external-properties")
        this.externalPropertiesButton.textContent = "EXTERNAL PROPERTIES"
        if(!isExternalPropertiesActive)  {
            this.externalPropertiesButton.classList.add("hide")
        }
        this.root.firstChild.insertBefore(this.externalPropertiesButton, this.root.firstChild.firstChild.nextElementSibling);
    }

    bindClickExternalPropertiesButton = (handler) =>{
        this.externalPropertiesButton.addEventListener("click", event => {
            if (event.target.classList.contains('external-properties')) {
                handler()
            }
        })  
    }
}