/**
 * Event.js
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
    ss2d.MessageData = Class
    (
        {

            /**
             * 内部消息库
             */
           eventsList:null,

            initialize : function()
            {
                ss2d.MessageList.getInstance().addEventObject(this);
            },

            /**
             * 执行某个函数
             * @param	event
             * @param	e
             */
            execute:function(type,message)
            {

                this.eventsList[type](message);
            },

            /**
             * 检测消息列表是否存在这条消息
             * @return
             */
            getEvents:function(type)
            {
                if (this.eventsList == null)
                {
                    return false;
                }
                if (this.eventsList[type] != null)
                {
                    return true
                }


                return false;
            },

            /**
             * 消息侦听器
             * @param	event
             * @param	fun
             */
            addEventMessage:function(type,fun)
            {

                if(this.eventsList == null)
                {
                    this.eventsList = [];
                }
                this.eventsList[type] = fun;
            },

            /**
             * 销毁所有事件
             */
            disposeEvent:function()
            {
                for(var i in this.eventsList){
                delete this.eventsList[i];
            }
                this.eventsList = null;
            },

            /**
             * 移除事件侦听
             * @param	event
             */
            removeEventMessage:function(type)
            {
                if (this.eventsList!=null)
                {
                    this.eventsList[type] = null;
                }
            }

        }
    );
})();