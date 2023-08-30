function createSrajModulesMenu(data) {
    const ulList = document.querySelector(".sraj-modules-menu");
    
    removeAllChildren(ulList)
    for (let key in data) {
      const moduleElement = createLiMenuElement(key, () => {});
      ulList.append(moduleElement)
      if(data[key].hasOwnProperty("list"))
      {
        const idUL = document.createElement("ul");
        idUL.classList.add("submenu")
        const ids = data[key].list.map(item => item.id || item.name);
        ids.forEach(id => {
          const liElement = createLiMenuElement(id, () => {});
          idUL.append(liElement)
        });
        moduleElement.appendChild(idUL);
      }
    }
  }
  
  function removeAllChildren(source){
    if (source.hasChildNodes()) {
      while (source.firstChild) {
        source.removeChild(source.firstChild);
      }
    }
  }
  
  function createLiMenuElement(name, func){
      const liElement = document.createElement("li");
      liElement.textContent = name
      liElement.addEventListener("click", func);
  
      return liElement
  }