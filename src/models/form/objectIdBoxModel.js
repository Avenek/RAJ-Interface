class ObjectIdBoxModel{
    constructor(jsonData, container, jsonDataBox, objectForm){
        this.jsonData = jsonData
        this.container = container
        this.jsonDataBox = jsonDataBox
        this.hasList = true
        this.objectForm = objectForm
        this.createObjectIdList()
    }

    createObjectIdList = () => {
        const params = this.jsonData.getParams(this.container)
        const idList = []
        let ids
        if(params.hasList){
            if(params.workingObject === null){
                const name = this.pickDefaultUniqueName()
                this.jsonData.addObject(this.container, name)
            }
            ids = params.workingList.map(item => item.id || item.name || item.kind || item.action);
            ids.forEach(id => {
                idList.push({"name": id, "isChecked": false})
            })
        }
        else{
            this.jsonData.addObject(this.container)
            idList.push({"name": params.module, "isChecked": true})
        }
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
        this.jsonData.modulePathParams.workingObject = this.jsonData.modulePathParams.workingList[index]
        this.objectIdListChanged(this.objectIdList, this.hasList)
        this.objectForm.createObjectFormList(this.objectForm.config)
    }

    addObjectId = () => {
        const name = this.pickDefaultUniqueName()
        if(this.objectIdList.length > 0){
            this.uncheckedCurrentObject()
        }
        this.objectIdList.push({"name": name, "isChecked": true})
        this.objectIdListChanged(this.objectIdList, this.hasList)
        this.jsonData.addObject(this.container, name)
        this.jsonDataBox.jsonDataChanged(this.jsonData, this.jsonDataBox.isBeautified)
        this.objectForm.createObjectFormList(this.objectForm.config)
    }

    cloneObjectId = (index) => {
        this.objectIdList.push({"name": this.objectIdList[index].name, "isChecked": true})
        this.uncheckedCurrentObject()
        this.objectIdListChanged(this.objectIdList, this.hasList)
        this.jsonData.cloneObject(this.container, index)
        this.jsonDataBox.jsonDataChanged(this.jsonData, this.jsonDataBox.isBeautified)
    }

    deleteObjectId = (index) => {
        const params = this.jsonData.getParams(this.container)
        const isChecked = this.objectIdList[index].isChecked
        this.objectIdList.splice(index, 1)
        if(isChecked && this.objectIdList.length>0){
            this.objectIdList[0].isChecked = true
            params.objectId = 0
            params.workingObject = params.workingList[0]
        }
        else{
            params.workingObject = null
        }
        this.jsonData.deleteObject(this.container, index)
        this.objectIdListChanged(this.objectIdList, this.hasList)
        this.jsonDataBox.jsonDataChanged(this.jsonData, this.jsonDataBox.isBeautified)
        if(this.objectIdList.length > 0){
            this.objectForm.createObjectFormList(this.objectForm.config)
        }
        else{
            this.objectForm.hightligthsUsedExtraOption()
            this.objectForm.clearForm()
            if(this.container === "extraOption"){
                this.clearBox()
            }
        }
    }

    updateNameObjectId = (container) => {
        const params = this.jsonData.getParams(container)
        const keysInOrder = ['id', 'name', 'kind', 'action'];
        let result = ""
        for (const key of keysInOrder) {
            if (params.workingObject[key] !== undefined) {
              result = params.workingObject[key];
              break;
            }
          }
        const currentIndex = this.jsonData.getParams(this.container).objectId
        this.objectIdList[currentIndex].name = result
        this.objectIdListChanged(this.objectIdList, this.hasList)
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
                let number
                if(this.objectIdList) {
                    number = this.objectIdList.length
                    defaultName = `obiekt-${number}`
                    while(this.objectIdList.find(object => object.name === defaultName) !== undefined){
                        number+=1
                        defaultName = `obiekt-${number}`
                    }
                }
                else defaultName = `obiekt-0`
                
              break; 
        }  
        return defaultName      
    }

    clearBox = () => {
        this.objectIdList = []
        this.objectIdListChanged(this.objectIdList, this.hasList, false)
    }
}