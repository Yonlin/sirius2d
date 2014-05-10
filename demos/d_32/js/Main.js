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
                        {src:"images/grain.png", id:"grain.png"}
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
            _init:function()
            {
                //创建场景
                //create game scene
                var quadlist=new ss2d.Scene(new ss2d.Texture(demo.Main.assets.getResult("grain.png")),100);

                //将场景加入到舞台
                //add scene to the stage
                ss2d.stage.addChild(quadlist);

                //设置混色模式
                //set blend mode BLEND_ADD_ALPHA
                quadlist.blend(ss2d.Blend.BLEND_ADD_ALPHA);

                //创建一个粒子发射器
                //create a particle emitter
                this.particleEmittersCPU=new ss2d.ParticleEmittersCPU(quadlist,100);

                //设置粒子样式为默认：火苗样式
                //set particle style as default: flame style
                this.particleStyle=new ss2d.ParticleStyle();

                //创建帧事件监听
                //add frame event listener
                ss2d.stage.addEventListener(ss2d.Event.ENTER_FRAME, this.onEnterFrameHandler.bind(this));

                this.text=new ss2d.TextField(128,64);
                this.text.setText("FPS : "+ss2d.Stage2D.fps,0,30/2);
                ss2d.stage.addChild(this.text);

            },

            text:null,
            tt:0,

            //使粒子出现在鼠标位置
            //set the particle emitter at the mouse pos
            onEnterFrameHandler : function(e)
            {
                this.particleEmittersCPU.sendParticle(ss2d.Stage2D.mouseX,ss2d.Stage2D.mouseY,this.particleStyle);

                this.tt++;
                if(this.tt>=100)
                {
                    this.tt=0;
                    this.text.setText("FPS : "+ss2d.Stage2D.fps,0,30/2);

                };
            }
        }
    );
})();