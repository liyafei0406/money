var canvas = document.getElementById("canvas1");
var ctx = canvas.getContext("2d");
var scores = document.getElementById('scores');
var scoresend = document.getElementById('scoresend');
var lose = document.getElementById('lose');
var again = document.getElementById('again');
var bgsound = document.getElementById('bgsound');
var bulletsound = document.getElementById('bulletsound');
var enemy1sound = document.getElementById('enemy1sound');
var enemy2sound = document.getElementById('enemy2sound');
var enemy3sound = document.getElementById('enemy3sound');
var gameoversound = document.getElementById('gameoversound');
var loading = document.getElementById('loading');
var score = 0;
var actionbol = false;
function IsPC() {  
   var userAgentInfo = navigator.userAgent;  
   var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");  
   var flag = true;
   for (var v = 0; v < Agents.length; v++) {
       if (userAgentInfo.indexOf(Agents[v]) > 0) {
       	flag = false;
       	break;
       }
   }
   return flag;
}
if (IsPC()) {
	canvas.width = 320;
	canvas.height = 568;
}else{
	canvas.width = document.documentElement.clientWidth;
	canvas.height = document.documentElement.clientHeight;
}
var cW = canvas.width;
var cH = canvas.height;
loading.style.width = cW + "px";
loading.style.height = cH + "px";
var pic_load = ["img/loading.gif","img/background.png","img/herofly.png","img/bullet1.png","img/bullet2.png","img/enemy1.png","img/enemy2.png","img/enemy3.png","img/prop.png","img/bomb.png"];
var n = 0;
for (var i = 0; i < pic_load.length; i++) {
	var loding_pic = new Image();
		loding_pic.src = pic_load[i];
	loding_pic.onload = function(){
		n++;
		if ((n/pic_load.length)>0.9) {
            bgsound.src = "audio/game_music.mp3";
			bulletsound.play();
			enemy1sound.play();
			enemy2sound.play();
			enemy3sound.play();
			gameoversound.play();
			bulletsound.pause();
			enemy1sound.pause();
			enemy2sound.pause();
			enemy3sound.pause();
			gameoversound.pause();
			actionbol = true;
			loading.style.display = "none";
		};
	};
};
var bgImg1 = new Image();
var bgImg2 = new Image();
var heroImg = new Image();
var bullet1Img = new Image();
var bullet2Img = new Image();
var enemy1 = new Image();
var enemy2 = new Image();
var enemy3 = new Image();
var propimg = new Image();
var bombimg = new Image();
bgImg1.src = "img/background.png";
bgImg2.src = "img/background.png";
heroImg.src = "img/herofly.png";
bullet1Img.src = "img/bullet1.png";
bullet2Img.src = "img/bullet2.png";
enemy1.src = "img/enemy1.png";
enemy2.src = "img/enemy2.png";
enemy3.src = "img/enemy3.png";
propimg.src = "img/prop.png";
bombimg.src = "img/bomb.png"
var hx = (cW-66)/2;
var hy = cH-82;
var hl = false;
var hr = false;
var ht = false;
var hb = false;
document.addEventListener("keydown",function (e) {
		switch(e.keyCode){
			case 37:
				hl = true;
				hr = false;
				ht = false;
				hb = false;
				break;
			case 38:
				hl = false;
				hr = false;
				ht = true;
				hb = false;
				break;
			case 39:
				hl = false;
				hr = true;
				ht = false;
				hb = false;
				break;
			case 40:
				hl = false;
				hr = false;
				ht = false;
				hb = true;
				break;
		}
},false);
document.addEventListener("keyup",function (e) {
		switch(e.keyCode){
			case 37:
				hl = false;
				hr = false;
				ht = false;
				hb = false;
				break;
			case 38:
				hl = false;
				hr = false;
				ht = false;
				hb = false;
				break;
			case 39:
				hl = false;
				hr = false;
				ht = false;
				hb = false;
				break;
			case 40:
				hl = false;
				hr = false;
				ht = false;
				hb = false;
				break;
		}
},false);
var hero = {
	w:66,
	h:82,
	x:hx,
	y:hy,
	rx:0,
	draw:function () {
		ctx.drawImage(heroImg,this.rx,0,this.w,this.h,this.x,this.y,this.w,this.h);
	}
}
var bomb = {
	x:cW-42,
	y:cH-36,
	draw:function () {
		ctx.drawImage(bombimg, this.x,this.y);
	}
}
var bullets = [];
function Bulletdraw (x,y,w,h,imgs,hurt) {
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.imgs = imgs;
	this.hurt = hurt;
};
var bulletnum = 0;
var btb = 7;
Bulletdraw.prototype.move = function () {
	bulletnum++;
	if (bulletnum%btb == 0) {
		bulletsound.play();
		bullets.push(new Bulletdraw(this.x,this.y,this.w,this.h,this.imgs));
	};
	if (bulletnum>=154) {
		bulletnum =0;
	};
	for (var i = 0; i < bullets.length; i++) {
		if(bullets[i].y < 0){
		bullets.splice(i, 1);
		continue;
	};
	bullets[i].y -= 9;
	ctx.drawImage(bullets[i].imgs,bullets[i].x,bullets[i].y);
	};
};
function fnRand (min,max) {
	return parseInt(Math.random()*(max-min)+min);
};
function Prop (x,y,w,h,rx,speed) {
	this.x=x;
	this.y=y;
	this.w=w;
	this.h=h;
	this.rx=rx*this.w;
	this.speed=speed;		
}
Prop.prototype.move = function () {
	this.y+=this.speed;
	ctx.drawImage(propimg, this.rx,0,this.w,this.h,this.x,this.y,this.w,this.h);
}
function Enemydraw (x,y,w,h,imgs,hp,speed,blowups,score) {
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.imgs = imgs;
	this.hp = hp;
	this.speed = speed;
	this.X = 0;
	this.bol = true;
	this.blowups = blowups;
	this.score = score;
	this.Delete = false;
};
Enemydraw.prototype.move = function (){
	if (this.bol) {
	this.y+=this.speed;
	};
	if (this.bol == false) {
		this.blowups--;
		this.X+=this.w;
		if (this.blowups <= 0 ) {
			this.Delete = true;
		};
	};
	ctx.drawImage(this.imgs,this.X,0,this.w,this.h,this.x,this.y,this.w,this.h);
};
Enemydraw.prototype.blowup = function (){
	this.bol = false;
};
function crash (obj1,obj2) {
	var l1 = obj1.x;
	var r1 = obj1.x+obj1.w;
	var t1 = obj1.y;
	var b1 = obj1.y+obj1.h;
	var l2 = obj2.x;
	var r2 = obj2.x+obj2.w;
	var t2 = obj2.y;
	var b2 = obj2.y+obj2.h;
	if (l1<r2&&r1>l2&&t1<b2&&b1>t2) {
		return true;
	}else{
		return false;
	};
};

