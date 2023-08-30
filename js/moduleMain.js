

function loadContent(module)
{
    let fullHtml = `<div class="configuration-container"><div class="objects-container">`
    const handleContainer = document.querySelector(".handle-container")
    removeAllChildren(handleContainer)
    fullHtml += createObjectList(module)
    fetch(`../config/${module}.json`)
    .then(response => response.json())
    .then(config => {
        fullHtml += `<div class="object-configuration">
        <div class="container-title">Konfiguracja obiektu</div>`
        fullHtml += createObjectConfigurationContainer(config)
        
        fullHtml += `</div><div class="object-key">   
        <div class="key-menu">
            <div class="container-title">Menu pomocnicze</div>
        </div>
        <div class="key-configuration">
            <div class="container-title">Konfiguracja klucza</div>
        </div>
    
     </div></div></div>`
     handleContainer.innerHTML += fullHtml
    })
    .catch(error => {
    console.error('Błąd pobierania:', error);
    })
    const buttonsContainer = document.querySelector(".buttons-container")
    const jsonButtonsHtml = createJsonButtons()
    buttonsContainer.innerHTML = jsonButtonsHtml
    //restoreLastJson()

}

function createObjectList(module)
{
    let objectsContainerHtml = `
    <div class="object-list-container">
        <div class="container-title">Lista obiektów</div>
        <ul class="object-list">`
    const ids = dynamicData[module].list.map(item => item.id || item.name);
        ids.forEach(id => {
          objectsContainerHtml+= `<li>${id}</li>`;
        });
    objectsContainerHtml += '</ul></div>'
    return objectsContainerHtml  
}

function createObjectConfigurationContainer(jsonData)
{
    let html = ''

    for (const property of jsonData.properties) {
        if(property.type === "key"){
        html += `<div class="properties-element">
        <header>${property.name}</header>
        </div><div class="key-menu">`
        html+=createObjectConfigurationContainer(property)
        }
        else if(property.type === "subkey"){
        html += `<div class="subkey">
        <header>${property.name}</header>
        </div><div class="key-menu">`
        html+=createObjectConfigurationContainer(property)
        }
        else if (property.type === 'options') {
            html+=`<div class="key-value"><h2 class="property-name">${property.name}:</h2>`
            for (const option of property.options) {
              const checkedClass = option.checked ? 'checked' : '';
              html += `
                <label class="radio-button ${checkedClass}">
                  <input type="radio" name="${property.name}" class="radio-input" ${option.checked ? 'checked' : ''}>
                  ${option.name}
                </label>
              `;
            }
            if (property.extraOptions) {
                html += `
                  <div class="case-tip">
                    <span class="case-tip__icon">CASE</span>
                  </div>
                `;
              }
              if (property['tool-tip']) {
                html += `
                  <div class="tool-tip">
                    <i class="tool-tip__icon">i</i>
                    <p class="tool-tip__info">${property['tool-tip']}</p>
                  </div>
                `;
              }
            html+='</div>'
          } 
          else if (property.type === 'string') {
            
            html += `
            <div class="key-value"><label for="${property.name}"><h2 class="property-name">${property.name}:</h2></label>
              <input type="text" id="${property.name}" name="${property.name}"></div>
            `;
            if (property['tool-tip']) {
                html += `
                  <div class="tool-tip">
                    <i class="tool-tip__icon">i</i>
                    <p class="tool-tip__info">${property['tool-tip']}</p>
                  </div>
                `;
              }
          } 
    }
    html += `
        </div>
      `;
    return html;
}

loadContent("characterEffect")

