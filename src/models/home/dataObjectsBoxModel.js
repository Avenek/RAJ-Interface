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
        fetch('src/config/classesConfig/modules.json')
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
            for(let key in this.jsonData.workingData){
                const hasList = this.listConfig.modules.find(module => module.name === key).hasList;
                const bindData = this.listConfig.modules.find(module => module.name === key).bindId
                let ids
                if(hasList){
                    if(Array.isArray(bindData)){
                        ids = this.jsonData.workingData[key].list.map(item => this.jsonData.getValueFromObject(item, bindData[0]) + "," + this.jsonData.getValueFromWorkingObject(item, bindData[1]));
                    }
                    else{
                        ids = this.jsonData.workingData[key].list.map(item => this.jsonData.getValueFromObject(item, bindData));
                    }
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