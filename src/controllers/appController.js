class AppController {
    constructor(appView, appModel) {
      this.view = appView
      this.model = appModel
      this.view.home.render()
      this.home = new HomeController(this.view.home, this.model.home)
      this.form = new FormController(this.view.form, this.model.form)
    }
  }

  const app = new AppController(new AppView(), new AppModel())
