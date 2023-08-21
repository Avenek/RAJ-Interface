jsonText = document.querySelector(".json-text")

const dynamicData = {};


class Weather {
    constructor() {
      this.list = [];
    }
  
    addWeatherCondition(action, name, speedX = 0, speedY = 0) {
      this.list.push({ action, name, speedX, speedY });
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