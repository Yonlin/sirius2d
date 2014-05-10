/**
 * Created with JetBrains WebStorm.
 * User: chongchong
 * Date: 14-3-14
 * Time: 下午10:20
 * To change this template use File | Settings | File Templates.
 */

var WelcomScene=Class
    (
        {
            STATIC :
            {
			//    场景名
	            SceneName:"welcom",
			//  资源仓库
	            _Res:{}
			},
			myGameScene:null,

            /**
             * 初始化
             */
          initialize : function()
            {
                this._Res={};
                myGame.Main.curGameScene=this;
//  这里我喜欢用另起一个_init函数来开始我的初始化工作，个人习惯，你完全可以直接在本函数里初始化资源
                this._init();
            },

            _init:function()
            {
//获取舞台的 
                var gameW=ss2d.Stage2D.stageWidth,
                    gameH=ss2d.Stage2D.stageHeight;

                //创建快速渲染着色器,无视颜色变换提高效率
                //你可以使用各种不同效果的着色器，来体验各种炫酷的效果
				var shaderQuick=new ss2d.ShaderQuick();
                //创建背景
                var png=myGame.Main.assets.getResult("game.png"),//png 资源
                    xml=myGame.Main.assets.getResult("game.xml");//png 资源对应生成的xml文件
                var gameTexture=new ss2d.Texture(png,xml);//  从引擎中创建一个纹理
                this._Res["gameTexture"]=gameTexture;//场景切换后，需要释放的资源
                this.myGameScene=new ss2d.Scene(gameTexture,50); //  从引擎中创建50个纹理的对象
				//设置着色器，注意在这里设置了说色器，那么从myGameScene.applyQuad（）;申请的对象都是使用前边设置的那个着色器。如果你想使用不同的着色器那么你不能通过同一个ss2d.Scene  来获取
//添把批量处理的Scene  添加到场景中去
				//myGameScene.setShader(shaderQuick);
                this.addToScene("myGameScene",this.myGameScene);

                var bg=this.myGameScene.applyQuad();
//  显示bg图片
                this.myGameScene.showQuad(bg);
                bg.setTileName("background");//"background"对应的xml 中的name值
//设置bg 的长宽，如果默认大小以及符合要求这两个属性可以不用设置，我这里是用一个小图通过拉伸为大背景
				bg.setWidth(gameW);
                bg.setHeight(gameH);
//设置位置
                bg.setX(0);
                bg.setY(0);

// 标题图片
				var title=this.myGameScene.applyQuad();
                this.myGameScene.showQuad(title);
                title.setTileName("title");
                title.setCenter(true);
                title.setX(gameW/2);
                title.setY(120);
   ////文本  传说中的 hello world!!!!
			var text1=new ss2d.TextField(512,64);
			text1.setFontSize(50);// 字体大小
            text1.setColor(.2,.2,.2); //rgb  0~1 即n/255
            text1.setText("Hello world!");
			text1.setX(40);
            text1.setY(180);
            this.addToScene("text1",text1);
            	//comboLine.blend(ss2d.Blend.BLEND_MASK);;
////     	放缩			
			var text2=new ss2d.TextField(256,32);
			text2.setFontSize(18);// 字体大小
            text2.setColor(.2,.2,.2); //rgb  0~1 即n/255
            text2.setText("Scale and Alpha:");
			text2.setX(40);
            text2.setY(270);
            this.addToScene("text2",text2);
//                Scale  0.6  Alpha0.3
                var icon1=this.myGameScene.applyQuad();
				this.myGameScene.showQuad(icon1);
                icon1.setTileName("icon5");
                icon1.setCenter(true);
                icon1.setX(100);
                icon1.setY(320);
				icon1.setAlpha(0.3);
				icon1.setScaleX(0.6);
				icon1.setScaleY(0.6);
//				 Scale  1  Alpha 0.6
                var icon2=this.myGameScene.applyQuad();
				this.myGameScene.showQuad(icon2);
                icon2.setTileName("icon5");
                icon2.setCenter(true);
                icon2.setX(160);
                icon2.setY(320);
				icon2.setAlpha(0.6);
				icon2.setScaleX(1);
				icon2.setScaleY(1);
//              Scale  1.5  Alpha  1
                var icon3=this.myGameScene.applyQuad();
				this.myGameScene.showQuad(icon3);
                icon3.setTileName("icon5");
                icon3.setCenter(true);
                icon3.setX(220);
                icon3.setY(320);
				icon3.setAlpha(1);
				icon3.setScaleX(1.5);
				icon3.setScaleY(1.5);
//////////////btnstart   开始按钮
                var btn_X=gameW/ 2,btn_Y=gameH-130;
                var btnBottom=this.myGameScene.applyQuad();
                this.myGameScene.showQuad(btnBottom);
                btnBottom.setTileName("timebottom");
                //旋转中心设置
                btnBottom.setCenter(true);
                btnBottom.setX(btn_X);
                btnBottom.setY(btn_Y);

                var startbtn=this.myGameScene.applyQuad();
                this.myGameScene.showQuad(startbtn);
                startbtn.setTileName("startbtn");
                //旋转中心设置
                startbtn.setCenter(true);
                //旋转中心偏移量
                startbtn.setPivotX(2);
                startbtn.setPivotY(4);
                startbtn.setX(btn_X);
                startbtn.setY(btn_Y);
               //开启鼠标点击事件支持
                startbtn.setMouseEnabled(true);
                //startbtn 注册鼠标事件
               startbtn.addEventListener(ss2d.MouseEvent.MOUSE_DOWN, this.onMouseDownHandler.bind(this));
 			this._Res["startbtn"]=startbtn;//资源可以回收，也可以做为一个全局变量调用
                
                //注册帧事件
               ss2d.stage.addEventListener(ss2d.Event.ENTER_FRAME, this.onEnterFrameHandler.bind(this));

            },

            /**
             * 帧事件，每帧都会运行的函数，注意不要往函数里边放超量的计算

             * @param e
             */
            btnRotation:0,
            onEnterFrameHandler : function(e)
            {
            	// 旋转开始按钮
				 this._Res["startbtn"].setRotation(this.btnRotation);
				 this.btnRotation++;
				 if(this.btnRotation>360)this.btnRotation=0;
            },
            //鼠标点击事件
            onMouseDownHandler:function(e){
            	alert("场景要跳转啦~~");
            	goToNewScene(GameScene);
            },
            //方便场景切换时，清空资源仓库
            addToScene:function(resName,child){
                ss2d.stage.addChild(child);
//              添加到当前场景的资源仓库，方便释放资源
                this._Res[resName]=(child);
            },
            dispose:function(){
// 看到这里相信你知道，为什么我们重新写了一个添加对象到场景的方法，已经_Res得作用了吧？每次其实说白了就是切换场景的时候，要释放掉不使用的资源
			for(var res in this._Res){
				ss2d.stage.removeChild(this._Res[res]);
				if(this._Res[res].dispose) this._Res[res].dispose();
			}
        }
    });


WelcomScene.Create=function(){
     var  scene=new WelcomScene();
    return scene;
};