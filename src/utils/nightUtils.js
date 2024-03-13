class NightUtils{
    constructor(objectForm, value){
        this.value = value
        this.list = []
        this.templateDict = {}
        this.objectForm = objectForm
    }

    fetchConfigAndSetLightPointList = () => {
        try {
            JSON.parse(this.value);
        fetch(`src/config/night/lightPoints.json`)
        .then(response => response.json())
        .then(config => {
            this.list = this.createLightPointListAndTemplateDict(config)
            this.objectForm.jsonDataBox.jsonDataChanged()
        })
        .catch(error => {
        console.error('Błąd pobierania:', error);
        })
    }
    catch (e){}
}

    createLightPointListAndTemplateDict = (config) => {
        const jsonValue = JSON.parse(this.value);
        this.list = [];
        try{
            jsonValue.forEach(element => {
                const lightPoint = config.list.find(lightPoint => lightPoint.Name === element.name)
                if(lightPoint){
                    const lightObject = this.createLightPoint(element)
                    this.list.push(lightObject)
                    this.templateDict[element.name] = lightPoint.Data
                }
            });
            this.list = this.list.filter(element => element !== null && element !== undefined);
            this.setLightPointsListAndTemplates()
        }
        catch(e){
            console.log(e);
        }
    }

    createLightPoint = (element) => {
        const lightObject = {
            "x": element.x,
            "y": element.y,
            "getTpl": element.name
        }
        return lightObject
    }

    setLightPointsListAndTemplates = () => {

        if (Object.keys(this.templateDict).length === 0) {
            delete this.objectForm.jsonData.workingData["template"]
        }
        else{
            this.objectForm.jsonData.workingData["template"] = this.templateDict
        }
        this.objectForm.jsonData.setObjectKeyByPath("module", "list", this.list)
        const temp = this.objectForm.jsonData.workingData["night"]
        delete this.objectForm.jsonData.workingData["night"]
        this.objectForm.jsonData.workingData["night"] = temp
        this.objectForm.changeStateExtraOption()
    }


}