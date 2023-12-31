class FormController {
    constructor(view, model) {
      this.model = model
      this.view = view
      this.view.render()
      this.headerPanel = new HeaderPanelController(this.view.headerPanelView, this.model.headerPanelModel)
      this.moduleObjectIdBox = new ObjectIdBoxController(this.view.moduleObjectIdBoxView, this.model.moduleObjectIdBoxModel)
      this.moduleObjectForm = new ObjectFormController(this.view.moduleObjectFormView, this.model.moduleObjectFormModel)
      this.jsonDataBox = new JsonDataBoxFormController(this.view.jsonDataBoxView, this.model.jsonDataBoxModel, this.moduleObjectIdBox.model, this.moduleObjectForm.model)
      this.view.bindClickExtraOption(this.handleClickExtraOption)
    }

    handleClickExtraOption = (extraOption, id) => {
      const key = this.model.moduleObjectFormModel.configUtils.findObjectByProperty(this.model.moduleObjectFormModel.objectFormList, id, "idInput").name
      let extraOptionName = extraOption
      const fileName = (extraOptionName === "behavior" || extraOptionName === "randomFirstIndex" || extraOptionName === "master") ? this.model.jsonData.modulePathParams.module + extraOptionName.charAt(0).toUpperCase() + extraOptionName.slice(1) : extraOptionName
      if(this.extraOptionObjectForm && this.model.jsonData.extraOptionPathParams.workingObject !== null && this.model.jsonData.extraOptionPathParams.path === key){
        this.model.extraOptionObjectFormModel.clearForm()
        this.model.extraOptionObjectIdBoxModel.clearBox(false)
        this.model.jsonData.extraOptionPathParams.workingObject = null
      }
      else{
        this.model.jsonData.setParams("extraOption", extraOptionName, fileName, 0, key)
        this.model.extraOptionObjectFormModel = new ObjectFormModel(this.model.jsonData, "extraOption", this.model.jsonDataBoxModel)
        this.model.extraOptionObjectIdBoxModel = new ObjectIdBoxModel(this.model.jsonData, "extraOption", this.model.jsonDataBoxModel, this.model.extraOptionObjectFormModel)
        this.model.extraOptionObjectFormModel.objectIdBox = this.model.extraOptionObjectIdBoxModel
        this.view.extraOptionObjectFormView = new ObjectFormView(this.view.extraOptionForm)
        this.view.extraOptionObjectIdBoxView = new ObjectIdBoxView(this.view.extraOptionIdBox)
        this.extraOptionObjectIdBox = new ObjectIdBoxController(this.view.extraOptionObjectIdBoxView, this.model.extraOptionObjectIdBoxModel)
        this.extraOptionObjectForm = new ObjectFormController(this.view.extraOptionObjectFormView, this.model.extraOptionObjectFormModel)
        this.jsonDataBox.model.extraOptionObjectFormModel = this.model.extraOptionObjectFormModel
        this.jsonDataBox.model.extraOptionObjectIdBoxModel = this.model.extraOptionObjectIdBoxModel
        this.model.extraOptionObjectIdBoxModel.moduleObjectForm = this.model.moduleObjectFormModel
        this.model.moduleObjectFormModel.extraOptionIdBox = this.model.extraOptionObjectIdBoxModel
        this.model.moduleObjectFormModel.extraOptionObjectForm = this.model.extraOptionObjectFormModel
        this.model.moduleObjectIdBoxModel.extraOptionIdBox = this.model.extraOptionObjectIdBoxModel
        this.model.moduleObjectIdBoxModel.extraOptionObjectForm = this.model.extraOptionObjectFormModel
      }
      this.model.moduleObjectFormModel.changeStateExtraOption()
    }
  }