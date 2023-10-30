class AppView extends View{
    constructor(){
        super()
        this.home = new HomeView();
        this.form = new FormView();
    }

    bindClickModule = (handler) =>{
        this.home.modulesBox.addEventListener("click", event => {
            if (event.target.className === 'glow-on-hover') {
                const button = event.target
                const buttonName = button.textContent.charAt(0).toLowerCase() + button.textContent.slice(1)
                handler(buttonName)
            }
        })  

        this.home.dataObjectsBox.addEventListener("click", event => {
            if (event.target.className === 'key-element') {
                const button = event.target
                handler(button.textContent)
            }
            else if(event.target.className === 'object-id-element'){
                const button = event.target
                const module = button.parentElement.previousElementSibling
                const index = this.getIndexElement(button.parentElement, "object-id-element", button)
                handler(module.textContent, index)

            }
        })
    }
}