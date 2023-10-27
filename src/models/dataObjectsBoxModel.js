class DataObjectsBoxModel{
    constructor(jsonData){
        this.jsonData = jsonData
        this.createDataObjectsList()
    }

    bindObjectsListChanged = (callback) => {
        this.modulesListChanged = callback
      }

    createDataObjectsList = () => {
        const dataObjectsList = []
        for (let key in this.jsonData){
            const ids = this.jsonData[key].list.map(item => item.id || item.name || item.kind || item.action);
            dataObjectsList.push({"keyName": key, "objectNames": ids})
        }

        this.dataObjectsList = dataObjectsList
    }


}