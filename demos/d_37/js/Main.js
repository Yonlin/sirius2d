this.demo = this.demo || {};
(function()
{
    /**
     * 游戏主类
     * main class
     * @class
     */
    demo.Main = Class
    (
        /** @lends demo.Main.prototype */
        {
            //////////////////////////////////////////////////////////////////////////
            //  static property
            //////////////////////////////////////////////////////////////////////////

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

            //////////////////////////////////////////////////////////////////////////
            //  private property
            //////////////////////////////////////////////////////////////////////////

            /**
             * 预加载资源列表
             * list of preloading assets
             * @type {Object}
             * @private
             */
            _manifest : null,

            /**
             * 已加载资源数量
             * the amount of loaded assets
             * @type {number}
             * @private
             */
            _loaded : 0,


            quad_1:null,
            /**
             * 初始化
             * initialize
             */
            initialize : function(canvasId, width, height)
            {

                //创建舞台
                //build stage
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
                //list of preloading assets
                this._manifest =
                    [
                        {src:"images/moledig.png", id:"moledig.png"},
                        {src:"images/moledig.xml", id:"moledig.xml"},
                        {src:"images/Cobblestones3.png", id:"Cobblestones3.png"}


                    ];

                //把事件处理函数存放在demo中
                //add event handler to the game
                demo["handleFileLoad"] = this._handleFileLoad.bind(this);
                demo["handleOverallProgress"] = this._handleOverallProgress.bind(this);

                //资源加载器
                //assets loader
                demo.Main.assets = new ss2d.LoadQueue(true);
                demo.Main.assets.on("fileload", demo["handleFileLoad"]);
                demo.Main.assets.on("progress", demo["handleOverallProgress"]);
                demo.Main.assets.loadManifest(this._manifest);
            },

            ////////////////////////////////////////////////////////////////////////////
            //  Eventhandling
            ////////////////////////////////////////////////////////////////////////////



            /**
             * 资源文件加载完毕事件处理器
             * handler on file loaded
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
             * progress bar handler
             * @param e
             * @private
             */
           _handleOverallProgress : function(e)
            {
                var str = String(demo.Main.assets.progress).slice(2,4);
                this.txt.setText("正在加载......" + str + "%");

            },

            car:null,
            particleEmittersCPU:null,
            particleStyle:null,
            list:null,
            framescene:null,
            _init:function()
            {
                // 创建一个1024*512的空纹理
                // create a null texture (1024*512)
                var textureframe=new ss2d.Texture(1024.0,512.0);

                //转换为纹理缓存
                //transform into texture buffer
                textureframe.transformTextureBuffer();

                //用之前的纹理创建一个影片剪辑
                //create movie clip with the texture
                this.framescene=new ss2d.MovieClip(textureframe);

                //创建帧缓存
                //create frame buffer
                var frameBuffer=new ss2d.FrameBuffer();

                //设置显示内容
                //add movie clip to the frame buffer
                frameBuffer.setDisplay(this.framescene);

                //设置清理画面
                //clean the object (repaint)
                frameBuffer.isClear(true);

                //创建背景纹理
                //create background texture
                var bg=new ss2d.MovieClip(new ss2d.Texture(demo.Main.assets.getResult("Cobblestones3.png")));
                bg.setWidth(ss2d.Stage2D.stageWidth);
                bg.setHeight(ss2d.Stage2D.stageHeight);

                //将背景添加到舞台，静态图
                //add background to the stage (static)
                ss2d.stage.addChild(bg);

                //将背景添加到缓存用于后处理
                //add background to the buffer for post-processing
                frameBuffer.addChild(bg);

                //创建50个元素的场景，以下与bg一样
                //create scene with 50 elements，  below is same as bg
                var scene=new ss2d.Scene(new ss2d.Texture(demo.Main.assets.getResult("moledig.png"),demo.Main.assets.getResult("moledig.xml")),50);
                ss2d.stage.addChild(scene);
                frameBuffer.addChild(scene);

                //创建50个动画
                //create 50 animations
                for(var i=0;i<50;i++)
                {
                    var quad=scene.applyQuad();
                    quad.setX(Math.random()*ss2d.Stage2D.stageWidth);
                    quad.setY(Math.random()*ss2d.Stage2D.stageHeight);
                    quad.loop(true);
                    quad.play();
                    scene.showQuad(quad);
                }

                //添加帧缓存到舞台
                //add frame buffer to the stage
                ss2d.stage.addFrameBuffer(frameBuffer);

                //将影片剪辑添加到舞台
                //add movie clip to the stage
                ss2d.stage.addChild(this.framescene);

                //注册帧事件
                //add frame event listener
                ss2d.stage.addEventListener(ss2d.Event.ENTER_FRAME, this.onEnterFrameHandler.bind(this));
            },

            //设置鼠标跟随
            //the movie clip will follow the mouse
            onEnterFrameHandler : function(e)
            {
                this.framescene.setX(ss2d.Stage2D.mouseX);
                this.framescene.setY(ss2d.Stage2D.mouseY);
            }
        }
    );
})();