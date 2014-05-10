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
                        {src:"images/magma.jpg", id:"magma.jpg"}
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

                //创建场景
                //create game scene
                var quadlist=new ss2d.Scene(new ss2d.Texture(demo.Main.assets.getResult("magma.jpg"),textureStyle),100);

                //设置玻璃着色器
                //set shader as glass shader
                quadlist.setShader(new ss2d.ShaderGlass());

                //将场景加入到舞台
                //add scene to the stage
                ss2d.stage.addChild(quadlist);

                //以下均是为岩浆效果做准备，使用顶点偏移实现，最好在xml设置
                //below is preparation for the magma effects (using vertex offset), better prepare them in XML
                var leftArr=[2,2,1,2,1,1,1,1,1,1,1,1];
                var rightArr=[2,2,1,3,1,1,1,1,1,1,1,1]
                for(var i=1;i<12;i++)
                {
                    var q1=quadlist.applyQuad();
                    q1.setX(ss2d.Stage2D.stageWidth/2);
                    q1.setY(i*q1.getHeight()/6-20);
                    q1.setCenter(true);



                    ss2d.debug=true;
                    ss2d.log(q1.getIndexVertex(0).x);
                    q1.setTileYOffset(i*q1.getHeight()/6)
                    q1.setTileWidthOffset(-q1.getWidth()+q1.getWidth()/6);
                    q1.setTileHeightOffset(-q1.getHeight()+q1.getHeight()/6);

                    quadlist.showQuad(q1);
                    this.list.push(q1);
                }

                this.list[0].setIndexVertex(2,1,-1);
                this.list[0].setIndexVertex(3,1+.1,1);

                this.list[0].setIndexVertex(0,-1,-1);
                this.list[0].setIndexVertex(1,-1 -.4,1);


                this.list[1].setIndexVertex(2,1 +.1,-1);
                this.list[1].setIndexVertex(3,1 +.4,1);

                this.list[1].setIndexVertex(0,-1 -.4,-1);
                this.list[1].setIndexVertex(1,-1 +.6,1);

                this.list[2].setIndexVertex(2,1 +.4,-1);
                this.list[2].setIndexVertex(3,1 +.5 ,1);

                this.list[2].setIndexVertex(0,-1 +.6,-1);
                this.list[2].setIndexVertex(1,-1 +.2,1);


                this.list[3].setIndexVertex(2,1 +.5,-1);
                this.list[3].setIndexVertex(3,1 ,1);

                this.list[3].setIndexVertex(0,-1 +.2,-1);
                this.list[3].setIndexVertex(1,-1,1);

                this.list[3].setIndexVertex(2,1 +.5,-1);
                this.list[3].setIndexVertex(3,1+1 ,1);

                this.list[3].setIndexVertex(0,-1 +.2,-1);
                this.list[3].setIndexVertex(1,-1-1,1);

                this.list[4].setIndexVertex(2,1 +1,-1);
                this.list[4].setIndexVertex(3,1 ,1);

                this.list[4].setIndexVertex(0,-1 -1,-1);
                this.list[4].setIndexVertex(1,-1,1);

                this.list[6].setIndexVertex(2,1,-1);
                this.list[6].setIndexVertex(3,1+3 ,1);

                this.list[6].setIndexVertex(0,-1,-1);
                this.list[6].setIndexVertex(1,-1-1,1);

                this.list[7].setIndexVertex(2,1+3,-1);
                this.list[7].setIndexVertex(3,1+3.5 ,1);

                this.list[7].setIndexVertex(0,-1-1,-1);
                this.list[7].setIndexVertex(1,-1-1.5,1);

                this.list[8].setIndexVertex(2,1+3.5,-1);
                this.list[8].setIndexVertex(3,1+4 ,1);

                this.list[8].setIndexVertex(0,-1-1.5,-1);
                this.list[8].setIndexVertex(1,-1-2,1);

                this.list[9].setIndexVertex(2,1+4,-1);
                this.list[9].setIndexVertex(3,1+5 ,1);

                this.list[9].setIndexVertex(0,-1-2,-1);
                this.list[9].setIndexVertex(1,-1-3,1);

                this.list[10].setIndexVertex(2,1+5,-1);
                this.list[10].setIndexVertex(3,1+10 ,1);

                this.list[10].setIndexVertex(0,-1-3,-1);
                this.list[10].setIndexVertex(1,-1-5,1);

                //注册帧事件
                //add frame event listener
                ss2d.stage.addEventListener(ss2d.Event.ENTER_FRAME, this.onEnterFrameHandler.bind(this));


            },

            //切片动画实现循环位移运动
            //using clip-based animation to implement loop movement
            time:0,
            onEnterFrameHandler : function(e)
            {
                this.time=-.5;
                for(var i=0;i<this.list.length;i++)
                {
                    this.list[i].setTileYOffset(this.list[i].getTileYOffset()+this.time);
                }
            }
        }
    );
})();