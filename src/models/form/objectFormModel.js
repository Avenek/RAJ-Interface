class ObjectFormModel{
    constructor(jsonData, container, jsonDataBox){
        this.jsonData = jsonData
        this.container = container
        this.jsonDataBox = jsonDataBox
        this.objectFormList = null
        this.createObjectFormList()
    }

    createObjectFormList = () => {

    }

    bindObjectFormChanged = (callback) => {
        this.objectFormChanged = callback
    }

}