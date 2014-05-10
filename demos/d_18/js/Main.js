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

            body_skeleton:null,
            head_skeleton:null,
            left_arm_skeleton:null,
            right_arm_skeleton:null,

            left_wrist_skeleton:null,
            right_wrist_skeleton:null,

            left_hand_skeleton:null,
            right_hand_skeleton:null,

            left_thigh_skeleton:null,
            right_thigh_skeleton:null,

            left_shank_skeleton:null,
            right_shank_skeleton:null,

            left_foot_skeleton:null,
            right_foot_skeleton:null,

            time:0,

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
                        {src:"images/skeleton.png", id:"skeletonpng"},
                        {src:"images/skeleton.xml", id:"skeletonxml"}
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

                this.quadList=[];

                //创建纹理对象
                //create texture
                var texture=new ss2d.Texture(demo.Main.assets.getResult("skeletonpng"),demo.Main.assets.getResult("skeletonxml"));

                //创建游戏场景,元素数量为14
                //create game scene with 14 elements
                var scene=new ss2d.Scene(texture,14);

                //提交给舞台显示
                //add game scene to the stage
                ss2d.stage.addChild(scene);


                //创建身体模块
                //create body quad
                var body=scene.applyQuad();
                body.setTileName("body");
                scene.showQuad(body);
                body.setX(-body.getWidth()/2);
                body.setY(-body.getHeight()/2);

                //使用“组”来实现骨骼动画
                //using group to implement skeletal animation


                this.body_skeleton=new ss2d.Group();
                this.body_skeleton.addChild(body);
                this.body_skeleton.setX(ss2d.Stage2D.stageWidth/2);
                this.body_skeleton.setY(ss2d.Stage2D.stageHeight/2-120);
                this.body_skeleton.setScaleX(.5);
                this.body_skeleton.setScaleY(.5);

                //创建头部模块
                //create head quad
                var head=scene.applyQuad();
                scene.showQuad(head);
                head.setTileName("head");
                ss2d.debug=true;
                ss2d.log(head.getWidth());
                head.setX(-head.getWidth()/2);
                head.setY(-head.getHeight()/2-30);
                this.head_skeleton=new ss2d.Group();
                this.head_skeleton.addChild(head);
                this.head_skeleton.setY(-170);



                this.body_skeleton.addChild(this.head_skeleton)

                //创建左胳臂模块
                //create left arm quad
                var armLeft=scene.applyQuad();
                scene.showQuad(armLeft);
                armLeft.setTileName("arm");
                armLeft.setX(-armLeft.getWidth()/2);
                armLeft.setY(-10);
                this.left_arm_skeleton=new ss2d.Group();
                this.left_arm_skeleton.addChild(armLeft);
                this.left_arm_skeleton.setY(-120);
                this.left_arm_skeleton.setX(-80);
                this.body_skeleton.addChild(this.left_arm_skeleton);

                //创建右胳臂模块
                //create right arm quad
                var armRight=scene.applyQuad();
                scene.showQuad(armRight);
                armRight.setTileName("arm");
                armRight.setX(-armRight.getWidth()/2);
                armRight.setY(-10);
                this.right_arm_skeleton=new ss2d.Group();
                this.right_arm_skeleton.addChild(armRight);
                this.right_arm_skeleton.setY(-120);
                this.right_arm_skeleton.setX(80);
                this.right_arm_skeleton.setScaleX(-1);
                this.body_skeleton.addChild(this.right_arm_skeleton);
                //创建左腕模块
                //create left wrist quad
                var wristLeft=scene.applyQuad();
                scene.showQuad(wristLeft);
                wristLeft.setTileName("wrist");
                wristLeft.setX(-wristLeft.getWidth()/2);
                wristLeft.setY(-wristLeft.getHeight()/2+70);
                this.left_wrist_skeleton=new ss2d.Group();
                this.left_wrist_skeleton.addChild(wristLeft);
                this.left_wrist_skeleton.setX(0);
                this.left_wrist_skeleton.setY(140);
                this.left_arm_skeleton.addChild(this.left_wrist_skeleton);
                //创建右腕模块
                //create right wrist quad
               var wristRight=scene.applyQuad();
                scene.showQuad(wristRight);
                wristRight.setTileName("wrist");
                wristRight.setX(-wristRight.getWidth()/2);
                wristRight.setY(-wristRight.getHeight()/2+70);
                this.right_wrist_skeleton=new ss2d.Group();
                this.right_wrist_skeleton.addChild(wristRight);
                this.right_wrist_skeleton.setX(0);
                this.right_wrist_skeleton.setY(140);
                this.right_arm_skeleton.addChild(this.right_wrist_skeleton);
                //创建左手模块
                //create left hand quad
                var handLeft=scene.applyQuad();
                scene.showQuad(handLeft);
                handLeft.setTileName("hand");
                handLeft.setX(-handLeft.getWidth()/2+5);
                handLeft.setY(-handLeft.getHeight()/2+30);
                this.left_hand_skeleton=new ss2d.Group();
                this.left_hand_skeleton.addChild(handLeft);
                this.left_hand_skeleton.setX(0);
                this.left_hand_skeleton.setY(140);
                this.left_wrist_skeleton.addChild(this.left_hand_skeleton)
                //创建右手模块
                //create right hand quad
                var handRight=scene.applyQuad();
                scene.showQuad(handRight);
                handRight.setTileName("hand");
                handRight.setX(-handRight.getWidth()/2+5);
                handRight.setY(-handRight.getHeight()/2+30);
                this.right_hand_skeleton=new ss2d.Group();
                this.right_hand_skeleton.addChild(handRight);
                this.right_hand_skeleton.setX(0);
                this.right_hand_skeleton.setY(140);
                this.right_wrist_skeleton.addChild(this.right_hand_skeleton)
                //创建左大腿模块
                //create left thigh quad
                var thighLeft=scene.applyQuad();
                scene.showQuad(thighLeft);
                thighLeft.setTileName("thigh");
                thighLeft.setX(-thighLeft.getWidth()/2+5);
                thighLeft.setY(0);
                this.left_thigh_skeleton=new ss2d.Group();
                this.left_thigh_skeleton.addChild(thighLeft);
                this.left_thigh_skeleton.setX(-45);
                this.left_thigh_skeleton.setY(150);
                this.body_skeleton.addChild(this.left_thigh_skeleton)
                //创建右大腿模块
                //create right thigh quad
                var thighRight=scene.applyQuad();
                scene.showQuad(thighRight);
                thighRight.setTileName("thigh");
                thighRight.setX(-thighRight.getWidth()/2+5);
                thighRight.setY(0);
                this.right_thigh_skeleton=new ss2d.Group();
                this.right_thigh_skeleton.addChild(thighRight);
                this.right_thigh_skeleton.setX(45);
                this.right_thigh_skeleton.setY(150);
                this.right_thigh_skeleton.setScaleX(-1);
                this.body_skeleton.addChild(this.right_thigh_skeleton);

                //创建左小腿模块
                //create left shank quad
                var shankLeft=scene.applyQuad();
                scene.showQuad(shankLeft);
                shankLeft.setTileName("shank");
                shankLeft.setX(-shankLeft.getWidth()/2);
                shankLeft.setY(0);
                this.left_shank_skeleton=new ss2d.Group();
                this.left_shank_skeleton.addChild(shankLeft);
                this.left_shank_skeleton.setX(0);
                this.left_shank_skeleton.setY(190);

                this.left_thigh_skeleton.addChild(this.left_shank_skeleton)

                //创建右小腿模块
                //create right shank quad
                var shankRight=scene.applyQuad();
                scene.showQuad(shankRight);
                shankRight.setTileName("shank");
                shankRight.setX(-shankRight.getWidth()/2);
                shankRight.setY(0);
                this.right_shank_skeleton=new ss2d.Group();
                this.right_shank_skeleton.addChild(shankRight);
                this.right_shank_skeleton.setX(0);
                this.right_shank_skeleton.setY(190);
                this.right_thigh_skeleton.addChild(this.right_shank_skeleton)
                //创建左脚模块
                //create left foot quad
                var footLeft=scene.applyQuad();
                scene.showQuad(footLeft);
                footLeft.setTileName("foot");
                footLeft.setX(-37);
                footLeft.setY(-20);
                this.left_foot_skeleton=new ss2d.Group();
                this.left_foot_skeleton.addChild(footLeft);
                this.left_foot_skeleton.setX(-5);
                this.left_foot_skeleton.setY(200);
                this.left_shank_skeleton.addChild(this.left_foot_skeleton);
                //创建右脚模块
                //create right foot quad
                var footRight=scene.applyQuad();
                scene.showQuad(footRight);
                footRight.setTileName("foot");
                footRight.setX(-37);
                footRight.setY(-20);
                this.right_foot_skeleton=new ss2d.Group();
                this.right_foot_skeleton.addChild(footRight);
                this.right_foot_skeleton.setX(-5);
                this.right_foot_skeleton.setY(200);
                this.right_shank_skeleton.addChild(this.right_foot_skeleton);
                //注册帧事件侦听器
                //add frame event listener
                ss2d.stage.addEventListener(ss2d.Event.ENTER_FRAME, this.onEnterFrameHandler.bind(this));

            },

            //骨骼循环运动
            //skeletal animation
            onEnterFrameHandler : function(e)
            {
                this.time+=.1;

                this.body_skeleton.setY(this.body_skeleton.getY()+Math.sin(this.time)*5);

                this.left_arm_skeleton.setRotation(this.left_arm_skeleton.getRotation()+Math.sin(this.time)*5);
                this.right_arm_skeleton.setRotation(this.right_arm_skeleton.getRotation()-Math.sin(this.time)*5);

                this.left_wrist_skeleton.setRotation(this.left_wrist_skeleton.getRotation()-Math.sin(this.time)*5);
                this.right_wrist_skeleton.setRotation(this.right_wrist_skeleton.getRotation()-Math.sin(this.time)*5);

                this.left_hand_skeleton.setRotation(this.left_hand_skeleton.getRotation()-Math.sin(this.time)*10);
                this.right_hand_skeleton.setRotation(this.right_hand_skeleton.getRotation()-Math.sin(this.time)*10);

                this.left_thigh_skeleton.setRotation(45-Math.sin(this.time)*20);
                this.right_thigh_skeleton.setRotation(-45+Math.sin(this.time)*20);

                this.left_shank_skeleton.setRotation(-45+Math.sin(this.time)*20);
                this.right_shank_skeleton.setRotation(-45+Math.sin(this.time)*20);

                this.left_foot_skeleton.setRotation(-10+Math.sin(this.time)*20);
                this.right_foot_skeleton.setRotation(-10+Math.sin(this.time)*20)



                //this.left_arm_skeleton.upData();
                this.body_skeleton.upData();


            }
        }
    );
})();