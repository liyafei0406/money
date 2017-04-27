
var flappyBird = document.getElementById("flappyBird"); //小鸟
var flappyBirdImg = flappyBird.children[0]; //小鸟图片

var downTimer = null; //定时器声明
var upTimer = null; 
var crashTestTimer = null;

var speed = 0; //速度初始化
var maxSpeed = 8;

var gameIsOver = false;

var scoringNumber = 0; //分数
var arrImg = [];

var gameMusic = document.getElementById("gameMusic"); //游戏背景音
var bullet = document.getElementById("bullet"); //小鸟飞音效
var gameOverMusic = document.getElementById("gameOverMusic"); //游戏结束音乐

//随机函数
function rand(min, max) {
	return parseInt(Math.random() * (max - min)) + min;
}

function clearTimer() {
	var end = setTimeout(function() {}, 1); //累计，setTimeout返回值是累加值
	var start = (end - 100) > 0 ? end - 100 : 0;
	for (var i = start; i <= end; i++) {
		clearTimeout(i);
	}
}

//加载图片资源
function loadImg() {
	var aScoringImg = ["images/0.jpg", "images/1.jpg", "images/2.jpg", "images/3.jpg", "images/4.jpg", "images/5.jpg", "images/6.jpg", "images/7.jpg", "images/8.jpg", "images/9.jpg"];

	for (var i = 0; i < aScoringImg.length; i++) {
		var newImg = new Image();
		newImg.src = aScoringImg[i];
		newImg.onload = function() {
			arrImg.push(this);
		}
	}
}

//计分器
function scoringFn() {
	var scoring = document.getElementById("scoring");
	scoring.innerHTML = "";
	var sScoring = String(scoringNumber);
	for (var i = 0; i < sScoring.length; i++) {
		var newImg = document.createElement("img");
		newImg.src = arrImg[sScoring.charAt(i)].src;
		scoring.appendChild(newImg);
	}
}

//碰撞检测
function crashTest(obj) {

	var l1 = flappyBird.offsetLeft;
	var r1 = l1 + flappyBird.offsetWidth;
	var t1 = flappyBird.offsetTop;
	var b1 = t1 + flappyBird.offsetHeight;

	var l2 = obj.offsetParent.offsetLeft;
	var r2 = l2 + obj.offsetWidth;
	var t2 = obj.offsetTop;
	var b2 = t2 + obj.offsetHeight;

	if (r1 > l2 && l1 < r2 && b1 > t2 && t1 < b2) {
		gameOver();
	}
}

//边缘检测
function rangeTest() {
	var l1 = flappyBird.offsetLeft;
	var r1 = l1 + flappyBird.offsetWidth;
	var t1 = flappyBird.offsetTop;
	var b1 = t1 + flappyBird.offsetHeight;

	if(t1 <= 0 || t1 >= 392){ //如果小鸟掉在地上或者超出天花板
		gameOver();
	}
}

//小鸟下降
function down() {
	speed += 0.4;
	if (speed >= maxSpeed) {
		speed = maxSpeed;
	}
	flappyBird.style.top = flappyBird.offsetTop + speed + "px";
}

//小鸟上升
function up() {
	speed -= 0.7;
	if (parseInt(speed) <= 0) {
		flappyBirdImg.src = "images/down_bird1.png";
		speed = 0;
		clearInterval(upTimer);
		downTimer = setInterval(down, 30);
	}
	flappyBird.style.top = flappyBird.offsetTop - speed + "px";
}

//小鸟往上跳
function birdJump() {
	var switchImgTimer = null;

	if (!gameIsOver) {
		bullet.play(); //播放小鸟飞音效
		speed = 8;
		clearInterval(upTimer);
		clearInterval(downTimer);

		var index = 0;

		switchImgTimer = setInterval(function() {
			flappyBirdImg.src = "images/up_bird1.png";
			index ++;
			if (index > 1) {
				clearInterval(switchImgTimer);
				upTimer = setInterval(up, 30);
			}
			flappyBird.style.top = flappyBird.offsetTop - speed + "px";
		}, 30);
	}
}

