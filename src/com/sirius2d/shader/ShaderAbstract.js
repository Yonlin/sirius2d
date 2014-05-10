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
     * ShaderAbstract 虚化效果着色器
     * @class
     */
    ss2d.ShaderAbstract = Class
    (
        /** @lends ss2d.ShaderAbstract.prototype */
        {
            Extends : ss2d.ShaderBasis,
            time:0,

            initialize : function()
            {
                this.time=0;
                ss2d.ShaderAbstract.Super.call(this);
                this.vertexShader = this.getShader(ss2d.Stage2D.gl,
                    this.basisVertexHead+
                        this.basisVertexStart+
                        this.basisVertexEnd,
                    "vs");

                this.fragmentShader = this.getShader(ss2d.Stage2D.gl,
                    this.basisPixelHead+
                    "uniform float time;"+
                    "const vec2 mouse=vec2(0.0,0.0);"+
                    "const vec2 resolution=vec2(1024.0,1024.0);"+
                    "void main(void)"+
                    "{"+
                        "float scale = resolution.y / 50.0;"+
                        "float ring = 20.0;"+
                        "float radius = resolution.x*1.0;"+
                        "float gap = scale*.5;"+
                        "vec2 pos = gl_FragCoord.xy - resolution.xy*.5;"+
                        "float d = length(pos);"+
                        "d += mouse.x*(sin(pos.y*0.25/scale+time)*sin(pos.x*0.25/scale+time*.5))*scale*5.0;"+
                        "float v = mod(d + radius/(ring*2.0), radius/ring);"+
                        "v = abs(v - radius/(ring*2.0));"+
                        "v = clamp(v-gap, 0.0, 1.0);"+
                        "d /= radius;"+
                        "vec3 m = fract((d-1.0)*vec3(ring*-.5, -ring, ring*.25)*0.5);"+
                        "gl_FragColor = texture2D(texture,vTextureUV)*vec4(m*v, 1.0);"+
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