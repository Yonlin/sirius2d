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

            _time:0,

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

            _init:function()
            {

                this.quadList=[];

                //创建纹理对象
                //create texture (animation)
                var texture=new ss2d.Texture(demo.Main.assets.getResult("animationpng"),demo.Main.assets.getResult("animationxml"));

                //创建场景,元素数量为100
                //create game scene with 100 elements（quads）
                var scene=new ss2d.Scene(texture,100);

                //添加到舞台显示
                //add game scene to the stage
                ss2d.stage.addChild(scene);

                for(var i=0;i<100;i++)
                {
                    //申请QUAD
                    //resister quad
                    var quad=scene.applyQuad();

                    //循环播放动画
                    //loop animation
                    quad.loop(true);

                    //开始播放动画
                    //play animation
                    quad.play();

                    //启用二次GPU加速 (使用GPU设置坐标)
                    //enable double GPU acceleration (using GPU to set pos)
                    quad.GPU=true;

                    //设置GPU坐标
                    //set GPU pos
                    quad.GPUX=ss2d.Stage2D.stageWidth/2*Math.random();
                    quad.GPUY=ss2d.Stage2D.stageHeight/2*Math.random();

                    //设置动画片段ID
                    //set animation segment ID
                    quad.setTileId(parseInt(Math.random()*3));

                    //设置动画帧率
                    //set FPS 50
                    quad.setAnimationSpeed(50);

                    //启用鼠标检测
                    //enable mouse event
                    quad.setMouseEnabled(true);

                    //提交给场景显示
                    //display quad
                    scene.showQuad(quad);

                    //添加到数组
                    //add quad into the list
                    this.quadList.push(quad)
                }

                //注册鼠标侦听器
                //add mouse event listener
                ss2d.stage.addEventListener(ss2d.MouseEvent.MOUSE_DOWN, this.onMouseDownHandler.bind(this));

                //注册帧事件侦听器
                //add frame event listener
                ss2d.stage.addEventListener(ss2d.Event.ENTER_FRAME, this.onEnterFrameHandler.bind(this));

                this.text=new ss2d.TextField(128,64);
                this.text.setText("FPS : "+ss2d.Stage2D.fps,0,30/2);
                ss2d.stage.addChild(this.text);
            },

            text:null,
tt:0,
            //旋转运动
            //rotation
            onEnterFrameHandler : function(e)
            {
                this._time+=.1;
                for(var i=0;i<this.quadList.length;i++)
                {
                    this.quadList[i].GPUX=this.quadList[i].GPUX+Math.cos(this._time)*1;
                    this.quadList[i].GPUY=this.quadList[i].GPUY+Math.sin(this._time)*1;
                }

              this.tt++;
                 if(this.tt>=100)
                 {
                 this.tt=0;
                 this.text.setText("FPS : "+ss2d.Stage2D.fps,0,30/2);

                 };


            },

            //鼠标点击事件
            //on click: the target's alpha changes into 0.5
            onMouseDownHandler : function(e)
            {
                if(!(e.target instanceof  ss2d.Stage2D))
                {
                    e.target.setAlpha(.5);
                }
            }
        }
    );
})();