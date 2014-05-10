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
                //创建（动画）纹理
                //create texture (animation)
                var texture=new ss2d.Texture(demo.Main.assets.getResult("animationpng"),demo.Main.assets.getResult("animationxml"));

                //创建影片剪辑对象
                //create movie clip
                var mc1=new ss2d.MovieClip(texture);

                //设置居中对其
                //align center
                mc1.setCenter(true);

                //设置坐标
                //set pos
                mc1.setX(ss2d.Stage2D.stageWidth/2-100);
                mc1.setY(ss2d.Stage2D.stageHeight/2);

                //设置循环播放
                //set loop animation
                mc1.loop(true);

                //设置动画播放
                //play animation
                mc1.play();

                //设置FPS为50
                //set FPS 50
                mc1.setAnimationSpeed(50);

                //添加到场景显示
                //add movie clip to the stage
                ss2d.stage.addChild(mc1);

                //创建第二个动画
                // create the second animation
                var mc2=new ss2d.MovieClip(texture);
                mc2.setCenter(true);
                mc2.setX(ss2d.Stage2D.stageWidth/2);
                mc2.setY(ss2d.Stage2D.stageHeight/2);
                mc2.loop(true);
                mc2.play();
                mc2.setAnimationSpeed(50);

                //通过数字设置动画片段（起始数字为0，详见images/animation.xml）
                //set animation segment by numbers(start number:0, more info on images/animation.xml)
                mc2.setTileId(1);
                ss2d.stage.addChild(mc2);

                //创建第三个动画
                // create the third animation
                var mc3=new ss2d.MovieClip(texture);
                mc3.setCenter(true);
                mc3.setX(ss2d.Stage2D.stageWidth/2+100);
                mc3.setY(ss2d.Stage2D.stageHeight/2);
                mc3.loop(true);
                mc3.play();
                mc3.setAnimationSpeed(50);

                //通过名称设置动画片段（详见images/animation.xml）
                //set animation segment by strings( more info on images/animation.xml)
                mc3.setTileName("person");
                ss2d.stage.addChild(mc3);

                ss2d.stage.addEventListener(ss2d.MouseEvent.MOUSE_DOWN,this.onMouseDownHandler);
            },

            onMouseDownHandler : function(e)
            {
                ss2d.debug=true;
                ss2d.log("点击");
                //如果点击对象不是场景那么就设置透明度
                //on click: the target's alpha changes into 0.5
                //if(!(e.target instanceof  ss2d.Stage2D))
                {
                    //e.target.setAlpha(.5);
                }
            }
        }
    );
})();