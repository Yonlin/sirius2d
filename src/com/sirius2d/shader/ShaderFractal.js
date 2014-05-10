/**
 * ShaderFractal.js
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
     * ShaderFractal 不规则上色效果着色器
     * @class
     */
    ss2d.ShaderFractal = Class
    (
        /** @lends ss2d.ShaderFractal.prototype */
        {
            Extends : ss2d.ShaderBasis,
            time:1.0,

            initialize : function()
            {
                ss2d.ShaderFractal.Super.call(this);
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
                 "vec2 CircleInversion(vec2 vPos, vec2 vOrigin, float fRadius)"+
                "{"+
                    "vec2 vOP = vPos - vOrigin;"+

                    "vOrigin = vOrigin - vOP * fRadius * fRadius / dot(vOP, vOP);"+
                    "vOrigin.x += sin(vOrigin.x * 0.01);"+
                    "vOrigin.y -= cos(vOrigin.y* 0.01);"+

                    "return vOrigin;"+
                "}"+

                "float Parabola( float x, float n )"+
                "{"+
                    "return pow( 2.0*x*(1.0-x), n );"+
                "}"+

                "void main(void)"+
                "{"+
                    "vec2 vPos = gl_FragCoord.xy / resolution.xy;"+
                    "vPos = vPos - 0.5;"+

                    "vPos.x *= resolution.x / resolution.y;"+

                    "vec2 vScale = vec2(1.2);"+
                    "vec2 vOffset = vec2( sin(time * 0.123), atan(time * 0.0567));"+

                    "float l = 0.0;"+
                    "float minl = 10000.0;"+

                    "for(int i=0; i<48; i++)"+
                    "{"+
                        "vPos.x = abs(vPos.x);"+
                        "vPos = vPos * vScale + vOffset;"+

                        "vPos = CircleInversion(vPos, vec2(0.5, 0.5), 0.9);"+

                        "l = length(vPos);"+
                        "minl = min(l, minl);"+
                    "}"+


                    "float t = 4.1 + time * 0.055;"+
                    "vec3 vBaseColour = normalize(vec3(sin(t * 1.790), sin(t * 1.345), sin(t * 1.123)) * 0.5 + 0.5);"+

                    //vBaseColour = vec3(1.0, 0.15, 0.05);

                    "float fBrightness = 11.0;"+

                    "vec3 vColour = vBaseColour * l * l * fBrightness;"+

                    "minl = Parabola(minl, 5.0);"+

                    "vColour *= minl + 0.1;"+

                    "vColour = 1.0 - exp(-vColour);"+

                "gl_FragColor = texture2D(texture,vTextureUV)*vVertexColor+vec4(vColour,1.0);"+
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