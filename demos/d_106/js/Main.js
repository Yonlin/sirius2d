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

            _time:0,

            text:null,

            tt:0,

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
                        {src:"images/animation.png", id:"animationpng"},
                        {src:"images/animation.xml", id:"animationxml"}
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

            fun:null,
            texture:null,
            scene:null,
            bmp:null,
            xml:null,
            _init:function()
            {


                this.bmp=demo.Main.assets.getResult("animationpng");
                this.xml=demo.Main.assets.getResult("animationxml");
                this.quadList=[];

                //根据图片和XML配置创建纹理对象
                //create texture based on xml
                this.texture=new ss2d.Texture(this.bmp,this.xml);

                //创建场景,元素个数为500
                //create game scene with 500 elements（quads）
                this.scene=new ss2d.Scene(this.texture,1000);

                //添加到舞台显示
                //add game scene to the stage
                ss2d.stage.addChild(this.scene);

                for(var i=0;i<1000;i++)
                {

                    //申请quad元素
                    //resister quad
                    var quad=this.scene.applyQuad(true);

                    //循环播放动画
                    //loop animation
                    quad.loop(true);

                    //开始播放动画
                    //play animation
                    quad.play();

                    //关闭顶点着色,可大幅度提高效率
                    //disable vertex coloring to optimize efficiency
                    quad.isVertexColour=false;

                    //禁止动画矩阵更新,可大幅度提高效率,用于宽度和高度相等的动画
                    //disable animation matrix calibration when animation height and width are the same to optimize efficiency
                    quad.upAnimationMatrix=false;

                    //启用二次GPU加速 (使用GPU设置坐标)
                    //enable double GPU acceleration (using GPU to set pos)
                    quad.GPU=true;

                    //设置二次GPU坐标
                    //set GPU pos
                    quad.GPUX=(ss2d.Stage2D.stageWidth*Math.random());
                    quad.GPUY=(ss2d.Stage2D.stageHeight*Math.random());

                    //设置帧率
                    //set FPS 60
                    quad.setAnimationSpeed(60);

                    //提交到场景显示
                    //display quad
                    this.scene.showQuad(quad,true);

                    //添加到数组
                    //add quad into the list
                    this.quadList.push(quad)
                }

                //注册帧事件侦听器
                //add frame event listener
                this.fun=this.down.bind(this);
                //ss2d.stage.addEventListener(ss2d.Event.ENTER_FRAME,this.fun);
                //ss2d.stage.removeEventListener(ss2d.Event.ENTER_FRAME,this.fun);

                //this.fun=function(){ss2d.debug=true;ss2d.log("点击")};
                //ss2d.stage.addEventListener(ss2d.Event.ENTER_FRAME,this.fun);
                ss2d.stage.addEventListener(ss2d.MouseEvent.MOUSE_DOWN,this.fun);
                //ss2d.stage.removeEventListener(ss2d.MouseEvent.MOUSE_DOWN,this.fun);

            },

            down:function(e)
            {
                ss2d.stage.removeChild(this.scene);
                this.scene.dispose();
                this.texture.dispose();

                this.texture=new ss2d.Texture(this.bmp,this.xml);
                this.scene=new ss2d.Scene(this.texture,1000);

                //清理引用
                for(var i=0;i<this.quadList.length;i++)
                {
                    this.quadList[i]=null;
                };
                this.quadList=[];

                for(var i=0;i<1000;i++)
                {

                    //申请quad元素
                    //resister quad
                    var quad=this.scene.applyQuad(true);

                    //循环播放动画
                    //loop animation
                    quad.loop(true);

                    //开始播放动画
                    //play animation
                    quad.play();

                    //关闭顶点着色,可大幅度提高效率
                    //disable vertex coloring to optimize efficiency
                    quad.isVertexColour=false;

                    //禁止动画矩阵更新,可大幅度提高效率,用于宽度和高度相等的动画
                    //disable animation matrix calibration when animation height and width are the same to optimize efficiency
                    quad.upAnimationMatrix=false;

                    //启用二次GPU加速 (使用GPU设置坐标)
                    //enable double GPU acceleration (using GPU to set pos)
                    quad.GPU=true;

                    //设置二次GPU坐标
                    //set GPU pos
                    quad.GPUX=(ss2d.Stage2D.stageWidth*Math.random());
                    quad.GPUY=(ss2d.Stage2D.stageHeight*Math.random());

                    //设置帧率
                    //set FPS 60
                    quad.setAnimationSpeed(60);

                    //提交到场景显示
                    //display quad
                    this.scene.showQuad(quad,true);

                    //如果这里保存了引用，那么就无法被销毁,二熊
                    this.quadList.push(quad);

                }
                //添加到舞台显示
                //add game scene to the stage
                ss2d.stage.addChild(this.scene);



            },

            //旋转运动
            //rotation
            onEnterFrameHandler : function(e)
            {

                //ss2d.debug=true;
                //ss2d.log(Math.sin(0));
                this._time+=.1;
                for(var i=0;i<this.quadList.length;i++)
                {
                    this.quadList[i].GPUX=this.quadList[i].GPUX+Math.cos(this._time)*1;
                    this.quadList[i].GPUY=this.quadList[i].GPUY+Math.sin(this._time)*1;
                }
            }
        }
    );
})();