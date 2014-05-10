//var txt=document.createTextNode("测试文字");
//txt.text="测试";
//创建objectNode
//var p=document.createElement("p");
//加文本以子节点形式加入到P元素中
//p.appendChild(txt);
//将上面创建的P元素加入到BODY的尾部
//document.body.appendChild(p);

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

            text2:null,

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

            scene:null,
            _init:function()
            {

                //ss2d.debug=true;
                this.quadList=[];

                var texture=new ss2d.Texture(demo.Main.assets.getResult("animationpng"));
                this.scene=new ss2d.Scene(texture,40000);
                this.scene.setShader(new ss2d.ShaderQuick());
                ss2d.stage.addChild(this.scene);



                //ss2d.debug=true;

               this.text=new ss2d.TextField(128*2,64*2);
                ss2d.stage.addChild(this.text);
                //设置字体大小
                this.text.setFontSize(24);

                //设置透明度
                //text.setAlpha(Math.random());

                //设置颜色
                this.text.setColor(0,0,1);

                //设置文字
                //text.setText("Sirius2D");

                //设置位置
                //text.setX(Math.random()*ss2d.Stage2D.stageWidth);
                //text.setY(Math.random()*ss2d.Stage2D.stageHeight);

                //this.text.setText("FPS : "+ss2d.Stage2D.fps,0,30/2);
                ss2d.stage.addEventListener(ss2d.MouseEvent.MOUSE_DOWN, this.onMouseDownHandler.bind(this));
                ss2d.stage.addEventListener(ss2d.MouseEvent.MOUSE_UP, this.onMouseUpHandler.bind(this));
                ss2d.stage.addEventListener(ss2d.Event.ENTER_FRAME, this.onEnterFrameHandler.bind(this));
            },

            cx:0,
            cy:0,
            addBool:false,
            addNum:0,
            onEnterFrameHandler : function(e)
            {

                if(this.addBool)
                {
                    for(var i=0;i<100;i++)
                    {
                        var quad=this.scene.applyQuad(true);

                        if(quad!=null)
                        {
                            quad.loop(false);
                            quad.stop();
                            //quad.setUpAnimationMatrix(true);
                            quad.isVertexColour=false;
                            quad.GPU=true;

                            quad.GPUX=(ss2d.Stage2D.stageWidth*Math.random());
                            quad.GPUY=(ss2d.Stage2D.stageHeight*Math.random());

                            //quad.setAnimationSpeed(12);
                            quad.setMouseEnabled(false);
                            this.scene.showQuad(quad);
                            this.quadList.push(quad);
                         }

                    }
                    this.addNum+=100;
                    if(this.addNum>=40000)
                    {
                        this.addNum=40000;
                    }
                }

                this.tt++;
                if(this.tt>=100)
                {
                    this.tt=0;
                    this.text.setText("FPS : "+ss2d.Stage2D.fps+" 数量 : "+this.addNum,0,12/2);
                };


                this._time+=.1;
                this.cx=Math.cos(this._time)*.001;
                this.cy=Math.sin(this._time)*.001;
                for(var i=0;i<this.quadList.length;i++)
                {
                    var c=this.quadList[i];
                    c.GPUX=c.GPUX+this.cx*i;
                    c.GPUY=c.GPUY+this.cy*i;
                }
                //ss2d.log("FPS : "+ss2d.Stage2D.fps);
            },

            onMouseDownHandler : function(e)
            {
                this.addBool=true;
                //e.target.setAlpha(.5);
            },

            onMouseUpHandler : function(e)
            {
                this.addBool=false;
                //e.target.setAlpha(.5);
            }
        }
    );
})();