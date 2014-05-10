/**
 * DisplayObject.js
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
     * DisplayObject 最底层的显示对象基类。
     * @class
     */
    ss2d.DisplayObject = Class
    (
        /** @lends ss2d.DisplayObject.prototype */
        {
            Extends:ss2d.EventDispatcher,
            x : 0,
            y : 0,
            m_rotation : 0,
            m_alpha : 1,
            m_visible : true,
            isRedraw : true,
            m_parent : null,
            m_mouseEnabled : false,
            m_userData : null,
            m_center:false,
            m_forceCenter:false,
            m_r : 1,
            m_g : 1,
            m_b : 1,
            m_a : 1,
            m_width : 1,
            m_height : 1,
            m_scaleX : 1,
            m_scaleY : 1,
            m_skewX : 0,
            m_skewY : 0,
            m_pivotX : 0,
            m_pivotY : 0,

            /**
             * 使用GPU实现位移功能
             * <br /> implement displacement with GPU
             */
            GPUX:0.0,

            /**
             * 使用GPU实现位移功能
             * <br /> implement displacement with GPU
             */
            GPUY:0.0,

            /**
             * 是否开启GPU加速 true:开启   false:不开启
             * <br />implement displacement with GPU or CPU
             * true: GPU    false:CPU
             */
            GPU:false,

            initialize : function()
            {

            },

            /**
             * 设置对象的颜色值
             * <br /> set RGB of the object
             * @returns {*}
             */
           getColor : function(){ return ss2d.ColorUtil.RGBToHex({
                r:this.m_r * 255,
                g:this.m_g * 255,
                b:this.m_b * 255});
            },

            /**
             * 获取对象的颜色值
             * <br />get RGB of the object
             * @param value
             */
            setColor : function(value)
            {
                var rgb = ss2d.ColorUtil.hexToRGB(value);
                this.setR(rgb.r / 255);
                this.setB(rgb.b / 255);
                this.setG(rgb.g / 255);
            },

            /**
             * 获取对象的红色通道值
             * <br />get red channel of the object
             * @returns {number}
             */
            getR : function() {  return this.m_r;},

            /**
             * 设置对象的红色通道值
             * <br />set red channel of the object
             * @param value
             */
            setR : function(value){ this.m_r = value; this.isRedraw = true; },

            /**
             * 获取对象的绿色通道值
             * <br />get green channel of the object
             * @returns {number}
             */
            getG : function() {  return this.m_g;},

            /**
             * 设置对象的绿色通道值
             * <br />set green channel of the object
             * @param value
             */
            setG : function(value){ this.m_g = value; this.isRedraw = true; },

            /**
             * 获取对象的蓝色通道值
             * <br />get blue channel of the object
             * @returns {number}
             */
            getB : function() {  return this.m_b;},

            /**
             * 设置对象的蓝色通道值
             * <br />set blue channel of the object
             * @param value
             */
            setB : function(value){ this.m_b = value; this.isRedraw = true; },

            /**
             * 获取对象像素透明度
             * <br />get alpha channel of the object
             * @returns {number}
             */
            getA : function() {  return this.m_a;},

            /**
             * 设置对象的像素透明度
             * <br />set alpha channel of the object
             * @param value
             */
            setA : function(value){ this.m_a = value; this.isRedraw = true; },

            /**
             * 设置对象的X轴位置
             * <br />get X of the object
             * @returns {number}
             */
            getX : function() {  return this.x;},

            /**
             * 获取对象的X轴位置
             * <br />set X of the object
             * @param value
             */
            setX : function(value){ this.x = value; this.isRedraw = true; },

            /**
             * 获取对象的Y轴位置
             * <br />get Y of the object
             * @returns {number}
             */
            getY : function() {  return this.y;},

            /**
             * 设置对象的Y轴位置
             * <br />set Y of the object
             * @param value
             */
            setY : function(value){ this.y = value; this.isRedraw = true; },

            /**
             * 获取对象的宽度
             * <br />get width of the object
             * @returns {number}
             */
            getWidth : function() {  return this.m_width;},

            /**
             * 设置对象的宽度
             * <br />set width of the object
             * @param value
             */
            setWidth : function(value){ this.m_width = value; this.isRedraw = true;},

            /**
             * 获取对象的高度
             * <br />get height of the object
             * @returns {number}
             */
            getHeight : function() {  return this.m_height;},

            /**
             * 设置对象的高度
             * <br />set height of the object
             * @param value
             */
            setHeight : function(value){ this.m_height = value; this.isRedraw = true; },

            /**
             * 获取对象的X轴比例
             * <br />get scale X of the object
             * @returns {number}
             */
            getScaleX : function() {  return this.m_scaleX;},

            /**
             * 设置对象的X轴比例
             * <br />set scale X of the object
             * @param value
             */
            setScaleX : function(value){ this.m_scaleX = value; this.isRedraw = true; },

            /**
             * 获取对象的Y轴比例
             * <br />get scale Y of the object
             * @returns {number}
             */
            getScaleY : function() {  return this.m_scaleY;},

            /**
             * 设置对象的Y轴比例
             * <br />set scale Y of the object
             * @param value
             */
            setScaleY : function(value){ this.m_scaleY = value; this.isRedraw = true; },

            /**
             * 获取对象的X轴倾斜值
             * <br />get skew X of the object
             * @returns {number}
             */
            getSkewX : function() {  return this.m_skewX;},

            /**
             * 设置对象的X轴倾斜值
             * <br />set skew X of the object
             * @param value
             */
            setSkewX : function(value){ this.m_skewX = value; this.isRedraw = true; },

            /**
             * 获取对象的Y轴倾斜值
             * <br />get skew Y of the object
             * @returns {number}
             */
            getSkewY : function() {  return this.m_skewY;},

            /**
             * 设置对象的Y轴倾斜值
             * <br />set skew Y of the object
             * @param value
             */
            setSkewY : function(value){ this.m_skewY = value; this.isRedraw = true; },

            /**
             * 获取对象的X轴偏移位置
             * <br />get pivot X of the object
             * @returns {number}
             */
            getPivotX : function() {  return this.m_pivotX;},

            /**
             * 设置对象的X轴偏移位置
             * <br />set pivot X of the object
             * @param value
             */
            setPivotX : function(value){ this.m_pivotX = value; this.isRedraw = true; },

            /**
             * 获取对象的Y轴偏移量
             * <br />get pivot Y of the object
             * @returns {number}
             */
            getPivotY : function() {  return this.m_pivotY;},

            /**
             * 设置对象的Y轴偏移量
             * <br />set pivot Y of the object
             * @param value
             */
            setPivotY : function(value){ this.m_pivotY = value; this.isRedraw = true; },

            /**
             * 获取对象的角度
             * <br />get angle of the object
             * @returns {number}
             */
            getRotation : function() {  return this.m_rotation;},

            /**
             * 设置对象的角度
             * <br />set angle of the object
             * @param value
             */
            setRotation : function(value){ this.m_rotation = value; this.isRedraw = true; },

            /**
             * 获取对象的透明度 ( RGBA*透明度 )
             * <br />get alpha of the object ( RGBA*alpha )
             * @returns {number}
             */
            getAlpha : function() {  return this.m_alpha;},

            /**
             * 设置对象的透明度 ( RGBA*透明度 )
             * <br />set alpha of the object ( RGBA*alpha )
             * @param value
             */
            setAlpha : function(value){ this.m_alpha = value; this.isRedraw = true; },

            /**
             * 获取对象的可见性
             * <br />get visibility of the object
             * @returns {boolean}
             */
            getVisible : function() {  return this.m_visible;},

            /**
             * 设置对象的可见性
             * <br />set visibility of the object
             * @param value
             */
            setVisible : function(value){ this.m_visible = value; this.isRedraw = true; },

            /**
             * 获取对象的刷新状态
             * <br />get a boolean value that indicates whether the object is redrawn
             * @returns {boolean}
             */
            getIsRedraw : function() {  return this.isRedraw;},

            /**
             * 设置对象的刷新状态
             * <br />set a boolean value that indicates whether the object is redrawn
             * @param value
             */
            setIsRedraw : function(value){ this.isRedraw = value; },

            /**
             * 访问对象上级对象
             * <br />get the parent of the object
             * @returns {null}
             */
            getParent : function() {  return this.m_parent;},

            /**
             * 设置对象上级对象
             * <br />set the parent of the object
             * @param value
             */
            setParent : function(value){ this.m_parent = value; },

            /**
             * 获取鼠标监测状态
             * <br />get a boolean value that indicates whether the mouse event is listened
             * @returns {boolean}
             */
            getMouseEnabled : function() {  return this.m_mouseEnabled;},

            /**
             * 设置鼠标监测状态
             * <br />set a boolean value that indicates whether the mouse event is listened
             * @param value
             */
            setMouseEnabled : function(value){ this.m_mouseEnabled = value; },

            /**
             * 获取用户数据
             * <br />get the user data
             * @returns {null}
             */
            getUserData : function() {  return this.m_userData;},

            /**
             * 设置用户数据
             * <br />set the user data
             * @param value
             */
            setUserData : function(value){ this.m_userData = value; },

            /**
             * 获取对象中心对齐状态
             * <br />get a boolean value that indicates whether the object is aligned center
             * @returns {boolean}
             */
            getCenter : function() {  return this.m_center;},

            /**
             * 设置对象中心对齐状态
             * <br />set a boolean value that indicates whether the object is aligned center
             * @param value
             */
            setCenter : function(value){ this.m_center = value; },

            /**
             * 获取对象强制中心对齐状态 (无视动画偏移量的影响)
             * <br />get a boolean value that indicates whether the object is aligned center (ignore the offsets of animations)
             * @returns {boolean}
             */
            getForceCenter : function() {  return this.m_forceCenter;},

            /**
             * 设置对象强制中心对齐状态 (无视动画偏移量的影响)
             * <br />set a boolean value that indicates whether the object is aligned center (ignore the offsets of animations)
             * @param value
             */
            setForceCenter : function(value){ this.m_forceCenter = value; },

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
            }
        }
    );
})();