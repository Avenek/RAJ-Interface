class JsonDataBoxController{
    constructor(view, model) {
        this.view = view
        this.model = model
        this.view.bindBeautifyJsonData(this.handleBeautifyJsonData)
        this.view.bindMinifyJsonData(this.handleMinifyJsonData)
        this.view.bindCopyJsonData(this.handleCopyJsonData)
        this.view.bindClearJsonData(this.handleClearJsonData)
    }

    handleBeautifyJsonData = () => {
        this.model.beautifyJsonData()
    }

    handleMinifyJsonData = () => {
        this.model.minifyJsonData()
    }

    handleCopyJsonData = () => {
        this.model.copyJsonData()
    }

    handleClearJsonData = () => {
        this.model.clearJsonData()
    }
}