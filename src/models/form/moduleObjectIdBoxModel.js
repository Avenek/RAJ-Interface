class ModuleObjectIdBoxModel{
    constructor(jsonData){
        this.jsonData = jsonData
        this.fetchDataAndCreateObjectIdList()
    }

    fetchDataAndCreateObjectIdList = () => {
        fetch('config/modules.json')
        .then(response => response.json())
        .then(config => {
            const moduleObject = config.modules.find(object => object.name === this.jsonData.modulePathParams.module);
            const hasList = moduleObject.hasList
            this.createObjectIdList(hasList)
            this.objectIdListChanged(this.objectIdList)
        })
        .catch(error => {
        console.error('Błąd pobierania:', error);
        })
    }

    createObjectIdList = (hasList) => {
        const idList = []
        const ids = this.jsonData.data[this.jsonData.modulePathParams.module].list.map(item => item.id || item.name || item.kind || item.action);
        ids.forEach(id => {
            idList.push({"name": id, "isChecked": false})
        })
        idList[this.jsonData.modulePathParams.objectId].isChecked = true
        this.objectIdList = {"hasList": hasList, "objectId": idList}
    }

    bindObjectIdListChanged = (callback) => {
        this.objectIdListChanged = callback
    }

    checkObjectId = (index) => {
        this.objectIdList.objectId.forEach(id => {
            id.isChecked = false
        })
        this.objectIdList.objectId[index].isChecked = true
        this.objectIdListChanged(this.objectIdList)
    }

    addObjectId = () => {
        const name = this.pickDefaultUniqueName()
        this.objectIdList.objectId.push({"name": name, "isChecked": false})
        this.objectIdListChanged(this.objectIdList)
        this.jsonData.modulePathParams.objectId = 3
    }

    cloneObjectId = (index) => {
        
    }

    deleteObjectId = (index) => {

    }

    updateNameObjectId = (index, newName) => {
        
    }    

    pickDefaultUniqueName(){
        let defaultName = ""
        switch(this.module){
            case "case":
                defaultName = 'ARGUMENT'
              break; 
            case "behavior":
                defaultName = 'IDLE'
                break;
            case "characterHide":
                defaultName = "HERO"
                break;
            case "weather":
                defaultName = "Rain"
                break;
                case "earthQuake":
                case "camera":
                case "zoom":
                case "dialogue":
                case "yellowMessage":
                case "mapFilter":
                    defaultName = container.name;
                    break;
            default:
                let number =  this.objectIdList.objectId.length
                defaultName = `obiekt-${number}`
                while(this.objectIdList.objectId.find(object => object.name === defaultName) !== undefined){
                    console.log(this.objectIdList.objectId.find(object => object.name === defaultName));
                    number+=1
                    defaultName = `obiekt-${number}`
                }
              break; 
        }  
        return defaultName      
    }
}