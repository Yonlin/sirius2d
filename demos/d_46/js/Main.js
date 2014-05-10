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
                        {src:"images/robot.png", id:"robotpng"},
                        {src:"images/bullet.png", id:"bulletpng"},
                        {src:"images/setting.png", id:"settingpng"},
                        {src:"images/enemy.png", id:"enemy"}
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

            scene:null,
            robot:null,
            bulletScene:null,
            bulletList:null,
            settingMovieClip:null,
            enemyScene:null,
            enemyList:null,
            _init:function()
            {
                ss2d.debug=true;

                this.settingMovieClip=new ss2d.MovieClip(new ss2d.Texture(demo.Main.assets.getResult("settingpng")));
                ss2d.stage.addChild(this.settingMovieClip);

                var texture=new ss2d.Texture(demo.Main.assets.getResult("robotpng"));
                this.scene=new ss2d.Scene(texture,10);
                ss2d.stage.addChild(this.scene);

                this.robot=this.scene.applyQuad();
                this.robot.setCenter(true);
                this.scene.showQuad(this.robot);

                this.enemyScene=new ss2d.Scene(new ss2d.Texture(demo.Main.assets.getResult("enemy")),100);
                ss2d.stage.addChild(this.enemyScene);

                this.bulletScene=new ss2d.Scene(new ss2d.Texture(demo.Main.assets.getResult("bulletpng")),100);
                ss2d.stage.addChild(this.bulletScene);
                this.bulletScene.blend(ss2d.Blend.BLEND_ADD_ALPHA);

                this.bulletList=[];



                //侦听帧函数
                ss2d.stage.addEventListener(ss2d.Event.ENTER_FRAME, this.onEnterFrameHandler.bind(this));


                var timer = new ss2d.Timer(50);
                timer.addEventListener(ss2d.TimerEvent.TIMER,this.timeRun.bind(this));
                timer.start();

                this.enemyList=[];

                demo[this._onKeydownHandler] = this._onKeydownHandler.bind(this);
                demo[this._onKeyupHandler] = this._onKeyupHandler.bind(this);
                ss2d.global.addEventListener('keydown', demo[this._onKeydownHandler], false);
                ss2d.global.addEventListener('keyup', demo[this._onKeyupHandler], false);

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
                var enemyQuad=this.enemyScene.applyQuad();
                if(enemyQuad!=null)
                {
                    this.enemyList.push(enemyQuad);

                    this.enemyScene.showQuad(enemyQuad);
                    enemyQuad.GPU=true;
                    var angle=Math.random()*(Math.PI*2);
                    enemyQuad.GPUX=ss2d.Stage2D.stageWidth/2+Math.cos(angle)*500;
                    enemyQuad.GPUY=ss2d.Stage2D.stageHeight/2+Math.sin(angle)*500;
                    enemyQuad.setRotation(Math.atan2(this.robot.getY()-enemyQuad.GPUY,this.robot.getX()-enemyQuad.GPUX)*180/Math.PI);
                    enemyQuad.setTileWidthOffset(-256+64);
                    enemyQuad.setTileHeightOffset(-128+64);
                }

            },

            _keyW : false,

            _keyA : false,

            _keyS : false,

            _keyD : false,

            _onKeydownHandler : function(e)
            {
                if (e.keyCode == 87) this._keyW = true;
                if (e.keyCode == 65) this._keyA = true;
                if (e.keyCode == 83) this._keyS = true;
                if (e.keyCode == 68) this._keyD = true;
            },

            _onKeyupHandler : function(e)
            {
                if (e.keyCode == 87) this._keyW = false;
                if (e.keyCode == 65) this._keyA = false;
                if (e.keyCode == 83) this._keyS = false;
                if (e.keyCode == 68) this._keyD = false;
            },

            vx:0,
            vy:0,
            fpsValue:0,
            onEnterFrameHandler : function(e)
            {

                this.fpsValue++;
                if(this.fpsValue>=30)
                {
                    this.text.setText("FPS : "+ss2d.Stage2D.fps);
                    this.fpsValue=0;
                }

                for(var i=0;i<this.enemyList.length;i++)
                {
                    this.enemyList[i].GPUX+=Math.cos(this.enemyList[i].getRotation()*Math.PI/180)*3;
                    this.enemyList[i].GPUY+=Math.sin(this.enemyList[i].getRotation()*Math.PI/180)*3;
                    this.enemyList[i].setTileXOffset(this.enemyList[i].getTileXOffset()+64);
                    if(this.enemyList[i].GPUX<=-200||this.enemyList[i].GPUX>=ss2d.Stage2D.stageWidth+200||
                        this.enemyList[i].GPUY<=-200||this.enemyList[i].GPUY>=ss2d.Stage2D.stageHeight+200)
                    {
                        this.enemyScene.hideQuad(this.enemyList[i])
                        this.enemyList[i].dispose();
                        this.enemyList.splice(i,1);
                    }
                }

                for(var n=0;n<this.bulletList.length;n++)
                    for(var j=0;j<this.enemyList.length;j++)
                    {

                        //检测敌人飞机与子弹的碰撞是否在15为半径的圆形内
                        if(this.enemyList[j].hitTestRoundness(this.bulletList[n].GPUX,this.bulletList[n].GPUY,15))
                        {
                            this.enemyScene.hideQuad(this.enemyList[j])
                            this.enemyList[j].dispose();
                            this.enemyList.splice(j,1);
                            break;
                        }
                    }

                if(this._keyW){
                    this.vy-=.5;
                }if(this._keyS)
                {
                    this.vy+=.5;
                }else if(!this._keyW&&!this._keyS)
                {
                    this.vy=0;
                }

                if(this._keyA)
                {
                    this.vx-=.5;
                }if(this._keyD)
                {
                    this.vx+=.5;
                }else if(!this._keyA&&!this._keyD)
                {
                    this.vx=0;
                }

                if(this.vy>=3)
                {
                    this.vy=3;
                }else if(this.vy<=-3)
                {
                    this.vy=-3;
                }

                if(this.vx>=3)
                {
                    this.vx=3;
                }else if(this.vx<=-3)
                {
                    this.vx=-3;
                }


                this.robot.setTileXOffset(this.robot.getTileXOffset()+64);
                this.robot.setTileWidthOffset(-256+64);
                this.robot.setTileHeightOffset(-192+64);
                this.robot.setX(this.robot.getX()+this.vx);
                this.robot.setY(this.robot.getY()+this.vy);
                this.robot.setRotation(Math.atan2(ss2d.Stage2D.mouseY-this.robot.getY(),ss2d.Stage2D.mouseX-this.robot.getX())*180.0/Math.PI);

                var bulletQuad=this.bulletScene.applyQuad();
                if(bulletQuad!=null)
                {
                    this.bulletScene.showQuad(bulletQuad,true);
                    bulletQuad.GPU=true;
                    bulletQuad.GPUX=this.robot.getX();
                    bulletQuad.GPUY=this.robot.getY();
                    bulletQuad.setUserData(this.robot.getRotation())
                    bulletQuad.setRotation(Math.random()*360);
                    bulletQuad.setCenter(true);
                    bulletQuad.setScaleX(.2);
                    bulletQuad.setScaleY(.2);
                    bulletQuad.setR(1+Math.random());
                    bulletQuad.setG(1+Math.random());
                    bulletQuad.setB(1+Math.random());
                    this.bulletList.push(bulletQuad);
                }

                for(var i=0;i<this.bulletList.length;i++)
                {
                    var bulletQuad=this.bulletList[i];
                    bulletQuad.GPUX+=Math.cos(bulletQuad.getUserData()*Math.PI/180)*10;
                    bulletQuad.GPUY+=Math.sin(bulletQuad.getUserData()*Math.PI/180)*10;
                    bulletQuad.setScaleX(bulletQuad.getScaleX() +.1);
                    bulletQuad.setScaleY(bulletQuad.getScaleY() +.1);
                    bulletQuad.setAlpha(bulletQuad.getAlpha() -.02);
                    bulletQuad.setRotation(bulletQuad.getRotation()+3);
                    if(bulletQuad.getAlpha()<=0||bulletQuad.GPUY<=-20||bulletQuad.GPUY>=ss2d.Stage2D.stageHeight+20||bulletQuad.GPUX<=-20||bulletQuad.GPUX>=ss2d.Stage2D.stageWidth+20)
                    {
                        this.bulletScene.hideQuad(this.bulletList[i]);
                        this.bulletList[i].dispose();
                        this.bulletList.splice(i,1);
                    }
                }
            }


        }
    );
})();