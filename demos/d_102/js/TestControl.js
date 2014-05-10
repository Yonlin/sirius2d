this.demo = this.demo||{};
(function(){
	demo.TestControl= Class
	(
		{
			Extends:demo.TestMain,

			initialize:function()
            {
                demo.Main.sound.group("sound").item("gameing").play(-1);

                this.heroM_Win = false;
                this.heroN_Win = false;

                this.hitPointArr = ["",{x:60,y:365},{x:540,y:345},{x:540,y:365},{x:60,y:360}];
            	this.type = 1;
            	this.index = 0;

            	//背景容器
            	this.bgSprite = new ss2d.Sprite;
            	ss2d.stage.addChild(this.bgSprite);

            	// this.png01=demo.Main.assets.getResult("01");
	            // this.png02=demo.Main.assets.getResult("02");
	            // this.png03=demo.Main.assets.getResult("03");
	            // this.png04=demo.Main.assets.getResult("04");
	            // this.png04r=demo.Main.assets.getResult("04r");

                this.texture01 = new ss2d.Texture(demo.Main.assets.getResult("01"));
                this.texture02 = new ss2d.Texture(demo.Main.assets.getResult("02"));
                this.texture03 = new ss2d.Texture(demo.Main.assets.getResult("03"));
                this.texture04 = new ss2d.Texture(demo.Main.assets.getResult("04"));

                this.texture04r = new ss2d.Texture(demo.Main.assets.getResult("04r"));

                this.mc = new ss2d.MovieClip(this.texture01);
                this.bgSprite.addChild(this.mc);

                this.roundMc = new ss2d.MovieClip(this.texture04r);
                this.roundMc.setScaleX(3/4);
                this.roundMc.setScaleY(3/4);
                this.roundMc.setCenter(true);

                //初始化游戏
                // this.Main = new demo.Other01();
                this.init();
                this.game01();

                //文字
                this.txtSprite = new ss2d.Sprite;
            	ss2d.stage.addChild(this.txtSprite);

                this.txt = new ss2d.TextField(256,32);
                this.txt.setFontSize(16);
                this.txt.setColor(0xff,0,0);
                this.txt.setText("到达指定亮点继续下一关");
                this.txt.setX(120);
                this.txt.setY(10);
                this.txtSprite.addChild(this.txt);
                //第几关
                this.txtLevel = new ss2d.TextField(64,32);
                this.txtLevel.setFontSize(16);
                this.txtLevel.setColor(0xff,0,0);
                this.txtLevel.setText("01");
                this.txtLevel.setX(95);
                this.txtLevel.setY(10);
                this.txtSprite.addChild(this.txtLevel);

                this.winAnimal = this.getQuad("light");
                this.winAnimal.loop(false);

                this.starAnimal = this.getQuad("star");
                this.starAnimal.setColor(0xff0000);
                this.starAnimal.loop(true);
                this.starAnimal.play();
                var obj = this.hitPointArr[this.type];
                this.winAnimal.setX(obj.x);
                this.winAnimal.setY(obj.y);
                this.starAnimal.setX(obj.x);
                this.starAnimal.setY(obj.y);

                //键盘事件
                ss2d.global.addEventListener('keydown', this._onKeydownHandler.bind(this), false);
                ss2d.global.addEventListener('keyup', this._onKeyupHandler.bind(this), false);

            },

            //左右控制
            initNext:function()
            {
            	// if(this.index == this.type){//相同的时候不进行处理
            	// 	return;
            	// }

            	this.index = this.type;

            	if(this.mc) {
                    this.bgSprite.removeChild(this.mc);
                    this.mc.dispose();
                    this.mc = null;
                }
            	
            	var aa = this["texture0" + this.type];

            	this.mc = new ss2d.MovieClip(aa);
                this.bgSprite.addChild(this.mc);
                this.txtLevel.setText("0"+this.type);

                this.destoryAll();//清除场景刚体
                this["game0" + this.type]();

                var obj = this.hitPointArr[this.type];

                this.winAnimal.setX(obj.x);
                this.winAnimal.setY(obj.y);
                this.starAnimal.setX(obj.x);
                this.starAnimal.setY(obj.y);
            },

            _onKeydownHandler : function(e)
            {
                
            },

            _onKeyupHandler : function(e)
            {
                var code = e.keyCode;
                if(code == 37){
                	this.type--;
                }else if(code == 39){
					this.type++;
                }

                if(this.type < 1){
                	this.type = 4;
                }else if(this.type > 4){
                	this.type = 1;
                }

                if(code == 37 || code == 39){                	
                	this.initNext();
                }
            },

            //第一关
            game01:function()
            {
            	//静态刚体
                this.bodyDef.type = b2body.b2_staticBody;


                //创建固定刚体
                this.creatDefRect(350,10,175,400);////底
                this.creatDefRect(170,36,320,104);//上左
                this.creatDefRect(36,90,420,45);//上右

                this.creatDefRect(144,76,275,354);//下左
                this.creatDefRect(96,74,470,354);//下右下
                this.creatDefRect(38,34,500,300);//下右上
                //动态刚体
                this.bodyDef.type = b2body.b2_dynamicBody;

                //主角
                this.creatHero(new ss2d.Point(325,23),new ss2d.Point(505,200));
            },
            //第二关
            game02:function()
            {
            	//静态刚体
                this.bodyDef.type = b2body.b2_staticBody;

                //创建固定刚体
                this.creatDefRect(358,26,420,388);//底

                this.creatDefRect(348,22,304,118);//上

                this.creatDefRect(156,22,132,215,"",18);//中
                this.creatDefRect(160,24,520,243);//中右

                this.creatDefRect(60,50,212,376);//下左
                //动态刚体
                this.bodyDef.type = b2body.b2_dynamicBody;

                //主角
                this.creatHero(new ss2d.Point(300,35),new ss2d.Point(525,175));
            },
            //第三关
            game03:function()
            {
            	//静态刚体
                this.bodyDef.type = b2body.b2_staticBody;

                //创建固定刚体
                this.creatDefRect(366,10,413,400);//底边

                this.creatDefRect(82,94,182,353);//下

                this.creatDefRect(60,24,195,138,"",16);//上左
                this.creatDefRect(180,24,320,147);//上中
                this.creatDefRect(186,24,500,115,"",-20);//上右
                //动态刚体
                this.bodyDef.type = b2body.b2_dynamicBody;

                //主角
                this.creatHero(new ss2d.Point(260,60),new ss2d.Point(360,60));
            },

            //第四关
            game04:function()
            {
            	//静态刚体
                this.bodyDef.type = b2body.b2_staticBody;

                //创建固定刚体
                this.creatDefRect(170,30,85,405);//底边

                this.creatDefRect(82,80,202,365);//下左
                this.creatDefRect(78,80,410,365);//下右

                this.creatDefRect(252,18,126,148);//上左
                this.creatDefRect(238,18,480,148);//上右
                //动态刚体
                this.bodyDef.type = b2body.b2_dynamicBody;

                //主角
                this.creatHero(new ss2d.Point(230,50),new ss2d.Point(390,50));               

                
				var fixture1,fixture2,fixture3;
				fixture1 = new b2FixtureDef();
				fixture1.density = 1.0;
                fixture1.fixction = 0.5;
                fixture1.restitution = 0;
				fixture1.shape = new b2PolygonShape;
				fixture1.shape.SetAsOrientedBox(150/this.rate/2,10/this.rate/2,new b2Vec2(0, 0),0);
				
				fixture2 = new b2FixtureDef();
				fixture2.density = 1.0;
                fixture2.fixction = 0.5;
                fixture2.restitution = 0;
				fixture2.shape = new b2PolygonShape;
				fixture2.shape.SetAsOrientedBox(150/this.rate/2,10/this.rate/2,new b2Vec2(0, 0),2*Math.PI/3);

				fixture3 = new b2FixtureDef();
				fixture3.density = 1.0;
                fixture3.fixction = 0.5;
                fixture3.restitution = 0;
				fixture3.shape = new b2PolygonShape;
				fixture3.shape.SetAsOrientedBox(150/this.rate/2,10/this.rate/2,new b2Vec2(0, 0),4*Math.PI/3);
				
				var ground = this.world.GetGroundBody();
				var anchor;
				var _body;
				
				var testDef = new b2BodyDef();
				testDef.type = b2body.b2_dynamicBody;
                testDef.userData = this.roundMc;
                this.bgSprite.addChild(this.roundMc);
				testDef.position.Set(300 / this.rate, 240 / this.rate);
				
				_body = this.world.CreateBody(testDef);
				_body.CreateFixture(fixture1);
				_body.CreateFixture(fixture2);
				_body.CreateFixture(fixture3);
				// _body.SetMassFromShapes();
				_body.m_angularVelocity = 1;
				
				var reJoint;
				var revolute = new b2RevoluteJointDef();
				anchor = new b2Vec2(300 / this.rate, 240 / this.rate);
				revolute.Initialize(ground, _body, anchor);
				revolute.enableLimit = true;
				revolute.motorSpeed = 1;
				revolute.lowerAngle = -30 * (180 / Math.PI);
				revolute.upperAngle = 30 * (180/Math.PI);
				reJoint = this.world.CreateJoint(revolute);


            },


            updata:function()
            {
                demo.TestControl.Super.prototype.updata.call(this);

                
                if(this.heroMBody && this.pointHitBody(this.heroMBody)) {
                    this.destoryBody(this.heroMBody);
                    this.heroMBody = null;
                    this.heroM_Win = true;

                    this.winAnimal.gotoAndPlay(1);
                }
                if(this.heroNBody && this.pointHitBody(this.heroNBody)) {
                    this.destoryBody(this.heroNBody);
                    this.heroNBody = null;
                    this.heroN_Win = true;

                    this.winAnimal.gotoAndPlay(1);
                }

                if(this.heroM_Win && this.heroN_Win){//两个都到达目的地  下一关
                    this.heroN_Win = false;
                    this.heroM_Win = false;
                    this.type++;
                    if(this.type > 4)this.type = 1;

                    this.timer = new ss2d.Timer(1000,1);
                    this.timer.addEventListener(ss2d.TimerEvent.TIMER_COMPLETE,this.timerHandler.bind(this));
                    this.timer.start();
                }

                //出边界刷新
                if((this.heroNBody && this.heroNBody.GetPosition().y > 400/this.rate && this.heroN_Win == false) || //掉下去了刷新
                    (this.heroMBody && this.heroMBody.GetPosition().y > 400/this.rate && this.heroM_Win == false)){
                    this.initNext();
                }
            },

            timerHandler:function()
            {
                this.timer.stop();
                this.timer.removeEventListener(ss2d.TimerEvent.TIMER_COMPLETE,this.timerHandler);
                this.initNext();
            },

            //刚体到达某个位置
            pointHitBody: function(body)
            {
                var point = new ss2d.Point(body.GetPosition().x*this.rate,body.GetPosition().y*this.rate);
                var ud = body.GetDefinition().userData;
                if(!ud) return;

                var width = ud.getWidth();
                var height = ud.getHeight();

                var obj = this.hitPointArr[this.type];
                var distanceX = Math.abs(point.x-obj.x);
                var distanceY = Math.abs(point.y-obj.y);
                if (distanceX <= width / 2 &&
                    distanceY <= height / 2)
                {
                    return true;
                }
                return false
            },
		}
	);
})();