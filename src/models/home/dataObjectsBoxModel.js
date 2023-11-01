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
        fetch('config/modules.json')
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
        for(let key in this.jsonData){
            const hasList = this.listConfig.modules.find(object => object.name === key).hasList;
            if(hasList){
                try{
                    const ids = this.jsonData[key].list.map(item => item.id || item.name || item.kind || item.action);
                    dataObjects.push({"keyName": key, "objectNames": ids})
                }
                catch{}
            }
            else{
                dataObjects.push({"keyName": key, "objectNames": []})
            } 
        }
        this.dataObjectsList = dataObjects
    }
}