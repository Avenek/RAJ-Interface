class AppController {
    constructor(appView, appModel) {
      this.view = appView
      this.model = appModel
      this.view.home.render()
      this.home = new HomeController(this.view.home, this.model.home)
      this.form = new FormController(this.view.form, this.model.form)
      this.view.bindClickModule(this.handleClickModule)
    }

    handleClickModule = () => {
      this.view.form.render()
  }
}

  localStorage.clear()
  localStorage.setItem("lastJson", JSON.stringify({"characterEffect":{"list":[{"action":"CREATE_IF_NOT_EXIST","id":"obiekt-0","windowTarget":"MAP","target":{"kind":"HERO"},"effect":"ANIMATION","params":{"gifUrl":"characterEffects/.gif","position":"CENTER"}}]},"fakeNpc":{"list":[{"action":"CREATE_IF_NOT_EXIST","id":"obiekt-0","x":0,"y":0,"img":"/npc/test.gif","behavior":{"list":[{"name":"IDLE","duration":5,"dir":"S"}]}},{"action":"CREATE_IF_NOT_EXIST","id":"obiekt-1","x":0,"y":0,"img":"/npc/test.gif","behavior":{"list":[{"name":"IDLE","duration":5,"dir":"S"}]}},{"action":"CREATE_IF_NOT_EXIST","id":"obiekt-2","x":0,"y":0,"img":"/npc/test.gif","behavior":{"list":[{"name":"IDLE","duration":5,"dir":"S"}]}}]}}))
  const app = new AppController(new AppView(), new AppModel())
