/**
 * SamplePlugin.js
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
    ss2d.TagLoader = Class
    (
        {
            Extends:ss2d.AbstractLoader,

            //////////////////////////////////////////////////////////////////////////
            //  private property
            //////////////////////////////////////////////////////////////////////////

            _loadTimeout : null,
            _tagCompleteProxy : null,
            _isAudio : false,
            _tag : null,
            _jsonResult : null,

            //////////////////////////////////////////////////////////////////////////
            //  public property
            //////////////////////////////////////////////////////////////////////////

            ////////////////////////////////////////////////////////////////////////////
            //  public methods
            ////////////////////////////////////////////////////////////////////////////

            initialize : function(item)
            {
                this._item = item;
                this._tag = item.tag;
                this._isAudio = (window.HTMLAudioElement && item.tag instanceof window.HTMLAudioElement);
                this._tagCompleteProxy = ss2d.proxy(this._handleLoad, this);
            },

            getResult : function()
            {
                if (this._item.type == ss2d.LoadQueue.JSONP ||
                    this._item.type == ss2d.LoadQueue.MANIFEST)
                {
                    return this._jsonResult;
                }
                else
                {
                    return this._tag;
                }
            },

            cancel : function()
            {
                this.canceled = true;
                this._clean();
            },

            // Overrides abstract method in AbstractLoader
            load : function()
            {
                var item = this._item;
                var tag = this._tag;

                clearTimeout(this._loadTimeout); // Clear out any existing timeout
                var duration = ss2d.LoadQueue.LOAD_TIMEOUT;
                if (duration == 0) { duration = ss2d.LoadQueue.loadTimeout; }
                this._loadTimeout = setTimeout(ss2d.proxy(this._handleTimeout, this), duration);

                if (this._isAudio)
                {
                    tag.src = null; // Unset the source so we can set the preload type to "auto" without kicking off a load. This is only necessary for audio tags passed in by the developer.
                    tag.preload = "auto";
                }

                // Handlers for all tags
                tag.onerror = ss2d.proxy(this._handleError,  this);
                // Note: We only get progress events in Chrome, but do not fully load tags in Chrome due to its behaviour, so we ignore progress.

                if (this._isAudio)
                {
                    tag.onstalled = ss2d.proxy(this._handleStalled,  this);
                    // This will tell us when audio is buffered enough to play through, but not when its loaded.
                    // The tag doesn't keep loading in Chrome once enough has buffered, and we have decided that behaviour is sufficient.
                    tag.addEventListener("canplaythrough", this._tagCompleteProxy, false); // canplaythrough callback doesn't work in Chrome, so we use an event.
                }
                else
                {
                    tag.onload = ss2d.proxy(this._handleLoad,  this);
                    tag.onreadystatechange = ss2d.proxy(this._handleReadyStateChange,  this);
                }

                var src = this.buildPath(item.src, item.values);

                // Set the src after the events are all added.
                switch(item.type)
                {
                    case ss2d.LoadQueue.CSS:
                        tag.href = src;
                        break;
                    case ss2d.LoadQueue.SVG:
                        tag.data = src;
                        break;
                    default:
                        tag.src = src;
                }

                // If we're loading JSONP, we need to add our callback now.
                if (item.type == ss2d.LoadQueue.JSONP
                    || item.type == ss2d.LoadQueue.JSON
                    || item.type == ss2d.LoadQueue.MANIFEST)
                {
                    if (item.callback == null)
                    {
                        throw new Error('callback is required for loading JSONP requests.');
                    }

                    if (window[item.callback] != null)
                    {
                        throw new Error('JSONP callback "' + item.callback + '" already exists on window. You need to specify a different callback. Or re-name the current one.');
                    }

                    window[item.callback] = ss2d.proxy(this._handleJSONPLoad, this);
                }

                // If its SVG, it needs to be on the DOM to load (we remove it before sending complete).
                // It is important that this happens AFTER setting the src/data.
                if (item.type == ss2d.LoadQueue.SVG ||
                    item.type == ss2d.LoadQueue.JSONP ||
                    item.type == ss2d.LoadQueue.JSON ||
                    item.type == ss2d.LoadQueue.MANIFEST ||
                    item.type == ss2d.LoadQueue.JAVASCRIPT ||
                    item.type == ss2d.LoadQueue.CSS)
                {
                    this._startTagVisibility = tag.style.visibility;
                    tag.style.visibility = "hidden";
                    (document.body || document.getElementsByTagName("body")[0]).appendChild(tag);
                }

                // Note: Previous versions didn't seem to work when we called load() for OGG tags in Firefox. Seems fixed in 15.0.1
                if (tag.load != null)
                {
                    tag.load();
                }
            },

            ////////////////////////////////////////////////////////////////////////////
            //  private methods
            ////////////////////////////////////////////////////////////////////////////

            _handleJSONPLoad : function(data)
            {
                this._jsonResult = data;
            },

            /**
             * Handle an audio timeout. Newer browsers get a callback from the tags, but older ones may require a setTimeout
             * to handle it. The setTimeout is always running until a response is handled by the browser.
             * @method _handleTimeout
             * @private
             */
            _handleTimeout : function()
            {
                this._clean();
                var event = new ss2d.Event("error");
                event.text = "PRELOAD_TIMEOUT";
                this._sendError(event);
            },

            /**
             * Handle a stalled audio event. The main place we seem to get these is with HTMLAudio in Chrome when we try and
             * playback audio that is already in a load, but not complete.
             * @method _handleStalled
             * @private
             */
            _handleStalled : function()
            {
                //Ignore, let the timeout take care of it. Sometimes its not really stopped.
            },

            /**
             * Handle an error event generated by the tag.
             * @method _handleError
             * @private
             */
            _handleError : function(event)
            {
                this._clean();
                var newEvent = new ss2d.Event("error");
                //TODO: Propagate actual event error?
                this._sendError(newEvent);
            },

            /**
             * Handle the readyStateChange event from a tag. We sometimes need this in place of the onload event (mainly SCRIPT
             * and LINK tags), but other cases may exist.
             * @method _handleReadyStateChange
             * @private
             */
            _handleReadyStateChange : function()
            {
                clearTimeout(this._loadTimeout);
                // This is strictly for tags in browsers that do not support onload.
                var tag = this.getItem().tag;
                // Complete is for old IE support.
                if (tag.readyState == "loaded" || tag.readyState == "complete")
                {
                    this._handleLoad();
                }
            },

            /**
             * Handle a load (complete) event. This is called by tag callbacks, but also by readyStateChange and canPlayThrough
             * events. Once loaded, the item is dispatched to the {{#crossLink "LoadQueue"}}{{/crossLink}}.
             * @method _handleLoad
             * @param {Object} [event] A load event from a tag. This is sometimes called from other handlers without an event.
             * @private
             */
            _handleLoad : function(event)
            {
                if (this._isCanceled()) { return; }
                var item = this.getItem();
                var tag = item.tag;
                if (this.loaded || this._isAudio && tag.readyState !== 4) { return; } //LM: Not sure if we still need the audio check.
                this.loaded = true;

                // Remove from the DOM
                switch (item.type)
                {
                    case ss2d.LoadQueue.SVG:
                    case ss2d.LoadQueue.JSON:
                    case ss2d.LoadQueue.JSONP: // Note: Removing script tags is a fool's errand.
                    case ss2d.LoadQueue.MANIFEST:
                    case ss2d.LoadQueue.CSS:
                        // case ss2d.LoadQueue.CSS:
                        //LM: We may need to remove CSS tags loaded using a LINK
                        tag.style.visibility = this._startTagVisibility;
                        (document.body || document.getElementsByTagName("body")[0]).removeChild(tag);
                        break;
                    default:
                }
                this._clean();
                this._sendComplete();
            },

            /**
             * Clean up the loader.
             * This stops any timers and removes references to prevent errant callbacks and clean up memory.
             * @method _clean
             * @private
             */
            _clean : function()
            {
                clearTimeout(this._loadTimeout);
                // Delete handlers.
                var item = this.getItem();
                var tag = item.tag;
                if (tag != null)
                {
                    tag.onload = null;
                    tag.removeEventListener && tag.removeEventListener("canplaythrough", this._tagCompleteProxy, false);
                    tag.onstalled = null;
                    tag.onprogress = null;
                    tag.onerror = null;

                    //TODO: Test this
                    if (tag.parentNode != null
                        && item.type == ss2d.LoadQueue.SVG
                        && item.type == ss2d.LoadQueue.JSON
                        && item.type == ss2d.LoadQueue.MANIFEST
                        && item.type == ss2d.LoadQueue.CSS
                        && item.type == ss2d.LoadQueue.JSONP)
                    {
                        // Note: Removing script tags is a fool's errand.
                        tag.parentNode.removeChild(tag);
                    }
                }

                var item = this.getItem();
                if (item.type == ss2d.LoadQueue.JSONP ||
                    item.type == ss2d.LoadQueue.MANIFEST)
                {
                    window[item.callback] = null;
                }
            }
        }
    );
})();