this.myGame = this.myGame || {};
(function()
{
    /**
     * 游戏主类
     * @class
     */
    myGame.Main = Class
    (
        /** @lends myGame.Main.prototype */
        {

            STATIC :
            /** @lends myGame.Main */
            {
                /**
                 * 舞台
                 */
                stage : null,
                /**
                 * 场景
                 */
                curGameScene : null,

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
                myGame.Main.stage = new ss2d.Stage2D(canvasId, width, height);
				//加载文本
                this.txt = new ss2d.TextField(256,32);
                this.txt.setFontSize(16);
                this.txt.setColor(0xff,0xff,0xff);
                this.txt.setText("进度");
                this.txt.setX(120);
                this.txt.setY(20);
                ss2d.stage.addChild(this.txt);
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
                        {src:"images/game.png", id:"game.png"},
                        {src:"images/game.xml", id:"game.xml"},
                        
                        {src:"images/effect.png", id:"effect.png"},
                        {src:"images/effect.xml", id:"effect.xml"},
                        {src:"images/Circle.png", id:"Circle.png"}

                    ];

                //把事件处理函数存放在myGame中
                myGame["handleFileLoad"] = this._handleFileLoad.bind(this);
                myGame["handleOverallProgress"] = this._handleOverallProgress.bind(this);

                //资源加载器
                myGame.Main.assets = new ss2d.LoadQueue(true);
                myGame.Main.assets.on("fileload", myGame["handleFileLoad"]);
                myGame.Main.assets.on("progress", myGame["handleOverallProgress"]);
                myGame.Main.assets.loadManifest(this._manifest);
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
					ss2d.stage.removeChild( this.txt); //资源加载完成
                    myGame.Main.assets.removeEventListener("fileload", myGame["handleFileLoad"]);
                    myGame.Main.assets.removeEventListener("progress", myGame["handleOverallProgress"]);
                    myGame["handleFileLoad"] = null;
                    myGame["handleOverallProgress"] = null;
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
                var str = String(myGame.Main.assets.progress).slice(2,4);
                this.txt.setText("正在加载......" + str + "%");

            },
            _init:function()
            {
               goToNewScene(WelcomScene);
            }
        }
    );
})();

    //go  to new  Scene   edit by  ccbear
   var goToNewScene=function(newScene,oldScene){
                ss2d.stage.removeAllEventListeners();
                var oldScene=myGame.Main.curGameScene||oldScene;
                if(oldScene){
                    oldScene.dispose();
                }
//                  自定义的场景创建函数，如果场景涉及到重置，不要忘记重置对应场景的全局的变量
                newScene.Create();
            }