var enmemyArr = [];
var propbol = true;
var bulletbol = true;
var bulletbols = true;
var bombbol = false;
var props;
var timer = 0;
var timers = 0;
var spacekey = false;
var herobol = true;
var spd = 6;
var eynum =  200;
var ppnum = 800;
var btbbol = false;
var bttime = 0;
function Actions () {
	if (score>5000&&score<10000) {
		spd =7;
		eynum = 180;
		ppnum = 700;
	}else if(score>10000&&score<15000){
		spd =8;
		eynum = 160;
		ppnum = 600;
	}else if(score>15000&&score<20000){
		spd =9;
		eynum = 140;
		ppnum = 500;
	}else if(score>20000){
		spd =10;
		eynum = 120;
		ppnum = 400;
	}
	var num = fnRand(1,eynum);
	var propnums = fnRand(1,ppnum);
	var x1 = fnRand(0,cW-38);
	var x2 = fnRand(0,cW-110);
	var x3 = fnRand(0,cW-46);
	var x4 = fnRand(0,cW-39);
	var speed = fnRand(3,spd);
	var proptype = fnRand(0,3);
	hero.draw();
	if (num < 10) {
		enmemyArr.push(new Enemydraw(x1,-38,38,34,enemy1,1,speed,5,100));
		if (num == 9) {
			enmemyArr.push(new Enemydraw(x2,-170,110,164,enemy2,8,speed,10,500));
		};
		if (num == 8) {
			enmemyArr.push(new Enemydraw(x3,-62,46,62,enemy3,4,speed,9,200));
		};
		haveenmemy = true;
	};
	for (var i = 0; i < enmemyArr.length; i++) {
		for (var k = 0; k < bullets.length; k++) {
			if (enmemyArr[i].bol) {	
				if (crash (enmemyArr[i],bullets[k])) {	
					enmemyArr[i].hp-=bullet.hurt;
					if (enmemyArr[i].hp<1) {
						enmemyArr[i].blowup();
						if (enmemyArr[i].score==100) {
							enemy1sound.play();
							}else if(enmemyArr[i].score==200) {
								enemy3sound.play();
							}else{
								enemy2sound.play();
							}
					};
					bullets.splice(k, 1);
				};
				if (crash (enmemyArr[i],hero)) {
					herobol = false;
					bulletbols = false;
					bombbol = false;
					gameoversound.play();
					bulletsound.pause();
					bgsound.pause();
				}
			};
		};
		if(enmemyArr[i].y>cH){
			enmemyArr.splice(i, 1);
		};
		enmemyArr[i].move();
		if (enmemyArr[i].Delete) {
			score+=enmemyArr[i].score;
			enemy1sound.pause();
			enemy3sound.pause();
			enemy2sound.pause();
			enmemyArr.splice(i, 1);
			i--;
		};	
	};
	if (propnums==11&&propbol&&bulletbol) {
		propbol=false;	
		props = new Prop(x4,-78,39,68,proptype,speed);	
	};
	if (propbol == false) {
		props.move();
		if (props.y>cH) {
			propbol=true;
		};
		if (crash (hero,props)&&herobol) {
			if (props.rx==39) {
				bulletbol=false;
			};
			if (props.rx==0) {
				bombbol = true;
			};
			if (props.rx==78) {
				btb=2;
				btbbol = true;
			};	
			propbol = true;	
		}
	};
	if (btbbol) {
		bttime++;
		if (bttime > 500) {  //密集子弹时间  500为15秒
			btbbol=false;
			btb=7;
			bttime=0;
		};
	};
	if (bulletbol == false) {
		timer++;
		if (timer > 500) {  //2倍子弹时间  500为15秒
			bulletbol=true;
			timer=0;
		};
	};
	if (bulletbols) {
		hero.x=hx;
		hero.y=hy;
		heronum++;
		if (heronum>1) {
			heronum = 0;
		};
		hero.rx=heronum*66;
		if (bulletbol) {
			bullet = new Bulletdraw(hx+31,hy-14,6,14,bullet1Img,1);
		}else{
			bullet = new Bulletdraw(hx+9.5,hy+20,48,14,bullet2Img,2);
		}
		bullet.move();
	}else{
		for (var i = 0; i < bullets.length; i++) {
				bullets.splice(i, 1);
		};
		timers++;
		if (timers%10==0) {
			heronum++;
		};
		hero.rx=heronum*66;
		if (heronum > 5) {
			lose.style.display = "block";
		}
	}
	if (bombbol) {
			bomb.draw();
		};
	document.addEventListener("keydown",function (e) {
		switch(e.keyCode){
			case 32:
			if (bombbol) {
				spacekey = true;
				};
				break;
			}
		},false);
	scores.innerHTML = score;
	scoresend.innerHTML = score;
	if (bombbol&&spacekey) {
		for (var i = 0; i < enmemyArr.length; i++) {
			enmemyArr[i].blowup();
			if (enmemyArr[i].score==100) {
				enemy1sound.play();
			}else if(enmemyArr[i].score==200) {
				enemy3sound.play();
			}else{
				enemy2sound.play();
			}
			if (enmemyArr[i].Delete) {
				score+=enmemyArr[i].score;
				enmemyArr.splice(i, 1);
			};
			if (enmemyArr[i].y>=0) {
				bombbol = false;
				spacekey = false;
			};
		};						
	};
};
var heronum = 0;
var bg1y = 0;
var bg2y = -cH;
var bullet;
setInterval(function () {
	if (actionbol) {
	if (againbol) {
		for (var i = 0; i < enmemyArr.length; i++) {
			enmemyArr.splice(i, 1);
			if (enmemyArr.length<=0) {
				againbol = false;
			}
		};
	}
	if (hl) {
		hx-=9;
		if (hx<0) {
			hx=0;
		};
	}else if(hr){
		hx+=9;
		if (hx>cW-66) {
			hx=cW-66;
		};
	}else if(ht){
		hy-=9;
		if (hy<0) {
			hy=0;
		};
	}else if(hb){
		hy+=9;
		if (hy>cH-82) {
			hy=cH-82;
		};
	};
	ctx.clearRect(0, 0, cW, cH);
	ctx.drawImage(bgImg1, 0, bg1y, cW, cH+10);
	ctx.drawImage(bgImg2, 0, bg2y, cW, cH+10);
	bg1y+=4;
	bg2y+=4;
	if (bg1y>=cH) {
		bg1y = -cH;
	};
	if (bg2y>=cH) {
		bg2y = -cH;
	};
	Actions ();
	};
},30);
var againbol = false;
again.onclick = function() {
	againbol = true;
	lose.style.display = "none";
	score = 0;
	hx = (cW-66)/2;
	hy = cH-82;
	hl = false;
	hr = false;
	ht = false;
	hb = false;
	bulletbols = true;
	bulletbol = true;
	propbol = true;
	herobol = true;
	timer=0;
	bgsound.play();
	spd = 6;
	eynum =  200;
	ppnum = 800;
	btb = 7;
}
again.ontouchstart = function() {
	againbol = true;
	lose.style.display = "none";
	score = 0;
	hx = (cW-66)/2;
	hy = cH-82;
	hl = false;
	hr = false;
	ht = false;
	hb = false;
	bulletbols = true;
	bulletbol = true;
	propbol = true;
	herobol = true;
	timer=0;
	bgsound.play();
	spd = 6;
	eynum =  200;
	ppnum = 800;
	btb = 7;
}
canvas.addEventListener('touchstart', function(e){
	var e = e || window.event;
	var x = e.touches[0].clientX-this.offsetLeft;
	var y = e.touches[0].clientY-this.offsetTop;
	var rx = hx+hero.w;
	var ry = hy+hero.h;
	var sx = x - hx;
	var sy = y - hy;
	function touchmoveFn (e) {
		hx = e.touches[0].clientX - sx;
		hy = e.touches[0].clientY - sy;
		if (hx<0) {
			hx=0;
		};
		if (hx>cW-66) {
			hx=cW-66;
		};
		if (hy<0) {
			hy=0;
		};
		if (hy>cH-82) {
			hy=cH-82;
		};
	}
	if (x>hx&&y>hy&&x<rx&&y<ry) {
		document.addEventListener('touchmove',touchmoveFn,false);
	};
	document.addEventListener('touchend', function(){
		document.removeEventListener('touchmove',touchmoveFn,false);
	},false);
},false);
document.ontouchmove = function (event) {
	event.preventDefault();
}
canvas.addEventListener('touchstart', function(e){
	var e = e || window.event;
	var x = e.touches[0].clientX-this.offsetLeft;
	var y = e.touches[0].clientY-this.offsetTop;
	if (x>bomb.x&&y>bomb.y) {
		if (bombbol) {
			spacekey = true;
		};
	};
},false);