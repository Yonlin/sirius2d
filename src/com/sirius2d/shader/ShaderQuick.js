/**
 * ShaderQuick.js
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
     * ShaderQuick 快速渲染着色器
     * @class
     */
    ss2d.ShaderQuick = Class
    (
        /** @lends ss2d.ShaderQuick.prototype */
        {

            Extends : ss2d.ShaderBasis,
            /**
             * 初始化着色器
             */
            initialize : function()
            {
                ss2d.ShaderQuick.Super.call(this);

                this.vertexShader = this.getShader(ss2d.Stage2D.gl,
                    this.basisVertexHead+
                        this.basisVertexStart+
                        this.basisVertexEnd,
                    "vs");

                this.fragmentShader = this.getShader(ss2d.Stage2D.gl,
                    "precision mediump float;"+
                        "varying vec2 vTextureUV;"+
                        "varying vec4 vVertexColor;"+
                        "uniform sampler2D texture;"+
                        "void main(void) {"+
                        "gl_FragColor = texture2D(texture,vTextureUV);"+
                        "}","fs");

                this.newShader();
            }
        }
    );
})();