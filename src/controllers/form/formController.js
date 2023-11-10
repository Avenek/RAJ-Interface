class FormController {
    constructor(view, model) {
      this.model = model
      this.view = view
      this.view.render()
      this.headerPanel = new HeaderPanelController(this.view.headerPanelView, this.model.headerPanelModel)
      this.moduleObjectIdBox = new ObjectIdBoxController(this.view.moduleObjectIdBoxView, this.model.moduleObjectIdBoxModel)
      this.jsonDataBox = new JsonDataBoxFormController(this.view.jsonDataBoxView, this.model.jsonDataBoxModel)
      this.moduleObjectForm = new ObjectFormController(this.view.moduleObjectFormView, this.model.moduleObjectFormModel)
      this.view.bindClickExtraOption(this.handleClickExtraOption)
    }

    handleClickExtraOption = (extraOption, id) => {
      const path = this.model.moduleObjectFormModel.configUtils.findObjectByProperty(this.model.moduleObjectFormModel.objectFormList, id, "idInput").name
      let extraOptionName = extraOption
      if(extraOptionName === "behavior" || extraOptionName === "randomFirstIndex"){
        extraOptionName = this.model.jsonData.modulePathParams.module + extraOptionName.charAt(0).toUpperCase() + extraOptionName.slice(1)
      }
      this.model.moduleObjectFormModel.clickExtraOption()
      if(this.extraOptionObjectForm && this.model.jsonData.extraOptionPathParams.workingObject !== null && this.model.jsonData.extraOptionPathParams.module === extraOptionName){
        this.model.extraOptionObjectFormModel.clearForm()
        this.model.extraOptionObjectIdBoxModel.clearBox()
        this.model.jsonData.extraOptionPathParams.workingObject = null
      }
      else{
        this.model.jsonData.setParams("extraOption", extraOptionName, 0, path)
        this.view.extraOptionObjectIdBox = new ObjectIdBoxView(this.view.extraOptionIdBox)
        this.model.extraOptionObjectFormModel = new ObjectFormModel(this.model.jsonData, "extraOption", this.model.jsonDataBoxModel)
        this.model.extraOptionObjectIdBoxModel = new ObjectIdBoxModel(this.model.jsonData, "extraOption", this.model.jsonDataBoxModel, this.model.extraOptionObjectFormModel)
        this.model.extraOptionObjectFormModel.objectIdBox = this.model.extraOptionObjectIdBoxModel
        this.view.extraOptionObjectFormView = new ObjectFormView(this.view.extraOptionForm)
        this.view.extraOptionObjectIdBoxView = new ObjectIdBoxView(this.view.extraOptionIdBox)
        this.extraOptionObjectIdBox = new ObjectIdBoxController(this.view.extraOptionObjectIdBoxView, this.model.extraOptionObjectIdBoxModel)
        this.extraOptionObjectForm = new ObjectFormController(this.view.extraOptionObjectFormView, this.model.extraOptionObjectFormModel)
      }
      
    }

  }