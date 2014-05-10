var Elem_Matrix_ROWs = 7;
var Elem_Matrix_COLs = 7;
var Elem_Matrix = [];
var eliminate_LIST = {};

var Elem_Destory_Time = 2 / 60;
var Elem_Show_Time = 2 / 60;
var Elem_FallDown_Time = 0.3;
var Elem_Switch_Time = 0.2;
// var delay_Show = cc.DelayTime.create(Elem_Show_Time);
// var delay_Destory = cc.DelayTime.create(Elem_Destory_Time);
// var delay_FallDown = cc.DelayTime.create( Elem_FallDown_Time);
// var delay_Switch = cc.DelayTime.create( Elem_Switch_Time);
var gameW, gameH;

var GameScene = Class(
/** @lends myGame.Main.prototype */
{

	SceneName : "gameScene",
	QGC : null,
	$ : null,
	Event : null,
	UIScene : null,
	EffectScene : null,
	ParticleScene : null,
	//下落高度
	fallHeight : null,
	selectedElem : null,
	totalScore : 0,
	curScore : 0,
	//旋转风车
	windmill : null,
	//            十字炸弹
	crossBomb : null,
	//计数器
	tipNo:null,
	combooCount : 0,
	scoreTimes : 1,
	//计时器
	sTimer : null, //更新分数
	cClearTimer : null, //清理comboo
	gameTime : null,
	onCombooTime : 6, //进入comboo模式的时间
	combooClearTime : 1, //连击失效时间
	tipTooltime : 4.5, //正常提示时间
	//			 状态判断
	Animation_Complete : true,
	switch_Complete : true,
	isOnEliminate : false,
	isTimeUsedUp : false,
	_isGamePropsTime : false,
	/**
	 * 初始化
	 */
	_initData : function() {
		GAME.STATUS = GAMESTATUS.playGame;
		this.QGC = [];
		this.$ = {};
		this.Event = {};
		Elem_Matrix = [];
		eliminate_LIST = {};
		this.isTimeUsedUp = false;
		this.fallHeight = {};
		//  TBomb粒子列表
		this.$['TBombEffectLIst'] = [];
	},
	initialize : function() {
		myGame.Main.curGameScene = this;
		// 加载动作类
		RunAction = new RunActionClass();
		RunAction.RunAC();
		this._initData();
		this._init();
	},

	_init : function() {
		gameW = ss2d.Stage2D.stageWidth;
		gameH = ss2d.Stage2D.stageHeight;

		this.UIScene = myGame.Main.Res["UI"];
		this.EffectScene = myGame.Main.Res["GameEffect"];
		this.ParticleScene = new ss2d.Scene(myGame.Main.Res["ParticleTexture"], 500);

		ss2d.stage.addChild(this.UIScene);
		ss2d.stage.addChild(this.EffectScene);
		ss2d.stage.addChild(this.ParticleScene);

		//创建背景
		this.initBG();

		this.initEle();

		this.initUI();

		////effect
		this.initEffect();

		this.Animation_Complete = true;
		//	this.initParticle();

		//更新分数
		this.sTimer = new ss2d.Timer(1000 / 30);
		this.Event["sTimer"] = this.updataScore.bind(this);
		this.sTimer.addEventListener(ss2d.TimerEvent.TIMER, this.Event["sTimer"]);
		this.sTimer.start();
		//cClearTimer
		//是否使用Supercombos道具
		this.combooClearTime = COMBOOCLEARTIME + (GameProps.Supercombos ? 0.4 : 0);
		this.cClearTimer = new ss2d.Timer(this.combooClearTime * 1000);
		this.Event["cClearTimer"] = this.onCombooClear.bind(this);
		this.cClearTimer.addEventListener(ss2d.TimerEvent.TIMER, this.Event["cClearTimer"]);
		this.cClearTimer.start();
		//提示时间
		this.tipTooltime = TIPTOOlTIME - (GameProps.quickTips ? 1.5 : 0);
		//注册帧事件
		this.Event["onEnterFrameHandler"] = this.onEnterFrameHandler.bind(this);
		this.Event["onMouseDownHandler"] = this.onMouseDownHandler.bind(this);
		this.Event["onMouseUpHandler"] = this.onMouseUpHandler.bind(this);
		this.Event["onMouseMoveHandler"]=this.onMouseMoveHandler.bind(this);
		ss2d.stage.addEventListener(ss2d.Event.ENTER_FRAME, this.Event["onEnterFrameHandler"]);
		ss2d.stage.addEventListener(ss2d.MouseEvent.MOUSE_DOWN, this.Event["onMouseDownHandler"]);
		ss2d.stage.addEventListener(ss2d.MouseEvent.MOUSE_UP, this.Event["onMouseUpHandler"]);
		ss2d.stage.addEventListener(ss2d.MouseEvent.MOUSE_MOVE, this.Event["onMouseMoveHandler"]);
		//              game start
		this.initTip();
		this.Eliminate();

		this.randomSetWindmill();
		this.randomSetRandom();
	},
	initBG : function() {
		var bg = this.UIScene.applyQuad();
		this.UIScene.showQuad(bg);
		bg.setTileName("gamebg");
		//有长宽拉伸不能为单数？
		bg.setWidth(gameW);
		bg.setHeight(gameH);
		bg.setX(0);
		bg.setY(0);
		this.QGC.push(bg);
	},
	initUI : function() {
		var topbar = this.UIScene.applyQuad();
		this.UIScene.showQuad(topbar);
		topbar.setTileName("topbar");
		topbar.setWidth(gameW);
		topbar.setX(0);
		topbar.setY(0);
		this.QGC.push(topbar);

		var scoreBottom = this.UIScene.applyQuad();
		this.UIScene.showQuad(scoreBottom);
		scoreBottom.setTileName("score");
		scoreBottom.setRotation(-90);
		scoreBottom.setX(12);
		scoreBottom.setY(56);
		this.QGC.push(scoreBottom);

		var foot = this.UIScene.applyQuad();
		this.UIScene.showQuad(foot);
		foot.setTileName("bottom");
		foot.setWidth(gameW);
		foot.setX(0);
		foot.setY(gameH - 25);
		this.QGC.push(foot);

		var btn_X = gameW / 2, btn_Y = 100;

		// ////lab
		var scoreText = new ss2d.TextField(128, 128);
		scoreText.setFontSize(26);
		scoreText.setColor(255 / 255, 94 / 255, 0 / 255);
		scoreText.setText("0");
		scoreText.setX(10);
		scoreText.setY(10);
		ss2d.stage.addChild(scoreText);
		this.$["scoreText"] = scoreText;

		var tipText = new ss2d.TextField(128, 128);
		tipText.setFontSize(30);
		tipText.setColor(255 / 255, 94 / 255, 0 / 255);
		tipText.setText("");
		//combo!
		tipText.setX(btn_X - 32);
		tipText.setY(btn_Y + 100);
		ss2d.stage.addChild(tipText);
		this.$["tipText"] = tipText;

		/////timeline

		var timeline = new TimeLine(this.UIScene);
		timeline.setPosition(gameW / 2, 100);
		// 怪异~文本域在初始化的时候加入 组  出错
//		timeline.initTextPosition();
		timeline.start();
		timeline.callback = function() {
			var Queue = [Action.CallFunCreate(myGame.Main.curGameScene.onTimeUsedUp)];
			RunAction.Create(myGame.Main.curGameScene, Queue);
		}
		this.$["timeline"] = timeline;
		///

		var combooline = new ComboLine(this.UIScene);
		combooline.setPosition(gameW - 46, 100);
		combooline.onEndCallback(function() {
			var Queue = [Action.CallFunCreate(myGame.Main.curGameScene.onSuperCombooEnd)]
			RunAction.Create(myGame.Main.curGameScene, Queue);
		});
		this.$["combooline"] = combooline;
		//// cTimes
		var cTimes = new ComboTimes(this.UIScene);
		cTimes.setPosition(gameW / 2 + 100, 200);
		cTimes.initTextPosition();
		cTimes.onMaxCallback(function() {
			var Queue = [Action.CallFunCreate(myGame.Main.curGameScene.onSuperComboo)]
			RunAction.Create(myGame.Main.curGameScene, Queue);
		});
		this.$['cTimes'] = cTimes;
		// 					cTimes.start();
		this.initGameProsps();
		myGame.Main.sound.group("sound").item("bgm").play(-1);
	},
	onSuperComboo : function() {
		//music
		this.$["combooline"].start();
		if (this.scoreTimes < 2) {
			this.scoreTimes = 8;
		} else {
			this.scoreTimes += 1;
		}
	},
	onSuperCombooEnd : function() {
		console.log("superComboo Emd!")
		this.scoreTimes = 1;
		this.$['cTimes'].clearCount();
		this.combooCount = 0;
	},
	//            初始化道具
	initGameProsps : function() {
		var TileName = "", n = 0;
		this.Event["onTBombMouseDownHandler"] = this.onTBombMouseDownHandler.bind(this);
		for (var name in GameProps) {
			if (GameProps[name]) {
				switch(name) {
					case "quickTips":
						TileName = "quickTips";
						break;
					case "timeOffers":
						TileName = "timeOffers";
						break;
					case "Supercombos":
						TileName = "Supercombos";
						break;
					case "tbombTool":
						TileName = "tbombTool";
						break;
				}
				var tool = this.UIScene.applyQuad();
				this.UIScene.showQuad(tool);
				tool.setTileName(TileName);
				tool.setScaleX(0.5);
				tool.setScaleY(0.5);
				tool.setX(10 + 38 * n);
				tool.setY(200);
				this.QGC.push(tool);
				if (TileName == "tbombTool") {
					tool.setScaleX(0.65);
					tool.setScaleY(0.65);
					tool.setMouseEnabled(true);
					tool.addEventListener(ss2d.MouseEvent.MOUSE_DOWN, this.Event["onTBombMouseDownHandler"]);
				}
				n++;
			}
		}

	},
	initTip:function(){
		// select  标记
		this.$['selectImg'] = this.UIScene.applyQuad();
		this.UIScene.showQuad(this.$['selectImg']);
		this.$['selectImg'].setTileName("select");
		this.$['selectImg'].setScaleX(1.3);
		this.$['selectImg'].setScaleY(1.3);
		this.$['selectImg'].setCenter(true);
		this.$['selectImg'].setR(1.3);
		this.$['selectImg'].setG(1.3);
		this.$['selectImg'].setB(1.3);
		this.$['selectImg'].GPU = true;
		this.QGC.push(this.$['selectImg']);
		//提示
		for (var i = 0; i < 2; i++) {
			var tipicon = new WindmillIcon(this.UIScene);
			this.$["tipicon" + i] = tipicon;
			//ss.show();
		}
		
		var tippanle = this.UIScene.applyQuad();
  		this.UIScene.showQuad(tippanle);
  		tippanle.setTileName("tipPanle");
  		tippanle.setCenter(true);
  		tippanle.setX(gameW / 2);
  		tippanle.setY(350);
  		tippanle.setVisible(false);
  		this.$["tippanle"]=tippanle;
  		this.QGC.push(tippanle);
		
	},
	//初始化效果
	initEffect : function() {
		// 爆炸效果
		ExplodeEffect.preSet(this.EffectScene);

		
		//风车
		this.windmill = new Windmill(this.UIScene, this.ParticleScene);
		this.$['windmill'] = this.windmill;

		this.crossBomb = new CrossBomb(this.ParticleScene);
		this.$['crossBomb'] = this.crossBomb;
		for (var i = 0; i < 2; i++) {
			var tb = new TBombEffect(this.ParticleScene);
			this.$['TBombEffect' + i] = tb;
			//this.$['TBombEffectLIst'].push(tb);
		}
		
	},
	randomSetWindmill : function() {
		var t = Math.round(Math.random() * 40 + 10)
		var Queue = [Action.DelayCreate(t), Action.CallFunCreate(function() {
			var set = Math.random() * 100;
			if (set < 60) {
				var row = Math.round(Math.random() * 5 + 1);
				var col = Math.round(Math.random() * 5 + 1);
				Elem_Matrix[row][col].turnToWindmill();
			}
		})]
		//startbtn元素执行动作
		RunAction.Create(myGame.Main.curGameScene, Queue);
	},
	randomSetRandom : function() {
		var t = Math.round(Math.random() * 40 + 5)
		var Queue = [Action.DelayCreate(t), Action.CallFunCreate(function() {
			var set = Math.random() * 100;
			if (set < 40) {
				var row = Math.round(Math.random() * 5 + 1);
				var col = Math.round(Math.random() * 5 + 1);
				Elem_Matrix[row][col].turnToRandom();
			}
		})]
		//startbtn元素执行动作
		RunAction.Create(myGame.Main.curGameScene, Queue);
	},
	windmillGo : function() {
		var pos = getElePositionXY(6, 0), n = this.scoreTimes;
		if (n >2) {
			pos = getElePositionXY(5, 0);
		}
		this.windmill.show();
		this.windmill.setPosition(10, pos.y);
		var Queue = [Action.DelayCreate(.2),
		Action.CallFunCreate(function(){
				Action.Create(this.skin,0.7,{to:{GPUX:650}});
				Action.Create(this,0.7,{to:{x:650}});
			}),
		
		Action.Create(0.8, function(dt) {
			this.skin.GPUX = (this.skin.GPUX + 650 * dt);
			this.x = this.skin.GPUX;
		}).onActionEnd(function(){
			this.skin.GPUX = gameW+40;
			this.x = gameW+40;
		}), //bind this
		Action.CallFunCreate(function() {
			this.hide();
		})];

		RunAction.Create(this.windmill, Queue);
		this.totalScore += this.totalScore * 0.01 * this.scoreTimes;
	},
	tbombGo : function() {
		this.totalScore += this.totalScore * 0.03;
		GameTool.CreateTBomb();
	},
	crossBombGo : function(r, c) {
		var pos = getElePositionXY(r, c);
		var Queue = [Action.Create(0.9, function(dt) {
			this.show();
			this.setPosition(pos.x, pos.y);
		}), //bind this
		Action.CallFunCreate(function() {
			this.hide();
		})];

		RunAction.Create(this.crossBomb, Queue);
		this.totalScore += this.totalScore * 0.01;
	},
	TBombGo : function(r, c) {
		var pos1 = getElePositionXY(0, 3), pos2 = getElePositionXY(6, 3), pos3 = getElePositionXY(6, 0), pos4 = getElePositionXY(6, 6);
		var v1 = (pos2.y - pos1.y) / (12 / 60), v2 = (pos2.x - pos3.x) / (6 / 60);

		this.$['TBombEffect0'].setPosition(pos1.x, pos1.y);
		this.$['TBombEffect0'].show();
		this.$['TBombEffect1'].setPosition(pos1.x, pos1.y);
		this.$['TBombEffect1'].show();

		var Queue = [Action.DelayCreate(0.1), Action.Create(20 / 60, function(dt) {
			this.$['TBombEffect0'].styleIndex = 3;
			this.$['TBombEffect1'].styleIndex = 3;
			if (this.$['TBombEffect0'].y < pos2.y) {
				this.$['TBombEffect0'].y += dt * v1;
				this.$['TBombEffect1'].y += dt * v1;
			}
		}).onActionEnd(function() {
			this.$['TBombEffect0'].y = pos2.y;
			this.$['TBombEffect1'].y = pos2.y;
		}), //bind this
		Action.DelayCreate(0.1), Action.Create(12 / 60, function(dt) {
			this.$['TBombEffect0'].styleIndex = 2;
			this.$['TBombEffect1'].styleIndex = 0;
			if (this.$['TBombEffect0'].x > 0) {
				this.$['TBombEffect0'].x -= dt * v2;
				this.$['TBombEffect1'].x += dt * v2;
			}
		}), //bind this
		Action.CallFunCreate(function() {
			this.$['TBombEffect0'].hide();
			this.$['TBombEffect1'].hide();
		})];

		RunAction.Create(myGame.Main.curGameScene, Queue);
	},
	/////////////////////////////////游戏逻辑////////////////////////////////////////////////////
	initEle : function() {
		//init  Elem_Matrix
		for (var i = 0; i < Elem_Matrix_ROWs; i++) {
			Elem_Matrix[i] = [];
			for (var j = 0; j < Elem_Matrix_COLs; j++) {
				var elemtype = Math.round(Math.random() * 5 + 1);
				var quad = this.UIScene.applyQuad();
				this.UIScene.showQuad(quad);
				quad.setTileName("icon");
				// this.QGC.push(quad);
				quad.loop(true);
				var pp = new Elem(quad);
				pp.updataSkin(elemtype);
				Elem_Matrix[i][j] = pp;
				pp.setPostionByRowCol(i, j);
				pp.updataSub(i, j);
				pp.registEvent("Explode", this.onElemExplode);
				pp.quad.addEventListener(ss2d.MouseEvent.MOUSE_DOWN, this.onElemSelectHandler.bind(this));
			}//initExtraQuad
		}
		for (var i = 0; i < Elem_Matrix_ROWs; i++) {
			for (var j = 0; j < Elem_Matrix_COLs; j++) {
				var extraQuad = this.UIScene.applyQuad();
				this.UIScene.showQuad(extraQuad);
				extraQuad.setTileName("bomb");
				extraQuad.setVisible(false);
				Elem_Matrix[i][j].initExtraQuad(extraQuad);
			}//initExtraQuad
		}

	},
	onElemExplode : function() {
		if (this.eStatus == eElemStatus.Explode)
			return;
		this.eStatus = eElemStatus.Explode;
		switch (this.extraAttr) {
			case 0:
				this.eStatus = eElemStatus.Explode;
				break;
			case eElemExtraAttr.TBomb:
				GameTool.CreateTBomb(this.curRow, this.curCol);
				console.log("time++")
				break;
			case eElemExtraAttr.Bomb:
				GameTool.CreateBomb(this.curRow, this.curCol);
				break;
			case eElemExtraAttr.Windmill:
				GameTool.CreateWindmill(this.curRow, this.curCol);
				break;
			case eElemExtraAttr.Cross:
				GameTool.CreateCross(this.curRow, this.curCol);
				break;
			case eElemExtraAttr.Random:
				GameTool.CreateRandom(this.curRow, this.curCol);
				break;
		}

	},
	restInitEle : function() {
		//init  Elem_Matrix
		for (var i = 0; i < Elem_Matrix_ROWs; i++) {
			for (var j = 0; j < Elem_Matrix_COLs; j++) {
				var elemtype = Math.round(Math.random() * 6 + 1);
				Elem_Matrix[i][j].updataSkin(elemtype);
				//  Elem_Matrix[i][j].quad.GPUY-=6*48;
				// Elem_Matrix[i][j].born();
			}
		}
		this.Eliminate();
	},
	//////////////
	/////// 元素落下、补充流程
	//////////////
	fallDown : function() {
		this.Animation_Complete = false;

		//                动作队列
		var Queue = [Action.CallFunCreate(this.calculatefallDown), Action.CallFunCreate(this.replenish), Action.CallFunCreate(this.onfallDown_Animation), Action.DelayCreate(Elem_FallDown_Time), Action.CallFunCreate(this.onfallDown_Animation_Finish), Action.CallFunCreate(this.Eliminate)]
		//myGame.Main.curGameScene元素执行动作
		RunAction.Create(myGame.Main.curGameScene, Queue);
	},

	//=========================
	//         消除的流程
	//=========================
	Eliminate : function() {

		this.Animation_Complete = false;

		if (this.checkOut()) {
			//                动作队列
			var Queue = [Action.CallFunCreate(this.onEliminateElem),
			// Action.DelayCreate(Elem_Destory_Time*2/3),
			Action.CallFunCreate(this.fallDown)]
			//myGame.Main.curGameScene元素执行动作
			RunAction.Create(myGame.Main.curGameScene, Queue);
		} else {
			this.isOnEliminate = false;
			this.Animation_Complete = true;
			this.smartTip();
		}

	},

	//从上往下掉
	//=========================
	//   用到的算法
	//===============================

	//检测消除矩阵中的3消元素
	checkOut : function() {
		eliminate_LIST = {};
		// 五消
		eliminate_LIST["5"] = this.checkEliminate(5);
		// 		 四消除
		eliminate_LIST["4"] = this.checkEliminate(4);
		var tempArr = ArrayACutArrayB(eliminate_LIST["4"], eliminate_LIST["5"]);
		eliminate_LIST["4"] = tempArr.length > 3 ? tempArr : [];
		// 三消除
		eliminate_LIST["3"] = this.checkEliminate(3);
		return eliminate_LIST["3"].length > 0 || eliminate_LIST["4"].length > 0 || eliminate_LIST["5"].length > 0;
	},
	// 消除 需要满足的条件EliminateCount，符合条件元素的列表eliminateList
	checkEliminate : function(EliminateCount) {
		// tempArry存放颜色连续的小球，连续3个以上的放入 eliminateList 等待消除
		var tempArry = [], eliminateList = [];
		//横向消除
		for (var i = 0; i < Elem_Matrix_ROWs; i++) {
			//            指针
			var _p = Elem_Matrix[i][0];
			tempArry.push(_p);
			for (var j = 1; j < Elem_Matrix_COLs; j++) {
				if (_p.elemtype == Elem_Matrix[i][j].elemtype) {
					tempArry.push(Elem_Matrix[i][j]);
				} else {
					if (tempArry.length < EliminateCount) {
						//                        不满足3消条件  清空
						tempArry = [];
						tempArry.push(Elem_Matrix[i][j]);
					} else {
						for (var n = 0; n < tempArry.length; n++) {
							eliminateList.push(tempArry[n])
						}
						//清空数组，为新一轮准备
						tempArry = [];
						tempArry.push(Elem_Matrix[i][j]);
					}
					_p = Elem_Matrix[i][j];
				}
				//末尾
				if (j == Elem_Matrix_COLs - 1) {
					if (tempArry.length < EliminateCount) {
						//清空数组，为新一轮准备
						tempArry = [];
					} else {
						for (var n = 0; n < tempArry.length; n++) {
							eliminateList.push(tempArry[n])
						}
						//清空数组，为新一轮准备
						tempArry = [];
					}
				}
			}// for j
		}// for i

		//纵向消除
		for (var j = 0; j < Elem_Matrix_COLs; j++) {
			//            指针
			var _p = Elem_Matrix[0][j];
			tempArry.push(_p);
			for (var i = 1; i < Elem_Matrix_ROWs; i++) {
				if (_p.elemtype == Elem_Matrix[i][j].elemtype) {
					tempArry.push(Elem_Matrix[i][j]);
				} else {
					if (tempArry.length < EliminateCount) {
						//                        不满足3消条件  清空
						tempArry = [];
						tempArry.push(Elem_Matrix[i][j]);
					} else {
						for (var n = 0; n < tempArry.length; n++) {
							eliminateList.push(tempArry[n])
						}
						//清空数组，为新一轮准备
						tempArry = [];
						tempArry.push(Elem_Matrix[i][j]);
					}
					_p = Elem_Matrix[i][j];
				}
				//末尾
				if (i == Elem_Matrix_ROWs - 1) {
					if (tempArry.length < EliminateCount) {
						//清空数组，为新一轮准备
						tempArry = [];
					} else {
						for (var n = 0; n < tempArry.length; n++) {
							eliminateList.push(tempArry[n])
						}
						//清空数组，为新一轮准备
						tempArry = [];
					}
				}
			}// for i
		}// for j

		//eliminateList=ArrayUnique(eliminateList);
		return eliminateList;
	},
	//计算下落位置
	calculatefallDown : function() {
		//        logMariite();

		//         console.log("CalculatefallDown");
		//  取得下落的列号
		//      var col_list=[];
		////        这里卖个萌，记录最小下标，下落的时候就可以从这个下标开始
		//      var begin_low=6;
		//      for(var i=0;i<eliminate_LIST["3"].length;i++){
		//          var add=true;
		//          var rowNO=eliminate_LIST["3"][i].oldRow;
		//          //
		//          if(begin_low<rowNO)
		//          {
		//              begin_low=rowNO;
		//          }
		//          var colNO=eliminate_LIST["3"][i].oldCol;
		//          //不重复添加
		//          for(var j=0;j<col_list.length;j++){
		//             if(col_list[j]==colNO){
		//                 add=false;
		//             }
		//          }
		//          if(add){
		//              col_list.push(colNO);
		//          }
		//      }
		//      col_list=[0,1,2,3,4,5,6];
		var begin_low = 6;
		for (var col = 0; col < Elem_Matrix_COLs; col++) {
			// var col=col_list[n];
			//  指针
			var p1, p2, flag = false;
			for ( p1 = begin_low; p1 > -1; p1--) {
				if (Elem_Matrix[p1][col].eStatus == eElemStatus.Destroy) {

					for ( p2 = p1 - 1; p2 > -1; p2--) {
						if (Elem_Matrix[p2][col].eStatus != eElemStatus.Destroy) {
							//交换
							tmp = Elem_Matrix[p1][col];
							Elem_Matrix[p1][col] = Elem_Matrix[p2][col];
							Elem_Matrix[p1][col].curRow = p1
							Elem_Matrix[p2][col] = tmp;
							Elem_Matrix[p2][col].curRow = p2;
							break;
						} else {//如果 p2走到末尾且  eElemStatus.Destroy 可以直接退出循環
							if (p2 == 0)
								flag = true;
						}
					}
					if (flag)
						break;
				}
			}
		}
		//fall height
		fallHeight = {};
		for (var i = 0; i < eliminate_LIST["3"].length; i++) {
			var index = eliminate_LIST["3"][i].curCol;
			if (!fallHeight[index]) {
				fallHeight[index] = 1;
			} else {
				fallHeight[index]++;
			}
		}

	},
	//补充矩阵元素
	replenish : function() {
		var n = 0, temparr = [];
		for (var i = 0; i < Elem_Matrix_ROWs; i++) {
			for (var j = 0; j < Elem_Matrix_COLs; j++) {
				if (Elem_Matrix[i][j].eStatus == eElemStatus.Destroy)
					temparr.push(Elem_Matrix[i][j]);
			}
		}

		//                for(var i=0;i<eliminate_LIST["3"].length;i++)
		//                {
		//                    temparr.push(eliminate_LIST["3"][i]);
		//                }
		while ((n < 300) && (temparr.length > 0)) {
			for (var i = 0; i < temparr.length; i++) {
				if (temparr[i].eStatus == eElemStatus.Destroy)
					temparr[i].elemtype = Math.round(Math.round(Math.random() * 5 + 1));
			}
			if (!this.checkOut()) {
				break;
			}
			n++;
		}
		//已经消除的數組，显示动画用
		eliminate_LIST["3"] = temparr;
	},
	//快速提示
	smartTip : function() {
		var randomShowCount = 2;
		var moveElem, targetElem, count = 0;
		for (var r = 0; r < Elem_Matrix_ROWs; r++) {
			for (var c = 0; c < Elem_Matrix_COLs; c++) {
				targetElem = this.switchElemCheck(r, c);
				if (targetElem) {
					count++;
					//提示
					if (count == 1) {
						if(this.tipNo!=null){
							var ac=RunAction.getActionById(this.tipNo);
							if(ac){
								RunAction.removeAction(ac);
							}
						}
						var ID=RunActionClass.ActionCount+1;
						var Queue = [Action.DelayCreate(this.tipTooltime), Action.CallFunCreate(this.TipShow, [{
							row : r,
							col : c
						}, targetElem,ID])];
						//myGame.Main.curGameScene元素执行动作
						RunAction.Create(myGame.Main.curGameScene, Queue);
						this.tipNo=Queue.ID;
					} else if (count > randomShowCount) {
						break;
					}
				}
			}
			if (count > randomShowCount) {
				break;
			}
		}
		if (count <= randomShowCount) {
			this.setRandomEliminate();
		} else if (count == 0) {
			// 重置
			console.log("this no elem to swith");
			//this.restInitEle();
		}

	},

	//检查元素
	switchElemCheck : function(row, col) {
		var target = null;
		for (var Direction = 0; Direction < 4; Direction++) {
			target = null;
			var r_add = 0, c_add = 0;
			switch(Direction) {
				case 0:
					c_add = 1;
					break;
				case 1:
					r_add = 1;
					break;
				case 2:
					c_add = -1;
					break;
				case 3:
					r_add = -1;
					break;
			}
			var targetR = row + r_add, targetC = col + c_add;
			if (targetR < 0 || targetR > Elem_Matrix_ROWs - 1 || targetC < 0 || targetC > Elem_Matrix_COLs - 1)
				continue;
			//数据交换
			var tem = Elem_Matrix[row][col];
			Elem_Matrix[row][col] = Elem_Matrix[targetR][targetC];
			Elem_Matrix[targetR][targetC] = tem;
			if (this.checkOut()) {
				//恢复
				tem = Elem_Matrix[row][col], Elem_Matrix[row][col] = Elem_Matrix[targetR][targetC];
				Elem_Matrix[targetR][targetC] = tem;
				//返回目标行列
				return {
					row : targetR,
					col : targetC
				};
			}
			//恢复
			tem = Elem_Matrix[row][col], Elem_Matrix[row][col] = Elem_Matrix[targetR][targetC];
			Elem_Matrix[targetR][targetC] = tem;
		}
		return target;
	},

	//=================================
	//   动画处理效果
	//=====================================
	//小球消除动画
	onEliminateElem : function() {
		//          console.log("onEliminateElem");
		this.isOnEliminate = true;
		for (var i = 0; i < eliminate_LIST["3"].length; i++) {
			//爆炸
			eliminate_LIST["3"][i].explode();
		}
		if (eliminate_LIST["5"].length > 0) {
			//爆炸
			eliminate_LIST["5"][2].turnToCross();
		}
		if (eliminate_LIST["4"].length > 0) {
			//爆炸
			eliminate_LIST["4"][0].turnToBomb();
		}

		var Queue = [Action.DelayCreate(Elem_Destory_Time), Action.CallFunCreate(this.onEliminateElem_Finish)]
		//myGame.Main.curGameScene元素执行动作
		RunAction.Create(myGame.Main.curGameScene, Queue);
		//
		//			 RunAction.Create(myGame.Main.curGameScene,[]);

	},
	onEliminateElem_Finish : function() {
		// 连击增加
		this.$['cTimes'].addCount();

		this.$['tipicon0'].hide();
		this.$['tipicon1'].hide();
	},
	//    小球下落动画
	onfallDown_Animation : function() {
		// 		 console.log("set height");
		//        执行动画
		var col, Elem, position;
		for ( col = 0; col < Elem_Matrix_COLs; col++) {
			for (var row = 0; row < Elem_Matrix_ROWs; row++) {
				Elem = Elem_Matrix[row][col];
				if (Elem.eStatus == eElemStatus.Destroy) {

					Elem.oldRow = -1;
					position = getElePositionXY(Elem.curRow, Elem.curCol);
					//计算下落高度。
					if (fallHeight[Elem.curCol] || !(Elem.elemtype == ElemType.Cross || Elem.elemtype == ElemType.Random)) {
						Elem.setPosition(position.x, position.y - CELL_SIZE * fallHeight[Elem.curCol]);
					}
					Elem.born();
					//show
				}
				Elem.moveTo_Animation(Elem_FallDown_Time - 1 / 60);
			}
		}
	},
	onfallDown_Animation_Finish : function() {
		this.addEliminateScore();
		eliminate_LIST["3"] = [];
	},

	//小球交换 callback为 true
	onSwitchElem : function(Elem1, Elem2) {
		this.switch_Complete = false;
		Elem1.curRow = Elem2.oldRow;
		Elem1.curCol = Elem2.oldCol;
		Elem2.curRow = Elem1.oldRow;
		Elem2.curCol = Elem1.oldCol;
		Elem1.moveTo_Animation(Elem_Switch_Time / 2);
		Elem2.moveTo_Animation(Elem_Switch_Time / 2 + 1 / 60);

		Elem_Matrix[Elem1.curRow][Elem1.curCol] = Elem1;
		Elem_Matrix[Elem2.curRow][Elem2.curCol] = Elem2;

		//         Elem1.updataSub(Elem1.curRow,Elem1.curCol);
		//         Elem2.updataSub(Elem2.curRow,Elem2.curCol);

		var _Queue = [];
		//myGame.Main.curGameScene元素执行动作
		RunAction.Create(myGame.Main.curGameScene, _Queue);
	},
	onSwitchElem_Finish : function(Elem1, Elem2) {
		if (this.checkOut()) {
			this.Eliminate();
		} else {
			this.onSwitchElem(Elem1, Elem2);
		}
		this.switch_Complete = true;

	},

	/////////////functoin
	setSelectImg : function(row, col) {
		var pos = getElePositionXY(row, col)
		this.$['selectImg'].setVisible(true);
		this.$['selectImg'].GPUX = pos.x;
		this.$['selectImg'].GPUY = pos.y;
	},
	TipShow : function(d1, d2,No) {
		if(this.tipNo!=No)return;
		var pos1 = getElePositionXY(d1.row, d1.col), pos2 = getElePositionXY(d2.row, d2.col);
		this.$['tipicon0'].setPosition(pos1.x, pos1.y);
		this.$['tipicon1'].setPosition(pos2.x, pos2.y);
		this.$['tipicon0'].show();
		this.$['tipicon1'].show();
	},
	//设置随机消除函数
	setRandomEliminate : function() {
		var row = Math.round(Math.random() * 5 + 1);
		var col = Math.round(Math.random() * 5 + 1);
		Elem_Matrix[row][col].turnToRandom();
	},
	onCombooClear : function() {
		if (GAME.STATUS != GAMESTATUS.playGame)
			return;
		if (this.combooCount == this.$['cTimes'].getComboCount()) {
			this.$['cTimes'].clearCount();
			this.combooCount = 0;
		} else {
			this.combooCount = this.$['cTimes'].getComboCount();
		}
	},
	//更新分数
	updataScore : function() {
		if (GAME.STATUS != GAMESTATUS.playGame)
			return;
		if (this.curScore != this.totalScore) {
			var increate = Math.round((this.totalScore - this.curScore) / 3);
			increate = increate > 1 ? increate : 1;
			this.curScore += increate;
			this.$["scoreText"].setText("" + this.curScore);
		}
	},
	addElemScore : function(extraAttr) {
		var extraAdd = 0;
		this.totalScore += 30 * this.scoreTimes;
		switch(extraAttr) {
			case eElemExtraAttr.Time:
				extraAdd = 20;
				break;
			case eElemExtraAttr.Bomb:
				extraAdd = 100;
				break;
			case eElemExtraAttr.windmill:
				extraAdd = 500 * this.scoreTimes;
				break;
			case eElemExtraAttr.Cross:
				extraAdd = 1000;
				break;
			case eElemExtraAttr.Random:
				extraAdd = 1500;
		}
		this.totalScore += extraAdd;
	},
	addEliminateScore : function() {
		if (eliminate_LIST["4"].length > 3) {
			this.totalScore += 4 * 40 * this.scoreTimes;
		}
		if (eliminate_LIST["5"].length > 4) {
			this.totalScore += 5 * 100 * this.scoreTimes;
		}
	},
	//           消除所有标记元素
	onElimination : function() {
		for (var i = 0; i < Elem_Matrix_ROWs; i++) {
			for (var j = 0; j < Elem_Matrix_COLs; j++) {
				if (Elem_Matrix[i][j].eStatus == eElemStatus.Explode) {
					Elem_Matrix[i][j].hide();
					this.addElemScore(Elem_Matrix[i][j].extraAttr);
					myGame.Main.sound.group("sound").item("dispose").play(1);
				}
			}
		}
	},
	/////////// event
	onTBombMouseDownHandler : function(e) {
		e.target.setMouseEnabled(false);
		GameProps.tbombTool = false;
		e.target.setVisible(false);
		this.tbombGo();
	},
	
	onMouseDownHandler : function(e) {
		if (GAME.STATUS == GAMESTATUS.gameOver)
			return;
			this.isMouseDown=true;
	},
	onMouseUpHandler : function(e) {
			this.isMouseDown=false;
	},
	onMouseMoveHandler: function(e) {
		if (this.isTimeUsedUp)return;
		if (this.isMouseDown && this.selectedElem!=null){
			var elemX=this.selectedElem.quad.GPUX,
			elemY=this.selectedElem.quad.GPUY,
			m_x,m_y,switchElem,sRow=null,sCol=null;
			m_x=e.stageX-elemX;
			m_y=e.stageY-elemY;
			if(Math.abs(m_x)>20){
				//右边
				if(Math.abs(m_y)>Math.abs(m_x)){
					if(m_y>0){
						if(this.selectedElem.curCol<Elem_Matrix_ROWs-1){
							sRow=this.selectedElem.curRow+1;
							sCol=this.selectedElem.curCol;
						}
					}
					else{
						if(this.selectedElem.curCol>0){
							sRow=this.selectedElem.curRow-1;
							sCol=this.selectedElem.curCol;
						}
					}
				}
				else{
					if(m_x>0){
						if(this.selectedElem.curCol<Elem_Matrix_COLs-1){
							sRow=this.selectedElem.curRow;
							sCol=this.selectedElem.curCol+1;
						}
					}
					else{
						if(this.selectedElem.curCol>0){
							sRow=this.selectedElem.curRow;
							sCol=this.selectedElem.curCol-1;
						}
					}
				}
			}else if(Math.abs(m_y)>20){
				if(m_y>0){
						if(this.selectedElem.curRow<Elem_Matrix_ROWs-1){
							sRow=this.selectedElem.curRow+1;
							sCol=this.selectedElem.curCol;
						}
					}
					else{
						if(this.selectedElem.curRow>0){
							sRow=this.selectedElem.curRow-1;
							sCol=this.selectedElem.curCol;
						}
					}
			}
			if(sRow!=null && sCol!=null){
				switchElem=Elem_Matrix[sRow][sCol];
				var Queue = [
				Action.CallFunCreate(this.onSwitchElem, [switchElem, this.selectedElem]),
				Action.DelayCreate(Elem_Switch_Time), 
				Action.CallFunCreate(this.onSwitchElem_Finish, [switchElem, this.selectedElem])];
				RunAction.Create(myGame.Main.curGameScene, Queue);
				this.selectedElem = null;
				this.$['selectImg'].setVisible(false);
				//			完成交换
				this.isMouseDown=false;
			}
		}

	},
	onElemSelectHandler : function(e) {
		myGame.Main.sound.group("sound").item("click").play(1);
		if (this.isTimeUsedUp)return;
		//        动画过程不允许交换
		if (!this.Animation_Complete || !this.switch_Complete)return;

		var MatrixRC = getElePositionRC(e.target.GPUX, e.target.GPUY);

		if (MatrixRC.row < 0 || MatrixRC.row >= Elem_Matrix_ROWs || MatrixRC.col < 0 || MatrixRC.col >= Elem_Matrix_COLs) {
			return;
		}

		// 当前选择元素
		var cur_selectElem = Elem_Matrix[MatrixRC.row][MatrixRC.col];
		this.setSelectImg(MatrixRC.row, MatrixRC.col);

		if (!this.selectedElem) {
			this.selectedElem = cur_selectElem;

			// 特殊元素
			if (cur_selectElem.elemtype == ElemType.Cross) {
				cur_selectElem.explode();
				this.selectedElem = null;
				this.$['selectImg'].setVisible(false);
			} else if (cur_selectElem.elemtype == ElemType.Random) {
				cur_selectElem.explode();
				this.selectedElem = null;
				this.$['selectImg'].setVisible(false);
			}
			return;
		}

		var srow = cur_selectElem.curRow;
		var scol = cur_selectElem.curCol;

		if ((scol == this.selectedElem.oldCol && (srow + 1 == this.selectedElem.oldRow || srow - 1 == this.selectedElem.oldRow) ) || (srow == this.selectedElem.oldRow && (scol + 1 == this.selectedElem.oldCol || scol - 1 == this.selectedElem.oldCol) )) {
			cur_selectElem.quad.setScaleX(cur_selectElem.scale);
			cur_selectElem.quad.setScaleY(cur_selectElem.scale);
			this.selectedElem.quad.setScaleX(this.selectedElem.scale);
			this.selectedElem.quad.setScaleY(this.selectedElem.scale);

			var Queue = [Action.CallFunCreate(this.onSwitchElem, [cur_selectElem, this.selectedElem]), Action.DelayCreate(Elem_Switch_Time), Action.CallFunCreate(this.onSwitchElem_Finish, [cur_selectElem, this.selectedElem])];
			RunAction.Create(myGame.Main.curGameScene, Queue);
			this.selectedElem = null;
			this.$['selectImg'].setVisible(false);
		} else {
			this.selectedElem.quad.setScaleX(this.selectedElem.scale);
			this.selectedElem.quad.setScaleY(this.selectedElem.scale);

			this.selectedElem = cur_selectElem;
		}
	},

	/**
	 * 帧事件
	 * @param e
	 */
	onEnterFrameHandler : function(e) {
		if (GAME.STATUS == GAMESTATUS.gameOver)
			return;
		//爆炸效果
		var n, len = STARPOOL.length;
		for ( n = 0; n < len; n++) {
			if (STARPOOL[n].active) {
				STARPOOL[n].onEnterFrameHandler();
			}
		}

		if (this.isOnEliminate || this._isGamePropsTime) {
			this.onElimination();
		}

	},
	onGamePropsTime : function() {
		this._isGamePropsTime = true;
	},
	onGamePropsTimeEnd : function() {
		this._isGamePropsTime = false;
	},
	onTimeUsedUp : function() {
		this.isTimeUsedUp = true;
		this.$["tippanle"].setVisible(true);
		//text
		var overText = new ss2d.TextField(256, 128);
		overText.setFontSize(32);
		overText.setColor(1, 1, 1);
		overText.setX(gameW / 2 - 100);
		overText.setY(330);
		overText.setText("Time used Up!");
		ss2d.stage.addChild(overText);
		this.$["overText"] = overText;
		var Queue = [Action.DelayCreate(1), 
			Action.CallFunCreate(function(){
				Action.CreateTween(this.$["tippanle"],0.5,{from:{Alpha:1},to:{Alpha:0}});
				Action.CreateTween(overText,0.5,{from:{Alpha:1},to:{Alpha:0}});
			 }),
		 	Action.CallFunCreate(function(){
		 		overText.setVisible(false);
		 	}),
			Action.DelayCreate(0.4),
		    Action.CallFunCreate(this.gameOverCheck1)
		];
		RunAction.Create(myGame.Main.curGameScene, Queue);

	},
	gameOverCheck1 : function() {
		 var Queue =[];
 		Queue.push(	Action.CallFunCreate( function(){
 			 	for (var i = 0; i < Elem_Matrix_ROWs; i++) {
					for (var j = 0; j < Elem_Matrix_COLs; j++) {
						if (Elem_Matrix[i][j].extraAttr ==2){
							Elem_Matrix[i][j].explode();
						}
					}
				}
			}),
           	Action.DelayCreate(0.2),
			Action.CallFunCreate(this.fallDown),
			Action.DelayCreate(Elem_FallDown_Time+0.2),
 			Action.CallFunCreate(this.gameOverCheck2));
		RunAction.Create(myGame.Main.curGameScene, Queue);
	},
	gameOverCheck2 : function() {
		 var Queue =[];

		for (var i = 0; i < Elem_Matrix_ROWs; i++) {
			for (var j = 0; j < Elem_Matrix_COLs; j++) {
				if (Elem_Matrix[i][j].extraAttr > 2){
					Queue.push(	Action.CallFunCreate( function(r,c){
						Elem_Matrix[r][c].explode(); },[i,j]),
	               	Action.DelayCreate(0.4),
					Action.CallFunCreate(this.fallDown),
					Action.DelayCreate(Elem_FallDown_Time+0.4));
				}
			}
		}
		if(GameProps.tbombTool==true){
			Queue.push(Action.DelayCreate(1),
			Action.CallFunCreate(function() {
				if (GameProps.tbombTool) {
					this.tbombGo();
				}
			}),Action.DelayCreate(0.8));
		}
		Queue.push(Action.DelayCreate(1.5).onActionEnd(this.Animation_Complete = false),
			Action.CallFunCreate(this.onGameOver));
		RunAction.Create(myGame.Main.curGameScene, Queue);
	},
	onGameOver : function() {
		myGame.Main.sound.group("sound").item("bgm").stop();
		this.isOnEliminate = false;
		GAME.MYSCORE = this.totalScore;
		GAME.STATUS = GAMESTATUS.gameOver;
		goToNewScene(GameOver);
	},
	dispose : function() {
		RunAction.removeAction();
		this.sTimer.removeEventListener(ss2d.TimerEvent.TIMER, this.Event["sTimer"]);
		this.cClearTimer.removeEventListener(ss2d.TimerEvent.TIMER, this.Event["cClearTimer"]);

		//从池中释放
		for (var i = 0; i < this.QGC.length; i++) {
			this.QGC[i].setMouseEnabled(false);
			//	                   var scence= this.QGC[i].getScene();
			this.UIScene.hideQuad(this.QGC[i]);
			this.QGC[i].removeAllEventListeners();
			this.QGC[i].dispose();
			this.QGC[i] = null;
		}
		ss2d.stage.removeAllEventListeners();
		for (var i = 0; i < Elem_Matrix_ROWs; i++) {
			for (var j = 0; j < Elem_Matrix_COLs; j++) {
				Elem_Matrix[i][j].dispose();
			}
		}
		for (var res in this.$) {
			ss2d.stage.removeChild(this.$[res]);
			if (this.$[res] && this.$[res].dispose) {
				this.$[res].dispose();
				this.$[res] = null;
			}
		}
		var len = STARPOOL.length;
		for ( i = 0; i < len; i++) {
			this.EffectScene.hideQuad(STARPOOL[i].quad);
			STARPOOL[i].quad.dispose();
			STARPOOL[i] = null;
		}
		STARPOOL = [];
		ss2d.stage.removeChild(this.UIScene);
		ss2d.stage.removeChild(this.EffectScene);
		ss2d.stage.removeChild(this.ParticleScene);
		this.ParticleScene.dispose();
		this.UIScene = null;
		this.EffectScene = null;
		this.ParticleScene = null;
		myGame.Main.curGameScene = null;
		this.QGC = null;
		this.$ = null;

		Elem_Matrix = null;
		eliminate_LIST = null;
		this.selectedElem = null;
	}
});

GameScene.Create = function() {
	var scene = new GameScene();
	return scene;
}; 