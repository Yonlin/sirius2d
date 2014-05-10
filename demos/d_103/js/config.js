
//score

//music
var eSwapDirection = {Up:0,Down:1,Left:2,Right:3};
var ElemType={

    icon1:1,
    icon2:2,
    icon3:3,
    icon4:4,
    icon5:5,
    icon6:6,
   // icon7:7,
    Cross:7,//十字消除
    Random:8//变脸
}
var eElemExtraAttr = {
	Normal:0,//正常
	Time:1,//增加时间
	Bomb:2,//九宫格炸弹
	Windmill:3,//风车消除
    Cross:4,//十字消除
    Random:5//变脸
};

var eElemStatus = {
	Normal:0,//正常
	Move:1,//移动
	Destroy:2,//死亡
	Explode:3//爆炸
};
//Counter 


//Timer
var GameProps={
quickTips:true,
Supercombos:false,
timeOffers:false,
tbombTool:false
}
var GAMESTATUS={
	welcom:0,
	selectProps:1,
	playGame:2,
	gameOver:3
}
var GAME={
	STATUS:GAMESTATUS.welcom,
	MYSCORE:0
}
var COMBOOCLEARTIME=1.3;
var TIPTOOlTIME=4.5;
// 爆炸效果
var STARPOOL=[];

