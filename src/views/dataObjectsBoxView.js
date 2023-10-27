class DataObjectsBoxView extends View{
    constructor(dataObjectsBox){
        super()
       this.dataObjectsBox = dataObjectsBox
    }

    displayDataObjects = (dataObjectsList) => {
        this.dataObjectsBox.innerHTML = ""
        dataObjectsList.forEach(key => {
            const keyMenu = this.createElement("div", "key-menu")
            const keyElement = this.createElement("div", "key-element");
            keyElement.textContent = `${key.keyName}`          
            keyMenu.append(keyElement)
            const objectIdsMenu = this.createElement("div", "object-ids-menu")
            key.objectNames.forEach(objectId => {
                const objectIdElement = this.createElement("div", "object-id-element");
                objectIdElement.textContent = objectId
                objectIdsMenu.append(objectIdElement)
            })
            keyMenu.append(objectIdsMenu)
            this.dataObjectsBox.append(keyMenu);
        })        
    }
}