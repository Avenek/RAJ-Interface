class View{
    constructor(){
        this.root = document.querySelector(".root")
    }

    createElement = (tag, ...className) => {
        const element = document.createElement(tag)
        if(className.length>0){
          element.classList.add(...className)
        }

        return element
      }
    
      getIndexElement = (container, selector, searchElement) => {
        const elements = Array.from(container.querySelectorAll(`.${selector}`))
        const index = elements.findIndex(element => element === searchElement);
        return index
      }

}