/**
 * Created with JetBrains WebStorm.
 * User: chongchong
 * Date: 14-3-14
 * Time: 下午10:20
 * To change this template use File | Settings | File Templates.
 */

var GameOver = Class({

	SceneName : "welcom",
	QGC : null,
	$ : null,

	UIScene : null,
	gameW : 0,
	gameH : 0,
	curScore : 0,
	totalScore : 0,
	/**
	 * 初始化
	 */
	_initData : function() {
		this.QGC = [];
		this.$ = {};
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

		this.totalScore = GAME.MYSCORE;
		//创建背景
		this.UIScene =  myGame.Main.Res["UI"];
		ss2d.stage.addChild(this.UIScene);

		this.initBG();

		this.initUI();

		var Queue = [Action.DelayCreate(0.5), Action.Create(0.5, this.updataScore)]

		RunAction.Create(this, Queue);
	},
	initBG : function() {
		var bg = this.UIScene.applyQuad();
		this.UIScene.showQuad(bg);
		bg.setTileName("bgfff");
		bg.setWidth(this.gameW);
		bg.setHeight(this.gameH);
		bg.setX(0);
		bg.setY(0);
		this.QGC.push(bg);
	},
	initUI : function() {

		//////////////btnstart
		var btn_X = this.gameW / 2, btn_Y = this.gameH / 2;
		var scorebox = this.UIScene.applyQuad();
		this.UIScene.showQuad(scorebox);
		scorebox.setTileName("gameover-score");
		scorebox.setCenter(true);
		scorebox.setRotation(-90);
		scorebox.setX(btn_X + 10);
		scorebox.setY(200);
		this.QGC.push(scorebox);

		var gameicon = this.UIScene.applyQuad();
		this.UIScene.showQuad(gameicon);
		gameicon.setTileName("game");
		gameicon.setCenter(true);
		gameicon.setX(btn_X);
		gameicon.setY(400);
		this.QGC.push(gameicon);

		var scoreText1 = new ss2d.TextField(128, 128);
		scoreText1.setFontSize(30);
		scoreText1.setColor(0, 0, 0);
		scoreText1.setX(btn_X - 60);
		scoreText1.setY(130);
		scoreText1.setText("YOUR GOT");
		ss2d.stage.addChild(scoreText1);
		this.$['scoreText1'] = scoreText1;
		var scoreText2 = new ss2d.TextField(128, 128);
		scoreText2.setFontSize(30);
		scoreText2.setColor(0, 0, 0);
		scoreText2.setX(btn_X);
		scoreText2.setY(230);
		scoreText2.setText("SCORE!");
		ss2d.stage.addChild(scoreText2);
		this.$['scoreText2'] = scoreText2;
		//  totalScore
		this.scoreText = new ss2d.TextField(128, 128);
		this.scoreText.setFontSize(40);
		this.scoreText.setColor(1, 1, 1);
		this.scoreText.setX(btn_X - 40);
		this.scoreText.setY(180);
		this.scoreText.setText("0");
		ss2d.stage.addChild(this.scoreText);
		this.$['scoreText3'] = this.scoreText;

		var startbtn = this.UIScene.applyQuad();
		this.UIScene.showQuad(startbtn);
		startbtn.setTileName("refresh");
		startbtn.setCenter(true);
		startbtn.setX(btn_X);
		startbtn.setY(btn_Y + 180);
		this.QGC.push(startbtn);
		this.$['startbtn'] = startbtn;
		// 添加事件
		startbtn.setMouseEnabled(true);
		startbtn.addEventListener(ss2d.MouseEvent.MOUSE_UP, this.onStartbtnMouseDownHandler.bind(startbtn));
		//////////////btnend
	},
	onStartbtnMouseDownHandler : function(e) {
		// 防止重复点击
		this.setMouseEnabled(false);
		var Queue = [	
				Action.CreateTween(this,0.5,{from:{Rotation:360},to:{Rotation:0}}),
				Action.CallFunCreate(function() {
					goToNewScene(WelcomScene);
				})];
		//startbtn元素执行动作
		RunAction.Create(myGame.Main.curGameScene, Queue);
	},
	//更新分数
	updataScore : function() {
		if (this.curScore != this.totalScore) {
			var increate = Math.round((this.totalScore - this.curScore) / 5);
			increate = increate > 1 ? increate : 1;
			this.curScore += increate;
			this.scoreText.setText("" + this.curScore);
		}
	},

	//          addToScene:function(child){
	//              this.QGC.push(child);
	//          },
	dispose : function() {
		RunAction.removeAction();
		ss2d.stage.removeAllEventListeners();
		//从池中释放
		for (var i = 0; i < this.QGC.length; i++) {
			this.QGC[i].setMouseEnabled(false);
			this.UIScene.hideQuad(this.QGC[i]);
			this.QGC[i].removeAllEventListeners();
			this.QGC[i].dispose();
			this.QGC[i]=null;
		}
		for (var res in this.$) {
			ss2d.stage.removeChild(this.$[res]);
			if (this.$[res].dispose) {
				this.$[res].dispose();
			}
			this.$[res]=null
		}
		ss2d.stage.removeChild(this.UIScene);
		myGame.Main.curGameScene = null;
		this.QGC = null;
		this.$=null;
	}
});

GameOver.Create = function() {
	var scene = new GameOver();
	return scene;
}; 