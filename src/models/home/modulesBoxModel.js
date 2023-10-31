class ModulesBoxModel{
    constructor(){
        this.modulesList = JSON.parse(localStorage.getItem('containerConfig')) || this.fetchContainersData()
    }

    
    fetchContainersData = () => {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", "config/containers.json", false);
        xhr.send(null);
    
        if (xhr.status === 200) {
            return JSON.parse(xhr.responseText);
        } else {
            console.error(xhr.statusText);
        }
    }

    bindModulesListChanged = (callback) => {
        this.modulesListChanged = callback
      }

    addContainer = () => {
        if(this.modulesList.containers.length<7)
        {
            const newContainer = this.createNewContainer()
            this.modulesList.containers.push(newContainer)
            this.modulesListChanged(this.modulesList)
        }
        else
        {
            alert('Nie możesz mieć więcej niż 7 kontenerów.')
        }
    }

    createNewContainer = () => {
        let newContainer
        if(this.findContainerIndexByTitle("Nowy kontener") === -1){
            newContainer = { 
                "title": "Nowy kontener",
                "modules": []
            }
        }
        else{
            let i = 1
            while(this.findContainerIndexByTitle(`Nowy kontener_${i}`) !== -1){
                i++
            }
            newContainer = { 
                "title": `Nowy kontener_${i}`,
                "modules": []
            }
        }
        
        return newContainer
    }

    

    deleteContainer = (index) => {
        this.modulesList.containers.splice(index, 1);
        this.modulesListChanged(this.modulesList)
    }

    updateNameContainer = (index, newName) => {
        newName = newName.trim()
        if((newName && this.findContainerIndexByTitle(newName) === -1) || this.modulesList.containers[index].title === newName){
            this.modulesList.containers[index].title = newName
            this.modulesListChanged(this.modulesList)
        }
        
    }    

    dropContainer = (indexData) => {
        if(indexData.fromContainer === indexData.toContainer && indexData.fromDraggedModule < indexData.moveTo){
            indexData.moveTo -= 1
        }
        const draggedElement = this.modulesList.containers[indexData.fromContainer].modules[indexData.fromDraggedModule]
        this.modulesList.containers[indexData.fromContainer].modules.splice(indexData.fromDraggedModule, 1);
        this.modulesList.containers[indexData.toContainer].modules.splice(indexData.moveTo, 0, draggedElement);

        this.modulesListChanged(this.modulesList)
    }

    findContainerIndexByTitle = (title) => {
        return this.modulesList.containers.findIndex(container => container.title === title);
    }

}