class View{
    constructor(){
        this.root = document.querySelector(".root")
    }

    createElement = (tag, ...classList) => {
        const element = document.createElement(tag)
        if(classList.length>0){
          element.classList.add(...classList)
        }

        return element
      }
    
      getIndexElement = (container, selector, searchElement) => {
        const elements = Array.from(container.querySelectorAll(`.${selector}`))
        const index = elements.findIndex(element => element === searchElement);
        return index
      }

}