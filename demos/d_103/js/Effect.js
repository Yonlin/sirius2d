//////
//  爆炸
//////
var PER_RAD = Math.PI / 180;

var ExplodeEffect = Class({
	quad : null,
	active : false,
	alpha : 1,
	angle : 0,
	speed : 1,
	rotation : 0,
	scale : 0.1,
	_incre_x : 0,
	_incre_y : 0,
	cutAlpha : 0,
	initialize : function(quad) {
		this.quad = quad;
		this.quad.GPU = true;
		this.quad.GPUX = -50;
		this.quad.GPUY = -50;
		this.quad.setCenter(true);
		this.active = false;
		this.quad.setAlpha(0);
	},
	luanch : function(cutAlpha, angle, speed) {
		this.alpha = 1;
		this.cutAlpha = cutAlpha;
		this.angle = angle;
		this.speed = speed;
		this.rotation = 0;
		this.scale = 0.1;
		this._incre_y = (Math.sin(this.angle * PER_RAD) * this.speed);
		//Math.round(
		this._incre_x = (Math.cos(this.angle * PER_RAD) * this.speed);
		this.active = true;
		this.quad.setAlpha(this.alpha);
		this.quad.setVisible(true);
	},
	onEnterFrameHandler : function(dt) {
		if (!this.active)return;
		if (this.alpha > 0) {
			this.quad.GPUX += this._incre_x;
			this.quad.GPUY += this._incre_y;
			this.rotation += 12;
			this.alpha -= this.cutAlpha;
			this.scale += 0.025;
			this.quad.setRotation(this.rotation);
			this.quad.setAlpha(this.alpha);
			this.quad.setScaleX(this.scale);
			this.quad.setScaleY(this.scale);
		} else {
			this.dispose();
		}
	},
	play : function(time) {
		this.active = true;
	},
	dispose : function() {
		this.active = false;
		this.quad.setVisible(false);
	}
})

ExplodeEffect.create = function(x, y) {

	for (var i = 0; i < 6; i++) {
		var star = ExplodeEffect.getElem();
		if (star) {
			star.quad.setTileName("star1");
			star.luanch(0.08, i * 60, 4);
			star.quad.GPUX = x;
			star.quad.GPUY = y;
			star.play(1 / 6);
		}
		var star2 = ExplodeEffect.getElem();
		if (star2) {
			star2.quad.setTileName("star3");
			star2.luanch(0.05, i * 60 + 30, 2);
			star2.quad.GPUX = x;
			star2.quad.GPUY = y;
			star2.play(3 / 12);
		}
	}
}
ExplodeEffect.preSet = function(effectScene) {

	for (var i = 0; i < 200; i++) {
		var star = effectScene.applyQuad();
		effectScene.showQuad(star);
		star.setTileName("star1");
		star.setR(2);
		star.setG(2);
		star.setB(2);
		STARPOOL.push(new ExplodeEffect(star));
	}

}
ExplodeEffect.getElem = function() {
	var EffectElem, i, len = STARPOOL.length;
	for ( i = 0; i < len; i++) {
		if (!STARPOOL[i].active) {
			EffectElem = STARPOOL[i];
			break;
		}
	}
	return EffectElem;
}
//
//logMariite=function(){
//  var str;
//  for(var i= 0;i<Elem_Matrix.length;i++){
//      str="";
//      for(var j= 0;j<Elem_Matrix[0].length;j++){
////              str+="["+Elem_Matrix[i][j].eStatus+"],";
//          str+="[r:"+Elem_Matrix[i][j].oldRow+",c:"+Elem_Matrix[i][j].oldCol+"],"
//      }
//      console.log(str);
//  }
//
//}
//logMariite2=function(){
//  var str;
//  for(var i= 0;i<Elem_Matrix.length;i++){
//      str="";
//      for(var j= 0;j<Elem_Matrix[0].length;j++){
//          str+="["+Elem_Matrix[i][j].elemtype+"],";
////              str+="[r:"+Elem_Matrix[i][j].curRow+",c:"+Elem_Matrix[i][j].curCol+"],"
//      }
//      console.log(str);
//  }
//
//}