//生成管道
function createPipe() {
	var fbWrap = document.getElementById("fbWrap");
	var maxWidth = fbWrap.offsetWidth;
	
	var oLi = document.createElement("li");
	oLi.className = "pipe";
	oLi.ableToAddScore = true; //锁
	oLi.style.left = maxWidth + "px";

	var topHeight = rand(52, 250);
	var bottomHeight = 300 - topHeight;

	oLi.innerHTML = "<div class='top_pipe'>" +
		"<div style='height:" + topHeight + "px;'></div>" +
		"</div>" +
		"<div class='bottom_pipe'>" +
		"<div style='height:" + bottomHeight + "px;'></div>" +
		"</div>";

	pipeWrap.appendChild(oLi);

	oLi.moveTimer = setInterval(function() {
		maxWidth -= 2;
		oLi.style.left = maxWidth + "px"; //移动生成的管道
		if (maxWidth < maxWidth - oLi.offsetWidth) {
			clearInterval(oLi.moveTimer);
			pipeWrap.removeChild(oLi);
		}
		if (oLi.ableToAddScore && maxWidth <= 100) { //当满足加分条件，100是生成的管道左边距离容器的距离，也可以设置为0。这里ableToAddScore是加锁防止分数一直相加
			scoringNumber++; //加分
			scoringFn(); //计分器函数
			oLi.ableToAddScore = false;
		}
		
	}, 30);
}

//开始游戏
function gameStart(event) {
	var oHead = document.getElementById("head");
	var btns = document.getElementById("btns");
	var pipeWrap = document.getElementById("pipeWrap");

	oHead.style.display = "none";
	btns.style.display = "none";

	gameMusic.play(); //游戏背景音

	var event = event || window.event;
	event.stopPropagation();

	flappyBird.style.display = "block"; 

	downTimer = setInterval(down, 30);

	//碰撞检测
	crashTestTimer = setInterval(function() {
		var pipeList = pipeWrap.getElementsByTagName("li");
		for (var i = 0; i < pipeList.length; i++) {
			crashTest(pipeList[i].children[0]); //小鸟与管道1的碰撞检测
			crashTest(pipeList[i].children[1]); //小鸟与管道2的碰撞检测
		}
		rangeTest(); //小鸟与天花板和地板的碰撞检测
	}, 1000/60);//为了生成每秒60帧画面，看着流畅

	//循环生成管道
	createPipeTimer = setInterval(function() {
		createPipe();
	}, 3000);

	return false;
}

//小鸟挂掉
function gameoverDown() {
	flappyBird.style.webkitTransition = "all 0.5s linear";
	flappyBirdImg.src = "images/down_bird1.png";
	flappyBird.style.top = "392px";
}

//游戏结束
function gameOver() {
	var gameover = document.getElementById("gameover");
	var message = document.getElementById("message");
	var endScoring = document.getElementById("endScoring");
	var oldScoring = document.getElementById("oldScoring");
	
	gameMusic.pause(); //暂停播放背景音乐

	clearTimer();

	if (!gameIsOver) { //游戏结束音乐
		gameOverMusic.play();
	}

	gameover.style.top = "120px"; //gameover
	message.style.top = "180px"; //当前分和历史分数
	okBtn.style.left = "118px"; //OK按钮
	
	endScoring.innerHTML = scoringNumber; //显示结束分数

	gameoverDown(); //小鸟挂掉动画

	//本地存储数据，保存历史最高纪录
	if (window.localStorage.getItem("scoring") < scoringNumber) {
		window.localStorage.setItem("scoring", scoringNumber);
		oldScoring.innerHTML = scoringNumber;
	} else {
		oldScoring.innerHTML = window.localStorage.getItem("scoring");
	}

	gameIsOver = true; //设置游戏状态，gameIsOver为true
}

//重置
function gameReset() {
	location.reload(); //刷新页面
}

//事件绑定
function bindEvent() {
	var start = document.getElementById('start');
	var okBtn = document.getElementById('okBtn');

	//开始游戏
	start.onclick = function(event) {
		gameStart(event);
	};

	//点击小鸟跳动
	document.addEventListener("click", birdJump, false);

	//重置
	okBtn.onclick = function(event) {
		gameReset();
	};
}

//初始化
function init() {
	loadImg();
	bindEvent();
}

window.onload = function() {
	init();
};