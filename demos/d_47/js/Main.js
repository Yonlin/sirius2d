this.demo = this.demo || {};
(function()
{
    /**
     * 游戏主类
     * @class
     */
    demo.Main = Class
    (
        /** @lends demo.Main.prototype */
        {

            STATIC :
            /** @lends demo.Main */
            {
                /**
                 * 舞台
                 */
                stage : null,
                /**
                 * 场景
                 */
                scene : null,

                /**
                 * 游戏资源
                 */
                assets : null
            },


            /**
             * 预加载资源列表
             * @type {Object}
             * @private
             */
            _manifest : null,

            /**
             * 已加载资源数量
             * @type {number}
             * @private
             */
            _loaded : 0,


            /**
             * 初始化
             */
            initialize : function(canvasId, width, height)
            {

                //创建舞台
                demo.Main.stage = new ss2d.Stage2D(canvasId, width, height);
				//加载文本
                this.txt = new ss2d.TextField(256,32);
                this.txt.setFontSize(16);
                this.txt.setColor(0xff,0xff,0xff);
                this.txt.setText("进度");
                this.txt.setX(120);
                this.txt.setY(20);
                ss2d.stage.addChild(this.txt);
                //预加载资源列表
                this._manifest =
                    [
                        {src:"images/plane.png", id:"plane.png"},
                        {src:"images/plane.xml", id:"plane.xml"},
                        {src:"images/bullet.png", id:"bullet.png"},
                        {src:"images/bullet.xml", id:"bullet.xml"},
                        {src:"images/setting.jpg", id:"setting.jpg"},
                        {src:"images/prospect.png", id:"prospect.png"},
                        {src:"images/explode.png", id:"explode.png"},
                        {src:"images/explode.xml", id:"explode.xml"},
                        {src:"images/Circle.png", id:"Circle.png"}
                    ];

                //把事件处理函数存放在demo中
                demo["handleFileLoad"] = this._handleFileLoad.bind(this);
                demo["handleOverallProgress"] = this._handleOverallProgress.bind(this);

                //资源加载器
                demo.Main.assets = new ss2d.LoadQueue(true);
                demo.Main.assets.on("fileload", demo["handleFileLoad"]);
                demo.Main.assets.on("progress", demo["handleOverallProgress"]);
                demo.Main.assets.loadManifest(this._manifest);
            },

            /**
             * 资源文件加载完毕事件处理器
             * @param e
             * @private
             */
            _handleFileLoad : function(e)
            {
                this._loaded++;
                if (this._loaded == this._manifest.length)
                {
					ss2d.stage.removeChild( this.txt);
                    demo.Main.assets.removeEventListener("fileload", demo["handleFileLoad"]);
                    demo.Main.assets.removeEventListener("progress", demo["handleOverallProgress"]);
                    demo["handleFileLoad"] = null;
                    demo["handleOverallProgress"] = null;
                    this._init();
                }
            },

            /**
             * 资源文件加载进度事件处理器
             * @param e
             * @private
             */
           _handleOverallProgress : function(e)
            {
                var str = String(demo.Main.assets.progress).slice(2,4);
                this.txt.setText("正在加载......" + str + "%");

            },


            plane:null,
            bulletScene:null,
            bulletList:null,

            bg:null,
            pg:null,
            particleEmittersCPU:null,
            particleStyle:null,
            particleScene:null,
            planeScene:null,
            explodeScene:null,
            enemyList:null,
            gap:0,
            enemyGap:0,
            time:0,
            rotat:0,
            rotatValue:0,
            hitGap:0,
            text:null,
            attackValue:0,
            fpsValue:0,

            _init:function()
            {

                //创建快速渲染着色器,忽视颜色改变提高效率
                var shaderQuick=new ss2d.ShaderQuick();

                //创建背景
                this.bg=new ss2d.MovieClip(new ss2d.Texture(demo.Main.assets.getResult("setting.jpg")));
                this.bg.blend(ss2d.Blend.BLEND_NONE);
                this.bg.setShader(shaderQuick);
                this.bg.setWidth(ss2d.Stage2D.stageWidth);
                this.bg.setHeight(ss2d.Stage2D.stageHeight);
                ss2d.stage.addChild(this.bg);

                //创建飞机
                var planeTexture=new ss2d.Texture(demo.Main.assets.getResult("plane.png"),demo.Main.assets.getResult("plane.xml"));
                this.planeScene=new ss2d.Scene(planeTexture,200);
                this.planeScene.setShader(shaderQuick)
                ss2d.stage.addChild(this.planeScene);
                this.plane=this.planeScene.applyQuad();
                this.planeScene.showQuad(this.plane);
                this.plane.setTileName("oneself");
                this.plane.setCenter(true);
                this.plane.GPU=true;

                //创建粒子资源池
                this.particleScene=new ss2d.Scene(planeTexture,50);
                ss2d.stage.addChild(this.particleScene);
                this.particleScene.blend(ss2d.Blend.BLEND_ADD_ALPHA);

                //创建粒子样式表
                this.particleStyle=new ss2d.ParticleStyle();
                this.particleStyle.tileName="oneself";
                this.particleStyle.rotationValue=Math.PI/180*90.0;
                this.particleStyle.aVaLlue=.2,
                this.particleStyle.rVaLlue=.002,
                this.particleStyle.gVaLlue= -.003,
                this.particleStyle.bVaLlue= -.04,
                this.particleStyle.alphaValue=-.05,
                this.particleStyle.speedValue=7;
                //粒子X随机范围
                this.particleStyle.scopeX=2;
                 //粒子Y随机范围
                 this.particleStyle.scopeY=2;

                //创建粒子发射器
                this.particleEmittersCPU=new ss2d.ParticleEmittersCPU(this.particleScene,50);

                //侦听帧函数
                ss2d.stage.addEventListener(ss2d.Event.ENTER_FRAME, this.onEnterFrameHandler.bind(this));

                //创建子弹资源池
                this.bulletScene=new ss2d.Scene(new ss2d.Texture(demo.Main.assets.getResult("bullet.png"),demo.Main.assets.getResult("bullet.xml")),200);
                this.bulletScene.setShader(shaderQuick)
                this.bulletScene.blend(ss2d.Blend.BLEND_ADD);
                ss2d.stage.addChild(this.bulletScene);


                //创建爆炸动画资源池
                this.explodeScene=new ss2d.Scene(new ss2d.Texture(demo.Main.assets.getResult("explode.png"),demo.Main.assets.getResult("explode.xml")),50);
                this.explodeScene.setShader(shaderQuick)
                ss2d.stage.addChild(this.explodeScene);





                //创建前景
                this.pg=new ss2d.MovieClip(new ss2d.Texture(demo.Main.assets.getResult("prospect.png")))
                this.pg.setShader(shaderQuick);
                this.pg.setWidth(ss2d.Stage2D.stageWidth);
                this.pg.setHeight(ss2d.Stage2D.stageHeight);
                ss2d.stage.addChild(this.pg);



                //创建计时器
                var timer = new ss2d.Timer(150);
                timer.addEventListener(ss2d.TimerEvent.TIMER,this.timeRun.bind(this));
                timer.start();

                this.bulletList=[];
                this.enemyList=[];

                //创建用于FPS的文本
                this.text=new ss2d.TextField(128,64);
                ss2d.stage.addChild(this.text);

            },


            /**
             * 计时器函数
             * @param e
             */
            timeRun:function(e)
            {
                //生成敌人,并且设置速度和血量
                var enemy=this.planeScene.applyQuad();
                if(enemy!=null)
                {
                    enemy.setTileName("enemy"+parseInt(Math.random()*6+1));
                    enemy.stop();
                    enemy.GPU=true;
                    enemy.GPUX=Math.random()*ss2d.Stage2D.stageWidth-100;
                    enemy.GPUY=-200;
                    enemy.setUserData([Math.random()*10+3,100]);
                    this.planeScene.showQuad(enemy,true);
                    this.enemyList.push(enemy);
                }
            },


            /**
             * 发射子弹
             * @param x
             * @param y
             * @param rotation
             */
            attack:function(x,y,name,rotat)
            {
                var quad=this.bulletScene.applyQuad();
                if(quad!=null)
                {
                    quad.setTileName(name);
                    quad.setCenter(true);
                    quad.stop();
                    quad.GPU=true;
                    quad.GPUX=x;
                    quad.GPUY=y;
                    quad.setRotation(rotat);
                    this.bulletScene.showQuad(quad,true);
                    this.bulletList.push(quad);
                }
            },


            //爆炸动画结束时销毁动画
            explpaeEnd:function(e)
            {
                this.explodeScene.hideQuad(e);
                e.dispose();
            },


            onEnterFrameHandler : function(e)
            {
                this.gap++;
                this.enemyGap++;
                this.rotatValue+=.1;
                this.rotat+=Math.cos(this.rotatValue)*.8;

                this.fpsValue++;
                if(this.fpsValue>=30)
                {
                    this.text.setText("FPS : "+ss2d.Stage2D.fps);
                    this.fpsValue=0;
                }


                //发射不同角度不同类型的子弹
                if(this.gap>=3){
                    this.gap=0;
                    this.attack(this.plane.GPUX-60,this.plane.GPUY+30,"enemybullet3",-90+this.rotat);
                    this.attack(this.plane.GPUX-40,this.plane.GPUY,"enemybullet1",-95-this.rotat/2);
                    this.attack(this.plane.GPUX-20,this.plane.GPUY,"enemybullet2",-92-this.rotat/5);
                    this.attack(this.plane.GPUX,this.plane.GPUY,"enemybullet2",-90);
                    this.attack(this.plane.GPUX+20,this.plane.GPUY,"enemybullet2",-88+this.rotat/5);
                    this.attack(this.plane.GPUX+40,this.plane.GPUY,"enemybullet1",-85+this.rotat/2);
                    this.attack(this.plane.GPUX+60,this.plane.GPUY+30,"enemybullet3",-90-this.rotat);
                }


                for(var i=0;i<this.bulletList.length;i++)
                {
                    //让子弹根据自己的角度运动
                    var buller=this.bulletList[i]
                    buller.GPUX+=Math.cos(buller.getRotation()*Math.PI/180)*17;
                    buller.GPUY+=Math.sin(buller.getRotation()*Math.PI/180)*17;

                    //子弹的边界检测,超出边界销毁子弹
                    if(this.bulletList[i].GPUY<=-20||this.bulletList[i].GPUX<=-20||this.bulletList[i].GPUX>=ss2d.Stage2D.stageWidth+20)
                    {
                        this.bulletScene.hideQuad(this.bulletList[i]);
                        this.bulletList[i].dispose();
                        this.bulletList.splice(i,1);
                    }
                }

                //敌人飞机的运动
                for(var i=0;i<this.enemyList.length;i++)
                {
                    this.enemyList[i].GPUY+=this.enemyList[i].getUserData()[0];
                }


                for(var n=0;n<this.bulletList.length;n++)
                for(var j=0;j<this.enemyList.length;j++)
                {
                    //检测敌人的血量是否为0或者是否超出屏幕边界
                    if(this.enemyList[j].getUserData()[1]<=0||this.enemyList[j].GPUY>=ss2d.Stage2D.stageHeight+20)
                    {
                       this.planeScene.hideQuad(this.enemyList[j]);
                        //this.enemyList[j].GPUX=Math.random()*ss2d.Stage2D.stageWidth-100;
                        //this.enemyList[j].GPUY=-200;
                        this.enemyList[j].dispose();
                        this.enemyList.splice(j,1);
                        break;
                    }

                    //检测敌人飞机与子弹的碰撞是否在30为半径的圆形内
                    if(this.enemyList[j].hitTestRoundness(this.bulletList[n].GPUX,this.bulletList[n].GPUY,30))
                    {
                        this.hitGap++;
                        if(this.hitGap>=2)
                        {
                            this.hitGap=0;

                            //播放爆炸动画
                            var explpae=this.explodeScene.applyQuad();
                            if(explpae!=null)
                            {
                                this.explodeScene.showQuad(explpae,true);
                                explpae.GPU=true;
                                explpae.GPUX=this.enemyList[j].GPUX+Math.random()*50-25;
                                explpae.GPUY=this.enemyList[j].GPUY+Math.random()*50-25;
                                explpae.setScaleX(.5);
                                explpae.setScaleY(.5);
                                explpae.setAnimationSpeed(40);
                                explpae.play();

                                //添加爆炸动画的帧函数
                                explpae.addFrameScript(new ss2d.FrameFunction(explpae.getTotalFrame(),this.explpaeEnd.bind(this)));
                            }
                        }

                        //销毁子弹
                        this.bulletList[n].dispose();

                        //从数组中销毁子弹的引用
                        this.bulletList.splice(n,1);

                        //减少敌人飞机的血量
                        this.enemyList[j].setUserData([this.enemyList[j].getUserData()[0],this.enemyList[j].getUserData()[1]-10]);

                        break;
                    }
                }

                //时间步
                this.time-=3;

                //滚动背景
                this.bg.setTileYOffset(this.time);

                //滚动前景,时间长度*2，形成视差错觉
                this.pg.setTileYOffset(this.time*2);

                //飞机缓动跟随鼠标
                this.plane.GPUX+=(ss2d.Stage2D.mouseX-this.plane.GPUX)/5;
                this.plane.GPUY+=(ss2d.Stage2D.mouseY-this.plane.GPUY)/5;

                //发射粒子
                this.particleEmittersCPU.sendParticle(this.plane.GPUX,this.plane.GPUY,this.particleStyle);
            }

        }
    );
})();