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
             * 角色
             * @type {ss2d.Quad}
             * @private
             */
            _role : null,

            _dir : 1,

            _keyW : false,

            _keyA : false,

            _keyS : false,

            _keyD : false,

            _moveSpeed : 5,

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
                this._loadManifest();
            },

            /**
             * 预加载游戏素材
             * @private
             */
            _loadManifest:function()
            {
                //预加载资源列表
                this._manifest =
                    [
                        {src:"images/role.png", id:"role.png"},
                        {src:"images/role.xml", id:"role.xml"}
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



            _init:function()
            {
                var text=new ss2d.TextField();
                text.setText("WASD控制移动");
                ss2d.stage.addChild(text);


                ss2d.debug = true;
                var scene = new ss2d.Scene(new ss2d.Texture(demo.Main.assets.getResult("role.png"),
                    demo.Main.assets.getResult("role.xml")),60);
                ss2d.stage.addChild(scene);

                this._role = scene.applyQuad();
                this._role.setX(ss2d.Stage2D.stageWidth / 2);
                this._role.setY(ss2d.Stage2D.stageHeight / 2);
                this._role.setPivotX(this._role.getWidth() / 2);
                this._role.setPivotY(this._role.getHeight());
                this._role.setAnimationSpeed(24);
                this._role.loop(true);
                this._role.setTileName("role1");
                scene.showQuad(this._role);


                demo[this._onKeydownHandler] = this._onKeydownHandler.bind(this);
                demo[this._onKeyupHandler] = this._onKeyupHandler.bind(this);
                demo[this._onEnterFrameHandler] = this._onEnterFrameHandler.bind(this);
                ss2d.global.addEventListener('keydown', demo[this._onKeydownHandler], false);
                ss2d.global.addEventListener('keyup', demo[this._onKeyupHandler], false);
                demo.Main.stage.addEventListener(ss2d.Event.ENTER_FRAME, demo[this._onEnterFrameHandler]);
            },

            _onKeydownHandler : function(e)
            {
                if (e.keyCode == 87) this._keyW = true;
                if (e.keyCode == 65) this._keyA = true;
                if (e.keyCode == 83) this._keyS = true;
                if (e.keyCode == 68) this._keyD = true;
            },

            _onKeyupHandler : function(e)
            {
                if (e.keyCode == 87) this._keyW = false;
                if (e.keyCode == 65) this._keyA = false;
                if (e.keyCode == 83) this._keyS = false;
                if (e.keyCode == 68) this._keyD = false;
            },

            /**
             * 逻辑部分
             * @param e
             */
            _onEnterFrameHandler : function(e)
            {
                var changeAvater = false;
                var angle = 90;
                var dx = 1;
                var dy = 1;
                var scaleX = 1;
                var walk = false;
                if (this._keyW == true &&
                    this._keyA == false &&
                    this._keyD == false &&
                    this._keyS == false)
                {
                    if (this._dir != 5) changeAvater = true;
                    this._dir = 5;
                    angle = 90;
                    dy = -1;
                    scaleX = 1;
                    walk = true;
                    ss2d.log(" -> w");
                }
                else if (this._keyW == false &&
                    this._keyA == true &&
                    this._keyD == false &&
                    this._keyS == false)
                {
                    if (this._dir != 3) changeAvater = true;
                    this._dir = 3;
                    angle = 180;
                    dy = 1;
                    scaleX = 1;
                    walk = true;
                    ss2d.log(" -> a");
                }
                else if (this._keyW == false &&
                    this._keyA == false &&
                    this._keyD == true &&
                    this._keyS == false)
                {
                    if (this._dir != 3) changeAvater = true;
                    this._dir = 3;
                    angle = 0;
                    dy = 1;
                    scaleX = -1;
                    walk = true;
                    ss2d.log(" -> d");
                }
                else if (this._keyW == false &&
                    this._keyA == false &&
                    this._keyD == false &&
                    this._keyS == true)
                {
                    if (this._dir != 1) changeAvater = true;
                    this._dir = 1;
                    angle = 90;
                    dy = 1;
                    scaleX = 1;
                    walk = true;
                    ss2d.log(" -> s");
                }
                else if (this._keyW == true &&
                    this._keyA == true &&
                    this._keyD == false &&
                    this._keyS == false)
                {
                    if (this._dir != 4) changeAvater = true;
                    this._dir = 4;
                    angle = 45;
                    dy = -1;
                    dx = -1;
                    scaleX = 1;
                    walk = true;
                    ss2d.log(" -> wa");
                }
                else if (this._keyW == true &&
                    this._keyA == false &&
                    this._keyD == true &&
                    this._keyS == false)
                {
                    if (this._dir != 4) changeAvater = true;
                    this._dir = 4;
                    angle = 45;
                    dy = -1;
                    dx = 1;
                    scaleX = -1;
                    walk = true;
                    ss2d.log(" -> wd");
                }
                else if (this._keyW == false &&
                    this._keyA == false &&
                    this._keyD == true &&
                    this._keyS == true)
                {
                    if (this._dir != 2) changeAvater = true;
                    this._dir = 2;
                    angle = 45;
                    dy = 1;
                    dx = 1;
                    scaleX = -1;
                    walk = true;
                    ss2d.log(" -> ds");
                }
                else if (this._keyW == false &&
                    this._keyA == true &&
                    this._keyD == false &&
                    this._keyS == true)
                {
                    if (this._dir != 2) changeAvater = true;
                    this._dir = 2;
                    angle = 45;
                    dy = 1;
                    dx = -1;
                    scaleX = 1;
                    walk = true;
                    ss2d.log(" -> as");
                }
                if (changeAvater) this._role.setTileName("role" + this._dir);
                if (walk == true)
                {
                    this._role.setScaleX(scaleX);
                    this._role.setX(this._role.getX() + Math.cos(angle * Math.PI / 180) * dx * this._moveSpeed);
                    this._role.setY(this._role.getY() + Math.sin(angle * Math.PI / 180) * dy * this._moveSpeed);
                    if (this._role.getX() > ss2d.Stage2D.stageWidth)
                    {
                        this._role.setX(0);
                    }
                    if (this._role.getX() < 0)
                    {
                        this._role.setX(ss2d.Stage2D.stageWidth);
                    }
                    if (this._role.getY() > ss2d.Stage2D.stageHeight)
                    {
                        this._role.setY(0);
                    }
                    if (this._role.getY() < 0)
                    {
                        this._role.setY(ss2d.Stage2D.stageHeight);
                    }
                }
            }
        }
    );
})();