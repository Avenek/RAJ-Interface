class DataObjectsBoxModel{
    constructor(jsonData){
        this.jsonData = jsonData
        this.dataObjectsList = this.createDataObjectsList()
    }

    createDataObjectsList = () => {
        const dataObjectsList = []
        for (let key in this.jsonData){
            const ids = this.jsonData[key].list.map(item => item.id || item.name || item.kind || item.action);
            dataObjectsList.push({"keyName": key, "objectNames": ids})
        }

        return dataObjectsList
    }


}