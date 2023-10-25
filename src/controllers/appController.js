class appController {
    constructor(appView) {
      this.view = appView
    }
  }

  const app = new appController(new appView())
  app.view.home.render()