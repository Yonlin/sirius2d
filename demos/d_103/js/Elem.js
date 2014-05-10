/**
 * Created by chongchong on 14-4-15.
 */

var Elem=Class(
    {
        quad:null,
        extraQuad:null,
        elemtype:1,
        scale:0,
        oldRow:0,
        oldCol:0,
        curRow:0,
        curCol:0,
        eStatus:0,
        extraAttr:0,
        _Event:null,
        /**
         * 初始化
         */
        initialize:function(quad){
        	this._Event={};
            this.quad = quad;
            //设置居中对其
            this.quad.setCenter(true);
            this.scale=0.6;
            this.quad.setScaleX(this.scale);
            this.quad.setScaleY(this.scale);
            this.quad.setMouseEnabled(true);
            this.quad.GPU=true;
            
            this.eStatus=eElemStatus.Normal;
        },
        updataSkin:function(elemtype){
            this.elemtype=elemtype||1;          
             if(this.elemtype<7){
             	this.quad.gotoAndStop(this.elemtype);
             }
            switch(this.extraAttr){
                case 0:
                 	//this.quad.gotoAndStop(this.elemtype);
                    break;
                case 1:
 
                    this.setExtraQuad("time");
                    break;
                case 2:
    
                     this.setExtraQuad("bomb");
                    break;
                case 3:
 
                     this.setExtraQuad("fan");
                    break;
                case 4:
                        this.quad.setTileName("crossBomb");
                    break;
                case 5:
                	this.quad.loop(true);
                	this.quad.setAnimationSpeed(15);
                	this.quad.play();
                    break;
            }
        },
        initExtraQuad:function(extraQuad){
        	this.extraQuad=extraQuad;
        	this.extraQuad.setCenter(true);
            this.extraQuad.GPU=true;
            this.extraQuad.setRotation(-90);
            this.extraQuad.setVisible(false);
        },
        setExtraQuad:function(tileName){
           	this.extraQuad.setTileName(tileName);
            this.extraQuad.setScaleX(1);
            this.extraQuad.setScaleY(1);
           	this.extraQuad.setVisible(true);
         var eW=this.extraQuad.getWidth(),
             eH=this.extraQuad.getHeight();
             this.extraQuad.setScaleX(30/eH);
             this.extraQuad.setScaleY(30/eH);
           this.setPosition(this.quad.GPUX,this.quad.GPUY);
        },
        setPosition:function(x,y){
            this.quad.GPUX=x;
            this.quad.GPUY=y;
            if(this.extraQuad){
                this.extraQuad.GPUX=x+15;
                this.extraQuad.GPUY=y+15;
            }
        },
        setPostionByRowCol:function(_row,_col)
        {
            var pp=getElePositionXY(_row,_col);
            this.updataSub(_row,_col);
            this.setPosition(pp.x,pp.y);
        },
        updataSub:function(row,col)
        {
            this.oldRow=row;
            this.oldCol=col;
            this.curRow=row;
            this.curCol=col;
        },
        registEvent:function(EvenType,fun){
            this._Event[EvenType]=fun;
        },
        moveTo_Animation:function(time){
            if(this.curRow!=this.oldRow||this.curCol!=this.oldCol)
            {
                var targetPos=getElePositionXY(this.curRow,this.curCol);
				var vars ={from:{GPUX:this.quad.GPUX,GPUY:this.quad.GPUY},to:{GPUX:targetPos.x,GPUY:targetPos.y}}
                var Queue=[
                    Action.CreateTween(this.quad,time/2,vars),
                    Action.CallFunCreate(this.onMoveToAnimation_Finish)
                ];
                RunAction.Create(this,Queue);
            }
        },
        onMoveToAnimation_Finish:function(){
            this.setPostionByRowCol(this.curRow,this.curCol);
        },
        born:function(){
            this.eStatus=eElemStatus.Normal;
            this.quad.setMouseEnabled(true);
            this.updataSkin(this.elemtype);
            this.quad.setVisible(true);
            this.scale=0.6;
            this.quad.setScaleX(this.scale);
            this.quad.setScaleY(this.scale);
        },
        explode:function(){
            //this.eStatus=eElemStatus.Explode;
            this._Event["Explode"].apply(this);
        },
        turnToAddTime:function(){
            this.extraAttr=eElemExtraAttr.Time;
            this.updataSkin(this.elemtype);
        },
        turnToWindmill:function(){
            this.extraAttr=eElemExtraAttr.Windmill;
            this.updataSkin(this.elemtype);
        },
        turnToBomb:function(){
            this.eStatus=eElemStatus.Normal;
            this.quad.setVisible(true);
            this.extraAttr=eElemExtraAttr.Bomb;
            this.updataSkin(this.elemtype);
        },
        turnToCross:function(){
            this.eStatus=eElemStatus.Normal;
            this.quad.setVisible(true);
            this.elemtype=ElemType.Cross;
            this.extraAttr=eElemExtraAttr.Cross;
            this.updataSkin(this.elemtype);
        },
        turnToRandom:function(){
            this.eStatus=eElemStatus.Normal;
            this.quad.setVisible(true);
            this.elemtype=ElemType.Random;
            this.extraAttr=eElemExtraAttr.Random;
            this.updataSkin(this.elemtype);
        },
        hide:function(){
        	this.extraAttr=eElemExtraAttr.Normal
            this.quad.stop();
            this.quad.setVisible(false);
            this.extraQuad.setVisible(false);
            this.eStatus=eElemStatus.Destroy;
            this.quad.setMouseEnabled(false);
            ExplodeEffect.create(this.quad.GPUX,this.quad.GPUY);
        },
        dispose:function(){
            var scene=this.quad.getScene()
			this.quad.setMouseEnabled(false);
			this.quad.removeAllEventListeners();
            scene.hideQuad(this.quad);
            scene.hideQuad(this.extraQuad);
            this.quad.dispose();
            this.extraQuad.dispose();
            this.quad=null;
            this.extraQuad=null;
	     	this.elemtype=null;
	        this.scale=null;
	        this.oldRow=null;
	        this.oldCol=null;
	        this.curRow=null;
	        this.curCol=null;
	        this.eStatus=null;
	        this.extraAttr=null;
	        this._Event=null;
        }

    })
