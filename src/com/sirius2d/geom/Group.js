/**
 * Group.js
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
     * Group 群组类，用于实现Quad的嵌套操作，批量运动，骨骼运动等等
     * <br />演示地址：http://sirius2d.com/demos/d_18/
     * @class
     */
    ss2d.Group = Class
    (
        /** @lends ss2d.Group.prototype */
        {
            //////////////////////////////////////////////////////////////////////////
            //  Extends
            //////////////////////////////////////////////////////////////////////////

            Extends:ss2d.EventDispatcher,

            //////////////////////////////////////////////////////////////////////////
            //  public property
            //////////////////////////////////////////////////////////////////////////
            _x : 0,
            _y : 0,
            m_scaleX : 1,
            m_scaleY : 1,
            m_skewX : 0,
            m_skewY : 0,
            m_parent : null,

            //////////////////////////////////////////////////////////////////////////
            //  public property
            //////////////////////////////////////////////////////////////////////////

            m_rotation : 0,

             //父群组
            parentGroup:null,

            //子群组
            childGroup:null,

            //组的矩阵
            matrix2D:null,

            //组的矩阵数据
            rawData:null,

            //////////////////////////////////////////////////////////////////////////
            //  public property
            //////////////////////////////////////////////////////////////////////////

            /**
             * @private
             */
            _quadList:null,

            ////////////////////////////////////////////////////////////////////////////
            //  constructor
            ////////////////////////////////////////////////////////////////////////////


            initialize : function()
            {
                this.rawData = new Float32Array(8);
                this.matrix2D = new ss2d.Matrix2D();
                this._quadList = [];
                ss2d[this.upData] = this.upData.bind(this);
                ss2d.stage.addEventListener(ss2d.Event.ENTER_FRAME, ss2d[this.upData]);
            },

            ////////////////////////////////////////////////////////////////////////////
            //  public methods
            ////////////////////////////////////////////////////////////////////////////

            /**
             * 清理组
             */
            clearParentGroup:function()
            {
                this.parentGroup.childGroup=null;
                this.parentGroup=null;
            },

            /**
             * 是否包含指定的子群
             * @param childGroup
             * @returns {boolean}
             */
            containsGroup:function(childGroup)
            {
                while (childGroup)
                {
                    if (childGroup == this) return true;
                    else childGroup = childGroup.parentGroup;
                }
                return false;
            },

            /**
             * 添加显示对象
             * @param value
             */
            addChild:function(value)
            {
                value.setTransform(this.matrix2D);
                this._quadList.push(value);
                ss2d[this.upData]();
            },

            /**
             * 删除显示对象
             * @param value
             */
            removeChild:function(value)
            {
                var index=this._quadList.indexOf(value);
                if(index!=-1)
                this._quadList.splice(index,1);
            },

            upRedraw:function()
            {
                this.isRedraw=true;
            },

            upData:function()
            {
                //if(this._isRedraw)
                {
                    //this._isRedraw=false;
                    this.matrix2D.upDateMatrix(this.m_rotation,
                        (this._x)*1*2/ss2d.Stage2D.stageHeight,
                        (this._y)*1*2/ss2d.Stage2D.stageHeight,
                        this.m_scaleX,
                        this.m_scaleY,
                        this.m_skewX,
                        this.m_skewY);
                    if(this.parentGroup!=null)
                    {
                        this.matrix2D.rawData=this.parentGroup.matrix2D.add3x3(this.matrix2D.rawData,this.parentGroup.matrix2D.rawData);
                    }

                    for(var i=0;i<this._quadList.length;i++)
                    {
                        this._quadList[i].isRedraw=true;
                    }

                    if(this.childGroup!=null)
                    {
                        this.childGroup.upRedraw();
                    }
                }
            },

            /**
             * 销毁组
             */
            dispose : function()
            {
                ss2d.stage.removeEventListener(ss2d.Event.ENTER_FRAME, ss2d[this.upData]);
                ss2d[this.upData] = null;

                for(var i=0; i < this._quadList.length; i++)
                {
                    this.removeChild(this._quadList[i]);
                    //Group不负责显示层的销毁,quad由Scene负责统一销毁
                    //this._quadList[i].dispose();
                }
                this._quadList = null;
                this.m_parent = null;
                this.parentGroup = null;
                this.childGroup = null;
                this.matrix2D = null;
                this.rawData = null;
            },

            ////////////////////////////////////////////////////////////////////////////
            //  Additional getters and setters
            ////////////////////////////////////////////////////////////////////////////

            /**
             * 获取组的X轴位置
             * @returns {number}
             */
            getX : function() {  return this._x;},

            /**
             * 设置组的X轴位置
             * @param value
             */
            setX : function(value){ this._x = value;},

            /**
             * 获取组的Y轴位置
             * @returns {number}
             */
            getY : function() {  return this._y;},

            /**
             * 设置组的Y轴位置
             * @param value
             */
            setY : function(value){ this._y = value;},

            /**
             * 获取组的X轴比例
             * @returns {number}
             */
            getScaleX : function() {  return this.m_scaleX;},

            /**
             * 设置组的X轴比例
             * @param value
             */
            setScaleX : function(value){ this.m_scaleX = value;},

            /**
             * 获取组的Y轴比例
             * @returns {number}
             */
            getScaleY : function() {  return this.m_scaleY;},

            /**
             * 设置组的Y轴比例
             * @param value
             */
            setScaleY : function(value){ this.m_scaleY = value;},

            /**
             * 获取组的X轴倾斜值
             * @returns {number}
             */
            getSkewX : function() {  return this.m_skewX;},

            /**
             * 设置组的X轴倾斜值
             * @param value
             */
            setSkewX : function(value){ this.m_skewX = value;},

            /**
             * 获取组的Y轴倾斜值
             * @returns {number}
             */
            getSkewY : function() {  return this.m_skewY;},

            /**
             * 设置组的Y轴倾斜值
             * @param value
             */
            setSkewY : function(value){ this.m_skewY = value;},

            /**
             * 获取组的角度
             * @returns {number}
             */
            getRotation : function() {  return this.m_rotation;},

            /**
             * 设置组的角度
             * @param value
             */
            setRotation : function(value){ this.m_rotation = value;},


            /**
             * 添加组
             * @param value
             */
            setParentGroup:function(value)
            {
                this.parentGroup=value;
                this.parentGroup.childGroup=this;
                ss2d[this.upData]();
            }

        }
    );
})();