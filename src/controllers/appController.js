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
    this.view.bindClickModule(this.handleClickModule)
  }
}

  if(localStorage.getItem("lastClear") === null || (localStorage.getItem("lastClear") && localStorage.getItem("lastClear") !== "2023-12-14")){
    localStorage.clear()
    localStorage.setItem("lastClear", "2023-12-14")
  }

  //localStorage.setItem("lastJson", JSON.stringify({"characterEffect":{"list":[{"action":"CREATE_IF_NOT_EXIST","id":"obiekt-0","windowTarget":"MAP","target":{"kind":"HERO"},"effect":"ANIMATION","params":{"gifUrl":"characterEffects/.gif","position":"CENTER"}}]},"fakeNpc":{"list":[{"action":"CREATE_IF_NOT_EXIST","id":"obiekt-0","x":0,"y":0,"img":"/npc/test.gif","behavior":{"list":[{"name":"IDLE","duration":5,"dir":"S"}]}},{"action":"CREATE_IF_NOT_EXIST","id":"obiekt-1","x":0,"y":0,"img":"/npc/test.gif","behavior":{"list":[{"name":"IDLE","duration":5,"dir":"S"}]}},{"action":"CREATE_IF_NOT_EXIST","id":"obiekt-2","x":0,"y":0,"img":"/npc/test.gif","behavior":{"list":[{"name":"IDLE","duration":5,"dir":"S"}]}}]}}))
  const app = new AppController(new AppView(), new AppModel())
