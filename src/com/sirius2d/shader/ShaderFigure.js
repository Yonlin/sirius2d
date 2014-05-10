/**
 * ShaderFigure.js
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
     * ShaderFigure 抽象效果着色器
     * @class
     */
    ss2d.ShaderFigure = Class
    (
        /** @lends ss2d.ShaderFigure.prototype */
        {
            Extends : ss2d.ShaderBasis,
            time:1.0,

            initialize : function()
            {
                ss2d.ShaderFigure.Super.call(this);
                this.vertexShader = this.getShader(ss2d.Stage2D.gl,
                    this.basisVertexHead+
                        this.basisVertexStart+
                        this.basisVertexEnd,
                    "vs");

                this.fragmentShader = this.getShader(ss2d.Stage2D.gl,
                    this.basisPixelHead+
                    "uniform float time;"+
                    "const vec2 mouse=vec2(0.0,0.0);"+
                    "const vec2 resolution=vec2(1024.0,768.0);"+
                        "void main() {"+
                        "vec2 position = vec2("+
                            "mod(gl_FragCoord.x, 64.0),"+
                            "mod(gl_FragCoord.y, 64.0)"+
                        ");"+

                        "float xang = 10.0*time + (gl_FragCoord.y / 20.0);"+
                        "float zang = 10.0*time + (gl_FragCoord.x / 20.0);"+

                        "vec3 whatamidoing = vec3("+
                            "sin(xang)+cos(gl_FragCoord.x/6.0) /2.0 + 0.5,"+
                            "sin(mod(time*4.0, 2.0*3.14159265))/2.0 + 0.5,"+
                            "cos(zang)+sin(gl_FragCoord.y/6.0) /2.0 + 0.5"+
                        ");"+
                        "gl_FragColor = texture2D(texture,vTextureUV)*vVertexColor+vec4(whatamidoing, 1.0);"+
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

                this.time+=.01;
                ss2d.Stage2D.gl.uniform1f(ss2d.Stage2D.gl.getUniformLocation(this.shaderProgram,"time"),this.time);

            }
        }
    );
})();