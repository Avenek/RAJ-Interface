jsonText = document.querySelector(".json-text")

const dynamicData = {};


class Weather {
    constructor() {
      this.list = [];
    }
  
    addWeatherCondition(action, id, speedX = 0, speedY = 0) {
      this.list.push({ action, id, speedX, speedY });
    }
  
    removeWeatherCondition(index) {
      if (index >= 0 && index < this.list.length) {
        this.list.splice(index, 1);
      }
    }
  }
  
  class MapFilter {
    constructor(r, g, b, a) {
      this.color = { r, g, b, a };
    }
  }

// Tworzenie instancji klas i dodawanie do dynamicData
dynamicData.weather = new Weather();
dynamicData.weather.addWeatherCondition("CREATE", "Snow");
dynamicData.weather.addWeatherCondition("CREATE", "Rain", 2, -1);

dynamicData.mapFilter = new MapFilter(0, 0, 0, 0.2);

// Serializacja do JSON
jsonText.textContent = JSON.stringify(dynamicData, null, 2);

const elementContainer = document.querySelector(".element-container");

function createHTMLStructure(data) {
  const ul = document.createElement("ul");

  for (let key in data) {
    const listItem = document.createElement("li");
    listItem.textContent = key;
    console.log(key, data[key]);
    if (typeof data[key] === "object" && !Array.isArray(data[key])) {
      const nestedUl = createHTMLStructure(data[key]);
      if (nestedUl.children.length > 0) {
        listItem.appendChild(nestedUl);
        ul.appendChild(listItem);
      }
    } else if (Array.isArray(data[key])) {
      data[key].forEach(item => {
        const li = document.createElement("li");
        li.textContent = item.name || item.id;
        ul.appendChild(li);
      });
    }
  }

  return ul;
}


// Tworzenie struktury HTML dla głównych kluczy
const topLevelUl = createHTMLStructure(dynamicData);
topLevelUl.classList.add("nav");
elementContainer.appendChild(topLevelUl);
