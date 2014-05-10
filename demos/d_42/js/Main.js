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
//text list
			textList:[],
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


            getScope:function(value)
            {
                textureWidth = 2;
                while(textureWidth < value) {
                    textureWidth <<= 1;
                }
                return textureWidth;
            },
            _init:function()
            {
                for(var i=0;i<10;i++)
                {

                    //创建文本,设置文本占用的宽度和高度

                    var text=new ss2d.TextField(this.getScope(Math.random()*60+200),this.getScope(Math.random()*60+50));

                    //设置字体大小
                    text.setFontSize(Math.random()*45+10);

                    //设置透明度
                    text.setAlpha(Math.random());

                    //设置颜色
                    text.setColor(.5+Math.random(),.5+Math.random(),.5+Math.random());

                    //设置文字
                    text.setText("Sirius2D");

                    //添加到舞台显示
                    ss2d.stage.addChild(text);

					this.textList.push(text);
					
                    var left_foot_skeleton=new ss2d.Group();
                    left_foot_skeleton.addChild(text);
                    left_foot_skeleton.setX(Math.random()*ss2d.Stage2D.stageWidth);
                    left_foot_skeleton.setY(Math.random()*ss2d.Stage2D.stageHeight);
                }

            }

        }
    );
})();