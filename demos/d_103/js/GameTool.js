/**
 * Created by chongchong on 14-4-15.
 */

GameTool=Class(
{
	GameScene:null,
	E_Matrix:null,
	row:0,
	col:0,
	 initialize : function(r,c)
    {
        this.GameScene=myGame.Main.curGameScene;
        this.E_Matrix=Elem_Matrix;
        this.row=r;
        this.col=c;
    },
	Cross:function(){
        this.GameScene.onGamePropsTime();
			var elem=this.E_Matrix[this.row][this.col]
            elem.eStatus=eElemStatus.Explode;
        var Queue=[
            Action.CallFunCreate(this.GameScene.crossBombGo,[this.row,this.col]),
            Action.CallFunCreate(function(){
            for(var i=0;i<Elem_Matrix_ROWs;i++){
            	if(this.E_Matrix[this.row][i].extraAttr==0|| this.E_Matrix[this.row][i].extraAttr==2){
                	this.E_Matrix[i][this.col].explode();
            	}
            }
            for(var i=0;i<Elem_Matrix_COLs;i++){
            	if(this.E_Matrix[this.row][i].extraAttr==0|| this.E_Matrix[this.row][i].extraAttr==2){
                		this.E_Matrix[this.row][i].explode();
            	}
            }
        }).bind(this),
            Action.DelayCreate(0.4)
        ]
        Queue.push( Action.CallFunCreate(this.GameScene.fallDown).onActionEnd(this.GameScene.onGamePropsTimeEnd));
        RunAction.Create(this.GameScene,Queue);
	},
	Windmill:function(){
			this.GameScene.onGamePropsTime();
			var elem=this.E_Matrix[this.row][this.col]
           // elem.extraAttr=0;
            elem.eStatus=eElemStatus.Explode;
            var Queue=[Action.CallFunCreate(this.GameScene.windmillGo)],n=2;
          	if(this.GameScene.scoreTimes==8){
          		n=3;
          	}
          	else if(this.GameScene.scoreTimes>9){
          		n=4;
          	}
              for(var j=0;j<Elem_Matrix_COLs;j++){
                Queue.push(
               		 	 Action.CallFunCreate( function(c){
               		 	 	 for(var i=Elem_Matrix_ROWs-1;i>=Elem_Matrix_ROWs-n;i--){
               		 	 	 	if(this.E_Matrix[i][c].extraAttr==0|| this.E_Matrix[i][c].extraAttr==2){
               		 	 	 		this.E_Matrix[i][c].explode(); 
               		 	 	 	}
               		 	 	 }
	               		 },[j]).bind(this),//bind this
						 Action.DelayCreate(2/60)
               		 );
            }
        Queue.push( Action.CallFunCreate(this.GameScene.fallDown).onActionEnd(this.GameScene.onGamePropsTimeEnd));
        RunAction.Create(this.GameScene,Queue);
	},
	Tip:function(){
		
	},
	Time:function(){
		
	},
	Random:function(){

		var elem=this.E_Matrix[this.row][this.col]
           // elem.extraAttr=0;
            var etype=Math.round(Math.random()*5+1);
            elem.quad.gotoAndStop(etype);
			
           var Queue=[
           Action.CallFunCreate(this.GameScene.setSelectImg,[this.row,this.col]),
           Action.DelayCreate(30/60),
           Action.CallFunCreate(function(){
	           	elem.eStatus=eElemStatus.Explode;
               myGame.Main.curGameScene.onGamePropsTime();
	           for(var i=0;i<Elem_Matrix_ROWs;i++){
	               for(var j=0;j<Elem_Matrix_COLs;j++){
	               	if( Elem_Matrix[i][j].elemtype==etype && (Elem_Matrix[i][j].extraAttr==0|| Elem_Matrix[i][j].extraAttr==2))
	               	{
	               		 	Elem_Matrix[i][j].explode();
	               	}
	           	 }
	           }
           }),
           Action.DelayCreate(2/60).onActionEnd(function(){myGame.Main.curGameScene.$['selectImg'].setVisible(false);})
           ];
          Queue.push( Action.CallFunCreate(this.GameScene.fallDown).onActionEnd(this.GameScene.onGamePropsTimeEnd));
        //myGame.Main.curGameScene元素执行动作
        RunAction.Create(this.GameScene,Queue);
	},
	Bomb:function(){
        this.GameScene.isOnEliminate=true;
     	var elem=this.E_Matrix[this.row][this.col]
           // elem.extraAttr=0;
            elem.eStatus=eElemStatus.Explode;
           for(var addRow=-1;addRow<=1;addRow++) {
               for(var addCol=-1;addCol<=1;addCol++)  {
                   if((elem.curRow+addRow>=0 && elem.curRow+addRow<Elem_Matrix_ROWs )&&(elem.curCol+addCol>=0 && elem.curCol+addCol<Elem_Matrix_COLs)){
                      if(addRow==0 &&addCol==0 &&(this.E_Matrix[elem.curRow+addRow][elem.curCol+addCol].extraAttr==0|| this.E_Matrix[elem.curRow+addRow][elem.curCol+addCol].extraAttr==2))continue;
                       this.E_Matrix[elem.curRow+addRow][elem.curCol+addCol].explode();//eStatus=eElemStatus.Explode;
                   }
               }
           }
	},
	TBomb:function(){
			this.GameScene.onGamePropsTime();
                var Queue=[Action.CallFunCreate(this.GameScene.TBombGo)];
          // 向下
              for(var j=0;j<Elem_Matrix_ROWs;j++){
                Queue.push(
               		 	 Action.CallFunCreate( function(r){
               		 	 	if(this.E_Matrix[r][3].extraAttr==0|| this.E_Matrix[r][3].extraAttr==2){
               		 	 		this.E_Matrix[r][3].explode(); 
               		 	 	}
	               		 },[j]).bind(this),//bind this
               		 	Action.DelayCreate(1/60)
               		 );
           	 }
           // 向两边
              for(var i=1;i<4;i++){
              	Queue.push(
               		 	 Action.CallFunCreate( function(c){
               		 	 if(this.E_Matrix[6][3-c].extraAttr==0|| this.E_Matrix[6][3-c].extraAttr==2){
	               		 	this.E_Matrix[6][3-c].explode(); 
	               		 }
               		 	 if(this.E_Matrix[6][3+c].extraAttr==0|| this.E_Matrix[6][3+c].extraAttr==2){
	               		 	this.E_Matrix[6][3+c].explode(); 
               		 	 }
	               		 },[i]).bind(this),//bind this
               		 	Action.DelayCreate(1/60)
               		 );
               }
              
        Queue.push( Action.CallFunCreate(this.GameScene.fallDown).onActionEnd(this.GameScene.onGamePropsTimeEnd));
        RunAction.Create(this.GameScene,Queue);
	}
	
	
}	
);

GameTool.CreateCross=function(r,c){
	var cro=new GameTool(r,c);
	cro.Cross();
}
GameTool.CreateBomb=function(r,c){
	var bom=new GameTool(r,c);
	bom.Bomb();
}

GameTool.CreateRandom=function(r,c){
	var ran=new GameTool(r,c);
	ran.Random();
}
GameTool.CreateWindmill=function(r,c){
	var win=new GameTool(r,c);
	win.Windmill();
}
GameTool.CreateTBomb=function(r,c){
	var bom=new GameTool(r,c);
	bom.TBomb();
}
