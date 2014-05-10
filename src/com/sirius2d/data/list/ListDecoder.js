/**
 * ListDecoder.js
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
     * 数据列表XML解析器类
     * @class
     */
    ss2d.ListDecoder = Class
    (
        /** @lends ss2d.ListDecoder.prototype */
        {
            STATIC :
            /** @lends ss2d.ListDecoder */
            {
                /**
                 * 解码XML数据
                 * @param data xml数据
                 * @returns {*}
                 */
                decode : function(data)
                {
                    if (data == undefined) return null;

                    var group = null;
                    var list = new ss2d.List();
                    list.id = data.getAttribute("id");
                    if (data.hasOwnProperty("@allowOverride"))
                    {
                        list.allowOverride = ss2d.StringUtil.toBoolean(data.getAttribute("allowOverride"));
                    }

                    var i;
                    var items = data.child("item");
                    for(i = 0; i < items.length; i++)
                    {
                        list.add(items[i].getAttribute("id"), ss2d.StringUtil.toNative(items[i].text()));
                    }
                    var groups = data.child("group");
                    for(i = 0; i < groups.length; i++)
                    {
                        group = groups[i].getAttribute("id");
                        if(groups[i].hasOwnProperty("@allowOverride"))
                        {
                            list.group(group).allowOverride = ss2d.StringUtil.toBoolean(groups[i].getAttribute("allowOverride"));
                        }
                        var groupChilds = groups[i].children();
                        for(var j = 0; j < groupChilds.length; j++)
                        {
                            list.group(group).add(groupChilds[j].getAttribute("id"), ss2d.StringUtil.toNative(groupChilds[j].text()));
                        }
                    }
                    return list;
                }
            }
        }
    );
})();