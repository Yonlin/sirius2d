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

                //创建一个游戏场景,元素（quad）个数为3
                //create game scene with 3 elements（quads）
                var scene=new ss2d.Scene(texture,3);

                //显示游戏场景
                //add game scene to the stage
                ss2d.stage.addChild(scene);

                //从游戏场景中获取quad
                //resister quad
                var quad1=scene.applyQuad();

                //循环播放动画
                //loop animation
                quad1.loop(true);

                //开始播放动画
                //play animation
                quad1.play();

                //设置动画居中对其
                //align center
                quad1.setCenter(true);

                //设置动画位置
                //set quad pos
                quad1.setX(ss2d.Stage2D.stageWidth/2-100);
                quad1.setY(ss2d.Stage2D.stageHeight/2);

                //设置动画播放片段
                //name the animation segment
                quad1.setTileName("dragon");

                //设置动画帧率
                //set FPS 50
                quad1.setAnimationSpeed(50);

                //提交给场景显示
                //display quad
                scene.showQuad(quad1);

                //第二个quad
                //another quad
                var quad2=scene.applyQuad();
                quad2.loop(true);
                quad2.play();
                quad2.setCenter(true);
                quad2.setX(ss2d.Stage2D.stageWidth/2);
                quad2.setY(ss2d.Stage2D.stageHeight/2);
                quad2.setTileName("monster");
                quad2.setAnimationSpeed(50);
                scene.showQuad(quad2);

                var quad3=scene.applyQuad();
                quad3.loop(true);
                quad3.play();
                quad3.setCenter(true);
                quad3.setX(ss2d.Stage2D.stageWidth/2+100);
                quad3.setY(ss2d.Stage2D.stageHeight/2);
                quad3.setTileName("person");
                quad3.setAnimationSpeed(50);
                scene.showQuad(quad3);
            }
        }
    );
})();