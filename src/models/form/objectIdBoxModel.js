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
            if(params.workingList === null || params.workingList.length === 0){
                const name = this.pickDefaultUniqueName()
                this.jsonData.addObject(this.container, name)
            }
            const bindData = this.jsonData.moduleConfig.modules.find(module => module.name === params.module).bindId
            ids = params.workingList.map(item => item[bindData]);
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
        const params = this.jsonData.getParams(this.container)
        this.objectIdList[index].isChecked = true
        params.objectId = index
        params.workingObject = params.workingList[index]
        this.objectIdListChanged(this.objectIdList, this.hasList)
        this.objectForm.createObjectFormList(this.objectForm.config)
        if(this.container === "module"){
            this.clearExtraOption()
        }
    }

    addObjectId = () => {
        let name = this.pickDefaultUniqueName()
        if(this.objectIdList.length > 0){
            this.uncheckedCurrentObject()
        }
        this.jsonData.addObject(this.container, name)
        this.jsonDataBox.jsonDataChanged(this.jsonData, this.jsonDataBox.isBeautified)
        name = this.pickDefaultUniqueName()
        this.objectIdList.push({"name": name, "isChecked": true})
        this.objectIdListChanged(this.objectIdList, this.hasList)
        this.objectForm.createObjectFormList(this.objectForm.config)
        if(this.container === "module"){
            this.clearExtraOption()
        }
    }

    cloneObjectId = (index) => {
        this.objectIdList.push({"name": this.objectIdList[index].name, "isChecked": true})
        this.uncheckedCurrentObject()
        this.objectIdListChanged(this.objectIdList, this.hasList)
        this.jsonData.cloneObject(this.container, index)
        this.jsonDataBox.jsonDataChanged(this.jsonData, this.jsonDataBox.isBeautified)
        if(this.container === "module"){
            this.clearExtraOption()
        }
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
        else if(this.objectIdList.length === 0){
            params.workingObject = null
        }
        if(params.path === "key"){
            const defaultInput = this.moduleObjectForm.configUtils.findObjectByProperty(this.moduleObjectForm.config.properties, params.key, "name").defaultInput
            this.jsonData.deleteObject(this.container, index, defaultInput)
        }
        else{
            this.jsonData.deleteObject(this.container, index, "")
        }
        this.objectIdListChanged(this.objectIdList, this.hasList)
        this.jsonDataBox.jsonDataChanged(this.jsonData, this.jsonDataBox.isBeautified)
        if(this.objectIdList.length > 0){
            this.objectForm.createObjectFormList(this.objectForm.config)
        }
        else{
            this.objectForm.clearForm()
            if(this.container === "extraOption"){
                this.clearBox(false)
                this.moduleObjectForm.changeStateExtraOption()
            }
        }
        if(this.container === "module"){
            this.clearExtraOption()
        }
        
    }

    updateNameObjectId = (container) => {
        const params = this.jsonData.getParams(container)
        const bindData = this.jsonData.moduleConfig.modules.find(module => module.name === params.module).bindId
        let result = bindData === "module" ? params.module : this.jsonData.getValueFromWorkingObject(this.container, bindData)
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
        const params = this.jsonData.getParams(this.container)
        const bindData = this.jsonData.moduleConfig.modules.find(module => module.name === params.module).bindId
        switch(bindData){
            case "id":
                if(this.objectIdList) {
                    let number = this.objectIdList.length
                    defaultName = `obiekt-${number}`
                    while(this.objectIdList.find(object => object.name === defaultName) !== undefined){
                        number+=1
                        defaultName = `obiekt-${number}`
                    }
                }
                else defaultName = `obiekt-0`
                break;
            case "module":
                defaultName = params.module
                break;
            default:
                defaultName = this.jsonData.getValueFromWorkingObject(this.container, bindData)
                break;
        }  
        return defaultName      
    }

    clearBox = (addPlusButton) => {
        this.objectIdList = []
        this.objectIdListChanged(this.objectIdList, this.hasList, addPlusButton)
    }

    dropElement = (indexData) => {
        if(indexData.moveTo >= this.objectIdList.length){
            indexData.moveTo -=1
        }
        if(indexData.moveTo === indexData.fromDraggedModule) return
        const draggedElement = this.objectIdList[indexData.fromDraggedModule]
        this.objectIdList.splice(indexData.fromDraggedModule, 1);
        this.objectIdList.splice(indexData.moveTo, 0, draggedElement);
        const params = this.jsonData.getParams(this.container)
        const draggedListElement =  params.workingList[indexData.fromDraggedModule]
        params.workingList.splice(indexData.fromDraggedModule, 1);
        params.workingList.splice(indexData.moveTo, 0, draggedListElement);
        if(params.objectId === indexData.fromDraggedModule){
            params.objectId = indexData.moveTo
        }
        else if(indexData.fromDraggedModule < params.objectId && indexData.moveTo >= params.objectId){
            params.objectId -= 1
        }
        else if(indexData.fromDraggedModule > params.objectId && indexData.moveTo <= params.objectId){
            params.objectId += 1
        }
        this.objectIdListChanged(this.objectIdList, this.hasList)
        this.jsonDataBox.jsonDataChanged(this.jsonData, this.jsonDataBox.isBeautified)
    }

    clearExtraOption = () => {
        this.jsonData.extraOptionPathParams.workingObject = null
        if(this.extraOptionIdBox){
            this.extraOptionIdBox.clearBox(false)
            this.extraOptionObjectForm.clearForm()
        }

    }
}