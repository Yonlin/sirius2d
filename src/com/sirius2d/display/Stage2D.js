/**
 * Stage2D.js
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
     * Stage2D 游戏的主场景类，只能存在一个，提供游戏的渲染架构支持。
     * <br /> 演示地址:http://sirius2d.com/demos/d_1/
     * @class
     */
    ss2d.Stage2D = Class
        (
            /** @lends ss2d.Stage2D.prototype */
            {
                Extends:ss2d.EventDispatcher,

                STATIC:
                /** @lends ss2d.Stage2D */
                {
                    instance : null,

                    /**
                     * 场景的宽度
                     * stage width
                     */
                    stageWidth : 640,

                    /**
                     * 场景的高度
                     * stage height
                     */
                    stageHeight : 480,

                    /**
                     * 鼠标X轴坐标
                     * mouse X
                     */
                    mouseX:0,

                    /**
                     * 鼠标Y轴坐标
                     * mouse Y
                     */
                    mouseY:0,

                    /**
                     * 场景的红色通道
                     * red channel
                     */
                    r:0.0,

                    /**
                     * 场景的绿色通道
                     * green channel
                     */
                    g:0.0,

                    /**
                     * 场景的蓝色通道
                     * blue channel
                     */
                    b:0.0,

                    /**
                     * 场景的透明度
                     * alpha channel
                     */
                    a:1.0,


                     //GL场景正交比例
                    ratio : 1,

                    /**
                     * 全局着色器
                     * global shader
                     */
                    shader : null,

                    /**
                     * 正交矩阵容器
                     * orthogonal matrix
                     */
                    ovMatrix : [0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0],

                    /**
                     * 画布
                     * canvas
                     */
                    canvas : null,

                    /**
                     * 设备上下文
                     * device context
                     */
                    context : null,

                    textCanvas:null,
                    textContext:null,

                    /**
                     * WEBGL句柄
                     * webgl hwnd
                     */
                    gl : null,

                    /**
                     * 帧缓存
                     * frame buffer
                     */
                    rttFramebuffer:null,

                    /**
                     * 纹理缓存
                     * texture buffer
                     */
                    rttTexture:null,

                    /**
                     * FPS统计
                     * fps data
                     */
                    fps:0,
                    fpsTime:0,

                    getTextCanvas:function()
                    {
                        if(ss2d.Stage2D.textCanvas==null)
                        {
                            ss2d.Stage2D.textCanvas=document.createElement("canvas");
                        }
                        return ss2d.Stage2D.textCanvas;
                    },

                    getTextContext:function()
                    {
                        if(ss2d.Stage2D.textContext==null)
                        {
                            ss2d.Stage2D.textContext=ss2d.Stage2D.getTextCanvas().getContext("2d");
                        }
                        return ss2d.Stage2D.textContext;
                    }
                },

                //////////////////////////////////////////////////////////////////////////
                //  public property
                //////////////////////////////////////////////////////////////////////////

                /**
                 * 显示对象列表
                 * list of display objects
                 * @type {Array}
                 */
                displayerlist : null,

                /**
                 * 缓存显示列表
                 * list of frame buffer
                 */
                frameBufflist:null,

                ////////////////////////////////////////////////////////////////////////////
                //  constructor
                ////////////////////////////////////////////////////////////////////////////

                initialize : function(canvasId, width, height)
                {
                    this.displayerlist=[];
                    this.frameBufflist=[];
                    ss2d.stage=this;
                    ss2d.Stage2D.instance = this;
                    ss2d.Stage2D.canvas = document.getElementById(canvasId);
                    if (ss2d.Stage2D.canvas == undefined)
                    {
                        ss2d.Stage2D.canvas = ss2d.canvas;
                    }
                    width = width || "auto";
                    height = height || "auto";
                    this.size(width, height);
                    //检测浏览器是否支持webgl
                    //check if the browser supports webgl
                    ss2d.Stage2D.gl = ss2d.WebGLUtil.setupWebGL(ss2d.Stage2D.canvas);
                    if (ss2d.Stage2D.gl == null)
                    {
                        alert("当前浏览器不支持webgl！");
                        return;
                    }
                    ss2d.Stage2D.gl.viewport(0, 0, ss2d.Stage2D.canvas.width, ss2d.Stage2D.canvas.height);
                    //ss2d.Stage2D.gl.depthFunc(ss2d.Stage2D.gl.LEQUAL);
                    ss2d.Stage2D.gl.enable(ss2d.Stage2D.gl.BLEND);
                    ss2d.Stage2D.gl.enable(ss2d.Stage2D.gl.SCISSOR_TEST);
                    ss2d.Stage2D.gl.disable(ss2d.Stage2D.gl.DEPTH_TEST);
                    ss2d.Stage2D.shader = new ss2d.ShaderGLSL();

                    ss2d[this.onMouseEventHandler] = this.onMouseEventHandler.bind(this);
                    ss2d[this.onDrawFrame] = this.onDrawFrame.bind(this);

                    ss2d.Stage2D.canvas.addEventListener('mousedown', ss2d[this.onMouseEventHandler], false);
                    ss2d.Stage2D.canvas.addEventListener('mouseup', ss2d[this.onMouseEventHandler], false);
                    ss2d.Stage2D.canvas.addEventListener('mousemove', ss2d[this.onMouseEventHandler], false);
                    ss2d.Stage2D.canvas.addEventListener('touchstart', ss2d[this.onMouseEventHandler], false);
                    ss2d.Stage2D.canvas.addEventListener('touchend', ss2d[this.onMouseEventHandler], false);
                    ss2d.Stage2D.canvas.addEventListener('touchmove', ss2d[this.onMouseEventHandler], false);

                    this.onDrawFrame();
                },

                ////////////////////////////////////////////////////////////////////////////
                //  public methods
                ////////////////////////////////////////////////////////////////////////////

                /**
                 * 添加新的显示对象
                 * add display object
                 * @param child 子显示对象
                 */
                addChild : function(child)
                {
                    //var index = this.displayerlist.indexOf(child);
                    //if(index > -1) this.displayerlist.splice(index,1);
                    child.stage = this;
                    this.displayerlist.push(child);
                },

                /**
                 * 移除显示对象
                 * remove display object
                 * @param child
                 */
                removeChild : function(child)
                {
                    var index = this.displayerlist.indexOf(child);
                    if(index > -1)
                    {
                        child.stage = null;
                        this.displayerlist.splice(index, 1);
                    }
                },

                size : function (width, height)
                {
                    if (typeof width == "string" && width == "auto")
                    {
                        width = window.screen.availWidth;
                        //width = document.body.clientWidth;
                    }
                    if (typeof height == "string" && height == "auto")
                    {
                        height = window.screen.availHeight;
                        //height = document.body.clientHeight;
                    }
                    ss2d.Stage2D.canvas.style.width = width + "px";
                    ss2d.Stage2D.canvas.style.height = height + "px";
                    ss2d.Stage2D.stageWidth = ss2d.Stage2D.canvas.width = width;
                    ss2d.Stage2D.stageHeight = ss2d.Stage2D.canvas.height = height;
                    ss2d.Stage2D.ratio = width / height;
                },

                /**
                 * 添加帧缓存
                 * add frame buffer
                 * @param value
                 */
                addFrameBuffer:function(value)
                {
                    this.frameBufflist.push(value);
                },

                /**
                 * 重绘画布
                 * redraw the canvas
                 */
                onDrawFrame : function()
                {
                    ss2d.Stage2D.fps=parseInt(1000.0/(new Date().getTime()-ss2d.Stage2D.fpsTime));
                    ss2d.Stage2D.fpsTime=new Date().getTime();
                    this.dispatchEvent(ss2d.Event.ENTER_FRAME);

                    if(this.frameBufflist.length!=0)
                    {
                        ss2d.Stage2D.gl.clear(ss2d.Stage2D.gl.COLOR_BUFFER_BIT);
                        //设置画布颜色为黑色
                        //set the background color to black
                        ss2d.Stage2D.gl.clearColor(ss2d.Stage2D.r,ss2d.Stage2D.g,ss2d.Stage2D.b,ss2d.Stage2D.a);

                        for(var f=0;f<this.frameBufflist.length;f++)
                        {
                            ss2d.Stage2D.gl.bindFramebuffer(ss2d.Stage2D.gl.FRAMEBUFFER,this.frameBufflist[f]._frameBuff.getTexture().rttFramebuffer);
                            if(this.frameBufflist[f]._clear)
                            {
                                ss2d.Stage2D.gl.clear(ss2d.Stage2D.gl.COLOR_BUFFER_BIT);
                                ss2d.Stage2D.gl.clearColor(ss2d.Stage2D.r,ss2d.Stage2D.g,ss2d.Stage2D.b,ss2d.Stage2D.a);
                            }
                            this.frameBufflist[f].paint();
                            ss2d.Stage2D.gl.bindFramebuffer(ss2d.Stage2D.gl.FRAMEBUFFER, null);
                        }
                    }

                    ss2d.Stage2D.gl.clear(ss2d.Stage2D.gl.COLOR_BUFFER_BIT);
                    //设置画布颜色为黑色
                    //set the background color to black
                    ss2d.Stage2D.gl.clearColor(ss2d.Stage2D.r,ss2d.Stage2D.g,ss2d.Stage2D.b,ss2d.Stage2D.a);

                    for(var i=0;i < this.displayerlist.length;i++)
                    {
                        var scene = this.displayerlist[i];
                        scene.dispatchEvent(ss2d.Event.ENTER_FRAME);
                        scene.paint();
                    }
                    window.requestAnimFrame(ss2d[this.onDrawFrame]);
                },

                getSceneForemostQuadUnderPoint:function(scene, x, y)
                {
                    var foremostQuad = null;
                    var quads = scene.getQuadsUnderPoint(x, y);

                    if (quads)
                    {
                        var min = {index:quads.length - 1, id:0};
                        for(var j = 0; j < quads.length; j++)
                        {
                            if (quads[j].id > min.id)
                            {
                                min.id = quads[j].id;
                                min.index = j;
                            }
                        }

                        foremostQuad = quads[min.index];

                    }
                    return foremostQuad;
                },


                onMouseEventHandler : function(e)
                {
                    var type = null;
                    var hitObj = null;
                    ss2d.log("点击",hitObj)
                    switch (e.type)
                    {
                        case "mousedown":
                        case "touchstart":
                            type = ss2d.MouseEvent.MOUSE_DOWN;
                            break;
                        case "mouseup":
                        case "touchend":
                            type = ss2d.MouseEvent.MOUSE_UP;
                            break;
                        case "mousemove":
                        case "touchmove":
                            type = ss2d.MouseEvent.MOUSE_MOVE;
                            break;
                    }

                    var pos = ss2d.getElementOffset(ss2d.Stage2D.canvas);
                    var tx = e.pageX;
                    var ty = e.pageY;
                    if (e["touches"])
                    {
                        tx = e["touches"][0].clientX;
                        ty = e["touches"][0].clientY;
                    }

                    ss2d.Stage2D.mouseX = (tx - pos.left);
                    ss2d.Stage2D.mouseY = (ty - pos.top);

                    var evt = new ss2d.MouseEvent(type, false, false, ss2d.Stage2D.mouseX, ss2d.Stage2D.mouseY);

                    for(var i=this.displayerlist.length-1;i>=0;i--)
                    {
                        var scene = this.displayerlist[i];
                        //是否开启鼠标事件
                        //check if the mouse event is enabled
                        if (scene.mouseEnabled == false) continue;

                        hitObj = this.getSceneForemostQuadUnderPoint(scene, ss2d.Stage2D.mouseX, ss2d.Stage2D.mouseY);
                        if (hitObj)
                        {
                            scene.dispatchEvent(evt, hitObj);
                            hitObj.dispatchEvent(evt);
                            break;
                        }
                    }

                    this.dispatchEvent(evt, hitObj);

                    e.stopPropagation();
                    e.preventDefault();
                }
            }
        );
})();