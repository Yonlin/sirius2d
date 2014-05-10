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
    ss2d.Event = Class
    (
        {
            STATIC:
            {
                INITIALIZE:"initialtze",
                ADDED:"added",
                REMOVED:"removed",
                ADDED_TO_STAGE:"added_to_stage",
                REMOVED_FROM_STAGE:"removed_from_stage",
                ENTER_FRAME: "enter_frame",
                COMPLETE:"complete"
            },

            //////////////////////////////////////////////////////////////////////////
            //  public property
            //////////////////////////////////////////////////////////////////////////

            type : null,
            target : null,
            currentTarget : null,
            eventPhase : 0,
            bubbles : false,
            cancelable : false,
            timeStamp : 0,
            defaultPrevented : false,
            propagationStopped : false,
            immediatePropagationStopped : false,
            removed : false,

            ////////////////////////////////////////////////////////////////////////////
            //  constructor
            ////////////////////////////////////////////////////////////////////////////

            /**
             *
             */
            initialize : function(type, bubbles, cancelable)
            {
                this.type = type;
                this.bubbles = bubbles;
                this.cancelable = cancelable;
                this.timeStamp = (new Date()).getTime();
            },

            ////////////////////////////////////////////////////////////////////////////
            //  public methods
            ////////////////////////////////////////////////////////////////////////////

            preventDefault : function()
            {
                this.defaultPrevented = true;
            },

            stopPropagation : function()
            {
                this.propagationStopped = true;
            },

            stopImmediatePropagation : function()
            {
                this.immediatePropagationStopped = this.propagationStopped = true;
            },

            remove : function()
            {
                this.removed = true;
            },

            clone : function()
            {
                return new ss2d.Event(this.type, this.bubbles, this.cancelable);
            },

            toString : function()
            {
                return "[events (type=" + this.type + ")]";
            }
        }
    );
})();