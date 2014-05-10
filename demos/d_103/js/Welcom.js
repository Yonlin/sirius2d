/**
 * Created with JetBrains WebStorm.
 * User: chongchong
 * Date: 14-3-14
 * Time: 下午10:20
 * To change this template use File | Settings | File Templates.
 */

var WelcomScene = Class({
	
	SceneName : "welcom",

	QGC : null, //回收quad
	$ : null,
	gameTextur : null,
	myGameScene : null,
	PropsPage : null,
	WelcomPage : null,
	isTipShow:true,
	Animation_Complete:true,
	gameW : 0,
	gameH : 0,
	/**
	 * 初始化
	 */
	_initData : function() {
		GAME.STATUS = GAMESTATUS.welcom;
		this.QGC = [];
		this.$ = {};
		for (var name in GameProps) {
			GameProps[name] = false;
		}
		GameProps["quickTips"] = true;
	},
	initialize : function() {
		this._initData();
		myGame.Main.curGameScene = this;
		RunAction = new RunActionClass();
		RunAction.RunAC();
		this._init();
	},

	_init : function() {

		this.gameW = ss2d.Stage2D.stageWidth;
		this.gameH = ss2d.Stage2D.stageHeight;

		this.myGameScene = myGame.Main.Res["UI"];
		ss2d.stage.addChild(this.myGameScene);
		// this.addToScene("myGameScene",this.myGameScene);

		this.initBG();

		this.initAction();

		this.initUI();

	},
	initBG : function() {
		var bg = this.myGameScene.applyQuad();
		this.myGameScene.showQuad(bg);
		bg.setTileName("bgfff");
		bg.setWidth(this.gameW);
		bg.setHeight(this.gameH);
		bg.setX(0);
		bg.setY(0);
		this.QGC.push(bg);
	},
	initAction : function() {

	},
	initUI : function() {

		//////////////btnstart
		var btn_X = this.gameW / 2, btn_Y = this.gameH - 130;
		var btnBottom = this.myGameScene.applyQuad();
		this.myGameScene.showQuad(btnBottom);
		btnBottom.setTileName("startbottom");
		btnBottom.setCenter(true);
		btnBottom.setX(btn_X);
		btnBottom.setY(btn_Y);
		this.QGC.push(btnBottom);

		var startbtn = this.myGameScene.applyQuad();
		this.myGameScene.showQuad(startbtn);
		startbtn.setTileName("start");
		startbtn.setRotation(-90);
		startbtn.setCenter(true);
		startbtn.setPivotX(-4);
		startbtn.setPivotY(2);
		startbtn.setX(btn_X);
		startbtn.setY(btn_Y);
		this.QGC.push(startbtn);
		this.$['startbtn'] = startbtn;
		// 添加事件
		startbtn.setMouseEnabled(true);
		startbtn.addEventListener(ss2d.MouseEvent.MOUSE_UP, this.onStartbtnMouseDownHandler.bind(startbtn));
		//////////////btnend
		this.welcomUI();
		this.propsUI();
		ss2d.stage.addEventListener(ss2d.MouseEvent.MOUSE_DOWN,this.onStageMouseDownHandler.bind(this));
	},
	welcomUI : function() {
		var btn_X = this.gameW / 2, btn_Y = this.gameH - 130;
		var group = new ss2d.Group();
		var title = this.myGameScene.applyQuad();
		this.myGameScene.showQuad(title);
		title.setTileName("title");
		title.setCenter(true);
		//              title.setX(this.gameW/2);
		title.setY(-400);
		this.QGC.push(title);
		group.addChild(title);

		var eye1 = this.myGameScene.applyQuad();
		this.myGameScene.showQuad(eye1);
		eye1.setTileName("eye");
		eye1.setCenter(true);
		eye1.setX(80);
		eye1.setY(-250);
		this.QGC.push(eye1);

		var eye2 = this.myGameScene.applyQuad();
		this.myGameScene.showQuad(eye2);
		eye2.setTileName("eye");
		eye2.setCenter(true);
		eye2.setX(-80);
		eye2.setY(-250);
		this.QGC.push(eye2);

		var heart = this.myGameScene.applyQuad();
		this.myGameScene.showQuad(heart);
		heart.setTileName("heart");
		heart.setCenter(true);
		// heart.setX(this.gameW/2);
		heart.setY(-160);
		this.QGC.push(heart);

		group.addChild(eye1);
		group.addChild(eye2);
		group.addChild(heart);
		//位置
		group.setX(btn_X);
		group.setY(btn_Y);
		this.WelcomPage = group;
	},
	propsUI : function() {
		var btn_X = this.gameW / 2, btn_Y = this.gameH - 130;
		var group = new ss2d.Group();
		var title = this.myGameScene.applyQuad();
		this.myGameScene.showQuad(title);
		title.setTileName("props");
		title.setCenter(true);
//		title.setY(-460);
		title.setY(-360);
		this.QGC.push(title);
		this.$['title'] = title;
		group.addChild(title);

		var search = this.myGameScene.applyQuad();
		this.myGameScene.showQuad(search);
		search.setTileName("quickTips");
		search.setCenter(true);
		search.setX(-90);
		search.setY(-200);
		search.setMouseEnabled(true);
		search.setUserData({
			name : "quickTips",
			isCheck : false
		});
		search.addEventListener(ss2d.MouseEvent.MOUSE_DOWN, this.onMouseDownHandler.bind(this));
		this.QGC.push(search);

		var tbombTool = this.myGameScene.applyQuad();
		this.myGameScene.showQuad(tbombTool);
		tbombTool.setTileName("tbombTool");
		tbombTool.setCenter(true);
		tbombTool.setX(0);
		tbombTool.setY(-260);
		tbombTool.setMouseEnabled(true);
		tbombTool.setUserData({
			name : "tbombTool",
			isCheck : false
		});
		tbombTool.addEventListener(ss2d.MouseEvent.MOUSE_DOWN, this.onMouseDownHandler.bind(this));
		this.QGC.push(tbombTool);

		var superMode = this.myGameScene.applyQuad();
		this.myGameScene.showQuad(superMode);
		superMode.setTileName("Supercombos");
		superMode.setCenter(true);
		superMode.setX(90);
		superMode.setY(-200);
		superMode.setMouseEnabled(true);
		superMode.setUserData({
			name : "Supercombos",
			isCheck : false
		});
		superMode.addEventListener(ss2d.MouseEvent.MOUSE_DOWN, this.onMouseDownHandler.bind(this));
		this.QGC.push(superMode);

		var timetool = this.myGameScene.applyQuad();
		this.myGameScene.showQuad(timetool);
		timetool.setTileName("timeOffers");
		timetool.setCenter(true);
		timetool.setX(0);
		timetool.setY(-140);
		timetool.setMouseEnabled(true);
		timetool.setUserData({
			name : "timeOffers",
			isCheck : false
		});
		timetool.addEventListener(ss2d.MouseEvent.MOUSE_DOWN, this.onMouseDownHandler.bind(this));
		this.QGC.push(timetool);

		var tippanle = this.myGameScene.applyQuad();
		this.myGameScene.showQuad(tippanle);
		tippanle.setTileName("tipPanle");
		tippanle.setCenter(true);
		tippanle.setX(0);
		tippanle.setY(-350);
		tippanle.setVisible(false);
		this.QGC.push(tippanle);
		this.$['tippanle'] = tippanle;

		this.tipText = new ss2d.TextField(256, 128);
		this.tipText.setFontSize(25);
		this.tipText.setColor(255 / 255, 94 / 255, 0 / 255);
		this.tipText.setX(-128);
		this.tipText.setY(-370);
		this.tipText.setVisible(false);
		this.tipText.setText("Your can only select 3 props!");
		ss2d.stage.addChild(this.tipText);
		
		group.addChild(superMode);
		group.addChild(timetool);
		
		group.addChild(search);
		group.addChild(tbombTool);
		
		group.addChild(tippanle);
		group.addChild(this.tipText);

		//////// check icon
		for (var i = 0; i < 4; i++) {
			var check = this.myGameScene.applyQuad();
			this.myGameScene.showQuad(check);
			check.setTileName("check");
			check.setCenter(true);
			check.setX(0);
			check.setY(-350);
			check.setVisible(false);
			this.$['check' + (i + 1)] = check;
			group.addChild(check);
			this.QGC.push(check);
		}
		this.$['check1'].setX(-90 + 20);
		this.$['check1'].setY(-200 + 20);
		this.$['check1'].setVisible(true);

		this.$['check2'].setX(0 + 20);
		this.$['check2'].setY(-260 + 20);

		this.$['check3'].setX(90 + 20);
		this.$['check3'].setY(-200 + 20);

		this.$['check4'].setX(0 + 20);
		this.$['check4'].setY(-140 + 20);

		////////
		//位置
		group.setX(btn_X);
		group.setY(btn_Y + 200);
		group.setRotation(180);
		this.PropsPage = group;
	},
	showTip:function(){
		this.isTipShow=true;
		this.Animation_Complete=false;
		var Queue = [ 
			Action.CreateTween(this.$['title'],0.4,{to:{Y:-460}}),
			Action.CallFunCreate(function(){this.$['tippanle'].setVisible(true);}),
			Action.CreateTween(this.$['tippanle'],0.25,{from:{Alpha:0},to:{Alpha:1}}),
			Action.CallFunCreate(function(){this.tipText.setVisible(true);this.isTipShow=true;this.Animation_Complete=true;})
		];
		RunAction.Create(myGame.Main.curGameScene, Queue);
	},
	hideTip:function(){
		this.isTipShow=false;
		this.Animation_Complete=false;
		var Queue = [ 
			Action.CallFunCreate(function(){
				this.tipText.setVisible(false);
			}),
			Action.CreateTween(this.$['tippanle'],0.2,{to:{Alpha:0}}),
			Action.CallFunCreate(function(){this.$['tippanle'].setVisible(false);}),
			Action.CreateTween(this.$['title'],0.3,{to:{Y:-360}}),
			Action.CallFunCreate(function(){this.isTipShow=false;this.Animation_Complete=true;})
		]
		RunAction.Create(myGame.Main.curGameScene, Queue);
	},
	onTurnToPropspage : function() {
		var vars1={from:{Rotation:0},to:{Y:(650),Rotation:180}},
			vars2={from:{Y:(this.gameH - 130),Rotation:-180},to:{Y:(this.gameH - 130),Rotation:0}};
		var Queue = [
			Action.CallFunCreate(function() {
			Action.CreateTween(this.WelcomPage,0.4,vars1);
			Action.CreateTween(this.PropsPage,0.4,vars2);
		}), Action.DelayCreate(0.6), Action.CallFunCreate(function() {
			GAME.STATUS = GAMESTATUS.selectProps;
		}),
			Action.CallFunCreate(this.showTip)
		]
		//startbtn元素执行动作
		RunAction.Create(myGame.Main.curGameScene, Queue);

	},
	onStartbtnMouseDownHandler : function(e) {
		if(this.Animation_Complete==false)return;
		//                动作队列
		this.setMouseEnabled(false);
		var target=myGame.Main.curGameScene.$['startbtn']
		var Queue = [
		Action.CreateTween(target,0.4,{from:{Rotation:-90},to:{Rotation:270}}),
		Action.CallFunCreate(function() {
			this.$['startbtn'].setMouseEnabled(true);
			if (GAME.STATUS == GAMESTATUS.selectProps) {
				goToNewScene(GameScene);
			}
		})];
		//startbtn元素执行动作
		RunAction.Create(myGame.Main.curGameScene, Queue);

		if (GAME.STATUS == GAMESTATUS.welcom) {
			myGame.Main.curGameScene.onTurnToPropspage();
		}
	},
	onStageMouseDownHandler:function(e){
		if((e.target instanceof  ss2d.Stage2D))
        {
          if(this.isTipShow &&  this.Animation_Complete)myGame.Main.curGameScene.hideTip();
        }
	},
	onMouseDownHandler : function(e) {
		//e.target
		//   "You can only choose three props"
		var UserData = e.target.getUserData();
		if (UserData && UserData.name) {
			var name = UserData.name, n;
			switch(name) {
				case 'quickTips':
					n = 1;
					GameProps.quickTips = !GameProps.quickTips;
					break;
				case 'tbombTool':
					GameProps.tbombTool = !GameProps.tbombTool;
					n = 2;
					break;
				case 'Supercombos':
					GameProps.Supercombos = !GameProps.Supercombos;
					n = 3;
					break;
				case 'timeOffers':
					GameProps.timeOffers = !GameProps.timeOffers;
					n = 4;
					break;
			}

			UserData.isCheck = !UserData.isCheck;
			if (UserData.isCheck) {
				this.$['check' + n].setVisible(true);
			} else {
				this.$['check' + n].setVisible(false);
			}
			//  选道具
			//GameProps[name]=UserData.isCheck;
			if(!this.isTipShow && this.Animation_Complete)myGame.Main.curGameScene.showTip();
		}
		myGame.Main.sound.group("sound").item("click").play(1);
	},
	dispose : function() {
		RunAction.removeAction();
		this.PropsPage.dispose();
		this.WelcomPage.dispose();
		ss2d.stage.removeAllEventListeners();
		//从池中释放
		for (var i = 0; i < this.QGC.length; i++) {
			var scence = this.QGC[i].getScene();
			scence.hideQuad(this.QGC[i]);
			this.QGC[i].removeAllEventListeners();
			this.QGC[i].dispose();
			this.QGC[i] = null;
		}
		this.QGC = [];
		//需要从舞台移除的资源
		for (var res in this.$) {
			ss2d.stage.removeChild(this.$[res]);
			if (this.$[res].dispose) {
				this.$[res].dispose();
			}
			this.$[res] = null;
		}
		ss2d.stage.removeChild(this.UIScene);
		this.myGameScene = null;;
  		this.PropsPage = null;
  		this.WelcomPage = null;
		this.QGC = null;
		this.$ = null;
		myGame.Main.curGameScene = null;
	}
});

WelcomScene.Create = function() {
	var scene = new WelcomScene();
	return scene;
}; 