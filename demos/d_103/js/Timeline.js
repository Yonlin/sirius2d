/**
 * Created by chongchong on 14-4-15.
 */
///////////////
// 转盘倒计时
//////////////

var TimeLine = Class({
	scene : null,
	timer : null,
	curTime : 60,
	skin : null,
	Bottom : null,
	tick : null,
	_timelineText : null,
	isStart:false,
	callback : null,
	Event : null,
	initialize : function(scene) {
		this.scene = scene;
		this.Event = {};
		this.timer = null;
		this.curTime = 60;

		this.timer = new ss2d.Timer(1000);
		this.Event["timeRun"] = this.timeRun.bind(this);
		this.Event["onFrame"] = this.onFrame.bind(this);
		this.timer.addEventListener(ss2d.TimerEvent.TIMER, this.Event["timeRun"]);
		ss2d.stage.addEventListener(ss2d.Event.ENTER_FRAME, this.Event["onFrame"]);
		
		this.skin = new ss2d.Group();

		this.Bottom = this.scene.applyQuad();
		this.scene.showQuad(this.Bottom);
		this.Bottom.setTileName("startbottom");
		this.Bottom.setCenter(true);

		this.tick = this.scene.applyQuad();
		this.scene.showQuad(this.tick);
		this.tick.setTileName("timetick");
		this.tick.setCenter(true);
		this.tick.setRotation(-90);
		this.tick.setPivotX(-4);
		this.tick.setPivotY(2);
		this.tick.GPU = true;
		this.skin.addChild(this.Bottom);
		this.skin.addChild(this.tick);

		//  设置文本位置
		this._timelineText = new ss2d.TextField(128, 128);
		this._timelineText.setFontSize(80);
		this._timelineText.setColor(252 / 255, 158 / 255, 23 / 255);
		this._timelineText.setX(-40);
		this._timelineText.setY(-40);
		this._timelineText.setText("60");
		ss2d.stage.addChild(this._timelineText);
		this.skin.addChild(this._timelineText);
	},
	initTextPosition : function() {
		// bug 这是一个bug?
		//this.skin.addChild(this._timelineText);
	},
	setPosition : function(x, y) {
		this.skin.setX(x);
		this.skin.setY(y);
	},
	timeRun : function() {
		if (this.curTime > 0) {
			this.curTime--;
			this._timelineText.setText(this.curTime > 9 ? ("" + this.curTime) : ("0" + this.curTime));
			//          console.log(this.name)
		}
		if (this.curTime == 0) {
			console.log("time  used up!");
			if (this.callback) {
				this.callback();
			}
			this.timer.stop();
		}
	},
	onFrame:function(){
		var anlge=this.tick.getRotation()
		if ( anlge< 270 && this.isStart) {
				this.tick.setRotation(anlge + RunAction.dt * 360 / 60);
			}
	},
	start : function() {
		this.timer.start();
		this.isStart=true;
		this.tick.setRotation(-96);
	},
	dispose : function() {
		ss2d.stage.removeChild(this._timelineText);
		this.timer.removeEventListener(ss2d.TimerEvent.TIMER, this.Event["timeRun"]);
		ss2d.stage.removeEventListener(ss2d.Event.ENTER_FRAME, this.Event["onFrame"]);
		this.timer = null;
   		this.skin.dispose();
		this.skin = null;
		this.scene.hideQuad(this.Bottom);
		this.scene.hideQuad(this.tick);
		this.Bottom.dispose();
		this.tick.dispose();
		this.curTime=null;
		this.scene=null;
		this.callback=null;
		this._timelineText=null;
		this.Event=null;
	}
})
