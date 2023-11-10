

class Case {
  constructor() {
    this.kind = "ARGUMENT";
    this.key = "QUEST"
    this.name = "ACTIVE"
    this.params = []
  }
}

class Light{
  constructor(){
    this.onlyNight = true,
    this.r = 20
    this.color = new Color()
  }
}

class ExtraLightMaster{
  constructor(){
    this.kind = "THIS_NPC_INSTANCE"
  }
}


class Source{
  constructor(){
    this.x = 0
    this.y = 0
    this.range = 5
  }
}

let moduleDict = {
  characterEffect : class CharacterEffect {
      constructor(id) {
        this.action = "CREATE_IF_NOT_EXIST";
        this.id = id
        this.windowTarget = "MAP"
        this.target = {"kind" : "HERO"}
        this.effect = "ANIMATION";
        this.params = {
          "gifUrl" : "characterEffects/.gif",
          "position" : "CENTER"
        }
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
        this.behavior = {
          "list" : [new moduleDict["fakeNpcBehavior"]()]
        }
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
    this.list = [new moduleDict["fakeNpcBehavior"]()]
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
      this.params = {
        "action" : "onSelf",
        "filename" : "battle.gif"
      }
    }
  },

  emoActions : class EmoActions{
    constructor(){
      this.action = "CREATE"
      this.name = "obiekt-0"
      this.target = {
        "kind" : "NPC",
        "id" : 0
      }
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
      this.d = {
       "x" : 0,
       "y" : 0
      }
    }
  },

  dynamicLight : class DynamicLight{
    constructor (id) {
      this.action = "CREATE"
      this.id = id
      this.master = {
        "kind" : "HERO"
      }
      this.d = {
        "r" : 100
      }
    }
  },

  behaviorDynamicLight : class BehaviorDynamicLight{
    constructor(id) {
      this.action = "CREATE"
      this.id = id
      this.d = {
        "x" : 0,
        "y" : 0,
        "behavior" : {
          "list" : [new moduleDict["behaviorDynamicLightBehavior"]()]
        }
      }
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
      this.target = {
        "kind" : "MAP",
        "x" : 0,
        "y" : 0
      }
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
      this.behavior = {
        "list" : [new moduleDict["floatObjectBehavior"]()]
      }
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
      this.behavior = {
        "list" : [new moduleDict["sequenceBehavior"]()]
      }
    }
  },
  
  sequenceBehavior : class SequenceBehavior{
    constructor(){
    }
  },

  mapFilter : class MapFilter{
    constructor(){
      this.color = {
        "r" : 0,
        "g" : 0,
        "b" : 0,
        "a" : 1
      }
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
  },

  getCharacterData : class GetCharacterData {
    constructor(path)
    {
      this.kind = "HERO"
      this.toGet = path
      this.modify = 0
      this. rotation = {"x":0, "y":0}
    }
  },
  
  getRandom : class GetRandom {
    constructor() {
      this.resultType = "int"
      this.start = 0
      this.end = 1
    }
  }
}
