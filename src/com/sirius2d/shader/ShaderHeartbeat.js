/**
 * ShaderHeartbeat.js
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
     * ShaderHeartbeat 跳动效果着色器
     * @class
     */
    ss2d.ShaderHeartbeat = Class
    (
        /** @lends ss2d.ShaderHeartbeat.prototype */
        {
            Extends : ss2d.ShaderBasis,
            time:1.0,

            /**
             * 初始化着色器
             */
            initialize : function()
            {
                ss2d.ShaderHeartbeat.Super.call(this);
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

                "void main( void ) {"+

                "vec2 e;"+
                "vec2 p = ( gl_FragCoord.xy / resolution.xy ) - 0.5;"+
                "float sx = 0.2 * (p.x + 0.5) * sin( 25.0 * p.x - 10. * time);"+
                "float dy = 1./ ( 50. * abs(p.y - sx));"+
                "dy += 1./ (20. * length(p - vec2(p.x, 0.)));"+
                "gl_FragColor = texture2D(texture,vTextureUV)+vec4( (p.x + 0.5) * dy, 0.5 * dy, dy, 1.0 )*vVertexColor;"+
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