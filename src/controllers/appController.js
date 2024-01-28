class AppController {
    constructor(appView, appModel) {
      this.view = appView
      this.model = appModel
      this.home = new HomeController(this.view.home, this.model.home)
      this.externalPropertiesButton = new ExternalPropertiesButtonController(this.view.externalPropertiesButton, this.model.externalPropertiesButton, this)
      this.view.bindClickModule(this.handleClickModule)
    }

    handleClickModule = (module, id = 0) => {
      try{
        JSON.parse(JSON.stringify(this.model.jsonData.displayData))
        this.view.form = new FormView()
        this.model.jsonData.setParams("module", module, module, id, "out", "module")
        this.model.form = new FormModel(this.model.jsonData, this.externalPropertiesButton.model)
        this.form = new FormController(this.view.form, this.model.form, this)
        this.externalPropertiesButton.displayButton(this.model.externalPropertiesButton.isExternalPropertiesActive)
        this.externalPropertiesButton.view.bindClickExternalPropertiesButton(this.externalPropertiesButton.handleClickExternalPropertiesButton)
        this.model.form.moduleObjectFormModel.fetchConfigAndCreateObjectFormList()
        this.model.form.moduleObjectIdBoxModel.createObjectIdList()
        this.form.view.headerPanelView.bindClickHome(this.handleClickHome)
      }
      catch (e) {
        console.log(e);
      }
  }

  handleClickHome = () => {
    this.view.home.render()
    this.model.home.dataObjectsBoxModel.createDataObjectsList()
    this.view.home.dataObjectsBoxView.displayDataObjects(this.model.home.dataObjectsBoxModel.dataObjectsList)
    this.view.home.modulesBoxView.displayModulesBox(this.model.home.modulesBoxModel.modulesList)
    this.view.home.jsonDataBoxView.displayJsonDataBox(this.home.jsonDataBox.model.jsonData, this.home.jsonDataBox.model.isBeautified, this.home.jsonDataBox.model.errorMode, this.externalPropertiesButton.isExternalPropertiesActive)
    this.model.jsonData.objectsParams = []
    this.home = new HomeController(this.view.home, this.model.home)
    this.externalPropertiesButton.displayButton(this.model.externalPropertiesButton.isExternalPropertiesActive)
    this.externalPropertiesButton.view.bindClickExternalPropertiesButton(this.externalPropertiesButton.handleClickExternalPropertiesButton)
    this.view.bindClickModule(this.handleClickModule)
  }

}
//localStorage.clear()
if(localStorage.getItem("containerConfig") && localStorage.getItem("lastClear") !== "2024-01-19"){
  localStorage.clear()
  localStorage.setItem("lastClear", "2024-01-19")
}
  /*if(localStorage.getItem("containerConfig") && localStorage.getItem("lastClear") !== "2024-01-13"){
    const toAdd =  JSON.parse(localStorage.getItem("containerConfig"))
    const interfaceSkin = {
        "name": "InterfaceSkin",
        "tipInfo": " Zmienia kolor interfejsu (są problemy z grafiką niektórych elementów - korzystanie niezalecane)"
    }
    toAdd.containers[0].modules.push(JSON.parse(JSON.stringify(interfaceSkin)))
    localStorage.setItem("containerConfig", JSON.stringify(toAdd))
    localStorage.setItem("lastClear", "2024-01-13")
  }*/

  const app = new AppController(new AppView(), new AppModel())
