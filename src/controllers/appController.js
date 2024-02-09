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
localStorage.clear()
if(localStorage.getItem("lastClear") !== "0"){
  localStorage.clear()
  localStorage.setItem("lastClear", "0")
}

  /*if(localStorage.getItem("containerConfig") && localStorage.getItem("lastClear") !== "1"){
    const toAdd =  JSON.parse(localStorage.getItem("containerConfig"))
    const randomCaller = {
      "name": "RandomCaller",
      "tipInfo": "Umożliwia wywołanie losowego Sraja. W options podajemy możliwe sraje do wyboru."
    }
    toAdd.containers[0].modules.push(JSON.parse(JSON.stringify(randomCaller)))
    localStorage.setItem("containerConfig", JSON.stringify(toAdd))
    localStorage.setItem("lastClear", "1")
  }*/
  const app = new AppController(new AppView(), new AppModel())

  /*function pop (e) {
    let amount = 30;
    if (e.clientX === 0 && e.clientY === 0) {
      const bbox = e.target.getBoundingClientRect();
      const x = bbox.left + bbox.width / 2;
      const y = bbox.top + bbox.height / 2;
      for (let i = 0; i < 30; i++) {
        createParticle(x, y, e.target.dataset.type);
      }
    } else {
      for (let i = 0; i < amount; i++) {
        createParticle(e.clientX, e.clientY + window.scrollY, "emoji");
      }
    }
  }

  function createParticle (x, y, type) {
    const particle = document.createElement('particle');
    document.body.appendChild(particle);
    let width = Math.floor(Math.random() * 30 + 8);
    let height = width;
    let destinationX = (Math.random() - 0.5) * 300;
    let destinationY = (Math.random() - 0.5) * 300;
    let rotation = Math.random() * 520;
    let delay = Math.random() * 200;
    
    switch (type) {
      case 'emoji':
        particle.innerHTML = ['❤','🧡','💛','💚','💙','💜','🤎'][Math.floor(Math.random() * 7)];
        `${Math.random() * 24 + 10}px`;
        width = height = 'auto';
        break;
}

particle.style.width = `${width}px`;
particle.style.height = `${height}px`;
const animation = particle.animate([
{
  transform: `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(0deg)`,
  opacity: 1
},
{
  transform: `translate(-50%, -50%) translate(${x + destinationX}px, ${y + destinationY}px) rotate(${rotation}deg)`,
  opacity: 0
}
], {
duration: Math.random() * 1000 + 5000,
easing: 'cubic-bezier(0, .9, .57, 1)',
delay: delay
});
animation.onfinish = removeParticle;
}

function removeParticle (e) {
e.srcElement.effect.target.remove();
}

  document.addEventListener('click', pop)*/
