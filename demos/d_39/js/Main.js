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
                        {src:"images/mask.png", id:"mask.png"},
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

            list:null,
            framescene:null,
            maskMc:null,
            shader:null,
            matrix3d:null,
            _init:function()
            {
                //创建灰度滤镜
                //create grey shader
                this.shader=new ss2d.ShaderGray();

                //创建背景
                //create background texture
                var bg=new ss2d.MovieClip(new ss2d.Texture(demo.Main.assets.getResult("Cobblestones3.png")));

                //设置背景全屏
                //full screen
                bg.setWidth(ss2d.Stage2D.stageWidth);
                bg.setHeight(ss2d.Stage2D.stageHeight);

                //设置背景着色器
                //set background shader as grey shader
                bg.setShader(this.shader);

                //添加到舞台显示
                //add movie clip to the stage
                ss2d.stage.addChild(bg);

                //创建场景,元素为50个
                //create scene with 50 elements
                var scene=new ss2d.Scene(new ss2d.Texture(demo.Main.assets.getResult("moledig.png"),demo.Main.assets.getResult("moledig.xml")),50);

                //设置着色器
                //set scene shader as grey shader
                scene.setShader(this.shader);

                //添加到舞台显示
                //add scene to the stage
                ss2d.stage.addChild(scene);

                //创建50个动画
                //create 50 animations
                for(var i=0;i<50;i++)
                {
                    var quad=scene.applyQuad();
                    quad.setX(Math.random()*ss2d.Stage2D.stageWidth/2);
                    quad.setY(Math.random()*ss2d.Stage2D.stageHeight/2);
                    quad.loop(true);
                    quad.play();
                    scene.showQuad(quad);
                }

                //创建3D矩阵
                //create 3d matrix
                this.matrix3d=new ss2d.Matrix3D();

                //设置着色器位移矩阵
                //bind this matrix to the shader
                this.shader.setTransform(this.matrix3d);

                //注册帧事件
                //add frame event listener
                ss2d.stage.addEventListener(ss2d.Event.ENTER_FRAME, this.onEnterFrameHandler.bind(this));
            },

            //设置矩阵数据使场景运动
            //update matrix to implement movement
            time:0,
            onEnterFrameHandler : function(e)
            {
                this.time+=.1;
                this.matrix3d.upDateMatrix(0,Math.cos(this.time)*.1,Math.sin(this.time)*.1,1+Math.cos(this.time)*.1,1+Math.cos(this.time)*.1,0,0);
            }
        }
    );
})();