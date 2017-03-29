
	
window.onload = function (){
	$('#loading').css('display','none');
	$('.cover').css('display','block');
}

$(document).ready(function (){
	$("<audio id='music-bg' loop autoplay='false' src='' type='audio/mpeg'></audio>").appendTo($('#content'));
	$("<audio id='music-bomb'  src='' type='audio/mpeg'></audio>").appendTo($('#content'));
	
	$('#music-bg').attr('src','audio/bgm.mp3');
	$('#music-bomb').attr('src','audio/bomb.mp3');
	//从后台获取数据
	//音频
	$('#music-bg').get(0).addEventListener('loadedmetadata',function () {
		$('#music-bg').get(0).currentTime = 0;
		$('#music-bg').get(0).play();
	},false);

	$('#music-bomb').get(0).addEventListener('loadedmetadata',function () {
		$('#music-bomb').get(0).currentTime = 0;
	},false);
	
	$('#music-bomb').get(0).addEventListener('ended', function () {
		$('#music-bg').get(0).play();
	},false);

//button-m 是所有按钮的 类名，用于触发背景音乐
	$('.button-m').get(0).addEventListener('touchstart',function () {
		$('#music-bg').get(0).play();
		if($('#music-bg').get(0).ended){
			$('#music-bg').get(0).currentTime = 0;
			$('#music-bg').get(0).play();
		}
		if ($('#music-bomb').get(0).ended) {
			$('#music-bomb').get(0).currentTime = 0;
		}
	},false);


	//选择器 缓存 
	var oWrap = $('.wrap'),
		aTimeImg = $('#timer img'),
//		aScoreImg = $('#get img'),
		oHook = $('#hook'),
		oGunzi = $('#gunzi'),
		oScore = $('#get'),
		aGoods = $('.prize > div'),
		aGoodsDiv = $('.prize div div'),
		aGoodsImg = $('.prize div div img'),
		aChooseItemImg = $('#chooseitems img'),
		aTabItemsLi = $('#tabitems ul li'),
		aTabItemsImg = $('#tabitems ul li img'),
		aTabItemsP = $('#tabitems ul li p'),
		oGetScore = $('.gotscore'),
		oBigBomb = $('.bigBomb'),
		oContent = $('#content');
	
	var oTimer = {
		countTimer:null,
		hookTimer:null,
		iTimer:20000
	}
	var oFlag = {
		countTime:true,
		hook:true,
		bomb:false,
		countDown:false,
		gotSomething:false
	}
	//Hook属性 transform.matrix 的sin,cos 值 //hook 的高，hook底部中点的坐标
	var Hook = {
		iCos:0,
		iSin:0,
		iHookX:0,
		iHookY:0,
		iHookHeight: oHook.height(),
		iHookWidth: oHook.width(),
		iHookMiddle: parseInt(oHook.width()/2+oHook.position().left),
		iHookTop: oHook.position().top,
		iPoleHeight: oGunzi.height()
	}
	//抓到样品的位置
	var	flag,
//		iCoutTimer,
			//上一个role序号
		iRoleLast = 0,	
			//当前role序号
		iRolecurrent = 0,
		iScore,
		sBombSrc = 'img/bomb.png';
	var itemLength = aGoodsImg.length;
		//云层上是否有样品
	var aFlag = [],
		//云层上是炸弹还是样品
		aBomb = [0,0,0,0,0,0,0];
//游戏区的宽高
	var iWrapWidth =  oWrap.width(),
		iWrapHeight = oWrap.height();

//数据区
		//大图轮播 left，top
	var aChooseitems = ['31.56%','29.69%','30.78%','15.47%','28.44%','-100%','100%'];
		//goods 动画 类名
	var aItemAnimation = ['itemAnimation1','itemAnimation2','itemAnimation3',
		'itemAnimation4','itemAnimation5','itemAnimation6','itemAnimation7'];
		//游戏页面 角色 img.src
	var aGameRole = [['img/baike.png','img/baike-b.png'],['img/hanxue.png','img/hanxue-b.png'],['img/mingdao.png','img/mingdao-b.png'],
		['img/liuyuxi.png','img/liuyuxi-b.png'],['img/xukaipin.png','img/xukaipin-b.png']];
	
		//选择角色的 width,left,bottom,height 
	var aRoleWidth = [['41.56%','36.56%','67.78%','30%'],['35.3%','40.3%','67.78%','27.9%'],['28.59%','36.875%','67.78%','30.72%'],
		['24.53%','41.19%','67.78%','29.93%'],['30.625%','35.78%','67.78%','29.67%']];
		//role爆炸后的width,left
	var aRoleBomb = [['43.84%','32.41%'],['42.3%','32.3%'],['40.59%','32.875%'],['43.53%','35.19%'],['43.625%','33.78%']];	
		//hook的 left,top,transform.origin
	var aPole = [['32.19%','18.37%','50% 4%'],['35.8%','19.37%','50% 4%'],['32.49%','17.61%','50% 3.5%'],
		['38.97%','21.13%','50% 4%'],['31.56%','18.4%','50% 3.5%']];
		
		//物件的width,height,left,top
	var aGoodsAttr = [ ['','','','','1'],['','','','','1'],['','','','','1'],['','','','','1'],
		['','','','','1'],['','','','','1'],['','','','','1'] ];
	//奖品src,goods.src
	var aPrizeScr = ['img/baoxiang.png','img/sugar3.png','img/rusuan3.png','img/goods4.png','img/goods1.png','img/sugar2.png','img/cake2.png'];
		//时间数字
	var aTiemrNum = ['img/t0.png','img/t1.png','img/t2.png','img/t3.png','img/t4.png','img/t5.png','img/t6.png',
		'img/t7.png','img/t8.png','img/t9.png'];
		//得分数字
	var aScoreNum = ['img/0.png','img/1.png','img/2.png','img/3.png','img/4.png','img/5.png','img/6.png',
		'img/7.png','img/8.png','img/9.png',];
	var aScore = [],
		aShowScore = [];
//判断屏幕分辨率的高是否小于568px,小于则修改数据：角色的left，pole的left，top
	var aChange = [['39.41%','34.6%','16.37%'],['43.3%','38.8%','17.37%'],['39.875%','35.49%','16.61%'],
		['43.19%','39.97%','19.13%'],['38.78%','34%','16.4%']];
	if (window.screen.height < 568) {
		for (var i=4;i>=0;i--) {
			aRoleWidth[i][1] = aChange[i][0];
			aPole[i][0] = aChange[i][1];
			aPole[i][1] = aChange[i][2];
		}
	} 	
				
//首页进去看看,去下一页
	$('#enter').get(0).addEventListener('touchstart',function(){
		oContent.animate({left:"-100%"},200,'linear');
		$('#music-bg').get(0).play();
	},false);
	
//选取角色页面，下一页
	$('#enterlook').get(0).addEventListener('touchstart',function(){
		oContent.animate({left:"-200%"},200,'linear');
		
		//根据选中的角色设置 游戏页面的角色, 以及角色的 width,left,bottom,hook 的 transform.origin
		$('#roleItem').attr('src',aGameRole[iRolecurrent][0]);
		
		$('.roleItem').css({width:aRoleWidth[iRolecurrent][0],left:aRoleWidth[iRolecurrent][1],
			bottom:aRoleWidth[iRolecurrent][2],height:aRoleWidth[iRolecurrent][3]});
		oHook.css({left:aPole[iRolecurrent][0],top:aPole[iRolecurrent][1]});

		//给 游戏页面 运动物件添加运动类名
		oHook.addClass('hookAnimation');
		for (var i=aGoods.length-1;i>=0;i--) {
			aGoods.eq(i).addClass(aItemAnimation[i]);
		}
		//淡出游戏提示
		$('#gamestarttip').animate({opacity:0},1800,function () {
			$(this).css('display','none');
		});
	},false);
	
//选角页面，绑定touchstart,
	aTabItemsLi.each(function (i) {
		aTabItemsLi.eq(i).get(0).addEventListener('touchstart',function () {
			iRolecurrent = i;
			if( iRolecurrent != iRoleLast ) {
				//处理当前选中的
					// 切换选中小图
				tabImgSrc(aTabItemsImg.eq(i));
					//文字颜色
				aTabItemsP.eq(i).addClass('fontcolor');
				aTabItemsImg.eq(i).css('display','block');
				
					//大图轮播,当前的
				sSrc = iRoleLast > i ? aChooseitems[6]:aChooseitems[5];
				aChooseItemImg.eq(iRoleLast).animate({left:sSrc},'300','linear');
					//大图轮播,下一个
				sSrc = iRoleLast > i ? aChooseitems[5]:aChooseitems[6];
				aChooseItemImg.eq(i).css('left',sSrc);
				aChooseItemImg.eq(i).animate({left:aChooseitems[i]},'300','linear');
				
				//处理上一个被选中的
				sSrc = aTabItemsImg.eq(iRoleLast).attr('src');
				aTabItemsImg.eq(iRoleLast).attr('src',aTabItemsImg.eq(iRoleLast).attr('tab-src'));
				aTabItemsImg.eq(iRoleLast).attr('tab-src',sSrc);
					//文字颜色
				aTabItemsP.eq(iRoleLast).removeClass('fontcolor');
				aTabItemsImg.eq(iRoleLast).css('display','block');
				iRoleLast = i;
			}
		},false);
		
	});
	(init = function () {
		//清空得分,bug,微信内 设置src='' 无效，未解决 ，已换成dom操作
		if( $('#get img').length){
			$('#get img').remove();
		}
		$('#get').append($("<img src='' /><img src='' /><img src='' /><img src='' />"));
		
		for (var i=0;i<7;i++) {
			aGoodsImg.eq(i).attr('src',aPrizeScr[i]);
			aGoodsAttr[i][4] = 1;
			aBomb[i] = 0;
		}
		$('#timer img').eq(0).attr('src','img/t2.png');
		
		iScore = 0;
		oScore.attr('score','0');
		
		oTimer.iTimer = 20000;
		oFlag.countTime = true;
		oFlag.hook = true;
		oFlag.bomb = false;
		aScore = [];
	})();
//游戏页面gameover 绑定再玩一次，积分榜
	$('.playagain').get(0).addEventListener('touchstart',backGame,false);
	$('.rank').get(0).addEventListener('touchstart',function () {
		oContent.animate({left:"-300%"},'fast','linear');
	},false);
//积分榜页面
	$('.backgame').get(0).addEventListener('touchstart',backGame,false);
	function backGame () {
		init();
		oContent.animate({left:"-100%"},'fast','linear');
		$('.gameover').css('display','none');
	}
	$('.award').get(0).addEventListener('touchstart', function () {
		oContent.animate({left:"-400%"},'fast','linear');
	},false);

//获奖规则页面
	$('.lookscore').get(0).addEventListener('touchstart', function () {
		oContent.animate({left:"-300%"},'fast','linear');
	},false);
	
	//游戏开始
	$('#button').get(0).addEventListener('touchstart',gameStart,false);
	function gameStart () {
		
		if (oFlag.countTime) {
			countTime();
			oFlag.countTime = false;
			oFlag.countDown = true;
		}
		if (oFlag.hook ) {
			// 屏蔽多次点击
			oFlag.hook  = false;
			//计时
			
			//切换btn图片
			tabImgSrc($('#button img'));
			// 获取及设置点击时刻的弧度
			dealRotate();
			clearInterval(oTimer.hookTimer);
			oTimer.hookTimer = setInterval(function () {
				// hook底部中点坐标	
				Hook.iHookHeight = oHook.height();
				Hook.iHookX = parseInt(Hook.iHookMiddle - Hook.iSin*Hook.iHookHeight);
				Hook.iHookY = parseInt(Hook.iCos*Hook.iHookHeight + Hook.iHookTop);
//				 console.log(iHookX,iHookY);
				// hook伸长
				oGunzi.css('height',oGunzi.height() + 10);
				//物件的属性,是否捕获物件 
				getAttrGoods();
			
				if (oFlag.gotSomething || Hook.iHookX < 0 || Hook.iHookX > iWrapWidth || Hook.iHookY > iWrapHeight) {
					clearInterval(oTimer.hookTimer);
					var iBackTime = oFlag.gotSomething==true?700:400;
					//oFlag.gotSomething:true 捕获到物件
					if (oFlag.gotSomething) {
						$('#goods img').css('display','block');
						var oImg = aGoodsImg.eq(flag);
					// 装载物件，设置样式
						var iWidth = oImg.css('width');
						$("<img src = '' />").appendTo($('#goods'));
						if (aBomb[flag]) {
							$("#goods img").attr({src:sBombSrc,value:''});
							oFlag.bomb = true;
						}
						else{
							$("#goods img").attr({src:aPrizeScr[flag],value:oImg.attr('value')});
						}
							
						//随机炸弹
						if (flag >= 3  && Forabomb() && aBomb[flag]!=1) {
							aGoodsImg.eq(flag).attr('src',sBombSrc);
							//同一云层，连续出现炸弹,bug,抓取到的炸弹变成样品，解决方法：该层当前不是炸弹，才放炸弹.aBomb[flag]!=1 
							aBomb[flag] = 1;
						}
						else {
							aGoodsImg.eq(flag).attr('src',aPrizeScr[flag]);
						}
							
						//如果是宝箱，发光消失3s后再出现
						if (flag == 0) {
							$('#faguang').hide();
							setTimeout(function (){
								$('#faguang').show();
							},3000);
						}
						aGoodsDiv.eq(flag).css('display','none');
						aGoodsDiv.eq(flag).delay(3000).show('fast',function () {
							aGoodsAttr[aFlag[0]][4] = 1;
							aFlag.shift();
						});
						$("#goods img").css({width:iWidth});
//						getBack();
						oGunzi.animate({height: 32}, iBackTime,function() {
							//bombFlag为true产生爆炸效果
							if (oFlag.bomb && oTimer.iTimer) {
								oFlag.bomb = false;
								//同一云层，连续出现炸弹,bug
								aBomb[flag] = 0;
								$('#goods img').remove();
								
						//爆炸音频，在抓到炸弹且收回来时 触发
								$('#music-bomb').get(0).currentTime = 0;
								$('#music-bomb').get(0).play();
								oBigBomb.show(200,function () {
									
									oBigBomb.addClass('bomb');
									setTimeout(function () {
										oBigBomb.removeClass('bomb');
										//替换爆炸角色
										$('#roleItem').attr('src',aGameRole[iRolecurrent][1]);
										$('.roleItem').css({width:aRoleBomb[iRolecurrent][0],left:aRoleBomb[iRolecurrent][1]});
										oBigBomb.fadeOut(200,function () {
											oBigBomb.css({display:'none'});
											setTimeout(function () {
												$('#roleItem').attr('src',aGameRole[iRolecurrent][0]);
												$('.roleItem').css({width:aRoleWidth[iRolecurrent][0],left:aRoleWidth[iRolecurrent][1]});
												oGunzi.css('height',Hook.iPoleHeight);
												oHook.addClass("hookAnimation");
												oFlag.gotSomething = false; 
												oFlag.hook = true;
												tabImgSrc($('#button img'));
											},700);
										});
									},1000);
								});
							}
							else{
//								if(oFlag.gotSomething) {
									//	得分 aScoreImg  aScoreNum
									if(oTimer.iTimer) {
										iScore += Number($('#goods img').attr('value'));
										aScore = String.prototype.split.call(iScore,'');
										for (var i = aScore.length;i>=0;i--) {
											$('#get img').eq(i).attr('src',aScoreNum[Number(aScore[i])]);
										}
									}
									$('#goods img').remove();
//								}
								oGunzi.css('height',Hook.iPoleHeight);
								oHook.addClass("hookAnimation");
								oFlag.gotSomething = false; 
								oFlag.hook = true;
								tabImgSrc($('#button img'));
							}
						});
						
						
						//捕获物件得分效果 
						if ($('#goods img').attr('value') && oTimer.iTimer) {
							oGetScore.css({display:'block',left:aGoodsAttr[flag][0],top:aGoodsAttr[flag][1]});
							aShowScore = $('#goods img').attr('value').split('');
							for (var i = aShowScore.length-1;i>=0;i--) {
								$('.gotscore img').eq(i).attr('src',aScoreNum[Number(aShowScore[i])]);
							}
							oGetScore.animate({top:aGoodsAttr[flag][1]-40},function () {
								oGetScore.animate({top:'7%',left:'8%'},function () {
									//抓取音乐
//									$('#music-bg').get(0).pause();
//									$('#music-score').get(0).currentTime = 0;
//									$('#music-score').get(0).play();
									oGetScore.fadeOut('fast',function(){
										for (var i = aShowScore.length-1;i>=0;i--) {
											$('.gotscore img').eq(i).attr('src','');
										}
									});
									$('#get').animate({width:'55%'},200,function () {
										$('#get').animate({width:'41.56%'},100);
									});
								});
							});
						}
					}
					else{
//						getBack();
						oGunzi.animate({height: 32}, iBackTime,function() {
							oGunzi.css('height',Hook.iPoleHeight);
							oHook.addClass("hookAnimation");
							oFlag.gotSomething = false; 
							oFlag.hook = true;
							tabImgSrc($('#button img'));
						});
					}
				}
			},20);
		}
		else{
			return ;
		}
	}
	//计时
	function countTime() {
		var i, 
			j;
		clearTimeout(oTimer.countTimer);
		oTimer.countTimer = setInterval(countTime,10);
		oTimer.iTimer -=10;
		i = parseInt(oTimer.iTimer/1000); 
		j = (oTimer.iTimer%1000)/10;
		
		//3秒倒计时
		if( oTimer.iTimer <= 3500 && oFlag.countDown) {
			oFlag.countDown = false;
//			$('#music-countdown').get(0).currentTime = 0;
////			$('#music-bg').get(0).pause();
//			$('#music-countdown').get(0).play();
		}
		
		if (i < 10){
			aTimeImg.eq(0).attr('src',aTiemrNum[0]);
			aTimeImg.eq(1).attr('src',aTiemrNum[i%10]);
		}
		else {
			aTimeImg.eq(0).attr('src',aTiemrNum[parseInt(i/10)]);
			aTimeImg.eq(1).attr('src',aTiemrNum[i%10]);
		}
		if (j == 0) {
			aTimeImg.eq(3).attr('src',aTiemrNum[0]);
			aTimeImg.eq(4).attr('src',aTiemrNum[0]);
		}
		else {
			aTimeImg.eq(3).attr('src',aTiemrNum[j/10]);
			aTimeImg.eq(4).attr('src',aTiemrNum[j%10]);
		}
		if (i == 0 && j == 0) {
			oScore.attr('score',iScore);
			clearInterval(oTimer.countTimer);
			//返回得分给后台

			oHook.removeClass('hookAnimation');
			
			$('.gameover').show();
			removeAnimation ();
			//游戏结束，总分
			for (var i = aScore.length-1;i>=0;i--) {
					$('.totalpoints img').eq(i).attr('src',aScoreNum[Number(aScore[i])]);
					
				}
		}
	}
	//gameover 移除animation动画
	function removeAnimation () {
		for (var i=aGoods.length-1;i>=0;i--) {
			aGoods.eq(i).removeClass(aItemAnimation[i]);
		}
	}
	function Forabomb(){
		return  (Math.random()*10)>8?true:false;
	}
	
	//获取物件的left，top,width,height
	//是否捕获
	function getAttrGoods () {
		for (var i=6;i>=0;i--) {
			if (aGoodsAttr[i][4]) {
				aGoodsAttr[i][0] = parseInt(aGoodsDiv.eq(i).offset().left);
				aGoodsAttr[i][1] = parseInt(aGoodsDiv.eq(i).offset().top);
				aGoodsAttr[i][2] = parseInt(aGoodsDiv.eq(i).width())+aGoodsAttr[i][0];
				aGoodsAttr[i][3] = parseInt(aGoodsDiv.eq(i).height())+aGoodsAttr[i][1];
			}
			else{
				aGoodsAttr[i][0] = 0;
				aGoodsAttr[i][1] = 0;
				aGoodsAttr[i][2] = 0;
				aGoodsAttr[i][3] = 0;
			}
			if (Hook.iHookX > aGoodsAttr[i][0] && Hook.iHookX < aGoodsAttr[i][2] && Hook.iHookY > aGoodsAttr[i][1] && Hook.iHookY < aGoodsAttr[i][3]){
				//表示物件已被捕获
				aGoodsAttr[i][4] = 0;
				oFlag.gotSomething = true;
				flag = i;
				aFlag.push(flag);
				return ;
			}
		}
	}
	// hook收回
//	function getBack() {
//		var iBackTime = oFlag.gotSomething==true?700:400;
		//height:'2em';这么写有bug
//		oGunzi.animate({height: 32}, iBackTime,function() {
//			//bombFlag为true产生爆炸效果
//			if (oFlag.bomb && oTimer.iTimer) {
//				oFlag.bomb = false;
//				//同一云层，连续出现炸弹,bug
//				aBomb[flag] = 0;
//				$('#goods img').remove();
////				$('#music-bg').get(0).pause();
//				$('#music-bomb').get(0).currentTime = 0;
//				$('#music-bomb').get(0).play();
//				oBigBomb.show(200,function () {
//					
//					oBigBomb.addClass('bomb');
//					setTimeout(function () {
//						oBigBomb.removeClass('bomb');
//						//替换爆炸角色
//						$('#roleItem').attr('src',aGameRole[iRolecurrent][1]);
//						$('.roleItem').css({width:aRoleBomb[iRolecurrent][0],left:aRoleBomb[iRolecurrent][1]});
//						oBigBomb.fadeOut(200,function () {
//							oBigBomb.css({display:'none'});
//							setTimeout(function () {
//								$('#roleItem').attr('src',aGameRole[iRolecurrent][0]);
//								$('.roleItem').css({width:aRoleWidth[iRolecurrent][0],left:aRoleWidth[iRolecurrent][1]});
//								oGunzi.css('height',Hook.iPoleHeight);
//								oHook.addClass("hookAnimation");
//								oFlag.gotSomething = false; 
//								oFlag.hook = true;
//								tabImgSrc($('#button img'));
//							},700);
//						});
//					},1000);
//				});
//			}
//			else{
//				if(oFlag.gotSomething) {
//					//	得分 aScoreImg  aScoreNum
//					if(oTimer.iTimer) {
//						iScore += Number($('#goods img').attr('value'));
//						aScore = String.prototype.split.call(iScore,'');
//						for (var i = aScore.length;i>=0;i--) {
//							$('#get img').eq(i).attr('src',aScoreNum[Number(aScore[i])]);
//						}
//					}
//					$('#goods img').remove();
//				}
////				oGunzi.css('height',Hook.iPoleHeight);
////				oHook.addClass("hookAnimation");
////				oFlag.gotSomething = false; 
////				oFlag.hook = true;
////				tabImgSrc($('#button img'));
//			}
//		});
//	}
	
	//切换src
	function tabImgSrc (obj){
		var sTemp = obj.attr('src');
		obj.attr('src',obj.attr('tab-src'));
		obj.attr('tab-src',sTemp);
	}
	
	// 处理transform.matrix的sin值转换成弧度值
	function dealRotate () {
		var aMatrix=(oHook.css('transform')).split(',');
		oHook.removeClass("hookAnimation");
		Hook.iSin=aMatrix[1];
		Hook.iCos=aMatrix[3];
		var deg = Math.round(180*Math.asin(Hook.iSin)/Math.PI);
		
		// 设置rotate 兼容性 
		oHook.css({transform:'rotate('+deg+'deg)',transformOrigin: aPole[iRolecurrent][2],webkitTransform:'rotate('+deg+'deg)',
			webkitTransformOrigin: aPole[iRolecurrent][2],mozTransform:'rotate('+deg+'deg)',mozTransformOrigin: aPole[iRolecurrent][2],
			msTransform:'rotate('+deg+'deg)',msTransformOrigin: aPole[iRolecurrent][2],oTransform:'rotate('+deg+'deg)',oTransformOrigin: aPole[iRolecurrent][2]} );
	}
});
