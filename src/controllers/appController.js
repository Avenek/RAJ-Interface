class AppController {
    constructor(appView, appModel) {
      this.view = appView
      this.model = appModel
      this.home = new HomeController(this.view.home, this.model.home)
      this.externalPropertiesButton = new ExternalPropertiesButtonController(this.view.externalPropertiesButton, this.model.externalPropertiesButton, this)
      this.view.bindClickModule(this.handleClickModule)
    }

    handleClickModule = (module, id = 0) => {
      try{
        JSON.parse(JSON.stringify(this.model.jsonData.displayData))
        this.view.form = new FormView()
        this.model.jsonData.setParams("module", module, module, id, "out", "module")
        this.model.form = new FormModel(this.model.jsonData, this.externalPropertiesButton.model)
        this.form = new FormController(this.view.form, this.model.form, this)
        this.externalPropertiesButton.displayButton(this.model.externalPropertiesButton.isExternalPropertiesActive)
        this.externalPropertiesButton.view.bindClickExternalPropertiesButton(this.externalPropertiesButton.handleClickExternalPropertiesButton)
        this.model.form.moduleObjectFormModel.fetchConfigAndCreateObjectFormList()
        this.model.form.moduleObjectIdBoxModel.createObjectIdList()
        this.form.view.headerPanelView.bindClickHome(this.handleClickHome)
      }
      catch (e) {
        console.log(e);
      }
  }

  handleClickHome = () => {
    this.view.home.render()
    this.model.home.dataObjectsBoxModel.createDataObjectsList()
    this.view.home.dataObjectsBoxView.displayDataObjects(this.model.home.dataObjectsBoxModel.dataObjectsList)
    this.view.home.modulesBoxView.displayModulesBox(this.model.home.modulesBoxModel.modulesList)
    this.view.home.jsonDataBoxView.displayJsonDataBox(this.home.jsonDataBox.model.jsonData, this.home.jsonDataBox.model.isBeautified, this.home.jsonDataBox.model.errorMode, this.externalPropertiesButton.isExternalPropertiesActive)
    this.model.jsonData.objectsParams = []
    this.home = new HomeController(this.view.home, this.model.home)
    this.externalPropertiesButton.displayButton(this.model.externalPropertiesButton.isExternalPropertiesActive)
    this.externalPropertiesButton.view.bindClickExternalPropertiesButton(this.externalPropertiesButton.handleClickExternalPropertiesButton)
    this.view.bindClickModule(this.handleClickModule)
  }

}
//localStorage.clear()
/*if(localStorage.getItem("lastClear") !== "0"){
  localStorage.clear()
  localStorage.setItem("lastClear", "0")
}*/

  /*if(localStorage.getItem("containerConfig") && localStorage.getItem("lastClear") !== "1"){
    const toAdd =  JSON.parse(localStorage.getItem("containerConfig"))
    const randomCaller = {
      "name": "RandomCaller",
      "tipInfo": "Umożliwia wywołanie losowego Sraja. W options podajemy możliwe sraje do wyboru."
    }
    toAdd.containers[0].modules.push(JSON.parse(JSON.stringify(randomCaller)))
    localStorage.setItem("containerConfig", JSON.stringify(toAdd))
    localStorage.setItem("lastClear", "1")
  }*/

  window.requestAnimationFrame =
  window.__requestAnimationFrame ||
      window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      (function () {
          return function (callback, element) {
              var lastTime = element.__lastTime;
              if (lastTime === undefined) {
                  lastTime = 0;
              }
              var currTime = Date.now();
              var timeToCall = Math.max(1, 33 - (currTime - lastTime));
              window.setTimeout(callback, timeToCall);
              element.__lastTime = currTime + timeToCall;
          };
      })();
