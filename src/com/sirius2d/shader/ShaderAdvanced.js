/**
 * ShaderAbstract.js
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
     * ShaderAdvanced 高级上色效果着色器
     * @class
     */
    ss2d.ShaderAdvanced = Class
    (
        /** @lends ss2d.ShaderAdvanced.prototype */
        {
            Extends : ss2d.ShaderBasis,
            r:0.0,
            g:0.0,
            b:0.0,
            a:0.0,

            initialize : function()
            {
                ss2d.ShaderAdvanced.Super.call(this);
               this.vertexShader = this.getShader(ss2d.Stage2D.gl,
                        this.basisVertexHead+
                            this.basisVertexStart+
                            this.basisVertexEnd,
                        "vs");

                this.fragmentShader = this.getShader(ss2d.Stage2D.gl,
                         this.basisPixelHead+
                        "uniform vec4 value;"+
                        "void main(void) {"+
                            "gl_FragColor = texture2D(texture,vTextureUV)*vVertexColor+value;"+
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
                ss2d.Stage2D.gl.uniform4f(ss2d.Stage2D.gl.getUniformLocation(this.shaderProgram,"value"),this.r,this.g,this.b,this.a);
            }
        }
    );
})();