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
                assets : null,

                
                /**
                *声音
                */
                sound:null,
            },

            /**
		 * 预加载资源
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
		 * initializing
             */
            initialize : function(canvasId, width, height)
            {

                //创建舞台
		        //build stage
                demo.Main.stage = new ss2d.Stage2D(canvasId, width, height);
                //预加载资源列表
		        //list of preloading assets
                this._manifest = 
                [
                    {src:"images/01.png", id:"01"},
                    {src:"images/02.png", id:"02"},
                    {src:"images/03.png", id:"03"},
                    {src:"images/04.png", id:"04"},
                    {src:"images/4r.png", id:"04r"},
                    {src:"images/resass.png", id:"resass.png"},
                    {src:"images/resass.xml", id:"resass.xml"}
                ];

                demo.Main.sound = new ss2d.SoundManager();
                demo.Main.sound.group("sound").add("crash").load("audio/crash.mp3");
                demo.Main.sound.group("sound").add("gameing").load("audio/gameing.mp3");

                this.txt = new ss2d.TextField(256,32);
                this.txt.setFontSize(16);
                this.txt.setColor(0xff,0xff,0xff);
                this.txt.setText("进度");
                this.txt.setX(120);
                this.txt.setY(20);
                ss2d.stage.addChild(this.txt);
                
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
                    ss2d.stage.removeChild(this.txt);
                    demo.Main.assets.removeEventListener("fileload", demo["handleFileLoad"]);
                    demo.Main.assets.removeEventListener("progress", demo["handleOverallProgress"]);
                    demo["handleFileLoad"] = null;
                    demo["handleOverallProgress"] = null;
                    this._init();
                }
            },

            box2dinit:function()
            {
                this.main = new demo.TestControl();
            },

            _onKeydownHandler : function(e)
            {
                var aa = e.keyCode;
                    
                if(aa == 37){
                    
                }
            },

            _onKeyupHandler : function(e)
            {
                var aa = e.keyCode;
                if(aa == 37 || aa == 39){
                    // this.main.destoryAll();
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

            /**
             * 摇杆逻辑
             */
            dx: 0,
            dy: 0,

            wx: 0,
            hy: 0,

            speed:  .7,
            frime: .8,
            mc:null,
            _init:function()
            {
                this.box2dinit();                
            }

        }
    );
})();