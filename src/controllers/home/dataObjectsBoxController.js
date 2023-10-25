class DataObjectsBoxController {
    constructor(view, model) {
        this.view = view
        this.model = model
        this.dataObjectsListChanged(this.model.dataObjectsList)
        
    }
    
    dataObjectsListChanged(dataObjectsList){
        this.view.displayDataObjects(dataObjectsList)
      }
  }