/**
 * AbstractLoader.js
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
    ss2d.AbstractLoader = Class
    (
        {
            Extends:ss2d.EventDispatcher,

            STATIC:
            {
                //////////////////////////////////////////////////////////////////////////
                //  public static property
                //////////////////////////////////////////////////////////////////////////

                FILE_PATTERN : /^(?:(\w+:)\/{2}(\w+(?:\.\w+)*\/?)|(.{0,2}\/{1}))?([/.]*?(?:[^?]+)?\/)?((?:[^/?]+)\.(\w+))(?:\?(\S+)?)?$/,
                PATH_PATTERN : /^(?:(\w+:)\/{2})|(.{0,2}\/{1})?([/.]*?(?:[^?]+)?\/?)?$/
            },

            //////////////////////////////////////////////////////////////////////////
            //  private property
            //////////////////////////////////////////////////////////////////////////

            _item : null,

            //////////////////////////////////////////////////////////////////////////
            //  public property
            //////////////////////////////////////////////////////////////////////////

            loaded : false,
            canceled : false,
            progress : 0,

            ////////////////////////////////////////////////////////////////////////////
            //  constructor
            ////////////////////////////////////////////////////////////////////////////

            initialize:function()
            {

            },

            ////////////////////////////////////////////////////////////////////////////
            //  public methods
            ////////////////////////////////////////////////////////////////////////////

            getItem : function()
            {
                return this._item;
            },

            load : function()
            {

            },

            close : function()
            {

            },

            buildPath : function(src, data)
            {
                if (data == null) return src;
                var query = [];
                var idx = src.indexOf('?');
                if (idx != -1)
                {
                    var q = src.slice(idx+1);
                    query = query.concat(q.split('&'));
                }
                if (idx != -1)
                {
                    return src.slice(0, idx) + '?' + this._formatQueryString(data, query);
                }
                else
                {
                    return src + '?' + this._formatQueryString(data, query);
                }
            },

            ////////////////////////////////////////////////////////////////////////////
            //  private methods
            ////////////////////////////////////////////////////////////////////////////

            _isCanceled : function()
            {
                if (window.ss2d == null || this.canceled)
                {
                    return true;
                }
                return false;
            },

            _sendLoadStart : function()
            {
                if (this._isCanceled()) { return; }
                this.dispatchEvent("loadstart");
            },

            _sendProgress : function(value)
            {
                if (this._isCanceled()) { return; }
                var event = null;
                if (typeof(value) == "number")
                {
                    this.progress = value;
                    event = new ss2d.Event("progress");
                    event.loaded = this.progress;
                    event.total = 1;
                }
                else
                {
                    event = value;
                    this.progress = value.loaded / value.total;
                    if (isNaN(this.progress) || this.progress == Infinity) { this.progress = 0; }
                }
                event.progress = this.progress;
                this.hasEventListener("progress") && this.dispatchEvent(event);
            },

            _sendComplete : function()
            {
                if (this._isCanceled()) { return; }
                this.dispatchEvent("complete");
            },

            _sendError : function(event)
            {
                if (this._isCanceled() || !this.hasEventListener("error")) { return; }
                if (event == null)
                {
                    event = new ss2d.Event("error");
                }
                this.dispatchEvent(event);
            },

            _parseURI : function(path)
            {
                if (!path) { return null; }
                return path.match(ss2d.AbstractLoader.FILE_PATTERN);
            },

            _parsePath : function(path)
            {
                if (!path) { return null; }
                return path.match(ss2d.AbstractLoader.PATH_PATTERN);
            },

            _formatQueryString : function(data, query)
            {
                if (data == null)
                {
                    throw new Error('You must specify data.');
                }
                var params = [];
                for (var n in data)
                {
                    params.push(n+'='+escape(data[n]));
                }
                if (query)
                {
                    params = params.concat(query);
                }
                return params.join('&');
            },

            _isCrossDomain : function(item)
            {
                var target = document.createElement("a");
                target.href = item.src;

                var host = document.createElement("a");
                host.href = location.href;

                var crossdomain = (target.hostname != "") &&
                        (target.port != host.port ||
                        target.protocol != host.protocol ||
                        target.hostname != host.hostname);
                return crossdomain;
            },

            _isLocal : function(item)
            {
                var target = document.createElement("a");
                target.href = item.src;
                return target.hostname == "" && target.protocol == "file:";
            }
        }
    );
})();