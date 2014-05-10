/**
 * MouseEvent.js
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
     * MouseEvent 鼠标事件侦听事件类
     * @class
     * @param {String} type
     * @param {Boolean} bubbles
     * @param {Boolean} cancelable
     */
    ss2d.MouseEvent = Class
    (
        /** @lends ss2d.MouseEvent.prototype */
        {
            Extends: ss2d.Event,

            STATIC:
            {
                /** @lends ss2d.MouseEvent */

                /**
                 * 鼠标按下事件
                 */
                MOUSE_DOWN:"mouse_down",

                /**
                 * 鼠标松开事件
                 */
                MOUSE_UP:"mouse_up",

                /**
                 * 鼠标移动事件
                 */
                MOUSE_MOVE:"mouse_move"
            },

            //////////////////////////////////////////////////////////////////////////
            //  public property
            //////////////////////////////////////////////////////////////////////////

            /**
             * 当前鼠标在舞台上的X坐标
             */
            stageX : 0,

            /**
             * 当前鼠标在舞台上的Y坐标
             */
            stageY : 0,

            ////////////////////////////////////////////////////////////////////////////
            //  constructor
            ////////////////////////////////////////////////////////////////////////////

            initialize : function(type, bubbles, cancelable, stageX, stageY)
            {
                ss2d.MouseEvent.Super.call(this, type, bubbles, cancelable);
                this.stageX = stageX;
                this.stageY = stageY;
            },

            ////////////////////////////////////////////////////////////////////////////
            //  public methods
            ////////////////////////////////////////////////////////////////////////////

            clone : function()
            {
                return new MouseEvent(this.type, this.bubbles, this.cancelable, this.stageX, this.stageY);
            },

            toString : function()
            {
                return "[MouseEvent (type="+this.type+" stageX=" + this.stageX + " stageY=" + this.stageY + ")]";
            }
        }
    );
})();