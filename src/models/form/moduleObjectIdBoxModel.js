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
        this.uncheckedCurrentObject()
        this.objectIdList.objectId[index].isChecked = true
        this.jsonData.modulePathParams.objectId = index
        this.objectIdListChanged(this.objectIdList)
    }

    addObjectId = () => {
        const name = this.pickDefaultUniqueName()
        this.objectIdList.objectId.push({"name": name, "isChecked": true})
        this.uncheckedCurrentObject()
        this.objectIdListChanged(this.objectIdList)
        this.jsonData.modulePathParams.objectId = this.objectIdList.objectId.length - 1
    }

    cloneObjectId = (index) => {
        
    }

    deleteObjectId = (index) => {

    }

    updateNameObjectId = (index, newName) => {
        
    }  
    
    uncheckedCurrentObject(){
        const currentIndex = this.jsonData.modulePathParams.objectId
        this.objectIdList.objectId[currentIndex].isChecked = false
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