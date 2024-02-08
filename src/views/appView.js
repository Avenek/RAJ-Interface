class AppView extends View{
    constructor(){
        super()
        this.home = new HomeView();
        this.externalPropertiesButton = new ExternalPropertiesButtonView()
    }

    bindClickModule = (handler) =>{
        this.home.modulesBox.addEventListener("click", event => {
            if (event.target.classList.contains('glow-on-hover')) {
                const button = event.target
                const buttonName = button.textContent.charAt(0).toLowerCase() + button.textContent.slice(1)
                handler(buttonName)
            }
        })  

        this.home.dataObjectsBox.addEventListener("click", event => {
            if (event.target.classList.contains('key-element')) {
                const button = event.target
                handler(button.textContent)
            }
            else if(event.target.classList.contains('object-id-element')){
                const button = event.target
                const module = button.parentElement.previousElementSibling
                const index = this.getIndexElement(button.parentElement, "object-id-element", button)
                handler(module.textContent, index)

            }
        })
    }

    bindClickHomeExternalPropertiesButton = (handler) =>{
        this.home.dataObjectsBox.addEventListener("click", event => {
            if (event.target.classList.contains('external-properties')) {
                handler()
            }
        })   
    }

    bindClickFormExternalPropertiesButton = (handler) =>{
        this.form.headerPanel.addEventListener("click", event => {
            if (event.target.classList.contains('external-properties')) {
                handler()
            }
        })   
    }
}
