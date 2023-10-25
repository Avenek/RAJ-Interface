class pageView{
    constructor(){
        this.root = document.querySelector(".root")
    }

    createElement(tag, ...className) {
        const element = document.createElement(tag)
        element.classList.add(className)

        return element
      }
    
      // Retrieve an element from the DOM
      getElement(selector) {
        const element = this.root.querySelector(selector)
    
        return element
      }

}