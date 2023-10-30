class HeaderPanelController {
    constructor(view, model) {
        this.view = view
        this.model = model
        this.displayHeader()
    }
    
    displayHeader = () => {
        this.view.displayHeader(this.model.module)
      }
  }