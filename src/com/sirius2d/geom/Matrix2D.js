/**
 * Matrix2D.js
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
     * Matrix2D 2D矩阵类
     * @class
     */
    ss2d.Matrix2D = Class
    (
        /** @lends ss2d.Matrix2D.prototype */
        {
            //////////////////////////////////////////////////////////////////////////
            //  public property
            //////////////////////////////////////////////////////////////////////////

            /**
             * 矩阵的原始信息
             * @type {Array}
             */
            rawData :null,


            spinArray :null,
            translationArray :null,
            matrix3x3:null,
            PI:Math.PI / 180,

            ////////////////////////////////////////////////////////////////////////////
            //  constructor
            ////////////////////////////////////////////////////////////////////////////

            ////////////////////////////////////////////////////////////////////////////
            //  public methods
            ////////////////////////////////////////////////////////////////////////////

            /**
             * 初始化
             * @private
             */
            initialize : function()
            {
                this.identity();
            },

            /**
             * 重置矩阵
             */
            identity : function()
            {
                //优化
                this.rawData = new Float32Array(8);
                this.spinArray = new Float32Array(8);
                this.translationArray = new Float32Array(8);
                this.matrix3x3=new Float32Array(8);
            },

            /**
             * 3*3优化矩阵融合
             * @param v1
             * @param v2
             * @returns {Array}
             */
            add3x32 : function(v,v1, v2)
            {
                //特殊优化
                v[0] = v1[0] * v2[0] + v1[1] * v2[3];
                v[1] = v1[0] * v2[1] + v1[1] * v2[4];
                v[3] = v1[3] * v2[0] + v1[4] * v2[3];
                v[4] = v1[3] * v2[1] + v1[4] * v2[4];
                v[6] = v1[6] * v2[0] + v1[7] * v2[3] +v2[6];
                v[7] = v1[6] * v2[1] + v1[7] * v2[4] +v2[7];
            },

            /**
             * 3*3矩阵融合
             * @param v1
             * @param v2
             * @returns {Array}
             */
            add3x3 : function(v1, v2)
            {
                //特殊优化
                this.matrix3x3=new Float32Array(8);
                this.matrix3x3[0] = v1[0] * v2[0] + v1[1] * v2[3];
                this.matrix3x3[1] = v1[0] * v2[1] + v1[1] * v2[4];
                this.matrix3x3[3] = v1[3] * v2[0] + v1[4] * v2[3];
                this.matrix3x3[4] = v1[3] * v2[1] + v1[4] * v2[4];
                this.matrix3x3[6] = v1[6] * v2[0] + v1[7] * v2[3] +v2[6];
                this.matrix3x3[7] = v1[6] * v2[1] + v1[7] * v2[4] +v2[7];
                return this.matrix3x3;
            },

            /**
             * 1*3优化矩阵融合
             * @param v1
             * @param v2
             * @returns {Array}
             */
            add1x32 : function(v,v1, v2)
            {
                //特殊优化
                v[0] = v1[0] * v2[0] + v1[1] * v2[3] +v2[6];
                v[1] = v1[0] * v2[1] + v1[1] * v2[4] +v2[7];
            },

            /**
             * 1*3矩阵融合
             * @param v1
             * @param v2
             * @returns {Array}
             */
            add1x3 : function(v1, v2)
            {
                //特殊优化
                var matrix1x3 = new Float32Array(3);
                matrix1x3[0] = v1[0] * v2[0] + v1[1] * v2[3] +v2[6];
                matrix1x3[1] = v1[0] * v2[1] + v1[1] * v2[4] +v2[7];
                return matrix1x3;
            },

            /**
             *平移,旋转
             * @param rotation
             * @param x
             * @param y
             */
            appendRotation : function(rotation,x, y)
            {
                //特殊优化
                var cos = Math.cos(rotation * this.PI);
                var sin = Math.sin(rotation * this.PI);
                //旋转
                this.spinArray[0] = cos;
                this.spinArray[1] = sin;
                this.spinArray[2] = 0;
                this.spinArray[3] = -sin;
                this.spinArray[4] = cos;
                this.spinArray[5] = 0;
                this.spinArray[6] = x;
                this.spinArray[7] = y;
                this.spinArray[8] = 1;
            },

            /**
             * 缩放,倾斜
             * @param scaleX
             * @param scaleY
             * @param biasX
             * @param biasY
             */
            appendTranslation : function(scaleX, scaleY, skewX, skewY)
            {
                //特殊优化
                this.translationArray[0] = scaleX;
                this.translationArray[1] = skewY;
                this.translationArray[2] = 0;
                this.translationArray[3] = skewX;
                this.translationArray[4] = scaleY;
                this.translationArray[5] = 0;
                this.translationArray[6] = 0;
                this.translationArray[7] = 0;
                this.translationArray[8] = 1;
            },

            /**
             * 更新矩阵信息
             * @param rotation
             * @param x
             * @param y
             * @param scaleX
             * @param scaleY
             * @param biasX
             * @param biasY
             */
            upDateMatrix : function(rotation, x, y, scaleX, scaleY, skewX, skewY)
            {
                var angle=rotation * this.PI;
                var cos = Math.cos(angle);
                var sin = Math.sin(angle);
                this.rawData[0] = scaleX * cos + skewY * -sin;
                this.rawData[1] = scaleX * sin + skewY * cos;
                this.rawData[3] = skewX * cos + scaleY * -sin;
                this.rawData[4] = skewX * sin + scaleY * cos;
                this.rawData[6] = x;
                this.rawData[7] = y;
                //this.rawData=this.add3x3(this.translationArray,this.spinArray);
            }
        }
    );
})();