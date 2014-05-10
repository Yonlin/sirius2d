/**
 * ShaderGlass.js
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
     * ShaderGlass 玻璃效果着色器
     * @class
     */
    ss2d.ShaderGlass = Class
    (
        /** @lends ss2d.ShaderGlass.prototype */
        {
            Extends : ss2d.ShaderBasis,

            /**
             * 动画时间步长
             */
            timer:0,

            /**
             * 动画运动速度
             */
            speed:10.0,

            /**
             * 动画运动频率
             */
            frequency:200,

            /**
             *动画运行分辨率
             */
            resolution:30,

            /**
             * 动画噪点阈值
             */
            noisy:0.009,


            initialize : function()
            {
                ss2d.ShaderGlass.Super.call(this);
                this.vertexShader = this.getShader(ss2d.Stage2D.gl,
                    this.basisVertexHead+
                        this.basisVertexStart+
                        this.basisVertexEnd,
                    "vs");

                this.fragmentShader = this.getShader(ss2d.Stage2D.gl,
                    this.basisPixelHead+
                        "uniform vec4 value;"+
                        "void main(void) {"+
                        "vec2 backgroundUv = vTextureUV;"+
                        "backgroundUv.x =backgroundUv.x+sin(value.w /value.x + backgroundUv.x *value.y) *value.z;"+
                        "backgroundUv.y =backgroundUv.y+cos(value.w /value.x + backgroundUv.y *value.y) *value.z;"+
                        "gl_FragColor=texture2D(texture,backgroundUv)*vVertexColor;"+
                        "}","fs");

                this.newShader();
            },

            upDataShader : function(scene)
            {
                ss2d.Stage2D.gl.useProgram(this.shaderProgram);
                this.upDataMatrix();
                this.upDataTexture(scene);
                this.upDataVertex(scene);
                this.upDataCache(scene);

                this.timer+=this.speed;
                ss2d.Stage2D.gl.uniform4f(ss2d.Stage2D.gl.getUniformLocation(this.shaderProgram,"value"),this.frequency,this.resolution,this.noisy,this.timer);
            }
        }
    );
})();