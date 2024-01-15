class FormController {
    constructor(view, model) {
      this.model = model
      this.view = view
      this.view.render()
      this.headerPanel = new HeaderPanelController(this.view.headerPanelView, this.model.headerPanelModel)
      this.moduleObjectIdBox = new ObjectIdBoxController(this.view.moduleObjectIdBoxView, this.model.moduleObjectIdBoxModel)
      this.moduleObjectForm = new ObjectFormController(this.view.moduleObjectFormView, this.model.moduleObjectFormModel)
      this.jsonDataBox = new JsonDataBoxFormController(this.view.jsonDataBoxView, this.model.jsonDataBoxModel, this.moduleObjectIdBox.model, this.moduleObjectForm.model)
      this.view.bindClickExtraOptionModuleForm(this.handleClickExtraOptionModuleForm)
      this.view.bindClickExtraOptionExtraOptionForm(this.handleClickExtraOptionExtraOptionForm)
    }

    handleClickExtraOptionModuleForm = (extraOption, id) => {
      const property = this.model.moduleObjectFormModel.configUtils.findObjectByProperty(this.model.moduleObjectFormModel.objectFormList, id, "idInput")
      const type = property.extraOptions.find(option => option.name === extraOption).type || "out"
      const key = property.name
      let extraOptionName = this.makeCamelCase(extraOption)
      const moduleParams = this.model.jsonData.getParams("module")
      const extraOptionParams = this.model.jsonData.getParams("extraOption")
      const fileName = (extraOptionName === "behavior" || extraOptionName === "randomFirstIndex" || extraOptionName === "master") ? moduleParams.module + extraOptionName.charAt(0).toUpperCase() + extraOptionName.slice(1) : extraOptionName
      if(this.extraOptionObjectForm && extraOptionParams  && extraOptionParams.form === "module" && extraOptionParams.workingObject !== null && extraOptionParams.fileName === fileName){
        this.model.jsonData.deleteParams()
        if(this.model.extraOptionObjectIdBoxModel.createObjectIdList()){
          this.model.extraOptionObjectIdBoxModel.objectIdListChanged(this.model.extraOptionObjectIdBoxModel.objectIdList,  this.model.extraOptionObjectIdBoxModel.hasList)
        }
        this.model.extraOptionObjectFormModel.fetchConfigAndCreateObjectFormList()
        if(this.model.moduleObjectIdBoxModel.createObjectIdList()){
          this.model.moduleObjectIdBoxModel.objectIdListChanged(this.model.moduleObjectIdBoxModel.objectIdList,  this.model.moduleObjectIdBoxModel.hasList)
        }
        this.model.moduleObjectFormModel.fetchConfigAndCreateObjectFormList()
      }
      else{
        this.model.jsonData.setParams("extraOption", extraOptionName, fileName, 0, type, "module", key)
        if(this.model.extraOptionObjectFormModel == null || this.model.extraOptionObjectFormModel == undefined){
          this.model.extraOptionObjectFormModel = new ObjectFormModel(this.model.jsonData, "extraOption", this.model.jsonDataBoxModel)
          this.model.extraOptionObjectIdBoxModel = new ObjectIdBoxModel(this.model.jsonData, "extraOption", this.model.jsonDataBoxModel, this.model.extraOptionObjectFormModel)
        }
        else{
          this.model.extraOptionObjectFormModel.fetchConfigAndCreateObjectFormList()
          this.model.extraOptionObjectIdBoxModel.createObjectIdList()
        }
        this.model.extraOptionObjectFormModel.objectIdBox = this.model.extraOptionObjectIdBoxModel
        if(this.extraOptionObjectIdBox == null || this.extraOptionObjectIdBox == undefined){
          this.extraOptionObjectIdBox = new ObjectIdBoxController(this.view.extraOptionObjectIdBoxView, this.model.extraOptionObjectIdBoxModel)
          this.extraOptionObjectForm = new ObjectFormController(this.view.extraOptionObjectFormView, this.model.extraOptionObjectFormModel)
        }
        else{
          this.extraOptionObjectIdBox.objectIdListChanged(this.extraOptionObjectIdBox.model.objectIdList, this.extraOptionObjectIdBox.model.hasList)
        }
        this.jsonDataBox.model.extraOptionObjectFormModel = this.model.extraOptionObjectFormModel
        this.jsonDataBox.model.extraOptionObjectIdBoxModel = this.model.extraOptionObjectIdBoxModel
        this.model.extraOptionObjectIdBoxModel.moduleObjectForm = this.model.moduleObjectFormModel
        this.model.extraOptionObjectIdBoxModel.moduleObjectIdBox = this.model.moduleObjectIdBoxModel
        this.model.moduleObjectFormModel.extraOptionIdBox = this.model.extraOptionObjectIdBoxModel
        this.model.moduleObjectFormModel.extraOptionObjectForm = this.model.extraOptionObjectFormModel
        this.model.moduleObjectIdBoxModel.extraOptionIdBox = this.model.extraOptionObjectIdBoxModel
        this.model.moduleObjectIdBoxModel.extraOptionObjectForm = this.model.extraOptionObjectFormModel
        this.model.moduleObjectFormModel.changeStateExtraOption()
      }
    }

    handleClickExtraOptionExtraOptionForm = (extraOption, id) => {
      const property = this.model.moduleObjectFormModel.configUtils.findObjectByProperty(this.model.extraOptionObjectFormModel.objectFormList, id, "idInput")
      const type = property.extraOptions.find(option => option.name === extraOption).type || "out"
      const key = property.name
      let extraOptionName = this.makeCamelCase(extraOption)
      const extraOptionParams = this.model.jsonData.getParams("extraOption")
      const fileName = (extraOptionName === "behavior" || extraOptionName === "randomFirstIndex" || extraOptionName === "master") ? extraOptionParams.module + extraOptionName.charAt(0).toUpperCase() + extraOptionName.slice(1) : extraOptionName
      if(this.extraOptionObjectForm && extraOptionParams && extraOptionParams.form === "extraOption" && extraOptionParams.workingObject !== null && extraOptionParams.fileName === fileName){
        this.model.jsonData.deleteParams()
        this.model.extraOptionObjectIdBoxModel.createObjectIdList()
        this.model.extraOptionObjectIdBoxModel.objectIdListChanged(this.model.extraOptionObjectIdBoxModel.objectIdList,  this.model.extraOptionObjectIdBoxModel.hasList)
        this.model.extraOptionObjectFormModel.fetchConfigAndCreateObjectFormList()
        this.model.moduleObjectIdBoxModel.createObjectIdList()
        this.model.moduleObjectIdBoxModel.objectIdListChanged(this.model.moduleObjectIdBoxModel.objectIdList,  this.model.moduleObjectIdBoxModel.hasList)
        this.model.moduleObjectFormModel.fetchConfigAndCreateObjectFormList()
      }
      else{
        this.model.jsonData.setParams("extraOption", extraOptionName, fileName, 0, type, "module", key)
        if(this.model.extraOptionObjectIdBoxModel.createObjectIdList()){
          this.model.extraOptionObjectIdBoxModel.objectIdListChanged(this.model.extraOptionObjectIdBoxModel.objectIdList,  this.model.extraOptionObjectIdBoxModel.hasList)
        }
        this.model.extraOptionObjectFormModel.fetchConfigAndCreateObjectFormList()
        if(this.model.moduleObjectIdBoxModel.createObjectIdList()){
          this.model.moduleObjectIdBoxModel.objectIdListChanged(this.model.moduleObjectIdBoxModel.objectIdList,  this.model.moduleObjectIdBoxModel.hasList)
        }
        this.model.moduleObjectFormModel.fetchConfigAndCreateObjectFormList()
      }
    }

    makeCamelCase = (name) => {
      if(name.includes(" ")){
        const nameArray = name.split(" ")
        for(let i = 1 ; i < nameArray.length ; i++){
            nameArray[i] = nameArray[i].charAt(0).toUpperCase() + nameArray[i].slice(1)
        }
        name = nameArray.join("")
      }
      return name
    }
  }