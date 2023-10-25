class appView{
    constructor(homeView, appView){
        this.homeView = homeView;
        this.formView = appView;
    }

    renderPage(){
        this.homeView.render();
    }
}