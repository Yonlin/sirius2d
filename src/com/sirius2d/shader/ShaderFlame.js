/**
 * ShaderFlame.js
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
     * ShaderFlame 火焰效果着色器
     * @class
     */
    ss2d.ShaderFlame = Class
    (
        /** @lends ss2d.ShaderFlame.prototype */
        {
            Extends : ss2d.ShaderBasis,


            initialize : function()
            {
                ss2d.ShaderFlame.Super.call(this);
                this.vertexShader = this.getShader(ss2d.Stage2D.gl,
                    this.basisVertexHead+
                        this.basisVertexStart+
                        this.basisVertexEnd,
                    "vs");

                this.fragmentShader = this.getShader(ss2d.Stage2D.gl,
                    this.basisPixelHead+
                    "void main(void) {"+
                    "vec2  upLeftUV = vec2(vTextureUV.x - 1.0/1.01 , vTextureUV.y - 1.0/1.01);"+
                    "vec4  bkColor = vec4(0.5 , 0.5 , 0.5 , 1.0);"+
                    "vec4  curColor    =  texture2D(texture,vTextureUV);"+
                    "vec4  upLeftColor =  texture2D(texture,upLeftUV);"+
                    //相减得到颜色的差
                    "vec4  delColor = curColor - upLeftColor;"+
                    //需要把这个颜色的差设置
                    "vec2  h = vec2(0.3 * delColor.x + 0.59 * delColor.y + 0.11* delColor.z,0.0);"+
                    "gl_FragColor =  vec4(h.x,h.x,h.x,0.0)+bkColor;"+
                    "}","fs");

                this.newShader();
            }
        }
    );
})();