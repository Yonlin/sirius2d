/**
 * Matrix3D.js
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
     * Matrix3D 3D矩阵类
     * @class
     */
    ss2d.Matrix3D = Class
    (
        /** @lends ss2d.Matrix3D.prototype */
        {
            /**
             * 矩阵的原始信息
             * @type {Array}
             */
            rawData : [],

            spinArray : [],
            translationArray : [],
            matrix4x4:[],
            PI:Math.PI / 180,

            /**
             * 重置矩阵
             */
            identity : function()
            {
                //优化
                this.rawData = new Float32Array(16);
                this.spinArray = new Float32Array(16);
                this.translationArray = new Float32Array(16);
                this.matrix4x4=new Float32Array(16);
            },

            /**
             * 4*4矩阵融合
             * @param v1
             * @param v2
             * @returns {Array}
             */
            add4x4 : function(a1, a2)
            {
                //特殊优化
                var matrix4x4=new Float32Array(16);

                matrix4x4[0]=a1[0]*a2[0]+a1[1]*a2[4]+a1[2]*a2[8]+a1[3]*a2[12];
                matrix4x4[1]=a1[0]*a2[1]+a1[1]*a2[5]+a1[2]*a2[9]+a1[3]*a2[13];
                matrix4x4[2]=a1[0]*a2[2]+a1[1]*a2[6]+a1[2]*a2[10]+a1[3]*a2[14];
                matrix4x4[3]=a1[0]*a2[3]+a1[1]*a2[7]+a1[2]*a2[11]+a1[3]*a2[15];

                matrix4x4[4]=a1[4]*a2[0]+a1[5]*a2[4]+a1[6]*a2[8]+a1[7]*a2[12];
                matrix4x4[5]=a1[4]*a2[1]+a1[5]*a2[5]+a1[6]*a2[9]+a1[7]*a2[13];
                matrix4x4[6]=a1[4]*a2[2]+a1[5]*a2[6]+a1[6]*a2[10]+a1[7]*a2[14];
                matrix4x4[7]=a1[4]*a2[3]+a1[5]*a2[7]+a1[6]*a2[11]+a1[7]*a2[15];

                matrix4x4[8]=a1[8]*a2[0]+a1[9]*a2[4]+a1[10]*a2[8]+a1[11]*a2[12];
                matrix4x4[9]=a1[8]*a2[1]+a1[9]*a2[5]+a1[10]*a2[9]+a1[11]*a2[13];
                matrix4x4[10]=a1[8]*a2[2]+a1[9]*a2[6]+a1[10]*a2[10]+a1[11]*a2[14];
                matrix4x4[11]=a1[8]*a2[3]+a1[9]*a2[7]+a1[10]*a2[11]+a1[11]*a2[15];

                matrix4x4[12]=a1[12]*a2[0]+a1[13]*a2[4]+a1[14]*a2[8]+a1[15]*a2[12];
                matrix4x4[13]=a1[12]*a2[1]+a1[13]*a2[5]+a1[14]*a2[9]+a1[15]*a2[13];
                matrix4x4[14]=a1[12]*a2[2]+a1[13]*a2[6]+a1[14]*a2[10]+a1[15]*a2[14];
                matrix4x4[15]=a1[12]*a2[3]+a1[13]*a2[7]+a1[14]*a2[11]+a1[15]*a2[15];

                return matrix4x4;
            },



            /**
             * 1*4矩阵融合
             * @param v1
             * @param v2
             * @returns {Array}
             */
            add1x4 : function(v1, v2)
            {
                //特殊优化
                var matrix1x4 = new Float32Array(4);
                matrix1x4[0] = v1[0] * v2[0] + v1[1] * v2[5]+v1[2] * v2[9]+v1[3] * v2[13];
                matrix1x4[1] = v1[0] * v2[1] + v1[1] * v2[6]+v1[2] * v2[10]+v1[3] * v2[14]
                matrix1x4[2] = v1[0] * v2[3] + v1[1] * v2[7]+v1[2] * v2[11]+v1[3] * v2[15];
                matrix1x4[4] = v1[0] * v2[4] + v1[1] * v2[8]+v1[2] * v2[12]+v1[3] * v2[16];
                return matrix1x4;
            },


            /**
             * 旋转矩阵
             * @param rotation 旋转角度
             * @param x X轴移动量
             * @param y Y轴移动量
             */
            appendRotation : function(rotation,x,y)
            {
                //特殊优化
                var cos = Math.cos(rotation * this.PI);
                var sin = Math.sin(rotation * this.PI);

                this.spinArray[0] = cos;
                this.spinArray[1] = sin;
                this.spinArray[2] = 0;
                this.spinArray[3] = 0;
                this.spinArray[4] = -sin;
                this.spinArray[5] = cos;
                this.spinArray[6] = 0;
                this.spinArray[7] = 0;
                this.spinArray[8] = x;
                this.spinArray[9] = y;
                this.spinArray[10] = 1;
                this.spinArray[11] = 0;
                this.spinArray[12] = 0;
                this.spinArray[13] = 0;
                this.spinArray[14] = 0;
                this.spinArray[15] = 1;

            },

            /**
             * 缩放与倾斜
             * @param scaleX X轴缩放值
             * @param scaleY Y轴缩放值
             * @param biasX X轴倾斜值
             * @param biasY Y轴倾斜值
             */
            appendTranslation : function(scaleX, scaleY, skewX, skewY)
            {

                //特殊优化
                this.translationArray[0] = scaleX;
                this.translationArray[1] = skewY;
                this.translationArray[2] = 0;
                this.translationArray[3] = 0;
                this.translationArray[4] = skewX;
                this.translationArray[5] = scaleY;
                this.translationArray[6] = 0;
                this.translationArray[7] = 0;
                this.translationArray[8] = 0;
                this.translationArray[9] = 0;
                this.translationArray[10] = 1;
                this.translationArray[11] = 0;
                this.translationArray[12] = 0;
                this.translationArray[13] = 0;
                this.translationArray[14] = 0;
                this.translationArray[15] = 1;

            },

            /**
             * 更新矩阵信息
             * @param rotation 旋转角度
             * @param x X轴移动值
             * @param y Y轴移动值
             * @param scaleX X轴缩放值
             * @param scaleY Y轴缩放值
             * @param biasX X轴倾斜值
             * @param biasY Y轴倾斜值
             */
            upDateMatrix : function(rotation, x, y, scaleX, scaleY, skewX, skewY)
            {
                //计算旋转后的矩阵
                this.appendRotation(rotation,x, y);
                //计算位移等其他变换后的矩阵
                this.appendTranslation(scaleX, scaleY, skewX, skewY);
                //融合这2个变换矩阵
                this.rawData=this.add4x4(this.spinArray, this.translationArray);
            }
        }
    );
})();