/**
 * Created with JetBrains WebStorm.
 * User: chongchong
 * Date: 14-3-16
 * Time: 下午2:46
 * To change this template use File | Settings | File Templates.
 */


if ( Date.now === undefined ) {
	Date.now = function () {
		return new Date().valueOf();
	};
}
///////////////
// 消除元素栅格化位置与屏幕坐标转换
//////////////

var  GAME_AREA_OFFSET_X=10+25;
var  GAME_AREA_OFFSET_Y=250+35;
var  CELL_SIZE=48;
var ELEMNAME="icon"
var getElePositionXY=function(row,col){
    var _x=col*CELL_SIZE+GAME_AREA_OFFSET_X;
    var _y=row*CELL_SIZE+GAME_AREA_OFFSET_Y;
    return {x:_x,y:_y};
};
var getElePositionRC=function(loc_x,loc_y){
    // 座標在圖片的中央  Elem_SIZE/2
    var _row = Math.floor((loc_y - GAME_AREA_OFFSET_Y) /CELL_SIZE);
    var _col = Math.floor((loc_x - GAME_AREA_OFFSET_X) / CELL_SIZE);
    return {row:_row,col:_col};
};


  //////////
  // 消除数组中重复的元素
  /////
 var  ArrayUnique=function(arr){  
    var Array = arr || [];  
    var Arr = [],add=true;  
    for (var i=0; i<Array.length; i++) {  
       for(var j=0;j<Arr.length;j++){
       	if(Arr[j]===Array[i]){
       		add=false;
       		break;
       	}
       }
       if(add){
       	Arr.push(Array[i]);
       }
    };  
    return Arr;  
}

/////////
//  集合  A-B
/////
var ArrayACutArrayB=function(arrA,arrB){
    var tArr=[],flag;
    for(var i=0;i<arrA.length;i++){
        flag=true;
        for(var j=0;j<arrB.length;j++){
            if(arrA[i]===arrB[j]){
                flag=false;
                break;
            }
        }
        if(flag)tArr.push(arrA[i]);
    }
    return tArr;
}

