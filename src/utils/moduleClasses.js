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

  battleEvents : class battleEvents{
    constructor(id){
      this.action = "CREATE",
      this.id = id,
      this.name = "ON_DIE_NPC",
      this.npcId = 0
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

  caseContainer : class Case {
    constructor() {
      this.kind = "ARGUMENT";
      this.key = "QUEST"
      this.name = "ACTIVE"
      this.params = []
    }
  },

  characterEffect : class CharacterEffect {
      constructor(id) {
        this.action = "CREATE";
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
      this.target = {
        "kind" : "HERO"
      }
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
      this.header = {"text": ""}
    }
  },

  dynamicDirCharacterLight : class DynamicDirCharacterLight{
    constructor (id) {
      this.action = "CREATE"
      this.id = id
      this.master = {
        "kind" : "HERO"
      }
      this.d = {
        "base": {"r":50}
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
      this.action = "CREATE";
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
      this.forActions = []
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
      this.action="CREATE"
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
    }
  },

  floatObjectRandomFirstIndex : class RandomFirstIndex {
    constructor(){
      this.forActions = []
    }
  },

  getCharacterData : class GetCharacterData {
    constructor(path)
    {
      this.kind = "HERO",
      this.toGet = path,
      this.modify = 0,
      this.rotation = {"x":0, "y":0}
    }
  },

  getNpcId : class GetNpcId {
    constructor()
    {
      this.kind = "THIS_NPC_INSTANCE",
      this.toGet = "id"
    }
  },

  getRandom : class GetRandom {
    constructor() 
    {
      this.resultType = "int"
      this.start = 0
      this.end = 1
    }
  },

  interfaceSkin : class InterfaceSkin {
    constructor()
    {
      this.name = "grayscale"
    }
  },

  light : class Light{
    constructor(){
      this.onlyNight = true,
      this.r = 20
      this.color = new moduleDict["color"]()
    }
  },

  mapEvents : class mapEvents{
    constructor(id){
      this.action = "CREATE",
      this.id = id,
      this.name = "ON_DIE_NPC",
      this.npcId = 0
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

  mapMusic : class MapMusic{
    constructor(id){
      this.action = "CREATE"
      this.id = id
      this.file = "burza01.mp3"
    }
  },

  moveNoise : class MoveNoise{
    constructor(){
      this.x = 0
      this.y = 0
    }
  },

  parent : class Parent{
    constructor(){
    }
  },

  options : class Options{
    constructor(){
    }
  },

  randomCaller : class RandomCaller{
    constructor(){
      this.options = []
    }
  },

  screenEffects : class ScreenEffects {
    constructor(id) {
      this.action = "CREATE";
      this.id = id
      this.behavior = {
        "list" : [new moduleDict["screenEffectsBehavior"]()]
      }
    }
  },

  screenEffectsBehavior: class ScreenEffectsBehavior{
    constructor(){
      this.mode = "static",
      this.data = {
        "color": {
          "r": 0,
          "g": 0,
          "b": 0,
          "a": 1
        }
      }
    }
  },

  sequence : class Sequence{
    constructor(id){
      this.action = "CREATE"
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

  transitionHoles : class TransitionHoles{
    constructor(){
      this.hole0 = {
        "x": 0,
        "y": 0
      },
      this.hole1 = {
        "x": 0,
        "y": 0
      }
    }
  },

  target : class Target{
    constructor(id){
      this.id = id
      this.name = "",
      this.x = 0,
      this.y = 0
    }
  },

  tracking : class Tracking{
    constructor(){
      this.parent = {"kind": "HERO"}
      this.target = {"list":[ 
        {
          "id": "obiekt-0",
        "name": "",
        "x": 0,
        "y": 0
      }
    ]}
    }
  },

  staticHoles : class StaticHoles{
    constructor(){
      this.x = 0,
      this.y = 0
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
      this.duration = true
      this.zoom = 2
      this.speed = 2
    }
  }
  
}
