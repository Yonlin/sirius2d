/**
 * ParticleEmittersCPU.js
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
     * ParticleEmittersCPU 粒子发射器,可用于发射任何Quad,通常在粒子，幻影，残影时用到。
     * <br /> 演示地址:http://sirius2d.com/demos/d_32/
     * @class
     */
    ss2d.ParticleEmittersCPU = Class
    (
        /** @lends ss2d.ParticleEmittersCPU.prototype */
        {
            isPlay:true,
            frameRun:null,
            list :null,
            run:function()
            {
                this.paint();
            },
            initialize : function(v_scene,v_value)
            {
                this.list=[];
                for (var i = 0; i < v_value; i++)
                {
                    var quad=v_scene.applyQuad();
                    v_scene.showQuad(quad);
                    quad.setVisible(false);
                    quad.loop(true);
                    quad.play();
                    this.list.push(new ss2d.ParticleCPU(quad));
                };
                this.frameRun=this.run.bind(this);
                ss2d.stage.addEventListener(ss2d.Event.ENTER_FRAME,this.frameRun);
            },

            //刷新函数
            paint:function()
            {
                for(var j=0;j<this.list.length;j++)
                {
                    //如果粒子是启用状态
                    if(this.list[j].isStart)
                    {
                        //刷新粒子逻辑
                        this.list[j].paint();
                    }
                }
            },

            /**
             * 获得粒子
             * @return
             */
            sendParticle:function(x,y,v_particleStyle)
            {
                if(this.isPlay)
                    for (var i = 0; i <this.list.length; i++)
                    {
                        //如果粒子未启动
                        if (this.list[i].isStart==false)
                        {
                            //填充粒子属性
                            var grain = this.list[i];
                            grain.show();


                            grain.quad.loop(v_particleStyle.loop);
                            (v_particleStyle.loop)?grain.quad.play():grain.quad.stop();

                            if(v_particleStyle.gotoFrame!=0)
                            grain.quad.gotoAndStop(v_particleStyle.gotoFrame);

                            if(v_particleStyle.tileName!=null)
                            grain.quad.setTileName(v_particleStyle.tileName);

                            grain.quad.setScaleX(v_particleStyle.scaleX);
                            grain.quad.setScaleY(v_particleStyle.scaleY);
                            grain.quad.GPUX=x+ Math.random()* v_particleStyle.scopeX - v_particleStyle.scopeX / 2;
                            grain.quad.GPUY=y+ Math.random()* v_particleStyle.scopeY - v_particleStyle.scopeY / 2;

                            //grain.quad.setX(x+ Math.random()* v_particleStyle.scopeX - v_particleStyle.scopeX / 2);
                            //grain.quad.setY(y+ Math.random()* v_particleStyle.scopeY - v_particleStyle.scopeY / 2);

                            grain.quad.setR(v_particleStyle.r);
                            grain.quad.setG(v_particleStyle.g);
                            grain.quad.setB(v_particleStyle.b);
                            grain.quad.setA(v_particleStyle.a);

                            grain.quad.setRotation(v_particleStyle.rotationValue);


                            grain.addR = v_particleStyle.addR;
                            grain.addG = v_particleStyle.addG;
                            grain.addB = v_particleStyle.addB;
                            grain.addA = v_particleStyle.addA;

                            grain.angleValue = v_particleStyle.angleValue;
                            grain.alphaValue = v_particleStyle.alphaValue;
                            grain.scaleXValue= v_particleStyle.scaleXValue;
                            grain.scaleYValue= v_particleStyle.scaleYValue;
                            grain.rotationValue = v_particleStyle.rotationValue + Math.random() * v_particleStyle.rotationRandom;
                            grain.speedValue = v_particleStyle.speedValue;


                            break;
                        }
                    }
            }
        }
    );
})();