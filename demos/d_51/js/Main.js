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
                assets : null,

                sound : null
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

            _scene : null,

            _background : null,

            _components : null,

            _startBtn : null,
            /**
             * 初始化
             */
            initialize : function(canvasId, width, height)
            {
                demo.Main.sound = new ss2d.SoundManager();
                demo.Main.sound.group("sound").add("long3hit").load("audio/long3hit.mp3");

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
                ss2d.Stage2D.r = 1.0;
                ss2d.Stage2D.g = 1.0;
                ss2d.Stage2D.b = 1.0;
                this.loadManifest();
            },

            /**
             * 预加载游戏素材
             * @private
             */
            loadManifest:function()
            {
                //预加载资源列表
                this._manifest =
                    [
                        {src:"images/ui.png", id:"ui.png"},
                        {src:"images/ui.xml", id:"ui.xml"},
                        {src:"datas/player.xml", id:"player.xml"}
                    ];

                //把事件处理函数存放在demo中
                demo["handleFileLoad"] = this.handleFileLoad.bind(this);
                demo["handleOverallProgress"] = this.handleOverallProgress.bind(this);

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
            handleFileLoad : function(e)
            {
                this._loaded++;
                if (this._loaded == this._manifest.length)
                {
					ss2d.stage.removeChild( this.txt);
                    demo.Main.assets.removeEventListener("fileload", demo["handleFileLoad"]);
                    demo.Main.assets.removeEventListener("progress", demo["handleOverallProgress"]);
                    demo["handleFileLoad"] = null;
                    demo["handleOverallProgress"] = null;
                    this.init();
                }
            },

            /**
             * 资源文件加载进度事件处理器
             * @param e
             * @private
             */
            handleOverallProgress : function(e)
            {

            },

            init:function()
            {
                ss2d.debug = true;
                var textureStyle = new ss2d.TextureStyle();
                textureStyle.xSampling=ss2d.TextureStyle.NEAREST;
                textureStyle.ySampling=ss2d.TextureStyle.NEAREST;

                this._scene = new ss2d.Scene(new ss2d.Texture(demo.Main.assets.getResult("ui.png"),
                    demo.Main.assets.getResult("ui.xml"), textureStyle),60);
                ss2d.stage.addChild(this._scene);

                this.createBackground();
                this.createComponents();

                new ss2d.ScmlData("player", demo.Main.assets.getResult("player.xml"));
            },

            createBackground : function()
            {
                this._background = new demo.Background(this._scene);
                this._background.setWidth(ss2d.Stage2D.stageWidth);
                this._background.setHeight(ss2d.Stage2D.stageHeight);
            },

            createComponents : function()
            {
                this._components = new demo.Components(this._scene);
            }
        }
    );
})();