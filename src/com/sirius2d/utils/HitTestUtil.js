/**
 * HitTestUtil.js
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
    ss2d.HitTestUtil = Class
    (
        {
            STATIC:
            {
                /**
                 * 点与矩形,矩形的坐标点在图像的中心位置时
                 * @param point
                 * @param rectangle
                 * @returns {boolean}
                 */
                hitTestPoint : function(point, rectangle)
                {
                    //获取点与图像中心点X的距离的绝对值
                    var distanceX = Math.abs(rectangle.x - point.x);
                    //获取点与图像中心点Y的距离的绝对值
                    var distanceY=Math.abs(rectangle.y - point.y);
                    //判断两个绝对值是是否小于图像的一半,是则点在图像的范围之内
                    if(distanceX <= rectangle.width/2 && distanceY <= rectangle.height/2)
                    {
                        return true;
                    }
                    return false;
                },

                /**
                 * 矩形与矩形的碰撞
                 * @param rectA
                 * @param rectB
                 */
                hitTestRectangle : function(rectA, rectB)
                {
                    //获取2个矩形之前的中心点距离
                    var distanceX = Math.abs(rectA.x - rectB.x);
                    var distanceY = Math.abs(rectA.y - rectB.y);
                    //判断距离是否在2个矩形宽度和高度的一半之内,如果是则2个矩形相交
                    if (distanceX <= rectA.width/2 + rectB.width/2 &&
                        distanceY <= rectA.height/2 + rectB.height/2)
                    {
                        return true;
                    }
                    return false;
                },

                /**
                 * 矩形与矩形的碰撞
                 * @param point
                 * @param roundness
                 */
                hitTestRoundness : function(point, roundness)
                {
                    //利用勾股定律获得点与圆心中心点的距离
                    var distanceX = Math.abs(point.x - roundness.x);
                    var distanceY = Math.abs(point.y - roundness.y);
                    var distanceZ = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
                    //判断这个距离是否小于圆的半径,是则在圆形范围之内
                    if(distanceZ <= roundness.radius)
                    {
                        return true;
                    }
                    return false;
                },

                /**
                 * 面积检测算法
                 * @param p1
                 * @param p2
                 * @param p3
                 */
                hitTrianglePoint : function(p1, p2, p3)
                {
                    if ((p2.x - p1.x) * (p2.y + p1.y) + (p3.x - p2.x) * (p3.y + p2.y) + (p1.x-p3.x) * (p1.y + p3.y) < 0)
                    {
                        return 1;
                    }
                    else
                    {
                        return 0;
                    }
                    return 0;
                },

                /**
                 * 顶点碰撞检测
                 * p1,p2,p3 为范围点
                 * p4是碰撞点。
                 * @param p1
                 * @param p2
                 * @param p3
                 * @param p4
                 */
                hitPoint : function(p1, p2, p3, p4)
                {
                    var a = ss2d.HitTestUtil.hitTrianglePoint(p1,p2,p3);
                    var b = ss2d.HitTestUtil.hitTrianglePoint(p4,p2,p3);
                    var c = ss2d.HitTestUtil.hitTrianglePoint(p1,p2,p4);
                    var d = ss2d.HitTestUtil.hitTrianglePoint(p1,p4,p3);
                    if ((b == a) && (c == a) && (d == a))
                    {
                        return true;
                    }
                    else
                    {
                        return false;
                    }
                }
            }
        }
    );
})();