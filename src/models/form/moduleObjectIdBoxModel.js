class ModuleObjectIdBoxModel{
    constructor(jsonData, module, id){
        this.objectIdList = null
        this.createObjectIdList(jsonData, module, id)
    }

    createObjectIdList = (jsonData, module, id) => {
        const objectIdList = []
        const ids = jsonData[module].list.map(item => item.id || item.name || item.kind || item.action);
        ids.forEach(id => {
            objectIdList.push({"name": id, "isChecked": false})
        })
        objectIdList[id].isChecked = true
        this.objectIdList = objectIdList
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