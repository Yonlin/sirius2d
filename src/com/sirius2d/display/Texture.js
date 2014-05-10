/**
 * Texture.js
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
     * Texture 纹理贴图类 游戏里显示图像的核心封装类，所有的图像必须转换为纹理才能提交给引擎使用
     *  <br /> 演示地址:http://sirius2d.com/demos/d_1/
     * @class
     */
    ss2d.Texture = Class
    (
        /** @lends ss2d.Texture.prototype */
        {
            //////////////////////////////////////////////////////////////////////////
            //  public property
            //////////////////////////////////////////////////////////////////////////

            /**
             * 纹理宽度
             * <br />texture width
             */
            width : 0,

            /**
             * 纹理高度
             * <br />texture height
             */
            height : 0,

            /**
             * 纹理
             * <br />texture object
             */
            texture : null,

            /**
             * 纹理集
             * <br />quad resource
             */
            quadResource : null,

            regExpTail:null,
            regExpUnderline:null,
            regExpIndex:0,
            cacheframeWidth:0,
            cacheframeHeight:0,
            cacheWidth:0,
            cacheHeight:0,
            cacheFrameX:0,
            cacheFrameY:0,
            rttFramebuffer:null,

            initialize : function(value)
            {

                if(arguments.length==1)
                {
                    this.width = arguments[0].width;
                    this.height = arguments[0].height;
                    if(arguments[0] instanceof HTMLImageElement)
                    {
                        if(ss2d.isPower_2(arguments[0].width)==false||ss2d.isPower_2(arguments[0].height)==false)
                        {
                            ss2d.canvas.width=ss2d.getScope(arguments[0].width);
                            ss2d.canvas.height=ss2d.getScope(arguments[0].height);
                            ss2d.context.clearRect(0,0,ss2d.canvas.width,ss2d.canvas.height);
                            ss2d.context.drawImage(arguments[0],0,0,arguments[0].width,arguments[0].height,
                                0,
                                0,
                                ss2d.canvas.width,ss2d.canvas.height);
                            this.newCanvas(ss2d.canvas,0x2901,0x2901,0x2601,0x2601);
                        }else
                        {
                            this.newBitmap(arguments[0],0x2901,0x2901,0x2601,0x2601);
                        }


                    }else if(arguments[0] instanceof HTMLCanvasElement)
                    {

                        this.newCanvas(arguments[0],0x2901,0x2901,0x2601,0x2601);
                    }
                }else if(arguments.length==2)
                {

                    if(arguments[0] instanceof HTMLImageElement&&arguments[1] instanceof Document)
                    {
                        this.width = arguments[0].width;
                        this.height = arguments[0].height;
                        this.newSprite(arguments[0],arguments[1],0x2901,0x2901,0x2601,0x2601);

                    }else if(arguments[0] instanceof HTMLImageElement&&arguments[1] instanceof ss2d.TextureStyle)
                    {
                        if(ss2d.isPower_2(arguments[0].width)==false||ss2d.isPower_2(arguments[0].height)==false)
                        {
                            this.width = arguments[0].width;
                            this.height = arguments[0].height;
                            ss2d.canvas.width=ss2d.getScope(arguments[0].width);
                            ss2d.canvas.height=ss2d.getScope(arguments[0].height);

                            ss2d.context.clearRect(0,0,ss2d.canvas.width,ss2d.canvas.height);
                            ss2d.context.drawImage(arguments[0],0,0,arguments[0].width,arguments[0].height,
                                0,
                                0,
                                ss2d.canvas.width,ss2d.canvas.height);

                            this.newCanvas(ss2d.canvas,arguments[1].xTile,arguments[1].yTile,arguments[1].xSampling,arguments[1].ySampling);
                        }else
                        {
                            this.width = arguments[0].width;
                            this.height = arguments[0].height;
                            this.newBitmap(arguments[0],arguments[1].xTile,arguments[1].yTile,arguments[1].xSampling,arguments[1].ySampling);
                        }

                    }else if(arguments[0] instanceof HTMLCanvasElement&&arguments[1] instanceof ss2d.TextureStyle)
                    {
                        this.width = arguments[0].width;
                        this.height = arguments[0].height;
                        this.newCanvas(arguments[0],arguments[1].xTile,arguments[1].yTile,arguments[1].xSampling,arguments[1].ySampling);
                    }else if(!isNaN(arguments[0])&&!isNaN(arguments[1]))
                    {
                        this.width = arguments[0];
                        this.height = arguments[1];
                        this.newTexture(arguments[0],arguments[1],0x2901,0x2901,0x2601,0x2601);
                    }

                }else if(arguments.length==3)
                {
                    if(arguments[0] instanceof HTMLImageElement&&arguments[1] instanceof Document&&arguments[2] instanceof ss2d.TextureStyle)
                    {
                        this.width = arguments[0].width;
                        this.height = arguments[0].height;
                        this.newSprite(arguments[0],arguments[1],arguments[2].xTile,arguments[2].yTile,arguments[2].xSampling,arguments[2].ySampling);
                    }else if(!isNaN(arguments[0])&&!isNaN(arguments[1])&&arguments[2] instanceof ss2d.TextureStyle)
                    {

                        this.width = arguments[0];
                        this.height = arguments[1];
                        this.newTexture(arguments[0],arguments[1],arguments[2].xTile,arguments[2].yTile,arguments[2].xSampling,arguments[2].ySampling);
                    }
                }
            },

            /**
             * 基于canvas创建新的纹理
             * <br />create new texture based on canvases
             * @param canvas
             * @param xTile
             * @param yTile
             * @param xSampling
             * @param ySampling
             */
            newCanvas:function(canvas,xTile,yTile,xSampling,ySampling)
            {

                //申请一个纹理
                //create a new texture

                this.texture = ss2d.Stage2D.gl.createTexture();

                ss2d.Stage2D.gl.bindTexture(ss2d.Stage2D.gl.TEXTURE_2D,this.texture);
                ss2d.Stage2D.gl.pixelStorei(ss2d.Stage2D.gl.UNPACK_FLIP_Y_WEBGL, 1);
                ss2d.Stage2D.gl.pixelStorei(ss2d.Stage2D.gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);

                /*var text=document.createElement("canvas");
                 text.width=512;
                 text.height=512;
                 var s2d=text.getContext("2d");
                 //对其绘制文字
                 //设置文字属性
                 s2d.textBaseline="middle";
                 s2d.textAlign="center";
                 s2d.font="18px 楷体";
                 s2d.fontStyle="rgba(0,0,0,0.3)";
                 //设置文字渐变
                 s2d.fillStyle=s2d.createLinearGradient(0,0,text.width,0);
                 s2d.fillStyle.addColorStop(0,"rgba(255,255,0,0.5)");
                 s2d.fillStyle.addColorStop(0.5,"rgba(0,255,255,0.5)");
                 s2d.fillStyle.addColorStop(1,"rgba(255,0,255,0.5)");
                 //绘制文字
                 s2d.fillText("文本测试",0,0);*/

                //ss2d.Stage2D.gl.drawImage(text,0,0,text.width,text.height,-512/2+512/2,-512/2+512/2,512,512);
                ss2d.Stage2D.gl.texImage2D(ss2d.Stage2D.gl.TEXTURE_2D, 0, ss2d.Stage2D.gl.RGBA,ss2d.Stage2D.gl.RGBA,ss2d.Stage2D.gl.UNSIGNED_BYTE,canvas);
                //ss2d.Stage2D.gl.texImage2D(ss2d.Stage2D.gl.TEXTURE_2D, 0, ss2d.Stage2D.gl.RGBA, ss2d.Stage2D.gl.RGBA, ss2d.Stage2D.gl.UNSIGNED_BYTE, image);
                //ss2d.Stage2D.gl.texImage2D(ss2d.Stage2D.gl.TEXTURE_2D, 0, ss2d.Stage2D.gl.RGBA, ss2d.Stage2D.gl.RGBA, ss2d.Stage2D.gl.UNSIGNED_BYTE, image);
                //ss2d.Stage2D.gl.texParameteri(ss2d.Stage2D.gl.TEXTURE_2D, ss2d.Stage2D.gl.TEXTURE_MAG_FILTER, ss2d.Stage2D.gl.NEAREST);
                //ss2d.Stage2D.gl.texParameteri(ss2d.Stage2D.gl.TEXTURE_2D, ss2d.Stage2D.gl.TEXTURE_MIN_FILTER, ss2d.Stage2D.gl.NEAREST);



                ss2d.Stage2D.gl.texParameteri(ss2d.Stage2D.gl.TEXTURE_2D, ss2d.Stage2D.gl.TEXTURE_MAG_FILTER,xSampling);
                ss2d.Stage2D.gl.texParameteri(ss2d.Stage2D.gl.TEXTURE_2D, ss2d.Stage2D.gl.TEXTURE_MIN_FILTER,ySampling);


                ss2d.Stage2D.gl.texParameteri(ss2d.Stage2D.gl.TEXTURE_2D, ss2d.Stage2D.gl.TEXTURE_WRAP_S,xTile);
                ss2d.Stage2D.gl.texParameteri(ss2d.Stage2D.gl.TEXTURE_2D, ss2d.Stage2D.gl.TEXTURE_WRAP_T,yTile);

                //ss2d.Stage2D.gl.texParameteri(ss2d.Stage2D.gl.TEXTURE_2D, ss2d.Stage2D.gl.TEXTURE_WRAP_S, ss2d.Stage2D.gl.CLAMP_TO_EDGE);
                //ss2d.Stage2D.gl.texParameteri(ss2d.Stage2D.gl.TEXTURE_2D, ss2d.Stage2D.gl.TEXTURE_WRAP_T, ss2d.Stage2D.gl.CLAMP_TO_EDGE);

                //清空状态机里的纹理,这里只是清除引用而已,不是清除纹理,纹理我们已经经过状态机加工过了
                //only delete the ref
                ss2d.Stage2D.gl.bindTexture(ss2d.Stage2D.gl.TEXTURE_2D, null);
            },

            /**
             * 基于图片创建纹理
             * <br />create texture based on images
             * @param image
             * @param xTile
             * @param yTile
             * @param xSampling
             * @param ySampling
             */
            newBitmap:function(image,xTile,yTile,xSampling,ySampling)
            {
                //申请一个纹理
                //create a new texture
                this.texture = ss2d.Stage2D.gl.createTexture();

                ss2d.Stage2D.gl.bindTexture(ss2d.Stage2D.gl.TEXTURE_2D, this.texture);
                ss2d.Stage2D.gl.pixelStorei(ss2d.Stage2D.gl.UNPACK_FLIP_Y_WEBGL, 1);
                ss2d.Stage2D.gl.pixelStorei(ss2d.Stage2D.gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);

                ss2d.Stage2D.gl.texImage2D(ss2d.Stage2D.gl.TEXTURE_2D, 0, ss2d.Stage2D.gl.RGBA, ss2d.Stage2D.gl.RGBA, ss2d.Stage2D.gl.UNSIGNED_BYTE, image);

                ss2d.Stage2D.gl.texParameteri(ss2d.Stage2D.gl.TEXTURE_2D, ss2d.Stage2D.gl.TEXTURE_MAG_FILTER,xSampling);
                ss2d.Stage2D.gl.texParameteri(ss2d.Stage2D.gl.TEXTURE_2D, ss2d.Stage2D.gl.TEXTURE_MIN_FILTER,ySampling);

                ss2d.Stage2D.gl.texParameteri(ss2d.Stage2D.gl.TEXTURE_2D, ss2d.Stage2D.gl.TEXTURE_WRAP_S,xTile);
                ss2d.Stage2D.gl.texParameteri(ss2d.Stage2D.gl.TEXTURE_2D, ss2d.Stage2D.gl.TEXTURE_WRAP_T,yTile);

                //清空状态机里的纹理,这里只是清除引用而已,不是清除纹理,纹理我们已经经过状态机加工过了
                //only delete the ref
                ss2d.Stage2D.gl.bindTexture(ss2d.Stage2D.gl.TEXTURE_2D, null);
            },

            /**
             * 基于精灵创建纹理
             * <br />create texture based on sprites
             * @param image
             * @param xml
             * @param xTile
             * @param yTile
             * @param xSampling
             * @param ySampling
             */
            newSprite:function(image, xml,xTile,yTile,xSampling,ySampling)
            {
                this.regExpTail=new RegExp(/[a-z,0-9,_*]+[0-9]{4}/);
                this.regExpUnderline=new RegExp(/[A-Za-z0-9]*_[A-Za-z0-9]/);

                this.loadXml(xml);

                //申请一个纹理
                //create a new texture
                this.texture = ss2d.Stage2D.gl.createTexture();

                ss2d.Stage2D.gl.bindTexture(ss2d.Stage2D.gl.TEXTURE_2D, this.texture);
                ss2d.Stage2D.gl.pixelStorei(ss2d.Stage2D.gl.UNPACK_FLIP_Y_WEBGL, 1);
                ss2d.Stage2D.gl.pixelStorei(ss2d.Stage2D.gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);

                ss2d.Stage2D.gl.texImage2D(ss2d.Stage2D.gl.TEXTURE_2D, 0, ss2d.Stage2D.gl.RGBA, ss2d.Stage2D.gl.RGBA, ss2d.Stage2D.gl.UNSIGNED_BYTE, image);
                ss2d.Stage2D.gl.texParameteri(ss2d.Stage2D.gl.TEXTURE_2D, ss2d.Stage2D.gl.TEXTURE_MAG_FILTER,xSampling);
                ss2d.Stage2D.gl.texParameteri(ss2d.Stage2D.gl.TEXTURE_2D, ss2d.Stage2D.gl.TEXTURE_MIN_FILTER,ySampling);

                ss2d.Stage2D.gl.texParameteri(ss2d.Stage2D.gl.TEXTURE_2D, ss2d.Stage2D.gl.TEXTURE_WRAP_S,xTile);
                ss2d.Stage2D.gl.texParameteri(ss2d.Stage2D.gl.TEXTURE_2D, ss2d.Stage2D.gl.TEXTURE_WRAP_T,yTile);

                //清空状态机里的纹理,这里只是清除引用而已,不是清除纹理,纹理我们已经经过状态机加工过了
                //only delete the ref
                ss2d.Stage2D.gl.bindTexture(ss2d.Stage2D.gl.TEXTURE_2D, null);
            },


            /**
             * 创建空纹理
             * <br />create a null texture
             * @param width
             * @param height
             * @param xTile
             * @param yTile
             * @param xSampling
             * @param ySampling
             */
            newTexture:function(width,height,xTile,yTile,xSampling,ySampling)
            {
                //清空状态机里的纹理,这里只是清除引用而已,不是清除纹理,纹理我们已经经过状态机加工过了
                //only delete the ref
                this.texture = ss2d.Stage2D.gl.createTexture();
                ss2d.Stage2D.gl.bindTexture(ss2d.Stage2D.gl.TEXTURE_2D, this.texture);
                ss2d.Stage2D.gl.pixelStorei(ss2d.Stage2D.gl.UNPACK_FLIP_Y_WEBGL, 1);
                ss2d.Stage2D.gl.pixelStorei(ss2d.Stage2D.gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);

                ss2d.Stage2D.gl.texImage2D(ss2d.Stage2D.gl.TEXTURE_2D, 0,ss2d.Stage2D.gl.RGBA,width,height,0, ss2d.Stage2D.gl.RGBA, ss2d.Stage2D.gl.UNSIGNED_BYTE, null);

                ss2d.Stage2D.gl.texParameteri(ss2d.Stage2D.gl.TEXTURE_2D, ss2d.Stage2D.gl.TEXTURE_MAG_FILTER,xSampling);
                ss2d.Stage2D.gl.texParameteri(ss2d.Stage2D.gl.TEXTURE_2D, ss2d.Stage2D.gl.TEXTURE_MIN_FILTER,ySampling);

                ss2d.Stage2D.gl.texParameteri(ss2d.Stage2D.gl.TEXTURE_2D, ss2d.Stage2D.gl.TEXTURE_WRAP_S,xTile);
                ss2d.Stage2D.gl.texParameteri(ss2d.Stage2D.gl.TEXTURE_2D, ss2d.Stage2D.gl.TEXTURE_WRAP_T,yTile);

                //清空状态机里的纹理,这里只是清除引用而已,不是清除纹理,纹理我们已经经过状态机加工过了
                //only delete the ref
                ss2d.Stage2D.gl.bindTexture(ss2d.Stage2D.gl.TEXTURE_2D, null);

            },

            /**
             * 转换为帧缓存
             * <br />transform texture into buffer
             */
            transformTextureBuffer:function()
            {
                this.rttFramebuffer = ss2d.Stage2D.gl.createFramebuffer();
                ss2d.Stage2D.gl.bindFramebuffer(ss2d.Stage2D.gl.FRAMEBUFFER, this.rttFramebuffer);
                ss2d.Stage2D.gl.framebufferTexture2D(ss2d.Stage2D.gl.FRAMEBUFFER, ss2d.Stage2D.gl.COLOR_ATTACHMENT0, ss2d.Stage2D.gl.TEXTURE_2D,this.texture, 0);
                ss2d.Stage2D.gl.bindTexture(ss2d.Stage2D.gl.TEXTURE_2D, null);
                ss2d.Stage2D.gl.bindFramebuffer(ss2d.Stage2D.gl.FRAMEBUFFER, null);
            },


            ////////////////////////////////////////////////////////////////////////////
            //  public methods
            ////////////////////////////////////////////////////////////////////////////

            /**
             * 销毁纹理
             * <br />delete the textures
             */
            dispose:function()
            {
                ss2d.Stage2D.gl.deleteTexture(this.texture);
                this.texture=null;
            },

            /**
             * 读取XML
             * <br />load xml
             * @param xml
             */
            loadXml : function(xml)
            {
                this.quadResource = new ss2d.QuadResource();
                var name;
                var textureAtlas = xml.getElementsByTagName("SubTexture");
                var quadDataList=[];
                var quadFrameList=[];
                for (var i = 0; i< textureAtlas.length; i++)
                {
                    var subTexture = textureAtlas[i];
                    var regExpBool=this.regExpUnderline.test(subTexture.getAttribute("name"));

                   if(ss2d.xmlUnderline)
                   {
                       if(regExpBool)
                       {
                           this.regExpIndex=0;
                           if(name !=  subTexture.getAttribute("name").split("_")[0])
                           {
                               name = subTexture.getAttribute("name").split("_")[0];
                               quadFrameList=[];
                               var quadData = new ss2d.QuadData();
                               quadData.name = subTexture.getAttribute("name").split("_")[0];
                               quadData.quadFrameLst = quadFrameList;
                               quadDataList.push(quadData);
                               this.cacheframeWidth=0;
                               this.cacheframeHeight=0;
                               this.cacheWidth=0;
                               this.cacheHeight=0;
                               this.cacheFrameX=0;
                               this.cacheFrameY=0;
                           }

                       }else
                       {

                           var regExpBoolean=this.regExpTail.test(subTexture.getAttribute("name"));
                           if(regExpBoolean)
                           {
                               this.regExpIndex=1;
                               if(name!=subTexture.getAttribute("name").substr(0,subTexture.getAttribute("name").length-4))
                               {
                                   name=subTexture.getAttribute("name").substr(0,subTexture.getAttribute("name").length-4);
                                   quadFrameList=[];
                                   var quadData = new ss2d.QuadData();
                                   quadData.name=subTexture.getAttribute("name").substr(0,subTexture.getAttribute("name").length-4);
                                   quadData.quadFrameLst = quadFrameList;
                                   quadDataList.push(quadData);
                                   this.cacheframeWidth=0;
                                   this.cacheframeHeight=0;
                                   this.cacheWidth=0;
                                   this.cacheHeight=0;
                                   this.cacheFrameX=0;
                                   this.cacheFrameY=0;
                               }
                           }else
                           {
                               this.regExpIndex=2;
                               if(name!=subTexture.getAttribute("name"))
                               {
                                   name = subTexture.getAttribute("name");
                                   quadFrameList=[];
                                   var quadData = new ss2d.QuadData();
                                   quadData.name=subTexture.getAttribute("name");
                                   quadData.quadFrameLst = quadFrameList;
                                   quadDataList.push(quadData);
                                   this.cacheframeWidth=0;
                                   this.cacheframeHeight=0;
                                   this.cacheWidth=0;
                                   this.cacheHeight=0;
                                   this.cacheFrameX=0;
                                   this.cacheFrameY=0;
                               }
                           }

                       }
                   }else
                   {
                       var regExpBoolean=this.regExpTail.test(subTexture.getAttribute("name"));
                       if(regExpBoolean)
                       {
                           this.regExpIndex=1;
                           if(name!=subTexture.getAttribute("name").substr(0,subTexture.getAttribute("name").length-4))
                           {
                               name=subTexture.getAttribute("name").substr(0,subTexture.getAttribute("name").length-4);
                               quadFrameList=[];
                               var quadData = new ss2d.QuadData();
                               quadData.name=subTexture.getAttribute("name").substr(0,subTexture.getAttribute("name").length-4);
                               quadData.quadFrameLst = quadFrameList;
                               quadDataList.push(quadData);
                               this.cacheframeWidth=0;
                               this.cacheframeHeight=0;
                               this.cacheWidth=0;
                               this.cacheHeight=0;
                               this.cacheFrameX=0;
                               this.cacheFrameY=0;
                           }
                       }else
                       {
                           this.regExpIndex=2;
                           if(name!=subTexture.getAttribute("name"))
                           {
                               name = subTexture.getAttribute("name");
                               quadFrameList=[];
                               var quadData = new ss2d.QuadData();
                               quadData.name=subTexture.getAttribute("name");
                               quadData.quadFrameLst = quadFrameList;
                               quadDataList.push(quadData);
                               this.cacheframeWidth=0;
                               this.cacheframeHeight=0;
                               this.cacheWidth=0;
                               this.cacheHeight=0;
                               this.cacheFrameX=0;
                               this.cacheFrameY=0;
                           }
                       }


                   }



                    var quadFrame = new ss2d.QuadFrame();
                    quadFrame.name=subTexture.getAttribute("name");

                    var replace = subTexture.getAttribute("x");
                    if(replace != null) quadFrame.x = replace;

                    replace = subTexture.getAttribute("y");
                    if(replace != null) quadFrame.y = replace;

                    replace = subTexture.getAttribute("width");
                    if(replace != null)
                    {
                        quadFrame.width = replace;
                        this.cacheWidth = replace;
                    }

                    replace = subTexture.getAttribute("height");
                    if(replace != null)
                    {
                        quadFrame.height = replace;
                        this.cacheHeight = replace;
                    }

                    replace = subTexture.getAttribute("frameX");
                    if(replace != null)
                    {
                        quadFrame.frameX = subTexture.getAttribute("frameX");
                        this.cacheFrameX=quadFrame.frameX;

                    }
                    else
                    {

                        if(this.cacheFrameX!=0)
                        {
                            quadFrame.frameX=this.cacheFrameX;
                        }else
                        {
                            quadFrame.frameX = 0;
                        }
                    }

                    replace = subTexture.getAttribute("frameY");
                    if(replace != null)
                    {
                        quadFrame.frameY = replace;
                        this.cacheFrameY=quadFrame.frameY;
                    }
                    else
                    {
                        if(this.cacheFrameY!=0)
                        {
                            quadFrame.frameY=this.cacheFrameY;
                        }else
                        {
                            quadFrame.frameY = 0;
                        }

                    }

                    replace = subTexture.getAttribute("frameWidth");
                    if(replace != null)
                    {
                        quadFrame.frameWidth = replace;
                        this.cacheframeWidth = replace;
                    }
                    else
                    {
                        if(this.cacheframeWidth != 0)
                        {
                            quadFrame.frameWidth = this.cacheframeWidth;
                        }
                        else
                        {
                            quadFrame.frameWidth = this.cacheWidth;
                        }
                    }

                    replace = subTexture.getAttribute("frameHeight");
                    if(replace != null)
                    {
                        quadFrame.frameHeight = replace;
                        this.cacheframeHeight = replace;
                    }
                    else
                    {
                        if(this.cacheframeHeight != 0)
                        {
                            quadFrame.frameHeight = this.cacheframeHeight;
                        }
                        else
                        {
                            quadFrame.frameHeight = this.cacheHeight;

                        }
                    }

                    /*ss2d.log("Texture2D -> quadFrame:{" +
                        "name:" + quadFrame.name +
                        ", x:" + quadFrame.x +
                        ", y:" + quadFrame.y +
                        ", width:" + quadFrame.width +
                        ", height:" + quadFrame.height +
                        ", frameX:" + quadFrame.frameX +
                        ", frameY:" + quadFrame.frameY +
                        ", frameWidth:" + quadFrame.frameWidth +
                        ", frameHeight:" + quadFrame.frameHeight);*/


                    quadFrameList.push(quadFrame);
                }
                this.quadResource.quadDataList = quadDataList;
            }
        }
    );
})();