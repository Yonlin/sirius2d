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


            /**
             * 初始化
             * initialize
             */
            initialize : function(canvasId, width, height)
            {

                //创建舞台
                //create stage
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
                        {src:"images/logo.png", id:"logo"}
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

                //创建一个精灵容器
                //create sprite
                var sp1=new ss2d.Sprite();

                sp1.setScaleX(.5);
                sp1.setScaleY(.5);

                //设置精灵容器的坐标
                //set sprite pos
                sp1.setX(ss2d.Stage2D.stageWidth/2);
                sp1.setY(ss2d.Stage2D.stageHeight/2);

                //显示精灵容器
                //add sprite to the stage
                ss2d.stage.addChild(sp1);

                //创建新的精灵容器
                //create another sprite
                var sp2=new ss2d.Sprite();

                //设置新的精灵容器角度
                //set sprite angle
                sp2.setRotation(45);

                //第一个精灵容器嵌套第二个精灵容器
                //add child sprite to the first one
                sp1.addChild(sp2);

                //创建纹理对象
                //create texture
                var texture=new ss2d.Texture(demo.Main.assets.getResult("logo"));

                //创建影片剪辑
                //create movie clip
                var mc=new ss2d.MovieClip(texture);

                //设置居中对其
                //align center
                mc.setCenter(true);

                //设置影片剪辑的比例
                //set movie clip scale
                mc.setScaleX(.5);
                mc.setScaleY(1.5);

                //设置影片剪辑的角度
                //set movie clip angle
                mc.setRotation(45);

                //设置影片剪辑的透明度
                //set movie clip alpha
                mc.setAlpha(.5);

                //设置影片剪辑的红色通道
                //set movie clip red channel
                mc.setR(2);

                //把影片剪辑添加到第二个精灵容器上
                //add movie clip to sprite2
                sp2.addChild(mc);

            }
        }
    );
})();
