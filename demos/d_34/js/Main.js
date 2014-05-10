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
                        {src:"images/1.png", id:"1.png"},
                        {src:"images/1.xml", id:"1.xml"},

                        {src:"images/2.png", id:"2.png"},
                        {src:"images/2.xml", id:"2.xml"},

                        {src:"images/3.png", id:"3.png"},
                        {src:"images/3.xml", id:"3.xml"},

                        {src:"images/4.png", id:"4.png"},
                        {src:"images/4.xml", id:"4.xml"},

                        {src:"images/5.png", id:"5.png"},
                        {src:"images/5.xml", id:"5.xml"},

                        {src:"images/6.png", id:"6.png"},
                        {src:"images/6.xml", id:"6.xml"},

                        {src:"images/7.png", id:"7.png"},
                        {src:"images/7.xml", id:"7.xml"},

                        {src:"images/8.png", id:"8.png"},
                        {src:"images/8.xml", id:"8.xml"}
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
            list:null,
            _init:function()
            {
                this.list=[];

                //创建纹理样式
                //create texture style
                var textureStyle=new ss2d.TextureStyle();

                //设置纹理样式为重复
                //set texture style as MIRRORED_REPEAT
                textureStyle.xTile=ss2d.TextureStyle.MIRRORED_REPEAT;
                textureStyle.yTile=ss2d.TextureStyle.MIRRORED_REPEAT;

                //创建多张纹理
                //using arrays create several texture
                var arr=[
                    new ss2d.Texture(demo.Main.assets.getResult("1.png"),demo.Main.assets.getResult("1.xml")),
                    new ss2d.Texture(demo.Main.assets.getResult("2.png"),demo.Main.assets.getResult("2.xml")),
                    new ss2d.Texture(demo.Main.assets.getResult("3.png"),demo.Main.assets.getResult("3.xml")),
                    new ss2d.Texture(demo.Main.assets.getResult("4.png"),demo.Main.assets.getResult("4.xml")),
                    new ss2d.Texture(demo.Main.assets.getResult("5.png"),demo.Main.assets.getResult("5.xml")),
                    new ss2d.Texture(demo.Main.assets.getResult("6.png"),demo.Main.assets.getResult("6.xml")),
                    new ss2d.Texture(demo.Main.assets.getResult("7.png"),demo.Main.assets.getResult("7.xml")),
                    new ss2d.Texture(demo.Main.assets.getResult("8.png"),demo.Main.assets.getResult("8.xml"))
                ]

                //创建一个游戏场景,元素个数为100
                //create game scene with 100 elements
                var quadlist=new ss2d.Scene(arr,100);

                //将场景加入到舞台
                //add scene to the stage
                ss2d.stage.addChild(quadlist);

                //创建8个动画
                //create the 8 animations
                for(var i=0;i<8;i++)
                {
                    var q1=quadlist.applyQuad();
                    q1.setX(ss2d.Stage2D.stageWidth*Math.random());
                    q1.setY(ss2d.Stage2D.stageHeight*Math.random());
                    q1.setCenter(true);
                    q1.setTextureID(i);
                    q1.setTileId(parseInt(arr[i].quadResource.quadDataList.length*Math.random()));
                    q1.loop(true);
                    q1.play();
                    quadlist.showQuad(q1);
                    this.list.push(q1);
                }

            }


        }
    );
})();