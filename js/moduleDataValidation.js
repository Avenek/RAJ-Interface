function showError(targetInput, message){
    const errorElement = targetInput.nextElementSibling
    targetInput.classList.add("error")
    errorElement.textContent = message
    errorElement.classList.remove("hide")
  }
  
  function hideError(targetInput){
      targetInput.classList.remove("error")
      targetInput.nextElementSibling.classList.add("hide")
  }
  
  function checkEmptyInputsAndShowErrors(container){
    container.inputList.forEach(input => {
      if(!input.parentElement.classList.contains("hide") && !input.parentElement.parentElement.classList.contains("hide")){
        showErrorIfInputIsEmpty(input)
      }   
    })
  }
  
  function showErrorIfInputIsEmpty(inputTarget){
    if(inputTarget.value===""){
      const message = "Pole jest obligatoryjne i nie może być puste!"
      showError(inputTarget, message);
      }
      else{
        hideError(inputTarget)
      }
  }
  
  
  function isDataValid(container, input){
    const configObject = findObjectByProperty(container.jsonConfig.properties, input.id, "idInput")
    let inputValue
    inputValue = getValueInGoodType(input.name, input.value, container)
    if(!configObject.hasOwnProperty("validation")){
      if((inputValue === "" || inputValue.length===0) && !configObject.canBeEmpty){
        if(input.parentElement.querySelector("button") !== null && input.parentElement.querySelector("button").classList.contains("extra-option-active")){
          hideError(input)
          return
        }
        else{
          errorMessage = "Pole jest obligatoryjne i nie może być puste!"
          showError(input, errorMessage)
          return
        }
      }
      hideError(input)
      return
    }
    let valuesFromInput = []
    
    if(Array.isArray(getValueFromObject(container.workingObject, input.name))){
      valuesFromInput = input.value.split(";")
    }
    else{
      inputValue = getValueInGoodType(input.name, input.value, container)
      input.value = inputValue
      valuesFromInput.push(inputValue)
    }
    valuesFromInput.forEach(value => {
      inputValue = getValueInGoodType(input.name, value, container)
      let valueType = checkValueType(inputValue)
    if(configObject.varType.includes(valueType) && valueType !== "object"){
      let isValid = true;
      let errorMessage;
      for(const valid of configObject.validation){
        if(valid.forType === valueType){
          switch(valid.name){
            case "minMax":
              isValid = minMaxValid(configObject, inputValue)
              if(!isValid){
                errorMessage = `Wartość powinna zawierać się w przedziale od ${configObject.min} do ${configObject.max}!`
              }
              break;
            case "unique":
              isValid = uniqueValid(container.list, input.name, inputValue, container)
              if(!isValid){
                errorMessage = "Wartość tego pola powinna być unikalna i nie może się powtarzać w innych obiektach!"
            }
              break;
            case "notEqual":
              isValid = notEqualValid(valid, inputValue)
              if(!isValid){
                errorMessage = `Wartość tego pola powinna być różna od ${valid.value.join(", ")}!`
              }
              break;
            case "equal":
              isValid = equalValid(valid, inputValue)
              if(!isValid){
                errorMessage = `Wartość tego pola powinna być równa ${valid.value.join(", ")}!`
              }
              break;
            case "moreThan":
                isValid = moreThanValid(valid, inputValue, container)
                if(!isValid){
                  errorMessage = `Wartość tego pola powinna być większa od `
                  if(typeof valid.value === "number"){
                    errorMessage +=  `wartości ${valid.value}!`
                  }
                  else{
                    errorMessage += `wartości klucza ${valid.value}!`
                  }
                }
                break;
            case "lessThan":
                isValid = lessThanValid(valid, inputValue, container)
                if(!isValid){
                    errorMessage = `Wartość tego pola powinna być większa od `
                    if(typeof valid.value === "number"){
                        errorMessage +=  `wartości ${valid.value}!`
                      }
                    else{
                        errorMessage += `wartości klucza ${valid.value}!`
                      }
                    }
                break;
            default:
              break;
          } 
          if(!isValid){
            showError(input, errorMessage)
            break;
          }
          else if(inputValue === "" && !configObject.canBeEmpty && !(input.parentElement.querySelector("button") !== null && input.parentElement.querySelector("button").classList.contains("extra-option-active"))){
            errorMessage = "Pole jest obligatoryjne i nie może być puste!"
            showError(input, errorMessage)
          }
          else{
            hideError(input)
          }
        } 
      }
      if(!isValid){
        showError(input, errorMessage)
      }
      else if(inputValue === "" && !configObject.canBeEmpty && !(input.parentElement.querySelector("button") !== null && input.parentElement.querySelector("button").classList.contains("extra-option-active"))){
        errorMessage = "Pole jest obligatoryjne i nie może być puste!"
        showError(input, errorMessage)
      }
      else{
        hideError(input)
      }
    }
    else if(inputValue.length===0 && !configObject.canBeEmpty && !(input.parentElement.querySelector("button") !== null && input.parentElement.querySelector("button").classList.contains("extra-option-active"))){
      errorMessage = "Pole jest obligatoryjne i nie może być puste!"
        showError(input, errorMessage)
    }
    else if(valueType !== "object" && !configObject.canBeEmpty && !(input.parentElement.querySelector("button") !== null && input.parentElement.querySelector("button").classList.contains("extra-option-active"))){
        errorMessage = `Wartość tego pola posiada zły typ! Dozwolone typy dla tego pola to: ${configObject.varType.join(", ")}`
        showError(input, errorMessage)
    }
    else{
      hideError(input)
    }
    })
  }
  
  function checkValueType(value){
    let valueType = typeof value
    if(valueType === "number"){
      if(isInteger(value)){
        valueType = "int" 
      }
      else{
        valueType = "float"
      }
    }
    return valueType
  }
  
  function minMaxValid(configObject, value){
    return value>=configObject.min && value <= configObject.max
  }
  
  function uniqueValid(objectList, key, value, container){
      for(let i=0 ; i< objectList.length ; i++){
        let objectValue = getValueFromObject(objectList[i], key)
        if(objectValue === value && i != container.currentIndex){
          return false
         }
      }
      return true
  }
  
  function notEqualValid(validObject, value){
    return !validObject.value.includes(value)
  }
  
  function equalValid(validObject, value){
    return validObject.value.includes(value)
  }

  function moreThanValid(validObject, value, container){
    if(typeof validObject.value === "number"){
        return value > validObject.value
    }
    else{
        validValue = getValueFromObject(container.workingObject, validObject.value)
        if(validValue === null || validValue === NaN || validValue === undefined){
            findObjectByProperty(container.jsonConfig.properties, validObject.value, "name").defaultSraj
        }
        return value > validValue
    }
  }

  function lessThanValid(validObject, value, container){
    if(typeof validObject.value === "number"){
        return value < validObject.value
    }
    else{
        validValue = getValueFromObject(container.workingObject, validObject.value)
        if(validValue === null || validValue === NaN || validValue === undefined){
            findObjectByProperty(container.jsonConfig.properties, validObject.value, "name").defaultSraj
        }
        return value < validValue
    }
  }

  function add(a, b) {
    return a + b;
  }
  