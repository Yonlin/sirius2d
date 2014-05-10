/**
 * ShaderBasis.js
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
     * ShaderBasis 基础效果着色器
     * @class
     */
    ss2d.ShaderBasis = Class
    (
        /** @lends ss2d.ShaderBasis.prototype */
        {

            basisVertexHead:null,
            basisVertexStart:null,
            basisVertexEnd:null,


            basisPixelHead:null,
            basisPixelStart:null,
            basisPixelEnd:null,


            //获取顶点着色器
            vertexShader : null,

            //获取像素着色器
            fragmentShader : null,


            orMatrix : null,

            fuseMatrix3D:null,

            initialize : function()
            {
                this.orMatrix=[0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0],

                this.basisVertexHead=
                    "precision mediump float;"+
                    "attribute vec2 aVertexPosition;"+
                    "attribute vec2 aTextureUV;"+
                    "attribute vec2 aVertexGPU;"+
                    "attribute vec4 aVertexColor;"+
                    "varying vec2 vTextureUV;"+
                    "varying vec4 vVertexColor;"+
                    "uniform mat4 oRMatrix;";
                   // "uniform sampler2D texture;";
                this.basisVertexStart=
                    "void main(void) {";
                this.basisVertexEnd=
                    "vTextureUV = aTextureUV;"+
                    "vVertexColor=aVertexColor;"+
                     //"vec4 map=texture2D(texture,aTextureUV);"+
                    "gl_Position =  oRMatrix*vec4(aVertexPosition+aVertexGPU,1.0,1.0);"+
                    "}";

                this.basisPixelHead=
                    "precision mediump float;"+
                    "varying vec2 vTextureUV;"+
                    "varying vec4 vVertexColor;"+
                    "uniform sampler2D texture;"
                this.basisPixelStart=
                    "void main(void) {";
                this.basisPixelEnd=
                    "gl_FragColor = texture2D(texture,vTextureUV)*vVertexColor;"+
                    "}";
            },

            dispose:function()
            {
                //st = smoothstep (0.001,0.001,sqrt(dot(vec2(sin(time) * 0.5,cos(time) * 0.3), vec2(sin(time) * 0.5,cos(time) * 0.3))));
                ss2d.Stage2D.gl.deleteShader(this.vertexShader);
                ss2d.Stage2D.gl.deleteShader(this.fragmentShader);
                ss2d.Stage2D.gl.deleteProgram(this.shaderProgram);
                this.vertexShader=null;
                this.fragmentShader=null;
                this.shaderProgram=null;
            },

            newShader:function()
            {
                //创建一个着色器程序
                this.shaderProgram = ss2d.Stage2D.gl.createProgram();
                //把顶点着色器上传到这个着色器程序里
                ss2d.Stage2D.gl.attachShader(this.shaderProgram,this.vertexShader);
                //把像素着色器上传到这个着色器程序里
                ss2d.Stage2D.gl.attachShader(this.shaderProgram,this.fragmentShader);
                //链接这个着色器
                ss2d.Stage2D.gl.linkProgram(this.shaderProgram);
                //如果你创建失败了,那你又写错代码了
                if (!ss2d.Stage2D.gl.getProgramParameter(this.shaderProgram, ss2d.Stage2D.gl.LINK_STATUS))
                {
                    alert("Could not initialise shaders");
                }
                //把这个着色器上传到GPU
                ss2d.Stage2D.gl.useProgram(this.shaderProgram);
                this.shaderProgram.vertexPositionAttribute = ss2d.Stage2D.gl.getAttribLocation(this.shaderProgram, "aVertexPosition");
                ss2d.Stage2D.gl.enableVertexAttribArray(this.shaderProgram.vertexPositionAttribute);

                this.shaderProgram.textureCoordAttribute = ss2d.Stage2D.gl.getAttribLocation(this.shaderProgram, "aTextureUV");
                ss2d.Stage2D.gl.enableVertexAttribArray(this.shaderProgram.textureCoordAttribute);

                this.shaderProgram.vertexGPUAttribute = ss2d.Stage2D.gl.getAttribLocation(this.shaderProgram, "aVertexGPU");
                ss2d.Stage2D.gl.enableVertexAttribArray(this.shaderProgram.vertexGPUAttribute);

                this.shaderProgram.verticesColourAttribute = ss2d.Stage2D.gl.getAttribLocation(this.shaderProgram, "aVertexColor");
                ss2d.Stage2D.gl.enableVertexAttribArray(this.shaderProgram.verticesColourAttribute);

                ss2d.orthographicViewportMatrix(this.orMatrix,
                    -ss2d.Stage2D.ratio - ss2d.Stage2D.ratio,
                    ss2d.Stage2D.ratio - ss2d.Stage2D.ratio,
                    2,0, 0, 1);
            },



            setTransform:function(value)
            {
                this.fuseMatrix3D=value;
            },


            upDataMatrix:function()
            {
                //计算正交视口矩阵
                if(this.fuseMatrix3D!=null)
                {
                    ss2d.orthographicViewportMatrix(this.orMatrix,
                        -ss2d.Stage2D.ratio - ss2d.Stage2D.ratio,
                        ss2d.Stage2D.ratio - ss2d.Stage2D.ratio,
                        2,0, 0, 1);
                    this.orMatrix=this.fuseMatrix3D.add4x4(this.orMatrix,this.fuseMatrix3D.rawData);
                }
            },


            upDataTexture:function(scene)
            {
                ss2d.Stage2D.gl.activeTexture(ss2d.Stage2D.gl.TEXTURE0);
                ss2d.Stage2D.gl.bindTexture(ss2d.Stage2D.gl.TEXTURE_2D, scene.m_texture.texture);
                ss2d.Stage2D.gl.uniform1i(ss2d.Stage2D.gl.getUniformLocation(this.shaderProgram,"texture"),0);
            },


            upDataVertex:function(scene)
            {
                //推送GPU加速顶点坐标缓存到WEBGL状态机
                ss2d.Stage2D.gl.bindBuffer(ss2d.Stage2D.gl.ARRAY_BUFFER, scene.verticesGPUBuffer);
                //上传顶点坐标数据到顶点缓存
                ss2d.Stage2D.gl.bufferData(ss2d.Stage2D.gl.ARRAY_BUFFER, scene.m_verticesGPUList, ss2d.Stage2D.gl.STREAM_DRAW);


                //推送顶点坐标缓存到WEBGL状态机
                ss2d.Stage2D.gl.bindBuffer(ss2d.Stage2D.gl.ARRAY_BUFFER, scene.vertexPositionBuffer);
                //上传顶点坐标数据到顶点缓存
                ss2d.Stage2D.gl.bufferData(ss2d.Stage2D.gl.ARRAY_BUFFER, scene.m_verticesList, ss2d.Stage2D.gl.STREAM_DRAW);


                //推送UV缓存到WEBGL状态机
                ss2d.Stage2D.gl.bindBuffer(ss2d.Stage2D.gl.ARRAY_BUFFER, scene.vertexTextureUvdBuffer);
                //上传顶点UV数据到顶点缓存
                ss2d.Stage2D.gl.bufferData(ss2d.Stage2D.gl.ARRAY_BUFFER, scene.m_uvList, ss2d.Stage2D.gl.STREAM_DRAW);


                //推送颜色缓存到WEBGL状态机
                ss2d.Stage2D.gl.bindBuffer(ss2d.Stage2D.gl.ARRAY_BUFFER, scene.verticesColorBuffer);
                //上传顶点颜色数据到顶点缓存
                ss2d.Stage2D.gl.bufferData(ss2d.Stage2D.gl.ARRAY_BUFFER, scene.m_colorList, ss2d.Stage2D.gl.STREAM_DRAW);

                ss2d.Stage2D.gl.bindBuffer(ss2d.Stage2D.gl.ELEMENT_ARRAY_BUFFER, scene.vertexIndexBuffer);
                ss2d.Stage2D.gl.bufferData(ss2d.Stage2D.gl.ELEMENT_ARRAY_BUFFER, scene.m_indexList, ss2d.Stage2D.gl.STATIC_DRAW);
            },


            upDataCache:function(scene)
            {
                //上传顶点坐标数据的缓存到着色器
                ss2d.Stage2D.gl.bindBuffer(ss2d.Stage2D.gl.ARRAY_BUFFER,scene.verticesGPUBuffer);
                //第一个参数为绑定的寄存器,每个顶点的数据长度为2,浮点型,它会自动帮我们区分,然后是不启用法线辅助功能,间隔为0
                ss2d.Stage2D.gl.vertexAttribPointer(this.shaderProgram.vertexGPUAttribute,2, ss2d.Stage2D.gl.FLOAT, false, 0, 0);


                //上传顶点坐标数据的缓存到着色器
                ss2d.Stage2D.gl.bindBuffer(ss2d.Stage2D.gl.ARRAY_BUFFER,scene.vertexPositionBuffer);
                //第一个参数为绑定的寄存器,每个顶点的数据长度为2,浮点型,它会自动帮我们区分,然后是不启用法线辅助功能,间隔为0
                ss2d.Stage2D.gl.vertexAttribPointer(this.shaderProgram.vertexPositionAttribute,2, ss2d.Stage2D.gl.FLOAT, false, 0, 0);


                //推送UV信息到WEBGL状态机
                ss2d.Stage2D.gl.bindBuffer(ss2d.Stage2D.gl.ARRAY_BUFFER, scene.vertexTextureUvdBuffer);
                //上传顶点UV数据的缓存到着色器
                ss2d.Stage2D.gl.vertexAttribPointer(this.shaderProgram.textureCoordAttribute,2, ss2d.Stage2D.gl.FLOAT, false, 0, 0);


                //推送颜色信息到WEBGL状态机
                ss2d.Stage2D.gl.bindBuffer(ss2d.Stage2D.gl.ARRAY_BUFFER, scene.verticesColorBuffer);
                //上传顶点颜色数据的缓存到着色器
                ss2d.Stage2D.gl.vertexAttribPointer(this.shaderProgram.verticesColourAttribute,4, ss2d.Stage2D.gl.FLOAT, false, 0, 0);

                //上传正交矩阵到着色器,不需要归一化
                ss2d.Stage2D.gl.uniformMatrix4fv(ss2d.Stage2D.gl.getUniformLocation(this.shaderProgram, "oRMatrix"),false,this.orMatrix);
            },


            upDataShader : function(scene)
            {
                ss2d.Stage2D.gl.useProgram(this.shaderProgram);

                this.upDataMatrix();
                this.upDataTexture(scene);
                this.upDataVertex(scene);
                this.upDataCache(scene);

            },

            //创建着色器
            getShader : function(gl, code,type) 
            {
                    var shader;
                    if (type=="fs")
                    {
                        shader = ss2d.Stage2D.gl.createShader(ss2d.Stage2D.gl.FRAGMENT_SHADER);
                    }
                    else if (type=="vs") {
                        shader = ss2d.Stage2D.gl.createShader(ss2d.Stage2D.gl.VERTEX_SHADER);
                    }
                    else
                    {
                        return null;
                    }
                    //绑定着色器字符串到到着色器里
                    ss2d.Stage2D.gl.shaderSource(shader, code);
        
                    //编译这个着色器,就是生成这段程序
                    ss2d.Stage2D.gl.compileShader(shader);
        
                    //如果创建不成功,那就是你写错代码了
                    if (!ss2d.Stage2D.gl.getShaderParameter(shader, ss2d.Stage2D.gl.COMPILE_STATUS)) {
                        alert(ss2d.Stage2D.gl.getShaderInfoLog(shader));
                        return null;
                    }

                    //最后返回出这个着色器
                    return shader;
                }
            }
    );
})();