/**
 * ColorTransform.js
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
     * 可使用 ColorTransform 类调整显示对象的颜色值。可以将颜色调整或颜色转换应用于所有四种通道：红色、绿色、蓝色和 Alpha 透明度。
     * @param redMultiplier 与红色通道值相乘的十进制值。
     * @param greenMultiplier 与绿色通道值相乘的十进制值。
     * @param blueMultiplier 与蓝色通道值相乘的十进制值。
     * @param alphaMultiplier 与 Alpha 透明度通道值相乘的十进制值。
     * @param redOffset -255 到 255 之间的数字，加到红色通道值和 redMultiplier 值的乘积上。
     * @param greenOffset -255 到 255 之间的数字，加到绿色通道值和 greenMultiplier 值的乘积上。
     * @param blueOffset -255 到 255 之间的数字，加到蓝色通道值和 blueMultiplier 值的乘积上。
     * @param alphaOffset -255 到 255 之间的数字，加到 Alpha 透明度通道值和 alphaMultiplier 值的乘积上。
     * @class
     */
    ss2d.ColorTransform = Class
    (
        /** @lends ss2d.ColorTransform.prototype */
        {
            //////////////////////////////////////////////////////////////////////////
            //  public property
            //////////////////////////////////////////////////////////////////////////

            /**
             * 与红色通道值相乘的十进制值。
             * @type {number}
             */
            redMultiplier : 1,

            /**
             * 与绿色通道值相乘的十进制值。
             * @type {number}
             */
            greenMultiplier : 1,

            /**
             * 与蓝色通道值相乘的十进制值。
             * @type {number}
             */
            blueMultiplier : 1,

            /**
             * 与 Alpha 透明度通道值相乘的十进制值。
             * @type {number}
             */
            alphaMultiplier : 1,

            /**
             * -255 到 255 之间的数字，加到红色通道值和 redMultiplier 值的乘积上。
             * @type {number}
             */
            redOffset : 0,

            /**
             * -255 到 255 之间的数字，加到绿色通道值和 greenMultiplier 值的乘积上。
             * @type {number}
             */
            greenOffset : 0,

            /**
             * -255 到 255 之间的数字，加到蓝色通道值和 blueMultiplier 值的乘积上。
             * @type {number}
             */
            blueOffset : 0,

            /**
             * -255 到 255 之间的数字，加到 Alpha 透明度通道值和 alphaMultiplier 值的乘积上。
             * @type {number}
             */
            alphaOffset : 0,

            ////////////////////////////////////////////////////////////////////////////
            //  constructor
            ////////////////////////////////////////////////////////////////////////////

            /**
             * 初始化
             * @private
             */
            initialize : function(redMultiplier, greenMultiplier, blueMultiplier,
                            alphaMultiplier, redOffset, greenOffset, blueOffset, alphaOffset)
            {
                this.redMultiplier = redMultiplier == undefined ? 1 : redMultiplier;
                this.greenMultiplier = greenMultiplier == undefined ? 1 : greenMultiplier;
                this.blueMultiplier = blueMultiplier == undefined ? 1 : blueMultiplier;
                this.alphaMultiplier = alphaMultiplier == undefined ? 1 : alphaMultiplier;
                this.redOffset = redOffset || 0;
                this.greenOffset = greenOffset || 0;
                this.blueOffset = blueOffset || 0;
                this.alphaOffset = alphaOffset || 0;
            }
        }
    );
})();