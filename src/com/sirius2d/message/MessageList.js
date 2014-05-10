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
    ss2d.MessageList = Class
    (
        {
            STATIC:
            {
                _instance:null,
                /**
                 *
                 */
                getInstance : function()
                {
                    ss2d.log(ss2d.MessageList._instance);
                    if(ss2d.MessageList._instance==null)
                    {
                        ss2d.MessageList._instance=new ss2d.MessageList();
                    }
                    return ss2d.MessageList._instance;
                }
            },

            /**
             * 消息列表
             */
            eventMessageList:null,
            initialize : function()
            {
                this.eventMessageList=[];
            },

            /**
             * 删除时间对象
             * @param	e
             */
            removeEventObject:function(e)
            {
                var index = this.eventMessageList.indexOf(e)
                if(index!=-1)
                this.eventMessageList.splice(index,1)
            },

            /**
             * 添加事件对象
             * @param	e
             */
            addEventObject:function(e)
            {
                var index = this.eventMessageList.indexOf(e);
                if (index == -1)
                {
                    this.eventMessageList.push(e);
                }
            }
        }
    );
})();