var Windmill = Class({
	sence : null,
	skin : null,
	rotate : 360,
	r : 24,
	isPlay : false,
	Event : null,
	particleScene : null,
	particleEmittersCPU : null,
	particleStyle : null,
	x : 0,
	y : 0,
	initialize : function(sence, particleScene) {
		this.sence = sence;
		this.Event={};
		this.particleScene = particleScene;
		this.initSprite();
		this.initParticle();
		this.Event['onframe'] = this.onFrame.bind(this);
		ss2d.stage.addEventListener(ss2d.Event.ENTER_FRAME, this.Event['onframe']);
	},
	initSprite : function() {
		this.skin = this.sence.applyQuad();
		this.sence.showQuad(this.skin);
		this.skin.setTileName("fan");
		this.skin.setCenter(true);
		this.skin.setPivotX(-9);
		this.skin.setPivotY(-2);
		this.skin.GPU = true;
		this.skin.setVisible(false);
	},
	initParticle : function() {
		//创建场景
		//添加粒子资源
		ss2d.stage.addChild(this.particleScene);
		this.particleScene.blend(ss2d.Blend.BLEND_ADD_ALPHA);
		//创建一个粒子发射器
		this.particleEmittersCPU = new ss2d.ParticleEmittersCPU(this.particleScene, 60);
		//设置粒子样式
		this.particleStyle = MyParticleStyle.WindmillParticle();
	},
	setPosition : function(x, y) {
		this.skin.GPUX = x;
		this.skin.GPUY = y;
		this.x = x;
		this.y = y;
	},
	show : function() {
		this.skin.setVisible(true);
		//this.skin.setVisible(true);
		this.isPlay = true;
	},
	hide : function() {
		this.skin.setVisible(false);
		this.isPlay = false;
	},
	onFrame : function() {
		if (!this.isPlay)
			return;
		if (this.rotate > 359) {
			this.rotate = 0;
		}
		this.skin.setRotation(this.rotate);
		this.particleEmittersCPU.sendParticle(this.x, this.y, this.particleStyle);
		this.rotate += 6;
	},
	dispose : function() {
		ss2d.stage.addEventListener(ss2d.Event.ENTER_FRAME, this.Event['onframe']);
		this.particleEmittersCPU.dispose();;
		this.particleEmittersCPU = null;
		this.sence.hideQuad(this.skin);
		this.skin.dispose();
		this.skin = null;
		this.sence = null;
		this.particleScene = null;
		this.rotate=null;
	}
});

var WindmillIcon = Class({
	sence : null,
	skin : null,
	quadList : null,
	groupList:null,
	rotate : 360,
	r : 24,
	isPlay : false,
	Event : null,

	initialize : function(sence) {
		this.sence = sence;
		this.quadList = [];
		this.groupList=[];
		this.Event = {}, this.skin = new ss2d.Group();
		this.initGroup();
		this.Event['onframe'] = this.onFrame.bind(this);
		ss2d.stage.addEventListener(ss2d.Event.ENTER_FRAME, this.Event['onframe']);
	},
	initGroup : function() {
		for(var i=0;i<3;i++){
			this.groupList[i]=new ss2d.Group();
		}
		var group1 = new ss2d.Group(), group2 = new ss2d.Group(), group3 = new ss2d.Group();
		var sk1 = this.sence.applyQuad();
		this.sence.showQuad(sk1);
		sk1.setTileName("lizi");
		sk1.setPivotX(11);
		sk1.setPivotY(33);
		sk1.setRotation(215);
		sk1.setX(this.r);
		sk1.GPU = true;

		var sk2 = this.sence.applyQuad();
		this.sence.showQuad(sk2);
		sk2.setTileName("lizi");
		sk2.setPivotX(11);
		sk2.setPivotY(33);
		sk2.setRotation(215);
		sk2.setX(this.r);
		sk2.GPU = true;

		var sk3 = this.sence.applyQuad();
		this.sence.showQuad(sk3);
		sk3.setTileName("lizi");
		sk3.setPivotX(11);
		sk3.setPivotY(33);
		sk3.setRotation(215);
		sk3.setX(this.r);
		sk3.GPU = true;

		this.quadList.push(sk1);
		this.quadList.push(sk2);
		this.quadList.push(sk3);

		this.groupList[0].addChild(sk1);
		this.groupList[0].setRotation(0);
		this.groupList[1].addChild(sk2);
		this.groupList[1].setRotation(120);
		this.groupList[2].addChild(sk3);
		this.groupList[2].setRotation(240);


		for(var i=0;i<3;i++){
			this.skin.addChild(this.groupList[i]);
		}
		this.hide();
	},
	show : function() {
		for (var i = 0; i < this.quadList.length; i++) {
			this.quadList[i].setVisible(true);
		}
		this.isPlay = true;
	},
	hide : function() {
		for (var i = 0; i < this.quadList.length; i++) {
			this.quadList[i].setVisible(false);
		}
		this.isPlay = false;
	},
	setPosition : function(x, y) {
		this.skin.setX(x);
		this.skin.setY(y);
	},
	onFrame : function() {
		if (!this.isPlay)
			return;
		if (this.rotate < 2) {
			this.rotate = 360;
		}

		this.skin.setRotation(this.rotate);
		this.rotate -= 2;
	},
	dispose : function() {
		this.isPlay = false;
		ss2d.stage.addEventListener(ss2d.Event.ENTER_FRAME, this.Event['onframe']);
		for (var i = 0; i < this.quadList.length; i++) {
			this.sence.hideQuad(this.quadList[i]);
			this.quadList[i].dispose();
			this.quadList[i] = null;
		}
		for(var i=0;i<3;i++){
			this.groupList[i].dispose();
			this.groupList[i]=null;
		}
		this.quadList = [];
		this.sence = null;
		//this.skin.dispose();
		this.skin = null;
		this.rotate = null;
		this.r = null;
		this.Event = null;
	}
}); 