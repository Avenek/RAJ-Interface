const objectProperties = document.querySelector(".object-property-list")

class CharacterEffect {
    constructor(action, id, windowTarget, effect, target, params) {
      this.action = action;
      this.id = id;
      this.windowTarget = windowTarget;
      this.effect = effect;
      this.target = target;
      this.params = params;
    }
  }
  
  class Target {
    constructor(kind, id) {
      this.kind = kind;
      this.id = id;
    }
  }
  
  class Params {
    constructor(duration, color, repeat, delayBefore) {
      this.duration = duration;
      this.color = color;
      this.repeat = repeat;
      this.delayBefore = delayBefore;
    }
  }

//createObjectMenu("characterEffect")
