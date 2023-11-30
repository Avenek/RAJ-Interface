class DataObjectsBoxModel{
    constructor(jsonData){
        this.jsonData = jsonData
        this.dataObjectsList = []
        this.listConfig = null
        this.fetchDataAndCreateDataObjectsList()
    }

    bindObjectsListChanged = (callback) => {
        this.dataObjectsListChanged = callback
      }

    fetchDataAndCreateDataObjectsList = () => {
        fetch('/src/config/modules.json')
        .then(response => response.json())
        .then(config => {
            this.listConfig = config
            this.dataObjectsListChanged()
        })
        .catch(error => {
        console.error('Błąd pobierania:', error);
        })
    }

    createDataObjectsList = () => {
        const dataObjects = []
        try{
            for(let key in this.jsonData.data){
                const hasList = this.listConfig.modules.find(object => object.name === key).hasList;
                if(hasList){
                    const ids = this.jsonData.data[key].list.map(item => item.id || item.name || item.kind || item.action);
                    dataObjects.push({"keyName": key, "objectNames": ids})
                }
                else{
                    dataObjects.push({"keyName": key, "objectNames": []})
                } 
            }
            this.dataObjectsList = dataObjects
        }
        catch{}
    }
}