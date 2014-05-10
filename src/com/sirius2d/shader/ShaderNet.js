/**
 * ShaderNet.js
 * version 0.9.1
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
     * ShaderNet 网状效果着色器
     * @class
     */
    ss2d.ShaderNet = Class
    (
        /** @lends ss2d.ShaderNet.prototype */
        {
            Extends : ss2d.ShaderBasis,



            time:1.0,

            /**
             * 初始化着色器
             */
            initialize : function()
            {
                ss2d.ShaderNet.Super.call(this);

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

                "const vec3 ORANGE = vec3(1.4, 0.1, 0.3);"+
                "const vec3 BLUE = vec3(0.5, 0.1, 1.3);"+
                "const vec3 GREEN = vec3(1.0, 0.4, 0.4);"+
                "const vec3 RED = vec3(1.8, 0.4, 0.8);"+

                "void main() {"+
                "float x, y, xpos, ypos;"+
               "float t = time * 1.5;"+
                "vec3 c = vec3(0.0);"+

                "ypos = (gl_FragCoord.x / resolution.x);"+
                "xpos = (gl_FragCoord.y / resolution.y);"+

                "x = xpos;"+
                "for (float i = 0.0; i < 8.0; i += 1.0) {"+
                    "for(float j = 0.0; j < 2.0; j += 1.0){"+
                        "y = ypos"+
                            "+ (0.30 * sin(x * 2.000 +( i * 1.5 + j) * 0.4 + t * 0.050)"+
                            "+ 0.100 * cos(x * 6.350 + (i  + j) * 0.7 + t * 0.050 * j)"+
                            "+ 0.024 * sin(x * 12.35 + ( i + j * 4.0 ) * 0.8 + t * 0.034 * (8.0 *  j))"+
                            "+ 0.5);"+

                        "c += vec3(1.0 - pow(clamp(abs(1.0 - y) * 5.0, 0.0,1.0), 0.25));"+
                    "}"+
                "}"+

                "c *= mix("+
                    "mix(ORANGE, BLUE, xpos)"+
                    ", mix(GREEN, RED, xpos)"+
                    ",(sin(t * 0.02) + 1.0) * 0.45"+
                ") * 0.5;"+
                "gl_FragColor = texture2D(texture,vTextureUV)*vVertexColor+vec4(c,1.0);"+
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

                this.time+=.1;

                ss2d.Stage2D.gl.uniform1f(ss2d.Stage2D.gl.getUniformLocation(this.shaderProgram,"time"),this.time);

            }
        }
    );
})();