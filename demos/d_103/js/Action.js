/**
 * Created by chongchong on 14-4-15.
 */
///////////////////
//  Animation
///////////////////
var Animation = Class({
	ID : 0,
	_duration : 0.00001,
	_delay : 0,
	_timeSclale : 1,
	_active : null,
	_reversed : false, // 反转
	_startTime : 0, //开始播放时间
	immediateRender : false,
	_paused : false, //暂停
	vars : null, //变量参数
	repeat : 1, // <=-1 无限循环
	isStart : false,
	target : null,
	totalTime : 0,
	isComplete : false,
	_onAnimateStartFired : false,
	_onAnimateStart : null,
	_onAnimateUpdata : null,
	_onAnimateEnd : null,
	initialize : function() {
	},
	getPaused : function() {
		return this._paused;
	},
	setPaused : function(value) {
		this._paused = value;
	},
	setDelay : function(value) {
		this.delay = value;
		return this;
	},
	setRepeat : function(value) {
		this.repeat = value;
		return this;
	},
	bind : function(target) {
		this.target = target;
		return this;
	},
	run : function(dt) {

	},
	onActionStart : function(fun) {
		this._onAnimateStart = fun;
		return this;
	},
	onActionUpdata : function(fun) {
		this._onAnimateUpdata = fun;
		return this;
	},
	onActionEnd : function(fun) {
		this._onAnimateEnd = fun;
		return this;
	},
	dispose : function() {
		this._onAnimateStart = null;
		this._onAnimateUpdata = null;
		this._onAnimateEnd = null;
		this.isStart = false;
		this.isComplete = true;
	}
});
//////////
/// Tween
//////////
var Tween = Class({
	Extends : Animation,
	_duration : 0.00001,
	_delay : 0,
	_timeSclale : 1,
	_active : null,
	_reversed : false, // 反转
	_yoyo : false, //正常-》反转播放
	immediateRender : false,
	starStatus : null,
	endStatus : null,
	curStatus : null,
	ease : null,
	_initData : function() {
		this._duration = 0.00001;
		this._delay = 0;
		this.totalTime = 0;
		this.curStatus = {};
		this.starStatus = {};
		this.endStatus = {};
		this.vars = {};
		this.data = {};
	},
	initialize : function(target, duration, vars) {
		this._initData();
		this.ID = RunActionClass.ActionCount + 1;
		this.repeat = vars.repeat || 1;
		if (target != null) {
			this.target = target;
		} else {
			throw "Cannot tween a null target.";
		}
		if (vars != null) {
			this._vars = vars;
		} else {
			throw "Cannot tween a vars.";
		}
		this._duration = duration || 1;
		this._timeSclale = vars.tiemScale || 1;
		this.ease = vars.ease ||
		function(t, b, c, d) {
			return c * t / d + b;
		};
		this.setStartStaus();
		this.setEndStaus();
		return this;
	},
	setStartStaus : function() {
		var status = {};
		if (this._vars.from == null) {
			for (var p in this._vars.to) {
				if (this.target["get"+p]!=null) {
					status[p] = this.target["get"+p]();
				} else if(this.target[p]!=null) {
					status[p] = this.target[p];
				}
			}
		} else {
			status = this._vars.from;
		}
		this.startStatus = status;
	},
	setEndStaus : function() {
		this.endStatus = this._vars.to;
	},
	getStartStaus : function() {
		return this.starStatus;
	},
	getEndStaus : function() {
		return this.endStatus;
	},
	run : function(dt) {

		//      	动作开始
		if (!this._onAnimateStartFired) {
			if (this._onAnimateStart) {
				this._onAnimateStart();
			}
			this._onAnimateStartFired = true;
		}
		//      		动作中
		if (this.totalTime <= this._duration) {

			if (this.repeat > 0 || this.repeat < 0) {
				if (this._onAnimateUpdata) {
					this._onAnimateUpdata();
				}
			} else if (this.repeat == 0) {
				if (this._onAnimateEnd) {
					this._onAnimateEnd();
				}
			}
		} else {
			if (this.repeat > 0) {
				//重置
				this.totalTime = 0;
				this.repeat--;
			}
			//      动作结束
			if (this.repeat == 0) {
				if (this._onAnimateEnd) {
					this._onAnimateEnd();
				}
				//停止
				this.isStart = false;
				this.isComplete = true;
			}
		}
		this.totalTime += dt;

	},
	_onAnimateStart : function() {
		for (var p in this.startStatus) {
			if (this.target["set"+p]!= null) {
				this.target["set"+p](this.startStatus[p]);
			} else if(this.target[p]!= null) {
				this.target[p] = this.startStatus[p];
			}
		}
	},
	_onAnimateUpdata : function() {
		for (var p in this.endStatus) {
			this.curStatus[p] = this.ease(this.totalTime, this.startStatus[p], this.endStatus[p] - this.startStatus[p], this._duration);
			if (this.target["set"+p]!= null) {
				this.target["set"+p](this.curStatus[p]);
			} else if(this.target[p]!= null){
				this.target[p] = this.curStatus[p];
			}
		}
	},
	_onAnimateEnd : function() {
		for (var p in this.endStatus) {
			if (this.target["set"+p]!= null) {
				this.target["set"+p](this.endStatus[p]);
			} else if(this.target[p]!= null){
				this.target[p] = this.endStatus[p];
			}
		}
	}
	////////////////
}
);
/////////how to use vars ?//////
//vars={
//	delay:0
//repeat:1
//ease:function(){}
//	to:{
//		GPUX:20,
//		X:20,
//		Rotation:360
//	}
//from:{
//		GPUX:20,
//		X:20,
//		Rotation:360
//	}
//tiemScale:1
//}
//////////////
Tween.To = function(target, duration, vars) {
	var tween = new Tween(target, duration, vars);

	return tween;
};

