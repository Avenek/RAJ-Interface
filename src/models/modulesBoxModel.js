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
        const newContainer = { 
            "title": "Nowy kontener",
            "error": "",
            "modules": []
        }

        return newContainer
    }

    deleteContainer = (name) => {
        const index = this.findContainerIndexByTitle(name)
        this.modulesList.containers.splice(index, 1);
        this.modulesListChanged(this.modulesList)
    }

    updateNameContainer = (containerName, newName) => {
        newName = newName.trim()
        const index = this.findContainerIndexByTitle(containerName)
        if((newName && this.findContainerIndexByTitle(newName) === -1) || containerName === newName){
            this.modulesList.containers[index].title = newName
        }
        this.modulesListChanged(this.modulesList)
    }    

    findContainerIndexByTitle = (title) => {
        return this.modulesList.containers.findIndex(container => container.title === title);
    }
    


}