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
    /**
     * Broadcast 事件发射器
     * @class
     */
    ss2d.Broadcast = Class
    (
        {
            STATIC:
            {
                /** @lends ss2d.Broadcast.prototype */

                /**
                 * 发送消息
                 * @param type 消息类型
                 * @param message 消息体
                 */
                send : function(type,message)
                {
                    if (message != null)
                    {
                        message.type = event;
                    }

                    for (var i = 0; i < ss2d.MessageList.getInstance().eventMessageList.length;i++)
                    {

                        if (ss2d.MessageList.getInstance().eventMessageList[i].getEvents(type))
                        {
                            ss2d.MessageList.getInstance().eventMessageList[i].execute(type,message)
                        }
                    }

                }
            }

        }
    );
})();