window.isDevice = (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(((navigator.userAgent || navigator.vendor || window.opera)).toLowerCase()));
var loaded = false;
var init = function () {
  if (loaded) return;
  loaded = true;
  var mobile = window.isDevice;
  var koef = mobile ? 0.5 : 1;
  var canvas = document.getElementById('heart');
  var ctx = canvas.getContext('2d');
  var width = canvas.width = koef * innerWidth;
  var height = canvas.height = koef * innerHeight;
  var rand = Math.random;
  ctx.fillStyle = "rgba(0,0,0,1)";
  ctx.fillRect(0, 0, width, height);

  var heartPosition = function (rad) {
      //return [Math.sin(rad), Math.cos(rad)];
      return [Math.pow(Math.sin(rad), 3), -(15 * Math.cos(rad) - 5 * Math.cos(2 * rad) - 2 * Math.cos(3 * rad) - Math.cos(4 * rad))];
  };
  var scaleAndTranslate = function (pos, sx, sy, dx, dy) {
      return [dx + pos[0] * sx, dy + pos[1] * sy];
  };

  window.addEventListener('resize', function () {
      width = canvas.width = koef * innerWidth;
      height = canvas.height = koef * innerHeight;
      ctx.fillStyle = "rgba(0,0,0,1)";
      ctx.fillRect(0, 0, width, height);
  });

  var traceCount = mobile ? 20 : 50;
  var pointsOrigin = [];
  var i;
  var dr = mobile ? 0.3 : 0.1;
  for (i = 0; i < Math.PI * 2; i += dr) pointsOrigin.push(scaleAndTranslate(heartPosition(i), 210, 13, 0, 0));
  for (i = 0; i < Math.PI * 2; i += dr) pointsOrigin.push(scaleAndTranslate(heartPosition(i), 150, 9, 0, 0));
  for (i = 0; i < Math.PI * 2; i += dr) pointsOrigin.push(scaleAndTranslate(heartPosition(i), 90, 5, 0, 0));
  var heartPointsCount = pointsOrigin.length;

  var targetPoints = [];
  var pulse = function (kx, ky) {
      for (i = 0; i < pointsOrigin.length; i++) {
          targetPoints[i] = [];
          targetPoints[i][0] = kx * pointsOrigin[i][0] + width / 2;
          targetPoints[i][1] = ky * pointsOrigin[i][1] + height / 2;
      }
  };

  var e = [];
  for (i = 0; i < heartPointsCount; i++) {
      var x = rand() * width;
      var y = rand() * height;
      e[i] = {
          vx: 0,
          vy: 0,
          R: 2,
          speed: rand() + 5,
          q: ~~(rand() * heartPointsCount),
          D: 2 * (i % 2) - 1,
          force: 0.2 * rand() + 0.7,
          f: "hsla(0," + ~~(40 * rand() + 60) + "%," + ~~(60 * rand() + 20) + "%,.3)",
          trace: []
      };
      for (var k = 0; k < traceCount; k++) e[i].trace[k] = {x: x, y: y};
  }

  var config = {
      traceK: 0.4,
      timeDelta: 0.01
  };

  var time = 0;
  var loop = function () {
      var n = -Math.cos(time);
      pulse((1 + n) * .5, (1 + n) * .5);
      time += ((Math.sin(time)) < 0 ? 9 : (n > 0.8) ? .2 : 1) * config.timeDelta;
      ctx.fillStyle = "rgba(0,0,0,.1)";
      ctx.fillRect(0, 0, width, height);
      for (i = e.length; i--;) {
          var u = e[i];
          var q = targetPoints[u.q];
          var dx = u.trace[0].x - q[0];
          var dy = u.trace[0].y - q[1];
          var length = Math.sqrt(dx * dx + dy * dy);
          if (10 > length) {
              if (0.95 < rand()) {
                  u.q = ~~(rand() * heartPointsCount);
              }
              else {
                  if (0.99 < rand()) {
                      u.D *= -1;
                  }
                  u.q += u.D;
                  u.q %= heartPointsCount;
                  if (0 > u.q) {
                      u.q += heartPointsCount;
                  }
              }
          }
          u.vx += -dx / length * u.speed;
          u.vy += -dy / length * u.speed;
          u.trace[0].x += u.vx;
          u.trace[0].y += u.vy;
          u.vx *= u.force;
          u.vy *= u.force;
          for (k = 0; k < u.trace.length - 1;) {
              var T = u.trace[k];
              var N = u.trace[++k];
              N.x -= config.traceK * (N.x - T.x);
              N.y -= config.traceK * (N.y - T.y);
          }
          ctx.fillStyle = u.f;
          for (k = 0; k < u.trace.length; k++) {
              ctx.fillRect(u.trace[k].x, u.trace[k].y, 1, 1);
          }
      }
      ctx.fillStyle = "rgba(255,255,255,1)";
      for (i = u.trace.length; i--;) ctx.fillRect(targetPoints[i][0], targetPoints[i][1], 2, 2);

      window.requestAnimationFrame(loop, canvas);
  };
  loop();
};

var s = document.readyState;
if (s === 'complete' || s === 'loaded' || s === 'interactive') init();
else document.addEventListener('DOMContentLoaded', init, false);

setTimeout(function(){
  const app = new AppController(new AppView(), new AppModel())
}, 10800)

  function pop (e) {
    let amount = 30;
    if (e.clientX === 0 && e.clientY === 0) {
      const bbox = e.target.getBoundingClientRect();
      const x = bbox.left + bbox.width / 2;
      const y = bbox.top + bbox.height / 2;
      for (let i = 0; i < 30; i++) {
        createParticle(x, y, e.target.dataset.type);
      }
    } else {
      for (let i = 0; i < amount; i++) {
        createParticle(e.clientX, e.clientY + window.scrollY, "emoji");
      }
    }
  }

  function createParticle (x, y, type) {
    const particle = document.createElement('particle');
    document.body.appendChild(particle);
    let width = Math.floor(Math.random() * 30 + 8);
    let height = width;
    let destinationX = (Math.random() - 0.5) * 300;
    let destinationY = (Math.random() - 0.5) * 300;
    let rotation = Math.random() * 520;
    let delay = Math.random() * 200;
    
    switch (type) {
      case 'emoji':
        particle.innerHTML = ['❤','🧡','💛','💚','💙','💜','🤎'][Math.floor(Math.random() * 7)];
        `${Math.random() * 24 + 10}px`;
        width = height = 'auto';
        break;
}

particle.style.width = `${width}px`;
particle.style.height = `${height}px`;
const animation = particle.animate([
{
  transform: `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(0deg)`,
  opacity: 1
},
{
  transform: `translate(-50%, -50%) translate(${x + destinationX}px, ${y + destinationY}px) rotate(${rotation}deg)`,
  opacity: 0
}
], {
duration: Math.random() * 1000 + 5000,
easing: 'cubic-bezier(0, .9, .57, 1)',
delay: delay
});
animation.onfinish = removeParticle;
}

function removeParticle (e) {
e.srcElement.effect.target.remove();
}

  document.addEventListener('mousedown', pop)
