this.demo = this.demo||{};
(function(){

    demo.TestMain = Class
    (
        {

            init:function()
            {
                var png=demo.Main.assets.getResult("resass.png"),//png 资源
                    xml=demo.Main.assets.getResult("resass.xml");//png 资源对应生成的xml文件
                var gameTexture=new ss2d.Texture(png,xml);//  从引擎中创建一个纹理
                // this._Res["gameTexture"]=gameTexture;//场景切换后，需要释放的资源
                this.myGameScene = new ss2d.Scene(gameTexture,50);
                ss2d.stage.addChild(this.myGameScene);

                this.radius=10;
                this.maxRadius = 50;
                this.minRadius = 10;

                b2body = Box2D.Dynamics.b2Body,
                b2AABB = Box2D.Collision.b2AABB,
                b2World = Box2D.Dynamics.b2World,
                b2Vec2 = Box2D.Common.Math.b2Vec2,
                b2Fixture = Box2D.Dynamics.b2Fixture,
                b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
                b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
                b2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
                b2BodyDef = Box2D.Dynamics.b2BodyDef,
                b2MouseJointDef = Box2D.Dynamics.Joints.b2MouseJointDef,
                b2JointDef = Box2D.Dynamics.Joints.b2JointDef,
                b2Joint = Box2D.Dynamics.Joints.b2Joint,
                b2RevoluteJoint = Box2D.Dynamics.Joints.b2RevoluteJoint,
                b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef,
                b2DebugDraw = Box2D.Dynamics.b2DebugDraw;


                this.rate = 30;
                this.world = new b2World(
                       new b2Vec2(0, 10)    //gravity
                    ,  true                 //allow sleep
                 );

                this.fixDef = new b2FixtureDef();
                this.fixDef.density = 1.0;
                this.fixDef.fixction = 0.5;
                this.fixDef.restitution = 0.5;
                //边界
                this.bodyDef = new b2BodyDef;
                this.bodyDef.type = b2body.b2_staticBody;
                //创建边界
                // this.creatDefRect(10,400,5,200,"box1");
                // this.creatDefRect(10,400,595,200,"box1");
                ss2d.stage.addEventListener(ss2d.Event.ENTER_FRAME, this.onEnterFrameHandler.bind(this));


                var context = document.getElementById("canvas1").getContext("2d");
                // 显示刚体
                var debugDraw = new b2DebugDraw();
                debugDraw.SetSprite(context);
                debugDraw.SetDrawScale(30.0);
                debugDraw.SetFillAlpha(0.5);
                debugDraw.SetLineThickness(1.0);
                debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
                this.world.SetDebugDraw(debugDraw);


                ss2d.stage.addEventListener(ss2d.MouseEvent.MOUSE_DOWN, this.mouseDownHandler.bind(this));
                ss2d.stage.addEventListener(ss2d.MouseEvent.MOUSE_UP, this.mouseUpHandler.bind(this));
            },

            //创建主角
            creatHero:function(piontM,pointW)
            {
                this.heroMBody = this.creatDefCircle(piontM.x,piontM.y,25,"arc5");
                this.heroNBody = this.creatDefCircle(pointW.x,pointW.y,25,"arc6");
            },

            //得到quad
            getQuad:function(str){
                var quad = this.myGameScene.applyQuad();

                this.myGameScene.showQuad(quad);
                quad.setTileName(str);
                quad.setCenter(true);
                return quad;
             },
            /*
             *鼠标down事件
             */
            mouseDownHandler:function(e)
            {
            	ss2d.stage.addEventListener(ss2d.MouseEvent.MOUSE_MOVE, this.handleMouseMove.bind(this));
            	this.isMouseDown = true;         
                this.radius = this.minRadius;
                this.handleMouseMove(e);       
                this.point1 = new ss2d.Point(this.mouseX,this.mouseY);
            },
            /*
             *鼠标up事件
             */
            mouseUpHandler:function(e)
            {
            	ss2d.stage.removeEventListener(ss2d.MouseEvent.MOUSE_MOVE, this.handleMouseMove.bind(this));
                this.isMouseDown = false;

                var body = this.getBodyAtMouse();
                if(this.radius > this.minRadius && !body && 
                    ss2d.Point.distance(this.point1,this.point2)==0) {
                    this.creatDefCircle(this.point1.x,this.point1.y,this.radius,"arc1");
                }else if(this.point1&&this.point2&& !body &&
                    ss2d.Point.distance(this.point1,this.point2) > 15){
                    this.creatDefRect(Math.abs(this.point2.x-this.point1.x),
                                    Math.abs(this.point2.y-this.point1.y),
                                    (this.point1.x + (this.point2.x-this.point1.x)/2),
                                    (this.point1.y + (this.point2.y-this.point1.y)/2),"box2");
                }

                this.distroyNeedCircle();
                this.distroyNeedRect();
                this.point2 = null;
                
                   // if(body) this.destoryBody(body);
               if(body && body.m_userData && (body.m_userData._tileName == "box2" || 
                        body.m_userData._tileName == "arc1"
                )) {
                  this.destoryBody(body);
               }
            },
            
            /*
             *鼠标move事件
             */
            handleMouseMove:function(e) {
            	// ss2d.Stage2D.mouseX
            	this.mouseX = ss2d.Stage2D.mouseX;
            	this.mouseY = ss2d.Stage2D.mouseY;

                if(this.point2){
                    if(this.needCircle&&ss2d.Point.distance(this.point1,this.point2) != 0){
                        this.distroyNeedCircle();
                    }

                    if(this.isMouseDown && !this.needRect && 
                        ss2d.Point.distance(this.point1,this.point2) > 15){
                        this.getNeedRect("box2");
                    }
                }

                if(this.getBodyAtMouse()){
                    this.distroyNeedCircle();
                    this.distroyNeedRect();
                }
             },

            //enterframe事件
            onEnterFrameHandler:function(e)
             {

                this.world.Step(1 / 60, 10, 10);
                this.world.DrawDebugData();
                this.world.ClearForces();


                var body = this.world.GetBodyList(); 
                //遍历world中的刚体 
                while(body!=null) 
                { 
                    //如果当前刚体的贴图不为空 
                    if(body.GetDefinition().userData != null) 
                    { 
                        var ud = body.GetDefinition().userData;//获取当前刚体的贴图引用 
                        var xPos = body.GetPosition().x * this.rate;
                        var yPos = body.GetPosition().y * this.rate;
                        var angle = body.GetAngle() * (180 / Math.PI);
                        ud.setX(xPos); 
                        ud.setY(yPos); 
                        ud.setRotation(angle);


                        //碰撞检测
                        // if(this.needRect){
                        //     if(this.needRect.hitTestObject(ud)){
                        //         this.needRect.setColor(0xff0000);
                        //     }else{
                        //         this.needRect.setColor(0xffffff);
                        //     }
                        // }

                        // if(this.needCircle){
                        //     if(this.needCircle.hitTestObject(ud)){
                        //         this.needCircle.setColor(0xff0000);
                        //     }else{
                        //         this.needCircle.setColor(0xffffff);
                        //     }
                        // }
                    } 

                    //超出下边界
                    if (body.GetPosition().y > 410/this.rate) 
                    {
                        this.destoryBody(body);
                    }

                    body = body.GetNext();//指向world中的下一个body 
                }

                this.updata();
            },


            /*
             *鼠标点击形状变化控制
             */
            updata:function(){
                if(!this.isMouseDown) return;

                this.point2 = new ss2d.Point(this.mouseX,this.mouseY);
                var distance = ss2d.Point.distance(this.point1,this.point2);

                if (!this.isMax) 
                {
                    this.radius += .5;
                    
                    if (this.radius >= this.maxRadius)
                    {
                        this.isMax = true;
                    }
                }else {
                    
                    this.radius -= .5;
                    
                    if (this.radius <= this.minRadius) 
                    {
                        this.isMax = false;
                    }
                    
                }   

                var b = this.getBodyAtMouse();
                if(!b && !this.needCircle && this.radius>(this.minRadius+5) && distance == 0){
                    this.getNeedCircle("arc1");
                }


                if(distance == 0){
                    if(this.needCircle) {
                    	this.needCircle.setWidth(this.radius*2);
                    	this.needCircle.setHeight(this.radius*2);
                    }
                }else{
                    if(this.needRect){
                        this.needRect.setX(this.point1.x + (this.point2.x-this.point1.x)/2);
                        this.needRect.setY(this.point1.y + (this.point2.y-this.point1.y)/2);

                        this.needRect.setWidth(Math.abs(this.point2.x-this.point1.x));
                        this.needRect.setHeight(Math.abs(this.point2.y-this.point1.y));
                    }
                }
             },

             /*
             *创建圆形刚体
             */
             creatDefCircle:function(xPos,yPos,ra,texture)
             { 
                this.fixDef.shape= new b2CircleShape(ra/this.rate);
                this.bodyDef.position.Set(xPos/this.rate,yPos/this.rate);
                var mc = this.getQuad(texture); //new ss2d.MovieClip(texture);
                mc.setWidth(ra*2);
                mc.setHeight(ra*2);
                if(texture == "arc5" || texture == "arc6"){
                    mc.setScaleX(5/6);
                    mc.setScaleY(5/6);
                }
                this.bodyDef.userData = mc;
                var body = this.world.CreateBody(this.bodyDef);
                body.CreateFixture(this.fixDef);

                return body;
             },
             /**
			  *创建矩形刚体
             */
             creatDefRect:function(wid,hei,xPos,yPos,texture,angle)
             {
                var ag;
                ag = angle? angle:0;
                this.fixDef.shape= new b2PolygonShape;
                this.fixDef.shape.SetAsBox(wid/this.rate/2,hei/this.rate/2);
                this.bodyDef.position.x = xPos/this.rate;
                this.bodyDef.position.y = yPos/this.rate;
                this.bodyDef.angle = ag * Math.PI / 180;
                if(texture){
                    var mc = this.getQuad(texture);
                    mc.setWidth(wid);
                    mc.setHeight(hei);
                    this.bodyDef.userData = mc;
                }else{
                    this.bodyDef.userData = null;
                }

                this.world.CreateBody(this.bodyDef).CreateFixture(this.fixDef);
             },

            getNeedCircle:function(texture){
                this.needCircle = this.getQuad(texture);
                this.needCircle.setX(this.point1.x);
                this.needCircle.setY(this.point1.y);
             },
             distroyNeedCircle:function(){
                if(this.needCircle){
                    this.myGameScene.hideQuad(this.needCircle);
                    this.needCircle.dispose();
                    this.needCircle= null;                    
                }
             },

             getNeedRect:function(texture){
                this.needRect = this.getQuad(texture);
             },
             distroyNeedRect:function(){
                if(this.needRect){
                    this.myGameScene.hideQuad(this.needRect);
                    this.needRect.dispose();
                    this.needRect= null;
                }
             },

             //获得鼠标点击处的物体
            //  //鼠标点击
            getBodyAtMouse:function() {
                this.mousePVec = new b2Vec2(this.mouseX/this.rate, this.mouseY/this.rate);
                var aabb = new b2AABB();
                aabb.lowerBound.Set(this.mouseX/this.rate - 0.001, this.mouseY/this.rate - 0.001);
                aabb.upperBound.Set(this.mouseX/this.rate + 0.001, this.mouseY/this.rate + 0.001);
                
                // Query the world for overlapping shapes.
                this.selectedBody = null;
                this.world.QueryAABB(this.getBodyCB.bind(this), aabb);
                return this.selectedBody;
             },

            getBodyCB:function(fixture) {
                // if(fixture.GetBody().GetType() != b2body.b2_staticBody) {
                   if(fixture.GetShape().TestPoint(fixture.GetBody().GetTransform(), this.mousePVec)) {
                      this.selectedBody = fixture.GetBody();
                      return false;
                   }
                // }
                return true;
             },

             destoryBody:function(body)
             {
				
				if (body != null && body.m_userData != null) 
				{
					this.myGameScene.hideQuad(body.m_userData);
                    body.m_userData.dispose();
					this.world.DestroyBody(body);
                    body.m_userData = null;
                    body = null;
					demo.Main.sound.group("sound").item("crash").play(1);
					//_________________删除在世界索引
					// bodyArr.splice(bodyArr.indexOf(body),1);
				}
			},

            //删除世界所有动态刚体
            destoryAll:function()
            {
                for (var b = this.world.GetBodyList(); b; b = b.m_next ) 
                {
                    this.world.DestroyBody(b);
                    if(b.m_userData){
                        if(b.m_userData._tileName){//添加到scene
                            this.myGameScene.hideQuad(b.m_userData);
                            b.m_userData.dispose();
                        }
                        
                        if(b.m_userData.stage){//添加到stage
                            b.m_userData.stage.removeChild(b.m_userData);
                        }
                        b.m_userData = null;
                    }
                }

                this.heroNBody = null;
                this.heroMBody = null;

                this.distroyNeedRect();
                this.distroyNeedCircle();
            }
        }
    );
})();