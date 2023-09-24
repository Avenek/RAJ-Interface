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
    this.behavior = new BehaviorFakeNpc();
  }
}

class FakeNpcBehavior{
  constructor(){
    this.name = "IDLE"
    this.duration = 5
    this.dir = "S"
  }
}

class BehaviorFakeNpc {
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

class Weather{
  constructor(){
    this.action = "CREATE"
    this.name = "Rain"
    this.speedX = 1
    this.speedY = 1
  }
}

class EarthQuake{
  constructor(){
    this.duration = 0.1
    this.quantity = 5
    this.frequency = 0.7
    this.power = 10
  }
}

class ExtraLight{
  constructor(id){
    this.action = "CREATE"
    this.id = id
    this.d = new ExtraLightData()
  }
}

class ExtraLightData{
  constructor(){
    this.x = 0
    this.y = 0
    this.r = 30
    this.offsetX = 0
    this.offsetY = 0
    this.gradientPercent1 = 40
    this.gradientPercent2 = 40
  }
}

class DynamicLight{
  constructor (id) {
    this.action = "CREATE"
    this.id = id
    this.master = new DynamicLightMaster()
    this.d = new DynamicLightData()
  }
}

class DynamicLightData{
  constructor(){
    this.r = 100
    this.offsetX = 0
    this.offsetY = 0
    this.gradientPercent1 = 40
    this.gradientPercent2 = 40
  }
}

class BehaviorDynamicLight{
  constructor(id) {
    this.action = "CREATE"
    this.id = id
    this.d = new ExtraLightData()
  }
}

class BehaviorDynamicLightData{
  constructor(id) {
    this.x = 0
    this.y = 0
    this.r = 30
    this.offsetX = 0
    this.offsetY = 0
    this.gradientPercent1 = 40
    this.gradientPercent2 = 40
    this.behavior = new BehaviorLight();
  }
}

class BehaviorLight {
  constructor() {
    this.repeat = 1
    this.list = [new BehaviorDynamicLightBehavior()]
  }
}

class BehaviorDynamicLightBehavior{
  constructor(){
    this.name = "IDLE"
    this.duration = 5
  }
}

class Camera{
  constructor(){
    this.duration = 0
    this.target = new CameraTarget()
  }
}

class CameraTarget{
  constructor(){
    this.kind = "MAP"
    this.x = 0
    this.y = 0
  }
}

class Zoom{
  constructor(){
    this.action = "CREATE"
    this.duration = true
    this.zoom = 2
    this.speed = 2
  }
}

class FloatForeground{
  constructor(id) {
    this.action = "CREATE"
    this.id = id
    this.xVector = 0.2
    this.yVector = -0.1
    this.url = "chmury/mgla1.png"
  }
}

class FloatObject{
  constructor(id){
    this.action="CREATE_IF_NOT_EXIST"
    this.id = id
    this.x = 0
    this.y = 0
    this.url = "chmury/obj1.png"
    this.behavior = new BehaviorFloatObject();
  }
}

class BehaviorFloatObject {
  constructor() {
    this.repeat = 1
    this.list = [new(FloatObjectBehavior)]
  }
}

class FloatObjectBehavior{
  constructor(){
    this.name = "IDLE"
    this.duration = 5
  }
}

class Sound{
  constructor(id){
    this.action = "CREATE"
    this.id = id
    this.url = "burza01.mp3"
  }
}

class MapMusic{
  constructor(id){
    this.action = "CREATE"
    this.id = id
    this.file = "burza01.mp3"
  }
}

class Dialogue{
  constructor(){
    this.action = "UPDATE"
    this.header = {"text": ""}
  }
}

class YellowMessage{
  constructor(){
    this.action = "CREATE"
    this.text = ""
  }
}

class Sequence{
  constructor(id){
    this.action = "CREATE_IF_NOT_EXIST"
    this.id = id
    this.behavior = new BehaviorSequence();
  }
}

class BehaviorSequence {
  constructor() {
    this.repeat = 1
    this.list = [new(SequenceBehavior)]
  }
}

class SequenceBehavior{
  constructor(){
  }
}

class MapFilter{
  constructor(){
    this.color = new Color()
  }
}

class AreaTrigger{
  constructor(id){
    this.action = "CREATE"
    this.id = id
    this.kind = "ON_IN"
    this.x = 0
    this.y = 0
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

class GetCharacterData {
  constructor(path) {
    this.kind = "HERO"
    this.toGet = path
    this.modify = 0
    this. rotation = {"x":0, "y":0}
  }
}

class Light{
  constructor(){
    this.onlyNight = true,
    this.r = 20
    this.color = new Color()
  }
}

class Color{
  constructor() {
    this.r = 0
    this.g = 0
    this.b = 0
    this.a = 1
  }
}

class ExtraLightMaster{
  constructor(){
    this.kind = "THIS_NPC_INSTANCE"
  }
}

class DynamicLightMaster{
  constructor(){
    this.kind = "HERO"
  }
}

class Source{
  constructor(){
    this.x = 0
    this.y = 0
    this.range = 5
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
        this.behavior = new BehaviorFakeNpc();
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
  },

  weather : class Weather{
    constructor(){
      this.action = "CREATE"
      this.name = "Rain"
      this.speedX = 1
      this.speedY = 1
    }
  },

  earthQuake : class EarthQuake{
    constructor(){
      this.duration = 0.1
      this.quantity = 5
      this.frequency = 0.7
      this.power = 10
    }
  },

  extraLight : class ExtraLight{
    constructor(id){
      this.action = "CREATE"
      this.id = id
      this.d = new ExtraLightData()
    }
  },

  dynamicLight : class DynamicLight{
    constructor (id) {
      this.action = "CREATE"
      this.id = id
      this.master = new DynamicLightMaster()
      this.d = new DynamicLightData()
    }
  },

  behaviorDynamicLight : class BehaviorDynamicLight{
    constructor(id) {
      this.action = "CREATE"
      this.id = id
      this.d = new BehaviorDynamicLightData()
    }
  },

  behaviorDynamicLightBehavior : class BehaviorDynamicLightBehavior{
    constructor(){
      this.name = "IDLE"
      this.duration = 5
    }
  },

  camera : class Camera{
    constructor(){
      this.duration = 0
      this.target = new CameraTarget()
    }
  },

  zoom : class Zoom{
    constructor(){
      this.action = "CREATE"
      this.duration = true
      this.zoom = 2
      this.speed = 2
    }
  },

  floatForeground : class FloatForeground{
    constructor(id) {
      this.action = "CREATE"
      this.id = id
      this.xVector = 0.2
      this.yVector = -0.1
      this.url = "chmury/mgla1.png"
    }
  },

  floatObject : class FloatObject{
    constructor(id){
      this.action="CREATE_IF_NOT_EXIST"
      this.id = id
      this.x = 0
      this.y = 0
      this.url = "chmury/obj1.png"
      this.behavior = new BehaviorFloatObject();
    }
  },
  
  floatObjectBehavior : class FloatObjectBehavior{
    constructor(){
      this.name = "IDLE"
      this.duration = 5
    }
  },

  sound : class Sound{
    constructor(id){
      this.action = "CREATE"
      this.id = id
      this.url = "burza01.mp3"
    }
  },

  mapMusic: class MapMusic{
    constructor(id){
      this.action = "CREATE"
      this.id = id
      this.file = "burza01.mp3"
    }
  },

  dialogue : class Dialogue{
    constructor(){
      this.action = "UPDATE"
      this.header = {"text": ""}
    }
  },

  yellowMessage : class YellowMessage{
    constructor(){
      this.action = "CREATE"
      this.text = ""
    }
  },

  sequence : class Sequence{
    constructor(id){
      this.action = "CREATE_IF_NOT_EXIST"
      this.id = id
      this.behavior = new BehaviorSequence();
    }
  },
  
  sequenceBehavior : class SequenceBehavior{
    constructor(){
    }
  },

  mapFilter : class MapFilter{
    constructor(){
      this.color = new Color()
    }
  },

  areaTrigger : class AreaTrigger{
    constructor(id){
      this.action = "CREATE"
      this.id = id
      this.kind = "ON_IN"
      this.x = 0
      this.y = 0
    }
  }
  
}
