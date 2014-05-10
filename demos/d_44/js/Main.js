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
                        {src:"images/attack.png", id:"attackpng"},
                        {src:"images/attack.xml", id:"attackxml"},
                        {src:"images/Wasteland.png", id:"Wasteland"}
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




            shaderGray:null,
            mc:null,
            bg:null,
            time:0,
            rollback:false,
            _init:function()
            {


                var textureStyle=new ss2d.TextureStyle();

                //设置为循环采样
                //set texture style as MIRRORED_REPEAT
                textureStyle.xTile=ss2d.TextureStyle.MIRRORED_REPEAT;

                //创建游戏背景
                this.bg=new ss2d.MovieClip(new ss2d.Texture(demo.Main.assets.getResult("Wasteland"),textureStyle));

                //设置背景显示区域
                this.bg.setTileWidthOffset(ss2d.Stage2D.stageWidth-this.bg.getWidth());
                this.bg.setHeight(ss2d.Stage2D.stageHeight);
                ss2d.stage.addChild(this.bg);

                //创建动画纹理
                var texture=new ss2d.Texture(demo.Main.assets.getResult("attackpng"),demo.Main.assets.getResult("attackxml"));

                //创建动画
                this.mc=new ss2d.MovieClip(texture);
                this.mc.setAnimationSpeed(60);
                this.mc.loop(true);
                this.mc.setX(200);
                this.mc.setY(200);
                ss2d.stage.addChild(this.mc);

                //创建灰度着色器
                this.shaderGray=new ss2d.ShaderGray();


                //创建文本
                var text=new ss2d.TextField(512,64);
                text.setText("点击鼠标时空倒流,松开正常");
                ss2d.stage.addChild(text);

                //侦听鼠标按下事件
                ss2d.stage.addEventListener(ss2d.MouseEvent.MOUSE_DOWN, this.onMouseDownHandler.bind(this));

                //侦听鼠标松开事件
                ss2d.stage.addEventListener(ss2d.MouseEvent.MOUSE_UP, this.onMouseUpHandler.bind(this));

                //侦听帧事件
                ss2d.stage.addEventListener(ss2d.Event.ENTER_FRAME, this.onEnterFrameHandler.bind(this));

            },

            //滚动背景
            onEnterFrameHandler : function(e)
            {
                if(this.rollback)
                {
                    this.time-=1.3;
                }else
                {
                    this.time+=2;
                }

                this.bg.setTileXOffset(this.time);
            },

            //点击切换着色器
            onMouseDownHandler : function(e)
            {
                this.rollback=true;
                this.mc.setAnimationSpeed(40);
                this.mc.rollbackAnimation(true);
                this.mc.setShader(this.shaderGray);
                this.bg.setShader(this.shaderGray);
            },

            //松开切换着色器
            onMouseUpHandler : function(e)
            {
                this.rollback=false;
                this.mc.setAnimationSpeed(60);
                this.mc.rollbackAnimation(false);
                this.mc.setShader(null);
                this.bg.setShader(null);
            }
        }
    );
})();