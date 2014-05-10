/**
 * Created by chongchong on 14-4-15.
 */

var ComboTimes = Class({
	scene : null,
	timer : null,
	curTime : 60,
	skin : null,
	Bottom : null,
	tick : null,
	cTimesText : null,
	_comboCount : 0,
	_MaxCallback : null,
	initialize : function(scene) {
		this.scene = scene;
		this.timer = null;
		this.curTime = 60;
		this.skin = null;
		this.cTimesText = null;

		this.timer = new ss2d.Timer(1000);
		this.timer.addEventListener(ss2d.TimerEvent.TIMER, this.timeRun.bind(this));

		this.skin = new ss2d.Group();

		this.Bottom = this.scene.applyQuad();
		this.scene.showQuad(this.Bottom);
		this.Bottom.setTileName("combobottom");
		this.Bottom.setCenter(true);
		this.Bottom.setPivotX(0);
		this.Bottom.setPivotY(5);

		this.tick = this.scene.applyQuad();
		this.scene.showQuad(this.tick);
		this.tick.setTileName("comboTick");
		this.tick.setCenter(true);
		this.tick.setRotation(-155);
		this.tick.setPivotX(-1);
		this.tick.setPivotY(0);
		this.tick.GPU = true;
		this.skin.addChild(this.Bottom);
		this.skin.addChild(this.tick);

		//  设置文本位置
		this.cTimesText = new ss2d.TextField(128, 128);
		this.cTimesText.setFontSize(30);
		this.cTimesText.setColor(252 / 255, 158 / 255, 23 / 255);
		this.cTimesText.setX(-7);
		this.cTimesText.setY(-14);
		this.cTimesText.setText("0");
		ss2d.stage.addChild(this.cTimesText);
		this.skin.addChild(this.cTimesText);
	},
	initTextPosition : function() {
		// bug 这是一个bug?
		this.skin.addChild(this.cTimesText);
	},
	getComboCount : function() {
		return this._comboCount;
	},
	setPosition : function(x, y) {
		this.skin.setX(x);
		this.skin.setY(y);
	},
	timeRun : function() {
		if (this.curTime > 0) {
			this.curTime--;
			this.cTimesText.setText(this.curTime > 9 ? ("" + this.curTime) : ("0" + this.curTime));
			//          console.log(this.name)
		} else if (this.curTime == 0) {
			console.log("time  used up!");
			this.timer.stop();
		}
	},
	goToAngle : function(angle) {
		var targetAngle = angle;
		var addAngle = (targetAngle - this.tick.getRotation()) / 0.5;

		var Queue = [Action.Create(0.5, function(dt) {
			var angle = this.getRotation();
			if ((angle < targetAngle && addAngle > 0) || (angle > targetAngle && addAngle < 0)) {
				this.setRotation(angle + dt * addAngle);
			}

		}).onActionEnd(function() {
			this.setRotation(targetAngle);
		})]
		//startbtn元素执行动作
		RunAction.Create(this.tick, Queue);
	},
	addCount : function() {
		var angle = -155;
		this._comboCount++;
		if (this._comboCount > 4)
			this._comboCount = 4;
		switch(this._comboCount) {
			case 0:
				angle = -155;
				break;
			case 1:
				angle = -125;
				break;
			case 2:
				angle = -98;
				break;
			case 3:
				angle = -70;
				break;
			case 4:
				angle = -30;
				break;
		}
		this.cTimesText.setText("" + this._comboCount);
		this.goToAngle(angle);
		if (this._comboCount == 4 && this._MaxCallback) {
			this._MaxCallback();
		}
	},
	onMaxCallback : function(fn) {
		this._MaxCallback = fn;
	},
	clearCount : function() {
		this._comboCount = 0;
		this.cTimesText.setText("0");
		this.goToAngle(-155);
	},

	start : function() {
		this.timer.start();
		var Queue = [Action.CallFunCreate(function() {
			this.setRotation(-90);
		}), Action.Create(60, function(dt) {
			if (this.getRotation() < 360) {
				this.setRotation(this.getRotation() + RunAction.dt * 360 / 60);
			}
		})]
		//startbtn元素执行动作
		RunAction.Create(this.tick, Queue);
	},
	dispose : function() {
		ss2d.stage.removeChild(this.cTimesText);
		this.scene.hideQuad(this.Bottom);
		this.scene.hideQuad(this.tick);
		this.Bottom.dispose();
		this.tick.dispose();
		this.skin.dispose();
		this.skin=null;
		this.Bottom=null;
		this.tick=null;
		this.scene = null;
	}
})

var ComboLine = Class({
	scene : null,
	Textrue : null,
	timer : null,
	totalTime : 6,
	curTime : 6,
	skin : null,
	speed : null,
	bottom : null,
	lineShape : null,
	line : null,
	lineLenth : 0,
	isStart : false,
	_EndCallback : null,
	initialize : function(scene) {
		this.scene = scene;
		this.skin = new ss2d.Group();

		this.bottom = this.scene.applyQuad()
		this.scene.showQuad(this.bottom);
		this.bottom.setTileName("comboline");
		this.bottom.setCenter(true);
		this.bottom.setRotation(-90);
		

		//创建影片剪辑
		//create movie clip
		this.line = this.scene.applyQuad()
		this.scene.showQuad(this.line);
		this.line.setTileName("coml");
		this.line.setCenter(true)
		this.line.setRotation(-90);
		this.line.setAlpha(0.8);
		this.lineLenth = this.line.getWidth();
		this.speed = this.lineLenth / this.totalTime;
		this.line.setTileWidthOffset(-this.lineLenth);
		
		
		this.skin.addChild(this.bottom);
		this.skin.addChild(this.line);

		this.timer = new ss2d.Timer(1000);
		this.timer.addEventListener(ss2d.TimerEvent.TIMER, this.timeRun.bind(this));
	},
	timeRun : function() {
		if (this.curTime > 0) {
			this.curTime--;
		} else if (this.curTime == 0) {
			if (this._EndCallback) {
				this._EndCallback();
			}
			this.isStart = false;
			this.timer.stop();
		}
	},

	start : function() {
		if (this.isStart)
			return;
		this.isStart = true;
		this.timer.start();

		this.line.setTileWidthOffset(0);
		var h = this.lineLenth, speed = this.speed;

		var Queue = [Action.Create(this.totalTime, function(dt) {
			if (this.getTileWidthOffset() > -h) {
				this.setTileWidthOffset(this.getTileWidthOffset() - dt * speed);
			}
		}).onActionEnd(function() {
			this.setTileWidthOffset(-h);
		})]
		RunAction.Create(this.line, Queue);
	},
	setTotalTime : function(n) {
		this.curTime = this.totalTime = n;
	},
	setPosition : function(x, y) {
		this.skin.setX(x);
		this.skin.setY(y);
	},
	onEndCallback : function(fn) {
		this._EndCallback = fn;
	},
	dispose : function() {
		this.scene.hideQuad(this.bottom);
		this.bottom.dispose();
		this.scene.hideQuad(this.line);
		this.line.dispose();
		this.skin.dispose();
		this.skin=null;
		this.bottom=null;
		this.line=null;
		this.scene = null;
	}
})