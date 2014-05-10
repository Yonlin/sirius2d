/**
 * QuadMatrixUtil.js
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
     * quad的工具类，主要用来计算quad内部矩阵的计算
     */
    ss2d.QuadMatrixUtil = Class
    (
        {
            //////////////////////////////////////////////////////////////////////////
            //  private property
            //////////////////////////////////////////////////////////////////////////

            /**
             *
             * @type {ss2d.Matrix2D}
             * @private
             */
            matrix2D : null,

            /**
             *
             * @type {number}
             * @private
             */
            m_x : 0,

            /**
             *
             * @type {number}
             * @private
             */
            m_y : 0,

            /**
             *
             * @type {number}
             * @private
             */
            m_rotation : 0,

            /**
             *
             * @type {number}
             * @private
             */
            m_scaleX : 1,

            /**
             *
             * @type {number}
             * @private
             */
            m_scaleY : 1,

            /**
             *
             * @type {number}
             * @private
             */
            m_skewX : 0,

            /**
             *
             * @type {number}
             * @private
             */
            m_skewY : 0,

            /**
             *
             * @type {number}
             * @private
             */
            m_pivotX : 0,

            /**
             *
             * @type {number}
             * @private
             */
            m_pivotY : 0,

            //////////////////////////////////////////////////////////////////////////
            //  public property
            //////////////////////////////////////////////////////////////////////////

            /**
             * 记录当前面板中有多少个点对象
             * @type {number}
             */
            ids : 0,




            /**
             * 元素列表
             * @type {Array}
             */
            itemList : null,


            /**
             * 元素信息列表
             * @type {Array}
             */
            itemDataList : null,

            /**
             * 原始元素信息列表
             * @type {Array}
             */
            itemDataAgencyList : null,

            ////////////////////////////////////////////////////////////////////////////
            //  constructor
            ////////////////////////////////////////////////////////////////////////////

            initialize : function()
            {
                this.matrix2D = new ss2d.Matrix2D();
                this.itemList = [];
                this.itemDataList = [];
                this.itemDataAgencyList = [];

                /*if (Object.defineProperty)
                {
                    Object.defineProperty(this, "x",
                        {
                            get: this._get_x,
                            set: this._set_x
                        });

                    Object.defineProperty(this, "y",
                        {
                            get: this._get_y,
                            set: this._set_y
                        });
                    Object.defineProperty(this, "scaleX",
                        {
                            get: this._get_scaleX,
                            set: this._set_scaleX
                        });

                    Object.defineProperty(this, "scaleY",
                        {
                            get: this._get_scaleY,
                            set: this._set_scaleY
                        });

                    Object.defineProperty(this, "skewX",
                        {
                            get: this._get_skewX,
                            set: this._set_skewX
                        });

                    Object.defineProperty(this, "skewY",
                        {
                            get: this._get_skewY,
                            set: this._set_skewY
                        });

                    Object.defineProperty(this, "pivotX",
                        {
                            get: this._get_pivotX,
                            set: this._set_pivotX
                        });

                    Object.defineProperty(this, "pivotY",
                        {
                            get: this._get_pivotY,
                            set: this._set_pivotY
                        });

                    Object.defineProperty(this, "rotation",
                        {
                            get: this._get_rotation,
                            set: this._set_rotation
                        });

                    Object.defineProperty(this, "matrix2D",
                        {
                            get: this._get_matrix2D,
                            set: this._set_matrix2D
                        });
                }
                else if (this.__defineGetter__)
                {
                    this.__defineGetter__("x", this._get_x);
                    this.__defineSetter__("x", this._set_x);

                    this.__defineGetter__("y", this._get_y);
                    this.__defineSetter__("y", this._set_y);

                    this.__defineGetter__("scaleX", this._get_scaleX);
                    this.__defineSetter__("scaleX", this._set_scaleX);

                    this.__defineGetter__("scaleY", this._get_scaleY);
                    this.__defineSetter__("scaleY", this._set_scaleY);

                    this.__defineGetter__("skewX", this._get_skewX);
                    this.__defineSetter__("skewX", this._set_skewX);

                    this.__defineGetter__("skewY", this._get_skewY);
                    this.__defineSetter__("skewY", this._set_skewY);

                    this.__defineGetter__("pivotX", this._get_pivotX);
                    this.__defineSetter__("pivotX", this._set_pivotX);

                    this.__defineGetter__("pivotY", this._get_pivotY);
                    this.__defineSetter__("pivotY", this._set_pivotY);

                    this.__defineGetter__("rotation", this._get_rotation);
                    this.__defineSetter__("rotation", this._set_rotation);

                    this.__defineGetter__("matrix2D", this._get_matrix2D);
                    this.__defineSetter__("matrix2D", this._set_matrix2D);
                }*/
            },

            /**
             * 设置点数据
             * @param index 点所在的索引位置
             * @param value 点的新值
             */
            setPoint : function(index, value)
            {
                this.itemDataList[index] = value;
            },

            /**
             * 获得点数据
             * @param index 点所在的索引位置
             * @returns {*}
             */
            getPoint : function(index)
            {
                return this.itemDataList[index];
            },

            /**
             * 更新顶点缓存信息
             * @param pot
             */
            upDateFrame : function(pot)
            {
                this.itemDataList[this.ids] = new ss2d.Point(0, 0);
                this.itemDataList[this.ids].x = pot.x;
                this.itemDataList[this.ids].y = pot.y;

                this.itemDataAgencyList[this.ids] = new ss2d.Point(0, 0);
                this.itemDataAgencyList[this.ids].x = pot.x;
                this.itemDataAgencyList[this.ids].y = pot.y;
            },

            /**
             * 更新矩阵操作
             */
            upDateRaw : function()
            {
                for (var i = 0; i < this.ids; i++)
                {
                    //零时缓存顶点的信息,实际上这一步在后期的优化中可以省略掉，毕竟每次做这样的操作还是很消耗的

                    //存储1*3的矩阵计算后结果,也就是实际计算出来的屏幕坐标
                    //this.matrix2D.add1x32(this._matrix2,this._cacheList, this.matrix2D.rawData);
                    //改变缓存里的顶点的坐标信息

                    this.itemList[i].x = this.itemDataAgencyList[i].x * this.matrix2D.rawData[0] + this.itemDataAgencyList[i].y * this.matrix2D.rawData[3] +this.matrix2D.rawData[6];
                    this.itemList[i].y = this.itemDataAgencyList[i].x * this.matrix2D.rawData[1] + this.itemDataAgencyList[i].y * this.matrix2D.rawData[4] +this.matrix2D.rawData[7];
                }
            },

            /**
             * 更新矩阵操作
             */
            upDateMatrix : function(flag)
            {
                //根据输入的信息更新矩阵
                var angle=this.m_rotation * this.matrix2D.PI;
                var cos = Math.cos(angle);
                var sin = Math.sin(angle);
                this.matrix2D.rawData[0] = this.m_scaleX * cos + this.m_skewY * -sin;
                this.matrix2D.rawData[1] = this.m_scaleX * sin + this.m_skewY * cos;
                this.matrix2D.rawData[3] = this.m_skewX * cos + this.m_scaleY * -sin;
                this.matrix2D.rawData[4] = this.m_skewX * sin + this.m_scaleY * cos;
                this.matrix2D.rawData[6] = this.m_x + this.m_pivotX;
                this.matrix2D.rawData[7] = this.m_y + this.m_pivotY;

                /*this.matrix2D.upDateMatrix(this.m_rotation, this.m_x + this.m_pivotX, this.m_y + this.m_pivotY,
                    this.m_scaleX,this.m_scaleY, this.m_skewX, this.m_skewY);*/

                if (flag)
                {
                    for (var i = 0; i < this.ids; i++)
                    {
                        //零时缓存顶点的信息,实际上这一步在后期的优化中可以省略掉，毕竟每次做这样的操作还是很消耗的
                        //存储1*3的矩阵计算后结果,也就是实际计算出来的屏幕坐标
                        //this.matrix2D.add1x32(this._matrix2,this._cacheList, this.matrix2D.rawData);
                        //改变缓存里的顶点的坐标信息
                        this.itemList[i].x = this.itemDataAgencyList[i].x * this.matrix2D.rawData[0] + this.itemDataAgencyList[i].y * this.matrix2D.rawData[3] +this.matrix2D.rawData[6];
                        this.itemList[i].y = this.itemDataAgencyList[i].x * this.matrix2D.rawData[1] + this.itemDataAgencyList[i].y * this.matrix2D.rawData[4] +this.matrix2D.rawData[7];
                    }
                }
            },

            /**
             * 更新顶点的原始顶点坐标
             * @param pivotX
             * @param pivotY
             * @param scaleX
             * @param scaleY
             * @param skewX
             * @param skewY
             */
            upDateMatrixData : function(pivotX, pivotY, scaleX, scaleY, skewX, skewY)
            {
                //this.matrix2D.upDateMatrix(0, pivotX, pivotY, scaleX, scaleY, skewX, skewY);
                for (var i = 0; i <this.ids; i++)
                {
                    //this.matrix2D.add1x32(this._matrix,this._cacheList, this.matrix2D.rawData);
                    this.itemDataAgencyList[i].x =this.itemDataList[i].x * scaleX + this.itemDataList[i].y * skewX +pivotX;
                    this.itemDataAgencyList[i].y = this.itemDataList[i].x * skewY + this.itemDataList[i].y * scaleY +pivotY;
                }
            },

            /**
             * 添加元素
             */
            addItem : function(pot)
            {
                this.itemList[this.ids] = pot;
                this.upDateFrame(pot);
                this.ids++;
            },

            /**
             * 清理矩阵面板
             */
            clear : function()
            {
                this.ids = 0;
                this.m_x = 0;
                this.m_y = 0;
                this.m_rotation = 0;
                this.m_scaleX = 1;
                this.m_scaleY = 1;
                this.m_skewX = 0;
                this.m_skewY = 0;
                this.m_pivotX = 0;
                this.m_pivotY = 0;
                for(var i = 0; i < this.itemDataList.length; i++)
                {
                    this.itemDataList[i] = null;
                }
                this.itemDataList = [];

                for(var j = 0; j < this.itemDataAgencyList.length;j++)
                {
                    this.itemDataAgencyList[j]=null;
                }
                this.itemDataAgencyList = [];

                for(var n = 0;n < this.itemList.length; n++)
                {
                    this.itemList[n] = null;
                }
                this.itemList = [];
            },

            ////////////////////////////////////////////////////////////////////////////
            // private methods
            ////////////////////////////////////////////////////////////////////////////

            getX : function() {  return this.m_x;},
            setX : function(value){ this.m_x = value;},

            getY : function() {  return this.m_y;},
            setY : function(value){ this.m_y = value;},

            getScaleX : function() {  return this.m_scaleX;},
            setScaleX : function(value){ this.m_scaleX = value;},

            getScaleY : function() {  return this.m_scaleY;},
            setScaleY : function(value){ this.m_scaleY = value;},

            getSkewX : function() {  return this.m_skewX;},
            setSkewX : function(value){ this.m_skewX = value;},

            getSkewY : function() {  return this.m_skewY;},
            setSkewY : function(value){ this.m_skewY = value;},

            getPivotX : function() {  return this.m_pivotX;},
            setPivotX : function(value){ this.m_pivotX = value; },

            getPivotY : function() {  return this.m_pivotY;},
            setPivotY : function(value){ this.m_pivotY = value;},

            getRotation : function() {  return this.m_rotation;},
            setRotation : function(value){ this.m_rotation = value;},

            getMatrix2D : function(){ return this.matrix2D; },
            setMatrix2D : function(value){ this.matrix2D = value;}

        }
    );
})();