class CharacterEffect {
  constructor(id) {
    this.action = "CREATE_IF_NOT_EXIST";
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

class FakeNpc {
  constructor(id) {
    this.action = "CREATE_IF_NOT_EXIST";
    this.id = id
    this.x = 0
    this.y = 0
    this.img = "/npc/test.gif"
    this.behavior = new Behavior();
  }
}

class FakeNpcBehavior{
  constructor(){
    this.name = "IDLE"
    this.duration = 5
    this.dir = "S"
  }
}

class Behavior {
  constructor() {
    this.repeat = 1
    this.list = [new(FakeNpcBehavior)]
  }
}

class CallInstantBehaviorFakeNpc{
  constructor(id) {
  this.id = id
  this.repeat = 1
  this.list = [new(FakeNpcBehavior)]
  }
}

class CharacterHide{
  constructor() {
    this.action = "CREATE"
    this.kind = "HERO"
    this.showTip = false
    }
}

class EmoDefinitions{
  constructor() {
    this.name = "obiekt-0"
    this.priority = 90
    this.params = new EmoDefinitionsParams()
    }
}

class EmoDefinitionsParams{
  constructor(){
    this.action = "onSelf"
    this.filename = "battle.gif"
  }
}

class EmoActions{
  constructor(){
    this.action = "CREATE"
    this.name = "obiekt-0"
    this.target = new NpcTarget()
  }
}

class NpcTarget {
  constructor() {
    this.kind = "NPC"
    this.id = 0
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
    this.end = 1
  }
}






let objectDict = {
  characterEffect : class CharacterEffect {
      constructor(id) {
        this.action = "CREATE_IF_NOT_EXIST";
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
    },

    fakeNpc: class FakeNpc {
      constructor(id) {
        this.action = "CREATE_IF_NOT_EXIST";
        this.id = id
        this.x = 0
        this.y = 0
        this.img = "/npc/test.gif"
        this.behavior = new Behavior();
      }
    },
    
    behavior: class Behavior {
      constructor() {
        this.repeat = 1
        this.list = []
      }
    },
  
  fakeNpcBehavior: class FakeNpcBehavior{
    constructor(){
      this.name = "WALK"
      this.x = 0
      this.y = 0
    }
  },

  callInstantBehaviorFakeNpc : class CallInstantBehaviorFakeNpc{
    constructor(id) {
    this.id = id
    this.repeat = 1
    this.list = [new(FakeNpcBehavior)]
    }
  },

  characterHide : class CharacterHide{
    constructor() {
      this.action = "CREATE"
      this.kind = "HERO"
      this.showTip = false
    }
  },

  emoDefinitions : class EmoDefinitions{
    constructor() {
      this.name = "obiekt-0"
      this.priority = 90
      this.params = new EmoDefinitionsParams()
    }
  },

  emoActions : class EmoActions{
    constructor(){
      this.action = "CREATE"
      this.name = "obiekt-0"
      this.target = new NpcTarget()
    }
  }
}
