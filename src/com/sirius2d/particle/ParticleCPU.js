/**
 * ParticleCPU.js
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
    ss2d.ParticleCPU = Class
    (
        {
            quad:null,
            scaleXValue:0,
            scaleYValue:0,
            addR:0,
            addG:0,
            addB:0,
            addA:0,
            angleValue:0,
            rotationValue:0,
            speedValue:0,
            alphaValue:0,
            isStart:false,
            initialize : function(v_quad)
            {
                this.quad=v_quad;
                this.quad.GPU=true;
                this.quad.setCenter(true);
                this.quad.setVisible(false);
            },

            //绘制函数,核心功能
            paint:function(){
                //让角度加上旋转角度
                this.rotationValue += this.angleValue;

                //让粒子按照指定的速度和方向运动
                this.quad.GPUX+=Math.cos(this.rotationValue) * this.speedValue;
                this.quad.GPUY+=Math.sin(this.rotationValue) * this.speedValue;

                //this.quad.setX((this.quad.getX()+Math.cos(this.rotationValue) * this.speedValue));
                //this.quad.setY((this.quad.getY()+Math.sin(this.rotationValue) * this.speedValue));

                this.quad.setScaleX(this.quad.getScaleX()+this.scaleXValue);
                this.quad.setScaleY(this.quad.getScaleY()+this.scaleYValue);

                //所有属性加上某个值
                this.quad.setAlpha((this.quad.getAlpha()+this.alphaValue));
                this.quad.setR(this.quad.getR()+this.addR);
                this.quad.setG(this.quad.getG()+this.addG);
                this.quad.setB(this.quad.getB()+this.addB);
                this.quad.setA(this.quad.getA()+this.addA);

                //如果透明度小于0就清理粒子
                if (this.quad.getAlpha()<= 0)
                {
                    this.clear();
                }
            },


            //初始化粒子的所有状态
            show:function()
            {
                this.quad.setAlpha(1);
                this.quad.setScaleX(1);
                this.quad.setScaleY(1);
                this.quad.setR(1);
                this.quad.setG(1);
                this.quad.setB(1);
                this.quad.setA(1);
                this.quad.setVisible(true);
                this.isStart = true;
            },

            /**
             * 清理粒子
             */
            clear:function()
            {
                this.quad.setVisible(false);
                this.isStart = false;
            }
        }
    );
})();