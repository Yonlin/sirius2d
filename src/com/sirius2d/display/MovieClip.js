/**
 * MovieClip.js
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
    /**
     * MovieClip 影片剪辑类,不建议多用,一般用于显示测试,后处理,单个大背景,如果显示数量很多建议用Scene
     * <br />movie clip class It's used for test or post-processing with a single image  Use scene class for more elements
     * <br /> 演示地址:http://sirius2d.com/demos/d_10/
     * @class
     */
    ss2d.MovieClip = Class
    (
        /** @lends ss2d.MovieClip.prototype */
        {
            Extends:ss2d.Scene,

            /**
             * @private
             */
            x : 0,
            y : 0,
            m_r : 1,
            m_g : 1,
            m_b : 1,
            m_a : 1,
            m_width : 1,
            m_height : 1,
            m_parent : null,
            m_mouseEnabled : false,
            m_userData : null,
            m_center:false,
            m_forceCenter:false,
            m_quad:null,

            initialize : function(textureData)
            {
                this.init(textureData);
            },

            init:function(textureData)
            {
                this.displayerlist=[];

                this.glScissorX=0.0;
                this.glScissorY=0.0;
                this.glScissorWidth=ss2d.Stage2D.canvas.width;
                this.glScissorHeight=ss2d.Stage2D.canvas.height;
                this.quadList=[];
                //对象池最大数量
                //the maximum amount of quad pool
                this.maxQuadNum = 1;
                this.m_indexList = new Uint16Array(this.maxQuadNum * 6);
                this.m_jointList = new Float32Array(this.maxQuadNum * 8);
                this.m_verticesGPUList=new Float32Array(this.maxQuadNum * 8);
                this.m_verticesList = new Float32Array(this.maxQuadNum * 8);
                this.m_uvList = new Float32Array(this.maxQuadNum * 8);
                this.m_colorList = new Float32Array(this.maxQuadNum * 16);
                this.m_texture = textureData;
                if(textureData instanceof Array)
                {
                    this.m_isJoint = true;
                    this.shader = new ss2d.ShaderJoint();
                }else
                {
                    this.shader = ss2d.Stage2D.shader;
                }

                this.m_sfactor = ss2d.Stage2D.gl.ONE;
                this.m_dfactor = ss2d.Stage2D.gl.ONE_MINUS_SRC_ALPHA;

                //创建对象池元素
                // create elements of the quad pool
                for(var i = 0; i < this.maxQuadNum; i++)
                {
                    this.quadList.push(new ss2d.Quad(i, this.m_texture,this.m_verticesList, this.m_uvList, this.m_colorList, this.m_jointList,this.m_indexList,this.m_verticesGPUList));
                };

                this.m_quad=this.applyQuad(true);
                this.showQuad(this.m_quad);

                //初始化GPU加速缓存
                //initialize GPU buffer
                this.verticesGPUBuffer=ss2d.Stage2D.gl.createBuffer();
                //初始化拼接色信息
                //initialize joint buffer
                this.verticesJointBuffer = ss2d.Stage2D.gl.createBuffer();
                //从gl申请一个顶点颜色信息缓存数组
                //register a vertex color buffer array
                this.verticesColorBuffer = ss2d.Stage2D.gl.createBuffer();
                //从gl申请一个顶点坐标信息缓存数组
                //register a vertex pos buffer array
                this.vertexPositionBuffer = ss2d.Stage2D.gl.createBuffer();
                //从gl申请一个UV的缓存数组
                //register a UV buffer array
                this.vertexTextureUvdBuffer = ss2d.Stage2D.gl.createBuffer();
                //申请一个顶点索引的缓存数组
                //register a vertex index buffer array
                this.vertexIndexBuffer = ss2d.Stage2D.gl.createBuffer();
            },

            /**
             * 检测对象与坐标点的碰撞
             * <br />collision detection between the object and a point
             * @param x
             * @param y
             * @returns {boolean}
             */
            hitTestPoint : function(x, y)
            {
                var point=this.absCentre();
                var distanceX = Math.abs(point.x-x);
                var distanceY = Math.abs(point.y-y);
                if (distanceX <= this.getWidth() / 2 &&
                    distanceY <= this.getHeight()/ 2)
                {
                    return true;
                }
                return false
            },

            /**
             * 检测对象与对象的碰撞
             * <br />collision detection between 2 objects
             * @param child
             * @returns {boolean}
             */
            hitTestObject : function(child)
            {
                var pointA=this.absCentre();
                var pointB=child.absCentre();
                var distanceX = Math.abs(pointA.x - pointB.x);
                var distanceY = Math.abs(pointA.y - pointB.y);
                if (distanceX <= this.getWidth() / 2 + this.getWidth() / 2 &&
                    distanceY <= child.getHeight() / 2 + child.getHeight() / 2)
                {
                    return true;
                }
                return false
            },

            /**
             * 检测对象与范围的碰撞
             * <br />collision detection between the object and an area
             * @param x
             * @param y
             * @param radius
             * @returns {boolean}
             */
            hitTestRoundness : function(x, y, radius)
            {
                var point=this.absCentre();
                var distanceX = Math.abs(point.x - x);
                var distanceY = Math.abs(point.y - y);
                var distanceZ = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
                if(distanceZ <= radius)
                {
                    return true;
                }
                return false
            },

            /**
             * 设置纹理ID
             * set texture ID
             * @param value
             */
            setTextureID : function(value)
            {
                this.m_quad.setTextureID(value);
            },

            /**
             * 获取纹理ID
             * get texture ID
             * @return {Number}
             */
            getTextureID : function()
            {
                return this.m_quad.getTextureID();
            },

            /**
             * 设置纹理片段名称
             * set tile name
             * @param name {String}
             */
            setTileName : function(name)
            {
                this.m_quad.setTileName(name);
            },

            /**
             * 设置纹理片段ID
             * set tile ID
             * @param id {number}
             */
            setTileId : function(id)
            {
                this.m_quad.setTileId(id);
            },

            /**
             * 指示动画播放的帧率.
             * set FPS of the animation
             * @param	frame 动画播放的帧率.
             */
            setAnimationSpeed : function(frame)
            {
                this.m_quad.setAnimationSpeed(frame);
            },

            /**
             * 设置影片播放的片段
             * play the clip of animation with the right name
             * @param name
             * @returns {number}
             */
            queryName : function(name)
            {
                this.m_quad.queryName(name);
            },

            /**
             * 设置是否循环播放
             * loop the animation
             * @param value
             */
            loop : function(value)
            {
                this.m_quad.loop(value);
            },

            /**
             * 开始播放动画
             * play the animation
             */
            play : function()
            {
                this.m_quad.play();
            },

            /**
             * 停止播放动画
             * stop the animation
             */
            stop : function()
            {
                this.m_quad.stop();
            },

            /**
             * 设置是否倒播动画
             * roll back the animation
             * @param value
             */
            rollbackAnimation:function(value)
            {
                this.m_quad.rollbackAnimation(value);
            },

            /**
             * 从指定的帧播放动画
             * skip to a frame and play the animation
             * @param value
             */
            gotoAndPlay : function(value)
            {
                this.m_quad.gotoAndPlay(value);
            },

            /**
             * 从指定的帧停止播放动画
             * skip to a frame and stop the animation
             * @param value
             */
            gotoAndStop : function(value)
            {
                this.m_quad.gotoAndStop(value);
            },

            /**
             * 添加帧脚本
             * add frame script
             * @param value
             */
            addFrameScript : function(value)
            {
                this.m_quad.addFrameScript(value);
            },

            /**
             * 删除帧脚本
             * delete frame script
             * @param value
             */
            removeFrameScript : function(value)
            {
                this.m_quad.removeFrameScript(value);
            },

            /**
             * 删除所有帧脚本
             * delete all frame scripts
             */
            removeAllFrameScript : function()
            {
                this.m_quad.removeAllFrameScript();
            },

            /**
             * 设置帧延迟
             * set frame delay
             * @param value
             */
            frameDelay:function(value)
            {
                this.m_quad.frameDelay(value);
            },

            /**
             * 获取对象中心对齐状态
             * get a boolean value that indicates whether the object is aligned center
             * @returns {*|boolean}
             */
            getCenter : function() {  return this.m_quad.getCenter();},

            /**
             * 设置对象中心对齐状态
             * make the object align center
             * @param value
             */
            setCenter : function(value){
                this.m_quad.setCenter(value);
            },

            /**
             * 获取动画当前播放帧
             * get the current frame of the animation
             * @returns {number}
             */
            getCurrentFrame:function()
            {
                return this.m_quad.getCurrentFrame();
            },

            /**
             * 获取动画片段总长度
             * get the length of an animation clip
             * @returns {number}
             */
            getTotalFrame:function()
            {
                return this.m_quad.getTotalFrame();
            },


            /**
             * 设置对象切片X轴偏移位置
             * set the tile offset X
             * @param value {number}
             */
            setTileXOffset : function(value)
            {
                this.m_quad.setTileXOffset(value);
            },

            /**
             * 获取对象切片X轴偏移位置
             * get the tile offset X
             * @returns {*}
             */
            getTileXOffset : function()
            {
                return this.m_quad.getTileXOffset();
            },

            /**
             * 设置对象切片Y轴偏移量
             * set the tile offset Y
             * @param value {number}
             */
            setTileYOffset : function(value)
            {
                this.m_quad.setTileYOffset(value);
            },

            /**
             * 获取对象切片Y轴偏移量
             * get the tile offset Y
             * @returns {*}
             */
            getTileYOffset : function()
            {
                return this.m_quad.setTileYOffset();
            },

            /**
             * 设置对象切片宽度偏移量
             * set the width offset of a tile
             * @param value {number}
             */
            setTileWidthOffset : function(value)
            {
                this.m_quad.setTileWidthOffset(value);
            },

            /**
             * 获取对象切片宽度偏移量
             * get the width offset of a tile
             * @returns {*}
             */
            getTileWidthOffset : function()
            {
                return this.m_quad.setTileWidthOffset();
            },

            /**
             * 设置切片高度偏移量
             * set the height offset of a tile
             * @param value {number}
             */
            setTileHeightOffset : function(value)
            {
                this.m_quad.setTileHeightOffset(value);
            },

            /**
             * 获取对象切片高度偏移量
             * get the height offset of a tile
             * @returns {*}
             */
            getTileHeightOffset : function()
            {
                return this.m_quad.setTileHeightOffset();
            },

            /**
             * 销毁
             * remove the quad
             */
            dispose : function()
            {
                this.m_quad.dispose();
            },

            /**
             * 获得绝对中心点
             * get the absolute center of the quad
             */
            absCentre:function()
            {
                return this.m_quad.absCentre();
            },

            /**
             * 设置融合矩阵
             * set the transform matrix
             * @param value
             */
            setTransform:function(value)
            {
                this.m_quad.setTransform(value);
            },

            /**
             * 获取融合矩阵
             * get the transform matrix
             * @returns {*}
             */
            getTransform:function()
            {
                return this.m_quad.getTransform();
            },


            /**
             * 重绘
             * paint
             */
            paint : function()
            {
              //  ss2d.Stage2D.gl.scissor(this.glScissorX,this.glScissorY,this.glScissorWidth,this.glScissorHeight);
                ss2d.Stage2D.gl.blendFunc(this.m_sfactor,this.m_dfactor);

                //开始渲染批处理对象
                //paint quads from quad list
                var len=this.quadList.length;
                for(var i = 0;i < len; i++)
                {
                    var thisQuad=this.quadList[i];
                    if(thisQuad.scene != null && thisQuad.m_visible && thisQuad.m_isActivate)
                    {
                        if(thisQuad.m_isPlaying)
                        {
                            thisQuad.m_targetTime = new Date().getTime();
                            if (thisQuad.m_targetTime - thisQuad.m_lastTime >= thisQuad.m_delay)
                            {
                                thisQuad.m_lastTime = thisQuad.m_targetTime;
                                thisQuad.updateFrame(true);

                            }
                        }
                        if(thisQuad.isRedraw)
                        {

                            thisQuad.isRedraw = false;

                            //强制转换成笛卡尔第四象限坐标系
                            //transform into Cartesian coordinates (fourth quadrant)
                            thisQuad.m_quadMatrixUtil.setX(thisQuad.x * 2 / ss2d.Stage2D.stageHeight);
                            thisQuad.m_quadMatrixUtil.setY(thisQuad.y * 2 /ss2d.Stage2D.stageHeight);

                            thisQuad.m_quadMatrixUtil.setRotation(thisQuad.m_rotation);

                            thisQuad.m_quadMatrixUtil.upDateMatrixData(
                                (-thisQuad.m_pivotX + thisQuad.m_framePivotX) * thisQuad.m_scaleX * 2 / ss2d.Stage2D.stageHeight,
                                (-thisQuad.m_pivotY + thisQuad.m_framePivotY) * thisQuad.m_scaleY * 2 / ss2d.Stage2D.stageHeight,
                                thisQuad.m_scaleX * (thisQuad.m_frameWidth / thisQuad.m_Texture.width),
                                thisQuad.m_scaleY * (thisQuad.m_frameHeight / thisQuad.m_Texture.height),
                                thisQuad.m_skewX, thisQuad.m_skewY);

                            //更新面板的矩阵信息
                            //update matrix of the panel
                            thisQuad.m_quadMatrixUtil.upDateMatrix(thisQuad.m_transform == null);

                            if(thisQuad.m_transform != null)
                            {
                                thisQuad.m_quadMatrixUtil.getMatrix2D().rawData = thisQuad.m_quadMatrixUtil.getMatrix2D().add3x3(thisQuad.m_quadMatrixUtil.getMatrix2D().rawData, thisQuad.m_transform.rawData);
                                thisQuad.m_quadMatrixUtil.upDateRaw();
                            }


                            thisQuad.frameXDivWidth = thisQuad.m_frameX / thisQuad.m_Texture.width;
                            thisQuad.frameYDivHeight = thisQuad.m_frameY / thisQuad.m_Texture.height;
                            thisQuad.frameWidthDivWidth =thisQuad.m_frameWidth / thisQuad.m_Texture.width;
                            thisQuad.frameHeightDivHeight = thisQuad.m_frameHeight / thisQuad.m_Texture.height;

                            thisQuad.textureUV[thisQuad.id8_1] =  thisQuad.frameXDivWidth;
                            thisQuad.textureUV[thisQuad.id8_2] = -thisQuad.frameYDivHeight;
                            thisQuad.textureUV[thisQuad.id8_3] =  thisQuad.frameWidthDivWidth + thisQuad.frameXDivWidth;
                            thisQuad.textureUV[thisQuad.id8_4] = -thisQuad.frameYDivHeight;
                            thisQuad.textureUV[thisQuad.id8_5] =  thisQuad.frameWidthDivWidth + thisQuad.frameXDivWidth;
                            thisQuad.textureUV[thisQuad.id8_6] = -thisQuad.frameHeightDivHeight - thisQuad.frameYDivHeight;
                            thisQuad.textureUV[thisQuad.id8_7] =  thisQuad.frameXDivWidth;
                            thisQuad.textureUV[thisQuad.id8_8] = -thisQuad.frameHeightDivHeight - thisQuad.frameYDivHeight;
                        }

                        if(!thisQuad.isAnimationMatrix)
                        {
                            thisQuad.frameXDivWidth = thisQuad.m_frameX / thisQuad.m_Texture.width;
                            thisQuad.frameYDivHeight = thisQuad.m_frameY / thisQuad.m_Texture.height;
                            thisQuad.frameWidthDivWidth =thisQuad.m_frameWidth / thisQuad.m_Texture.width;
                            thisQuad.frameHeightDivHeight = thisQuad.m_frameHeight / thisQuad.m_Texture.height;

                            thisQuad.textureUV[thisQuad.id8_1] =  thisQuad.frameXDivWidth;
                            thisQuad.textureUV[thisQuad.id8_2] = -thisQuad.frameYDivHeight;
                            thisQuad.textureUV[thisQuad.id8_3] =  thisQuad.frameWidthDivWidth + thisQuad.frameXDivWidth;
                            thisQuad.textureUV[thisQuad.id8_4] = -thisQuad.frameYDivHeight;
                            thisQuad.textureUV[thisQuad.id8_5] =  thisQuad.frameWidthDivWidth + thisQuad.frameXDivWidth;
                            thisQuad.textureUV[thisQuad.id8_6] = -thisQuad.frameHeightDivHeight - thisQuad.frameYDivHeight;
                            thisQuad.textureUV[thisQuad.id8_7] =  thisQuad.frameXDivWidth;
                            thisQuad.textureUV[thisQuad.id8_8] = -thisQuad.frameHeightDivHeight - thisQuad.frameYDivHeight;
                        }

                        if(thisQuad.GPU)
                        {
                            thisQuad.verticesGPUList[thisQuad.id8_1]  = thisQuad.GPUX*2/ss2d.Stage2D.stageHeight;
                            thisQuad.verticesGPUList[thisQuad.id8_2]  = thisQuad.GPUY*2/ss2d.Stage2D.stageHeight;

                            thisQuad.verticesGPUList[thisQuad.id8_3]  = thisQuad.verticesGPUList[thisQuad.id8_1];
                            thisQuad.verticesGPUList[thisQuad.id8_4]  = thisQuad.verticesGPUList[thisQuad.id8_2];
                            thisQuad.verticesGPUList[thisQuad.id8_5]  = thisQuad.verticesGPUList[thisQuad.id8_1];
                            thisQuad.verticesGPUList[thisQuad.id8_6]  = thisQuad.verticesGPUList[thisQuad.id8_2];
                            thisQuad.verticesGPUList[thisQuad.id8_7]  = thisQuad.verticesGPUList[thisQuad.id8_1];
                            thisQuad.verticesGPUList[thisQuad.id8_8]  = thisQuad.verticesGPUList[thisQuad.id8_2];
                        }


                        thisQuad.vertices[thisQuad.id8_1]  = thisQuad.leftUpPoint.x;
                        thisQuad.vertices[thisQuad.id8_2]  = thisQuad.leftUpPoint.y;
                        thisQuad.vertices[thisQuad.id8_3]  = thisQuad.rightUpPoint.x;
                        thisQuad.vertices[thisQuad.id8_4]  = thisQuad.rightUpPoint.y;
                        thisQuad.vertices[thisQuad.id8_5]  = thisQuad.rightDownPoint.x;
                        thisQuad.vertices[thisQuad.id8_6]  = thisQuad.rightDownPoint.y;
                        thisQuad.vertices[thisQuad.id8_7]  = thisQuad.leftDownPoint.x;
                        thisQuad.vertices[thisQuad.id8_8]  = thisQuad.leftDownPoint.y;

                        thisQuad.jointList[thisQuad.id8_1] = thisQuad.m_textureID;
                        thisQuad.jointList[thisQuad.id8_2] = thisQuad.m_textureID;
                        thisQuad.jointList[thisQuad.id8_3] = thisQuad.m_textureID;
                        thisQuad.jointList[thisQuad.id8_4] = thisQuad.m_textureID;
                        thisQuad.jointList[thisQuad.id8_5] = thisQuad.m_textureID;
                        thisQuad.jointList[thisQuad.id8_6] = thisQuad.m_textureID;
                        thisQuad.jointList[thisQuad.id8_7] = thisQuad.m_textureID;
                        thisQuad.jointList[thisQuad.id8_8] = thisQuad.m_textureID;

                        //设置UV信息,因为我们希望用户输入实际的像素坐标而不是UV比例,所以把实际像素转换为实际的比例,下面分别设置了最大的
                        //采样区域和偏移坐标注意有的地方只有一个值,那是因为前面的值为0，我只是把它删除了而已

                        if(thisQuad.isVertexColour)
                        {
                            var vr=thisQuad.m_r * thisQuad.m_alpha;
                            var vg=thisQuad.m_g * thisQuad.m_alpha;
                            var vb=thisQuad.m_b * thisQuad.m_alpha;
                            var va=thisQuad.m_a * thisQuad.m_alpha;

                            thisQuad.verticesColor[thisQuad.id16_1]  = vr *thisQuad.m_leftUpR;
                            thisQuad.verticesColor[thisQuad.id16_2]  = vg *thisQuad.m_leftUpG;
                            thisQuad.verticesColor[thisQuad.id16_3]  = vb *thisQuad.m_leftUpB;
                            thisQuad.verticesColor[thisQuad.id16_4]  = va *thisQuad.m_leftUpA

                            thisQuad.verticesColor[thisQuad.id16_5]  = vr *thisQuad.m_rightUpR;
                            thisQuad.verticesColor[thisQuad.id16_6]  = vg *thisQuad.m_rightUpG;
                            thisQuad.verticesColor[thisQuad.id16_7]  = vb *thisQuad.m_rightUpB;
                            thisQuad.verticesColor[thisQuad.id16_8]  = va *thisQuad.m_rightUpA;

                            thisQuad.verticesColor[thisQuad.id16_9]  = vr *thisQuad.m_rightDownR;
                            thisQuad.verticesColor[thisQuad.id16_10] = vg *thisQuad.m_rightDownG;
                            thisQuad.verticesColor[thisQuad.id16_11] = vb *thisQuad.m_rightDownB;
                            thisQuad.verticesColor[thisQuad.id16_12] = va *thisQuad.m_rightDownA;

                            thisQuad.verticesColor[thisQuad.id16_13] = vr *thisQuad.m_leftDownR;
                            thisQuad.verticesColor[thisQuad.id16_14] = vg *thisQuad.m_leftDownG;
                            thisQuad.verticesColor[thisQuad.id16_15] = vb *thisQuad.m_leftDownB;
                            thisQuad.verticesColor[thisQuad.id16_16] = va *thisQuad.m_leftDownA;

                        }else
                        {
                            thisQuad.verticesColor[thisQuad.id16_1]  = 1.0;
                            thisQuad.verticesColor[thisQuad.id16_2]  = 1.0;
                            thisQuad.verticesColor[thisQuad.id16_3]  = 1.0;
                            thisQuad.verticesColor[thisQuad.id16_4]  = 1.0

                            thisQuad.verticesColor[thisQuad.id16_5]  = 1.0;
                            thisQuad.verticesColor[thisQuad.id16_6]  = 1.0;
                            thisQuad.verticesColor[thisQuad.id16_7]  = 1.0;
                            thisQuad.verticesColor[thisQuad.id16_8]  = 1.0;

                            thisQuad.verticesColor[thisQuad.id16_9]  = 1.0;
                            thisQuad.verticesColor[thisQuad.id16_10] = 1.0;
                            thisQuad.verticesColor[thisQuad.id16_11] = 1.0;
                            thisQuad.verticesColor[thisQuad.id16_12] = 1.0;

                            thisQuad.verticesColor[thisQuad.id16_13] = 1.0;
                            thisQuad.verticesColor[thisQuad.id16_14] = 1.0;
                            thisQuad.verticesColor[thisQuad.id16_15] = 1.0;
                            thisQuad.verticesColor[thisQuad.id16_16] = 1.0;
                        }
                    }
                    else
                    {

                        thisQuad.vertices[thisQuad.id8_1] = 0;
                        thisQuad.vertices[thisQuad.id8_2] = 0;
                        thisQuad.vertices[thisQuad.id8_3] = 0;
                        thisQuad.vertices[thisQuad.id8_4] = 0;
                        thisQuad.vertices[thisQuad.id8_5] = 0;
                        thisQuad.vertices[thisQuad.id8_6] = 0;
                        thisQuad.vertices[thisQuad.id8_7] = 0;
                        thisQuad.vertices[thisQuad.id8_8] = 0;
                    }
                    thisQuad.dispatchEvent(ss2d.Event.ENTER_FRAME);
                }
                this.shader.upDataShader(this);
                ss2d.Stage2D.gl.bindBuffer(ss2d.Stage2D.gl.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer);
                //上传顶点索引数据并且开始绘制,绘制类型为三角形,长度,类型为短整形,间隔为0
                //upload vertex index data and draw elements.
                ss2d.Stage2D.gl.drawElements(ss2d.Stage2D.gl.TRIANGLES, 6 * this.maxQuadNum, ss2d.Stage2D.gl.UNSIGNED_SHORT, 0);
            },

            /**
             * 获取对象颜色值
             * get the color of the object
             */
            getColor : function(){
                this.m_quad.getColor();
            },

            /**
             * 设置对象颜色值
             * set the color of the object
             * @param value
             */
            setColor : function(value)
            {
               this.m_quad.setColor(value);
            },

            /**
             * 设置顶点颜色
             * set RGBA of vertexes
             * @param index 顶点的索引ID
             * @param r 红色通道
             * @param g 绿色通道
             * @param b 蓝色通道
             * @param a 透明通道
             */
            setVertexColour:function(index,r,g,b,a)
            {
                this.m_quad.setVertexColour(index,r,g,b,a);

            },

            /**
             * 获取对象红色通道值
             * get red channel of the object
             * @returns {*|number}
             */
            getR : function() {  return this.m_quad.getR();},

            /**
             * 设置对象红色通道值
             * set red channel of the object
             * @param value
             */
            setR : function(value){ this.m_quad.setR(value) },

            /**
             * 获取对象绿色通道值
             * get green channel of the object
             * @returns {*|number}
             */
            getG : function() {  return this.m_quad.getG();},

            /**
             * 设置对象绿色通道值
             * set green channel of the object
             * @param value
             */
            setG : function(value){ this.m_quad.setG(value)},

            /**
             * 获取对象蓝色通道值
             * get blue channel of the object
             * @returns {*|number}
             */
            getB : function() {  return this.m_quad.getB();},

            /**
             * 设置对象蓝色通道值
             * set blue channel of the object
             * @param value
             */
            setB : function(value){ this.m_quad.setB(value)},

            /**
             * 获取对象像素透明值
             * get alpha channel of the object
             * @returns {*|number}
             */
            getA : function() {  return this.m_quad.getA();},

            /**
             * 设置对象像素透明值
             * set alpha channel of the object
             * @param value
             */
            setA : function(value){ this.m_quad.setA(value)},

            /**
             * 获取对象X轴位置
             * get X of the object
             * @returns {*|number|int}
             */
            getX : function() {  return this.m_quad.getX();},

            /**
             * 设置对象的X轴位置
             * set X of the object
             * @param value
             */
            setX : function(value){ this.m_quad.setX(value); },

            /**
             * 获取对象的Y轴位置
             * get Y of the object
             * @returns {*|number|int}
             */
            getY : function() {  return this.m_quad.getY();},

            /**
             * 设置对象的Y轴位置
             * set Y of the object
             * @param value
             */
            setY : function(value){ this.m_quad.setY(value); },

            /**
             * 获取对象的宽度
             * get width of the object
             * @returns {*|int|number}
             */
            getWidth : function() {  return this.m_quad.getWidth();},

            /**
             * 设置对象的宽度
             * set width of the object
             * @param value
             */
            setWidth : function(value){ this.m_quad.setWidth(value);},

            /**
             * 获取对象的高度
             * get height of the object
             * @returns {*|int|number}
             */
            getHeight : function() {  return this.m_quad.getHeight();},

            /**
             * 设置对象的高度
             * set height of the object
             * @param value
             */
            setHeight : function(value){ this.m_quad.setHeight(value); },

            /**
             * 获取对象的X轴比例
             * get scale X of the object
             * @returns {*|number}
             */
            getScaleX : function() {  return this.m_quad.getScaleX();},

            /**
             * 设置对象的X轴比例
             * set scale X of the object
             * @param value
             */
            setScaleX : function(value){ this.m_quad.setScaleX(value); },

            /**
             * 获取对象的Y轴比例
             * get scale Y of the object
             * @returns {*|number}
             */
            getScaleY : function() {  return this.m_quad.getScaleY();},

            /**
             * 设置对象的Y轴比例
             * set scale Y of the object
             * @param value
             */
            setScaleY : function(value){ this.m_quad.setScaleY(value); },

            /**
             * 获取对象的X轴倾斜值
             * get skew X of the object
             * @returns {*|number}
             */
            getSkewX : function() {  return this.m_quad.getSkewX();},

            /**
             * 设置对象的X轴倾斜值
             * set skew X of the object
             * @param value
             */
            setSkewX : function(value){ this.m_quad.setSkewX(value); },

            /**
             * 获取对象的Y轴倾斜值
             * get skew Y of the object
             * @returns {*|number}
             */
            getSkewY : function() {  return this.m_quad.getSkewY();},

            /**
             * 设置对象的Y轴倾斜值
             * set skew Y of the object
             * @param value
             */
            setSkewY : function(value){ this.m_quad.setSkewY(value); },

            /**
             * 获取对象的角度
             * get the angle of the object
             * @returns {*|number}
             */
            getRotation : function() {  return this.m_quad.getRotation();},

            /**
             * 设置对象的角度
             * set the angle of the object
             * @param value
             */
            setRotation : function(value){ this.m_quad.setRotation(value); },

            /**
             * 获取对象的透明度 (RGBA*透明度)
             * get the alpha of the object (RGBA*alpha)
             * @returns {*|number}
             */
            getAlpha : function() {  return this.m_quad.getAlpha();},

            /**
             * 设置对象的透明度 (RGBA*透明度)
             * set the alpha of the object (RGBA*alpha)
             * @param value
             */
            setAlpha : function(value){ this.m_quad.setAlpha(value)},

            /**
             * 获取对象的可见性
             * get the visibility of the object
             * @returns {*|boolean}
             */
            getVisible : function() {  return this.m_quad.getVisible();},

            /**
             * 设置对象的可见性
             * set the visibility of the object
             * @param value
             */
            setVisible : function(value){ this.m_quad.setVisible(value);},

            /**
             * 获取对象的刷新属性
             * get a boolean value that indicates whether the object is redrawn
             * @returns {*|boolean}
             */
            getIsRedraw : function() {  return this.m_quad.getIsRedraw();},

            /**
             * 设置对象的刷新属性
             * set a boolean value that indicates whether the object is redrawn
             * @param value
             */
            setIsRedraw : function(value){ this.m_quad.setIsRedraw(value); },

            /**
             * 获取对象的上级
             * get the parent of the object
             * @returns {null}
             */
            getParent : function() {  return this.m_parent;},

            /**
             * 设置对象的上级
             * set the parent of the object
             * @param value
             */
            setParent : function(value){ this.m_parent = value; },

            /**
             * 获取对象鼠标监测状态
             * get a boolean value that indicates whether the mouse event is listened
             * @returns {*|boolean}
             */
            getMouseEnabled : function() {  return this.m_quad.getMouseEnabled();},

            /**
             * 设置对象鼠标监测状态
             * set a boolean value that indicates whether the mouse event is listened
             * @param value
             */
            setMouseEnabled : function(value){ this.m_quad.setMouseEnabled(value); },

            /**
             * 获取用户数据
             * get the user data
             * @returns {null}
             */
            getUserData : function() {  return this.m_userData;},

            /**
             * 设置用户数据
             * set the user data
             * @param value
             */
            setUserData : function(value){ this.m_userData = value; },

            /**
             * 获取对象强制中心对齐状态 (无视动画偏移量的影响)
             * get a boolean value that indicates whether the object is aligned center (ignore the offsets of animations)
             * @returns {*|boolean}
             */
            getForceCenter : function() {  return this.m_quad.getForceCenter();},

            /**
             * 设置对象强制中心对齐状态 (无视动画偏移量的影响)
             * set a boolean value that indicates whether the object is aligned center (ignore the offsets of animations)
             * @param value
             */
            setForceCenter : function(value){ this.m_quad.setForceCenter(value); }

        }
    );
})();