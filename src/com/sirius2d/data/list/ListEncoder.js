/**
 * ListEncoder.js
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
     * 数据列表编码器类
     * @class
     */
    ss2d.ListEncoder = Class
    (
        /** @lends ListEncoder.prototype */
        {
            STATIC :
            /** @lends ss2d.ListEncoder */
            {
                /**
                 * 将数据表数据编码成XML数据格式
                 * @param {ss2d.List} data 一个数据表
                 * @returns {XML} 返回XML格式的数据
                 */
                encode : function(data)
                {
                    var item, list, raw;
                    raw = "<list id='" + data.id + "' allowOverride='" + data.allowOverride + "'>";

                    for(var i in data.items)
                    {
                        raw += "<item id='" + data.items[i].id + "'>" + data.items[i].value + "</item>";
                    }

                    for(var j in data.groups)
                    {

                        raw += "<group id='" + data.groups[j].id + "' allowOverride='" + data.groups[j].allowOverride + "'>";

                        for(var k in data.groups[j].items)
                        {

                            raw += "<item id='" + data.groups[j].items[k].id + "'>"+ data.groups[j].items[k].value +"</item>";
                        }
                        raw += "</group>";
                    }
                    raw += "</list>";
                    return new XML(raw);
                }
            }
        }
    );
})();