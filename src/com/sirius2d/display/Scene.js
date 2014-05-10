
/**
 * Scene.js
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
     * Scene 场景管理类，开发高效率游戏的必要类，它不是一个显示对象，而是一个批处理的对象池，使用它你必须事先明确需要多少个Quad，当以后开发时再从Scene里去取,Quad是整个引擎里功能最多的显示对象。
     * <br />演示地址:http://sirius2d.com/demos/d_12/
     * @class
     */
    ss2d.Scene = Class
    (
        /** @lends ss2d.Scene.prototype */
        {
            Extends:ss2d.EventDispatcher,
            /**
             * GL裁切X轴位置
             * <br />scissor X
             */
            glScissorX:0.0,

            /**
             * GL裁切Y轴位置
             * <br />scissor Y
             */
            glScissorY:0.0,

            /**
             * GL裁切宽度
             * <br />scissor width
             */
            glScissorWidth:0.0,

            /**
             * GL裁切高度
             * <br />scissor height
             */
            glScissorHeight:0.0,

            /**
             * 舞台
             * <br />stage
             */
            stage : null,
            verticesColorBuffer : null,
            verticesGPUBuffer : null,
            verticesJointBuffer : null,
            vertexPositionBuffer : null,
            vertexTextureUvdBuffer : null,
            vertexIndexBuffer : null,
            quadList : null,
            maxQuadNum : 1,

            m_isJoint : false,
            m_indexList : null,
            m_verticesGPUList : null,
            m_jointList :null,
            m_verticesList :null,
            m_uvList : null,
            m_colorList : null,
            m_texture : null,
            shader : null,
            m_sfactor : null,
            m_dfactor : null,
            m_mouseEnabled : true,
            m_applyIndex:0,

            initialize : function(textureData)
            {
                this.glScissorX=0.0;
                this.glScissorY=0.0;
                this.glScissorWidth=ss2d.Stage2D.canvas.width;
                this.glScissorHeight=ss2d.Stage2D.canvas.height;
                this.quadList=[];
                //对象池最大数量
                //the maximum amount of the quad list
                this.maxQuadNum = 1;
                if(arguments.length > 1) this.maxQuadNum = arguments[1];
                this.m_indexList = new Uint16Array(this.maxQuadNum * 6);
                this.m_jointList = new Float32Array(this.maxQuadNum * 8);
                this.m_verticesGPUList=new Float32Array(this.maxQuadNum * 8);
                this.m_verticesList = new Float32Array(this.maxQuadNum * 8);
                this.m_uvList = new Float32Array(this.maxQuadNum * 8);
                this.m_colorList = new Float32Array(this.maxQuadNum * 16);
                this.m_texture = arguments[0];

                if(arguments[0] instanceof Array)
                {
                    this.m_isJoint = true;
                    this.shader = new ss2d.ShaderJoint();
                }else
                {
                    this.shader = ss2d.Stage2D.shader;
                }

                //上传到webgl的状态机里
                //ss2d.Stage2D.gl.bindBuffer(ss2d.Stage2D.gl.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer);
                //ss2d.Stage2D.gl.bufferData(ss2d.Stage2D.gl.ELEMENT_ARRAY_BUFFER, this._indexList, ss2d.Stage2D.gl.STATIC_DRAW);

                //设置顶点绘制的循序,WBEGL会根据你的这个循序去渲染你的图像,通常你可以利用这里改变你的图像的排序循序,这里渲染的是
                //两个三角形,因为我们是做2D,两个三角形是有两个共享点的
                //根据对象数量创建顶点
                /*for(var v = 0; v < this._maxQuadNum; v++)
                 {
                 this.m_indexList[v + v * 5 + 0] = 0 + v * 4;
                 this.m_indexList[v + v * 5 + 1] = 1 + v * 4;
                 this.m_indexList[v + v * 5 + 2] = 2 + v * 4;
                 this.m_indexList[v + v * 5 + 3] = 0 + v * 4;
                 this.m_indexList[v + v * 5 + 4] = 2 + v * 4;
                 this.m_indexList[v + v * 5 + 5] = 3 + v * 4;
                 }*/

                //这里的上传类型改变为长整形了,Uint16Array,这里是一个坑,在其他语言里你上传错误的数据类型不会报错,但是会显示很奇怪,
                //以前我就被这个坑了一个下午,因为索引ID没有小数
                this.m_sfactor = ss2d.Stage2D.gl.ONE;
                this.m_dfactor = ss2d.Stage2D.gl.ONE_MINUS_SRC_ALPHA;


                //创建对象池元素
                //create elements of the quad list
                for(var i = 0; i < this.maxQuadNum; i++)
                {
                    this.quadList.push(new ss2d.Quad(i, this.m_texture,
                        this.m_verticesList, this.m_uvList, this.m_colorList, this.m_jointList,this.m_indexList,this.m_verticesGPUList));
                }

                //初始化GPU加速缓存
                //create GPU buffer
                this.verticesGPUBuffer=ss2d.Stage2D.gl.createBuffer();
                //初始化拼接色信息
                //create texture joint buffer
                this.verticesJointBuffer = ss2d.Stage2D.gl.createBuffer();
                //从gl申请一个顶点颜色信息缓存数组
                //create vertex color buffer
                this.verticesColorBuffer = ss2d.Stage2D.gl.createBuffer();
                //从gl申请一个顶点坐标信息缓存数组
                //create vertex pos buffer
                this.vertexPositionBuffer = ss2d.Stage2D.gl.createBuffer();
                //从gl申请一个UV的缓存数组
                //create texture UV buffer
                this.vertexTextureUvdBuffer = ss2d.Stage2D.gl.createBuffer();
                //申请一个顶点索引的缓存数组
                //create vertex index buffer
                this.vertexIndexBuffer = ss2d.Stage2D.gl.createBuffer();
            },

            /**
             * 销毁
             * <br />dispose
             */
            dispose:function()
            {
                ss2d.Stage2D.gl.deleteBuffer(this.verticesGPUBuffer);
                ss2d.Stage2D.gl.deleteBuffer(this.verticesJointBuffer);
                ss2d.Stage2D.gl.deleteBuffer(this.verticesColorBuffer);
                ss2d.Stage2D.gl.deleteBuffer(this.vertexPositionBuffer);
                ss2d.Stage2D.gl.deleteBuffer(this.vertexTextureUvdBuffer);
                ss2d.Stage2D.gl.deleteBuffer(this.vertexIndexBuffer);

                this.verticesGPUBuffer=null;
                this.verticesJointBuffer=null;
                this.verticesColorBuffer=null;
                this.vertexPositionBuffer=null;
                this.vertexTextureUvdBuffer=null;
                this.vertexIndexBuffer=null;
                this.m_texture=null;
            },


            /**
             * 申请quad
             * <br />register quads from quad list
             * @returns {*}
             */
            applyQuad : function(cache)
            {
                if(cache)
                {
                    for(var i=this.m_applyIndex;i <this.quadList.length; i++)
                    {
                        if(this.quadList[i].getIsActivate() == false)
                        {
                            this.m_applyIndex=i;
                            this.quadList[i].launch();
                            this.quadList[i].setScene(this);
                            return this.quadList[i];
                        }
                    }
                }else
                {
                    for(var i=0;i < this.quadList.length; i++)
                    {
                        if(this.quadList[i].getIsActivate() == false)
                        {
                            this.quadList[i].launch();
                            this.quadList[i].setScene(this);
                            return this.quadList[i];
                        }
                    }
                }

                return null;
            },

            /**
             * 隐藏quad
             * <br />hide quad
             * @param quad
             */
            hideQuad : function(child)
            {
                child.setScene(null);
            },

            /**
             * 显示quad
             * <br />display quad
             * @param quad
             */
            showQuad : function(child,parameter)
            {
                if(!parameter)
                {
                    var index = this.quadList.indexOf(child);
                    if (index != -1)
                    {
                        for(var i=index+1;i<this.quadList.length;i++)
                        {
                            var quad = this.quadList[i];
                            quad.id = quad.id - 1;
                            quad.initIndexs();
                        }
                        child.id = this.quadList.length - 1;
                        this.quadList.splice(index,1);
                        this.quadList.push(child);
                        child.initIndexs();
                    }
                }
                child.setScene(this);
            },

            /**
             * 设置纹理对象
             * <br />set texture
             * @param value
             */
            setTexture:function(value)
            {
                this.m_texture=value;
            },

            /**
             * 获取纹理对象
             * <br />get texture
             * @returns {null}
             */
            getTexture:function()
            {
                return this.m_texture;
            },

            /**
             * 获取对象鼠标监测状态
             * <br />get a boolean value that indicates whether the mouse event is listened
             * @returns {boolean}
             */
            getMouseEnabled : function()
            {
                return this.m_mouseEnabled;
            },

            /**
             * 设置对象鼠标监测状态
             * <br />get a boolean value that indicates whether the mouse event is listened
             * @param boolean value
             */
            setMouseEnabled : function(value)
            {
                this.m_mouseEnabled = value;
            },



            /**
             * 设置着色器
             * <br />set shader
             * @param value
             */
            setShader : function(value)
            {
                if(value!=null)
                {
                    this.shader = value;
                }else
                {
                    this.shader = ss2d.Stage2D.shader;
                }

            },

            /**
             * 获取着色器
             * <br />get shader
             * @returns {null}
             */
            getShader : function()
            {
                return this.shader;
            },



            /**
             * 设置混色参数
             * <br />set blend mode
             * @param src
             * @param dst
             */
            blend : function(value)
            {
                if(arguments.length==2)
                {
                    this.m_sfactor = arguments[0];
                    this.m_dfactor = arguments[1];
                }else if(arguments.length==1)
                {
                    this.m_sfactor = arguments[0][0];
                    this.m_dfactor = arguments[0][1];
                }
            },


            getQuadsUnderPoint : function(x, y)
            {
                var quads = null;
                for(var i = this.quadList.length - 1;i >= 0; i--)
                {
                    if(this.quadList[i].getMouseEnabled() && this.quadList[i].getScene()!= null && this.quadList[i].getVisible())
                    {
                        /*var pw = (this._quadList[i].getVertex(3)[0] - this._quadList[i].getVertex(0)[0]) / 2;
                         var ph = (this._quadList[i].getVertex(3)[1] - this._quadList[i].getVertex(0)[1]) / 2;
                         var px = this._quadList[i].getVertex(0)[0] + pw;
                         var py = this._quadList[i].getVertex(0)[1] + ph;
                         if(this._quadList[i].width != 0 && this._quadList[i].height != 0)
                         {
                         if(Math.abs(x - px) <= pw && Math.abs(y - py) <= ph)
                         {
                         if (quads == null) quads = [];
                         quads.push(this._quadList[i]);
                         }
                         }*/



                        //基于顶点的监测方式,虽然消耗一点性能,但是可以做精准的三角形拾取点击
                        if(this.quadList[i].getWidth() != 0 && this.quadList[i].getHeight() != 0)
                        {


                            var point=new ss2d.Point((x-this.quadList[i].GPUX)* 2 / ss2d.Stage2D.stageHeight,(y-this.quadList[i].GPUY)* 2 / ss2d.Stage2D.stageHeight);
                            if(ss2d.hitPoint(
                                this.quadList[i].getVertex(0),
                                this.quadList[i].getVertex(1),
                                this.quadList[i].getVertex(2),point)||
                                ss2d.hitPoint(
                                    this.quadList[i].getVertex(2),
                                    this.quadList[i].getVertex(1),
                                    this.quadList[i].getVertex(3),point))
                            {



                                if (quads == null) quads = [];
                                quads.push(this.quadList[i]);
                            }
                        }
                    }
                }
                return quads;
            },

            /**
             * 检测鼠标碰撞
             * <br />collision detection between mouse and point
             * @param x
             * @param y
             * @returns {boolean}
             */
            hitTestPoint : function(x, y)
            {
                for(var i = this.quadList.length - 1;i >= 0; i--)
                {
                    if(this.quadList[i].mouseEnabled && this.quadList[i].parent != null && this.quadList[i].m_visible)
                    {
                        var pw = (this.quadList[i].getVertex(3)[0] - this.quadList[i].getVertex(0)[0]) / 2;
                        var ph = (this.quadList[i].getVertex(3)[1] - this.quadList[i].getVertex(0)[1]) / 2;
                        var px = this.quadList[i].getVertex(0)[0] + pw;
                        var py = this.quadList[i].getVertex(0)[1] + ph;
                        if(this.quadList[i].width != 0 && this.quadList[i].height != 0)
                        {
                            if(Math.abs(x - px) <= pw && Math.abs(y - py) <= ph)
                            {
                                return this.quadList[i];
                            }
                        }
                    }
                }
                return null;
            },

            /**
             * 重绘
             * paint
             */
            paint : function()
            {
                ss2d.Stage2D.gl.scissor(this.glScissorX,this.glScissorY,this.glScissorWidth,this.glScissorHeight);
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


                        if(thisQuad.isVertexColour)
                        {
                            var vr=thisQuad.m_r * thisQuad.m_alpha;
                            var vg=thisQuad.m_g * thisQuad.m_alpha;
                            var vb=thisQuad.m_b * thisQuad.m_alpha;
                            var va=thisQuad.m_a * thisQuad.m_alpha;

                            thisQuad.verticesColor[thisQuad.id16_1]  = vr *thisQuad.m_leftUpR;
                            thisQuad.verticesColor[thisQuad.id16_2]  = vg *thisQuad.m_leftUpG;
                            thisQuad.verticesColor[thisQuad.id16_3]  = vb *thisQuad.m_leftUpB;
                            thisQuad.verticesColor[thisQuad.id16_4]  = va *thisQuad.m_leftUpA;

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
            }
        }
    );
})();