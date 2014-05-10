/**
 * Timer.js
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
     * 计时器类 用于设置间隔执行的函数或者事件。
     * @type {Class}
     */
    ss2d.Timer = Class
    (
        /** @lends ss2d.Timer.prototype */
        {
            Extends: ss2d.EventDispatcher,
            
            //////////////////////////////////////////////////////////////////////////
            //  private property
            //////////////////////////////////////////////////////////////////////////

            m_delay: 0,
            m_repeatCount: 0,
            m_interval: null,
            m_running: false,
            m_currentCount: 0,

            ////////////////////////////////////////////////////////////////////////////
            //  constructor
            ////////////////////////////////////////////////////////////////////////////

            initialize: function (delay, repeatCount)
            {
                this.m_delay = delay;
		        this.m_repeatCount = repeatCount || 0;
                this.m_interval = null;
                this.m_running = false;
                this.m_currentCount = 0;
            },
            
            ////////////////////////////////////////////////////////////////////////////
            //  Additional getters and setters
            ////////////////////////////////////////////////////////////////////////////

            getRepeatCount : function()
            {
                return this.m_repeatCount;
            },
            
            getCurrentCount : function()
            {
                return this.m_currentCount;
            },
            
            getRunning : function()
            {
                return this.m_running;
            },

            ////////////////////////////////////////////////////////////////////////////
            //  public methods
            ////////////////////////////////////////////////////////////////////////////

            /**
             * 如果计时器正在运行，则停止计时器，并将 currentCount 属性设回为 0，这类似于秒表的重置按钮。
             * 然后，在调用 start() 后，将运行计时器实例，运行次数为指定的重复次数（由 repeatCount 值设置）。
             */
            reset: function()
            {
                this.stop(true);
            },
            
            /**
             * 如果计时器尚未运行，则启动计时器。
             */
            start: function()
            {
                if(this.m_running)
                {
                    return;
                }
                this.m_running = true;

                var self = this;
                this.m_interval = setInterval(function(){ self._iterate() }, this.m_delay);
            },
            
            /**
             * 停止计时器。如果在调用 stop() 后调用 start()，
             * 则将继续运行计时器实例，运行次数为剩余的 重复次数（由 repeatCount 属性设置）。
             * @param {boolean} clearCount 是否清除计时器
             */
            stop: function(clearCount)
            {
                this.m_running = false;

                if(clearCount)
                {
                    this.m_currentCount = 0;
                }
                if(this.m_interval)
                {
                    clearInterval(this.m_interval);
                }
            },
            
            /**
             * 迭代
             */
            _iterate: function()
            {
                this.m_currentCount++;
                if(!this.m_repeatCount || this.m_currentCount <= this.m_repeatCount)
                {
                    this.dispatchEvent(ss2d.TimerEvent.TIMER);
                    if(this.m_currentCount == this.m_repeatCount)
                    {
                        this.dispatchEvent(ss2d.TimerEvent.TIMER_COMPLETE);
                    }
                }
                else
                {
                    this.stop(false);
                }
            }
        }
    );
})();