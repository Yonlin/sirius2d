/**
 * Point.js
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
     * Point 点类
     * @class
     */
    ss2d.Point = Class
    (
        /** @lends ss2d.Point.prototype */
        {
            STATIC:
            /** @lends ss2d.Point */
            {
                ////////////////////////////////////////////////////////////////////////////
                // public static methods
                ////////////////////////////////////////////////////////////////////////////

                /**
                 * 返回 pt1 和 pt2 之间的距离。
                 * @param pt1 — 第一个点。
                 * @param pt2 — 第二个点。
                 * @returns — 第一个点和第二个点之间的距离。
                 */
                distance : function(pt1, pt2)
                {
                    var dx = pt2.x - pt1.x;
                    var dy = pt2.y - pt1.y;
                    return Math.sqrt(dx * dx + dy * dy);
                },

                /**
                 * 确定两个指定点之间的点。参数 f 确定新的内插点相对于参数 pt1 和 pt2 指定的两个端点所处的位置。
                 * 参数 f 的值越接近 1.0，则内插点就越接近第一个点（参数 pt1）。
                 * 参数 f 的值越接近 0，则内插点就越接近第二个点（参数 pt2）。
                 * @param pt1 — 第一个点。
                 * @param pt2 — 第二个点。
                 * @param f — 两个点之间的内插级别。表示新点将位于 pt1 和 pt2 连成的直线上的什么位置。如果 f=1，则返回 pt1；如果 f=0，则返回 pt2。
                 * @returns {ss2d.Point} — 新的内插点。
                 */
                interpolate : function(pt1, pt2, f)
                {
                    var pt = new ss2d.Point(0, 0);
                    pt.x = pt1.x + f * (pt2.x - pt1.x);
                    pt.y = pt1.y + f * (pt2.y - pt1.y);
                    return pt;
                },

                /**
                 * 将一对极坐标转换为笛卡尔点坐标。
                 * @param len — 极坐标对的长度。
                 * @param angle — 极坐标对的角度（以弧度表示）。
                 * @returns {ss2d.Point} — 笛卡尔点。
                 */

                polar : function(len, angle)
                {
                    return new ss2d.Point(len * Math.cos(angle), len * Math.sin(angle));
                }
            },

            //////////////////////////////////////////////////////////////////////////
            //  public property
            //////////////////////////////////////////////////////////////////////////

            x : 0,
            y : 0,

            ////////////////////////////////////////////////////////////////////////////
            //  constructor
            ////////////////////////////////////////////////////////////////////////////

            /**
             *
             * @param x
             * @param y
             */
            initialize : function(x, y)
            {
                if (x == undefined) x = 0;
                if (y == undefined) y = 0;
                this.x = x;
                this.y = y;

                if (Object.defineProperty)
                {
                    Object.defineProperty(this, "length",
                        {
                            get: this._get_length
                        });
                }
                else if (this.__defineGetter__)
                {
                    this.__defineGetter__("length", this._get_length);
                }
            },

            /**
             *
             * @returns {number}
             * @private
             */
            getLength : function()
            {
                return Math.sqrt(this.x * this.x + this.y * this.y);
            },


            ////////////////////////////////////////////////////////////////////////////
            //  public methods
            ////////////////////////////////////////////////////////////////////////////

            /**
             * 将另一个点的坐标添加到此点的坐标以创建一个新点。
             * @param v — 要添加的点。
             * @returns {ss2d.Point} — 新点。
             */
            add : function(v)
            {
                return new ss2d.Point(this.x + v.x, this.y + v.y);
            },

            /**
             * 创建此 Point 对象的副本。
             * @returns {ss2d.Point} — 新的 Point 对象。
             */
            clone : function()
            {
                return new ss2d.Point(this.x, this.y);
            },

            /**
             * 确定两个点是否相同。如果两个点具有相同的 x 和 y 值，则它们是相同的点。
             * @param toCompare — 要比较的点。
             * @returns {Boolean} — 如果该对象与此 Point 对象相同，则为 true 值，如果不相同，则为 false。
             */
            equals : function(toCompare)
            {
                return this.x == toCompare.x &&
                    this.y == toCompare.y;
            },

            /**
             * 将 (0,0) 和当前点之间的线段缩放为设定的长度。
             * @param thickness — 缩放值。例如，如果当前点为 (0,5) 并且您将它规范化为 1，则返回的点位于 (0,1) 处。
             */
            normalize : function(thickness)
            {
                var ratio = thickness / this.length;
                this.x *= ratio;
                this.y *= ratio;
            },

            /**
             * 按指定量偏移 Point 对象。
             * dx 的值将添加到 x 的原始值中以创建新的 x 值。
             * dy 的值将添加到 y 的原始值中以创建新的 y 值。
             * @param dx — 水平坐标 x 的偏移量。
             * @param dy — 垂直坐标 y 的偏移量。
             */
            offset : function(dx, dy)
            {
                this.x += dx;
                this.y += dy;
            },

            /**
             * 从此点的坐标中减去另一个点的坐标以创建一个新点。
             * @param v — 要减去的点。
             * @returns {ss2d.Point} — 新点。
             */
            subtract : function(v)
            {
                return new ss2d.Point( this.x - v.x, this.y - v.y );
            }

            ////////////////////////////////////////////////////////////////////////////
            //  private methods
            ////////////////////////////////////////////////////////////////////////////

        }
    );
})();