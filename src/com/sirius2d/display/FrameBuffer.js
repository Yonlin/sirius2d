/**
 * FrameBuffer.js
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

(function()
{
    /**
     * 帧缓存类 用于后处理的必须类，使用它可以把当前屏幕的内容拷贝到一张特定的纹理上，用于做后期的屏幕特效。
     * <br />演示地址：http://sirius2d.com/demos/d_37/
     * @class
     */
    ss2d.FrameBuffer = Class
    (
        /** @lends ss2d.FrameBuffer.prototype */
        {
            _frameBuff:null,
            _sceneList:null,
            _clear:true,


            initialize : function()
            {
                this._sceneList=[];
            },

            /**
             * 设置显示缓存
             * <br />display the frame buffer
             * @param {boolean}
             */
            setDisplay:function(value)
            {
                this._frameBuff=value;
            },

            /**
             * 获取帧缓存
             * <br />get frame buffer
             * @param {boolean}
             */
            getFrameBuff:function()
            {
                return this._frameBuff;
            },

            /**
             * 是否清理画面
             * <br />set a boolean value that indicates whether the scene is cleaned up
             * @param value
             */
            isClear:function(value)
            {
                this._clear=value;
            },

            /**
             * 添加到显示列表
             * <br />add object to the scene list
             * @param {ss2d.Scene} child 显示对象
             */
            addChild:function(child)
            {
                this._sceneList.push(child);
            },

            /**
             * 从显示列表删除显示对象
             * <br />remove object to the scene list
             * @param {ss2d.Scene} child 显示对象
             */
            removeChild:function(child)
            {
                var index=this._sceneList.indexOf(child);
                if(index!=-1)
                {
                    this._sceneList.splice(index,1);
                }

            },

            paint:function()
            {
                for(var i=0;i<this._sceneList.length;i++)
                {
                    this._sceneList[i].paint();
                }
            }
        }
    );
})();