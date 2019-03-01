var myCar;
var ctx;
var myObs = [];
var myCoins = [];
var myScore;
var mySpeed;
var skor_skrg = 0;
var minSpeed = -1;
var maxSpeed = 5;
var tabrakSound;
var coinSound;
var driveSound;

function startGame() {
  myCar = new mobil(50, 80, 300, 500, "mobil.png");
  myScore = new text("40px Muli", "white", 500, 50);
  mySpeed = new text("40px Muli", "white", 500, 100);
  tabrakSound = new sound("tabrak.mp3");
  coinSound = new sound("coin.mp3");
  driveSound = new sound("drive.mp3");
  myArea.start();
}

var myArea = {
  canvas: document.createElement("canvas"),
  start: function() {
    this.canvas.width = 800;
    this.canvas.height = 600;
    this.context = this.canvas.getContext("2d");
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.frameNo = 0;
    this.interval = setInterval(updateArea, 5);
    window.addEventListener("keydown", function(e) {
      myArea.key = myArea.key || [];
      myArea.key[e.keyCode] = true;
    });
    window.addEventListener("keyup", function(e) {
      myArea.key[e.keyCode] = false;
    });
  },
  clear: function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
  stop: function() {
    clearInterval(this.interval);
  }
};

function component(width, height, color, x, y) {
  this.width = width;
  this.height = height;
  this.x = x;
  this.y = y;
  this.update = function() {
    ctx = myArea.context;
    ctx.fillStyle = color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  };
}

function koin(width, height, x, y, img_src) {
  this.image = new Image();
  this.image.src = img_src;
  this.width = width;
  this.height = height;
  this.x = x;
  this.y = y;
  this.update = function() {
    ctx = myArea.context;
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  };
}

function mobil(width, height, x, y, img_src) {
  this.image = new Image();
  this.image.src = img_src;
  this.width = width;
  this.height = height;
  this.x = x;
  this.y = y;
  this.speedX = 0;
  this.speedY = 0;
  this.update = function() {
    ctx = myArea.context;
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  };
  this.newPosition = function() {
    if (this.x >= 0) {
      this.x += this.speedX;
    } else if (this.x < 0) {
      this.x = 0;
    }
  };
  this.crashWith = function(otherobject) {
    var myleft = this.x;
    var myright = this.x + this.width;
    var mytop = this.y;
    var mybottom = this.y + this.height;
    var otherleft = otherobject.x;
    var otherright = otherobject.x + otherobject.width;
    var othertop = otherobject.y;
    var otherbottom = otherobject.y + otherobject.height;
    var crash = true;
    if (
      mybottom < othertop ||
      mytop > otherbottom ||
      myright < otherleft ||
      myleft > otherright
    ) {
      crash = false;
    }
    return crash;
  };
}

function text(font, color, x, y) {
  this.font = font;
  this.x = x;
  this.y = y;
  this.update = function() {
    ctx = myArea.context;
    ctx.font = this.font;
    ctx.fillStyle = color;
    ctx.fillText(this.my_text, this.x, this.y);
  };
}

function updateArea() {
  for (i = 0; i < myObs.length; i += 1) {
    if (myCar.crashWith(myObs[i])) {
      skor_skrg -= 10;
      tabrakSound.play();
      myArea.stop();
      return;
    }
  }

  for (i = 0; i < myCoins.length; i += 1) {
    if (myCar.crashWith(myCoins[i])) {
      skor_skrg += 1000;
      coinSound.play()
      myCoins[i] = new koin(0, 0, 8000, 8000, "dolar.png");
    }
  }

  myArea.clear();
  myCar.speedX = 0;
  if (myArea.key && myArea.key[37]) {
    myCar.speedX = -1;
  }
  if (myArea.key && myArea.key[39]) {
    myCar.speedX = 1;
  }
  if (myArea.key && myArea.key[38]) {
    if (myCar.speedY < 0) {
      myCar.speedY = 0;
    } else {
      if (myCar.speedY < maxSpeed) {
        myCar.speedY += 0.01;
      }
    }
  } else {
    if (myCar.speedY > 0) {
      myCar.speedY -= 0.005;
    } else {
      myCar.speedY = 0;
    }
  }
  if (myArea.key && myArea.key[40]) {
    if (myCar.speedY > 0) {
      myCar.speedY = 0;
    } else {
      if (myCar.speedY > minSpeed) {
        myCar.speedY -= 0.01;
      }
    }
  }
  if (myArea.key && myArea.key[33]) {
    if (myCar.speedY > 0.02) {
      myCar.speedY -= 0.02;
    } else if (myCar.speedY < -0.02) {
      myCar.speedY += 0.02;
    } else {
      myCar.speedY = 0;
    }
  }
  myArea.frameNo += 1;
  if (myArea.frameNo == 1 || (everyinterval(80) && myCar.speedY != 0)) {
    x = myArea.canvas.width;
    minwidth = 100;
    maxwidth = 300;
    width = Math.floor(Math.random() * (maxwidth - minwidth + 1) + minwidth);
    if (myCar.speedY > 1) {
      height = 120 * myCar.speedY;
    } else {
      height = 100;
    }
    if (myCar.speedY > 0) {
        driveSound.play()
    }    
    minGap = 230;
    maxGap = 300;
    gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);
    myObs.push(new koin(width, height, 0, 0, "brick.png"));
    myObs.push(new koin(x - width - gap, height, width + gap, 0, "brick.png"));
    coin_loc = Math.floor(Math.random() * gap);
    myCoins.push(new koin(30, 30, width + coin_loc, 80, "dolar.png"));
  }

  for (i = 0; i < myObs.length; i += 1) {
    myObs[i].y += myCar.speedY;
    myObs[i].update();
  }
  for (i = 0; i < myCoins.length; i += 1) {
    myCoins[i].y += myCar.speedY;
    myCoins[i].update();
  }
  myScore.my_text = "SCORE: " + skor_skrg;
  myScore.update();
  mySpeed.my_text = "SPEED: " + Math.round(myCar.speedY* 100) / 100;
  mySpeed.update();
  myCar.newPosition();
  myCar.update();
}

function everyinterval(n) {
  if ((myArea.frameNo / n) % 1 == 0) {
    return true;
  }
  return false;
}

function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function () {
        this.sound.play();
    }
    this.stop = function () {
        this.sound.pause();
    }
}
