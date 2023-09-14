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
    this.gifUrl = "characterEffects/.gif";
    this.repeat = 1;
    this.opacity=1;
    this.position = "CENTER"
    this.behind = false;
    this.offsetX = 0;
    this.offsetY = 0;
    this.speechBubble = false;
  }
}

class Case {
  constructor() {
    this.kind = "ARGUMENT";
    this.key = "QUEST"
    this.name = "ACTIVE"
    this.params = []
  }
}

class GetRandom {
  constructor() {
    this.resultType = "int"
    this.start = 0
    this.end = 0
  }
}


let objectDict = {
characterEffect : class CharacterEffect {
    constructor(id) {
      this.action = "CREATE";
      this.id = id
      this.windowTarget = "MAP"
      this.target = new Target();
      this.effect = "ANIMATION";
      this.params = new AnimationParams();
    }
  },

  case : class Case {
      constructor() {
        this.kind = "ARGUMENT";
        this.key = "QUEST"
        this.name = "ACTIVE"
        this.params = []
    }
  }
}


