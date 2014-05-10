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
//                 * 舞台
                stage : null,
//                 * 场景
                curGameScene : null,
//                 * 游戏资源
                assets : null,
//                声音
                sound : null,

                Res:{}
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
            _loadedText:null,

            /**
             * 初始化
             */
            initialize : function(canvasId, width, height)
            {

                //创建舞台
                myGame.Main.stage = new ss2d.Stage2D(canvasId, width, height);
                //预加载资源列表
                this._loadedText=new ss2d.TextField(256,64);
                this._loadedText.setFontSize(35);
                this._loadedText.setColor(252/255,158/255,23/255);
                this._loadedText.setX(width/2-128);
                this._loadedText.setY(height/2);
                this._loadedText.setText("Loding...0%");
                ss2d.stage.addChild( this._loadedText);
         
                this._manifest =
                    [
                        {src:"images/game.png", id:"game.png"},
                        {src:"images/game.xml", id:"game.xml"},
                        {src:"images/Circle.png", id:"Circle.png"}
                    ];

                myGame.Main.sound = new  ss2d.SoundManager();
                myGame.Main.sound.group("sound").add("click").load("sound/click.mp3");
                myGame.Main.sound.group("sound").add("dispose").load("sound/dispose.mp3");
                myGame.Main.sound.group("sound").add("bgm").load("sound/bgm3.mp3");

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
                { //资源加载完成
                    myGame.Main.assets.removeEventListener("fileload", myGame["handleFileLoad"]);
                    myGame.Main.assets.removeEventListener("progress", myGame["handleOverallProgress"]);
                    myGame["handleFileLoad"] = null;
                    myGame["handleOverallProgress"] = null;
                     ss2d.stage.removeChild(this._loadedText);
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
                var p=Math.round(  myGame.Main.assets.progress);
                this._loadedText.setText("Loding..."+p+"%");
            },
            _intitRes:function(){
                var png=myGame.Main.assets.getResult("game.png"),
                    xml=myGame.Main.assets.getResult("game.xml");
                var gameTexture=new ss2d.Texture(png,xml);
                var ParticleTexture=new ss2d.Texture(myGame.Main.assets.getResult("Circle.png"));
                
                myGame.Main.Res["GameTexture"]=gameTexture;
                 myGame.Main.Res["ParticleTexture"]=ParticleTexture;
                myGame.Main.Res["UI"]=new ss2d.Scene(gameTexture,240);
                myGame.Main.Res["GameEffect"]=new ss2d.Scene(gameTexture,200);

            },
            _init:function()
            {
                this._intitRes();
                    goToNewScene(WelcomScene);
//           goToNewScene(GameOver);
//                goToNewScene(GameScene);
               
            }

        }
    );
})();

   var goToNewScene=function(newScene,oldScene){
                ss2d.stage.removeAllEventListeners();
                var oldScene=myGame.Main.curGameScene||oldScene;
                if(oldScene){
                    oldScene.dispose();
                    oldScene=null;
                }
//                  自定义的场景创建函数，如果场景涉及到重置，不要忘记重置对应场景的全局的变量
                  newScene.Create();
            }