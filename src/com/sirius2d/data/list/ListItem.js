/**
 * ListItem.js
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
     * 数据列表中的元素
     * @class
     * @param {String} id 数据表元素的ID
     * @param {*} value 数据表元素的数值
     */
    ss2d.ListItem = Class
    (
        /** @lends ss2d.ListItem.prototype */
        {
            /**
             * 数据表元素的ID
             * @type {String}
             */
            id : null,

            /**
             * 数据表元素的数值
             * @type {*}
             */
            value : null,


            ////////////////////////////////////////////////////////////////////////////
            //  constructor
            ////////////////////////////////////////////////////////////////////////////

            /**
             * 初始化
             * @private
             */
            initialize : function(id, value)
            {
                this.id = id;
                this.value = value;
            },

            /**
             *
             * @param query
             * @returns {boolean}
             */
            match : function(query)
            {
                return this.value === query;
            },

            /**
             *
             * @returns {*}
             */
            toString : function()
            {
                return this.value;
            },

            /**
             * 释放
             */
            dispose : function()
            {
                if (this.value != null)
                {
                    if (this.value.hasOwnProperty("dispose")) this.value.dispose();
                    if (this.value.hasOwnProperty("kill")) this.value.kill();
                    if (this.value.hasOwnProperty("flush")) this.value.flush();
                    if (this.value.hasOwnProperty("destroy")) this.value.destroy();
                    this.value = null;
                }
            }
        }
    );
})();