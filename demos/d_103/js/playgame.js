/**
 * Created with JetBrains WebStorm.
 * User: chongchong
 * Date: 14-3-15
 * Time: 下午11:46
 * To change this template use File | Settings | File Templates.
 */


var MainGame=Class
    (
        /** @lends demo.Main.prototype */
        {
            SceneName:"MainGame",
            _ResourcesWareroom:[],

            plane:null,
            bulletScene:null,
            bulletList:null,
            bg:null,
            pg:null,
            particleEmittersCPU:null,
            particleStyle:null,
            particleScene:null,
            planeScene:null,
            explodeScene:null,
            enemyList:null,
            gap:0,
            enemyGap:0,
            time:0,
            rotat:0,
            rotatValue:0,
            text:null,
            attackValue:0,
            fpsValue:0,
            /**
             * 初始化
             */
            initialize : function()
            {
                this._ResourcesWareroom=[];
                this._init();
            },

            _init:function()
            {
                //创建快速渲染着色器,无视颜色变换提高效率
                var shaderQuick=new ss2d.ShaderQuick();

                //创建背景
                this.bg=new ss2d.MovieClip(new ss2d.Texture(demo.Main.assets.getResult("setting.jpg")));
                this.bg.blend(ss2d.Blend.BLEND_NONE);
                this.bg.setShader(shaderQuick);
                this.bg.setWidth(ss2d.Stage2D.stageWidth);
                this.bg.setHeight(ss2d.Stage2D.stageHeight);
                ss2d.stage.addChild(this.bg);

                //创建飞机纹理
                var planeTexture=new ss2d.Texture(demo.Main.assets.getResult("plane.png"),demo.Main.assets.getResult("plane.xml"));

                //创建飞机资源池
                this.planeScene=new ss2d.Scene(planeTexture,50);
                this.planeScene.setShader(shaderQuick)
                ss2d.stage.addChild(this.planeScene);

                //申请一个quad
                this.plane=this.planeScene.applyQuad();

                //显示飞机quad
                this.planeScene.showQuad(this.plane);
                this.plane.setTileName("oneself");
                this.plane.setCenter(true);

                //开启二次GPU加速
                this.plane.GPU=true;

                //创建粒子资源池
                this.particleScene=new ss2d.Scene(planeTexture,50);
                ss2d.stage.addChild(this.particleScene);

                //设置混色模式为叠加
                this.particleScene.blend(ss2d.Blend.BLEND_ADD_ALPHA);


                //创建敌人飞机资源池,元素数量为50
                this.bulletScene=new ss2d.Scene(new ss2d.Texture(demo.Main.assets.getResult("bullet.png"),demo.Main.assets.getResult("bullet.xml")),50);
                this.bulletScene.setShader(shaderQuick);
                this.bulletScene.blend(ss2d.Blend.BLEND_ADD);
                ss2d.stage.addChild(this.bulletScene);

                //创建前景
                this.pg=new ss2d.MovieClip(new ss2d.Texture(demo.Main.assets.getResult("prospect.png")))
                this.pg.setShader(shaderQuick);
                this.pg.setWidth(ss2d.Stage2D.stageWidth);
                this.pg.setHeight(ss2d.Stage2D.stageHeight);
                ss2d.stage.addChild(this.pg);


                //创建敌人数组
                this.enemyList=[];

                //创建子弹数组
                this.bulletList=[];


                //创建计时器
                var timer = new ss2d.Timer(300);
                timer.addEventListener(ss2d.TimerEvent.TIMER,this.timeRun.bind(this));
                timer.start();


                //创建用于FPS的文本
                this.text=new ss2d.TextField(128,64);
                ss2d.stage.addChild(this.text);

                //注册帧事件
                ss2d.stage.addEventListener(ss2d.Event.ENTER_FRAME, this.onEnterFrameHandler.bind(this));

            },


            //创建敌人
            timeRun:function(e)
            {
                var enemy=this.planeScene.applyQuad();
                if(enemy!=null)
                {
                    enemy.setTileName("enemy"+parseInt(Math.random()*6+1));
                    enemy.stop();
                    enemy.GPU=true;
                    enemy.GPUX=Math.random()*ss2d.Stage2D.stageWidth-100;
                    enemy.GPUY=-200;
                    enemy.setUserData([Math.random()*5+3,100]);
                    this.planeScene.showQuad(enemy,true);
                    this.enemyList.push(enemy);
                }
            },


            /**
             * 发射子弹
             * @param x
             * @param y
             * @param rotation
             */
            attack:function(x,y,name)
            {
                var quad=this.bulletScene.applyQuad();
                if(quad!=null)
                {
                    quad.setTileName(name);
                    quad.setCenter(true);
                    quad.stop();
                    quad.GPU=true;
                    quad.GPUX=x;
                    quad.GPUY=y;
                    this.bulletScene.showQuad(quad,true);
                    this.bulletList.push(quad);
                }
            },


            /**
             * 帧事件
             * @param e
             */
            onEnterFrameHandler : function(e)
            {
                this.gap++;
                this.enemyGap++;
                this.rotatValue+=.1;
                this.rotat+=Math.cos(this.rotatValue)*.6;
                this.fpsValue++;

                //FPS显示
                if(this.fpsValue>=30)
                {
                    this.text.setText("FPS : "+ss2d.Stage2D.fps);
                    this.fpsValue=0;
                }


                //发射不同类型的子弹,间隔为6
                if(this.gap>=6){

                    this.gap=0;
                    this.attack(this.plane.GPUX-30,this.plane.GPUY,"enemybullet1");
                    this.attack(this.plane.GPUX-20,this.plane.GPUY,"enemybullet2");
                    this.attack(this.plane.GPUX,this.plane.GPUY,"enemybullet2");
                    this.attack(this.plane.GPUX+20,this.plane.GPUY,"enemybullet2");
                    this.attack(this.plane.GPUX+30,this.plane.GPUY,"enemybullet1");
                }

                //批量运动子弹,并且检测子弹是否超出屏幕边界
                for(var i=0;i<this.bulletList.length;i++)
                {
                    this.bulletList[i].GPUY-=20;
                    if(this.bulletList[i].GPUY<=-20)
                    {
                        //隐藏子弹
                        this.bulletScene.hideQuad(this.bulletList[i]);

                        //销毁子弹
                        this.bulletList[i].dispose();

                        //从数组中销毁引用
                        this.bulletList.splice(i,1);
                    }
                }

                //批量运动敌人飞机
                for(var i=0;i<this.enemyList.length;i++)
                {
                    this.enemyList[i].GPUY+=this.enemyList[i].getUserData()[0];
                }



                for(var n=0;n<this.bulletList.length;n++)
                    for(var j=0;j<this.enemyList.length;j++)
                    {
                        //敌人飞机的边缘检测
                        if(this.enemyList[j].getUserData()[1]<=0||this.enemyList[j].GPUY>=ss2d.Stage2D.stageHeight+20)
                        {
                            //隐藏敌人飞机
                            this.planeScene.hideQuad(this.enemyList[j]);

                            //销毁敌人飞机
                            this.enemyList[j].dispose();

                            //从数组中销毁引用
                            this.enemyList.splice(j,1);
                            break;
                        }

                        //敌人飞机和子弹的圆形碰撞检测的,半径为30
                        if(this.enemyList[j].hitTestRoundness(this.bulletList[n].GPUX,this.bulletList[n].GPUY,30))
                        {
                            //隐藏子弹
                            this.bulletScene.hideQuad(this.bulletList[n]);

                            //销毁子弹
                            this.bulletList[n].dispose();

                            //从数组总销毁子弹引用
                            this.bulletList.splice(n,1);

                            //利用零时属性减少敌人血量
                            this.enemyList[j].setUserData([this.enemyList[j].getUserData()[0],this.enemyList[j].getUserData()[1]-15]);

                            break;
                        }
                    }

                //时间步累加
                this.time-=3;

                //运动背景
                this.bg.setTileYOffset(this.time);

                //运动前景时间*2，形成错开的视觉差
                this.pg.setTileYOffset(this.time*2);

                //飞机缓动跟随飞机
                this.plane.GPUX+=(ss2d.Stage2D.mouseX-this.plane.GPUX)/5;
                this.plane.GPUY+=(ss2d.Stage2D.mouseY-this.plane.GPUY)/5;
            }
        }
    );
MainGame.Create=function(){
    var  scence=new MainGame();
    return scence;
};