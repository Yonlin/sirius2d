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
                        {src:"images/logo.png", id:"logo"}
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

            group_1:null,
            group_2:null,
            group_3:null,
            group_4:null,
            _init:function()
            {

                this.quadList=[];

                //创建纹理对象
                //create texture
                var texture=new ss2d.Texture(demo.Main.assets.getResult("logo"));

                //创建游戏场景,元素为4个
                //create game scene with 4 elements
                var scene=new ss2d.Scene(texture,4);

                //添加到舞台显示
                //add game scene to the stage
                ss2d.stage.addChild(scene);

                //创建一个组
                //create a group
                this.group_1=new ss2d.Group();

                //申请quad
                //register quad
                var quad_1=scene.applyQuad();

                //开启鼠标检测
                //enable mouse event
                quad_1.setMouseEnabled(true);

                //提交给场景显示
                //display quad
                scene.showQuad(quad_1);

                //添加到组
                //add quad to the group
                this.group_1.addChild(quad_1);

                //创建组2
                //create group2
                this.group_2=new ss2d.Group();
                var quad_2=scene.applyQuad();
                quad_2.setMouseEnabled(true);
                scene.showQuad(quad_2);
                this.group_2.addChild(quad_2);

                //设置组2的坐标
                //set group2 pos
                this.group_2.setX(quad_2.getWidth()/2);
                this.group_2.setY(quad_2.getHeight()/2);

                //设置组2的比例
                //set group2 scale
                this.group_2.setScaleX(.5);
                this.group_2.setScaleY(.5);

                //设置组2的父组
                //set group2's parent
                this.group_2.setParentGroup(this.group_1);


                //创建组3
                //create group3
                this.group_3=new ss2d.Group();
                var quad_3=scene.applyQuad();
                quad_3.setMouseEnabled(true);
                scene.showQuad(quad_3);
                this.group_3.addChild(quad_3);
                this.group_3.setX(quad_3.getWidth()/2);
                this.group_3.setY(quad_3.getHeight()/2);
                this.group_3.setScaleX(.2);
                this.group_3.setScaleY(.2);
                this.group_3.setParentGroup(this.group_2);

                //创建组4
                //create group4
                this.group_4=new ss2d.Group();
                var quad_4=scene.applyQuad();
                quad_4.setMouseEnabled(true);
                scene.showQuad(quad_4);
                this.group_4.addChild(quad_4);
                this.group_4.setX(quad_4.getWidth()/2);
                this.group_4.setY(quad_4.getHeight()/2);
                this.group_4.setScaleX(.1);
                this.group_4.setScaleY(.1);
                this.group_4.setParentGroup(this.group_3);

                //注册鼠标侦听器
                //add mouse event listener
                ss2d.stage.addEventListener(ss2d.MouseEvent.MOUSE_DOWN, this.onMouseDownHandler.bind(this));
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