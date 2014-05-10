/**
 * SoundManager.js
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
     * 音效管理类
     * @class
     * @param {string} id 当前音效管理器的ID
     * @example
     * //新建一个声音管理器
     * var sm = new ss2d.SoundManager();
     * //在音乐群组中添加一个声音test_sound
     * sm.group("music").add("test_music").load("assets/audio/test_music.mp3");
     * //在音效群组中添加一个声音test_sound
     * sm.group("sound").add("test_sound").load("assets/audio/test_sound.mp3");
     * //播放音乐
     * sm.group("music").item("test_music").play();
     * //播放音效
     * sm.group("sound").item("test_sound").play();
     *
     */
    ss2d.SoundManager = Class
    (
        /** @lends ss2d.SoundManager.prototype */
        {
            //////////////////////////////////////////////////////////////////////////
            //  Extends
            //////////////////////////////////////////////////////////////////////////

            Extends : ss2d.SoundControl,

            //////////////////////////////////////////////////////////////////////////
            //  public property
            //////////////////////////////////////////////////////////////////////////

            /**
             * 声音数据列表
             * @type {ss2d.List}
             * @private
             */
            list : null,

            ////////////////////////////////////////////////////////////////////////////
            //  constructor
            ////////////////////////////////////////////////////////////////////////////

            /**
             * 初始化
             * @private
             */
            initialize : function(id)
            {
                this.list = new ss2d.List(id == undefined ? "sound_manager" : id);
                this.list.listClass = ss2d.SoundManager;
            },

            ////////////////////////////////////////////////////////////////////////////
            //  Additional getters and setters
            ////////////////////////////////////////////////////////////////////////////

            /**
             * 获取声音的音量
             * @returns {number}
             * @private
             */
            getVolume : function()
            {
                return this.list.index(0).volume;
            },

            /**
             * 设置声音的音量
             * @param value
             * @private
             */
            setVolume : function(value)
            {
                for(var name in this.list.items)
                {
                    this.list.items[name].value.volume = value;
                }
            },

            ////////////////////////////////////////////////////////////////////////////
            //  public methods
            ////////////////////////////////////////////////////////////////////////////

            /**
             * 添加一个音效文件
             * @param {string} id 该声音文件的ID
             * @param {Audio} value 声音文件
             * @returns {ss2d.SoundItem} 返回声音列表内的一个声音元素
             */
            add : function(id, value)
            {
                var sound = null;
                if (value instanceof Audio) sound = value;
                var item = new ss2d.SoundItem(sound);
                this.list.add(id, item);
                return item;
            },

            /**
             * 根据ID移除声音管理器中的声音元素
             * @param {string} id 被移除的声音元素ID
             * @returns {ss2d.SoundManager} 返回当前声音管理
             */
            remove : function(id)
            {
                this.list.remove(id);
                return this;
            },

            /**
             * 根据ID获取当前声音管理器中的声音元素
             * @param {string} id 需要获取的声音元素ID
             * @returns {ss2d.SoundItem} 返回一个声音元素
             */
            item : function(id)
            {
                return this.list.item(id);
            },

            /**
             * 根据ID获取当前声音管理器中的一个群组
             * @param {string} id 需要获取的群组的ID
             * @returns {*}
             */
            group : function(id)
            {
                return this.list.group(id);
            },

            /**
             * 检测声音管理器中是否存在指定ID的声音元素
             * @param {string} id 声音元素ID
             * @returns {boolean}
             */
            match : function(id)
            {
                return this.list.match(id);
            },

            /**
             * 停止播放管理器中的所有声音文件
             * @returns {ss2d.SoundManager} 返回当前声音管理
             */
            stop : function()
            {
                for(var name in this.list.items)
                {
                    this.list.items[name].value.stop();
                }
                return ss2d.SoundManager.Super.stop.call(this);
            },

            /**
             * 播放管理器中的所有声音文件
             * @param {Number} loops 循环次数
             * @param {Number} delay 延迟播放的时间
             * @returns {ss2d.SoundManager} 返回当前声音管理
             */
            play : function(loops, delay)
            {
                for(var name in this.list.items)
                {
                    this.list.items[name].value.play(loops, delay);
                }
                return ss2d.SoundManager.Super.play.call(this);
            },

            /**
             * 暂停播放管理器中的所有声音文件
             * @returns {ss2d.SoundManager} 返回当前声音管理
             */
            pause : function()
            {
                for(var name in this.list.items)
                {
                    this.list.items[name].value.pause();
                }
                return ss2d.SoundManager.Super.pause.call(this);
            },

            /**
             * 当前声音管理器中的声音文件个数
             * @returns {number}
             */
            length : function()
            {
                return this.list.length();
            },

            /**
             * 释放
             */
            dispose : function()
            {
                if(this.list != null)
                {
                    this.list.dispose();
                    this.list = null;
                }
                ss2d.SoundManager.Super.dispose.call(this);
            }
        }
    );
})();