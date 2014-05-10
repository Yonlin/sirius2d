this.demo = this.demo || {};
(function()
{
    /**
     * 游戏主类
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
                this._manifest =
                    [
                        {src:"images/grassland.png", id:"grassland.png"},
                        {src:"images/GrassMaze.png", id:"grassMaze.png"},
                        {src:"images/Castle1.png", id:"castle1.png"}
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


            list:null,
            _init:function()
            {
                this.list=[];

                //创建背景
                var bg=new ss2d.MovieClip(new ss2d.Texture(demo.Main.assets.getResult("grassMaze.png")));

                //添加到舞台显示
                ss2d.stage.addChild(bg);

                //设置背景全屏
                bg.setWidth(ss2d.Stage2D.stageWidth);
                bg.setHeight(ss2d.Stage2D.stageHeight);

                //创建前景
                var prospect=new ss2d.MovieClip(new ss2d.Texture(demo.Main.assets.getResult("castle1.png")));

                //添加到舞台
                ss2d.stage.addChild(prospect);

                //设置前景全屏
                prospect.setWidth(ss2d.Stage2D.stageWidth);
                prospect.setHeight(ss2d.Stage2D.stageHeight);

                //创建草地场景,元素数量为60
                var scene=new ss2d.Scene(new ss2d.Texture(demo.Main.assets.getResult("grassland.png")),60);

                //添加到舞台显示
                ss2d.stage.addChild(scene);


                for (var i = 0; i <60; i++)
                {
                    //创建草地显示元素
                    var quad = scene.applyQuad();
                    scene.showQuad(quad);
                    quad.setX(Math.random()*ss2d.Stage2D.stageWidth);
                    quad.setY(480+Math.random()*60);

                    //创建草地类
                    this.list.push(new demo.GrasslandNode(quad));

                }

                ss2d.stage.addEventListener(ss2d.Event.ENTER_FRAME, this.onEnterFrameHandler.bind(this));

            },

            onEnterFrameHandler : function(e)
            {
                //循环滚动地球
                for(var j=0;j<this.list.length;j++)
                {
                    this.list[j].run();
                }
            }


        }
    );
})();