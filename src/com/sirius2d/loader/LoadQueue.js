/**
 * LoadQueue.js
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
     * 队列加载器 用于加载多个游戏用资源。
     * <br/>演示地址:http://sirius2d.com/demos/d_1/
     * @type {Class}
     */
    ss2d.LoadQueue = Class
    (
        /** @lends ss2d.LoadQueue.prototype */
        {
            Extends:ss2d.AbstractLoader,

            ////////////////////////////////////////////////////////////////////////////
            //  static  property
            ////////////////////////////////////////////////////////////////////////////

            STATIC:
            {
                LOAD_TIMEOUT : 0,
                BINARY : "binary",
                CSS : "css",
                IMAGE : "image",
                JAVASCRIPT : "javascript",
                JSON : "json",
                JSONP : "jsonp",
                MANIFEST : "manifest",
                SOUND : "sound",
                SVG : "svg",
                TEXT : "text",
                XML : "xml",
                HTML: "html",
                POST : 'POST',
                GET : 'GET',
                loadTimeout : 8000,

                isBinary : function(type)
                {
                    switch (type)
                    {
                        case this.IMAGE:
                        case this.BINARY:
                            return true;
                        default:
                            return false;
                    }
                },

                isText : function(type)
                {
                    switch (type)
                    {
                        case this.TEXT:
                        case this.JSON:
                        case this.MANIFEST:
                        case this.XML:
                        case this.HTML:
                        case this.CSS:
                        case this.SVG:
                        case this.JAVASCRIPT:
                            return true;
                        default:
                            return false;
                    }
                }
            },

            //////////////////////////////////////////////////////////////////////////
            //  private property
            //////////////////////////////////////////////////////////////////////////

            _basePath : null,
            _crossOrigin : "",
            _typeCallbacks : null,
            _extensionCallbacks : null,
            _loadStartWasDispatched : false,
            _maxConnections : 1,
            _currentlyLoadingScript : null,
            _currentLoads : null,
            _loadQueue : null,
            _loadQueueBackup : null,
            _loadItemsById : null,
            _loadItemsBySrc : null,
            _loadedResults : null,
            _loadedRawResults : null,
            _numItems : 0,
            _numItemsLoaded : 0,
            _scriptOrder : null,
            _loadedScripts : null,
            _paused : false,

            //////////////////////////////////////////////////////////////////////////
            //  public property
            //////////////////////////////////////////////////////////////////////////

            useXHR : true,
            stopOnError : false,
            maintainScriptOrder : true,
            next : null,

            ////////////////////////////////////////////////////////////////////////////
            //  constructor
            ////////////////////////////////////////////////////////////////////////////

            initialize : function(useXHR, basePath, crossOrigin)
            {
                this._numItems = this._numItemsLoaded = 0;
                this._paused = false;
                this._loadStartWasDispatched = false;

                this._currentLoads = [];
                this._loadQueue = [];
                this._loadQueueBackup = [];
                this._scriptOrder = [];
                this._loadedScripts = [];
                this._loadItemsById = {};
                this._loadItemsBySrc = {};
                this._loadedResults = {};
                this._loadedRawResults = {};

                // Callbacks for plugins
                this._typeCallbacks = {};
                this._extensionCallbacks = {};

                this._basePath = basePath;
                this.setUseXHR(useXHR);
                this._crossOrigin = (crossOrigin === true)
                    ? "Anonymous" : (crossOrigin === false || crossOrigin == null)
                    ? "" : crossOrigin;
            },

            setUseXHR : function(value)
            {
                // Determine if we can use XHR. XHR defaults to TRUE, but the browser may not support it.
                //TODO: Should we be checking for the other XHR types? Might have to do a try/catch on the different types similar to createXHR.
                this.useXHR = (value != false && window.XMLHttpRequest != null);
                return this.useXHR;
            },

            removeAll : function()
            {
                this.remove();
            },

            remove : function(idsOrUrls)
            {
                var args = null;

                if (idsOrUrls && !(idsOrUrls instanceof Array))
                {
                    args = [idsOrUrls];
                }
                else if (idsOrUrls)
                {
                    args = idsOrUrls;
                }
                else if (arguments.length > 0)
                {
                    return;
                }

                var itemsWereRemoved = false;

                // Destroy everything
                if (!args)
                {
                    this.close();
                    for (var n in this._loadItemsById)
                    {
                        this._disposeItem(this._loadItemsById[n]);
                    }
                    this.init(this.useXHR);

                    // Remove specific items
                }
                else
                {
                    while (args.length)
                    {
                        var item = args.pop();
                        var r = this.getResult(item);

                        //Remove from the main load Queue
                        for (i = this._loadQueue.length-1;i>=0;i--)
                        {
                            loadItem = this._loadQueue[i].getItem();
                            if (loadItem.id == item || loadItem.src == item)
                            {
                                this._loadQueue.splice(i,1)[0].cancel();
                                break;
                            }
                        }

                        //Remove from the backup queue
                        for (i = this._loadQueueBackup.length-1;i>=0;i--)
                        {
                            loadItem = this._loadQueueBackup[i].getItem();
                            if (loadItem.id == item || loadItem.src == item)
                            {
                                this._loadQueueBackup.splice(i,1)[0].cancel();
                                break;
                            }
                        }

                        if (r)
                        {
                            delete this._loadItemsById[r.id];
                            delete this._loadItemsBySrc[r.src];
                            this._disposeItem(r);
                        }
                        else
                        {
                            for (var i=this._currentLoads.length-1;i>=0;i--)
                            {
                                var loadItem = this._currentLoads[i].getItem();
                                if (loadItem.id == item || loadItem.src == item)
                                {
                                    this._currentLoads.splice(i,1)[0].cancel();
                                    itemsWereRemoved = true;
                                    break;
                                }
                            }
                        }
                    }

                    // If this was called during a load, try to load the next item.
                    if (itemsWereRemoved)
                    {
                        this._loadNext();
                    }
                }
            },

            reset : function()
            {
                this.close();
                for (var n in this._loadItemsById)
                {
                    this._disposeItem(this._loadItemsById[n]);
                }

                //Reset the queue to its start state
                var a = [];
                for (var i=0, l=this._loadQueueBackup.length; i<l; i++)
                {
                    a.push(this._loadQueueBackup[i].getItem());
                }

                this.loadManifest(a, false);
            },

            installPlugin : function(plugin)
            {
                if (plugin == null || plugin.getPreloadHandlers == null) { return; }
                var map = plugin.getPreloadHandlers();
                map.scope = plugin;

                if (map.types != null)
                {
                    for (var i=0, l=map.types.length; i<l; i++)
                    {
                        this._typeCallbacks[map.types[i]] = map;
                    }
                }
                if (map.extensions != null)
                {
                    for (i=0, l=map.extensions.length; i<l; i++)
                    {
                        this._extensionCallbacks[map.extensions[i]] = map;
                    }
                }
            },

            setMaxConnections : function (value)
            {
                this._maxConnections = value;
                if (!this._paused && this._loadQueue.length > 0)
                {
                    this._loadNext();
                }
            },

            loadFile : function(file, loadNow, basePath)
            {
                if (file == null)
                {
                    var event = new ss2d.Event("error");
                    event.text = "PRELOAD_NO_FILE";
                    this._sendError(event);
                    return;
                }
                this._addItem(file, null, basePath);

                if (loadNow !== false)
                {
                    this.setPaused(false);
                }
                else
                {
                    this.setPaused(true);
                }
            },

            /**
             * 载入加载队列
             * @param manifest 加载队列
             * @param loadNow
             * @param basePath
             */
            loadManifest : function(manifest, loadNow, basePath)
            {
                var fileList = null;
                var path = null;

                // Array-based list of items
                if (manifest instanceof Array)
                {
                    if (manifest.length == 0)
                    {
                        var event = new ss2d.Event("error");
                        event.text = "PRELOAD_MANIFEST_EMPTY";
                        this._sendError(event);
                        return;
                    }
                    fileList = manifest;

                    // String-based. Only file manifests can be specified this way. Any other types will cause an error when loaded.
                }
                else if (typeof(manifest) === "string")
                {
                    fileList = [{
                        src: manifest,
                        type: ss2d.LoadQueue.MANIFEST
                    }];

                }
                else if (typeof(manifest) == "object")
                {

                    // An object that defines a manifest path
                    if (manifest.src !== undefined)
                    {
                        if (manifest.type == null)
                        {
                            manifest.type = ss2d.LoadQueue.MANIFEST;
                        }
                        else if (manifest.type != ss2d.LoadQueue.MANIFEST)
                        {
                            var event = new ss2d.Event("error");
                            event.text = "PRELOAD_MANIFEST_ERROR";
                            this._sendError(event);
                        }
                        fileList = [manifest];
                        // An object that defines a manifest
                    }
                    else if (manifest.manifest !== undefined)
                    {
                        fileList = manifest.manifest;
                        path = manifest.path;
                    }
                    // Unsupported. This will throw an error.
                }
                else
                {
                    var event = new ss2d.Event("error");
                    event.text = "PRELOAD_MANIFEST_NULL";
                    this._sendError(event);
                    return;
                }

                for (var i=0, l=fileList.length; i<l; i++)
                {
                    this._addItem(fileList[i], path, basePath);
                }

                if (loadNow !== false)
                {
                    this.setPaused(false);
                }
                else
                {
                    this.setPaused(true);
                }
            },

            load : function()
            {
                this.setPaused(false);
            },

            getItem : function(value)
            {
                return this._loadItemsById[value] || this._loadItemsBySrc[value];
            },

            getResult : function(value, rawResult)
            {
                var item = this._loadItemsById[value] || this._loadItemsBySrc[value];
                if (item == null) { return null; }
                var id = item.id;
                if (rawResult && this._loadedRawResults[id])
                {
                    return this._loadedRawResults[id];
                }
                return this._loadedResults[id];
            },

            setPaused : function(value)
            {
                this._paused = value;
                if (!this._paused)
                {
                    this._loadNext();
                }
            },

            close : function()
            {
                while (this._currentLoads.length)
                {
                    this._currentLoads.pop().cancel();
                }
                this._scriptOrder.length = 0;
                this._loadedScripts.length = 0;
                this.loadStartWasDispatched = false;
            },

            _addItem : function(value, path, basePath)
            {
                var item = this._createLoadItem(value, path, basePath); // basePath and manifest path are added to the src.
                if (item == null) { return; } // Sometimes plugins or types should be skipped.
                var loader = this._createLoader(item);
                if (loader != null)
                {
                    this._loadQueue.push(loader);
                    this._loadQueueBackup.push(loader);

                    this._numItems++;
                    this._updateProgress();

                    // Only worry about script order when using XHR to load scripts. Tags are only loading one at a time.
                    if (this.maintainScriptOrder
                        && item.type == ss2d.LoadQueue.JAVASCRIPT
                        && loader instanceof ss2d.XHRLoader)
                    {
                        this._scriptOrder.push(item);
                        this._loadedScripts.push(null);
                    }
                }
            },

            _createLoadItem : function(value, path, basePath)
            {
                var item = null;
                // Create/modify a load item
                switch(typeof(value))
                {
                    case "string":
                        item = { src: value };
                        break;
                    case "object":
                        if (window.HTMLAudioElement && value instanceof window.HTMLAudioElement)
                        {
                            item = {
                                tag: value,
                                src: item.tag.src,
                                type: ss2d.LoadQueue.SOUND
                            };
                        }
                        else
                        {
                            item = value;
                        }
                        break;
                    default:
                        return null;
                }

                // Determine Extension, etc.
                var match = this._parseURI(item.src);
                if (match != null) { item.ext = match[6]; }
                if (item.type == null)
                {
                    item.type = this._getTypeByExtension(item.ext);
                }

                // Inject path & basePath
                var bp = ""; // Store the generated basePath
                var useBasePath = basePath || this._basePath;
                var autoId = item.src;
                if (match && match[1] == null && match[3] == null)
                {
                    if (path)
                    {
                        bp = path;
                        var pathMatch = this._parsePath(path);
                        autoId = path + autoId;
                        // Also append basePath
                        if (useBasePath != null && pathMatch && pathMatch[1] == null && pathMatch[2] == null) {
                            bp = useBasePath + bp;
                        }
                    }
                    else if (useBasePath != null)
                    {
                        bp = useBasePath;
                    }
                }
                item.src = bp + item.src;
                item.path = bp;

                if (item.type == ss2d.LoadQueue.JSON || item.type == ss2d.LoadQueue.MANIFEST)
                {
                    item._loadAsJSONP = (item.callback != null);
                }

                if (item.type == ss2d.LoadQueue.JSONP && item.callback == null)
                {
                    throw new Error('callback is required for loading JSONP requests.');
                }

                // Create a tag for the item. This ensures there is something to either load with or populate when finished.
                if (item.tag === undefined || item.tag === null)
                {
                    item.tag = this._createTag(item);
                }

                // If there's no id, set one now.
                if (item.id === undefined || item.id === null || item.id === "") {
                    item.id = autoId;
                }

                // Give plugins a chance to modify the loadItem:
                var customHandler = this._typeCallbacks[item.type] || this._extensionCallbacks[item.ext];
                if (customHandler)
                {
                    // Plugins are now passed both the full source, as well as a combined path+basePath (appropriately)
                    var result = customHandler.callback.call(customHandler.scope, item.src, item.type, item.id, item.data,
                        bp, this);
                    // NOTE: BasePath argument is deprecated. We pass it to plugins.allow SoundJS to modify the file. to sanymore. The full path is sent to the plugin

                    // The plugin will handle the load, or has canceled it. Ignore it.
                    if (result === false)
                    {
                        return null;

                        // Load as normal:
                    }
                    else if (result === true)
                    {
                        // Do Nothing

                        // Result is a loader class:
                    }
                    else
                    {
                        if (result.src != null) { item.src = result.src; }
                        if (result.id != null) { item.id = result.id; } // TODO: Evaluate this. An overridden ID could be problematic
                        if (result.tag != null) { // Assumes that the returned tag either has a load method or a src setter.
                            item.tag = result.tag;
                        }
                        if (result.completeHandler != null) { item.completeHandler = result.completeHandler; }

                        // Allow type overriding:
                        if (result.type) { item.type = result.type; }

                        // Update the extension in case the type changed:
                        match = this._parseURI(item.src);
                        if (match != null && match[6] != null) {
                            item.ext = match[6].toLowerCase();
                        }
                    }
                }

                // Store the item for lookup. This also helps clean-up later.
                this._loadItemsById[item.id] = item;
                this._loadItemsBySrc[item.src] = item;

                return item;
            },

            _createLoader : function(item)
            {
                // Initially, try and use the provided/supported XHR mode:
                var useXHR = this.useXHR;

                // Determine the XHR usage overrides:
                switch (item.type)
                {
                    case ss2d.LoadQueue.JSON:
                    case ss2d.LoadQueue.MANIFEST:
                        useXHR = !item._loadAsJSONP;
                        break;
                    case ss2d.LoadQueue.XML:
                    case ss2d.LoadQueue.TEXT:
                        useXHR = true; // Always use XHR2 with text/XML
                        break;
                    case ss2d.LoadQueue.SOUND:
                    case ss2d.LoadQueue.JSONP:
                        useXHR = false; // Never load audio using XHR. WebAudio will provide its own loader.
                        break;
                    case null:
                        return null;
                    // Note: IMAGE, CSS, SCRIPT, SVG can all use TAGS or XHR.
                }

                if (useXHR)
                {
                    return new ss2d.XHRLoader(item, this._crossOrigin);
                }
                else
                {
                    return new ss2d.TagLoader(item);
                }
            },

            _loadNext : function()
            {
                if (this._paused) { return; }

                // Only dispatch loadstart event when the first file is loaded.
                if (!this._loadStartWasDispatched)
                {
                    this._sendLoadStart();
                    this._loadStartWasDispatched = true;
                }

                // The queue has completed.
                if (this._numItems == this._numItemsLoaded)
                {
                    this.loaded = true;
                    this._sendComplete();

                    // Load the next queue, if it has been defined.
                    if (this.next && this.next.load)
                    {
                        this.next.load();
                    }
                }
                else
                {
                    this.loaded = false;
                }

                // Must iterate forwards to load in the right order.
                for (var i=0; i<this._loadQueue.length; i++)
                {
                    if (this._currentLoads.length >= this._maxConnections) { break; }
                    var loader = this._loadQueue[i];

                    // Determine if we should be only loading one at a time:
                    if (this.maintainScriptOrder
                        && loader instanceof ss2d.TagLoader
                        && loader.getItem().type == ss2d.LoadQueue.JAVASCRIPT)
                    {
                        if (this._currentlyLoadingScript) { continue; } // Later items in the queue might not be scripts.
                        this._currentlyLoadingScript = true;
                    }
                    this._loadQueue.splice(i, 1);
                    i--;
                    this._loadItem(loader);
                }
            },

            _loadItem : function(loader)
            {
                loader.on("progress", this._handleProgress, this);
                loader.on("complete", this._handleFileComplete, this);
                loader.on("error", this._handleFileError, this);
                this._currentLoads.push(loader);
                this._sendFileStart(loader.getItem());
                loader.load();
            },

            _handleFileError : function(event)
            {
                var loader = event.target;
                this._numItemsLoaded++;
                this._updateProgress();

                var newEvent = new ss2d.Event("error");
                newEvent.text = "FILE_LOAD_ERROR";
                newEvent.item = loader.getItem();
                // TODO: Propagate actual error message.

                this._sendError(newEvent);

                if (!this.stopOnError)
                {
                    this._removeLoadItem(loader);
                    this._loadNext();
                }
            },

            _handleFileComplete : function(event)
            {
                var loader = event.target;
                var item = loader.getItem();
                this._loadedResults[item.id] = loader.getResult();
                if (loader instanceof ss2d.XHRLoader)
                {
                    this._loadedRawResults[item.id] = loader.getResult(true);
                }
                this._removeLoadItem(loader);
                // Ensure that script loading happens in the right order.
                if (this.maintainScriptOrder && item.type == ss2d.LoadQueue.JAVASCRIPT)
                {
                    if (loader instanceof ss2d.TagLoader)
                    {
                        this._currentlyLoadingScript = false;
                    }
                    else
                    {
                        this._loadedScripts[ss2d.indexOf(this._scriptOrder, item)] = item;
                        this._checkScriptLoadOrder(loader);
                        return;
                    }
                }
                // Clean up the load item
                delete item._loadAsJSONP;
                // If the item was a manifest, then
                if (item.type == ss2d.LoadQueue.MANIFEST)
                {
                    var result = loader.getResult();
                    if (result != null && result.manifest !== undefined)
                    {
                        this.loadManifest(result, true);
                    }
                }
                this._processFinishedLoad(item, loader);
            },

            _processFinishedLoad : function(item, loader)
            {
                // Old handleFileTagComplete follows here.
                this._numItemsLoaded++;
                this._updateProgress();
                this._sendFileComplete(item, loader);
                this._loadNext();
            },

            _checkScriptLoadOrder : function ()
            {
                var l = this._loadedScripts.length;
                for (var i=0;i<l;i++)
                {
                    var item = this._loadedScripts[i];
                    if (item === null) { break; } // This is still loading. Do not process further.
                    if (item === true) { continue; } // This has completed, and been processed. Move on.

                    // Append script tags to the head automatically. Tags do this in the loader, but XHR scripts have to maintain order.
                    var loadItem = this._loadedResults[item.id];
                    (document.body || document.getElementsByTagName("body")[0]).appendChild(loadItem);

                    this._processFinishedLoad(item);
                    this._loadedScripts[i] = true;
                }
            },

            _removeLoadItem : function(loader)
            {
                var l = this._currentLoads.length;
                for (var i=0;i<l;i++)
                {
                    if (this._currentLoads[i] == loader)
                    {
                        this._currentLoads.splice(i,1); break;
                    }
                }
            },

            _handleProgress : function(event)
            {
                var loader = event.target;
                this._sendFileProgress(loader.getItem(), loader.progress);
                this._updateProgress();
            },

            _updateProgress : function ()
            {
                var loaded = this._numItemsLoaded / this._numItems; // Fully Loaded Progress
                var remaining = this._numItems-this._numItemsLoaded;
                if (remaining > 0)
                {
                    var chunk = 0;
                    for (var i=0, l=this._currentLoads.length; i<l; i++) {
                        chunk += this._currentLoads[i].progress;
                    }
                    loaded += (chunk / remaining) * (remaining/this._numItems);
                }
                this._sendProgress(loaded);
            },

            _disposeItem : function(item)
            {
                delete this._loadedResults[item.id];
                delete this._loadedRawResults[item.id];
                delete this._loadItemsById[item.id];
                delete this._loadItemsBySrc[item.src];
            },

            _createTag : function(item)
            {
                var tag = null;
                switch (item.type)
                {
                    case ss2d.LoadQueue.IMAGE:
                        tag = document.createElement("img");
                        if (this._crossOrigin != "" && !this._isLocal(item)) { tag.crossOrigin = this._crossOrigin; }
                        return tag;
                    case ss2d.LoadQueue.SOUND:
                        tag = document.createElement("audio");
                        tag.autoplay = false;
                        // Note: The type property doesn't seem necessary.
                        return tag;
                    case ss2d.LoadQueue.JSON:
                    case ss2d.LoadQueue.JSONP:
                    case ss2d.LoadQueue.JAVASCRIPT:
                    case ss2d.LoadQueue.MANIFEST:
                        tag = document.createElement("script");
                        tag.type = "text/javascript";
                        return tag;
                    case ss2d.LoadQueue.CSS:
                        if (this.useXHR)
                        {
                            tag = document.createElement("style");
                        }
                        else
                        {
                            tag = document.createElement("link");
                        }
                        tag.rel  = "stylesheet";
                        tag.type = "text/css";
                        return tag;
                    case ss2d.LoadQueue.SVG:
                        if (this.useXHR)
                        {
                            tag = document.createElement("svg");
                        }
                        else
                        {
                            tag = document.createElement("object");
                            tag.type = "image/svg+xml";
                        }
                        return tag;
                }
                return null;
            },

            _getTypeByExtension : function(extension)
            {
                if (extension == null)
                {
                    return ss2d.LoadQueue.TEXT;
                }
                switch (extension.toLowerCase())
                {
                    case "jpeg":
                    case "jpg":
                    case "gif":
                    case "png":
                    case "webp":
                    case "bmp":
                        return ss2d.LoadQueue.IMAGE;
                    case "ogg":
                    case "mp3":
                    case "wav":
                        return ss2d.LoadQueue.SOUND;
                    case "json":
                        return ss2d.LoadQueue.JSON;
                    case "xml":
                        return ss2d.LoadQueue.XML;
                    case "css":
                        return ss2d.LoadQueue.CSS;
                    case "js":
                        return ss2d.LoadQueue.JAVASCRIPT;
                    case 'svg':
                        return ss2d.LoadQueue.SVG;
                    default:
                        return ss2d.LoadQueue.TEXT;
                }
            },

            _sendFileProgress : function(item, progress)
            {
                if (this._isCanceled())
                {
                    this._cleanUp();
                    return;
                }
                if (!this.hasEventListener("fileprogress")) { return; }
                var event = new ss2d.Event("fileprogress");
                event.progress = progress;
                event.loaded = progress;
                event.total = 1;
                event.item = item;
                this.dispatchEvent(event);
            },

            _sendFileComplete : function(item, loader)
            {
                if (this._isCanceled()) { return; }
                var event = new ss2d.Event("fileload");
                event.loader = loader;
                event.item = item;
                event.result = this._loadedResults[item.id];
                event.rawResult = this._loadedRawResults[item.id];
                // This calls a handler specified on the actual load item. Currently, the SoundJS plugin uses this.
                if (item.completeHandler)
                {
                    item.completeHandler(event);
                }
                this.hasEventListener("fileload") && this.dispatchEvent(event)
            },

            _sendFileStart : function(item)
            {
                var event = new ss2d.Event("filestart");
                event.item = item;
                this.hasEventListener("filestart") && this.dispatchEvent(event);
            }
        }
    );
})();