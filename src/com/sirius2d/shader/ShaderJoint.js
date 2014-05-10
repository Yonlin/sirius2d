/**
 * ShaderJoint.js
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
     * ShaderJoint 纹理拼接着色器
     * @class
     */
    ss2d.ShaderJoint = Class
    (
        /** @lends ss2d.ShaderJoint.prototype */
        {
            Extends : ss2d.ShaderBasis,
            initialize : function()
            {
                ss2d.ShaderJoint.Super.call(this);
                this.vertexShader = this.getShader(ss2d.Stage2D.gl,
                    this.basisVertexHead+
                    "varying vec2 jointListvarying;"+
                    "attribute vec2 jointList;"+
                    "void main(void) {"+
                    "jointListvarying=jointList;"+
                    this.basisVertexEnd,
                    "vs");

                this.fragmentShader = this.getShader(ss2d.Stage2D.gl,
                    "precision mediump float;"+
                        "varying vec2 vTextureUV;"+
                        "varying vec2 jointListvarying;"+
                        "varying vec4 vVertexColor;"+
                        "uniform sampler2D texture_0;"+
                        "uniform sampler2D texture_1;"+
                        "uniform sampler2D texture_2;"+
                        "uniform sampler2D texture_3;"+
                        "uniform sampler2D texture_4;"+
                        "uniform sampler2D texture_5;"+
                        "uniform sampler2D texture_6;"+
                        "uniform sampler2D texture_7;"+
                        "void main(void) {"+
                        "if(jointListvarying.x==0.0)"+
                        "{"+
                            "gl_FragColor = texture2D(texture_0,vTextureUV)*vVertexColor;"+
                        "}else if(jointListvarying.x==1.0)"+
                        "{"+
                            "gl_FragColor = texture2D(texture_1,vTextureUV)*vVertexColor;"+
                        "}else if(jointListvarying.x==2.0)"+
                        "{"+
                            "gl_FragColor = texture2D(texture_2,vTextureUV)*vVertexColor;"+
                        "}else if(jointListvarying.x==3.0)"+
                        "{"+
                            "gl_FragColor = texture2D(texture_3,vTextureUV)*vVertexColor;"+
                        "}else if(jointListvarying.x==4.0)"+
                        "{"+
                            "gl_FragColor = texture2D(texture_4,vTextureUV)*vVertexColor;"+
                        "}else if(jointListvarying.x==5.0)"+
                        "{"+
                            "gl_FragColor = texture2D(texture_5,vTextureUV)*vVertexColor;"+
                        "}else if(jointListvarying.x==6.0)"+
                        "{"+
                            "gl_FragColor = texture2D(texture_6,vTextureUV)*vVertexColor;"+
                        "}else if(jointListvarying.x==7.0)"+
                        "{"+
                            "gl_FragColor = texture2D(texture_7,vTextureUV)*vVertexColor;"+
                        "}"+
                        "}",
                    "fs");
                this.newShader();
            },

            upDataShader : function(scene)
            {

                ss2d.Stage2D.gl.useProgram(this.shaderProgram);
                this.upDataMatrix();
                this.upDataVertex(scene);
                this.upDataCache(scene);

                if(!scene.m_isJoint)
                {
                    ss2d.Stage2D.gl.activeTexture(ss2d.Stage2D.gl.TEXTURE0);
                    ss2d.Stage2D.gl.bindTexture(ss2d.Stage2D.gl.TEXTURE_2D, scene.m_texture.texture);
                    ss2d.Stage2D.gl.uniform1i(ss2d.Stage2D.gl.getUniformLocation(this.shaderProgram,"texture_0"),0);
                }
                else
                {
                    for(var i = 0;i < scene.m_texture.length; i++)
                    {
                        ss2d.Stage2D.gl.activeTexture(ss2d.Stage2D.gl.TEXTURE0+i);
                        ss2d.Stage2D.gl.bindTexture(ss2d.Stage2D.gl.TEXTURE_2D, scene.m_texture[i].texture);
                        ss2d.Stage2D.gl.uniform1i(ss2d.Stage2D.gl.getUniformLocation(this.shaderProgram,"texture_"+i), i);
                    }
                }

                //推送拼接缓存到WEBGL状态机
                ss2d.Stage2D.gl.bindBuffer(ss2d.Stage2D.gl.ARRAY_BUFFER, scene.verticesJointBuffer);
                //上传拼接数据到顶点缓存
                ss2d.Stage2D.gl.bufferData(ss2d.Stage2D.gl.ARRAY_BUFFER, scene.m_jointList, ss2d.Stage2D.gl.STREAM_DRAW);

                //上传拼接数据的缓存到着色器
                ss2d.Stage2D.gl.bindBuffer(ss2d.Stage2D.gl.ARRAY_BUFFER, scene.verticesJointBuffer);
                //第一个参数为绑定的寄存器,每个顶点的数据长度为2,浮点型,它会自动帮我们区分,然后是不启用法线辅助功能,间隔为0
                ss2d.Stage2D.gl.vertexAttribPointer(this.shaderProgram.verticesjointAttribute,2, ss2d.Stage2D.gl.FLOAT, false, 0, 0);
            }
        }
    );
})();