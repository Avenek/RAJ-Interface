class ModuleObjectIdBoxModel{
    constructor(jsonData, container){
        this.jsonData = jsonData
        this.container = container
        this.hasList = true
        this.createObjectIdList()
    }

    createObjectIdList = () => {
        const params = this.jsonData.getParams(this.container)
        const idList = []
        let ids
        if(params.hasList){
            ids = this.jsonData.data[params.module].list.map(item => item.id || item.name || item.kind || item.action);
        }
        else{
            ids = [params.module]
        }
        ids.forEach(id => {
            idList.push({"name": id, "isChecked": false})
        })
        idList[params.objectId].isChecked = true
        this.objectIdList = idList
        this.hasList = params.hasList
    }

    bindObjectIdListChanged = (callback) => {
        this.objectIdListChanged = callback
    }

    checkObjectId = (index) => {
        this.uncheckedCurrentObject()
        this.objectIdList[index].isChecked = true
        this.jsonData.modulePathParams.objectId = index
        this.objectIdListChanged(this.objectIdList, this.hasList)
    }

    addObjectId = () => {
        const name = this.pickDefaultUniqueName()
        this.objectIdList.push({"name": name, "isChecked": true})
        this.uncheckedCurrentObject()
        this.objectIdListChanged(this.objectIdList, this.hasList)
        this.jsonData.modulePathParams.objectId = this.objectIdList.length - 1
    }

    cloneObjectId = (index) => {
        
    }

    deleteObjectId = (index) => {

    }

    updateNameObjectId = (index, newName) => {
        
    }  
    
    uncheckedCurrentObject(){
        const currentIndex = this.jsonData.getParams(this.container).objectId
        this.objectIdList[currentIndex].isChecked = false
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
                let number =  this.objectIdList.length
                defaultName = `obiekt-${number}`
                while(this.objectIdList.find(object => object.name === defaultName) !== undefined){
                    console.log(this.objectIdList.find(object => object.name === defaultName));
                    number+=1
                    defaultName = `obiekt-${number}`
                }
              break; 
        }  
        return defaultName      
    }
}