///////////////////
//  Action
///////////////////
var Action = Class({
	Extends : Animation,
	_initData : function() {
		this._duration = 0.00001;
		this.totalTime = 0;
		this.isStart = false;
		this.isComplete = false;
		this._onAnimateStartFired = false;
		this.vars = null;
		this._onAnimateStart = null;
		this._onAnimateUpdata = null;
		this._onAnimateEnd = null;
	},
	initialize : function(duration, fun, vars, repeat) {
		this._initData()
		this.ID = RunActionClass.ActionCount + 1;
		this._duration = duration;
		this._onAnimateUpdata = fun;
		this.vars = vars || null;
		this.repeat = repeat || 1;
		return this;
	},
	run : function(dt) {
		if (this.vars) {
			//				if(this._onAnimateStartFired){
			//					this.vars.pop();
			//				}
			//				this.vars.push(dt);
		} else {
			this.vars = [dt];
		}

		//      	动作开始
		if (!this._onAnimateStartFired) {
			if (this._onAnimateStart) {
				this._onAnimateStart();
			}
			this._onAnimateStartFired = true;
		}
		//      		动作中
		if (this.totalTime < this._duration) {

			if (this.repeat > 0 || this.repeat < 0) {
				if (this._onAnimateUpdata) {
					this._onAnimateUpdata.apply(this.target, this.vars);
				}
			} else if (this.repeat == 0) {
				if (this._onAnimateEnd) {
					this._onAnimateEnd.call(this.target);
				}
			}
		} else {
			if (this.repeat > 0) {
				//重置
				this.totalTime = 0;
				this.repeat--;
			}
			//      动作结束
			if (this.repeat == 0) {
				if (this._onAnimateEnd) {
					this._onAnimateEnd.call(this.target);
				}
				//停止
				this.isStart = false;
				this.isComplete = true;
			}
		}
		this.totalTime += dt;
	}
	///////
}
);
Action.CallFunCreate = function(fun, vars) {
	var callfn = new Action(0.0001, fun, vars, 1);
	return callfn;
};
Action.DelayCreate = function(delay) {
	var Delay = new Action(delay, null, null, 1);
	return Delay;
};
Action.Create = function(time, fun, vars, repeat) {
	var action = new Action(time, fun, vars, repeat);
	return action;
};

Action.CreateTween = function(target, duration, vars) {
	var tween = new Tween(target, duration, vars), Delay = new Action(duration, null, null, 1);
	RunAction.Create(null, [tween]);
	return Delay;
};

var RunAction = null;
///////////////
///RunActionClass
//////////////
var RunActionClass = Class({
	STATIC : {
		ActionCount : 0
	},
	ActionsLists : null,
	target : null,
	isRunAC : false,
	stopAction : false,
	curFrame : 0,
	totalFrames : 0,
	dt : 0,
	_lastTime : 0,
	_indelay : false,
	_listener : null,
	_initData : function() {
		this.curFrame = 0;
		this.totalFrames = 0;
		this.isRunAC = false;
		this.ActionsLists = [];
		this._listener = {};
	},
	initialize : function() {
		this._initData();
		this._listener[this._onFrameUpdata] = this._onFrameUpdata.bind(this);
		RunActionClass.ActionCount = 0;
	},

	dispose : function() {
		this.ActionsLists = null;
		this.isRunAC = false;
		ss2d.stage.removeEventListener(ss2d.Event.ENTER_FRAME, this._listener[this._onFrameUpdata], false);
	},
	RunAC : function() {
		ss2d.stage.removeEventListener(ss2d.Event.ENTER_FRAME, this._listener[this._onFrameUpdata], false);
		ss2d.stage.addEventListener(ss2d.Event.ENTER_FRAME, this._listener[this._onFrameUpdata], false);
		this.isRunAC = true;
		this._lastTime = Date.now();
	},
	addAction : function(action) {
		RunActionClass.ActionCount++;
		action.ID = RunActionClass.ActionCount;
		this.ActionsLists.push(action);
	},
	removeAction : function(action) {
		var index = this.ActionsLists.indexOf(action);
		if (index > -1) {
			this.ActionsLists.splice(index, 1);
		}
	},
	getActionId : function(action) {
		var id = null;
		for (var i = 0; i < this.ActionsLists.length; i++) {
			if (this.ActionsLists[i] === action) {
				id = this.ActionsLists[i].ID;
				break;
			}
		}
		return id;
	},
	getActionById : function(id) {
		var action = null;
		for (var i = 0; i < this.ActionsLists.length; i++) {
			if (this.ActionsLists[i].ID === id) {
				action = this.ActionsLists[i];
				break;
			}
		}
		return action;
	},
	_onFrameUpdata : function() {
		if (!this.isRunAC) {
			return;
		}
		var curTime = Date.now();
		this.dt = (curTime - this._lastTime) / 1000;
		this._lastTime = curTime;

		for (var n = 0; n < this.ActionsLists.length; n++) {
			if (this.ActionsLists[n].length > 0) {
				var ac = this.ActionsLists[n][0];
				if (ac.isStart) {
					ac.run(this.dt);
				} else {
					this.ActionsLists[n].splice(0, 1);
					if (this.ActionsLists[n][0])
						this.ActionsLists[n][0].isStart = true;
				}
			} else {
				this.removeAction(this.ActionsLists[n]);
			}
		}
	},
	Create : function(target, actionlist) {
		if (actionlist.length > 0) {
			for (var i = 0; i < actionlist.length; i++) {
				if (!actionlist[i].target) {
					actionlist[i].target = target;
				}
			}
			actionlist[0].isStart = true;
			this.addAction(actionlist);
		}

	}
});

