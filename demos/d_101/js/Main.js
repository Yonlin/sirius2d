this.demo = this.demo || {};
(function()
{
    /**
     * 游戏主类
     * @param width 舞台高度
     * @param height 舞台宽度
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

            _time:0,

            text:null,

            tt:0,

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
                        {src:"images/animation2.png", id:"animationpng"},
                        {src:"images/animation.xml", id:"animationxml"}
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

            ////////////////////////////////////////////////////////////////////////////
            //  Eventhandling
            ////////////////////////////////////////////////////////////////////////////



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

            _init:function()
            {

                ss2d.debug=true;
                this.quadList=[];

                var texture=new ss2d.Texture(demo.Main.assets.getResult("animationpng"));
                var scene=new ss2d.Scene(texture,50000);
                scene.setShader(new ss2d.ShaderQuick());
                ss2d.stage.addChild(scene);

                for(var i=0;i<50000;i++)
                {
                    var quad=scene.applyQuad(true);
                    quad.loop(false);
                    quad.stop();
                    quad.isVertexColour=false;
                    quad.GPU=true;
                    //quad.setUpAnimationMatrix(false);
                    quad.GPUX=(ss2d.Stage2D.stageWidth*Math.random());
                    quad.GPUY=(ss2d.Stage2D.stageHeight*Math.random());
                    quad.setAnimationSpeed(12);
                    quad.setMouseEnabled(false);
                    scene.showQuad(quad,true);
                    this.quadList.push(quad)
                }

                //this.text=new ss2d.TextField(128,64);
                //ss2d.stage.addChild(this.text);
                //this.text.setText("FPS : "+ss2d.Stage2D.fps,0,30/2);
                //ss2d.stage.addEventListener(ss2d.MouseEvent.MOUSE_DOWN, this.onMouseDownHandler.bind(this));
                ss2d.stage.addEventListener(ss2d.Event.ENTER_FRAME, this.onEnterFrameHandler.bind(this));

            },


            cx:0,
            cy:0,
            onEnterFrameHandler : function(e)
            {
                this.tt++;
                if(this.tt>=50)
                {
                    this.tt=0;
                    //this.text.setText("FPS : "+ss2d.Stage2D.fps,0,30/2);
                };

                this._time+=.1;
                this.cx=Math.cos(this._time)*1;
                this.cy=Math.sin(this._time)*1;
                for(var i=0;i<this.quadList.length;i++)
                {
                    var c=this.quadList[i];
                    c.GPUX=c.GPUX+this.cx*i *.001;
                    c.GPUY=c.GPUY+this.cy*i *.001;
                }

                ss2d.log("FPS : "+ss2d.Stage2D.fps);
            },

            onMouseDownHandler : function(e)
            {
                //e.target.setAlpha(.5);
            }
        }
    );
})();