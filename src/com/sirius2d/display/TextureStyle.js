/**
 * TextureStyle.js
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
     * TextureStyle 设置纹理显示采样样式，通常用于设置循环滚动的背景。
     * <br /> 演示地址:http://sirius2d.com/demos/d_28/
     * @class
     */
    ss2d.TextureStyle = Class
    (
        /** @lends ss2d.TextureStyle.prototype */
        {
            STATIC:
            {
                REPEAT:0x2901,
                MIRRORED_REPEAT:0x8370,
                CLAMP_TO_EDGE:0x812F,
                LINEAR:0x2601,
                NEAREST:0x2600
            },

            /**
             * X轴边缘采样模式
             * X axis sampling mode
             */
            xTile:0,

            /**
             * Y轴边缘年采样模式
             * Y axis sampling mode
             */
            yTile:0,

            /**
             * X轴缩放采样模式
             * scale X sampling mode
             */
            xSampling:0,

            /**
             * Y轴缩放采样模式
             * scale Y sampling mode
             */
            ySampling:0,
            initialize : function(value)
            {
               this.xTile=0x2901;
               this.yTile=0x2901;
               this.xSampling=0x2601;
               this.ySampling=0x2601;
            }
        }
    );
})();