/**
 * ParticleStyle.js
 *
 * HTML5游戏开发者社区 QQ群:326492427 127759656 Email:siriushtml5@gmail.com
 * Copyright (c) 2011 Sirius2D www.Sirius2D.com www.html5gamedev.org
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
     * ParticleStyle 粒子样式表，用于处理粒子发射时的各项参数
     * <br /> 演示地址:http://sirius2d.com/demos/d_32/
     * @class
     */
    ss2d.ParticleStyle = Class
    (
        /** @lends ss2d.ParticleStyle.prototype */
        {

            /**
             * 是否播放动画
             */
            loop:false,

            /**
             * 设置动画片段名称
             */
            tileName:null,

            /**
             * 跳转到第几帧
             */
            gotoFrame:0,

            /*
             *粒子X随机范围
             */
            scopeX:10,

            /**
             * 粒子Y随机范围
             */
            scopeY:10,

            /**
             * 粒子的X轴比例
             */
            scaleX:1,

            /**
             * 粒子的Y轴比例
             */
            scaleY:1,

            /**
             * 粒子X比例缩放值
             */
            scaleXValue:-.01,

            /**
             * 粒子Y比例缩放值
             */
            scaleYValue:-.01,

            /**
             * 粒子透明度
             */
            a:1,

            /**
             * 粒子红色通道值
             */
            r:.5,

            /**
             * 粒子绿色通道值
             */
            g:.8,

            /**
             * 粒子蓝色通道值
             */
            b: 1,

            /**
             * 粒子角度递增值
             */
            angleValue:0,

            /**
             * 粒子初始化角度
             */
            rotationValue:Math.PI/180*-90.0,

            /**
             * 粒子随机角度
             */
            rotationRandom:0,

            /**
             * 粒子运动速度
             */
            speedValue:5,

            /**
             * 粒子初始化透明度
             */
            alphaValue:-.02,

            /**
             * 粒子递增红色通道值
             */
            addR :.3,

            /**
             * 粒子递增绿色通道值
             */
            addG : .02,

            /**
             * 粒子递增蓝色通道值
             */
            addB :-.003,

            /**
             * 粒子递增透明度
             */
            addA :-.004
        }
    );
})();