var CrossBomb = Class({
	particleScene : null,
	particleStyleList : null,
	particleEmittersCPUList : null,
	isPlay : false,
	Event : null,
	x : 0,
	y : 0,
	_initData : function() {
		this.particleStyleList = [];
		this.particleEmittersCPUList = [];
		this.Event = {};
	},
	initialize : function(particleScene) {
		this._initData();
		this.particleScene = particleScene;
		this.initParticle();
		this.Event['onframe'] = this.onFrame.bind(this);
		ss2d.stage.addEventListener(ss2d.Event.ENTER_FRAME, this.Event['onframe']);
	},
	initParticle : function() {
		//创建场景
		//添加粒子资源
		ss2d.stage.addChild(this.particleScene);
		this.particleScene.blend(ss2d.Blend.BLEND_ADD_ALPHA);
		//创建一个粒子发射器
		for (var i = 0; i < 4; i++) {
			this.particleEmittersCPUList.push(new ss2d.ParticleEmittersCPU(this.particleScene, 60));
			//设置粒子样式
			this.particleStyleList.push(MyParticleStyle.CrossParticle(i));
		}
	},
	setPosition : function(x, y) {
		this.x = (x);
		this.y = (y);
	},
	show : function() {
		this.isPlay = true;
	},
	hide : function() {
		this.isPlay = false;
	},
	onFrame : function() {
		if (!this.isPlay)
			return;
		for (var i = 0; i < this.particleEmittersCPUList.length; i++) {
			this.particleEmittersCPUList[i].sendParticle(this.x, this.y, this.particleStyleList[i]);
		}
	},
	dispose : function() {
		ss2d.stage.addEventListener(ss2d.Event.ENTER_FRAME, this.Event['onframe']);
		for (var i = 0; i < this.particleEmittersCPUList.length; i++) {
			this.particleEmittersCPUList[i].dispose();;
			this.particleEmittersCPUList[i] = null;
		}
		this.particleEmittersCPUList = null;
		this.particleStyleList = null;
		this.particleScene = null;
	}
});

var TBombEffect = Class({
	particleScene : null,
	particleStyleList : null,
	particleEmittersCPU : null,
	isPlay : false,
	Event : null,
	styleIndex : 3,
	x : 0,
	y : 0,
	_initData : function() {
		this.particleStyleList = [];
		this.Event = {};
	},
	initialize : function(particleScene) {
		this._initData();
		this.particleScene = particleScene;
		this.initParticle();
		this.Event['onframe'] = this.onFrame.bind(this);
		ss2d.stage.addEventListener(ss2d.Event.ENTER_FRAME, this.Event['onframe']);
	},
	initParticle : function() {
		//创建场景
		//添加粒子资源
		ss2d.stage.addChild(this.particleScene);
		this.particleScene.blend(ss2d.Blend.BLEND_ADD_ALPHA);
		//创建一个粒子发射器
		this.particleEmittersCPU = new ss2d.ParticleEmittersCPU(this.particleScene, 60);
		for (var i = 0; i < 4; i++) {
			//设置粒子样式
			this.particleStyleList.push(MyParticleStyle.TBombParticle(i));
		}
	},
	setPosition : function(x, y) {
		this.x = (x);
		this.y = (y);
	},
	show : function() {
		this.isPlay = true;
	},
	hide : function() {
		this.isPlay = false;
	},
	onFrame : function() {
		if (!this.isPlay)
			return;
		this.particleEmittersCPU.sendParticle(this.x, this.y, this.particleStyleList[this.styleIndex]);
	},
	dispose : function() {
		this.isPlay = false;
		ss2d.stage.addEventListener(ss2d.Event.ENTER_FRAME, this.Event['onframe']);
		this.particleEmittersCPU.dispose();
		this.particleEmittersCPU = null;
		this.particleStyleList = null;
		this.particleScene = null;
	}
}); 