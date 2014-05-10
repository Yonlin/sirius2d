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
                        {src:"images/1.png", id:"1.png"},
                        {src:"images/1.xml", id:"1.xml"},
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
                var framescene=new ss2d.MovieClip(textureframe);
                framescene.setY(200.0);

                //设置绿色通道值为1.2，原图的绿色*1.2
                //set green channel factor as 1.2 （G*1.2）
                framescene.setG(1.2);

                //显示图片最上方100像素的剪裁区域
                //display only the top 100p area of the image
                framescene.setTileHeightOffset(-framescene.getHeight()+100);
                framescene.setTileYOffset(200);

                //设置玻璃着色器
                //set shader as glass shader
                framescene.setShader(new ss2d.ShaderGlass());

                //创建帧缓存
                //create frame buffer
                var frameBuffer=new ss2d.FrameBuffer();

                //设置显示内容
                //add movie clip to the frame buffer
                frameBuffer.setDisplay(framescene);

                //设置清理画面
                //clean the object (repaint)
                frameBuffer.isClear(true);


                this.list=[];

                //创建背景纹理
                //create background texture
                var bg=new ss2d.MovieClip(new ss2d.Texture(demo.Main.assets.getResult("Cobblestones3.png")));
                bg.setWidth(ss2d.Stage2D.stageWidth);
                bg.setY(-150);

                //将背景添加到缓存用于后处理
                //add background to the buffer for post-processing
                frameBuffer.addChild(bg);

                //将背景添加到舞台，静态图
                //add background to the stage (static)
                ss2d.stage.addChild(bg);

                //创建8个元素的场景，以下与bg一样
                //create scene with 8 elements，  below is same as bg
                var scene=new ss2d.Scene(new ss2d.Texture(demo.Main.assets.getResult("1.png"),demo.Main.assets.getResult("1.xml")),8);
                frameBuffer.addChild(scene);
                ss2d.stage.addChild(scene);

                //添加帧缓存到舞台
                //add frame buffer to the stage
                ss2d.stage.addFrameBuffer(frameBuffer);

                //添加影片剪辑到舞台
                //add movie clip to the stage
                ss2d.stage.addChild(framescene);

                //创建8个动画
                //create 8 animation from 1 texture
                var arr=[70,70,70,70,70,70,70,70];
                for(var i=0;i<8;i++)
                {
                    var q1=scene.applyQuad();
                    q1.setX(ss2d.Stage2D.stageWidth/2+i*100-400);
                    q1.setY(ss2d.Stage2D.stageHeight/2);
                    q1.setCenter(true);
                    q1.loop(true);
                    q1.setTileId(i+1);
                    q1.setPivotY(arr[i]);
                    q1.setAnimationSpeed(50);
                    q1.play();
                    scene.showQuad(q1);
                    this.list.push(q1);
                }

                //注册帧事件
                //add frame event listener
                ss2d.stage.addEventListener(ss2d.Event.ENTER_FRAME, this.onEnterFrameHandler.bind(this));
            },

            //设置第一个动画随鼠标移动
            //the first animation will follow the mouse
            onEnterFrameHandler : function(e)
            {
                this.list[0].setX(ss2d.Stage2D.mouseX);
                this.list[0].setY(ss2d.Stage2D.mouseY);
            }
        }
    );
})();