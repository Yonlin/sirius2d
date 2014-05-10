/**
 * Blend.js
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
     * Blend 实现图像特效，粒子混色的重要手段，通过混色可以实现意想不到的神器效果。
     * <br /> 演示地址:http://sirius2d.com/demos/d_22
     * @class
     */
    ss2d.Blend = Class
    (
        /** @lends ss2d.Blend.prototype */
        {
            STATIC:
            {
                /** @lends ss2d.Blend */
                /**
                 * 无混色
                 */
                BLEND_NONE:[1,0],

                /**
                 * 叠加
                 */
                BLEND_ADD:[0x0302,0x0302],

                /**
                 * 普通透明度
                 */
                BLEND_NORMAL:[0x0302,0x0303],

                /**
                 * 复合
                 */
                BLEND_MULTIPLY:[0x0306,0x0303],

                /**
                 * 遮挡
                 */
                BLEND_SCREEN:[0x0302,1],

                /**
                 * 擦除
                 */
                BLEND_ERASE:[0,0x0303],

                /**
                 * 排除
                 */
                BLEND_EXCLUSION:[0x0301,0x0301],

                /**
                 * 灯光
                 */
                BLEND_LIGHT:[0x0306,0x0304],

                /**
                 * 融化
                 */
                BLEND_FUSE:[0x0304,0x0300],

                /**
                 * 遮罩
                 */
                BLEND_MASK:[0x0306,0x0303],

                /**
                 * 透明度叠加
                 */
                BLEND_ADD_ALPHA:[0x0302,0x0304]
            }
        }
    )
})();