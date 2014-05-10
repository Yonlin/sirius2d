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
                        {src:"images/theearth.png", id:"theearth.png"},
                        {src:"images/keepout.png", id:"keepout.png"},
                        {src:"images/xinkong.jpg", id:"xinkong.jpg"}


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

            list:null,
            framescene:null,
            maskMc:null,
            shader:null,
            matrix3d:null,
            shaderLight:null,
            bg:null,
            mc:null,
            _init:function()
            {
                // 创建一个1024*512的空纹理
                // create a null texture (1024*512)
                var textureframe=new ss2d.Texture(1024.0,512.0);

                //转换为纹理缓存
                //transform into texture buffer
                textureframe.transformTextureBuffer();

                //用之前的纹理创建一个影片剪辑
                //create movie clip with the texture
                this.framescene=new ss2d.MovieClip(textureframe);

                //创建HDR滤镜
                //create HDR shader
                var hdr=new ss2d.ShaderHdr();

                //设置阈值
                //set threshold value
                hdr.mLuminance=2.3;

                //设置着色器
                //set movie clip shader as HDR shader
                this.framescene.setShader(hdr);

                //创建帧缓存
                //create frame buffer
                var frameBuffer=new ss2d.FrameBuffer();

                //设置显示对象
                //add movie clip to the frame buffer
                frameBuffer.setDisplay(this.framescene);

                //清理画面
                //clean the object (repaint)
                frameBuffer.isClear(true);

                //添加到舞台缓冲区
                //add frame buffer to the stage
                ss2d.stage.addFrameBuffer(frameBuffer);

                //添加到舞台显示
                //add movie clip to the stage
                ss2d.stage.addChild(this.framescene);

                //创建组
                //create group
                var group=new ss2d.Group();

                //设置组比例
                //set group scale
                group.setScaleX(.6);
                group.setScaleY(.6);

                //设置组位置
                //set group pos
                group.setX(-200);
                group.setY(400);

                //创建纹理样式表
                //create texture style
                var textureStyle=new ss2d.TextureStyle();

                //设置纹理样式为重复
                //set texture style as MIRRORED_REPEAT
                textureStyle.xTile=ss2d.TextureStyle.MIRRORED_REPEAT;
                textureStyle.yTile=ss2d.TextureStyle.MIRRORED_REPEAT;

                //创建背景
                //create background texture
                this.bg=new ss2d.MovieClip(new ss2d.Texture(demo.Main.assets.getResult("xinkong.jpg"),textureStyle));

                //设置波动滤镜
                //create glass shader
                var glass=new ss2d.ShaderGlass();

                //设置运动速度
                //set wave speed as 1
                glass.speed=1;

                //设置背景的着色器
                //set background shader as glass shader
                this.bg.setShader(glass);

                //添加到帧缓存显示
                //add background to the buffer
                frameBuffer.addChild(this.bg);

                //创建地球纹理
                //create the earth
                var scene=new ss2d.Scene(new ss2d.Texture(demo.Main.assets.getResult("theearth.png")),8*32);

                //创建灯光滤镜
                //create light
                this.shaderLight= new ss2d.ShaderLight();

                //设置灯光位置
                //set light pos
                this.shaderLight.lightY=.2;

                //设置灯光比例
                //set light scale
                this.shaderLight.lightScale=4;

                //设置灯光着色器
                //bind light to the scene
                scene.setShader(this.shaderLight);

                //添加到帧缓存显示
                //add scene to the buffer
                frameBuffer.addChild(scene);

                this.list=[];

                //用8*32个quads拼成一个圆弧地球
                //using 8*32 quads to form a circle(part of the earth)
                for(var i=0;i<8;i++)
                {
                    for(var j=0;j<32;j++)
                    {
                        var quad=scene.applyQuad();
                        group.addChild(quad);
                        quad.setX(j*64);
                        quad.setY(i*64);
                        quad.setTileWidthOffset(-quad.getWidth()+64);
                        quad.setTileHeightOffset(-quad.getHeight()+64);
                        quad.setTileXOffset(j*64);
                        quad.setTileYOffset(i*64);
                        quad.setIndexVertex(0,-1,-1-Math.sin(j*.09) * 6);
                        quad.setIndexVertex(2,1,-1-Math.sin((j+1)*.09) * 6);
                        quad.setIndexVertex(1,-1,1-Math.sin(j*.09) * 6);
                        quad.setIndexVertex(3,1,1-Math.sin((j+1)*.09) * 6);
                        this.list.push(quad);
                        scene.showQuad(quad);
                    }
                }

                //注册帧事件
                //add frame event listener
                ss2d.stage.addEventListener(ss2d.Event.ENTER_FRAME, this.onEnterFrameHandler.bind(this));
            },

            time:0,
            onEnterFrameHandler : function(e)
            {
                //移动灯光
                //light moves slowly
                this.shaderLight.lightX+=.0003;

                //循环滚动地球
                //the earth rotates slowly
                for(var j=0;j<this.list.length;j++)
                {
                    this.list[j].setTileXOffset(this.list[j].getTileXOffset() +.3);
                }
            }
        }
    );
})();