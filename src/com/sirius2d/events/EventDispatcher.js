/**
 * EventDispatcher.js
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
     * EventDispatcher 事件处理器基类
     * @class
     * @param {String} type
     * @param {Boolean} bubbles
     * @param {Boolean} cancelable
     */
    ss2d.EventDispatcher = Class
     (
         /** @lends ss2d.EventDispatcher.prototype */
        {
            STATIC:
            {
                ////////////////////////////////////////////////////////////////////////////
                // public static methods
                ////////////////////////////////////////////////////////////////////////////

                initialize: function(target)
                {
                    var p = ss2d.EventDispatcher.prototype;
                    target.addEventListener = p.addEventListener;
                    target.on = p.on;
                    target.removeEventListener = target.off =  p.removeEventListener;
                    target.removeAllEventListeners = p.removeAllEventListeners;
                    target.hasEventListener = p.hasEventListener;
                    target.dispatchEvent = p.dispatchEvent;
                    target._dispatchEvent = p._dispatchEvent;
                }
            },

            //////////////////////////////////////////////////////////////////////////
            //  private property
            //////////////////////////////////////////////////////////////////////////

            _listeners : null,
            _captureListeners : null,

            ////////////////////////////////////////////////////////////////////////////
            //  constructor
            ////////////////////////////////////////////////////////////////////////////

            initialize : function()
            {

            },

            ////////////////////////////////////////////////////////////////////////////
            //  public methods
            ////////////////////////////////////////////////////////////////////////////

            /**
             * 侦听事件
             * @param type 事件类型
             * @param listener 事件执行函数
             * @param useCapture 事件执行循序
             * @return {*}
             */
            addEventListener : function(type, listener, useCapture)
            {
                var listeners;
                if (useCapture)
                {
                    listeners = this._captureListeners = this._captureListeners||{};
                }
                else
                {
                    listeners = this._listeners = this._listeners||{};
                }
                var arr = listeners[type];
                if (arr) { this.removeEventListener(type, listener, useCapture); }
                arr = listeners[type]; // remove may have deleted the array
                if (!arr) { listeners[type] = [listener];  }
                else { arr.push(listener); }
                return listener;
            },

            /**
             * 删除事件
             * @param type 事件类型
             * @param listener 事件执行函数
             * @param useCapture 事件执行循序
             */
            removeEventListener : function(type, listener, useCapture)
            {
                var listeners = useCapture ? this._captureListeners : this._listeners;
                if (!listeners) { return; }
                var arr = listeners[type];
                if (!arr) { return; }
                for (var i=0,l=arr.length; i<l; i++)
                {
                    //ss2d.log(arr[i],listener,arr[i] == listener);
                    if (arr[i] == listener) {
                        if (l==1) { delete(listeners[type]); } // allows for faster checks.
                        else { arr.splice(i,1); }
                        break;
                    }
                }
            },

            /**
             * 清除所有事件
             * @param type 事件类型
             */
            removeAllEventListeners : function(type)
            {
                if (!type) { this._listeners = this._captureListeners = null; }
                else {
                    if (this._listeners) { delete(this._listeners[type]); }
                    if (this._captureListeners) { delete(this._captureListeners[type]); }
                }
            },

            /**
             * 设置加载事件
             * @param type
             * @param listener
             * @param scope
             * @param once
             * @param data
             * @param useCapture
             * @return {*}
             */
            on : function(type, listener, scope, once, data, useCapture)
            {
                if (listener.handleEvent)
                {
                    scope = scope||listener;
                    listener = listener.handleEvent;
                }
                scope = scope||this;
                return this.addEventListener(type, function(evt)
                {
                    listener.call(scope, evt, data);
                    once&&evt.remove();
                }, useCapture);
            },

            off : this.removeEventListener,

            /**
             * 发送事件
             * @param eventObj 事件消息体
             * @param target 事件目标
             * @return {*}
             */
            dispatchEvent : function(eventObj, target)
            {
                if (typeof eventObj == "string")
                {
                    // won't bubble, so skip everything if there's no listeners:
                    var listeners = this._listeners;
                    if (!listeners || !listeners[eventObj]) { return false; }
                    eventObj = new ss2d.Event(eventObj);
                }
                // TODO: deprecated. Target param is deprecated, only use case is MouseEvent/mousemove, remove.
                eventObj.target = target||this;

                if (!eventObj.bubbles || !this.parent)
                {
                    this._dispatchEvent(eventObj, 2);
                }
                else
                {
                    var top=this, list=[top];
                    while (top.parent) { list.push(top = top.parent); }
                    var i, l=list.length;

                    // capture & atTarget
                    for (i=l-1; i>=0 && !eventObj.propagationStopped; i--)
                    {
                        list[i]._dispatchEvent(eventObj, 1+(i==0));
                    }
                    // bubbling
                    for (i=1; i<l && !eventObj.propagationStopped; i++)
                    {
                        list[i]._dispatchEvent(eventObj, 3);
                    }
                }
                return eventObj.defaultPrevented;
            },

            /**
             * 检测是否存在相应的事件
             * @param type 事件类型
             * @return {Boolean}
             */
            hasEventListener : function(type)
            {
                var listeners = this._listeners, captureListeners = this._captureListeners;
                return !!((listeners && listeners[type]) || (captureListeners && captureListeners[type]));
            },

            toString : function()
            {
                return "[EventDispatcher]";
            },

            ////////////////////////////////////////////////////////////////////////////
            //  private methods
            ////////////////////////////////////////////////////////////////////////////

            _dispatchEvent : function(eventObj, eventPhase)
            {
                var l, listeners = (eventPhase==1) ? this._captureListeners : this._listeners;
                if (eventObj && listeners)
                {
                    var arr = listeners[eventObj.type];
                    if (!arr||!(l=arr.length)) { return; }
                    eventObj.currentTarget = this;
                    eventObj.eventPhase = eventPhase;
                    eventObj.removed = false;
                    arr = arr.slice(); // to avoid issues with items being removed or added during the dispatch
                    for (var i=0; i<l && !eventObj.immediatePropagationStopped; i++)
                    {
                        var o = arr[i];
                        if (o.handleEvent) { o.handleEvent(eventObj); }
                        else { o(eventObj); }
                        if (eventObj.removed)
                        {
                            this.off(eventObj.type, o, eventPhase==1);
                            eventObj.removed = false;
                        }
                    }
                }
            }
        }
     );
})();