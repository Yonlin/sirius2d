/**
 * ShaderBlur.js
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
     * ShaderBlur 模糊效果着色器
     * @class
     */
    ss2d.ShaderBlur = Class
    (
        /** @lends ss2d.ShaderBlur.prototype */
        {
            Extends : ss2d.ShaderBasis,

            /**
             * X轴模糊阈值
             */
            blurX:1.5,

            /**
             * Y轴模糊阈值
             */
            blurY:1.5,

            initialize : function()
            {
                ss2d.ShaderBlur.Super.call(this);
                this.vertexShader = this.getShader(ss2d.Stage2D.gl,
                    this.basisVertexHead+
                        this.basisVertexStart+
                        this.basisVertexEnd,
                    "vs");

                this.fragmentShader = this.getShader(ss2d.Stage2D.gl,
                        this.basisPixelHead+
                        "uniform vec2 value;"+
                        "uniform vec2 textureValue;"+
                        "const float max=1.0;"+
                        "void main()"+
                        "{"+
                            "vec4 vec4Sum = vec4(0.0);"+
                            "for(float i=-max;i<=max;i+=1.0)"+
                            "{"+
                                "for(float j=-max;j<=max;j+=1.0)"+
                                "{"+
                                    "vec2 xy_int = vec2(vTextureUV.x*textureValue.x  , vTextureUV.y*textureValue.y);"+
                                    "vec2 xy_new = vec2(xy_int.x+i*value.x, xy_int.y+j*value.y);"+
                                    "vec2 uv_new = vec2(xy_new.x/textureValue.x, xy_new.y/textureValue.y);"+
                                    "vec4Sum += texture2D(texture,uv_new)*vVertexColor;"+
                                "};"+
                            "};"+
                        "gl_FragColor = vec4Sum*0.111;"+
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
                ss2d.Stage2D.gl.uniform2f(ss2d.Stage2D.gl.getUniformLocation(this.shaderProgram, "textureValue"),scene.m_texture.width,scene._texture.height);
                ss2d.Stage2D.gl.uniform2f(ss2d.Stage2D.gl.getUniformLocation(this.shaderProgram, "value"),this.blurX,this.blurY);
            }
        }
    );
})();