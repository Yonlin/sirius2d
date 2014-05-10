/**
 * List.js
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
     * 数据列表类
     * @class
     * @param {String} id 当前数据列表的id
     * @param {Boolean} allowOverride 是否允许覆盖数据
     */
    ss2d.List = Class
    (
        /** @lends ss2d.List.prototype */
        {
            STATIC :
            /** @lends ss2d.List */
            {
                /**
                 * 实例总数
                 */
                instances : 0
            },

            /**
             * @public
             * @desc 数据列表的id
             * @type {String}
             * @default ""
             */
            id : "",

            /**
             * @public
             * @desc 数据列表的子列表id集合
             * @type {Array}
             * @default null
             */
            ids : null,

            /**
             * @public
             * @desc 是否允许覆盖列表中的数据
             * @type {Boolean}
             * @default false
             */
            allowOverride : false,

            /**
             * @public
             * @desc 数据列表中的数据元素存储对象
             * @type {Object}
             * @default null
             */
            items : null,

            /**
             * @public
             * @desc 数据列表中的群组
             * @type {Object}
             * @default null
             */
            groups : null,

            /**
             * @public
             * @desc 数据列表的类类型
             * @default ss2d.List
             */
            listClass : null,

            /**
             * 初始化
             * @public
             * @param {String} id 当前数据列表的id
             * @param {Boolean} allowOverride 是否允许覆盖数据
             * @private
             */
            initialize : function(id, allowOverride)
            {
                this.id = id || "";
                this.allowOverride = allowOverride;
                this.listClass = ss2d.List;
                if(this.id == "") this.id = this._get_uniqueID();
                this.items = {};
                this.groups = {};
                this.ids = [];
                ss2d.List.instances++;
            },

            /**
             * 把XML数据解析成一张List数据表
             * @param {XML} data XML数据
             */
            from : function(data)
            {
                this.merge(ss2d.ListDecoder.decode(data));
            },

            /**
             * 把当前数据表导出成XML数据
             */
            'export' : function()
            {
                return ss2d.ListEncoder.encode(this);
            },

            /**
             * 克隆当前数据表
             */
            clone : function()
            {
                var list = new this.listClass(this.id, this.allowOverride);
                list.items = this.items;
                list.groups = this.groups;
                return list;
            },

            /**
             * 融合到当前数据表
             * @param {ss2d.List} list 需要融合的数据表
             */
            merge : function(list)
            {
                this.allowOverride = list.allowOverride;
                var dictionary = list.items;
                for(var name in dictionary)
                {
                    this.add(dictionary[name].id, dictionary[name].value);
                }
                dictionary = list.groups;
                for(var name in dictionary)
                {
                    var glist = dictionary[name];
                    this.group(glist.id).allowOverride = glist.allowOverride;
                    for(var n in glist.items)
                    {
                        this.group(glist.id).add(glist.items[n].id, glist.items[n].value);
                    }
                }
            },

            /**
             * 新增一条数据
             * @param {string} id 数据ID
             * @param {*} value 数据
             * @returns {ss2d.List} 返回一个新的数据表
             */
            add : function(id, value)
            {
                if(!this.allowOverride)
                {
                    if(!this.items.hasOwnProperty(id))
                        this.items[id] = new ss2d.ListItem(id, value);
                }
                else
                {
                    this.items[id] = new ss2d.ListItem(id, value);
                }
                if(this.ids.indexOf(id) < 0) this.ids.push(id);
                return this;
            },

            /**
             * 根据数据id移除该数据
             * @param {string} id 需要移除的数据ID
             * @returns {ss2d.List} 返回被移除的数据
             */
            remove : function(id)
            {
                if(this.items.hasOwnProperty(id))
                {
                    ss2d.ListItem(this.items[id]).dispose(); // Try to clean the object.
                    delete this.items[id]; // Remove Dictionary reference.

                    // Removing id from ids list.
                    this.ids.splice(this.ids.indexOf(id), 1);
                }
                return this;
            },

            /**
             * 根据数据ID获取数据表中的数据
             * @param {string} id 数据ID
             * @returns {*}
             */
            item : function(id)
            {
                return this.items[id]["value"];
            },

            /**
             * 根据数据组ID获取该数据组
             * @param {string} id 数据组的ID
             * @returns {*}
             */
            group : function(id)
            {
                if(!this.groups.hasOwnProperty(id))
                    this.groups[id] = new this.listClass(id);
                return this.groups[id];
            },

            /**
             * 根据数据在数据表中的索引获取数据
             * @param {number} index
             * @returns {*}
             */
            index : function(index)
            {
                return this.items[this.ids[index]]["value"];
            },

            /**
             * 查询属性名称是否在数据表中的数据中存在
             * @param {string} query
             * @returns {boolean|*|Array|{index: number, input: string}}
             */
            match : function(query)
            {
                var hasId = this.items.hasOwnProperty(query);
                for(var id in this.items)
                {
                    var hasValue = this.items[id].match(query);
                    if(hasValue) break;
                }
                return hasId || hasValue;
            },

            /**
             * 重置数据表
             * @param {boolean} everything
             * @returns {List}
             */
            reset : function(everything)
            {
                this.clearList(this.items);
                this.ids.length = 0;
                if(everything)
                {
                    this.ids = null;
                    this.clearList(this.groups);
                }
                return this;
            },

            /**
             * 获取数据表中数据个数
             * @returns {number}
             */
            length : function()
            {
                var count = 0;
                for(var id in this.items) ++count;
                return count;
            },

            /**
             * 把数据表转换成数组
             * @returns {String}
             */
            toListString : function()
            {
                var stack = this.id;
                for(var n in this.items)
                {
                    stack += "\n\t" + this.items[n].id + " -> " + this.items[n].value;
                }

                for(var n in this.groups)
                {
                    stack += "\n\n\t" + this.groups[n].id;
                    for(var j in this.groups[n].items)
                    {
                        stack += "\n\t\t" + this.groups[n].items[j].id + " -> " + this.groups[n].items[j].value;
                    }
                }
                return stack;
            },

            /**
             * 清除指定数据表中的数据
             * @param dictionary
             */
            clearList : function(dictionary)
            {
                for(var id in dictionary)
                {
                    if (dictionary[id].hasOwnProperty("dispose"))
                        dictionary[id].dispose();
                    delete dictionary[id];
                }
            },

            /**
             * 释放
             */
            dispose : function()
            {
                this.reset(true);
                this.items = null;
                this.groups = null;
            },

            /**
             * 获取数据表中的ID
             * @returns {string}
             * @private
             */
            _get_uniqueID : function()
            {
                return "List_" + ss2d.List.instances;
            }
        }
    );

    ss2d.log("+++++++++"+ss2d.List);
})();