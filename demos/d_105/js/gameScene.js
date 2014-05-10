var Elem_Matrix_ROWs=7;
var Elem_Matrix_COLs=7;
var Elem_Matrix = [];
var eliminate_LIST= [];

var Elem_Destory_Time=10/60;
var Elem_Show_Time=10/60;
var Elem_FallDown_Time=20/60;
var Elem_Switch_Time=15/60;
// var delay_Show = cc.DelayTime.create(Elem_Show_Time);
// var delay_Destory = cc.DelayTime.create(Elem_Destory_Time);
// var delay_FallDown = cc.DelayTime.create( Elem_FallDown_Time);
// var delay_Switch = cc.DelayTime.create( Elem_Switch_Time);
var gameW,gameH;


var GameScene=Class
    (
        /** @lends myGame.Main.prototype */
        {
        	STATIC :
            {SceneName:"gameScene",
            _Res:{}
            },
            isActivate:true,
//             title:null,
            satartBtn:null,
			myGameScene:null,
			//下落高度
			 fallHeight:{},
			 Animation_Complete:true,
			 switch_Complete:true,
			 selectedElem:null,
			 selectedImg:null,
			 totalScore:0,
			 curScore:0,
			 processStatus:{"normal":0,"eliminate":1,"fill":2,"folldown":3,"reflash":4},
			 status:0,
            /**
             * 初始化
             */
            initialize : function()
            {
                this._Res={};
                myGame.Main.curGameScene=this;
                this._init();
            },

            _init:function()
            {
                 gameW=ss2d.Stage2D.stageWidth;
                 gameH=ss2d.Stage2D.stageHeight;
                 ss2d.curGameScene=this;
                //创建快速渲染着色器,无视颜色变换提高效率
                var shaderQuick=new ss2d.ShaderQuick();

                
                var png=myGame.Main.assets.getResult("game.png"),
                    xml=myGame.Main.assets.getResult("game.xml");
                var gameTexture=new ss2d.Texture(png,xml);
                this._Res["gameTexture"]=gameTexture;
                this.myGameScene=new ss2d.Scene(gameTexture,90);
                this.addToScene("myGameScene",this.myGameScene);
				
				//创建背景
				this.initBG();

				//UI
  				this.initUI();
				
				//  粒子
				this.initParticle();
				
                //注册帧事件
                ss2d.stage.addEventListener(ss2d.Event.ENTER_FRAME, this.onEnterFrameHandler.bind(this));
               
            },
			initBG:function(){
				  var bg=this.myGameScene.applyQuad();
                this.myGameScene.showQuad(bg);
                bg.setTileName("gamebg");
                //有长宽拉伸不能为单数？
                bg.setWidth(gameW);
                bg.setHeight(gameH);
                bg.setX(0);
                bg.setY(0);
			},
            initUI:function(){
				var gameTexture=this._Res["gameTexture"];
                var topbar=this.myGameScene.applyQuad();
                this.myGameScene.showQuad(topbar);
                topbar.setTileName("topbottom");
                topbar.setWidth(gameW);
                topbar.setX(0);
                topbar.setY(0);
                
     
                var comboLine=new ss2d.MovieClip(gameTexture);
                comboLine.setTileName("timeline");
                comboLine.setRotation(-90);
                comboLine.setX(gameW-72);
                comboLine.setY(215);
				ss2d.stage.addChild(comboLine);
				

//              var scoreBottom=this.myGameScene.applyQuad();
//              this.myGameScene.showQuad(comboLine);
//              scoreBottom.setTileName("score");
//              scoreBottom.setRotation(-90);
//              scoreBottom.setX(12);
//              scoreBottom.setY(56);
                
                var foot=this.myGameScene.applyQuad();
                this.myGameScene.showQuad(foot);
                foot.setTileName("bottom");
                foot.setWidth(gameW);
                foot.setX(0);
                foot.setY(gameH-25);
                  ///timeline
				
  				var btn_X=gameW/ 2,btn_Y=100;
  				var timeline=new TimeLine(this.myGameScene);
  				timeline.setPosition(gameW/ 2,100);
  				timeline.start();

  //lab  

                    this.scoreText=new ss2d.TextField(128,128);
                    this.scoreText.setFontSize(26);
                    this.scoreText.setColor(.2,.2,.2);
                    this.scoreText.setText("0");
                    this.scoreText.setX(10);
                    this.scoreText.setY(10);
                    ss2d.stage.addChild(this.scoreText);
                    
                    var tipText=new ss2d.TextField(128,128);
                    tipText.setFontSize(30);
                    tipText.setColor(.2,.2,.2);
                    tipText.setText("combo!");
  					
                    tipText.setX(btn_X-32);
                    tipText.setY(btn_Y+100);
                    ss2d.stage.addChild(tipText);

			},
			initParticle:function(){
			   //创建场景
                //create game scene
                var quadlist=new ss2d.Scene(new ss2d.Texture(myGame.Main.assets.getResult("effect.png"),myGame.Main.assets.getResult("effect.xml")),100);
                ss2d.stage.addChild(quadlist);
                quadlist.blend(ss2d.Blend.BLEND_ADD_ALPHA);
                //创建一个粒子发射器
                this.particleEmittersCPU=new ss2d.ParticleEmittersCPU(quadlist,100);
                //设置粒子样式为默认：火苗样式
                //set particle style as default: flame style
                this.particleStyle=new ss2d.ParticleStyle();
				this.particleStyle.tileName="star2";
				this.particleStyle.angleValue=0;
				this.particleStyle.scaleX=.8;
				this.particleStyle.scaleY=.8;
				this.particleStyle.rotationRandom=1;
				this.particleStyle.speedValue=4;
				this.particleEmittersCPU.sendParticle(200,400,this.particleStyle);

			},
   
            /**
             * 帧事件
             * @param e
             */
             MoveArr:[],
            onEnterFrameHandler : function(e)
            {
				//粒子效果			   
	  			 this.particleEmittersCPU.sendParticle(ss2d.Stage2D.mouseX,ss2d.Stage2D.mouseY,this.particleStyle);

            },
            //方便场景切换时，清空资源仓库
            addToScene:function(resName,child){
                   ss2d.stage.addChild(child);
//              添加到当前场景的资源仓库，方便释放资源
                this._Res[resName]=(child);
            }
        }
    );

GameScene.Create=function(){
     var  scene=new GameScene();
    return scene;
};