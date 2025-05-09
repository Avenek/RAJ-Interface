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


  if(localStorage.getItem("containerConfig") && localStorage.getItem("lastClear")){
    const lastClear = parseInt(localStorage.getItem("lastClear"))
     const toAdd =  JSON.parse(localStorage.getItem("containerConfig"))
    if(lastClear<1){
      const randomCaller = {
          "name": "Programmer",
          "tipInfo": "Umożliwia wyzwolenie SRAJa w konkretnym momencie, o konkretnych godzinach, powtarzające się o danym czasie, itd."
      }
      toAdd.containers[0].modules.push(JSON.parse(JSON.stringify(randomCaller)))
      localStorage.setItem("containerConfig", JSON.stringify(toAdd))
      localStorage.setItem("lastClear", "1")
    }
    if(lastClear<2){
      const randomCaller = {
          "name": "Night",
          "tipInfo": "Umożliwia przyciemnienie mapy, czy też stworzenie cyklu dobowego na niej."
      }
      toAdd.containers[0].modules.push(JSON.parse(JSON.stringify(randomCaller)))
      localStorage.setItem("containerConfig", JSON.stringify(toAdd))
      localStorage.setItem("lastClear", "2")
    }
    if(lastClear<3){
      const overrideDayNightCycle = {
          "name": "OverrideDayNightCycle",
          "tipInfo": "Umożliwia wpłynięcie na cykl dobowy pozostałych map i nadpisać jego wartość danym mnożnikiem."
      }
      toAdd.containers[0].modules.push(JSON.parse(JSON.stringify(overrideDayNightCycle)))
      localStorage.setItem("containerConfig", JSON.stringify(toAdd))
      localStorage.setItem("lastClear", "3")
    }
    if(lastClear<4){
      const characterImageChanger = {
        "name": "CharacterImageChanger",
        "tipInfo": "Umożliwia zmianę grafiki npc na inną lub wykonanie danej animacji w momencie jego respawnu, śmierci bądź też bycia martwym."
      }
      toAdd.containers[0].modules.push(JSON.parse(JSON.stringify(characterImageChanger)))
      localStorage.setItem("containerConfig", JSON.stringify(toAdd))
      localStorage.setItem("lastClear", "4")
    }
    if(lastClear<5){
      const preloadImage = {
        "name": "PreloadImage",
        "tipInfo": "Umożliwia załadowanie grafiki wcześniej, aby w momencie wyzwolenia sraja z tą grafiką, klient nie musiał jej dopiero pobierać i załadowywać."
      }
      toAdd.containers[0].modules.push(JSON.parse(JSON.stringify(preloadImage)))
      localStorage.setItem("containerConfig", JSON.stringify(toAdd))
      localStorage.setItem("lastClear", "5")
    }
    if(lastClear<6){
      const interfaceKind =  {
        "name": "InterfaceKind",
        "tipInfo": "możliwia zmianę graczowi Starego Interfejsu na Nowy Interfejs. Działa wyłącznie na SI!"
      }
      toAdd.containers[0].modules.push(JSON.parse(JSON.stringify(interfaceKind)))
      localStorage.setItem("containerConfig", JSON.stringify(toAdd))
      localStorage.setItem("lastClear", "6")
    }
    if(lastClear<7){
      const massObjectHide =  {
        "name": "MassObjectHide",
        "tipInfo": "Umożliwia ukrycie wszystkich obiektów danego typu na mapie."
      }
      toAdd.containers[0].modules.push(JSON.parse(JSON.stringify(massObjectHide)))
      localStorage.setItem("containerConfig", JSON.stringify(toAdd))
      localStorage.setItem("lastClear", "7")
    }
    if(lastClear<8){
      const tutorial =         {
        "name": "Tutorial",
        "tipInfo": "Umożliwia tworzenie kroków tutorialu w kliencie."
      }
      toAdd.containers[0].modules.push(JSON.parse(JSON.stringify(tutorial)))
      localStorage.setItem("containerConfig", JSON.stringify(toAdd))
      localStorage.setItem("lastClear", "8")
    }
    if(lastClear<9){
      const srajWindow =  {
          "name": "SrajWindow",
          "tipInfo": "Umożliwia wywołanie okienka z informacją dla gracza."
        }
      toAdd.containers[0].modules.push(JSON.parse(JSON.stringify(srajWindow)))
      localStorage.setItem("containerConfig", JSON.stringify(toAdd))
      localStorage.setItem("lastClear", "9")
    }
  }

const app = new AppController(new AppView(), new AppModel())
