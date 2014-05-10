/**
 * SoundControl.js
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
     * 音效控制器
     * @class
     */
    ss2d.SoundControl = Class
    (
        /** @lends ss2d.SoundControl.prototype */
        {
            //////////////////////////////////////////////////////////////////////////
            //  public property
            //////////////////////////////////////////////////////////////////////////

            /**
             * 原始音量
             * @type {number}
             * @default 0
             */
            originalVolume : 0,

            /**
             * 音效是否正在播放
             * @type {boolean}
             * @default false
             */
            isPlaying : false,

            /**
             * 音效控制器的回调函数集合
             * @private
             * @type {object}
             * @default null
             */
            controlCallbacks : null,

            ////////////////////////////////////////////////////////////////////////////
            //  constructor
            ////////////////////////////////////////////////////////////////////////////

            /**
             * 初始化
             * @private
             */
            initialize : function()
            {
                this.controlCallbacks = {};
            },

            ////////////////////////////////////////////////////////////////////////////
            //  Additional getters and setters
            ////////////////////////////////////////////////////////////////////////////

            /**
             * 获取音效音量,需要重载
             * @returns {number}
             */
            getVolume : function()
            {
                return 0;
            },

            /**
             * 设置音效音量,需要重载
             * @param value
             */
            setVolume : function(value)
            {

            },
            ////////////////////////////////////////////////////////////////////////////
            //  public methods
            ////////////////////////////////////////////////////////////////////////////

            /**
             * 播放
             * @param loops 循环次数
             * @param delay 延迟播放时间
             * @returns {*}
             */
            play : function(loops, delay)
            {
                this.isPlaying = true;
                var callback = this.controlCallbacks["play"];
                if(callback != null) callback();
                return this;
            },

            /**
             * 暂停
             * @returns {*}
             */
            pause : function()
            {
                this.isPlaying = false;
                var callback = this.controlCallbacks["pause"];
                if(callback != null) callback();
                return this;
            },

            /**
             * 停止
             * @returns {*}
             */
            stop : function()
            {
                this.isPlaying = false;
                var callback = this.controlCallbacks["stop"];
                if(callback != null) callback();
                return this;
            },

            /**
             * 静音
             * @returns {*}
             */
            mute : function()
            {
                this.originalVolume = this.volume;
                this.volume = 0;
                var callback = this.controlCallbacks["mute"];
                if(callback != null) callback();
                return this;
            },

            /**
             * 取消静音
             * @returns {*}
             */
            unmute : function()
            {
                this.volume = this.originalVolume || 1;
                var callback = this.controlCallbacks["unmute"];
                if(callback != null) callback.call();
                return this;
            },

            /**
             * 静音开关
             */
            toggleMute : function()
            {
                if(this.volume == 0) this.unmute();
                else
                    this.mute();
            },

            /**
             * 播放开关
             */
            togglePlay : function()
            {
                if(this.isPlaying) this.pause();
                else
                    this.play(0, 0);
            },

            /**
             * 添加音效播放回调函数
             * @param callBack
             * @returns {*}
             */
            onPlay : function(callBack)
            {
                this.controlCallbacks["play"] = callBack;
                return this;
            },

            /**
             * 添加音效暂停回调函数
             * @param callBack
             * @returns {*}
             */
            onPause : function(callBack)
            {
                this.controlCallbacks["pause"] = callBack;
                return this;
            },

            /**
             * 添加音效停止回调函数
             * @param callBack
             * @returns {*}
             */
            onStop : function(callBack)
            {
                this.controlCallbacks["stop"] = callBack;
                return this;
            },

            /**
             * 添加取消当前音效回调函数
             * @param callBack
             * @returns {*}
             */
            onCancel : function(callBack)
            {
                this.controlCallbacks["cancel"] = callBack;
                return this;
            },

            /**
             * 添加静音回调函数
             * @param callBack
             * @returns {*}
             */
            onMute : function(callBack)
            {
                this.controlCallbacks["mute"] = callBack;
                return this;
            },

            /**
             * 添加取消静音回调函数
             * @param callBack
             * @returns {*}
             */
            onUnMute : function(callBack)
            {
                this.controlCallbacks["unmute"] = callBack;
                return this;
            },

            /**
             * 添加音效播放完毕回调函数
             * @param callBack
             * @returns {*}
             */
            onComplete : function(callBack)
            {
                this.controlCallbacks["soundComplete"] = callBack;
                return this;
            },

            /**
             * 添加音效播放出错回调函数
             * @param callBack
             * @returns {*}
             */
            onError : function(callBack)
            {
                this.controlCallbacks["error"] = callBack;
                return this;
            },

            /**
             * 销毁
             */
            dispose : function()
            {
                this.controlCallbacks = null;
            }
        }
    );
})();