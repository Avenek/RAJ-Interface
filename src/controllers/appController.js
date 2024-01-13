class AppController {
    constructor(appView, appModel) {
      this.view = appView
      this.model = appModel
      this.home = new HomeController(this.view.home, this.model.home, this.isExternalProperties)
      this.view.bindClickModule(this.handleClickModule)
    }

    handleClickModule = (module, id = 0) => {
      try{
        JSON.parse(JSON.stringify(this.model.jsonData.data))
        this.view.form = new FormView()
        this.model.jsonData.setParams("module", module, module, id)
        this.model.form = new FormModel(this.model.jsonData)
        this.form = new FormController(this.view.form, this.model.form)
        this.form.view.headerPanelView.bindClickHome(this.handleClickHome)
      }
      catch{}     
  }

  handleClickHome = () => {
    this.view.home = new HomeView()
    this.model.home = new HomeModel(this.model.jsonData)
    this.home = new HomeController(this.view.home, this.model.home)
    this.model.jsonData.objectsParams = []
    this.view.bindClickModule(this.handleClickModule)
  }
}
//localStorage.clear()
  if(localStorage.getItem("containerConfig") && localStorage.getItem("lastClear") !== "2024-01-13"){
    const toAdd =  JSON.parse(localStorage.getItem("containerConfig"))
    const interfaceSkin = {
        "name": "InterfaceSkin",
        "tipInfo": " Zmienia kolor interfejsu (są problemy z grafiką niektórych elementów - korzystanie niezalecane)"
    }
    toAdd.containers[0].modules.push(JSON.parse(JSON.stringify(interfaceSkin)))
    console.log(toAdd.containers[0].modules);
    localStorage.setItem("containerConfig", JSON.stringify(toAdd))
    localStorage.setItem("lastClear", "2024-01-13")
  }

  const app = new AppController(new AppView(), new AppModel())
