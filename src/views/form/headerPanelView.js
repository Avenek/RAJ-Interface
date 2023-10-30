class HeaderPanelView extends View{
    constructor(headerPanel){
        super()
       this.headerPanel = headerPanel
    }

    displayHeader = (module) => {
        this.headerPanel.innerHTML = ""
        const homeButton = this.createElement("div", "home-button", "fa-solid", "fa-house")
        const headerName = this.createElement("span", "module-title")
        headerName.textContent = module
        this.headerPanel.append(homeButton, headerName)
    }

    bindClickHome = (handler) =>{
        this.headerPanel.addEventListener("click", event => {
            if (event.target.classList.contains('home-button')) {
                handler()
            }
        })  
    }
}