class AppView {
    constructor(){
        this.home = new HomeView();
        this.form = new FormView();
    }

    bindClickModule = () =>{
        this.home.modulesBox.addEventListener("click", event => {
            if (event.target.className === 'glow-on-hover') {
                this.form.render()
            }
        })  
    }
}