const objectProperties = document.querySelector(".object-property-list")

class CharacterEffect {
    constructor(id) {
      this.action = "CREATE";
      this.id = id
      this.windowTarget = "MAP"
      this.target = new Target();
      this.effect = "ANIMATION";
      this.params = new AnimationParams();
    }
  }
  
  class Target {
    constructor() {
      this.kind = "HERO"
    }
  }
  
  class AnimationParams {
    constructor() {
      this.gifUrl = "";
      this.repeat = 1;
      this.opacity=1;
      this.position = "CENTER"
      this.behind = false;
      this.offsetX = 0;
      this.offsetY = 0;
      this.speecchBubble = false;
    }
  }
