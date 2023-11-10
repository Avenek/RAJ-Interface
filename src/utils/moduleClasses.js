let moduleDict = {
  areaTrigger : class AreaTrigger{
    constructor(id){
      this.action = "CREATE"
      this.id = id
      this.kind = "ON_IN"
      this.x = 0
      this.y = 0
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
  
  callInstantBehaviorFakeNpc : class CallInstantBehaviorFakeNpc{
    constructor(id) {
    this.id = id
    this.repeat = 1
    this.list = [new moduleDict["fakeNpcBehavior"]()]
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

  case : class Case {
    constructor() {
      this.kind = "ARGUMENT";
      this.key = "QUEST"
      this.name = "ACTIVE"
      this.params = []
    }
  },

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
  
  characterHide : class CharacterHide{
    constructor() {
      this.action = "CREATE"
      this.kind = "HERO"
      this.showTip = false
    }
  },

  color : class color{
    constructor() {
      this.r = 0
      this.g = 0
      this.b = 0
      this.a = 1
    }
  },

  dialogue : class Dialogue{
    constructor(){
      this.action = "UPDATE"
      this.header = {"text": ""}
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

  earthQuake : class EarthQuake{
    constructor(){
      this.duration = 0.1
      this.quantity = 5
      this.frequency = 0.7
      this.power = 10
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

  extraLightMaster : class ExtraLightMaster{
    constructor(){
      this.kind = "THIS_NPC_INSTANCE"
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
  
  fakeNpcBehavior: class FakeNpcBehavior{
    constructor(){
      this.name = "WALK"
      this.x = 0
      this.y = 0
    }
  },

  fakeNpcRandomFirstIndex : class RandomFirstIndex {
    constructor(){
      this.randomFirstIndex = { "forActions": []}
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

  floatObjectRandomFirstIndex : class RandomFirstIndex {
    constructor(){
      this.randomFirstIndex = { "forActions": []}
    }
  },

  getCharacterData : class GetCharacterData {
    constructor(path)
    {
      this.getCharacterData = {
       "kind" : "HERO",
        "toGet" : path,
        "modify" : 0,
        "rotation" : {"x":0, "y":0}
      }
    }
  },

  getRandom : class GetRandom {
    constructor() {
      this.resultType = "int"
      this.start = 0
      this.end = 1
    }
  },

  light : class Light{
    constructor(){
      this.onlyNight = true,
      this.r = 20
      this.color = new Color()
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

  mapMusic: class MapMusic{
    constructor(id){
      this.action = "CREATE"
      this.id = id
      this.file = "burza01.mp3"
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

  sound : class Sound{
    constructor(id){
      this.action = "CREATE"
      this.id = id
      this.url = "burza01.mp3"
    }
  },

  source : class Source{
    constructor(){
      this.x = 0
      this.y = 0
      this.range = 5
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

  yellowMessage : class YellowMessage{
    constructor(){
      this.action = "CREATE"
      this.text = ""
    }
  },

  zoom : class Zoom{
    constructor(){
      this.action = "CREATE"
      this.duration = true
      this.zoom = 2
      this.speed = 2
    }
  }
  
}
