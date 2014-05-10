/**
 * ShaderLight.js
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
     * ShaderLight 2D灯光效果着色器
     * @class
     */
    ss2d.ShaderLight = Class
    (
        /** @lends ss2d.ShaderLight.prototype */
        {
            Extends : ss2d.ShaderBasis,

            /**
             * 灯光X轴位置
             */
            lightX:.5,

            /**
             * 灯光Y轴位置
             */
            lightY:-.5,

            /**
             * 灯光强度
             */
            lightScale:10,

            /**
             * 初始化着色器
             */
            initialize : function()
            {
                ss2d.ShaderLight.Super.call(this);
                this.vertexShader = this.getShader(ss2d.Stage2D.gl,
                    this.basisVertexHead+
                        this.basisVertexStart+
                        this.basisVertexEnd,
                    "vs");

                this.fragmentShader = this.getShader(ss2d.Stage2D.gl,
                           this.basisPixelHead+
                        "uniform vec3 lightingValue;" +
                        "void main() {" +
                        "vec3 lighting=vec3(1, 1, 1);"+
                        "lighting.x=abs(lightingValue.x-vTextureUV.x);"+
                        "lighting.y=abs(lightingValue.y-vTextureUV.y);"+
                        "lighting.z=sqrt(lighting.x*lighting.x+lighting.y*lighting.y);"+
                        "gl_FragColor=texture2D(texture,vTextureUV)/(lighting.z*lightingValue.z)*vVertexColor;"+
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
                ss2d.Stage2D.gl.uniform3f(ss2d.Stage2D.gl.getUniformLocation(this.shaderProgram,"lightingValue"),this.lightX,this.lightY,this.lightScale);
            }
        }
    );
})();