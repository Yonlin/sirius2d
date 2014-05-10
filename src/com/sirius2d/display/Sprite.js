/**
 * Sprite.js
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
     * Sprite  显示容器类，只能用于嵌套MovieClip,Sprite可以互相嵌套。
     * <br />演示地址:http://sirius2d.com/demos/d_4/
     * @class
     */
    ss2d.Sprite = Class
    (
        /** @lends ss2d.Sprite.prototype */
        {
            Extends:ss2d.Scene,
            m_width : 1,
            m_height : 1,
            m_scaleX : 1,
            m_scaleY : 1,
            m_skewX : 0,
            m_skewY : 0,
            m_pivotX : 0,
            m_pivotY : 0,
            m_rotation : 0,
            m_visible : true,
            m_parent : null,
            m_mouseEnabled : false,
            m_userData : null,
            m_center:false,
            m_forceCenter:false,
            m_quad:null,
            m_displayerlist:null,
            group:null,
            initialize : function()
            {
                this.init();
            },

            init:function()
            {
                this.m_displayerlist=[];
                this.group=new ss2d.Group();
            },

            /**
             * 销毁所有元素
             * dispose
             */
            dispose : function()
            {
                this.group.dispose();
                for(var i=0;i<this.m_displayerlist.length;i++)
                {
                    this.removeChild(this.m_displayerlist[i]);
                    this.m_displayerlist[i]=null;
                }
                this.m_displayerlist=null;
            },

            /**
             * 添加显示对象
             * add display object
             * @param child
             */
            addChild:function(child)
            {
                if(child instanceof ss2d.Sprite)
                {
                    this.m_displayerlist.push(child);
                    child.group.setParentGroup(this.group);
                    child.setParent(this);
                }else if(child instanceof ss2d.MovieClip)
                {
                    this.m_displayerlist.push(child);
                    this.group.addChild(child.m_quad);
                }

            },

            /**
             * 移除显示对象
             * remove display object
             * @param child
             */
            removeChild:function(child)
            {
                this.m_displayerlist.splice(this.m_displayerlist.indexOf(child),1);
                child.group.clearParentGroup();
                child.setParent(null);
            },

            /**
             * 重绘
             * paint
             */
            paint : function()
            {
                for(var i=0;i < this.m_displayerlist.length;i++)
                {
                    var scene = this.m_displayerlist[i];
                    scene.dispatchEvent(ss2d.Event.ENTER_FRAME);
                    scene.paint();
                }
            },

            getQuadsUnderPoint : function(x, y)
            {
                var quads = null;
                for(var i = this.m_displayerlist.length - 1;i >= 0; i--)
                {

                        quads=this.m_displayerlist[i].getQuadsUnderPoint(x,y);
                        if(quads!=null)
                        {
                            return quads;
                        }

                }
                return quads;
            },


            /**
             * 获取对象的X轴位置
             * get X
             * @returns {ss2d.Group._x|*|ss2d.Transform._x|ss2d.DisplayObject._x|number|ss2d.MovieClip._x}
             */
            getX : function() {  return this.group._x;},

            /**
             * 设置对象的X轴位置
             * set X
             * @param value
             */
            setX : function(value){ this.group._x = value; this.group.isRedraw = true; },

            /**
             * 获取对象的Y轴位置
             * get Y
             * @returns {ss2d.Group._y|*|ss2d.Transform._y|ss2d.DisplayObject._y|number|ss2d.MovieClip._y}
             */
            getY : function() {  return this.group._y;},

            /**
             * 设置对象Y轴位置
             * set Y
             * @param value
             */
            setY : function(value){ this.group._y = value; this.group.isRedraw = true; },

            /**
             * 获取对象宽度
             * get width
             * @returns {number|ss2d.File._width|ss2d.DisplayObject._width|ss2d.MovieClip._width|_width|*}
             */
            getWidth : function() {  return this.group.m_width;},

            /**
             * 设置对象宽度
             * set width
             * @param value
             */
            setWidth : function(value){ this.group.m_width = value; this.group.isRedraw = true;},

            /**
             * 获取对象高度
             * get height
             * @returns {number|ss2d.File._height|ss2d.DisplayObject._height|ss2d.MovieClip._height|_height|*}
             */
            getHeight : function() {  return this.group.m_height;},

            /**
             * 设置对象的高度
             * set height
             * @param value
             */
            setHeight : function(value){ this.group.m_height = value; this.group.isRedraw = true; },

            /**
             * 获取对象的X轴比例
             * get scale X
             * @returns {number|ss2d.Group._scaleX|ss2d.Transform._scaleX|ss2d.DisplayObject._scaleX|_scaleX|*}
             */
            getScaleX : function() {  return this.group.m_scaleX;},

            /**
             * 设置对象的X轴比例
             * set scale X
             * @param value
             */
            setScaleX : function(value){ this.group.m_scaleX = value; this.group.isRedraw = true; },

            /**
             * 获取对象的Y轴比例
             * get scale Y
             * @returns {number|ss2d.Group._scaleY|ss2d.Transform._scaleY|ss2d.DisplayObject._scaleY|_scaleY|*}
             */
            getScaleY : function() {  return this.group.m_scaleY;},

            /**
             * 设置对象的Y轴比例
             * set scale Y
             * @param value
             */
            setScaleY : function(value){ this.group.m_scaleY = value; this.group.isRedraw = true; },

            /**
             * 获取对象的X轴倾斜值
             * get skew X
             * @returns {number|ss2d.Group._skewX|ss2d.DisplayObject._skewX|_skewX|*}
             */
            getSkewX : function() {  return this.group.m_skewX;},

            /**
             * 设置对象的X轴倾斜值
             * set skew X
             * @param value
             */
            setSkewX : function(value){ this.group.m_skewX = value; this.group.isRedraw = true; },

            /**
             * 获取对象的Y轴倾斜值
             * get skew Y
             * @returns {number|ss2d.Group._skewY|ss2d.DisplayObject._skewY|_skewY|*}
             */
            getSkewY : function() {  return this.group.m_skewY;},

            /**
             * 设置对象的Y轴倾斜值
             * set skew Y
             * @param value
             */
            setSkewY : function(value){ this.group.m_skewY = value; this.group.isRedraw = true; },

            /**
             * 获取对象的角度
             * get angle
             * @returns {number|ss2d.Group._rotation|ss2d.DisplayObject._rotation|_rotation|*}
             */
            getRotation : function() {  return this.group.m_rotation;},

            /**
             * 设置对象的角度
             * set angle
             * @param value
             */
            setRotation : function(value){ this.group.m_rotation = value; this.group.isRedraw = true; },

            /**
             * 获取对象的可见性
             * get visibility
             * @returns {boolean}
             */
            getVisible : function() {  return this.m_visible;},

            /**
             * 设置对象的可见性
             * set visibility
             * @param value
             */
            setVisible : function(value){ this.m_visible = value;},

            /**
             * 获取对象的上级
             * get parent
             * @returns {null}
             */
            getParent : function() {  return this.m_parent;},

            /**
             * 设置对象的上级
             * set parent
             * @param value
             */
            setParent : function(value){ this.m_parent = value; },

            /**
             * 获取对象的鼠标监测状态
             * get a boolean value that indicates whether the mouse event is listened
             * @returns {boolean}
             */
            getMouseEnabled : function() {  return this.m_mouseEnabled;},

            /**
             * 设置对象的鼠标监测状态
             * set a boolean value that indicates whether the mouse event is listened
             * @param value
             */
            setMouseEnabled : function(value){ this.m_mouseEnabled = value; },

            /**
             * 存储用户数据
             * get user data
             * @returns {null}
             */
            getUserData : function() {  return this.m_userData;},

            /**
             * 设置用户零时数据
             * set user data
             * @param value
             */
            setUserData : function(value){ this.m_userData = value; }

        }
    );
})();