function crgetupeateSrajModulesMenu(data) {
    const menu = document.querySelector(".sraj-modules-menu");
    
    removeAllChildren(menu)
    for (let key in data) {
      const containerElement = document.createElement("div");
      containerElement.classList.add("menu-element")
      const aElement = document.createElement("a");
      aElement.setAttribute("href", "/configuration.html")
      const moduleElement = document.createElement("button");
      moduleElement.classList.add("button-element")
      moduleElement.textContent = key
      aElement.append(moduleElement)
      containerElement.append(aElement)
      menu.append(containerElement)
      if(data[key].hasOwnProperty("list"))
      {
        const singleObjectElement = document.createElement("div");
        singleObjectElement.classList.add("submenu")
        const aElement = document.createElement("a");
        aElement.setAttribute("href", "/configuration.html")
        singleObjectElement.append(aElement)
        const ids = data[key].list.map(item => item.id || item.name);
        ids.forEach(id => {
          const element = document.createElement("button")
          element.textContent = id
          element.classList.add("single-object-menu")
          aElement.append(element)
        });
        containerElement.appendChild(singleObjectElement);
      }
    }
    addEventOnClick()
}
  
function removeAllChildren(source){
    if (source.hasChildNodes()) {
      while (source.firstChild) {
        source.removeChild(source.firstChild);
      }
    }
}
  
function createLiMenuElement(name, func){
      const element = document.createElement("div");
      element.textContent = name
      element.addEventListener("click", func);
  
      return element
}

function addEventOnClick() {
  const modulesMenu = document.querySelectorAll(".menu-element")
  modulesMenu.forEach(module =>{
    module.firstChild.firstChild.addEventListener("click", () => {
      localStorage.setItem("index", 0)
      localStorage.setItem('module', module.firstChild.firstChild.textContent);  
    })
    const objects = document.querySelectorAll(".single-object-menu");
    const objectsArray = Array.from(objects)
    objectsArray.forEach(object =>{
      object.addEventListener("click", () => {
        localStorage.setItem("index", objectsArray.indexOf(object))
         localStorage.setItem('module', module.firstChild.firstChild.textContent);
      })
    })
  })

}