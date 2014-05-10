/**
 * ShaderHdr.js
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
     * ShaderHdr HDR效果着色器
     * @class
     */
    ss2d.ShaderHdr = Class
    (
        /** @lends ss2d.ShaderHdr.prototype */
        {
            Extends : ss2d.ShaderBasis,

            /**
             * 饱和度阈值
             */
            mLuminance:1.3,

            /**
             * 初始化着色器
             */
            initialize : function()
            {
                ss2d.ShaderHdr.Super.call(this);
                this.vertexShader = this.getShader(ss2d.Stage2D.gl,
                    this.basisVertexHead+
                        this.basisVertexStart+
                        this.basisVertexEnd,
                    "vs");

                this.fragmentShader = this.getShader(ss2d.Stage2D.gl,
                    this.basisPixelHead+
                        "uniform float mLuminance;"+
                        "vec4 xposure(vec4 _color , float gray , float ex) {"+
                        "float b = ( 4.0 * ex -  1.0 );"+
                        "float a = 1.0 - b;"+
                        "float f = gray * ( a * gray + b );"+
                        "return  _color*f;"+
                        "}"+
                        "void main(void) {"+
                        "vec4 _dsColor = texture2D(texture , vTextureUV);"+
                        "float _lum = 0.3 * _dsColor.x + 0.59 * _dsColor.y + 0.11* _dsColor.z;"+
                        "vec4 vec4Sum = vec4(0.0);"+

                        "for(float i=-1.0;i<=1.0;i+=1.0)"+
                        "{"+
                        "for(float j=-1.0;j<=1.0;j+=1.0)"+
                        "{"+
                        "vec2  intXY = vec2(vTextureUV.x * 1500.0 , vTextureUV.y * 1500.0);"+
                        "vec2 _xy_new = vec2(intXY.x+i , intXY.y+j);"+
                        "vec2 _uv_new = vec2(_xy_new.x/1500.0, _xy_new.y/1500.0);"+
                        "vec4Sum += texture2D(texture,_uv_new);"+
                        "};"+
                        "};"+

                        "vec4 _fColor = vec4Sum*(1.0/9.0);"+
                        "gl_FragColor=xposure(_fColor,_lum,mLuminance)*vVertexColor;"+
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

                ss2d.Stage2D.gl.uniform1f(ss2d.Stage2D.gl.getUniformLocation(this.shaderProgram,"mLuminance"),this.mLuminance);
            }
        }
    );
})();