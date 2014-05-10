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
                        {src:"images/animal.png", id:"animalpng"},
                        {src:"images/animal.xml", id:"animalxml"}
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


            _init:function()
            {

                //创建一个空纹理
                //create a null texture
                var textureframe=new ss2d.Texture(1024.0,512.0);

                //创建纹理缓存
                //create texture buffer
                textureframe.transformTextureBuffer();

                //创建一个影片剪辑
                //create a movie clip
                var framescene=new ss2d.MovieClip(textureframe);

                //提交到舞台显示,这里显示的后处理之后的图像
                //add movie clip to the stage (post-processing)
                ss2d.stage.addChild(framescene);



                //创建帧缓存
                //create frame buffer
                var frameBuff=new ss2d.FrameBuffer();

                //设置缓存纹理
                //add movie clip to the frame buffer
                frameBuff.setDisplay(framescene);

                //设置不清理画面
                //never clean the object (don't repaint)
                frameBuff.isClear(false);

                //添加到舞台的帧缓存
                //add frame buffer to the stage
                ss2d.stage.addFrameBuffer(frameBuff);


                this.quadList=[];

                //根据xml创建纹理
                //create texture based on xml
                var texture=new ss2d.Texture(demo.Main.assets.getResult("animalpng"),demo.Main.assets.getResult("animalxml"));

                //创建场景,元素为1
                //create game scene with 1 element
                var scene=new ss2d.Scene(texture,1);

                //提交带帧缓存显示
                //add scene to the frame buffer
                frameBuff.addChild(scene);

                //申请quad
                //register quad
                this.quad_1=scene.applyQuad();

                //设置居中对其
                //align center
                this.quad_1.setCenter(true);

                //循环播放动画
                //loop animation
                this.quad_1.loop(true);

                //开始播放动画
                //play animation
                this.quad_1.play();

                //提交到场景显示
                //display quad
                scene.showQuad(this.quad_1);

                //注册帧事件
                //add frame event listener
                ss2d.stage.addEventListener(ss2d.Event.ENTER_FRAME, this.onEnterFrameHandler.bind(this));
            },

            onEnterFrameHandler : function(e)
            {
                //随机改变颜色
                //randomize quad's color
                this.quad_1.setR(Math.random());
                this.quad_1.setG(Math.random());
                this.quad_1.setB(Math.random());

                //设置为鼠标的位置
                //set quad pos as mouse pos
                this.quad_1.setX(ss2d.Stage2D.mouseX);
                this.quad_1.setY(ss2d.Stage2D.mouseY);
            }


        }
    );
})();