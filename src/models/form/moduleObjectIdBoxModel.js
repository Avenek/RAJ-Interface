class ModuleObjectIdBoxModel{
    constructor(jsonData, module, id){
        this.objectIdList = null
        this.fetchDataAndCreateObjectIdList(jsonData, module, id)
    }

    fetchDataAndCreateObjectIdList = (jsonData, module, id) => {
        fetch('config/modules.json')
        .then(response => response.json())
        .then(config => {
            const moduleObject = config.modules.find(object => object.name === module);
            const hasList = moduleObject.hasList
            this.createObjectIdList(jsonData, module, id, hasList)
            this.objectIdListChanged(this.objectIdList)
        })
        .catch(error => {
        console.error('Błąd pobierania:', error);
        })
    }

    createObjectIdList = (jsonData, module, id, hasList) => {
        const idList = []
        const ids = jsonData[module].list.map(item => item.id || item.name || item.kind || item.action);
        ids.forEach(id => {
            idList.push({"name": id, "isChecked": false})
        })
        idList[id].isChecked = true
        this.objectIdList = {"hasList": hasList, "objectId": idList}
    }

    bindObjectIdListChanged = (callback) => {
        this.objectIdListChanged = callback
    }

    checkObjectId = (index) => {

    }

    addObjectId = () => {
        
    }

    cloneObjectId = (index) => {
        
    }

    deleteObjectId = (index) => {

    }

    updateNameObjectId = (index, newName) => {
        
    }    
}