/**
 * TextField.js
 *
 * HTML5游戏开发者社区 QQ群:326492427 127759656 Email:siriushtml5@gmail.com
 * Copyright (c) 2014 Sirius2D www.Sirius2D.com www.html5gamedev.org
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

/**
 * GPU文本系统,测试阶段
 */
(function()
{
    /**
     * TextField 文字处理类，目前为测试版本。
     * <br />演示地址:http://sirius2d.com/demos/d_42/
     * @class
     */
    ss2d.TextField = Class
    (

        /** @lends ss2d.TextField.prototype */
        {
            Extends:ss2d.MovieClip,
            m_textCanvas:null,
            m_textStyle:null,
            m_texture:null,
            m_text:null,
            m_size:30,
            m_typeface:"黑体",
            m_textColor:"rgb(200,0,0)",
            m_alpha:null,
            m_font:"",
            m_width:null,
            m_height:null,
            initialize : function(w,h)
            {
                this.m_alpha=1;
                this.m_textCanvas=document.createElement("canvas");
                if(w)
                {
                    this.m_textCanvas.width=w;
                    this.m_width=w;
                }else
                {
                    this.m_textCanvas.width=256;
                    this.m_width=256;
                }
                if(h)
                {
                    this.m_textCanvas.height=h;
                    this.m_height=h;
                }else
                {
                    this.m_textCanvas.height=256;
                    this.m_height=256;
                }

                this.m_textStyle=this.m_textCanvas.getContext("2d");
                this.m_textStyle.textBaseline="middle";
                this.m_textStyle.font=this.m_size+"px "+this.m_typeface;
                this.m_texture=new ss2d.Texture(this.m_textCanvas);
                this.init(this.m_texture);
            },

            /**
             * 设置字体大小
             * @param value
             */
            setFontSize:function(value)
            {
                this.m_size=value;
                this.m_font=this.m_size+"px "+this.m_typeface;

            },

            /**
             * 获得字体大小
             * @return {Number}
             */
            getFontSize:function()
            {
                return this.m_size;
            },

            /**
            *设置文本内容
            *@param text {String}
            *@param x {number}
            *@param y {number}
            */
            setText:function(text,x,y)
            {
                this.m_textStyle.clearRect(0,0,this.m_width,this.m_height);
                this.m_textStyle.font=this.m_font;
                this.m_textStyle.globalAlpha=this.m_alpha;
                this.m_textStyle.fillStyle=this.m_textColor;
                this.m_text=text;
                if(x)
                {
                    this.m_textStyle.fillText(text,x,0+this.m_size/2);
                }else if(x&&y)
                {
                    this.m_textStyle.fillText(text,x,y+this.m_size/2);
                }else
                {
                    this.m_textStyle.fillText(text,0,0+this.m_size/2);
                }

                this.m_texture.dispose();
                this.m_texture.newCanvas(this.m_textCanvas,0x2901,0x2901,0x2601,0x2601);
            },

            /**
             * 获得文字内容
             * @return {*}
             */
            getText:function()
            {
              return this.m_text;
            },


            
            /**
            *设置文本字体
            *@param font {String}
            */
            setTypefac:function(font)
            {
                this.m_typeface = font;
                this.m_font=this.m_size+"px "+this.m_typeface;

            },

            /**
             * 获得文本字体
             * @return {String}
             */
            getTypefac:function()
            {
                return this.m_typeface;
            },

            /**
            *设置字体颜色
            *@param fontStyle {String}
            */
            setColor:function(r,g,b)
            {
                this.m_textColor = "rgb("+parseInt(255*r)+","+parseInt(255*g)+","+parseInt(255*b)+")";

            },

            /**
            *设置文本透明度
            *@param alpha {number}
            */  
            setAlpha:function(alpha)
            {
                this.m_alpha=alpha;

            },

            /**
             * 获得文本透明度
             * @return {*|Number}
             */
            getAlpha:function()
            {
                return this.m_alpha;
            }
        }
    );
})();