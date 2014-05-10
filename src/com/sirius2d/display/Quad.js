/**
 * Quad.js
 *
 * HTML5游戏开发者社区 QQ群:326492427 127759656 Email:siriushtml5@gmail.com
 * Copyright (c) 2014 Sirius2D www.Sirius2D.com www.html5gamedev.org
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

(function()
{

    ss2d.QuadFrame = Class
    (
        {
            /**
             * 帧名称
             * frame name
             */
            name : "",
            /**
             * 帧X坐标
             * frame X
             */
            x : 0,
            /**
             * 帧Y坐标
             * frame Y
             */
            y : 0,
            /**
             * 帧宽度
             * frame width
             */
            width : 0,
            /**
             * 帧高度
             * frame height
             */
            height : 0,
            /**
             * 帧X偏移坐标
             * frame offset X
             */
            frameX : 0,
            /**
             * 帧Y偏移坐标
             * frame offset Y
             */
            frameY : 0,
            /**
             * 帧最大宽度
             * frame maximum width
             */
            frameWidth : 0,
            /**
             * 帧最大高度
             * frame maximum height
             */
            frameHeight : 0
        }
    );

    /**
     *
     * @type {*}
     */
    ss2d.QuadData = Class
    (
        {
            /**
             * quad名称
             * quad name
             */
            name:null,
            /**
             * quad帧数组
             * quad frame list
             */
            quadFrameLst:null,

            ////////////////////////////////////////////////////////////////////////////
            //  constructor
            ////////////////////////////////////////////////////////////////////////////

            initialize : function()
            {
                quadFrameLst = [];
            }
        }
    );

    /**
     *
     * @type {*}
     */
    ss2d.QuadResource = Class
    (
        {
            quadDataList:null,

            ////////////////////////////////////////////////////////////////////////////
            //  constructor
            ////////////////////////////////////////////////////////////////////////////

            initialize : function()
            {
                quadDataList = [];
            }
        }
    );


    /**
     * Quad 引擎中最强大的显示对象类，它不能独立存在，只能基于Scene对象池的子对象存在，Scene代表一次渲染，而它可以在一次渲染中完成多次渲染的效果。
     * <br /> 演示地址:http://sirius2d.com/demos/d_12/
     * @class
     */
    ss2d.Quad = Class
    (
        /** @lends ss2d.Quad.prototype */
        {
            Extends : ss2d.DisplayObject,
            /**
             * 设置启用动画矩阵更新 (当动画宽高一样时，可禁用来提高效率)
             * <br />set a boolean value that indicates whether the animation matrix updates
             * disable this function when the width and height of a animation are the same to optimize efficiency
             * @param boolean value
             */
            isAnimationMatrix:true,

            /**
             * 是否启用顶点着色功能,如果对象没有颜色改变需求关闭此开关可提高性能
             * @param boolean value
             */
            isVertexColour:true,



            m_Texture:null,
            m_isJoint : false,
            m_frameX : 0,
            m_frameY : 0,
            m_frameWidth : 0,
            m_frameHeight : 0,
            m_tileOffsetX:0,
            m_tileOffsetY:0,
            m_tileOffsetWidth:0,
            m_tileOffsetHeight:0,
            m_framePivotX : 0,
            m_framePivotY : 0,
            m_isActivate : false,
            m_loop : false,
            m_quadMatrixUtil : null,

            m_leftUpR:1,
            m_leftUpG:1,
            m_leftUpB:1,
            m_leftUpA:1,

            m_leftDownR:1,
            m_leftDownG:1,
            m_leftDownB:1,
            m_leftDownA:1,

            m_rightUpR:1,
            m_rightUpG:1,
            m_rightUpB:1,
            m_rightUpA:1,

            m_rightDownR:1,
            m_rightDownG:1,
            m_rightDownB:1,
            m_rightDownA:1,

            scene:null,

            m_id : -1,
            id8_1:0,
            id8_2:0,
            id8_3:0,
            id8_4:0,
            id8_5:0,
            id8_6:0,
            id8_7:0,
            id8_8:0,

            id16_1:0,
            id16_2:0,
            id16_3:0,
            id16_4:0,
            id16_5:0,
            id16_6:0,
            id16_7:0,
            id16_8:0,
            id16_9:0,
            id16_10:0,
            id16_11:0,
            id16_12:0,
            id16_13:0,
            id16_14:0,
            id16_15:0,
            id16_16:0,

            m_textureID : 0,
            texture : null,
            textureUV : null,
            verticesGPUList:null,
            vertices : null,
            verticesColor : null,
            m_isPlaying : false,
            m_transform : null,
            m_lastTime : 0,
            m_targetTime : 0,
            m_delay : 0,
            m_tileId : 0,
            _tileName : null,
            m_currentFrame : 0,
            m_totalFrame : 1,

            frameList :null,
            jointList : null,
            indexList:null,
            rightDownPoint : null,
            rightUpPoint : null,
            leftDownPoint : null,
            leftUpPoint : null,
            m_framedelay:-1,
            m_isRollbackAnimation:false,
            frameXDivWidth:0,
            frameYDivHeight:0,
            frameWidthDivWidth:0,
            frameHeightDivHeight:0,
            //id 索引ID,texture 纹理对象,vertices 顶点位置,textureUV 纹理UV,jointList 拼接信息,verticesGPUList GPU加速数组
            initialize : function(id, texture, vertices, textureUV, verticesColor, jointList, indexList,verticesGPUList)
            {
                ss2d.Quad.Super.call(this);

                this._absPoint=new ss2d.Point();


                this.jointList = [];
                this.frameList=[];
                this.indexList = [];
                this.m_isJoint = false;
                this.m_isActivate = false;
                if(texture instanceof Array) this.m_isJoint = true;
                this.setID(id);

                this.texture = texture;
                this.vertices = vertices;
                this.verticesGPUList=verticesGPUList;
                this.textureUV = textureUV;
                this.verticesColor = verticesColor;
                this.jointList = jointList;
                this.indexList = indexList;

                this.rightDownPoint = new ss2d.Point(0, 0);
                this.rightUpPoint = new ss2d.Point(0, 0);
                this.leftDownPoint = new ss2d.Point(0, 0);
                this.leftUpPoint = new ss2d.Point(0, 0);
                this.m_quadMatrixUtil = new ss2d.QuadMatrixUtil();
                this.setTextureID(0);


                //设置切片的宽度和高度,设置默认值为纹理的宽度和高度
                //set the clip width and height (default: width and height of the texture)


                if(this.m_isJoint)
                {
                    this.m_frameWidth = texture[this.m_textureID].width+this.m_tileOffsetWidth;
                    this.m_frameHeight = texture[this.m_textureID].height+this.m_tileOffsetHeight;
                }
                else
                {
                    this.m_frameWidth = texture.width;
                    this.m_frameHeight = texture.height;
                }

                this.initIndexs();
                this.initVerticeData();
                this.setTileId(0);
                this.gotoAndPlay(1);
            },


            /**
             * 设置顶点颜色 (0-左上，1-左下，2-右上，3-右下)
             * <br />set RGBA of vertexes (0-top left, 1-bottom left, 2-top right, 3-bottom right)
             * @param index 顶点的索引ID
             * @param r 红色通道
             * @param g 绿色通道
             * @param b 蓝色通道
             * @param a 透明通道
             */
            setVertexColour:function(index,r,g,b,a)
            {
                switch(index)
                {
                    case 0:
                        this.m_leftUpR=r;
                        this.m_leftUpG=g;
                        this.m_leftUpB=b;
                        this.m_leftUpA=a;
                        break;
                    case 1:
                        this.m_leftDownR=r;
                        this.m_leftDownG=g;
                        this.m_leftDownB=b;
                        this.m_leftDownA=a;
                        break;
                    case 2:
                        this.m_rightUpR=r;
                        this.m_rightUpG=g;
                        this.m_rightUpB=b;
                        this.m_rightUpA=a;
                        break;
                    case 3:
                        this.m_rightDownR=r;
                        this.m_rightDownG=g;
                        this.m_rightDownB=b;
                        this.m_rightDownA=a;
                        break;
                }
                this.isRedraw=true
            },


            /**
             * 获得对象宽度
             * <br />get the width of the object
             * @returns {number}
             */
            getWidth : function()
            {
                var realFrameWidth = this.m_frameWidth;
                return Math.abs(realFrameWidth * this.m_scaleX);
            },

            /**
             * 设置对象宽度
             * <br />set width of the object
             * @param value
             */
            setWidth : function(value)
            {
                var realFrameWidth = this.m_frameWidth;
                this.m_scaleX = value / realFrameWidth;
                this.isRedraw = true;
            },

            /**
             * 获取对象高度
             * <br />get height of the object
             * @returns {number}
             */
            getHeight : function()
            {
                var realFrameHeight = this.m_frameHeight;
                return Math.abs(realFrameHeight * this.m_scaleY);
            },

            /**
             * 设置对象高度
             * <br />set height of the object
             * @param value
             */
            setHeight : function(value)
            {
                var realFrameHeight = this.m_frameHeight;
                this.m_scaleY = value / realFrameHeight;
                this.isRedraw = true;
            },

            /**
             * 获取对象居中状态
             * <br />get a boolean value that indicates whether the object is aligned center
             * @returns {ss2d.DisplayObject._center|*}
             */
            getCenter : function() {  return this.m_center;},

            /**
             * 设置对象居中状态
             * <br />set a boolean value that indicates whether the object is aligned center
             * @param boolean value
             */
            setCenter : function(value){ this.m_center = value;this.updateFrame();},

            initIndexs:function()
            {
                var mul5=this.m_id * 5;
                var mul4=this.m_id * 4;
                this.indexList[this.m_id + mul5 + 0] = 0 + mul4;
                this.indexList[this.m_id + mul5 + 1] = 1 + mul4;
                this.indexList[this.m_id + mul5 + 2] = 2 + mul4;
                this.indexList[this.m_id + mul5 + 3] = 0 + mul4;
                this.indexList[this.m_id+  mul5 + 4] = 2 + mul4;
                this.indexList[this.m_id + mul5 + 5] = 3 + mul4;
            },

            initVerticeData : function()
            {
                var mul8=this.m_id * 8;
                for(var i=0;i<8;i++)
                {
                    this.verticesGPUList[mul8+i] = 0;
                    this.vertices[mul8+i] = 0;
                    this.textureUV[mul8+i] = 0;
                }

                var mul16=this.m_id * 16;
                for(var j=0;j<16;j++)
                {
                    this.verticesColor[mul16+j] = 0;
                }
            },

            /**
             * 设置纹理ID
             * <br />set texture ID
             * @param value
             */
            setTextureID : function(value)
            {
                this.m_textureID = value;
                this.m_Texture = this.m_isJoint ? this.texture[this.m_textureID] : this.texture;
                //设置4个顶点的初始化坐标
                //set pos of the 4 vertexes

                this.leftUpPoint.x = -1.0 * this.m_Texture.width / ss2d.Stage2D.stageHeight;
                this.leftUpPoint.y = -1.0 * this.m_Texture.height / ss2d.Stage2D.stageHeight;

                this.rightUpPoint.x = 1.0 * this.m_Texture.width / ss2d.Stage2D.stageHeight;
                this.rightUpPoint.y = -1.0 * this.m_Texture.height / ss2d.Stage2D.stageHeight;

                this.leftDownPoint.x = -1.0 * this.m_Texture.width / ss2d.Stage2D.stageHeight;
                this.leftDownPoint.y = 1.0 * this.m_Texture.height / ss2d.Stage2D.stageHeight;

                this.rightDownPoint.x = 1.0 * this.m_Texture.width / ss2d.Stage2D.stageHeight;
                this.rightDownPoint.y = 1.0 * this.m_Texture.height / ss2d.Stage2D.stageHeight;

                this.m_quadMatrixUtil.clear();

                //添加到面板里
                //add them into the panel
                this.m_quadMatrixUtil.addItem(this.leftUpPoint);
                this.m_quadMatrixUtil.addItem(this.leftDownPoint);
                this.m_quadMatrixUtil.addItem(this.rightUpPoint);
                this.m_quadMatrixUtil.addItem(this.rightDownPoint);

                this.setTileId(0);
            },

            /**
             * 获取纹理ID
             * <br />get texture ID
             * @return {Number}
             */
            getTextureID : function()
            {
                return this.m_textureID;
            },

            /**
             * 设置纹理片段名称
             * <br />set tile name
             * @param name {String}
             */
            setTileName : function(name)
            {
                this._tileName = name;
                if(this.m_Texture.quadResource != null)
                {
                    this.setTileId(this.queryName(this._tileName));
                }
            },

            /**
             * 设置纹理片段ID
             * <br />set tile ID
             * @param id {number}
             */
            setTileId : function(id)
            {

                if(this.m_Texture.quadResource!=null)
                {
                    this.m_tileId = id;
                    this.m_currentFrame = 0;
                    this.m_totalFrame = this.m_Texture.quadResource.quadDataList[this.m_tileId].quadFrameLst.length;
                    this.updateFrame(false);
                }
            },

            /**
             * 获取动画当前播放帧
             * <br />get the current frame of the animation
             * @returns {number}
             */
            getCurrentFrame:function()
            {
                return this.m_currentFrame;
            },

            /**
             * 获取动画片段总长度
             * <br />get the length of the animation
             * @returns {number}
             */
            getTotalFrame:function()
            {
                return this.m_totalFrame;
            },


            /**
             * 设置纹理片段X坐标偏移位置
             * <br />set tile offset X
             * @param value {number}
             */
            setTileXOffset : function(value)
            {
                this.m_tileOffsetX = value;
                this.isRedraw=true;
            },

            /**
             * 获取纹理片段X坐标偏移位置
             * <br />get tile offset X
             * @param value {number}
             */
            getTileXOffset : function(value)
            {
                return this.m_tileOffsetX;
            },

            /**
             * 设置纹理片段Y坐标偏移位置
             * <br />set tile offset Y
             * @param value {number}
             */
            setTileYOffset : function(value)
            {
                this.m_tileOffsetY = value;
                this.isRedraw=true;
            },

            /**
             * 获取纹理片段Y坐标偏移位置
             * <br />get tile offset Y
             * @param value {number}
             */
            getTileYOffset : function(value)
            {
                return this.m_tileOffsetY;
            },

            /**
             * 设置纹理片段宽度偏移位置
             * <br />set tile width offset
             * @param value {number}
             */
            setTileWidthOffset : function(value)
            {
                this.m_tileOffsetWidth = value;
                this.isRedraw=true;
            },

            /**
             * 获取纹理片段宽度偏移位置
             * <br />get tile width offset
             * @param value {number}
             */
            getTileWidthOffset : function(value)
            {
                return this.m_tileOffsetWidth;
            },

            /**
             * 设置纹理片段高度偏移位置
             * <br />set tile height offset
             * @param value {number}
             */
            setTileHeightOffset : function(value)
            {
                this.m_tileOffsetHeight = value;
                this.isRedraw=true;
            },

            /**
             * 获取纹理片段高度偏移位置
             * <br />get tile height offset
             * @param value {number}
             */
            getTileHeightOffset : function(value)
            {
                return this.m_tileOffsetHeight;
            },

            /**
             * 指示动画播放的帧率.
             * <br />set FPS of the animation
             * @param	frame 动画播放的帧率.
             */
            setAnimationSpeed : function(frame)
            {
                this.m_delay = 1000.0 / frame;
            },

            //启动
            launch : function()
            {
                this.m_isActivate = true;
                this.m_visible=true;
                this.x=0;
                this.y=0;
                this.GPUX=0;
                this.GPUY=0;
                //this._tileId=0;
                this.setTileId(0);
            },


            getIsActivate : function()
            {
                return this.m_isActivate;
            },


            /**
             * 设置顶点位置 (index: 0-左上，1-左下，2-右上，3-右下)
             * <br />set vertexes pos (index: 0-top left, 1-bottom left, 2-top right, 3-bottom right)
             * @param index
             * @param x
             * @param y
             */
            setIndexVertex:function(index,x,y)
            {
                this.isRedraw=true;
                this.m_quadMatrixUtil.getPoint(index).x=x* this.m_Texture.width/ ss2d.Stage2D.stageHeight;
                this.m_quadMatrixUtil.getPoint(index).y=y * this.m_Texture.height/ ss2d.Stage2D.stageHeight;
            },

            /**
             * 获取顶点位置 (index: 0-左上，1-左下，2-右上，3-右下)
             * <br />get vertexes pos (index: 0-top left, 1-bottom left, 2-top right, 3-bottom right)
             * @param index
             * @param x
             * @param y
             */
            getIndexVertex:function(index)
            {
               return new ss2d.Point(this.m_quadMatrixUtil.getPoint(index).x/this.m_Texture.width*ss2d.Stage2D.stageHeight,this.m_quadMatrixUtil.getPoint(index).y/this.m_Texture.width*ss2d.Stage2D.stageHeight);
            },


            /**
             * 获得顶点数据
             * <br />index to the right vertex
             * @param index
             */
            getVertex : function(index)
            {

                switch(index)
                {
                    case 0:
                        return this.leftUpPoint;

                    case 1:
                        return this.leftDownPoint;

                    case 2:
                        return this.rightUpPoint;

                    case 3:
                        return this.rightDownPoint;

                }
            },


            queryName : function(name)
            {
                var frameDataList;
                if(this.m_isJoint)
                    frameDataList = this.texture[this.m_textureID].quadResource.quadDataList;
                else
                    frameDataList = this.texture.quadResource.quadDataList;

                for(var i=0;i < frameDataList.length; i++)
                {
                    if(frameDataList[i].name == name)
                    {
                        return i;
                    }
                }
                return 0;
            },

            /**
             * 设置是否循环播放
             * <br />loop animation or not
             * @param boolean value
             */
            loop : function(value)
            {
                this.m_loop = value;
            },

            /**
             * 播放动画
             * <br />play animation
             */
            play : function()
            {
                this.m_isPlaying = true;
            },

            /**
             * 停止播放动画
             * <br />stop animation
             */
            stop : function()
            {
                this.m_isPlaying = false;
            },


            /**
             * 跳转到指定的帧并且播放动画
             * <br />skip to a frame and play the animation
             * @param value
             */
            gotoAndPlay : function(value)
            {
                this.m_currentFrame = value - 1;
                this.m_isPlaying = true;
            },

            /**
             * 跳转到指定的帧并停止动画
             * <br />skip to a frame and stop the animation
             * @param value
             */
            gotoAndStop : function(value)
            {
                this.m_isPlaying = false;
                this.m_currentFrame = value-1;
                this.updateFrame(false);
            },

            /**
             * 添加帧脚本
             * <br />add frame script
             */
            addFrameScript : function(value)
            {
                this.frameList.push(value);
            },

            /**
             * 删除帧脚本
             * <br />delete frame script
             */
            removeFrameScript : function(value)
            {
                var index = this.frameList.indexOf(value);
                this.frameList.splice(index,1);
            },

            /**
             * 删除所有帧函数
             * <br />delete all frame scripts
             */
            removeAllFrameScript : function()
            {
                for(var i = 0; i < this.frameList.length; i++)
                {
                    this.frameList.splice(i,1);
                    this.frameList[i] = null;
                }
                this.frameList = [];
            },

            /**
             * 设置是否倒播动画
             * <br />set a boolean value that indicates whether the animation is rolled back
             * @param boolean value
             */
            rollbackAnimation:function(value)
            {
                this.m_isRollbackAnimation=value;
            },


            /**
             * 设置帧延迟
             * <br />set frame delay
             * @param value
             */
            frameDelay:function(value)
            {
                this.m_framedelay=value;
            },

            //更新帧信息
            updateFrame : function(flag)
            {

                if(this.m_Texture.quadResource != null)
                {

                    if(flag)
                    {

                        if(this.m_framedelay>0)
                        {
                            this.m_framedelay--;
                        }else
                        {
                            if(this.m_isRollbackAnimation)
                            {
                                this.m_currentFrame--;
                                for(var i=0;i < this.frameList.length;i++)
                                {
                                    if(this.frameList[i].frame == this.m_currentFrame+1)
                                    {
                                        var f=this.frameList[i].callback;
                                        if (f.handleEvent) {f.handleEvent(this); }
                                        else { f(this); }
                                    }
                                }
                            }else
                            {
                                for(var i=0;i < this.frameList.length;i++)
                                {
                                    if(this.frameList[i].frame == this.m_currentFrame+1)
                                    {
                                        var f=this.frameList[i].callback;
                                        if (f.handleEvent) {f.handleEvent(this); }
                                        else { f(this); }
                                    }
                                }
                                this.m_currentFrame++;
                            }
                        }
                    }
                    if(this.m_currentFrame >= this.m_totalFrame)
                    {
                        if(this.m_loop)
                        {
                            this.m_currentFrame = 0;
                        }
                        else
                        {
                            this.m_currentFrame = this.m_totalFrame - 1;
                        }
                    }else if(this.m_currentFrame<=-1)
                    {
                        if(this.m_loop)
                        {
                            this.m_currentFrame = this.m_totalFrame-1;
                        }
                        else
                        {
                            this.m_currentFrame = 0;
                        }
                    }
                    this.updateFrameData();
                }else
                {
                    this.m_frameX = this.m_tileOffsetX;
                    this.m_frameY = this.m_tileOffsetY;
                    if(this.m_isJoint)
                    {
                        this.m_frameWidth = this.m_Texture[this.m_textureID].width+this.m_tileOffsetWidth;
                        this.m_frameHeight = this.m_Texture[this.m_textureID].height+this.m_tileOffsetHeight;
                    }
                    else
                    {
                        this.m_frameWidth = this.m_Texture.width+this.m_tileOffsetWidth;
                        this.m_frameHeight = this.m_Texture.height+this.m_tileOffsetHeight;
                    }

                    if(this.m_center)
                    {

                        this.m_framePivotX = 0;
                        this.m_framePivotY = 0;
                    }
                    else
                    {
                        this.m_framePivotY = this.m_frameHeight / 2;
                        this.m_framePivotX = this.m_frameWidth / 2;
                    }
                }
            },

            //刷新绝对中心点
            upAbsPoint:function()
            {
                var minX=Math.min.apply(Math,[this.leftUpPoint.x,this.rightUpPoint.x,this.leftDownPoint.x,this.rightDownPoint.x])
                var minY=Math.min.apply(Math,[this.leftUpPoint.y,this.rightUpPoint.y,this.leftDownPoint.y,this.rightDownPoint.y])

                var maxX=Math.max.apply(Math,[this.leftUpPoint.x,this.rightUpPoint.x,this.leftDownPoint.x,this.rightDownPoint.x])
                var maxY=Math.max.apply(Math,[this.leftUpPoint.y,this.rightUpPoint.y,this.leftDownPoint.y,this.rightDownPoint.y])

                var absX=(minX+((maxX-minX)/2.0))*ss2d.Stage2D.stageHeight/2;
                var absY=(minY+((maxY-minY)/2.0))*ss2d.Stage2D.stageHeight/2;

                this._absPoint.x=absX+this.GPUX;
                this._absPoint.y=absY+this.GPUY;

            },

            /**
             * 获得绝对中心点
             * <br />get the absolute center point
             */
            absCentre:function()
            {
               this.upAbsPoint();
               return this._absPoint;
            },

            /**
             * 设置融合矩阵
             * <br />set transform matrix
             * @param value
             */
            setTransform:function(value)
            {
                this.m_transform=value;
            },

            /**
             * 获取融合矩阵
             * <br />get transform matrix
             * @returns {*}
             */
            getTransform:function()
            {
                return this.m_transform;
            },


            updateFrameData : function()
            {

                if(this.m_Texture.quadResource != null)
                {
                    var frameData = this.m_Texture.quadResource.quadDataList[this.m_tileId].quadFrameLst[this.m_currentFrame];
                    if (!frameData) return;
                    this.m_frameX = Number(frameData.x) + this.m_tileOffsetX;
                    this.m_frameY = Number(frameData.y) + this.m_tileOffsetY;
                    this.m_frameWidth = Number(frameData.width) + this.m_tileOffsetWidth;
                    this.m_frameHeight = Number(frameData.height) + this.m_tileOffsetHeight;

                    //设置动画的X偏移量,因为我们的裁切其实是以中心点开始的,所以需要加上切片的宽度的一半
                    if(this.m_forceCenter)
                    {
                        this.m_framePivotX = - Number(frameData.frameX);
                        this.m_framePivotY = - Number(frameData.frameY);
                    }else
                    {
                        if(this.m_center)
                        {
                            this.m_framePivotX = this.m_frameWidth / 2 - Number(frameData.frameX)-Number(frameData.frameWidth)/2;
                            this.m_framePivotY = this.m_frameHeight / 2 - Number(frameData.frameY)-Number(frameData.frameHeight)/2
                        }
                        else
                        {
                            this.m_framePivotX = this.m_frameWidth / 2 - Number(frameData.frameX);
                            this.m_framePivotY = this.m_frameHeight / 2 - Number(frameData.frameY);
                        }
                    }

                }

                if(this.isAnimationMatrix)
                this.isRedraw = true;
            },



            /**
             * 销毁
             * <br /> dispose
             */
            dispose : function()
            {
                this.m_isPlaying = true;
                this.m_lastTime = 0.0;
                this.m_targetTime = 0.0;
                this.m_delay = 0.0;
                this.m_tileId = 0.0;
                this.m_userData = null;
                this.m_transform=null;
                this.m_currentFrame = 0.0;
                this.m_totalFrame = 1.0;
                this.m_visible=false;
                this.m_isActivate = false;
                this.m_parent = null;
                this.m_rotation = 0.0;
                this.m_frameX=0;
                this.m_frameY=0;
                this.m_scaleX = 1.0;
                this.m_scaleY = 1.0;
                this.m_skewX = 0.0;
                this.m_skewY = 0.0;
                this.m_pivotX = 0.0;
                this.m_pivotY = 0.0;
                this.GPU=false;
                this.GPUX=Number.MAX_VALUE;
                this.GPUY=Number.MAX_VALUE;
                this.x=Number.MAX_VALUE;
                this.y=Number.MAX_VALUE;
                this.m_r = 1;
                this.m_g = 1;
                this.m_b = 1;
                this.m_a = 1;
                this.m_alpha = 1;
                this.m_tileOffsetX = 0;
                this.m_tileOffsetY = 0;
                this.m_tileOffsetWidth = 0;
                this.m_tileOffsetHeight = 0;
                this.m_center=false;
                this.m_forceCenter=false;
                this.m_framePivotY = this.m_frameHeight / 2;
                this.m_framePivotX = this.m_frameWidth / 2;
                this.removeAllFrameScript();
            },

            /**
             * 获得对应的场景
             * <br />get scene
             * @returns {null}
             */
            getScene:function()
            {
                return this.scene;
            },

            /**
             * 设置对应的场景
             * <br />set scene
             * @param value
             */
            setScene:function(value)
            {
                this.scene=value;
            },

            /**
             * 设置网格ID
             * <br />set mesh ID
             * @param value
             */
            setID:function(value)
            {
                this.m_id=value;
                var mul8=this.m_id * 8;
                this.id8_1 = mul8;
                this.id8_2 = mul8+1;
                this.id8_3 = mul8+2;
                this.id8_4 = mul8+3;
                this.id8_5 = mul8+4;
                this.id8_6 = mul8+5;
                this.id8_7 = mul8+6;
                this.id8_8 = mul8+7;

                var mul16=this.m_id * 16;
                this.id16_1=mul16;
                this.id16_2=mul16+1;
                this.id16_3=mul16+2;
                this.id16_4=mul16+3;
                this.id16_5=mul16+4;
                this.id16_6=mul16+5;
                this.id16_7=mul16+6;
                this.id16_8=mul16+7;
                this.id16_9=mul16+8;
                this.id16_10=mul16+9;
                this.id16_11=mul16+10;
                this.id16_12=mul16+11;
                this.id16_13=mul16+12;
                this.id16_14=mul16+13;
                this.id16_15=mul16+14;
                this.id16_16=mul16+15;
            },





            //重绘
            paint : function()
            {

                /*if(this.scene != null && this.visible && this.isActivate)
                {
                    if(this._isPlaying)
                    {
                        this._targetTime = new Date().getTime();
                        if (this._targetTime - this._lastTime >= this._delay)
                        {
                            this._lastTime = this._targetTime;
                            this.updateFrame(true);

                        }
                    }
                    if(this._isRedraw)
                    {

                        this._isRedraw = false;

                        //强制转换成笛卡尔第四象限坐标系
                        //transform into Cartesian coordinates (fourth quadrant)
                        this._quadMatrixUtil.setX(this._x * 2 / ss2d.Stage2D.stageHeight);
                        this._quadMatrixUtil.setY(this._y * 2 /ss2d.Stage2D.stageHeight);

                        this._quadMatrixUtil.setRotation(this.rotation);

                        this._quadMatrixUtil.upDateMatrixData(
                            (-this._pivotX + this._framePivotX) * this._scaleX * 2 / ss2d.Stage2D.stageHeight,
                            (-this._pivotY + this._framePivotY) * this._scaleY * 2 / ss2d.Stage2D.stageHeight,
                            this._scaleX * (this._frameWidth / this.mTexture.width),
                            this._scaleY * (this._frameHeight / this.mTexture.height),
                            this._skewX, this._skewY);

                        //更新面板的矩阵信息
                        //update matrix of the panel
                        this._quadMatrixUtil.upDateMatrix(this._transform == null);

                        if(this._transform != null)
                        {
                            this._quadMatrixUtil.getMatrix2D().rawData = this._quadMatrixUtil.getMatrix2D().add3x3(this._quadMatrixUtil.getMatrix2D().rawData, this._transform.rawData);
                            this._quadMatrixUtil.upDateRaw();
                        }
                    }

                    if(this.GPU)
                    {

                        this.verticesGPUList[this._id8_1]  = this.GPUX*2/ss2d.Stage2D.stageHeight;
                        this.verticesGPUList[this._id8_2]  = this.GPUY*2/ss2d.Stage2D.stageHeight;
                        this.verticesGPUList[this._id8_3]  = this.verticesGPUList[this._id8_1];
                        this.verticesGPUList[this._id8_4]  = this.verticesGPUList[this._id8_2];
                        this.verticesGPUList[this._id8_5]  = this.verticesGPUList[this._id8_1];
                        this.verticesGPUList[this._id8_6]  = this.verticesGPUList[this._id8_2];
                        this.verticesGPUList[this._id8_7]  = this.verticesGPUList[this._id8_1];
                        this.verticesGPUList[this._id8_8]  = this.verticesGPUList[this._id8_2];
                    }


                    this.vertices[this._id8_1]  = this.leftUpPoint.x;
                    this.vertices[this._id8_2]  = this.leftUpPoint.y;
                    this.vertices[this._id8_3]  = this.rightUpPoint.x;
                    this.vertices[this._id8_4]  = this.rightUpPoint.y;
                    this.vertices[this._id8_5]  = this.rightDownPoint.x;
                    this.vertices[this._id8_6]  = this.rightDownPoint.y;
                    this.vertices[this._id8_7]  = this.leftDownPoint.x;
                    this.vertices[this._id8_8]  = this.leftDownPoint.y;

                    this.jointList[this._id8_1] = this.textureID;
                    this.jointList[this._id8_2] = this.textureID;
                    this.jointList[this._id8_3] = this.textureID;
                    this.jointList[this._id8_4] = this.textureID;
                    this.jointList[this._id8_5] = this.textureID;
                    this.jointList[this._id8_6] = this.textureID;
                    this.jointList[this._id8_7] = this.textureID;
                    this.jointList[this._id8_8] = this.textureID;

                    //设置UV信息,因为我们希望用户输入实际的像素坐标而不是UV比例,所以把实际像素转换为实际的比例,下面分别设置了最大的
                    //采样区域和偏移坐标注意有的地方只有一个值,那是因为前面的值为0，我只是把它删除了而已

                    this._frameXDivWidth = this._frameX / this.mTexture.width;
                    this._frameYDivHeight = this._frameY / this.mTexture.height;
                    this._frameWidthDivWidth =this._frameWidth / this.mTexture.width;
                    this._frameHeightDivHeight = this._frameHeight / this.mTexture.height;

                    this.textureUV[this._id8_1] =  this._frameXDivWidth;
                    this.textureUV[this._id8_2] = -this._frameYDivHeight;
                    this.textureUV[this._id8_3] =  this._frameWidthDivWidth + this._frameXDivWidth;
                    this.textureUV[this._id8_4] = -this._frameYDivHeight;
                    this.textureUV[this._id8_5] =  this._frameWidthDivWidth + this._frameXDivWidth;
                    this.textureUV[this._id8_6] = -this._frameHeightDivHeight - this._frameYDivHeight;
                    this.textureUV[this._id8_7] =  this._frameXDivWidth;
                    this.textureUV[this._id8_8] = -this._frameHeightDivHeight - this._frameYDivHeight;

                    if(this.isVertexColour)
                    {
                         var vr=this._r * this._alpha;
                         var vg=this._g * this._alpha;
                         var vb=this._b * this._alpha;
                         var va=this._a * this._alpha;
                         this.verticesColor[this._id16_1]  = vr *this._leftUpR;
                         this.verticesColor[this._id16_2]  = vg *this._leftUpG;
                         this.verticesColor[this._id16_3]  = vb *this._leftUpB;
                         this.verticesColor[this._id16_4]  = va *this._leftUpA

                         this.verticesColor[this._id16_5]  = vr *this._rightUpR;
                         this.verticesColor[this._id16_6]  = vg *this._rightUpG;
                         this.verticesColor[this._id16_7]  = vb *this._rightUpB;
                         this.verticesColor[this._id16_8]  = va *this._rightUpA;

                         this.verticesColor[this._id16_9]  = vr *this._rightDownR;
                         this.verticesColor[this._id16_10] = vg *this._rightDownG;
                         this.verticesColor[this._id16_11] = vb *this._rightDownB;
                         this.verticesColor[this._id16_12] = va *this._rightDownA;

                         this.verticesColor[this._id16_13] = vr *this._leftDownR;
                         this.verticesColor[this._id16_14] = vg *this._leftDownG;
                         this.verticesColor[this._id16_15] = vb *this._leftDownB;
                         this.verticesColor[this._id16_16] = va *this._leftDownA;

                    }else
                    {
                        this.verticesColor[this._id16_1]  = 1.0;
                        this.verticesColor[this._id16_2]  = 1.0;
                        this.verticesColor[this._id16_3]  = 1.0;
                        this.verticesColor[this._id16_4]  = 1.0

                        this.verticesColor[this._id16_5]  = 1.0;
                        this.verticesColor[this._id16_6]  = 1.0;
                        this.verticesColor[this._id16_7]  = 1.0;
                        this.verticesColor[this._id16_8]  = 1.0;

                        this.verticesColor[this._id16_9]  = 1.0;
                        this.verticesColor[this._id16_10]  = 1.0;
                        this.verticesColor[this._id16_11] = 1.0;
                        this.verticesColor[this._id16_12] = 1.0;

                        this.verticesColor[this._id16_13] = 1.0;
                        this.verticesColor[this._id16_14] = 1.0;
                        this.verticesColor[this._id16_15] = 1.0;
                        this.verticesColor[this._id16_16] = 1.0;
                    }
                }
                else
                {

                    this.vertices[this._id8_1] = 0;
                    this.vertices[this._id8_2] = 0;
                    this.vertices[this._id8_3] = 0;
                    this.vertices[this._id8_4] = 0;
                    this.vertices[this._id8_5] = 0;
                    this.vertices[this._id8_6] = 0;
                    this.vertices[this._id8_7] = 0;
                    this.vertices[this._id8_8] = 0;
                }
                this.dispatchEvent(ss2d.Event.ENTER_FRAME);*/
            }
        }
    );
})();