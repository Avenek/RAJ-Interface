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
    this.speechBubble = false;
  }
}








/*let o = {
CharacterEffect : class CharacterEffect {
    constructor(id) {
      this.action = "CREATE";
      this.id = id
      this.windowTarget = "MAP"
      this.target = new Target();
      this.effect = "ANIMATION";
      this.params = new AnimationParams();
    }
  },
  
  Target : class Target {
    constructor() {
      this.kind = "HERO"
    }
  },
  
  AnimationParams : class AnimationParams {
    constructor() {
      this.gifUrl = "";
      this.repeat = 1;
      this.opacity=1;
      this.position = "CENTER"
      this.behind = false;
      this.offsetX = 0;
      this.offsetY = 0;
      this.speechBubble = false;
    }
  }

}

window.SRAJ_MODULES = {}

for (let k in o) {
  window.SRAJ_MODULES[k] = o[k]

}*/

