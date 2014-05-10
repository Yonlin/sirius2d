/**
 * Created with JetBrains WebStorm.
 * User: chongchong
 * Date: 14-3-16
 * Time: 下午2:46
 * To change this template use File | Settings | File Templates.
 */



///////////////////
//  Action
///////////////////
var Action=Class(

    {   time:0,
        delay:0,
        fun:null,
        funParameters:null,
        repeat:0,// <=-2 无限循环
        initialize:function(time,fun,funParameters,repeat){
            this.time=time;
            this.fun=fun;
            this.funParameters=funParameters||null;
            this. repeat=repeat||0;
        },
        setDelay:function(value){
            this.delay=value;
            return this;
        },
        setRepeat:function(value){
            this.repeat=value;
            return this;
        }
        //setUserData
    }
);
Action.CallFunCreate =function(fun,funParameters){
    var cllfn=new Action(0,fun,funParameters,0);
    return cllfn;
};
Action.DelayCreate =function(delay){
    var Delay=new Action(delay,null,null,0);
    return Delay;
};
Action.Create=function(time,fun,funParameters,repeat){
    var action=new Action(time,fun,funParameters,repeat);
    return action;
};
var RunActionID=0;
//ActionQueue
var RunAction=Class(
    {
        actionList:null,
        targest:null,
        isRunAC:false,
        stopAction:false,
        curFrame:0,
        totalFrames:0,
        _indelay:false,
        _listener:{},
        initialize:function(targest,actionlist){
            this._listener[this._onFrameUpdata]=this._onFrameUpdata.bind(this);
            this.curFrame=0;
            this.totalFrames=0;
            this.targest=targest;
            this.isRunAC=false;
            this.actionList=[];
            this.actionList=actionlist||[Action.Create(0,function(){},null)];
        },
        removeAllAction:function(){
            for(var i=0;i<this.actionList.length;i++)
            {
                if(this.actionList[i]){
                    this.actionList[i].fun=null;
                    this.actionList[i]=null;
                }
            }
            this.actionList=[];
            ss2d.stage.removeEventListener(ss2d.Event.ENTER_FRAME, this._listener[this._onFrameUpdata],false);
            this.isRunAC=false;
        },
        RunAC:function(){
            ss2d.stage.removeEventListener(ss2d.Event.ENTER_FRAME, this._listener[this._onFrameUpdata],false);
            ss2d.stage.addEventListener(ss2d.Event.ENTER_FRAME, this._listener[this._onFrameUpdata],false);
            this.isRunAC=true;
        },
        _onFrameUpdata:function()
        {
             if(!this.isRunAC)return;
            if(this.actionList.length<=0 || this.stopAction)
            {
                return this.removeAllAction();
            }
            var ac=this.actionList[0];
            if(ac)
            {
                if(this.totalFrames-this.curFrame< ac.time*60 ||ac.time==0)
                {

                    //调用函数
//                    if(this._indelay || this.totalFrames-this.curFrame< ac.delay){
//                        this._indelay=false;
//                    }else{
                        if(ac.fun){
                            ac.fun.apply(this.targest,ac.funParameters);
                           if(ac.time==0)ac.time=-1;
                        }
//                        this._indelay=true;
//                    }

                }
                else{
                    this.curFrame=this.totalFrames;
                    if(ac.repeat>-1){
                        ac.repeat--;
                    }
                    if(ac.repeat==-1 ){
                        this.actionList.shift();
                    }else{
                        var ac2= this.actionList.shift();
                        this.actionList.push(ac2);
                    }
                }

            }//
             this.totalFrames++;
        }
    }
);
RunAction.Create=function(targest,actionlist){
    var  runAc=new RunAction(targest,actionlist);
    runAc.RunAC();
    return runAc;
};
///////////////
// 转盘倒计时
//////////////

var TimeLine=Class({
    scene:null,
    timer:null,
    curTime:60,
    skin:null,
    timelineText:null,
    callback:function(){},
    initialize:function(scene){
        this.scene=scene;
        this.timer = new ss2d.Timer(1000);
        this.timer.addEventListener(ss2d.TimerEvent.TIMER,this.timeRun.bind(this));
        
        this.skin= new ss2d.Group();
        
        var Bottom=this.scene.applyQuad();
        this.scene.showQuad(Bottom);
        Bottom.setTileName("timebottom");
        Bottom.setCenter(true);
        
        var skinW=Bottom.getWidth(),
        skinH=Bottom.getHeight();

        this.tick=this.scene.applyQuad();
        this.scene.showQuad(this.tick);
        this.tick.setTileName("timetick");
        this.tick.setCenter(true);
        this.tick.setPivotX(2);
        this.tick.setPivotY(4);
        this.tick.GPU=true;
       
       //  设置文本位置
        this.timelineText=new ss2d.TextField(128,128);
        this.timelineText.setFontSize(80);
        this.timelineText.setColor(.2,.2,.1);
        this.timelineText.setText("60");
        //  应该是 this.skin 的x y
        this.timelineText.setX(-40);
        this.timelineText.setY(-40);
        ss2d.stage.addChild( this.timelineText);
        this.skin.addChild(Bottom);
        this.skin.addChild(this.tick);
        this.skin.addChild(this.timelineText);
        
    },
    setPosition:function(x,y){
        this.skin.setX(x);
        this.skin.setY(y);
    },
    timeRun:function(){
        if( this.curTime>0){
             this.curTime--;
             this.timelineText.setText(this.curTime>9?(""+this.curTime):("0"+this.curTime));
        }else if(this.curTime==0){
            console.log("time  used up!");
            this.timer.stop();
        }
    },
    start:function(){
         this.timer.start();
          var Queue=[
                Action.CallFunCreate(function(){
                    this.setRotation(0);
                   }),
                Action.Create(60,function(){
                        if(this.getRotation()<360){
                              this.setRotation(this.getRotation()+0.1 );
                        } 
                })
            ]
            //startbtn元素执行动作
            RunAction.Create(this.tick,Queue);
    }
    
})
var PER_RAD=Math.PI / 180;
var STARPOOL=[];
