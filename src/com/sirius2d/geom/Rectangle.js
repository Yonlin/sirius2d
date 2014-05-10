/**
 * Rectangle.js
 *
 * HTML5游戏开发者社区 QQ群:326492427 127759656  Email:siriushtml5@gmail.com
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
     * Rectangle 对象是按其位置（由它左上角的点 (x, y) 确定）以及宽度和高度定义的区域。
     * 创建一个新 Rectangle 对象，其左上角由 x 和 y 参数指定，并具有指定的 width 和 height 参数。
     * 如果调用此函数时不使用任何参数，将创建一个 x、y、width 和 height 属性均设置为 0 的矩形。
     * @param x — 矩形左上角的 x 坐标。
     * @param y — 矩形左上角的 y 坐标。
     * @param width — 矩形的宽度（以像素为单位）。
     * @param height — 矩形的高度（以像素为单位）。
     * @class
     */
    ss2d.Rectangle = Class
    (
        /** @lends ss2d.Rectangle.prototype */
        {
            //////////////////////////////////////////////////////////////////////////
            //  public property
            //////////////////////////////////////////////////////////////////////////

            /**
             * 矩形左上角的 x 坐标。
             * @type {number}
             * @default 0
             */
            x : 0,

            /**
             * 矩形左上角的 y 坐标。
             * @type {number}
             * @default 0
             */
            y : 0,

            /**
             * 矩形的宽度（以像素为单位）。
             * @type {number}
             * @default 0
             */
            width : 0,

            /**
             * 矩形的高度（以像素为单位）。
             * @type {number}
             * @default 0
             */
            height : 0,

            ////////////////////////////////////////////////////////////////////////////
            //  constructor
            ////////////////////////////////////////////////////////////////////////////

            /**
             * 初始化
             * @private
             */
            initialize : function(x, y, width, height)
            {
                this.x = x;
                this.y = y;
                this.width = width;
                this.height = height;
            },

            ////////////////////////////////////////////////////////////////////////////
            //  public methods
            ////////////////////////////////////////////////////////////////////////////

            /**
             * 返回一个新的 Rectangle 对象，其 x、y、width 和 height 属性的值与原始 Rectangle 对象的对应值相同。
             * @returns {ss2d.Rectangle}
             */
            clone : function()
            {
                return new ss2d.Rectangle(this.x, this.y, this.width, this.height);
            },

            /**
             * 确定由此 Rectangle 对象定义的矩形区域内是否包含指定的点。
             * @param x — 点的 x 坐标（水平位置）。
             * @param y — 点的 y 坐标（垂直位置）。
             * @returns {Boolean} — 如果 Rectangle 对象包含指定的点，则值为 true；否则为 false。
             */
            contains : function(x, y)
            {
                return x > this.left && x < this.right && y > this.top && y < this.bottom;
            },

            /**
             * 确定由此 Rectangle 对象定义的矩形区域内是否包含指定的点。
             * 此方法与 Rectangle.contains() 方法类似，只不过它采用 Point 对象作为参数。
             * @param point — 用其 x 和 y 坐标表示的点。
             * @returns {Boolean} — 如果 Rectangle 对象包含指定的点，则值为 true；否则为 false。
             */
            containsPoint : function(point)
            {
                return this.contains(point.x, point.y);
            },

            /**
             * 确定此 Rectangle 对象内是否包含由 rect 参数指定的 Rectangle 对象。
             * 如果一个 Rectangle 对象完全在另一个 Rectangle 的边界内，我们说第二个 Rectangle 包含第一个 Rectangle。
             * @param rect — 所检查的 Rectangle 对象。
             * @returns {Boolean} — 如果此 Rectangle 对象包含您指定的 Rectangle 对象，则返回 true 值，否则返回 false。
             */
            containsRect : function(rect)
            {
                return this.containsPoint(rect.topLeft) && this.containsPoint(rect.bottomRight);
            },

            /**
             * 确定在 toCompare 参数中指定的对象是否等于此 Rectangle 对象。
             * 此方法将某个对象的 x、y、width 和 height 属性与此 Rectangle 对象所对应的相同属性进行比较。
             * @param toCompare — 要与此 Rectangle 对象进行比较的矩形。
             * @returns {Boolean}
             */
            equals : function(toCompare)
            {
                return toCompare.topLeft.equals(this.topLeft) && toCompare.bottomRight.equals(this.bottomRight);
            },

            /**
             * 按指定量增加 Rectangle 对象的大小（以像素为单位）。
             * 保持 Rectangle 对象的中心点不变，使用 dx 值横向增加它的大小，使用 dy 值纵向增加它的大小。
             * @param dx — Rectangle 对象横向增加的值。
             * @param dy — Rectangle 纵向增加的值。
             */
            inflate : function(dx, dy)
            {
                this.width += dx;
                this.height += dy;
            },

            /**
             * 增加 Rectangle 对象的大小。
             * 此方法与 Rectangle.inflate() 方法类似，只不过它采用 Point 对象作为参数。
             * @param point — 此 Point 对象的 x 属性用于增加 Rectangle 对象的水平尺寸。
             * y 属性用于增加 Rectangle 对象的垂直尺寸。
             */
            inflatePoint : function(point)
            {
                this.inflate(point.width, point.height);
            },

            /**
             * 如果在 toIntersect 参数中指定的 Rectangle 对象与此 Rectangle 对象相交，
             * 则返回交集区域作为 Rectangle 对象。如果矩形不相交，则此方法返回一个空的 Rectangle 对象，其属性设置为 0。
             * @param toIntersect — 要对照比较以查看其是否与此 Rectangle 对象相交的 Rectangle 对象。
             * @returns — 等于交集区域的 Rectangle 对象。如果该矩形不相交，则此方法返回一个空的 Rectangle 对象；
             * 即，其 x、y、width 和 height 属性均设置为 0 的矩形。
             */
            intersection : function(toIntersect)
            {
                if(this.intersects(toIntersect))
                {
                    var t = Math.max(this.top, toIntersect.top);
                    var l = Math.max(this.left, toIntersect.left);
                    var b = Math.min(this.bottom, toIntersect.bottom);
                    var r = Math.min(this.right, toIntersect.right);
                    return new ss2d.Rectangle(l, t, r-l, b-t);
                }
                else
                {
                    return null;
                }
            },

            /**
             * 确定在 toIntersect 参数中指定的对象是否与此 Rectangle 对象相交。
             * 此方法检查指定的 Rectangle 对象的 x、y、width 和 height 属性，
             * 以查看它是否与此 Rectangle 对象相交。
             * @param toIntersect — 要与此 Rectangle 对象比较的 Rectangle 对象。
             * @returns {Boolean} — 如果指定的对象与此 Rectangle 对象相交，则返回 true 值，否则返回 false。
             */
            intersects : function(toIntersect)
            {
                return this.containsPoint(toIntersect.topLeft) ||
                    this.containsPoint(toIntersect.topRight) ||
                    this.containsPoint(toIntersect.bottomLeft) ||
                    this.containsPoint(toIntersect.bottomRight);
            },

            /**
             * 确定此 Rectangle 对象是否为空。
             * @returns {Boolean} — 如果 Rectangle 对象的宽度或高度小于等于 0，则返回 true 值，否则返回 false。
             */
            isEmpty : function()
            {
                return this.x == 0 &&
                    this.y == 0 &&
                    this.width == 0 &&
                    this.height == 0;
            },

            /**
             * 按指定量调整 Rectangle 对象的位置（由其左上角确定）。
             * @param dx — 将 Rectangle 对象的 x 值移动此数量。
             * @param dy — 将 Rectangle 对象的 y 值移动此数量。
             */
            offset : function(dx, dy)
            {
                this.x += dx;
                this.y += dy;
            },

            /**
             * 将 Point 对象用作参数来调整 Rectangle 对象的位置。
             * 此方法与 Rectangle.offset() 方法类似，只不过它采用 Point 对象作为参数。
             * @param point — 要用于偏移此 Rectangle 对象的 Point 对象。
             */
            offsetPoint : function(point)
            {
                this.offset(point.x, point.y);
            },

            /**
             * 将 Rectangle 对象的所有属性设置为 0。
             * 如果 Rectangle 对象的宽度或高度小于或等于 0，则该对象为空。
             * 此方法将 x、y、width 和 height 属性设置为 0。
             */
            setEmpty : function()
            {
                this.x = this.y = this.width = this.height = 0;
            },

            /**
             * 通过填充两个矩形之间的水平和垂直空间，将这两个矩形组合在一起以创建一个新的 Rectangle 对象。
             * 注意：union() 方法忽略高度或宽度值为 0 的矩形，
             * 如：var rect2:Rectangle = new Rectangle(300,300,50,0);
             * @param toUnion — 要添加到此 Rectangle 对象的 Rectangle 对象。
             * @returns {ss2d.Rectangle} — 充当两个矩形的联合的新 Rectangle 对象。
             */
            union : function(toUnion)
            {
                var t = Math.min(this.top, toUnion.top);
                var l = Math.min(this.left, toUnion.left);
                var b = Math.max(this.bottom, toUnion.bottom);
                var r = Math.max(this.right, toUnion.right);
                return new ss2d.Rectangle(l, t, r-l, b-t);
            }
        }
    );
})();