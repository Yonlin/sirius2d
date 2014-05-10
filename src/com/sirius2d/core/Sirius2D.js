/**
 * Sirius2D.js
 * version 1.0.9
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

this.ss2d = this.ss2d || {};

(function()
{

    /**
     * 是否开启调试信息
     */
    ss2d.debug = false;

    /**
     * 引擎版本号
     * @type {string}
     */
    ss2d.version = "0.4.1";

    /**'
     * XML默认读取开关,打开以下划线作为分隔符,关闭则忽略
     * @type {boolean}
     */
    ss2d.xmlUnderline=true;

    /**
     *
     * @type {window|*}
     */
    ss2d.global = window;

    /**
     * 不缓存数据的参数
     * @type {string}
     */
    ss2d.nocache = '';

    /**
     * 似乎否开启鼠标移动监测
     * @type {boolean}
     */
    ss2d.useMouseMove = false;

    /**
     * 创建默认画布
     * @type {HTMLElement}
     */
    ss2d.canvas = document.createElement("canvas");

    /**
     *
     * @type {CanvasRenderingContext2D}
     */
    ss2d.context = ss2d.canvas.getContext("2d");

    /**
     * 声音配置
     * @type {{config: {MP3: {ext: string, mime: string}, M4A: {ext: string, mime: string}, OGG: {ext: string, mime: string}, WEBM: {ext: string, mime: string}, CAF: {ext: string, mime: string}}}}
     */
    ss2d.sound =
    {
        config:
        {
            MP3:  { ext: 'mp3', mime: 'audio/mpeg' },
            M4A:  { ext: 'm4a', mime: 'audio/mp4; codecs=mp4a' },
            OGG:  { ext: 'ogg', mime: 'audio/ogg; codecs=vorbis' },
            WEBM: { ext: 'webm', mime: 'audio/webm; codecs=vorbis' },
            CAF:  { ext: 'caf', mime: 'audio/x-caf' }
        }
    };

    /**
     * 根据标签id或者名称获取对象
     * @param selector
     * @returns {HTMLElement}
     */
    ss2d.$ = function(selector)
    {
        return selector.charAt(0)=='#'?document.getElementById(selector.substr(1)):document.getElementsByTagName(selector);
    };

    /**
     * 新建对象
     * @param name
     * @returns {HTMLElement}
     */
    ss2d.$new = function(name)
    {
        return document.createElement(name);
    };

    /**
     * 输出日志
     */
    ss2d.log = function()
    {
        if (typeof(console) != 'undefined' && ss2d.debug)
        {
            var args = Array.prototype.slice.call(arguments);
            console.log(args.join(","));
        }
    };

    /**
     * 拷贝
     * @param object
     * @returns {*}
     */
    ss2d.copy = function(object)
    {
        if( !object || typeof(object) != 'object' ||
            object instanceof HTMLElement || object instanceof ss2d.Class)
        {
            return object;
        }
        else if(object instanceof Array)
        {
            var c = [];
            for(var i = 0, l = object.length; i < l; i++)
            {
                c[i] = ss2d.copy(object[i]);
            }
            return c;
        }
        else
        {
            var c = {};
            for(var i in object)
            {
                c[i] = ss2d.copy(object[i]);
            }
            return c;
        }
    };

    /**
     * 合并
     * @param original
     * @param extended
     * @returns {*}
     */
    ss2d.merge = function(original, extended)
    {
        for(var key in extended)
        {
            var ext = extended[key];
            if(typeof(ext) != 'object' || ext instanceof HTMLElement || ext instanceof ss2d.Class)
            {
                original[key] = ext;
            }
            else
            {
                if(!original[key] || typeof(original[key]) != 'object')
                {
                    original[key] = (ext instanceof Array) ? [] : {};
                }
                ss2d.merge(original[key], ext);
            }
        }
        return original;
    };

    /**
     * 获取对象偏移
     * @param elem
     * @returns {{left: (Number|number), top: (Number|number)}}
     */
    ss2d.getElementOffset = function(elem)
    {
        var left = elem.offsetLeft, top = elem.offsetTop;
        while((elem = elem.offsetParent) && elem != document.body && elem != document)
        {
            left += elem.offsetLeft;
            top += elem.offsetTop;
        }
        return {left:left, top:top};
    };


    /**
     * 排序
     * @param obj 排序集合
     * @returns {Array}
     */
    ss2d.ksort = function(obj)
    {
        if(!obj || typeof(obj) != 'object')
        {
            return [];
        }
        var keys = [], values = [];
        for(var i in obj)
        {
            keys.push(i);
        }
        keys.sort();
        for(var j = 0; j < keys.length; j++)
        {
            values.push(obj[keys[j]]);
        }
        return values;
    };


    /**
     * 代理
     * @param method
     * @param scope 范围
     * @returns {Function}
     */
    ss2d.proxy = function (method, scope)
    {
        var aArgs = Array.prototype.slice.call(arguments, 2);
        return function ()
        {
            return method.apply(scope, Array.prototype.slice.call(arguments, 0).concat(aArgs));
        };
    };

    /**
     * 弧度转角度
     * @param angle 弧度
     * @returns {Number}
     */
    ss2d.radianToDegree = function(angle)
    {
        return angle * (180.0 / Math.PI);
    };

    /**
     * 角度转弧度
     * @param angle 角度
     * @returns {Number}
     */
    ss2d.degreeToRadian = function(angle)
    {
        return Math.PI * angle / 180.0;
    };

    /**
     * 面积检测
     * @param	p1 范围点
     * @param	p2 范围点
     * @param	p3 范围点
     * @return
     */
    ss2d.hitTrianglePoint=function(p1,p2,p3)
    {
        if ((p2.x-p1.x)*(p2.y+p1.y)+(p3.x-p2.x)*(p3.y+p2.y)+(p1.x-p3.x)*(p1.y+p3.y)<0)
        {
            return 1;
        }
        else
        {
            return 0;
        };
    };


    /**
     * 顶点碰撞检测
     * @param p1 范围点
     * @param p2 范围点
     * @param p3 范围点
     * @param p4 碰撞点
     * @returns {boolean}
     */
    ss2d.hitPoint=function(p1,p2,p3,p4)
    {
        var a = ss2d.hitTrianglePoint(p1,p2,p3);
        var b = ss2d.hitTrianglePoint(p4,p2,p3);
        var c = ss2d.hitTrianglePoint(p1,p2,p4);
        var d = ss2d.hitTrianglePoint(p1,p4,p3);

        if ((b==a)&&(c==a)&&(d==a))
        {
            return true;
        }
        else
        {
            return false;

        };
    };

    /**
     * 正交视口模型矩阵
     * @param matrix  正交的一维数组
     * @param left 左边界
     * @param right 右边界
     * @param bottom 底边界
     * @param top 上边界
     * @param near 近截面
     * @param far 远截面
     */
    ss2d.orthographicViewportMatrix = function(matrix, left, right, bottom, top, near, far)
    {
        matrix[0]   = 2.0 * 1.0 / (right - left);
        matrix[1]   = 0.0;
        matrix[2]   = 0.0;
        matrix[3]   = 0.0;
        matrix[4]   = 0.0;
        matrix[5]   = 2.0 * 1.0 / (top - bottom);
        matrix[6]   = 0.0;
        matrix[7]   = 0.0;
        matrix[8]   = 0.0;
        matrix[9]   = 0.0;
        matrix[10]  = 1.0 / (far - near);
        matrix[11]  = 0.0;
        matrix[12]  = (right + left) / (right - left);
        matrix[13]  = (bottom + top) / (bottom - top);
        matrix[14]  = near / (near - far);
        matrix[15]  = 1.0;
    };

    /**
     * 计算图片最接近的乘方图片
     * @param 需要转换的值
     * @return
     */
    ss2d.getScope=function(num)
    {
        var textureWidth = 2;
        while(textureWidth < num) {
            textureWidth <<= 1;
        }
        return textureWidth;
    };

    /**
     * 检测图片是否为2的次方
     * @param num 值
     * @return
     */
    ss2d.isPower_2=function(num)
    {
        if (num == 0)
        {
            //throw new Error("图片的尺寸不能为0");
            return
        }
        if ((num & (num-1))==0)
        {
            return true;
        }
        return false;
    };

    ss2d.browserPrefix = "";

    /**
     * 检测运行环境是否支持全屏
     */
    ss2d.supportsFullScreen = function()
    {
        var browserPrefixes = 'webkit moz o ms khtml'.split(' ');
        if (typeof document.cancelFullScreen != 'undefined') return true;
        else
        {
            // check for fullscreen support by vendor prefix
            for (var i = 0, il = browserPrefixes.length; i < il; i++ )
            {
                ss2d.browserPrefix = browserPrefixes[i];
                if (typeof document[ss2d.browserPrefix + 'CancelFullScreen' ] != 'undefined' )
                {
                    return true;
                }
            }
        }
        return false;
    };

    /**
     * 浏览器是否全屏状态
     * @returns {*}
     */
    ss2d.isFullScreen = function()
    {
        switch (ss2d.browserPrefix)
        {
            case '':
                return document["fullScreen"];
            case 'webkit':
                return document["webkitIsFullScreen"];
            default:
                return document[ss2d.browserPrefix + 'FullScreen'];
        }
    };

    /**
     * 设置浏览器全屏
     */
    ss2d.requestFullScreen = function()
    {
        if (ss2d.supportsFullScreen())
        {
            var el = ss2d.Stage2D.canvas ? ss2d.Stage2D.canvas : ss2d.canvas;
            ss2d.browserPrefix === '' ? el['requestFullScreen']() : el[ss2d.browserPrefix + 'RequestFullScreen']();
        }
    };

    /**
     * 退出全屏
     * @returns {*}
     */
    ss2d.cancelFullScreen = function()
    {
        if (ss2d.supportsFullScreen())
        {
            return (ss2d.browserPrefix === '') ? document.cancelFullScreen() : document[ss2d.browserPrefix + 'CancelFullScreen']();
        }
    };

    window.requestAnimFrame = window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame;


    Number.prototype.map=function(istart,istop,ostart,ostop)
    {
        return ostart+(ostop-ostart)*((this-istart)/(istop-istart));
    };
    Number.prototype.limit=function(min,max)
    {
        return Math.min(max,Math.max(min,this));
    };
    Number.prototype.round=function(precision)
    {
        precision=Math.pow(10,precision||0);
        return Math.round(this*precision)/precision;
    };
    Number.prototype.floor=function()
    {
        return Math.floor(this);
    };
    Number.prototype.ceil=function()
    {
        return Math.ceil(this);
    };
    Number.prototype.toInt=function()
    {
        return(this|0);
    };
    Array.prototype.erase=function(item)
    {
        for(var i=this.length;i--;)
        {
            if(this[i]===item){
                this.splice(i,1);
            }
        }
        return this;
    };
    Array.prototype.random=function()
    {
        return this[Math.floor(Math.random()*this.length)];
    };
    Function.prototype.bind=function(bind)
    {
        var self=this;
        return function()
        {
            var args=Array.prototype.slice.call(arguments);
            return self.apply(bind||null,args);
        };
    };

})();