class View{
    constructor(){
        this.root = document.querySelector(".root")
    }

    createElement = (tag, ...className) => {
        const element = document.createElement(tag)
        if(className.length>0){
          element.classList.add(className)
        }
        

        return element
      }
    
      // Retrieve an element from the DOM
      getElement = (selector) => {
        const element = this.root.querySelector(selector)
    
        return element
      }

}