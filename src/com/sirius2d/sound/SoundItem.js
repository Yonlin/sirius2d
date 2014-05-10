/**
 * SoundItem.js
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
     * 音效元素
     * @class
     * @param {Audio} sound 声音文件
     */
    ss2d.SoundItem = Class
    (
        /** @lends ss2d.SoundItem.prototype */
        {
            //////////////////////////////////////////////////////////////////////////
            //  Extends
            //////////////////////////////////////////////////////////////////////////

            Extends : ss2d.SoundControl,

            //////////////////////////////////////////////////////////////////////////
            //  public property
            //////////////////////////////////////////////////////////////////////////

            /**
             * 声音文件
             * @type {Audio}
             */
            sound : null,

            /**
             * 播放声音的循环次数
             * @type {number}
             * @default 0
             */
            loops : 0,

            /**
             * 播放声音的延迟时间
             * @type {number}
             * @default 0
             */
            delay : 0,

            /**
             * 播放声音的延迟时间的计时器
             * @private
             */
            timeout : 0,

            /**
             * 声音播放当前位置
             * @type {number}
             * @default 0
             */
            lastPosition : 0,

            /**
             * 声音文件的地址
             * @type {string}
             * @default null
             */
            url : null,

            /**
             * @private
             */
            loadingCallbacks :  null,

            //////////////////////////////////////////////////////////////////////////
            //  private property
            //////////////////////////////////////////////////////////////////////////

            /**
             * 是否副本文件，如果是副本文件，一般在播放完毕以后就会被销毁。
             * @type {Boolean}
             * @default false
             * @private
             */
            mIsDuplicate : false,

            ////////////////////////////////////////////////////////////////////////////
            //  constructor
            ////////////////////////////////////////////////////////////////////////////

            /**
             * 初始化
             * @private
             * @param sound
             */
            initialize : function(sound)
            {
                ss2d.SoundItem.Super.call(this);
                if (!(sound instanceof Audio)) sound = null;
                this.sound = sound;
                this.lastPosition = 0;
                this.loadingCallbacks = {};
            },

            ////////////////////////////////////////////////////////////////////////////
            //  Additional getters and setters
            ////////////////////////////////////////////////////////////////////////////

            /**
             * 获取音频音量
             * @returns {*}
             */
            getVolume : function()
            {
                if (this.sound == null) return 0;
                return this.sound.volume;
            },

            /**
             * 设置音频音量
             * @param value
             */
            setVolume : function(value)
            {
                if(this.sound == null) return;
                this.sound.volume = value;
            },

            /**
             * 获取音频总长度
             * @returns {*}
             */
            getLength : function()
            {
                if (this.sound == null) return 0;
                return this.sound.duration;
            },

            /**
             * 获取音频当前播放位置
             * @returns {*}
             */
            getPosition : function()
            {
                if (this.sound == null) return 0;
                return this.sound.currentTime;
            },

            /**
             * 设置音频当前播放位置
             * @param value
             */
            setPosition : function(value)
            {
                this.stop();
                this.lastPosition = value;
                this.play();
            },

            /**
             * 获取音频当前播放位置的百分比
             * @returns {number}
             */
            getPositionPercent : function()
            {
                return this.position / this.length;
            },

            /**
             * 设置音频当前播放位置的百分比
             * @param value
             */
            setPositionPercent : function(value)
            {
                this.position = this.length * value;
            },

            ////////////////////////////////////////////////////////////////////////////
            //  public methods
            ////////////////////////////////////////////////////////////////////////////

            /**
             * 加载
             * @param {String} path 音效文件路径
             * @returns {*}
             */
            load : function(path)
            {
                var probe = new Audio();
                var extension = path.split(".").pop().toUpperCase().split("?")[0];
                var format = ss2d.sound.config[extension];
                if (format == null ||
                    probe.canPlayType(format.mime) == false)
                {
                    throw new Error("The music format '" + extension +"' is not supported");
                }
                probe = null;

                if (this.sound != null)
                {
                    this.sound.removeEventListener('canplaythrough', ss2d[this._onCanPlayThroughHandler]);
                    this.sound.removeEventListener('ended', ss2d[this._onEndedHandler]);
                    this.sound.removeEventListener('error', ss2d[this._onErrorHandler]);
                    ss2d[this._onCanPlayThroughHandler] = null;
                    ss2d[this._onEndedHandler] = null;
                    ss2d[this._onErrorHandler] = null;
                    this.sound.pause();
                    this.sound = null;
                }
                ss2d[this._onCanPlayThroughHandler] = this._onCanPlayThroughHandler.bind(this);
                ss2d[this._onEndedHandler] = this._onEndedHandler.bind(this);
                ss2d[this._onErrorHandler] = this._onErrorHandler.bind(this);
                this.sound = new Audio(path + "?" + ss2d.nocache);
                this.sound.addEventListener('canplaythrough', ss2d[this._onCanPlayThroughHandler]);
                this.sound.addEventListener('ended', ss2d[this._onEndedHandler]);
                this.sound.addEventListener('error', ss2d[this._onErrorHandler]);
                this.sound.load();
                return this;
            },

            /**
             * 播放
             * @param {Number} loops 循环次数
             * @param {Number} delay 延时播放
             * @returns {*|void}
             */
            play : function(loops, delay)
            {
                if (this.isPlaying)
                {
                    ss2d.log("音效还在播放中，克隆新音效......");
                    var duplicate = this.clone();
                    duplicate.mIsDuplicate = true;
                    duplicate.loops = loops == -1 ? Number.MAX_VALUE : loops;
                    duplicate.delay = delay;
                    ss2d[duplicate._playHandler] = duplicate._playHandler.bind(duplicate);
                    duplicate.timeout = setTimeout(ss2d[duplicate._playHandler], delay * 1000);
                    return ss2d.SoundItem.Super.prototype.play.call(duplicate);
                }
                loops = loops || 0;
                delay = delay || 0;
                this.loops = loops == -1 ? Number.MAX_VALUE : loops;
                this.delay = delay;
                this.cancel();
                ss2d[this._playHandler] = this._playHandler.bind(this);
                this.timeout = setTimeout(ss2d[this._playHandler], delay * 1000);
                return ss2d.SoundItem.Super.prototype.play.call(this);
            },

            /**
             * 暂停
             * @returns {*|void}
             */
            pause : function()
            {
                this.lastPosition = this.sound.currentTime;
                this.sound.pause();
                return ss2d.SoundItem.Super.prototype.pause.call(this);
            },

            /**
             * 停止播放
             * @returns {*}
             */
            stop : function()
            {
                this.lastPosition = 0;
                this.sound.pause();
                return ss2d.SoundItem.Super.prototype.stop.call(this);
            },

            /**
             * 离开
             * @returns {*}
             */
            cancel : function()
            {
                clearTimeout(this.timeout);
                var callback = this.controlCallbacks["cancel"];
                if(callback != null) callback();
                return this;
            },

            /**
             * 给音频加载完毕添加一个回调函数
             * @param {Function} callBack 回调函数
             * @returns {*}
             */
            onLoad : function(callBack)
            {
                this.loadingCallbacks["complete"] = callBack;
                return this;
            },

            /**
             * 克隆这个音效。
             */
            clone : function()
            {
                var cSound = new ss2d.SoundItem();
                cSound.load(this.sound.src);
                return cSound;
            },

            /**
             * 释放
             */
            dispose : function()
            {
                this.cancel();
                this.loadingCallbacks = null;
                if (this.sound != null)
                {
                    this.sound.removeEventListener('canplaythrough', ss2d[this._onCanPlayThroughHandler]);
                    this.sound.removeEventListener('ended', ss2d[this._onEndedHandler]);
                    this.sound.removeEventListener('error', ss2d[this._onErrorHandler]);
                    ss2d[this._onCanPlayThroughHandler] = null;
                    ss2d[this._onEndedHandler] = null;
                    ss2d[this._onErrorHandler] = null;
                    this.sound.pause();
                    this.sound = null;
                }
            },

            ////////////////////////////////////////////////////////////////////////////
            //  private methods
            ////////////////////////////////////////////////////////////////////////////


            /**
             * 播放音频处理函数
             * @private
             */
            _playHandler : function()
            {
                //this.sound.currentTime = this.lastPosition;
                this.sound.play();
                var callback = this.controlCallbacks["play"];
                if(callback != null) callback.call();
            },

            /**
             * 当浏览器可在不因缓冲而停顿的情况下进行播放时的事件处理
             * @param e
             * @private
             */
            _onCanPlayThroughHandler : function(e)
            {
                var callback = this.loadingCallbacks["complete"];
                if(callback != null) callback.apply(this, [e]);
            },

            /**
             * 当目前的播放列表已结束时的事件处理
             * @param e
             * @private
             */
            _onEndedHandler : function(e)
            {
                this.loops--;
                if (this.loops > 0) this.sound.play();
                else
                {
                    this.isPlaying = false;
                    this.lastPosition = 0;
                    var callback = this.controlCallbacks["soundComplete"];
                    if(callback != null) callback.apply(this, [e]);
                    if (this.mIsDuplicate)
                    {
                        ss2d.log("副本播放完毕，执行销毁!");
                        this.dispose();
                    }
                }
            },

            /**
             * 当在音频加载期间发生错误时事件处理
             * @param e
             * @private
             */
            _onErrorHandler : function(e)
            {
                var callback = this.controlCallbacks["cancel"];
                if(callback != null) callback();
            }
        }
    );
})();