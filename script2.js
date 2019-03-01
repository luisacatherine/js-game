var cartOne;
var cartTwo;
var ctx;
var myRocks = [];
var myCoins = [];
var myPrize = [];
var myScore;
var mySpeed;
var score1 = 0;
var score2 = 0;
var speedYY = 0;
var minSpeed = 1;
var maxSpeed = 5;
var coinSound;
var wowSound;
var ohnoSound;

function startGame() {
  cartOne = new input_gambar(60, 60, 300, 500, "cart-biru.png");
  cartTwo = new input_gambar(60, 60, 400, 500, "cart-pink.png");
  myScore = new text("40px Muli", "#22438A", 150, 100);
  mySpeed = new text("20px Muli", "black", 350, 100);
  yourScore = new text("40px Muli", "#BE2B71", 550, 100);
  coinSound = new sound("coin.mp3");
  wowSound = new sound("wow.mp3");
  ohnoSound = new sound("ohno.mp3");
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

function input_gambar(width, height, x, y, img_src) {
  this.image = new Image();
  this.image.src = img_src;
  this.width = width;
  this.height = height;
  this.x = x;
  this.y = y;
  this.speedX = 0;
  this.update = function() {
    ctx = myArea.context;
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  };
  this.newPosition = function(x_min, x_max) {
    if (this.x >= x_min) {
      this.x += this.speedX;
    } else if (this.x < x_min) {
      this.x = x_min;
    }
    if (this.x <= x_max) {
      this.x += this.speedX;
    } else if (this.x > x_max) {
      this.x = x_max;
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
  for (i = 0; i < myRocks.length; i += 1) {
    if (cartOne.crashWith(myRocks[i])) {
      score1 -= 2000;
      ohnoSound.play()
      myRocks[i] = new input_gambar(0, 0, 8000, 8000, "brick.png");
    }
    if (cartTwo.crashWith(myRocks[i])) {
      score2 -= 2000;
      ohnoSound.play()
      myRocks[i] = new input_gambar(0, 0, 8000, 8000, "brick.png");
    }
  }

  for (i = 0; i < myCoins.length; i += 1) {
    if (cartOne.crashWith(myCoins[i])) {
      score1 += 1000;
      coinSound.play()
      myCoins[i] = new input_gambar(0, 0, 8000, 8000, "dolar.png");
    }
    if (cartTwo.crashWith(myCoins[i])) {
      score2 += 1000;
      coinSound.play()
      myCoins[i] = new input_gambar(0, 0, 8000, 8000, "dolar.png");
    }
  }

  for (i = 0; i < myPrize.length; i += 1) {
    if (cartOne.crashWith(myPrize[i])) {
      score1 += 10000;
      wowSound.play()
      myPrize[i] = new input_gambar(0, 0, 8000, 8000, "gift.png");
    }
    if (cartTwo.crashWith(myPrize[i])) {
      score2 += 10000;
      wowSound.play()
      myPrize[i] = new input_gambar(0, 0, 8000, 8000, "gift.png");
    }
  }

  myArea.clear();
  cartOne.speedX = 0;
  cartTwo.speedX = 0;
  if (myArea.key && myArea.key[37]) {
    cartTwo.speedX = -1;
  }
  if (myArea.key && myArea.key[65]) {
    cartOne.speedX = -1;
  }
  if (myArea.key && myArea.key[39]) {
    cartTwo.speedX = 1;
  }
  if (myArea.key && myArea.key[68]) {
    cartOne.speedX = 1;
  }
  if ((myArea.key && myArea.key[38]) || (myArea.key && myArea.key[87])) {
    if (speedYY < minSpeed) {
      speedYY = minSpeed;
    } else {
      if (speedYY < maxSpeed) {
        speedYY += 0.01;
      }
    }
  } else {
    if (speedYY > minSpeed) {
      speedYY -= 0.005;
    } else {
      speedYY = minSpeed;
    }
  }
  if ((myArea.key && myArea.key[40]) || (myArea.key && myArea.key[83])) {
    if (speedYY > minSpeed) {
      speedYY -= 0.02;
    } else if (speedYY < -0.02) {
      speedYY += 0.02;
    } else {
      speedYY = minSpeed;
    }
  }
  myArea.frameNo += 1;
  var interval_waktu = Math.floor(200 / speedYY);
  if (myArea.frameNo == 1 || (everyinterval(interval_waktu) && speedYY != 0)) {
    coin_loc = Math.floor(Math.random() * (myArea.canvas.width - 30));
    myCoins.push(new input_gambar(30, 30, coin_loc, 0, "dolar.png"));
    rock_loc = Math.floor(Math.random() * (myArea.canvas.width - 30));
    myRocks.push(new input_gambar(30, 30, rock_loc, 0, "brick.png"));
  }
  if (myArea.frameNo == 1 || (everyinterval(5000) && speedYY != 0)) {
    prize_loc = Math.floor(Math.random() * (myArea.canvas.width - 30));
    myPrize.push(new input_gambar(30, 30, prize_loc, 0, "gift.png"));
  }
  for (i = 0; i < myRocks.length; i += 1) {
    myRocks[i].y += speedYY;
    myRocks[i].update();
  }
  for (i = 0; i < myCoins.length; i += 1) {
    myCoins[i].y += speedYY;
    myCoins[i].update();
  }
  for (i = 0; i < myPrize.length; i += 1) {
    myPrize[i].y += 2 * speedYY;
    myPrize[i].update();
  }
  myScore.my_text = score1;
  myScore.update();
  yourScore.my_text = score2;
  yourScore.update();
  mySpeed.my_text = "SPEED: " + Math.round(speedYY * 100) / 100;
  mySpeed.update();
  cartOne.newPosition(0, myArea.canvas.width / 2 - 60);
  cartOne.update();
  cartTwo.newPosition(myArea.canvas.width / 2, myArea.canvas.width - 60);
  cartTwo.update();
  ctx = myArea.context;
  ctx.beginPath();
  ctx.moveTo(400, 0);
  ctx.lineTo(400, 800);
  ctx.strokeStyle = "grey";
  ctx.stroke();
  if (score1 >= 30000 || score2 >= 30000) {
    myArea.stop();
    if (score1 > score2) {
      alert("Player 1 menang!");
    } else {
      alert("Player 2 menang!");
    }
  }
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
