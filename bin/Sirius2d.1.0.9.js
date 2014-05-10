/*! Sirius2d - v1.0.9 - 2014-04-28
* undefined
* Copyright (c) 2014 ; Licensed MIT */
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
(function(globalNamespace)
{
    "use strict";

    /**
     *
     * @param method
     * @param name
     * @private
     */
    function applyMethodName(method, name)
    {
        method.toString = function () { return name; };
    }

    /**
     *
     * @param NewClass
     * @param name
     * @private
     */
    function applyConstructorName(NewClass, name)
    {
        NewClass.toString = function () { return name; };
    }

    /**
     *
     * @param NewClass
     * @param name
     * @private
     */
    function applyClassNameToPrototype(NewClass, name)
    {
        NewClass.prototype.toString = function () { return name; };
    }


    var Class = function (classPath, classDefinition, local)
    {
        var SuperClass, implementations, className, Initialize, ClassConstructor;

        if (arguments.length < 2)
        {
            classDefinition = classPath;
            classPath = "";
        }

        SuperClass = classDefinition['Extends'] || null;
        delete classDefinition['Extends'];

        implementations = classDefinition['Implements'] || null;
        delete classDefinition['Implements'];

        Initialize = classDefinition['initialize'] || null;
        delete classDefinition['initialize'];

        if (!Initialize)
        {
            if (SuperClass)
            {
                Initialize = function () { SuperClass.apply(this, arguments); };
            }
            else
            {
                Initialize = function () {};
            }
        }

        className = classPath.substr(classPath.lastIndexOf('.') + 1);
        ClassConstructor = new Function('initialize', 'return function ' + className + '() { initialize.apply(this, arguments); }')(Initialize);
        applyConstructorName(ClassConstructor, classPath);

        Class['inherit'](ClassConstructor, SuperClass);

        Class['implement'](ClassConstructor, implementations);

        applyClassNameToPrototype(ClassConstructor, classPath);

        Class['extend'](ClassConstructor, classDefinition, true);

        if(!local)
        {
            Class['namespace'](classPath, ClassConstructor);
        }

        return ClassConstructor;
    };

    /**
     *
     * @param target
     * @param extension
     * @param shouldOverride
     * @private
     */
    Class['augment'] = function (target, extension, shouldOverride)
    {
        var propertyName, property, targetHasProperty,
            propertyWouldNotBeOverriden, extensionIsPlainObject, className;

        for (propertyName in extension)
        {
            if (extension.hasOwnProperty(propertyName))
            {
                targetHasProperty = target.hasOwnProperty(propertyName);
                if (shouldOverride || !targetHasProperty)
                {
                    property = target[propertyName] = extension[propertyName];
                    if (typeof property === 'function')
                    {
                        extensionIsPlainObject = (extension.toString === Object.prototype.toString);
                        className = extensionIsPlainObject ? target.constructor : extension.constructor;
                        applyMethodName(property, className + "::" + propertyName);
                    }
                }
            }
        }
    };

    /**
     *
     * @param TargetClass
     * @param extension
     * @param shouldOverride
     * @private
     */
    Class['extend'] = function (TargetClass, extension, shouldOverride)
    {
        if (extension['STATIC'])
        {
            if(TargetClass.Super)
            {
                // add static properties of the super class to the class namespace
                Class['augment'](TargetClass, TargetClass.Super['_STATIC_'], true);
            }
            // add static properties and methods to the class namespace
            Class['augment'](TargetClass, extension['STATIC'], true);
            // save the static definitions into special var on the class namespace
            TargetClass['_STATIC_'] = extension['STATIC'];
            delete extension['STATIC'];
        }
        // add properties and methods to the class prototype
        Class['augment'](TargetClass.prototype, extension, shouldOverride);
    };

    /**
     *
     * @param SubClass
     * @param SuperClass
     * @private
     */
    Class['inherit'] = function (SubClass, SuperClass)
    {
        if (SuperClass)
        {
            var SuperClassProxy = function () {};
            SuperClassProxy.prototype = SuperClass.prototype;

            SubClass.prototype = new SuperClassProxy();
            SubClass.prototype.constructor = SubClass;
            SubClass.Super = SuperClass;

            Class['extend'](SubClass, SuperClass, false);
        }
    };

    /**
     *
     * @param TargetClass
     * @param implementations
     * @private
     */
    Class['implement'] = function (TargetClass, implementations)
    {
        if (implementations)
        {
            var index;
            if (typeof implementations === 'function')
            {
                implementations = [implementations];
            }
            for (index = 0; index < implementations.length; index += 1)
            {
                Class['augment'](TargetClass.prototype, implementations[index].prototype, false);
            }
        }
    };

    /**
     *
     * @param namespacePath
     * @param exposedObject
     * @private
     */
    Class['namespace'] = function (namespacePath, exposedObject)
    {
        if(typeof globalNamespace['define'] === "undefined")
        {
            var classPathArray, className, currentNamespace, currentPathItem, index;
            classPathArray = namespacePath.split('.');
            className = classPathArray[classPathArray.length - 1];
            currentNamespace = globalNamespace;
            for(index = 0; index < classPathArray.length - 1; index += 1)
            {
                currentPathItem = classPathArray[index];
                if(typeof currentNamespace[currentPathItem] === "undefined")
                {
                    currentNamespace[currentPathItem] = {};
                }
                currentNamespace = currentNamespace[currentPathItem];
            }
            currentNamespace[className] = exposedObject;
        }
    };

    if (typeof define !== "undefined")
    {
        define('Class', [], function () { return Class; });
    }
    // expose on global namespace like window (browser) or exports (node)
    else if (globalNamespace)
    {
        /** @expose */
        globalNamespace['Class'] = Class;
    }

})(typeof define !== "undefined" || typeof window === "undefined" ? exports : window);
(function (globalNamespace)
{
    function defineInterfaceModule(Class)
    {
        /**
         * @constructor
         */
        var ImplementationMissingError = function (message)
        {
            this.name = "ImplementationMissingError";
            this.message = (message || "");
        };

        ImplementationMissingError.prototype = Error.prototype;

        function createExceptionThrower(interfaceName, methodName, expectedType)
        {
            return function()
            {
                var message = 'Missing implementation for <' + this + '::' + methodName + '> defined by interface ' + interfaceName;
                throw new ImplementationMissingError(message);
            };
        }

        var Interface = function(path, definition, local)
        {
            if(typeof path !== 'string')
            {
                throw new Error('Please give your interface a name. Pass "true" as last parameter to avoid global namespace pollution');
            }

            var interfaceName = path.substr(path.lastIndexOf('.') + 1),
                methodName,
                property;

            /*jslint evil: true */
            var InterfaceConstructor = new Function('return function ' + interfaceName + '() {}')();

            for(methodName in definition)
            {
                if(definition.hasOwnProperty(methodName))
                {
                    property = definition[methodName];
                    InterfaceConstructor.prototype[methodName] = createExceptionThrower(path, methodName, property);
                }
            }

            if(!local)
            {
                Class['namespace'](path, InterfaceConstructor);
            }
            InterfaceConstructor.toString = function () { return interfaceName; };
            return InterfaceConstructor;
        };

        Interface['ImplementationMissingError'] = ImplementationMissingError;
        return Interface;
    }

    // Return as AMD module or attach to head object
    if (typeof define !== "undefined")
    {
        define('Interface', ['Class'], function (Class) { return defineInterfaceModule(Class); });
    }
    // expose on global namespace (browser)
    else if (typeof window !== "undefined")
    {
        /** @expose */
        globalNamespace['Interface'] = defineInterfaceModule(globalNamespace['Class']);
    }
    // expose on global namespace (node)
    else
    {
        var Class = require('./Class')['Class'];
        globalNamespace.Interface = defineInterfaceModule(Class);
    }
}(typeof define !== "undefined" || typeof window === "undefined" ? exports : window));
(function()
{
    /**
     * MVC框架中的事件类
     * @class
     * @param {String} type
     * @param {Object} data
     * @param {boolean} tracking
     * @param {boolean} strict
     */
    ss2d.ControlEvent = Class
    (
        /** @lends ss2d.ControlEvent.prototype */
        {
            //////////////////////////////////////////////////////////////////////////
            //  public property
            //////////////////////////////////////////////////////////////////////////

            /**
             * 核心标识，默认为模块事件
             * @type {string}
             * @default "*"
             */
            coreId : "*",

            /**
             * 事件类型
             * @type {string}
             */
            type : null,

            /**
             * 附加数据
             * @type {object}
             */
            data : null,

            /**
             * 是否追踪
             * @type {boolean}
             * @default true
             */
            tracking : true,

            /**
             * 是否限制发送范围
             * @type {boolean}
             * @default false
             */
            strict : false,

            ////////////////////////////////////////////////////////////////////////////
            //  constructor
            ////////////////////////////////////////////////////////////////////////////

            /**
             * 初始化
             * @private
             */
            initialize:function(type, data, tracking, strict)
            {
                this.type = type;
                this.data = data;
                this.tracking = tracking;
                this.strict = strict;
            }
        });
})();
(function()
{
    /**
     * MVC框架的控制器
     * @class
     * @param {string} cid 控制器ID
     * @param {ss2d.ControlEvent} e 监听的事件
     * @param {string} tag 目标模块核心
     */
    ss2d.Controller = Class
    (
        /** @lends ss2d.Controller.prototype */
        {
            STATIC:
            /** @lends ss2d.Controller */
            {
                ////////////////////////////////////////////////////////////////////////////
                // private static property
                ////////////////////////////////////////////////////////////////////////////

                /**
                 * Controller实例缓存池
                 * @type {Array}
                 * @private
                 */
                _controllerMap : [],

                ////////////////////////////////////////////////////////////////////////////
                // public static methods
                ////////////////////////////////////////////////////////////////////////////

                /**
                 * 检查指定的Controller实例是否已注册
                 * @param {string} cid 控制器id
                 * @param {string} coreId 核心标识
                 * @return {boolean} 如果已注册，返回true，否则返回false
                 */
                hasController : function(cid, coreId)
                {
                    var controllers = ss2d.Controller._controllerMap[coreId];
                    if (controllers)
                    {
                        var len = controllers.length;
                        for (var i = 0; i < len; ++i)
                        {
                            if (controllers[i].cid == cid)
                            {
                                return true;
                            }
                        }
                    }
                    return false;
                },

                /**
                 * 注销指定核心中的Controller实例
                 * @param {string} cid 被注销控制器的ID
                 * @param {string} coreId 核心标识
                 * @return {boolean} 移除成功，返回true，否则返回false
                 */
                removeController : function(cid, coreId)
                {
                    var controllers = ss2d.Controller._controllerMap[coreId];
                    if (controllers)
                    {
                        var len = controllers.length;
                        for (var i = 0; i < len; ++i)
                        {
                            if (controllers[i].cid == cid)
                            {
                                //注销附加操作
                                controllers[i].onRemove();
                                controllers[i] = null;
                                //确保controller总是非空
                                controllers.splice(i, 1);
                                return true;
                            }
                        }
                    }
                    return false;
                },

                /**
                 * 注销指定核心
                 * @param {string} coreId 核心标识
                 */
                removeCore : function(coreId)
                {
                    var controllers = ss2d.Controller._controllerMap[coreId];
                    if (controllers)
                    {
                        var i = 0;
                        while (i < controllers.length)
                        {
                            ss2d.Controller.removeController(controllers[controllers.length - 1].cid, coreId);
                        }
                    }
                    //删除核心
                    delete ss2d.Controller._controllerMap[coreId];
                    ss2d.Controller.removeRouter(coreId);
                },

                /**
                 * 注销与指定核心关联，用于模块通信的Controller实例
                 * @param {string} coreId 核心标识
                 */
                removeRouter : function(coreId)
                {
                    var routers = ss2d.Controller._controllerMap["*"];
                    if (routers)
                    {
                        var routerslen = routers.length;
                        for (var i = 0; i < routerslen; --routerslen)
                        {
                            if (routers[routerslen - 1].coreId == coreId)
                            {
                                routers.splice(routerslen - 1, 1);
                            }
                        }
                    }
                },

                /**
                 * 控制器范围内广播事件
                 * @param {ss2d.Controller} e
                 */
                notifyControllers : function(e)
                {
                    var controllers = ss2d.Controller._controllerMap[e.coreId];
                    if (controllers)
                    {
                        var i = 0;
                        while(i < controllers.length)
                        {
                            if (controllers[i].eventType == e.type)
                            {
                                //执行一个或多个命令（FIFO）
                                controllers[i].execute(e);
                            }
                            i++;
                        }
                    }
                }
            },

            //////////////////////////////////////////////////////////////////////////
            //  public property
            //////////////////////////////////////////////////////////////////////////

            /**
             * 注册控制器的id
             * @type {String}
             */
            cid:null,

            /**
             * 核心标识，负责模块通信的Controller统一注册到核心“*”
             * @type {String}
             */
            coreId:null,

            /**
             * 关联事件类型
             * @type {String}
             */
            eventType:null,

            ////////////////////////////////////////////////////////////////////////////
            //  constructor
            ////////////////////////////////////////////////////////////////////////////

            /**
             * 构造函数
             * @private
             */
            initialize:function(cid, e, tag)
            {
                this.cid = cid;
                //初始化
                if (ss2d.Controller._controllerMap[e.coreId] == undefined)
                {
                    ss2d.Controller._controllerMap[e.coreId] = [];
                }
                if (e.coreId != "*")
                {
                    if (ss2d.Controller.hasController(this, e.coreId))
                        throw new Error("Controller[" + cid + "] instance " + '@ "' + e.coreId + '"' + " already constructed !");
                }

                this.eventType = e.type;

                //标记核心
                (e.coreId != "*") ? this.coreId = e.coreId : this.coreId = tag;

                ss2d.Controller._controllerMap[e.coreId].push(this);
                this.onRegister();
            },

            ////////////////////////////////////////////////////////////////////////////
            //  public methods
            ////////////////////////////////////////////////////////////////////////////

            /**
             * 框架范围内广播事件
             * @param {ss2d.ControlEvent} e
             */
            sendEvent:function(e)
            {
                if (!e.strict)
                {
                    ss2d.View.notifyViews(e);
                }
                ss2d.Controller.notifyControllers(e);
            },

            /**
             * 执行Controller逻辑处理，需在子类中覆盖使用
             * @param {ss2d.ControlEvent} e
             */
            execute:function(e)
            {

            },

            /**
             * 注册附加操作，需在子类中覆盖使用
             */
            onRegister:function()
            {

            },

            /**
             * 注销附加操作，需在子类中覆盖使用
             */
            onRemove:function()
            {

            },

            /**
             * 注册View
             * @param {String} vid 注册视图id
             * @param {ss2d.View} classObj View子类
             * @param {*} viewComponent 关联视图组件
             */
            registerView:function(vid, classObj, viewComponent)
            {
                new classObj(vid,viewComponent, this.coreId);
            },

            /**
             * 取回View
             * @param {String} vid
             * @param {String} coreId
             * @returns {ss2d.View}
             */
            retrieveView:function(vid, coreId)
            {
                return ss2d.View._retrieveView(vid, (coreId == undefined ? this.coreId : coreId));
            },

            /**
             * 注销View
             * @param vid
             * @param coreId
             */
            removeView:function(vid, coreId)
            {
                ss2d.View._removeView(vid, (coreId == undefined ? this.coreId : coreId));
            },

            /**
             * 注册Controller
             * @param {String} cid
             * @param {ss2d.Controller} classObj
             * @param {ss2d.ControlEvent} e
             */
            registerController:function(cid, classObj, e)
            {
                e.coreId != "*" ? new classObj(cid,e) : new classObj(cid, e, this.coreId);
            },

            /**
             * 注销Controller
             * @param {String} cid
             * @returns {Boolean}
             */
            removeController:function(cid)
            {
                return ss2d.Controller.removeController(cid, this.coreId);
            },

            /**
             * 注册Model
             * @param {String} mid
             * @param {ss2d.Model} classObj
             * @param {*} data
             */
            registerModel:function(mid, classObj, data)
            {
                new classObj(this.coreId, mid, data);
            },

            /**
             * 取回Model
             * @param {String} mid
             * @param {String} coreId
             * @returns {ss2d.Model}
             */
            retrieveModel:function(mid, coreId)
            {
                return ss2d.Model.retrieveModel(mid, (coreId == undefined ? this.coreId : coreId));
            },

            /**
             * 注销Model
             * @param {String} mid
             * @param {String} coreId
             */
            removeModel:function(mid, coreId)
            {
                ss2d.Model.removeModel(mid, (coreId == undefined ? this.coreId : coreId));
            }
        }
    );
})();
(function()
{
    /**
     * MVC框架的数据模型管理器
     * @class
     * @param {string} coreId 模块核心标识
     * @param {string} mid 数据模型管理器ID
     * @param {object} data 数据模型的初始数据
     */
    ss2d.Model = Class
    (
        /** @lends ss2d.Model.prototype */
        {
            STATIC:
            /** @lends ss2d.Model */
            {
                ////////////////////////////////////////////////////////////////////////////
                // private static property
                ////////////////////////////////////////////////////////////////////////////

                /**
                 * Model实例缓存池
                 * @type {Array}
                 */
                _modelMap : [],

                ////////////////////////////////////////////////////////////////////////////
                // public static methods
                ////////////////////////////////////////////////////////////////////////////

                /**
                 * 取回指定核心中的Model实例
                 * @param mid 需要取回的数据模型管理器的ID
                 * @param coreId 核心标识
                 * @return {ss2d.Model} 返回数据模型管理器
                 */
                retrieveModel : function(mid, coreId)
                {
                    var models = ss2d.Model._modelMap[coreId];
                    if (models)
                    {
                        var len = models.length;
                        for (var i = 0; i < len; ++i)
                        {
                            if (models[i].mid == mid)
                            {
                                return models[i];
                            }
                        }
                    }
                    return null;
                },

                /**
                 * 注销指定核心中的Model实例
                 * @param {string} mid 需要注销的数据模型ID
                 * @param {string} coreId 核心标识
                 * @return {ss2d.Model} 返回Model子类实例
                 */
                removeModel : function(mid, coreId)
                {
                    var models = ss2d.Model._modelMap[coreId];
                    if (models)
                    {
                        var len = models.length;
                        for (var i = 0; i < len; ++i)
                        {
                            if (models[i].mid == mid)
                            {
                                //注销附加操作
                                models[i].onRemove();
                                models[i].data = null;
                                models[i] = null;

                                //确保model总是非空
                                models.splice(i, 1);
                                break;
                            }
                        }
                    }
                },

                /**
                 * 注销指定核心
                 * @param {string} coreId 核心标识
                 */
                removeCore : function(coreId)
                {
                    var models = ss2d.Model._modelMap[coreId];
                    if (models)
                    {
                        var i = 0;
                        while (i < models.length)
                        {
                            ss2d.Model.removeModel(models[models.length - 1].mid, coreId);
                        }
                    }
                    delete ss2d.Model._modelMap[coreId];
                }
            },

            //////////////////////////////////////////////////////////////////////////
            //  public property
            //////////////////////////////////////////////////////////////////////////

            /**
             * 注册模型id
             * @type {string}
             */
            mid : null,

            /**
             * 核心标识
             * @type {string}
             */
            coreId : null,

            /**
             * 持有数据
             * @type {object}
             */
            data : {},

            ////////////////////////////////////////////////////////////////////////////
            //  constructor
            ////////////////////////////////////////////////////////////////////////////

            /**
             * 初始化
             * @private
             */
            initialize : function(coreId, mid, data)
            {
                if (mid == undefined)
                    throw new Error("mid can not undefined!");

                this.mid = mid;

                if (ss2d.Model._modelMap[coreId] == undefined)
                {
                    ss2d.Model._modelMap[coreId] = [];
                }

                if (ss2d.Model.retrieveModel(mid, coreId) != null)
                    throw new Error("Model[" + mid +"]" + " instance " + '@ "' + coreId + '"' + " already constructed !");

                this.coreId = coreId;
                if (data != null)
                {
                    for (var name in data)
                    {
                        this.data[name] = data[name];
                    }
                }
                ss2d.Model._modelMap[coreId].push(this);
                this.onRegister();
            },

            ////////////////////////////////////////////////////////////////////////////
            //  public methods
            ////////////////////////////////////////////////////////////////////////////

            /**
             * 通知视图
             * @param e ControlEvent
             */
            sendEvent : function(e)
            {
                ss2d.View.notifyViews(e);
            },

            /**
             * 注册附加操作，需在子类中覆盖使用
             */
            onRegister : function()
            {

            },

            /**
             * 注销附加操作，需在子类中覆盖使用
             */
            onRemove : function()
            {

            },

            /**
             * 缓存数据对象
             */
            importData : function(value)
            {
                if (value == null) this.data = {};
                else
                {
                    for (var name in value)
                    {
                        this.data[name] = value[name];
                    }
                }
            }
        }
    );
})();
(function()
{
    /**
     * 视图管理器
     * @class
     * @param {String} vid 视图管理器ID
     * @param {*} viewComponent 关联视图组件
     * @param {String} coreId 模块核心ID
     */
    ss2d.View = Class
    (
        /** @lends ss2d.View.prototype */
        {
            STATIC:
            /** @lends ss2d.View */
            {
                ////////////////////////////////////////////////////////////////////////////
                // private static property
                ////////////////////////////////////////////////////////////////////////////

                /**
                 * View实例缓存池
                 * @private
                 */
                _viewMap : [],

                ////////////////////////////////////////////////////////////////////////////
                // public static methods
                ////////////////////////////////////////////////////////////////////////////

                /**
                 * 取回指定核心中的View实例
                 * @param {String} vid 视图管理器ID
                 * @param {String} coreId 模块核心标识
                 * @return {ss2d.View} 返回视图管理器
                 */
                _retrieveView : function(vid, coreId)
                {
                    var views = ss2d.View._viewMap[coreId];
                    if (views)
                    {
                        var len = views.length;
                        for (var i = 0; i < len; ++i)
                        {
                            if (views[i].vid == vid)
                            {
                                return views[i];
                            }
                        }
                    }
                    return null;
                },

                /**
                 * 注销指定核心中的View实例
                 * @param {String} vid 视图管理器ID
                 * @param {String} coreId 核心标识
                 * @return {ss2d.View} 返回被移除的视图管理器
                 */
                _removeView : function(vid, coreId)
                {
                    var views = ss2d.View._viewMap[coreId];
                    if (views)
                    {
                        var len = views.length;
                        for (var i = 0; i < len; ++i)
                        {
                            if (views[i].vid == vid)
                            {
                                views[i].onRemove();
                                views[i].viewComponent = null;
                                views[i].eventList = null;
                                views[i] = null;
                                views.splice(i, 1);
                                break;
                            }
                        }
                    }
                },

                /**
                 * 注销指定核心
                 * @param {String} coreId 核心标识
                 */
                removeCore : function(coreId)
                {
                    var views = ss2d.View._viewMap[coreId];
                    if (views)
                    {
                        var i = 0;
                        while (i < views.length)
                        {
                            ss2d.View.removeView(views[views.length - 1].vid, coreId);
                        }
                    }
                    delete ss2d.View._viewMap[coreId];
                },

                /**
                 * 视图范围内广播事件
                 * @param {ss2d.ControlEvent} e
                 */
                notifyViews : function(e)
                {
                    if (e.coreId == "*") throw new Error("Model&View不具备模块通信能力!");
                    var views = ss2d.View._viewMap[e.coreId];
                    if (views)
                    {
                        var len = views.length;
                        var motifyList = [];
                        for (var i = 0; i < len; ++i)
                        {
                            var eventLen = views[i].eventList.length;
                            for (var k = 0; k < eventLen; ++k)
                            {
                                if (views[i].eventList[k] == e.type)
                                {
                                    motifyList.push(views[i]);
                                }
                            }
                        }
                        for (var j = 0; j < motifyList.length; j++)
                        {
                            motifyList[j].handleEvent(e);
                        }
                    }
                }
            },

            //////////////////////////////////////////////////////////////////////////
            //  public property
            //////////////////////////////////////////////////////////////////////////

            /**
             * 注册视图ID
             * @type {String}
             */
            vid : null,

            /**
             * 核心标识
             * @type {String}
             */
            coreId : null,

            /**
             * 视图组件，通常在子类中使用getter将其转换为原始类型
             * @type {*}
             */
            viewComponent : null,

            /**
             * 响应事件列表
             * @type {Array}
             */
            eventList : [],

            ////////////////////////////////////////////////////////////////////////////
            //  constructor
            ////////////////////////////////////////////////////////////////////////////

            /**
             * 初始化
             * @private
             */
            initialize : function(vid, viewComponent, coreId)
            {
                if (vid == undefined) throw new Error("vid can not undefined!");
                this.vid = vid;
                if (ss2d.View._viewMap[coreId] == undefined)
                {
                    ss2d.View._viewMap[coreId] = [];
                }
                if (ss2d.View._retrieveView(vid, coreId) != null)
                    throw new Error("View[" + vid + "] instance " + '@ "' + coreId + '"' + " already constructed !");

                this.coreId = coreId;
                this.viewComponent = viewComponent;
                this.eventList = this.listEventInterests();
                ss2d.View._viewMap[this.coreId].push(this);
                this.onRegister();
            },

            ////////////////////////////////////////////////////////////////////////////
            //  public methods
            ////////////////////////////////////////////////////////////////////////////

            /**
             * 返回需要响应的事件类型列表，需在子类中覆盖使用
             * @return Array 需要响应的事件类型列表
             */
            listEventInterests : function()
            {
                return [];
            },

            /**
             * 分类响应事件，需在子类中覆盖使用
             * @param {ss2d.ControlEvent} e
             */
            handleEvent : function(e)
            {

            },

            /**
             * 框架范围内广播事件
             * @param {ss2d.ControlEvent} e
             */
            sendEvent : function(e)
            {
                if (!e.strict) ss2d.Controller.notifyControllers(e);
                ss2d.View.notifyViews(e);
            },

            /**
             * 注册附加操作，需在子类中覆盖使用
             */
            onRegister : function()
            {

            },

            /**
             * 注销附加操作，需在子类中覆盖使用
             */
            onRemove : function()
            {

            },

            /**
             * 注册View
             * @param {String} vid 视图管理器ID
             * @param {ss2d.View} classObj View子类
             * @param {*} viewComponent 关联视图组件
             */
            registerView : function(vid, classObj, viewComponent)
            {
                new classObj(vid, viewComponent, this.coreId);
            },

            /**
             * 取回View
             * @param {String} vid 视图管理器ID
             * @param {String} coreId 所在模块的核心ID
             * @return {String} coreId 所在模块的核心ID
             */
            retrieveView : function(vid, coreId)
            {
                return ss2d.View._retrieveView(vid, (coreId == undefined ? this.coreId : coreId));
            },

            /**
             * 取回Model
             * @param {String} mid 数据模型管理器ID
             * @return {ss2d.Model} Model子类实例
             */
            retrieveModel : function(mid, coreId)
            {
                return ss2d.Model.retrieveModel(mid, (coreId == undefined ? this.coreId : coreId));
            }
        }
    );
})();
(function()
{
    /**
     * 模块
     * @class
     * @param {String} coreId 模块ID
     */
    ss2d.Module = Class
    (
        /** @lends ss2d.Module.prototype */
        {
            //////////////////////////////////////////////////////////////////////////
            //  public property
            //////////////////////////////////////////////////////////////////////////

            /**
             * 模块核心ID
             * @type {String}
             */
            coreId : null,

            ////////////////////////////////////////////////////////////////////////////
            //  constructor
            ////////////////////////////////////////////////////////////////////////////

            /**
             * 初始化
             * @private
             */
            initialize : function(coreId)
            {
                this.coreId = coreId;
                this.create();
            },

            ////////////////////////////////////////////////////////////////////////////
            //  public methods
            ////////////////////////////////////////////////////////////////////////////

            /**
             * 模块入口
             */
            create : function()
            {

            },

            /**
             * 注册数据模型管理器
             * @param {String} mid 数据模型管理器的ID
             * @param {ss2d.Model} classObj 数据模型管理类
             * @param {Object} data 数据模型管理器初始数据
             */
            registerModel : function(mid,classObj, data)
            {
                new classObj(this.coreId, mid, data);
            },

            /**
             * 注册视图管理器
             * @param {String} vid 视图管理器ID
             * @param {ss2d.View} classObj 视图管理类
             * @param {*} viewComponent 视图
             */
            registerView : function(vid, classObj, viewComponent)
            {
                new classObj(vid, viewComponent, this.coreId);
            },

            /**
             * 注册控制器
             * @param {String} cid 控制器ID
             * @param {ss2d.Controller} classObj 控制器类
             * @param {ss2d.ControlEvent} e 触发控制器的事件
             */
            registerController : function(cid, classObj, e)
            {
                e.coreId != "*" ? new classObj(cid, e) : new classObj(cid, e, this.coreId);
            }
        }
    );
})();
(function()
{
    /**
     * Broadcast 事件发射器 用于消息的事件机制，可以给任意注册过消息体的类发送任意数据
     * @class
     */
    ss2d.Broadcast = Class
    (
        {
            STATIC:
            {
                /** @lends ss2d.Broadcast.prototype */

                /**
                 * 发送消息
                 * @param type 消息类型
                 * @param message 消息体
                 */
                send : function(type,message)
                {
                    if (message != null)
                    {
                        message.type = event;
                    }

                    for (var i = 0; i < ss2d.MessageList.getInstance().eventMessageList.length;i++)
                    {

                        if (ss2d.MessageList.getInstance().eventMessageList[i].getEvents(type))
                        {
                            ss2d.MessageList.getInstance().eventMessageList[i].execute(type,message)
                        }
                    }

                }
            }

        }
    );
})();
(function()
{
    /**
     * Message 消息体
     * @class
     */
    ss2d.Message = Class
    (
        /** @lends ss2d.Message.prototype */
        {
            /**
             * 消息内容
             */
            userData:null,

            /**
             * 消息类型
             */
            type:null
        }
    );
})();
(function()
{
    ss2d.MessageData = Class
    (
        {

            /**
             * 内部消息库
             */
           eventsList:null,

            initialize : function()
            {
                ss2d.MessageList.getInstance().addEventObject(this);
            },

            /**
             * 执行某个函数
             * @param	event
             * @param	e
             */
            execute:function(type,message)
            {

                this.eventsList[type](message);
            },

            /**
             * 检测消息列表是否存在这条消息
             * @return
             */
            getEvents:function(type)
            {
                if (this.eventsList == null)
                {
                    return false;
                }
                if (this.eventsList[type] != null)
                {
                    return true
                }


                return false;
            },

            /**
             * 消息侦听器
             * @param	event
             * @param	fun
             */
            addEventMessage:function(type,fun)
            {

                if(this.eventsList == null)
                {
                    this.eventsList = [];
                }
                this.eventsList[type] = fun;
            },

            /**
             * 销毁所有事件
             */
            disposeEvent:function()
            {
                for(var i in this.eventsList){
                delete this.eventsList[i];
            }
                this.eventsList = null;
            },

            /**
             * 移除事件侦听
             * @param	event
             */
            removeEventMessage:function(type)
            {
                if (this.eventsList!=null)
                {
                    this.eventsList[type] = null;
                }
            }

        }
    );
})();
(function()
{
    ss2d.MessageList = Class
    (
        {
            STATIC:
            {
                _instance:null,
                /**
                 *
                 */
                getInstance : function()
                {
                    ss2d.log(ss2d.MessageList._instance);
                    if(ss2d.MessageList._instance==null)
                    {
                        ss2d.MessageList._instance=new ss2d.MessageList();
                    }
                    return ss2d.MessageList._instance;
                }
            },

            /**
             * 消息列表
             */
            eventMessageList:null,
            initialize : function()
            {
                this.eventMessageList=[];
            },

            /**
             * 删除时间对象
             * @param	e
             */
            removeEventObject:function(e)
            {
                var index = this.eventMessageList.indexOf(e)
                if(index!=-1)
                this.eventMessageList.splice(index,1)
            },

            /**
             * 添加事件对象
             * @param	e
             */
            addEventObject:function(e)
            {
                var index = this.eventMessageList.indexOf(e);
                if (index == -1)
                {
                    this.eventMessageList.push(e);
                }
            }
        }
    );
})();
(function()
{
    ss2d.Event = Class
    (
        {
            STATIC:
            {
                INITIALIZE:"initialtze",
                ADDED:"added",
                REMOVED:"removed",
                ADDED_TO_STAGE:"added_to_stage",
                REMOVED_FROM_STAGE:"removed_from_stage",
                ENTER_FRAME: "enter_frame",
                COMPLETE:"complete"
            },

            //////////////////////////////////////////////////////////////////////////
            //  public property
            //////////////////////////////////////////////////////////////////////////

            type : null,
            target : null,
            currentTarget : null,
            eventPhase : 0,
            bubbles : false,
            cancelable : false,
            timeStamp : 0,
            defaultPrevented : false,
            propagationStopped : false,
            immediatePropagationStopped : false,
            removed : false,

            ////////////////////////////////////////////////////////////////////////////
            //  constructor
            ////////////////////////////////////////////////////////////////////////////

            /**
             *
             */
            initialize : function(type, bubbles, cancelable)
            {
                this.type = type;
                this.bubbles = bubbles;
                this.cancelable = cancelable;
                this.timeStamp = (new Date()).getTime();
            },

            ////////////////////////////////////////////////////////////////////////////
            //  public methods
            ////////////////////////////////////////////////////////////////////////////

            preventDefault : function()
            {
                this.defaultPrevented = true;
            },

            stopPropagation : function()
            {
                this.propagationStopped = true;
            },

            stopImmediatePropagation : function()
            {
                this.immediatePropagationStopped = this.propagationStopped = true;
            },

            remove : function()
            {
                this.removed = true;
            },

            clone : function()
            {
                return new ss2d.Event(this.type, this.bubbles, this.cancelable);
            },

            toString : function()
            {
                return "[events (type=" + this.type + ")]";
            }
        }
    );
})();
(function()
{
    /**
     * EventDispatcher 事件处理器基类
     * @class
     * @param {String} type
     * @param {Boolean} bubbles
     * @param {Boolean} cancelable
     */
    ss2d.EventDispatcher = Class
     (
         /** @lends ss2d.EventDispatcher.prototype */
        {
            STATIC:
            {
                ////////////////////////////////////////////////////////////////////////////
                // public static methods
                ////////////////////////////////////////////////////////////////////////////

                initialize: function(target)
                {
                    var p = ss2d.EventDispatcher.prototype;
                    target.addEventListener = p.addEventListener;
                    target.on = p.on;
                    target.removeEventListener = target.off =  p.removeEventListener;
                    target.removeAllEventListeners = p.removeAllEventListeners;
                    target.hasEventListener = p.hasEventListener;
                    target.dispatchEvent = p.dispatchEvent;
                    target._dispatchEvent = p._dispatchEvent;
                }
            },

            //////////////////////////////////////////////////////////////////////////
            //  private property
            //////////////////////////////////////////////////////////////////////////

            _listeners : null,
            _captureListeners : null,

            ////////////////////////////////////////////////////////////////////////////
            //  constructor
            ////////////////////////////////////////////////////////////////////////////

            initialize : function()
            {

            },

            ////////////////////////////////////////////////////////////////////////////
            //  public methods
            ////////////////////////////////////////////////////////////////////////////

            /**
             * 侦听事件
             * @param type 事件类型
             * @param listener 事件执行函数
             * @param useCapture 事件执行循序
             * @return {*}
             */
            addEventListener : function(type, listener, useCapture)
            {
                var listeners;
                if (useCapture)
                {
                    listeners = this._captureListeners = this._captureListeners||{};
                }
                else
                {
                    listeners = this._listeners = this._listeners||{};
                }
                var arr = listeners[type];
                if (arr) { this.removeEventListener(type, listener, useCapture); }
                arr = listeners[type]; // remove may have deleted the array
                if (!arr) { listeners[type] = [listener];  }
                else { arr.push(listener); }
                return listener;
            },

            /**
             * 删除事件
             * @param type 事件类型
             * @param listener 事件执行函数
             * @param useCapture 事件执行循序
             */
            removeEventListener : function(type, listener, useCapture)
            {
                var listeners = useCapture ? this._captureListeners : this._listeners;
                if (!listeners) { return; }
                var arr = listeners[type];
                if (!arr) { return; }
                for (var i=0,l=arr.length; i<l; i++)
                {
                    //ss2d.log(arr[i],listener,arr[i] == listener);
                    if (arr[i] == listener) {
                        if (l==1) { delete(listeners[type]); } // allows for faster checks.
                        else { arr.splice(i,1); }
                        break;
                    }
                }
            },

            /**
             * 清除所有事件
             * @param type 事件类型
             */
            removeAllEventListeners : function(type)
            {
                if (!type) { this._listeners = this._captureListeners = null; }
                else {
                    if (this._listeners) { delete(this._listeners[type]); }
                    if (this._captureListeners) { delete(this._captureListeners[type]); }
                }
            },

            /**
             * 设置加载事件
             * @param type
             * @param listener
             * @param scope
             * @param once
             * @param data
             * @param useCapture
             * @return {*}
             */
            on : function(type, listener, scope, once, data, useCapture)
            {
                if (listener.handleEvent)
                {
                    scope = scope||listener;
                    listener = listener.handleEvent;
                }
                scope = scope||this;
                return this.addEventListener(type, function(evt)
                {
                    listener.call(scope, evt, data);
                    once&&evt.remove();
                }, useCapture);
            },

            off : this.removeEventListener,

            /**
             * 发送事件
             * @param eventObj 事件消息体
             * @param target 事件目标
             * @return {*}
             */
            dispatchEvent : function(eventObj, target)
            {
                if (typeof eventObj == "string")
                {
                    // won't bubble, so skip everything if there's no listeners:
                    var listeners = this._listeners;
                    if (!listeners || !listeners[eventObj]) { return false; }
                    eventObj = new ss2d.Event(eventObj);
                }
                // TODO: deprecated. Target param is deprecated, only use case is MouseEvent/mousemove, remove.
                eventObj.target = target||this;

                if (!eventObj.bubbles || !this.parent)
                {
                    this._dispatchEvent(eventObj, 2);
                }
                else
                {
                    var top=this, list=[top];
                    while (top.parent) { list.push(top = top.parent); }
                    var i, l=list.length;

                    // capture & atTarget
                    for (i=l-1; i>=0 && !eventObj.propagationStopped; i--)
                    {
                        list[i]._dispatchEvent(eventObj, 1+(i==0));
                    }
                    // bubbling
                    for (i=1; i<l && !eventObj.propagationStopped; i++)
                    {
                        list[i]._dispatchEvent(eventObj, 3);
                    }
                }
                return eventObj.defaultPrevented;
            },

            /**
             * 检测是否存在相应的事件
             * @param type 事件类型
             * @return {Boolean}
             */
            hasEventListener : function(type)
            {
                var listeners = this._listeners, captureListeners = this._captureListeners;
                return !!((listeners && listeners[type]) || (captureListeners && captureListeners[type]));
            },

            toString : function()
            {
                return "[EventDispatcher]";
            },

            ////////////////////////////////////////////////////////////////////////////
            //  private methods
            ////////////////////////////////////////////////////////////////////////////

            _dispatchEvent : function(eventObj, eventPhase)
            {
                var l, listeners = (eventPhase==1) ? this._captureListeners : this._listeners;
                if (eventObj && listeners)
                {
                    var arr = listeners[eventObj.type];
                    if (!arr||!(l=arr.length)) { return; }
                    eventObj.currentTarget = this;
                    eventObj.eventPhase = eventPhase;
                    eventObj.removed = false;
                    arr = arr.slice(); // to avoid issues with items being removed or added during the dispatch
                    for (var i=0; i<l && !eventObj.immediatePropagationStopped; i++)
                    {
                        var o = arr[i];
                        if (o.handleEvent) { o.handleEvent(eventObj); }
                        else { o(eventObj); }
                        if (eventObj.removed)
                        {
                            this.off(eventObj.type, o, eventPhase==1);
                            eventObj.removed = false;
                        }
                    }
                }
            }
        }
     );
})();
(function()
{
    /**
     * MouseEvent 鼠标事件侦听事件类
     * @class
     * @param {String} type
     * @param {Boolean} bubbles
     * @param {Boolean} cancelable
     */
    ss2d.MouseEvent = Class
    (
        /** @lends ss2d.MouseEvent.prototype */
        {
            Extends: ss2d.Event,

            STATIC:
            {
                /** @lends ss2d.MouseEvent */

                /**
                 * 鼠标按下事件
                 */
                MOUSE_DOWN:"mouse_down",

                /**
                 * 鼠标松开事件
                 */
                MOUSE_UP:"mouse_up",

                /**
                 * 鼠标移动事件
                 */
                MOUSE_MOVE:"mouse_move"
            },

            //////////////////////////////////////////////////////////////////////////
            //  public property
            //////////////////////////////////////////////////////////////////////////

            /**
             * 当前鼠标在舞台上的X坐标
             */
            stageX : 0,

            /**
             * 当前鼠标在舞台上的Y坐标
             */
            stageY : 0,

            ////////////////////////////////////////////////////////////////////////////
            //  constructor
            ////////////////////////////////////////////////////////////////////////////

            initialize : function(type, bubbles, cancelable, stageX, stageY)
            {
                ss2d.MouseEvent.Super.call(this, type, bubbles, cancelable);
                this.stageX = stageX;
                this.stageY = stageY;
            },

            ////////////////////////////////////////////////////////////////////////////
            //  public methods
            ////////////////////////////////////////////////////////////////////////////

            clone : function()
            {
                return new MouseEvent(this.type, this.bubbles, this.cancelable, this.stageX, this.stageY);
            },

            toString : function()
            {
                return "[MouseEvent (type="+this.type+" stageX=" + this.stageX + " stageY=" + this.stageY + ")]";
            }
        }
    );
})();
(function()
 {
    /**
     * 每当 Timer 对象达到由 Timer.delay 属性指定的间隔时，Timer 对象即会调度 TimerEvent 对象。
     * @class
     * @param {String} type
     * @param {Boolean} bubbles
     * @param {Boolean} cancelable
     */
    ss2d.TimerEvent = Class
    (
        /** @lends ss2d.TimerEvent.prototype */
        {
            Extends: ss2d.Event,

            STATIC:
            /** @lends ss2d.TimerEvent */
            {
                /**
                 * 计时器侦听事件
                 */
                TIMER : 'TimerEvent.TIMER',

                /**
                 * 计时器结束事件
                 */
                TIMER_COMPLETE : 'TimerEvent.TIMER_COMPLETE'
            },
            
            ////////////////////////////////////////////////////////////////////////////
            //  constructor
            ////////////////////////////////////////////////////////////////////////////

            initialize : function(type, bubbles, cancelable)
            {
                ss2d.TimerEvent.Super.call(this, type, bubbles, cancelable);
            }
        }
    );
 })();
(function()
{
    ss2d.ClassUtil = Class
    (
        {
            STATIC:
            {
                construct : function(cls, properties, parameters)
                {
                    if (!cls) return null;
                    var instance;
                    if (parameters)
                    {
                        switch( parameters.length )
                        {
                            case 0:
                                instance = new cls( );
                                break;
                            case 1:
                                instance = new cls( parameters[0] );
                                break;
                            case 2:
                                instance = new cls( parameters[0], parameters[1] );
                                break;
                            case 3:
                                instance = new cls( parameters[0], parameters[1], parameters[2] );
                                break;
                            case 4:
                                instance = new cls( parameters[0], parameters[1], parameters[2], parameters[3] );
                                break;
                            case 5:
                                instance = new cls( parameters[0], parameters[1], parameters[2], parameters[3], parameters[4] );
                                break;
                            case 6:
                                instance = new cls( parameters[0], parameters[1], parameters[2], parameters[3], parameters[4], parameters[5] );
                                break;
                            case 7:
                                instance = new cls( parameters[0], parameters[1], parameters[2], parameters[3], parameters[4], parameters[5], parameters[6] );
                                break;
                            case 8:
                                instance = new cls( parameters[0], parameters[1], parameters[2], parameters[3], parameters[4], parameters[5], parameters[6], parameters[7] );
                                break;
                            case 9:
                                instance = new cls( parameters[0], parameters[1], parameters[2], parameters[3], parameters[4], parameters[5], parameters[6], parameters[7], parameters[8] );
                                break;
                            case 10:
                                instance = new cls( parameters[0], parameters[1], parameters[2], parameters[3], parameters[4], parameters[5], parameters[6], parameters[7], parameters[8], parameters[9] );
                                break;
                            default:
                                return null;
                        }
                    }
                    else instance = new cls( );
                    if (properties)
                    {
                        for (var key in properties)
                        {
                            if (instance.hasOwnProperty(key)) instance[key] = properties[key];
                        }
                    }
                    return instance;
                }
            }
        }
    );
})();
(function()
{
    ss2d.ColorUtil = Class
    (
        {
            STATIC:
            {
                hexToRGB : function(hex)
                {
                    return {
                        r: hex >> 16 & 0xFF,
                        g: hex >> 8 & 0xFF,
                        b: hex & 0xFF
                    };
                },

                RGBToHex : function(rgb)
                {
                    return rgb.r<<16 | rgb.g<<8 | rgb.b;
                }
            }
        }
    );
})();
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
(function()
{
    ss2d.StringUtil = Class
    (
        {
            STATIC:
            {
                padding : function(str, cols, replaceStr, lpad)
                {
                    replaceStr = replaceStr === undefined ? " " : replaceStr;
                    str = String(str);
                    if (str.length > cols)  return str.substr(0, cols);
                    while (str.length < cols)
                    {
                        str = lpad ? replaceStr + str : str + replaceStr;
                    }
                    return str;
                },

                toBoolean : function(value)
                {
                    return value == "true" || value == "1" || value == "yes";
                },

                trim : function(value)
                {
                    var ltrim, rtrim;
                    ltrim = /^(\s|\n|\r|\t|\v|\f)*/m;
                    rtrim = /(\s|\n|\r|\t|\v\|f)*$/;
                    return value.replace(ltrim, "").replace(rtrim, "");
                },

                toNative : function(vaule)
                {
                    var str = value.toLowerCase();
                    var reslut;
                    if (str == "true" || str == "false")
                    {
                        reslut = ss2d.StringUtil.toBoolean(str);
                    }
                    else if (str == "null" || str == "nan" || str == "undefined" || str == "infinity")
                    {
                        reslut = null; // Value is unnassigned.
                    }
                    else if (!isNaN(Number(str)))
                    {
                        reslut = ss2d.StringUtil.toNumber(str);
                    }
                    else
                    {
                        reslut = str;
                    }
                    return reslut;
                },

                toNumber : function(value)
                {
                    return (ss2d.StringUtil.trim(value) == "" || value == null) ? 0 : Number(value);
                }
            }
        }
    )
})();
(function()
{
    /**
     * 计时器类 用于设置间隔执行的函数或者事件。
     * @type {Class}
     */
    ss2d.Timer = Class
    (
        /** @lends ss2d.Timer.prototype */
        {
            Extends: ss2d.EventDispatcher,
            
            //////////////////////////////////////////////////////////////////////////
            //  private property
            //////////////////////////////////////////////////////////////////////////

            m_delay: 0,
            m_repeatCount: 0,
            m_interval: null,
            m_running: false,
            m_currentCount: 0,

            ////////////////////////////////////////////////////////////////////////////
            //  constructor
            ////////////////////////////////////////////////////////////////////////////

            initialize: function (delay, repeatCount)
            {
                this.m_delay = delay;
		        this.m_repeatCount = repeatCount || 0;
                this.m_interval = null;
                this.m_running = false;
                this.m_currentCount = 0;
            },
            
            ////////////////////////////////////////////////////////////////////////////
            //  Additional getters and setters
            ////////////////////////////////////////////////////////////////////////////

            getRepeatCount : function()
            {
                return this.m_repeatCount;
            },
            
            getCurrentCount : function()
            {
                return this.m_currentCount;
            },
            
            getRunning : function()
            {
                return this.m_running;
            },

            ////////////////////////////////////////////////////////////////////////////
            //  public methods
            ////////////////////////////////////////////////////////////////////////////

            /**
             * 如果计时器正在运行，则停止计时器，并将 currentCount 属性设回为 0，这类似于秒表的重置按钮。
             * 然后，在调用 start() 后，将运行计时器实例，运行次数为指定的重复次数（由 repeatCount 值设置）。
             */
            reset: function()
            {
                this.stop(true);
            },
            
            /**
             * 如果计时器尚未运行，则启动计时器。
             */
            start: function()
            {
                if(this.m_running)
                {
                    return;
                }
                this.m_running = true;

                var self = this;
                this.m_interval = setInterval(function(){ self._iterate() }, this.m_delay);
            },
            
            /**
             * 停止计时器。如果在调用 stop() 后调用 start()，
             * 则将继续运行计时器实例，运行次数为剩余的 重复次数（由 repeatCount 属性设置）。
             * @param {boolean} clearCount 是否清除计时器
             */
            stop: function(clearCount)
            {
                this.m_running = false;

                if(clearCount)
                {
                    this.m_currentCount = 0;
                }
                if(this.m_interval)
                {
                    clearInterval(this.m_interval);
                }
            },
            
            /**
             * 迭代
             */
            _iterate: function()
            {
                this.m_currentCount++;
                if(!this.m_repeatCount || this.m_currentCount <= this.m_repeatCount)
                {
                    this.dispatchEvent(ss2d.TimerEvent.TIMER);
                    if(this.m_currentCount == this.m_repeatCount)
                    {
                        this.dispatchEvent(ss2d.TimerEvent.TIMER_COMPLETE);
                    }
                }
                else
                {
                    this.stop(false);
                }
            }
        }
    );
})();
(function()
{
    ss2d.WebGLUtil = Class
    (
        {
            STATIC:
            {
                GET_A_WEBGL_BROWSER : '' +
                    'This page requires a browser that supports WebGL.<br/>' +
                    '<a href="http://get.webgl.org">Click here to upgrade your browser.</a>',

                OTHER_PROBLEM : '' +
                    "It doesn't appear your computer can support WebGL.<br/>" +
                    '<a href="http://get.webgl.org/troubleshooting/">Click here for more information.</a>',

                makeFailHTML : function(msg)
                {
                    return '' +
                        '<table style="background-color: #8CE; width: 100%; height: 100%;"><tr>' +
                        '<td align="center">' +
                        '<div style="display: table-cell; vertical-align: middle;">' +
                        '<div style="">' + msg + '</div>' +
                        '</div>' +
                        '</td></tr></table>';
                },

                setupWebGL : function(canvas, opt_attribs)
                {
                    function showLink(str)
                    {
                        var container = canvas.parentNode;
                        if (container)
                        {
                            container.innerHTML = ss2d.WebGLUtil.makeFailHTML(str);
                        }
                    };

                    if (!window.WebGLRenderingContext)
                    {
                        showLink(ss2d.WebGLUtil.GET_A_WEBGL_BROWSER);
                        return null;
                    }

                    var context = ss2d.WebGLUtil.create3DContext(canvas, opt_attribs);
                    if (!context)
                    {
                        showLink(ss2d.WebGLUtil.OTHER_PROBLEM);
                    }
                    return context;
                },

                create3DContext : function(canvas, opt_attribs)
                {
                    var names;
                    var context = null;
                    names = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
                    for (var ii = 0; ii < names.length; ++ii)
                    {
                        try {
                            context = canvas.getContext(names[ii], opt_attribs);
                        } catch(e) {}
                        if (context)
                        {
                            break;
                        }
                    }
                    return context;
                }
            }
        }
    );
})();
(function()
{
    ss2d.Capabilities = Class
    (
        {
            STATIC:
            {
                pixelRatio : window.devicePixelRatio || 1,
                viewport :
                {
                    width:window.innerWidth,
                    height:window.innerHeight
                },
                screen :
                {
                    width:window.screen.availWidth * this.pixelRatio,
                    height:window.screen.availHeight * this.pixelRatio
                },
                iPhone : /iPhone/i.test(navigator.userAgent),
                iPhone4 : (this.iPhone && this.pixelRatio == 2),
                iPad : /iPad/i.test(navigator.userAgent),
                android : /android/i.test(navigator.userAgent),
                iOS : this.iPhone || this.iPad,
                mobile : this.iOS || this.android
            }
        }
    );
})();
(function()
{
    /**
     * 可使用 ColorTransform 类调整显示对象的颜色值。可以将颜色调整或颜色转换应用于所有四种通道：红色、绿色、蓝色和 Alpha 透明度。
     * @param redMultiplier 与红色通道值相乘的十进制值。
     * @param greenMultiplier 与绿色通道值相乘的十进制值。
     * @param blueMultiplier 与蓝色通道值相乘的十进制值。
     * @param alphaMultiplier 与 Alpha 透明度通道值相乘的十进制值。
     * @param redOffset -255 到 255 之间的数字，加到红色通道值和 redMultiplier 值的乘积上。
     * @param greenOffset -255 到 255 之间的数字，加到绿色通道值和 greenMultiplier 值的乘积上。
     * @param blueOffset -255 到 255 之间的数字，加到蓝色通道值和 blueMultiplier 值的乘积上。
     * @param alphaOffset -255 到 255 之间的数字，加到 Alpha 透明度通道值和 alphaMultiplier 值的乘积上。
     * @class
     */
    ss2d.ColorTransform = Class
    (
        /** @lends ss2d.ColorTransform.prototype */
        {
            //////////////////////////////////////////////////////////////////////////
            //  public property
            //////////////////////////////////////////////////////////////////////////

            /**
             * 与红色通道值相乘的十进制值。
             * @type {number}
             */
            redMultiplier : 1,

            /**
             * 与绿色通道值相乘的十进制值。
             * @type {number}
             */
            greenMultiplier : 1,

            /**
             * 与蓝色通道值相乘的十进制值。
             * @type {number}
             */
            blueMultiplier : 1,

            /**
             * 与 Alpha 透明度通道值相乘的十进制值。
             * @type {number}
             */
            alphaMultiplier : 1,

            /**
             * -255 到 255 之间的数字，加到红色通道值和 redMultiplier 值的乘积上。
             * @type {number}
             */
            redOffset : 0,

            /**
             * -255 到 255 之间的数字，加到绿色通道值和 greenMultiplier 值的乘积上。
             * @type {number}
             */
            greenOffset : 0,

            /**
             * -255 到 255 之间的数字，加到蓝色通道值和 blueMultiplier 值的乘积上。
             * @type {number}
             */
            blueOffset : 0,

            /**
             * -255 到 255 之间的数字，加到 Alpha 透明度通道值和 alphaMultiplier 值的乘积上。
             * @type {number}
             */
            alphaOffset : 0,

            ////////////////////////////////////////////////////////////////////////////
            //  constructor
            ////////////////////////////////////////////////////////////////////////////

            /**
             * 初始化
             * @private
             */
            initialize : function(redMultiplier, greenMultiplier, blueMultiplier,
                            alphaMultiplier, redOffset, greenOffset, blueOffset, alphaOffset)
            {
                this.redMultiplier = redMultiplier == undefined ? 1 : redMultiplier;
                this.greenMultiplier = greenMultiplier == undefined ? 1 : greenMultiplier;
                this.blueMultiplier = blueMultiplier == undefined ? 1 : blueMultiplier;
                this.alphaMultiplier = alphaMultiplier == undefined ? 1 : alphaMultiplier;
                this.redOffset = redOffset || 0;
                this.greenOffset = greenOffset || 0;
                this.blueOffset = blueOffset || 0;
                this.alphaOffset = alphaOffset || 0;
            }
        }
    );
})();
(function()
{
    /**
     * FrameFunction 帧函数类
     * @class
     */
    ss2d.FrameFunction = Class
    (
        /** @lends ss2d.FrameFunction.prototype */
        {
            /**
             * 该函数所在帧的索引号
             */
            frame:0,

            /**
             * 回调函数
             */
            callback:null,

            /**
             * 初始化
             * @private
             */
            initialize : function(v_frame, v_callBackFun)
            {

                if(v_frame)
                this.frame = v_frame;

                if(v_callBackFun)
                this.callback = v_callBackFun;

            }
        }
    );
})();
(function()
{
    /**
     * Matrix2D 2D矩阵类
     * @class
     */
    ss2d.Matrix2D = Class
    (
        /** @lends ss2d.Matrix2D.prototype */
        {
            //////////////////////////////////////////////////////////////////////////
            //  public property
            //////////////////////////////////////////////////////////////////////////

            /**
             * 矩阵的原始信息
             * @type {Array}
             */
            rawData :null,


            spinArray :null,
            translationArray :null,
            matrix3x3:null,
            PI:Math.PI / 180,

            ////////////////////////////////////////////////////////////////////////////
            //  constructor
            ////////////////////////////////////////////////////////////////////////////

            ////////////////////////////////////////////////////////////////////////////
            //  public methods
            ////////////////////////////////////////////////////////////////////////////

            /**
             * 初始化
             * @private
             */
            initialize : function()
            {
                this.identity();
            },

            /**
             * 重置矩阵
             */
            identity : function()
            {
                //优化
                this.rawData = new Float32Array(8);
                this.spinArray = new Float32Array(8);
                this.translationArray = new Float32Array(8);
                this.matrix3x3=new Float32Array(8);
            },

            /**
             * 3*3优化矩阵融合
             * @param v1
             * @param v2
             * @returns {Array}
             */
            add3x32 : function(v,v1, v2)
            {
                //特殊优化
                v[0] = v1[0] * v2[0] + v1[1] * v2[3];
                v[1] = v1[0] * v2[1] + v1[1] * v2[4];
                v[3] = v1[3] * v2[0] + v1[4] * v2[3];
                v[4] = v1[3] * v2[1] + v1[4] * v2[4];
                v[6] = v1[6] * v2[0] + v1[7] * v2[3] +v2[6];
                v[7] = v1[6] * v2[1] + v1[7] * v2[4] +v2[7];
            },

            /**
             * 3*3矩阵融合
             * @param v1
             * @param v2
             * @returns {Array}
             */
            add3x3 : function(v1, v2)
            {
                //特殊优化
                this.matrix3x3=new Float32Array(8);
                this.matrix3x3[0] = v1[0] * v2[0] + v1[1] * v2[3];
                this.matrix3x3[1] = v1[0] * v2[1] + v1[1] * v2[4];
                this.matrix3x3[3] = v1[3] * v2[0] + v1[4] * v2[3];
                this.matrix3x3[4] = v1[3] * v2[1] + v1[4] * v2[4];
                this.matrix3x3[6] = v1[6] * v2[0] + v1[7] * v2[3] +v2[6];
                this.matrix3x3[7] = v1[6] * v2[1] + v1[7] * v2[4] +v2[7];
                return this.matrix3x3;
            },

            /**
             * 1*3优化矩阵融合
             * @param v1
             * @param v2
             * @returns {Array}
             */
            add1x32 : function(v,v1, v2)
            {
                //特殊优化
                v[0] = v1[0] * v2[0] + v1[1] * v2[3] +v2[6];
                v[1] = v1[0] * v2[1] + v1[1] * v2[4] +v2[7];
            },

            /**
             * 1*3矩阵融合
             * @param v1
             * @param v2
             * @returns {Array}
             */
            add1x3 : function(v1, v2)
            {
                //特殊优化
                var matrix1x3 = new Float32Array(3);
                matrix1x3[0] = v1[0] * v2[0] + v1[1] * v2[3] +v2[6];
                matrix1x3[1] = v1[0] * v2[1] + v1[1] * v2[4] +v2[7];
                return matrix1x3;
            },

            /**
             *平移,旋转
             * @param rotation
             * @param x
             * @param y
             */
            appendRotation : function(rotation,x, y)
            {
                //特殊优化
                var cos = Math.cos(rotation * this.PI);
                var sin = Math.sin(rotation * this.PI);
                //旋转
                this.spinArray[0] = cos;
                this.spinArray[1] = sin;
                this.spinArray[2] = 0;
                this.spinArray[3] = -sin;
                this.spinArray[4] = cos;
                this.spinArray[5] = 0;
                this.spinArray[6] = x;
                this.spinArray[7] = y;
                this.spinArray[8] = 1;
            },

            /**
             * 缩放,倾斜
             * @param scaleX
             * @param scaleY
             * @param biasX
             * @param biasY
             */
            appendTranslation : function(scaleX, scaleY, skewX, skewY)
            {
                //特殊优化
                this.translationArray[0] = scaleX;
                this.translationArray[1] = skewY;
                this.translationArray[2] = 0;
                this.translationArray[3] = skewX;
                this.translationArray[4] = scaleY;
                this.translationArray[5] = 0;
                this.translationArray[6] = 0;
                this.translationArray[7] = 0;
                this.translationArray[8] = 1;
            },

            /**
             * 更新矩阵信息
             * @param rotation
             * @param x
             * @param y
             * @param scaleX
             * @param scaleY
             * @param biasX
             * @param biasY
             */
            upDateMatrix : function(rotation, x, y, scaleX, scaleY, skewX, skewY)
            {
                var angle=rotation * this.PI;
                var cos = Math.cos(angle);
                var sin = Math.sin(angle);
                this.rawData[0] = scaleX * cos + skewY * -sin;
                this.rawData[1] = scaleX * sin + skewY * cos;
                this.rawData[3] = skewX * cos + scaleY * -sin;
                this.rawData[4] = skewX * sin + scaleY * cos;
                this.rawData[6] = x;
                this.rawData[7] = y;
                //this.rawData=this.add3x3(this.translationArray,this.spinArray);
            }
        }
    );
})();
(function()
{
    /**
     * Matrix3D 3D矩阵类
     */
    ss2d.Matrix3D = Class
    (
        {
            /**
             * 矩阵的原始信息
             */
            rawData : [],

            spinArray : [],
            translationArray : [],
            matrix4x4:[],
            PI:Math.PI / 180,

            /**
             * 重置矩阵
             */
            identity : function()
            {
                //优化
                this.rawData = new Float32Array(16);
                this.spinArray = new Float32Array(16);
                this.translationArray = new Float32Array(16);
                this.matrix4x4=new Float32Array(16);
            },

            /**
             * 4*4矩阵融合
             * @param v1
             * @param v2
             * @returns {Array}
             */
            add4x4 : function(a1, a2)
            {
                //特殊优化
                var matrix4x4=new Float32Array(16);

                matrix4x4[0]=a1[0]*a2[0]+a1[1]*a2[4]+a1[2]*a2[8]+a1[3]*a2[12];
                matrix4x4[1]=a1[0]*a2[1]+a1[1]*a2[5]+a1[2]*a2[9]+a1[3]*a2[13];
                matrix4x4[2]=a1[0]*a2[2]+a1[1]*a2[6]+a1[2]*a2[10]+a1[3]*a2[14];
                matrix4x4[3]=a1[0]*a2[3]+a1[1]*a2[7]+a1[2]*a2[11]+a1[3]*a2[15];

                matrix4x4[4]=a1[4]*a2[0]+a1[5]*a2[4]+a1[6]*a2[8]+a1[7]*a2[12];
                matrix4x4[5]=a1[4]*a2[1]+a1[5]*a2[5]+a1[6]*a2[9]+a1[7]*a2[13];
                matrix4x4[6]=a1[4]*a2[2]+a1[5]*a2[6]+a1[6]*a2[10]+a1[7]*a2[14];
                matrix4x4[7]=a1[4]*a2[3]+a1[5]*a2[7]+a1[6]*a2[11]+a1[7]*a2[15];

                matrix4x4[8]=a1[8]*a2[0]+a1[9]*a2[4]+a1[10]*a2[8]+a1[11]*a2[12];
                matrix4x4[9]=a1[8]*a2[1]+a1[9]*a2[5]+a1[10]*a2[9]+a1[11]*a2[13];
                matrix4x4[10]=a1[8]*a2[2]+a1[9]*a2[6]+a1[10]*a2[10]+a1[11]*a2[14];
                matrix4x4[11]=a1[8]*a2[3]+a1[9]*a2[7]+a1[10]*a2[11]+a1[11]*a2[15];

                matrix4x4[12]=a1[12]*a2[0]+a1[13]*a2[4]+a1[14]*a2[8]+a1[15]*a2[12];
                matrix4x4[13]=a1[12]*a2[1]+a1[13]*a2[5]+a1[14]*a2[9]+a1[15]*a2[13];
                matrix4x4[14]=a1[12]*a2[2]+a1[13]*a2[6]+a1[14]*a2[10]+a1[15]*a2[14];
                matrix4x4[15]=a1[12]*a2[3]+a1[13]*a2[7]+a1[14]*a2[11]+a1[15]*a2[15];

                return matrix4x4;
            },



            /**
             * 1*4矩阵融合
             * @param v1
             * @param v2
             * @returns {Array}
             */
            add1x4 : function(v1, v2)
            {
                //特殊优化
                var matrix1x4 = new Float32Array(4);
                matrix1x4[0] = v1[0] * v2[0] + v1[1] * v2[5]+v1[2] * v2[9]+v1[3] * v2[13];
                matrix1x4[1] = v1[0] * v2[1] + v1[1] * v2[6]+v1[2] * v2[10]+v1[3] * v2[14]
                matrix1x4[2] = v1[0] * v2[3] + v1[1] * v2[7]+v1[2] * v2[11]+v1[3] * v2[15];
                matrix1x4[4] = v1[0] * v2[4] + v1[1] * v2[8]+v1[2] * v2[12]+v1[3] * v2[16];
                return matrix1x4;
            },


            /**
             * 旋转矩阵
             * @param rotation 旋转角度
             * @param x X轴移动量
             * @param y Y轴移动量
             */
            appendRotation : function(rotation,x,y)
            {
                //特殊优化
                var cos = Math.cos(rotation * this.PI);
                var sin = Math.sin(rotation * this.PI);

                this.spinArray[0] = cos;
                this.spinArray[1] = sin;
                this.spinArray[2] = 0;
                this.spinArray[3] = 0;
                this.spinArray[4] = -sin;
                this.spinArray[5] = cos;
                this.spinArray[6] = 0;
                this.spinArray[7] = 0;
                this.spinArray[8] = x;
                this.spinArray[9] = y;
                this.spinArray[10] = 1;
                this.spinArray[11] = 0;
                this.spinArray[12] = 0;
                this.spinArray[13] = 0;
                this.spinArray[14] = 0;
                this.spinArray[15] = 1;

            },

            /**
             * 缩放与倾斜
             * @param scaleX X轴缩放值
             * @param scaleY Y轴缩放值
             * @param biasX X轴倾斜值
             * @param biasY Y轴倾斜值
             */
            appendTranslation : function(scaleX, scaleY, skewX, skewY)
            {

                //特殊优化
                this.translationArray[0] = scaleX;
                this.translationArray[1] = skewY;
                this.translationArray[2] = 0;
                this.translationArray[3] = 0;
                this.translationArray[4] = skewX;
                this.translationArray[5] = scaleY;
                this.translationArray[6] = 0;
                this.translationArray[7] = 0;
                this.translationArray[8] = 0;
                this.translationArray[9] = 0;
                this.translationArray[10] = 1;
                this.translationArray[11] = 0;
                this.translationArray[12] = 0;
                this.translationArray[13] = 0;
                this.translationArray[14] = 0;
                this.translationArray[15] = 1;

            },

            /**
             * 更新矩阵信息
             * @param rotation 旋转角度
             * @param x X轴移动值
             * @param y Y轴移动值
             * @param scaleX X轴缩放值
             * @param scaleY Y轴缩放值
             * @param biasX X轴倾斜值
             * @param biasY Y轴倾斜值
             */
            upDateMatrix : function(rotation, x, y, scaleX, scaleY, skewX, skewY)
            {
                //计算旋转后的矩阵
                this.appendRotation(rotation,x, y);
                //计算位移等其他变换后的矩阵
                this.appendTranslation(scaleX, scaleY, skewX, skewY);
                //融合这2个变换矩阵
                this.rawData=this.add4x4(this.spinArray, this.translationArray);
            }
        }
    );
})();
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
(function()
{
    /**
     * quad的工具类，主要用来计算quad内部矩阵的计算
     */
    ss2d.QuadMatrixUtil = Class
    (
        {
            //////////////////////////////////////////////////////////////////////////
            //  private property
            //////////////////////////////////////////////////////////////////////////

            /**
             *
             * @type {ss2d.Matrix2D}
             * @private
             */
            matrix2D : null,

            /**
             *
             * @type {number}
             * @private
             */
            m_x : 0,

            /**
             *
             * @type {number}
             * @private
             */
            m_y : 0,

            /**
             *
             * @type {number}
             * @private
             */
            m_rotation : 0,

            /**
             *
             * @type {number}
             * @private
             */
            m_scaleX : 1,

            /**
             *
             * @type {number}
             * @private
             */
            m_scaleY : 1,

            /**
             *
             * @type {number}
             * @private
             */
            m_skewX : 0,

            /**
             *
             * @type {number}
             * @private
             */
            m_skewY : 0,

            /**
             *
             * @type {number}
             * @private
             */
            m_pivotX : 0,

            /**
             *
             * @type {number}
             * @private
             */
            m_pivotY : 0,

            //////////////////////////////////////////////////////////////////////////
            //  public property
            //////////////////////////////////////////////////////////////////////////

            /**
             * 记录当前面板中有多少个点对象
             * @type {number}
             */
            ids : 0,




            /**
             * 元素列表
             * @type {Array}
             */
            itemList : null,


            /**
             * 元素信息列表
             * @type {Array}
             */
            itemDataList : null,

            /**
             * 原始元素信息列表
             * @type {Array}
             */
            itemDataAgencyList : null,

            ////////////////////////////////////////////////////////////////////////////
            //  constructor
            ////////////////////////////////////////////////////////////////////////////

            initialize : function()
            {
                this.matrix2D = new ss2d.Matrix2D();
                this.itemList = [];
                this.itemDataList = [];
                this.itemDataAgencyList = [];

                /*if (Object.defineProperty)
                {
                    Object.defineProperty(this, "x",
                        {
                            get: this._get_x,
                            set: this._set_x
                        });

                    Object.defineProperty(this, "y",
                        {
                            get: this._get_y,
                            set: this._set_y
                        });
                    Object.defineProperty(this, "scaleX",
                        {
                            get: this._get_scaleX,
                            set: this._set_scaleX
                        });

                    Object.defineProperty(this, "scaleY",
                        {
                            get: this._get_scaleY,
                            set: this._set_scaleY
                        });

                    Object.defineProperty(this, "skewX",
                        {
                            get: this._get_skewX,
                            set: this._set_skewX
                        });

                    Object.defineProperty(this, "skewY",
                        {
                            get: this._get_skewY,
                            set: this._set_skewY
                        });

                    Object.defineProperty(this, "pivotX",
                        {
                            get: this._get_pivotX,
                            set: this._set_pivotX
                        });

                    Object.defineProperty(this, "pivotY",
                        {
                            get: this._get_pivotY,
                            set: this._set_pivotY
                        });

                    Object.defineProperty(this, "rotation",
                        {
                            get: this._get_rotation,
                            set: this._set_rotation
                        });

                    Object.defineProperty(this, "matrix2D",
                        {
                            get: this._get_matrix2D,
                            set: this._set_matrix2D
                        });
                }
                else if (this.__defineGetter__)
                {
                    this.__defineGetter__("x", this._get_x);
                    this.__defineSetter__("x", this._set_x);

                    this.__defineGetter__("y", this._get_y);
                    this.__defineSetter__("y", this._set_y);

                    this.__defineGetter__("scaleX", this._get_scaleX);
                    this.__defineSetter__("scaleX", this._set_scaleX);

                    this.__defineGetter__("scaleY", this._get_scaleY);
                    this.__defineSetter__("scaleY", this._set_scaleY);

                    this.__defineGetter__("skewX", this._get_skewX);
                    this.__defineSetter__("skewX", this._set_skewX);

                    this.__defineGetter__("skewY", this._get_skewY);
                    this.__defineSetter__("skewY", this._set_skewY);

                    this.__defineGetter__("pivotX", this._get_pivotX);
                    this.__defineSetter__("pivotX", this._set_pivotX);

                    this.__defineGetter__("pivotY", this._get_pivotY);
                    this.__defineSetter__("pivotY", this._set_pivotY);

                    this.__defineGetter__("rotation", this._get_rotation);
                    this.__defineSetter__("rotation", this._set_rotation);

                    this.__defineGetter__("matrix2D", this._get_matrix2D);
                    this.__defineSetter__("matrix2D", this._set_matrix2D);
                }*/
            },

            /**
             * 设置点数据
             * @param index 点所在的索引位置
             * @param value 点的新值
             */
            setPoint : function(index, value)
            {
                this.itemDataList[index] = value;
            },

            /**
             * 获得点数据
             * @param index 点所在的索引位置
             * @returns {*}
             */
            getPoint : function(index)
            {
                return this.itemDataList[index];
            },

            /**
             * 更新顶点缓存信息
             * @param pot
             */
            upDateFrame : function(pot)
            {
                this.itemDataList[this.ids] = new ss2d.Point(0, 0);
                this.itemDataList[this.ids].x = pot.x;
                this.itemDataList[this.ids].y = pot.y;

                this.itemDataAgencyList[this.ids] = new ss2d.Point(0, 0);
                this.itemDataAgencyList[this.ids].x = pot.x;
                this.itemDataAgencyList[this.ids].y = pot.y;
            },

            /**
             * 更新矩阵操作
             */
            upDateRaw : function()
            {
                for (var i = 0; i < this.ids; i++)
                {
                    //零时缓存顶点的信息,实际上这一步在后期的优化中可以省略掉，毕竟每次做这样的操作还是很消耗的

                    //存储1*3的矩阵计算后结果,也就是实际计算出来的屏幕坐标
                    //this.matrix2D.add1x32(this._matrix2,this._cacheList, this.matrix2D.rawData);
                    //改变缓存里的顶点的坐标信息

                    this.itemList[i].x = this.itemDataAgencyList[i].x * this.matrix2D.rawData[0] + this.itemDataAgencyList[i].y * this.matrix2D.rawData[3] +this.matrix2D.rawData[6];
                    this.itemList[i].y = this.itemDataAgencyList[i].x * this.matrix2D.rawData[1] + this.itemDataAgencyList[i].y * this.matrix2D.rawData[4] +this.matrix2D.rawData[7];
                }
            },

            /**
             * 更新矩阵操作
             */
            upDateMatrix : function(flag)
            {
                //根据输入的信息更新矩阵
                var angle=this.m_rotation * this.matrix2D.PI;
                var cos = Math.cos(angle);
                var sin = Math.sin(angle);
                this.matrix2D.rawData[0] = this.m_scaleX * cos + this.m_skewY * -sin;
                this.matrix2D.rawData[1] = this.m_scaleX * sin + this.m_skewY * cos;
                this.matrix2D.rawData[3] = this.m_skewX * cos + this.m_scaleY * -sin;
                this.matrix2D.rawData[4] = this.m_skewX * sin + this.m_scaleY * cos;
                this.matrix2D.rawData[6] = this.m_x + this.m_pivotX;
                this.matrix2D.rawData[7] = this.m_y + this.m_pivotY;

                /*this.matrix2D.upDateMatrix(this.m_rotation, this.m_x + this.m_pivotX, this.m_y + this.m_pivotY,
                    this.m_scaleX,this.m_scaleY, this.m_skewX, this.m_skewY);*/

                if (flag)
                {
                    for (var i = 0; i < this.ids; i++)
                    {
                        //零时缓存顶点的信息,实际上这一步在后期的优化中可以省略掉，毕竟每次做这样的操作还是很消耗的
                        //存储1*3的矩阵计算后结果,也就是实际计算出来的屏幕坐标
                        //this.matrix2D.add1x32(this._matrix2,this._cacheList, this.matrix2D.rawData);
                        //改变缓存里的顶点的坐标信息
                        this.itemList[i].x = this.itemDataAgencyList[i].x * this.matrix2D.rawData[0] + this.itemDataAgencyList[i].y * this.matrix2D.rawData[3] +this.matrix2D.rawData[6];
                        this.itemList[i].y = this.itemDataAgencyList[i].x * this.matrix2D.rawData[1] + this.itemDataAgencyList[i].y * this.matrix2D.rawData[4] +this.matrix2D.rawData[7];
                    }
                }
            },

            /**
             * 更新顶点的原始顶点坐标
             * @param pivotX
             * @param pivotY
             * @param scaleX
             * @param scaleY
             * @param skewX
             * @param skewY
             */
            upDateMatrixData : function(pivotX, pivotY, scaleX, scaleY, skewX, skewY)
            {
                //this.matrix2D.upDateMatrix(0, pivotX, pivotY, scaleX, scaleY, skewX, skewY);
                for (var i = 0; i <this.ids; i++)
                {
                    //this.matrix2D.add1x32(this._matrix,this._cacheList, this.matrix2D.rawData);
                    this.itemDataAgencyList[i].x =this.itemDataList[i].x * scaleX + this.itemDataList[i].y * skewX +pivotX;
                    this.itemDataAgencyList[i].y = this.itemDataList[i].x * skewY + this.itemDataList[i].y * scaleY +pivotY;
                }
            },

            /**
             * 添加元素
             */
            addItem : function(pot)
            {
                this.itemList[this.ids] = pot;
                this.upDateFrame(pot);
                this.ids++;
            },

            /**
             * 清理矩阵面板
             */
            clear : function()
            {
                this.ids = 0;
                this.m_x = 0;
                this.m_y = 0;
                this.m_rotation = 0;
                this.m_scaleX = 1;
                this.m_scaleY = 1;
                this.m_skewX = 0;
                this.m_skewY = 0;
                this.m_pivotX = 0;
                this.m_pivotY = 0;
                for(var i = 0; i < this.itemDataList.length; i++)
                {
                    this.itemDataList[i] = null;
                }
                this.itemDataList = [];

                for(var j = 0; j < this.itemDataAgencyList.length;j++)
                {
                    this.itemDataAgencyList[j]=null;
                }
                this.itemDataAgencyList = [];

                for(var n = 0;n < this.itemList.length; n++)
                {
                    this.itemList[n] = null;
                }
                this.itemList = [];
            },

            ////////////////////////////////////////////////////////////////////////////
            // private methods
            ////////////////////////////////////////////////////////////////////////////

            getX : function() {  return this.m_x;},
            setX : function(value){ this.m_x = value;},

            getY : function() {  return this.m_y;},
            setY : function(value){ this.m_y = value;},

            getScaleX : function() {  return this.m_scaleX;},
            setScaleX : function(value){ this.m_scaleX = value;},

            getScaleY : function() {  return this.m_scaleY;},
            setScaleY : function(value){ this.m_scaleY = value;},

            getSkewX : function() {  return this.m_skewX;},
            setSkewX : function(value){ this.m_skewX = value;},

            getSkewY : function() {  return this.m_skewY;},
            setSkewY : function(value){ this.m_skewY = value;},

            getPivotX : function() {  return this.m_pivotX;},
            setPivotX : function(value){ this.m_pivotX = value; },

            getPivotY : function() {  return this.m_pivotY;},
            setPivotY : function(value){ this.m_pivotY = value;},

            getRotation : function() {  return this.m_rotation;},
            setRotation : function(value){ this.m_rotation = value;},

            getMatrix2D : function(){ return this.matrix2D; },
            setMatrix2D : function(value){ this.matrix2D = value;}

        }
    );
})();
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
(function()
{
    ss2d.Stats = Class(
    {
        //////////////////////////////////////////////////////////////////////////
        //  private property
        //////////////////////////////////////////////////////////////////////////

        _container:null,
        _bar:null,
        _mode: 0,
        _modes : 2,
        _frames : 0,
        _time : 0,
        _timeLastFrame : 0,
        _timeLastSecond : 0,
        _fps: 0,
        _fpsMin : 1000,
        _fpsMax : 0,
        _fpsDiv:null,
        _fpsText:null,
        _fpsGraph:null,
        _fpsColors : null,
        _ms : 0,
        _msMin : 1000,
        _msMax : 0,
        _msDiv : null,
        _msText : null,
        _msGraph : null,
        _msColors : null,

        ////////////////////////////////////////////////////////////////////////////
        //  constructor
        ////////////////////////////////////////////////////////////////////////////

        initialize : function()
        {
            this._time = Date.now();
            this._timeLastFrame = this._timeLastSecond = this._time;
            this._fpsColors = [ [ 0, 0, 20 ], [ 0, 155, 255 ] ];
            this._msColors = [ [ 0, 20, 0 ], [ 0, 255, 0 ] ];
            this.mCreateContainer();
            this.mCreateFps();
            this.mCreateMs();
        },

        ////////////////////////////////////////////////////////////////////////////
        //  public methods
        ////////////////////////////////////////////////////////////////////////////

        getDomElement : function(){ return this._container; },

        getFps : function(){ return this._fps; },

        getFpsMin : function(){ return this._fpsMin; },

        getFpsMax : function(){ return this._fpsMax},

        getMs: function () { return this._ms; },

        getMsMin: function () { return this._msMin; },

        getMsMax: function () { return this._msMax; },

        update: function ()
        {
            this._time = Date.now();

            this._ms = this._time - this._timeLastFrame;
            this._msMin = Math.min( this._msMin, this._ms );
            this._msMax = Math.max( this._msMax, this._ms );

            this._msText.textContent = this._ms + ' MS (' + this._msMin + '-' + this._msMax + ')';
            this.mUpdateGraph( this._msGraph, Math.min( 20, 20 - ( this._ms / 200 ) * 20 ) );

            this._timeLastFrame = this._time;

            this._frames ++;

            if ( this._time > this._timeLastSecond + 1000 )
            {
                this._fps = Math.round( ( this._frames * 1000 ) / ( this._time - this._timeLastSecond ) );
                this._fpsMin = Math.min( this._fpsMin, this._fps );
                this._fpsMax = Math.max( this._fpsMax, this._fps );

                this._fpsText.textContent = this._fps + ' FPS (' + this._fpsMin + '-' + this._fpsMax + ')';
                this.mUpdateGraph( this._fpsGraph, Math.min( 20, 20 - ( this._fps / 100 ) * 20 ) );

                this._timeLastSecond = this._time;
                this._frames = 0;
            }

        },

        ////////////////////////////////////////////////////////////////////////////
        //  private methods
        ////////////////////////////////////////////////////////////////////////////

        mCreateContainer : function()
        {
            this._container = document.createElement( 'div' );
            this._container.id = 'stats';
            this._container.style.cursor = 'pointer';
            this._container.style.width = '80px';
            this._container.style.opacity = '0.7';
            this._container.style.zIndex = '10001';
            ss2d[this.onContainerMouseDownHandler] = this.onContainerMouseDownHandler.bind(this);
            this._container.addEventListener( 'mousedown', ss2d[this.onContainerMouseDownHandler], false );
        },

        mCreateFps : function()
        {
            this._fpsDiv = document.createElement( 'div' );
            this._fpsDiv.style.textAlign = 'left';
            this._fpsDiv.style.lineHeight = '.9em';
            this._fpsDiv.style.backgroundColor = 'rgb(' +
                Math.floor( this._fpsColors[ 0 ][ 0 ] / 2 ) + ',' +
                Math.floor( this._fpsColors[ 0 ][ 1 ] / 2 ) + ',' +
                Math.floor( this._fpsColors[ 0 ][ 2 ] / 2 ) + ')';
            this._fpsDiv.style.boxShadow = '1px 1px 3px rgba(0,0,0,.95) inset, ' +
                '0px 0px 0px rgba(0,0,0,.75), ' +
                '1px 1px 0px rgba(255,255,255,.65)';
            this._fpsDiv.style.padding = '1px';
            this._container.appendChild( this._fpsDiv );

            this._fpsText = document.createElement( 'div' );
            this._fpsText.style.fontFamily = 'Helvetica, Arial, sans-serif';
            this._fpsText.style.fontSize = '9px';
            this._fpsText.style.color = 'rgb(' + this._fpsColors[ 1 ][ 0 ] + ',' +
                parseInt(this._fpsColors[ 1 ][ 1 ]*1.5) + ',' + this._fpsColors[ 1 ][ 2 ] + ')';
            this._fpsText.style.fontWeight = 'bold';
            this._fpsText.style.padding = '0 1px';
            this._fpsText.innerHTML = 'FPS';
            this._fpsDiv.appendChild( this._fpsText );

            this._fpsGraph = document.createElement( 'div' );
            this._fpsGraph.style.position = 'relative';
            this._fpsGraph.style.width = '74px';
            this._fpsGraph.style.height = '20px';
            this._fpsGraph.style.left = '1px';
            this._fpsGraph.style.padding = '1px';
            this._fpsGraph.style.backgroundColor = 'rgba(' + this._fpsColors[ 1 ][ 0 ] + ',' +
                this._fpsColors[ 1 ][ 1 ] + ',' +
                this._fpsColors[ 1 ][ 2 ] + ', .5)';
            this._fpsDiv.appendChild( this._fpsGraph );

            while ( this._fpsGraph.children.length < 74 )
            {
                this._bar = document.createElement( 'span' );
                this._bar.style.width = '1px';
                this._bar.style.height = '20px';
                this._bar.style.cssFloat = 'left';
                this._bar.style.borderBottom = '1px solid';
                this._bar.style.borderColor = 'rgba(' +
                    this._fpsColors[ 1 ][ 0 ] + ',' +
                    this._fpsColors[ 1 ][ 1 ] + ',' +
                    this._fpsColors[ 1 ][ 2 ] + ',.9)';
                this._bar.style.backgroundColor = 'rgba(' +
                    this._fpsColors[ 0 ][ 0 ] + ',' +
                    this._fpsColors[ 0 ][ 1 ] + ',' +
                    this._fpsColors[ 0 ][ 2 ] + ',.8)';
                this._fpsGraph.appendChild( this._bar );

            }
        },

        mCreateMs : function()
        {
            this._msDiv = document.createElement( 'div' );
            this._msDiv.style.textAlign = 'left';
            this._msDiv.style.lineHeight = '.9em';
            this._msDiv.style.boxShadow = '1px 1px 3px rgba(0,0,0,.95) inset, 0px 0px 0px rgba(0,0,0,.75), 1px 1px 0px rgba(255,255,255,.65)';
            this._msDiv.style.backgroundColor = 'rgb(' +
                Math.floor( this._msColors[ 0 ][ 0 ] / 2 ) + ',' +
                Math.floor( this._msColors[ 0 ][ 1 ] / 2 ) + ',' +
                Math.floor( this._msColors[ 0 ][ 2 ] / 2 ) + ')';
            this._msDiv.style.padding = '1px';
            this._msDiv.style.display = 'none';
            this._container.appendChild( this._msDiv );

            this._msText = document.createElement( 'div' );
            this._msText.style.fontFamily = 'Helvetica, Arial, sans-serif';
            this._msText.style.fontSize = '9px';
            this._msText.style.color = 'rgb(' +
                this._msColors[ 1 ][ 0 ] + ',' +
                this._msColors[ 1 ][ 1 ] + ',' +
                this._msColors[ 1 ][ 2 ] + ')';
            this._msText.style.fontWeight = 'bold';
            this._msText.style.padding = '0 1px';
            this._msText.innerHTML = 'MS';
            this._msDiv.appendChild( this._msText );

            this._msGraph = document.createElement( 'div' );
            this._msGraph.style.position = 'relative';
            this._msGraph.style.width = '74px';
            this._msGraph.style.height = '20px';
            this._msGraph.style.padding = '1px';
            this._msGraph.style.left = '1px';
            this._msGraph.style.backgroundColor = 'rgba(' +
                this._msColors[ 1 ][ 0 ] + ',' +
                this._msColors[ 1 ][ 1 ] + ',' +
                this._msColors[ 1 ][ 2 ] + ',.5)';
            this._msDiv.appendChild( this._msGraph );

            while ( this._msGraph.children.length < 74 )
            {
                this._bar = document.createElement( 'span' );
                this._bar.style.width = '1px';
                this._bar.style.height = Math.random() * 20 + 'px';
                this._bar.style.cssFloat = 'left';
                this._bar.style.backgroundColor = 'rgba(' +
                    this._msColors[ 0 ][ 0 ] + ',' +
                    this._msColors[ 0 ][ 1 ] + ',' +
                    this._msColors[ 0 ][ 2 ] + ',.8)';
                this._bar.style.borderBottom = '1px solid';
                this._bar.style.borderColor = 'rgba(' +
                    this._msColors[ 1 ][ 0 ] + ',' +
                    this._msColors[ 1 ][ 1 ] + ',' +
                    this._msColors[ 1 ][ 2 ] + ',.9)';
                this._msGraph.appendChild( this._bar );
            }
        },

        mUpdateGraph : function(dom, value)
        {
            var child = dom.appendChild( dom.firstChild );
            child.style.height = value + 'px';
        },

        onContainerMouseDownHandler : function(e)
        {
            e.preventDefault();
            this._mode = ( this._mode + 1 ) % this._modes;
            if ( this._mode == 0 )
            {
                this._fpsDiv.style.display = 'block';
                this._msDiv.style.display = 'none';
            }
            else
            {
                this._fpsDiv.style.display = 'none';
                this._msDiv.style.display = 'block';
            }
        }
    });
})();

(function()
{
    /**
     * Blend 实现图像特效，粒子混色的重要手段，通过混色可以实现意想不到的神器效果。
     * <br /> 演示地址:http://sirius2d.com/demos/d_22
     * @class
     */
    ss2d.Blend = Class
    (
        /** @lends ss2d.Blend.prototype */
        {
            STATIC:
            {
                /** @lends ss2d.Blend.prototype*/
                /**
                 * 无混色
                 */
                BLEND_NONE:[1,0],

                /**
                 * 叠加
                 */
                BLEND_ADD:[0x0302,0x0302],

                /**
                 * 普通透明度
                 */
                BLEND_NORMAL:[0x0302,0x0303],

                /**
                 * 复合
                 */
                BLEND_MULTIPLY:[0x0306,0x0303],

                /**
                 * 遮挡
                 */
                BLEND_SCREEN:[0x0302,1],

                /**
                 * 擦除
                 */
                BLEND_ERASE:[0,0x0303],

                /**
                 * 排除
                 */
                BLEND_EXCLUSION:[0x0301,0x0301],

                /**
                 * 灯光
                 */
                BLEND_LIGHT:[0x0306,0x0304],

                /**
                 * 融化
                 */
                BLEND_FUSE:[0x0304,0x0300],

                /**
                 * 遮罩
                 */
                BLEND_MASK:[0x0306,0x0303],

                /**
                 * 透明度叠加
                 */
                BLEND_ADD_ALPHA:[0x0302,0x0304]
            }
        }
    )
})();
(function()
{
    /**
     * DisplayObject 最底层的显示对象基类。
     * @class
     */
    ss2d.DisplayObject = Class
    (
        /** @lends ss2d.DisplayObject.prototype */
        {
            Extends:ss2d.EventDispatcher,
            x : 0,
            y : 0,
            m_rotation : 0,
            m_alpha : 1,
            m_visible : true,
            isRedraw : true,
            m_parent : null,
            m_mouseEnabled : false,
            m_userData : null,
            m_center:false,
            m_forceCenter:false,
            m_r : 1,
            m_g : 1,
            m_b : 1,
            m_a : 1,
            m_width : 1,
            m_height : 1,
            m_scaleX : 1,
            m_scaleY : 1,
            m_skewX : 0,
            m_skewY : 0,
            m_pivotX : 0,
            m_pivotY : 0,

            /**
             * 使用GPU实现位移功能
             * <br /> implement displacement with GPU
             */
            GPUX:0.0,

            /**
             * 使用GPU实现位移功能
             * <br /> implement displacement with GPU
             */
            GPUY:0.0,

            /**
             * 是否开启GPU加速 true:开启   false:不开启
             * <br />implement displacement with GPU or CPU
             * true: GPU    false:CPU
             */
            GPU:false,

            initialize : function()
            {

            },

            /**
             * 设置对象的颜色值
             * <br /> set RGB of the object
             * @returns {*}
             */
           getColor : function(){ return ss2d.ColorUtil.RGBToHex({
                r:this.m_r * 255,
                g:this.m_g * 255,
                b:this.m_b * 255});
            },

            /**
             * 获取对象的颜色值
             * <br />get RGB of the object
             * @param value
             */
            setColor : function(value)
            {
                var rgb = ss2d.ColorUtil.hexToRGB(value);
                this.setR(rgb.r / 255);
                this.setB(rgb.b / 255);
                this.setG(rgb.g / 255);
            },

            /**
             * 获取对象的红色通道值
             * <br />get red channel of the object
             * @returns {number}
             */
            getR : function() {  return this.m_r;},

            /**
             * 设置对象的红色通道值
             * <br />set red channel of the object
             * @param value
             */
            setR : function(value){ this.m_r = value; this.isRedraw = true; },

            /**
             * 获取对象的绿色通道值
             * <br />get green channel of the object
             * @returns {number}
             */
            getG : function() {  return this.m_g;},

            /**
             * 设置对象的绿色通道值
             * <br />set green channel of the object
             * @param value
             */
            setG : function(value){ this.m_g = value; this.isRedraw = true; },

            /**
             * 获取对象的蓝色通道值
             * <br />get blue channel of the object
             * @returns {number}
             */
            getB : function() {  return this.m_b;},

            /**
             * 设置对象的蓝色通道值
             * <br />set blue channel of the object
             * @param value
             */
            setB : function(value){ this.m_b = value; this.isRedraw = true; },

            /**
             * 获取对象像素透明度
             * <br />get alpha channel of the object
             * @returns {number}
             */
            getA : function() {  return this.m_a;},

            /**
             * 设置对象的像素透明度
             * <br />set alpha channel of the object
             * @param value
             */
            setA : function(value){ this.m_a = value; this.isRedraw = true; },

            /**
             * 设置对象的X轴位置
             * <br />get X of the object
             * @returns {number}
             */
            getX : function() {  return this.x;},

            /**
             * 获取对象的X轴位置
             * <br />set X of the object
             * @param value
             */
            setX : function(value){ this.x = value; this.isRedraw = true; },

            /**
             * 获取对象的Y轴位置
             * <br />get Y of the object
             * @returns {number}
             */
            getY : function() {  return this.y;},

            /**
             * 设置对象的Y轴位置
             * <br />set Y of the object
             * @param value
             */
            setY : function(value){ this.y = value; this.isRedraw = true; },

            /**
             * 获取对象的宽度
             * <br />get width of the object
             * @returns {number}
             */
            getWidth : function() {  return this.m_width;},

            /**
             * 设置对象的宽度
             * <br />set width of the object
             * @param value
             */
            setWidth : function(value){ this.m_width = value; this.isRedraw = true;},

            /**
             * 获取对象的高度
             * <br />get height of the object
             * @returns {number}
             */
            getHeight : function() {  return this.m_height;},

            /**
             * 设置对象的高度
             * <br />set height of the object
             * @param value
             */
            setHeight : function(value){ this.m_height = value; this.isRedraw = true; },

            /**
             * 获取对象的X轴比例
             * <br />get scale X of the object
             * @returns {number}
             */
            getScaleX : function() {  return this.m_scaleX;},

            /**
             * 设置对象的X轴比例
             * <br />set scale X of the object
             * @param value
             */
            setScaleX : function(value){ this.m_scaleX = value; this.isRedraw = true; },

            /**
             * 获取对象的Y轴比例
             * <br />get scale Y of the object
             * @returns {number}
             */
            getScaleY : function() {  return this.m_scaleY;},

            /**
             * 设置对象的Y轴比例
             * <br />set scale Y of the object
             * @param value
             */
            setScaleY : function(value){ this.m_scaleY = value; this.isRedraw = true; },

            /**
             * 获取对象的X轴倾斜值
             * <br />get skew X of the object
             * @returns {number}
             */
            getSkewX : function() {  return this.m_skewX;},

            /**
             * 设置对象的X轴倾斜值
             * <br />set skew X of the object
             * @param value
             */
            setSkewX : function(value){ this.m_skewX = value; this.isRedraw = true; },

            /**
             * 获取对象的Y轴倾斜值
             * <br />get skew Y of the object
             * @returns {number}
             */
            getSkewY : function() {  return this.m_skewY;},

            /**
             * 设置对象的Y轴倾斜值
             * <br />set skew Y of the object
             * @param value
             */
            setSkewY : function(value){ this.m_skewY = value; this.isRedraw = true; },

            /**
             * 获取对象的X轴偏移位置
             * <br />get pivot X of the object
             * @returns {number}
             */
            getPivotX : function() {  return this.m_pivotX;},

            /**
             * 设置对象的X轴偏移位置
             * <br />set pivot X of the object
             * @param value
             */
            setPivotX : function(value){ this.m_pivotX = value; this.isRedraw = true; },

            /**
             * 获取对象的Y轴偏移量
             * <br />get pivot Y of the object
             * @returns {number}
             */
            getPivotY : function() {  return this.m_pivotY;},

            /**
             * 设置对象的Y轴偏移量
             * <br />set pivot Y of the object
             * @param value
             */
            setPivotY : function(value){ this.m_pivotY = value; this.isRedraw = true; },

            /**
             * 获取对象的角度
             * <br />get angle of the object
             * @returns {number}
             */
            getRotation : function() {  return this.m_rotation;},

            /**
             * 设置对象的角度
             * <br />set angle of the object
             * @param value
             */
            setRotation : function(value){ this.m_rotation = value; this.isRedraw = true; },

            /**
             * 获取对象的透明度 ( RGBA*透明度 )
             * <br />get alpha of the object ( RGBA*alpha )
             * @returns {number}
             */
            getAlpha : function() {  return this.m_alpha;},

            /**
             * 设置对象的透明度 ( RGBA*透明度 )
             * <br />set alpha of the object ( RGBA*alpha )
             * @param value
             */
            setAlpha : function(value){ this.m_alpha = value; this.isRedraw = true; },

            /**
             * 获取对象的可见性
             * <br />get visibility of the object
             * @returns {boolean}
             */
            getVisible : function() {  return this.m_visible;},

            /**
             * 设置对象的可见性
             * <br />set visibility of the object
             * @param value
             */
            setVisible : function(value){ this.m_visible = value; this.isRedraw = true; },

            /**
             * 获取对象的刷新状态
             * <br />get a boolean value that indicates whether the object is redrawn
             * @returns {boolean}
             */
            getIsRedraw : function() {  return this.isRedraw;},

            /**
             * 设置对象的刷新状态
             * <br />set a boolean value that indicates whether the object is redrawn
             * @param value
             */
            setIsRedraw : function(value){ this.isRedraw = value; },

            /**
             * 访问对象上级对象
             * <br />get the parent of the object
             * @returns {null}
             */
            getParent : function() {  return this.m_parent;},

            /**
             * 设置对象上级对象
             * <br />set the parent of the object
             * @param value
             */
            setParent : function(value){ this.m_parent = value; },

            /**
             * 获取鼠标监测状态
             * <br />get a boolean value that indicates whether the mouse event is listened
             * @returns {boolean}
             */
            getMouseEnabled : function() {  return this.m_mouseEnabled;},

            /**
             * 设置鼠标监测状态
             * <br />set a boolean value that indicates whether the mouse event is listened
             * @param value
             */
            setMouseEnabled : function(value){ this.m_mouseEnabled = value; },

            /**
             * 获取用户数据
             * <br />get the user data
             * @returns {null}
             */
            getUserData : function() {  return this.m_userData;},

            /**
             * 设置用户数据
             * <br />set the user data
             * @param value
             */
            setUserData : function(value){ this.m_userData = value; },

            /**
             * 获取对象中心对齐状态
             * <br />get a boolean value that indicates whether the object is aligned center
             * @returns {boolean}
             */
            getCenter : function() {  return this.m_center;},

            /**
             * 设置对象中心对齐状态
             * <br />set a boolean value that indicates whether the object is aligned center
             * @param value
             */
            setCenter : function(value){ this.m_center = value; },

            /**
             * 获取对象强制中心对齐状态 (无视动画偏移量的影响)
             * <br />get a boolean value that indicates whether the object is aligned center (ignore the offsets of animations)
             * @returns {boolean}
             */
            getForceCenter : function() {  return this.m_forceCenter;},

            /**
             * 设置对象强制中心对齐状态 (无视动画偏移量的影响)
             * <br />set a boolean value that indicates whether the object is aligned center (ignore the offsets of animations)
             * @param value
             */
            setForceCenter : function(value){ this.m_forceCenter = value; },

            /**
             * 检测对象与坐标点的碰撞
             * <br />collision detection between the object and a point
             * @param x
             * @param y
             * @returns {boolean}
             */
            hitTestPoint : function(x, y)
            {
                var point=this.absCentre();
                var distanceX = Math.abs(point.x-x);
                var distanceY = Math.abs(point.y-y);
                if (distanceX <= this.getWidth() / 2 &&
                    distanceY <= this.getHeight()/ 2)
                {
                    return true;
                }
                return false
            },

            /**
             * 检测对象与对象的碰撞
             * <br />collision detection between 2 objects
             * @param child
             * @returns {boolean}
             */
            hitTestObject : function(child)
            {
                var pointA=this.absCentre();
                var pointB=child.absCentre();
                var distanceX = Math.abs(pointA.x - pointB.x);
                var distanceY = Math.abs(pointA.y - pointB.y);
                if (distanceX <= this.getWidth() / 2 + this.getWidth() / 2 &&
                    distanceY <= child.getHeight() / 2 + child.getHeight() / 2)
                {
                    return true;
                }
                return false
            },

            /**
             * 检测对象与范围的碰撞
             * <br />collision detection between the object and an area
             * @param x
             * @param y
             * @param radius
             * @returns {boolean}
             */
            hitTestRoundness : function(x, y, radius)
            {
                var point=this.absCentre();
                var distanceX = Math.abs(point.x - x);
                var distanceY = Math.abs(point.y - y);
                var distanceZ = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
                if(distanceZ <= radius)
                {
                    return true;
                }
                return false
            }
        }
    );
})();
(function()
{
    /**
     * 帧缓存类 用于后处理的必须类，使用它可以把当前屏幕的内容拷贝到一张特定的纹理上，用于做后期的屏幕特效。
     * <br />演示地址：http://sirius2d.com/demos/d_37/
     * @class
     */
    ss2d.FrameBuffer = Class
    (
        /** @lends ss2d.FrameBuffer.prototype */
        {
            _frameBuff:null,
            _sceneList:null,
            _clear:true,


            initialize : function()
            {
                this._sceneList=[];
            },

            /**
             * 设置显示缓存
             * <br />display the frame buffer
             * @param {boolean}
             */
            setDisplay:function(value)
            {
                this._frameBuff=value;
            },

            /**
             * 获取帧缓存
             * <br />get frame buffer
             * @param {boolean}
             */
            getFrameBuff:function()
            {
                return this._frameBuff;
            },

            /**
             * 是否清理画面
             * <br />set a boolean value that indicates whether the scene is cleaned up
             * @param value
             */
            isClear:function(value)
            {
                this._clear=value;
            },

            /**
             * 添加到显示列表
             * <br />add object to the scene list
             * @param {ss2d.Scene} child 显示对象
             */
            addChild:function(child)
            {
                this._sceneList.push(child);
            },

            /**
             * 从显示列表删除显示对象
             * <br />remove object to the scene list
             * @param {ss2d.Scene} child 显示对象
             */
            removeChild:function(child)
            {
                var index=this._sceneList.indexOf(child);
                if(index!=-1)
                {
                    this._sceneList.splice(index,1);
                }

            },

            paint:function()
            {
                for(var i=0;i<this._sceneList.length;i++)
                {
                    this._sceneList[i].paint();
                }
            }
        }
    );
})();
(function()
{
    /**
     * Group 群组类，用于实现Quad的嵌套操作，批量运动，骨骼运动等等
     * <br />演示地址：http://sirius2d.com/demos/d_18/
     * @class
     */
    ss2d.Group = Class
    (
        /** @lends ss2d.Group.prototype */
        {
            //////////////////////////////////////////////////////////////////////////
            //  Extends
            //////////////////////////////////////////////////////////////////////////

            Extends:ss2d.EventDispatcher,

            //////////////////////////////////////////////////////////////////////////
            //  public property
            //////////////////////////////////////////////////////////////////////////
            _x : 0,
            _y : 0,
            m_scaleX : 1,
            m_scaleY : 1,
            m_skewX : 0,
            m_skewY : 0,
            m_parent : null,

            //////////////////////////////////////////////////////////////////////////
            //  public property
            //////////////////////////////////////////////////////////////////////////

            m_rotation : 0,

             //父群组
            parentGroup:null,

            //子群组
            childGroup:null,

            //组的矩阵
            matrix2D:null,

            //组的矩阵数据
            rawData:null,

            //////////////////////////////////////////////////////////////////////////
            //  public property
            //////////////////////////////////////////////////////////////////////////

            /**
             * @private
             */
            _quadList:null,

            ////////////////////////////////////////////////////////////////////////////
            //  constructor
            ////////////////////////////////////////////////////////////////////////////


            m_upDataFunction:null,
            initialize : function()
            {
                this.rawData = new Float32Array(8);
                this.matrix2D = new ss2d.Matrix2D();
                this._quadList = [];
                this.m_upDataFunction = this.upData.bind(this);
                ss2d.stage.addEventListener(ss2d.Event.ENTER_FRAME, this.m_upDataFunction);
            },

            ////////////////////////////////////////////////////////////////////////////
            //  public methods
            ////////////////////////////////////////////////////////////////////////////

            /**
             * 清理组
             */
            clearParentGroup:function()
            {
                this.parentGroup.childGroup=null;
                this.parentGroup=null;
            },

            /**
             * 是否包含指定的子群
             * @param childGroup
             * @returns {boolean}
             */
            containsGroup:function(childGroup)
            {
                while (childGroup)
                {
                    if (childGroup == this) return true;
                    else childGroup = childGroup.parentGroup;
                }
                return false;
            },

            /**
             * 添加显示对象
             * @param value
             */
            addChild:function(value)
            {
                value.setTransform(this.matrix2D);
                this._quadList.push(value);
                this.m_upDataFunction();
            },

            /**
             * 删除显示对象
             * @param value
             */
            removeChild:function(value)
            {
                var index=this._quadList.indexOf(value);
                if(index!=-1)
                this._quadList.splice(index,1);
            },

            upRedraw:function()
            {
                this.isRedraw=true;
            },

            upData:function()
            {

                if(this._quadList!=null)
                {
                    this.matrix2D.upDateMatrix(this.m_rotation,
                        (this._x)*1*2/ss2d.Stage2D.stageHeight,
                        (this._y)*1*2/ss2d.Stage2D.stageHeight,
                        this.m_scaleX,
                        this.m_scaleY,
                        this.m_skewX,
                        this.m_skewY);
                    if(this.parentGroup!=null)
                    {
                        this.matrix2D.rawData=this.parentGroup.matrix2D.add3x3(this.matrix2D.rawData,this.parentGroup.matrix2D.rawData);
                    }

                    for(var i=0;i<this._quadList.length;i++)
                    {
                        this._quadList[i].isRedraw=true;
                    }

                    if(this.childGroup!=null)
                    {
                        this.childGroup.upRedraw();
                    }
                }
            },

            /**
             * 销毁组
             */
            dispose : function()
            {
                ss2d.stage.removeEventListener(ss2d.Event.ENTER_FRAME,this.m_upDataFunction);

                for(var i=0; i < this._quadList.length; i++)
                {
                    this.removeChild(this._quadList[i]);
                    this._quadList[i]=null;
                    //Group不负责显示层的销毁,quad由Scene负责统一销毁
                    //this._quadList[i].dispose();
                }
                //this.clearParentGroup();
                this._quadList = null;
                this.m_parent = null;
                this.parentGroup = null;
                this.childGroup = null;
                this.matrix2D = null;
                this.rawData = null;

            },

            ////////////////////////////////////////////////////////////////////////////
            //  Additional getters and setters
            ////////////////////////////////////////////////////////////////////////////

            /**
             * 获取组的X轴位置
             * @returns {number}
             */
            getX : function() {  return this._x;},

            /**
             * 设置组的X轴位置
             * @param value
             */
            setX : function(value){ this._x = value;},

            /**
             * 获取组的Y轴位置
             * @returns {number}
             */
            getY : function() {  return this._y;},

            /**
             * 设置组的Y轴位置
             * @param value
             */
            setY : function(value){ this._y = value;},

            /**
             * 获取组的X轴比例
             * @returns {number}
             */
            getScaleX : function() {  return this.m_scaleX;},

            /**
             * 设置组的X轴比例
             * @param value
             */
            setScaleX : function(value){ this.m_scaleX = value;},

            /**
             * 获取组的Y轴比例
             * @returns {number}
             */
            getScaleY : function() {  return this.m_scaleY;},

            /**
             * 设置组的Y轴比例
             * @param value
             */
            setScaleY : function(value){ this.m_scaleY = value;},

            /**
             * 获取组的X轴倾斜值
             * @returns {number}
             */
            getSkewX : function() {  return this.m_skewX;},

            /**
             * 设置组的X轴倾斜值
             * @param value
             */
            setSkewX : function(value){ this.m_skewX = value;},

            /**
             * 获取组的Y轴倾斜值
             * @returns {number}
             */
            getSkewY : function() {  return this.m_skewY;},

            /**
             * 设置组的Y轴倾斜值
             * @param value
             */
            setSkewY : function(value){ this.m_skewY = value;},

            /**
             * 获取组的角度
             * @returns {number}
             */
            getRotation : function() {  return this.m_rotation;},

            /**
             * 设置组的角度
             * @param value
             */
            setRotation : function(value){ this.m_rotation = value;},


            /**
             * 添加组
             * @param value
             */
            setParentGroup:function(value)
            {
                this.parentGroup=value;
                this.parentGroup.childGroup=this;
                this.m_upDataFunction();
            }

        }
    );
})();
(function()
{
    /**
     * Scene 场景管理类，开发高效率游戏的必要类，它不是一个显示对象，而是一个批处理的对象池，使用它你必须事先明确需要多少个Quad，当以后开发时再从Scene里去取,Quad是整个引擎里功能最多的显示对象。
     * <br />演示地址:http://sirius2d.com/demos/d_12/
     * @class
     */
    ss2d.Scene = Class
    (
        /** @lends ss2d.Scene.prototype */
        {
            Extends:ss2d.EventDispatcher,
            /**
             * GL裁切X轴位置
             * <br />scissor X
             */
            glScissorX:0.0,

            /**
             * GL裁切Y轴位置
             * <br />scissor Y
             */
            glScissorY:0.0,

            /**
             * GL裁切宽度
             * <br />scissor width
             */
            glScissorWidth:0.0,

            /**
             * GL裁切高度
             * <br />scissor height
             */
            glScissorHeight:0.0,

            /**
             * 舞台
             * <br />stage
             */
            stage : null,
            verticesColorBuffer : null,
            verticesGPUBuffer : null,
            verticesJointBuffer : null,
            vertexPositionBuffer : null,
            vertexTextureUvdBuffer : null,
            vertexIndexBuffer : null,
            quadList : null,
            maxQuadNum : 1,

            m_isJoint : false,
            m_indexList : null,
            m_verticesGPUList : null,
            m_jointList :null,
            m_verticesList :null,
            m_uvList : null,
            m_colorList : null,
            m_texture : null,
            shader : null,
            m_sfactor : null,
            m_dfactor : null,
            m_mouseEnabled : true,
            m_applyIndex:0,


            initialize : function(textureData)
            {
                this.glScissorX=0.0;
                this.glScissorY=0.0;
                this.glScissorWidth=ss2d.Stage2D.canvas.width;
                this.glScissorHeight=ss2d.Stage2D.canvas.height;
                this.quadList=[];
                //对象池最大数量
                //the maximum amount of the quad list
                this.maxQuadNum = 1;
                if(arguments.length > 1) this.maxQuadNum = arguments[1];
                this.m_indexList = new Uint16Array(this.maxQuadNum * 6);
                this.m_jointList = new Float32Array(this.maxQuadNum * 8);
                this.m_verticesGPUList=new Float32Array(this.maxQuadNum * 8);
                this.m_verticesList = new Float32Array(this.maxQuadNum * 8);
                this.m_uvList = new Float32Array(this.maxQuadNum * 8);
                this.m_colorList = new Float32Array(this.maxQuadNum * 16);
                this.m_texture = arguments[0];

                if(arguments[0] instanceof Array)
                {
                    this.m_isJoint = true;
                    this.shader = new ss2d.ShaderJoint();
                }else
                {
                    this.shader = ss2d.Stage2D.shader;
                }

                //上传到webgl的状态机里
                //ss2d.Stage2D.gl.bindBuffer(ss2d.Stage2D.gl.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer);
                //ss2d.Stage2D.gl.bufferData(ss2d.Stage2D.gl.ELEMENT_ARRAY_BUFFER, this._indexList, ss2d.Stage2D.gl.STATIC_DRAW);

                //设置顶点绘制的循序,WBEGL会根据你的这个循序去渲染你的图像,通常你可以利用这里改变你的图像的排序循序,这里渲染的是
                //两个三角形,因为我们是做2D,两个三角形是有两个共享点的
                //根据对象数量创建顶点
                /*for(var v = 0; v < this._maxQuadNum; v++)
                 {
                 this.m_indexList[v + v * 5 + 0] = 0 + v * 4;
                 this.m_indexList[v + v * 5 + 1] = 1 + v * 4;
                 this.m_indexList[v + v * 5 + 2] = 2 + v * 4;
                 this.m_indexList[v + v * 5 + 3] = 0 + v * 4;
                 this.m_indexList[v + v * 5 + 4] = 2 + v * 4;
                 this.m_indexList[v + v * 5 + 5] = 3 + v * 4;
                 }*/

                //这里的上传类型改变为长整形了,Uint16Array,这里是一个坑,在其他语言里你上传错误的数据类型不会报错,但是会显示很奇怪,
                //以前我就被这个坑了一个下午,因为索引ID没有小数
                this.m_sfactor = ss2d.Stage2D.gl.ONE;
                this.m_dfactor = ss2d.Stage2D.gl.ONE_MINUS_SRC_ALPHA;


                //创建对象池元素
                //create elements of the quad list
                for(var i = 0; i < this.maxQuadNum; i++)
                {
                    this.quadList.push(new ss2d.Quad(i, this.m_texture,
                        this.m_verticesList, this.m_uvList, this.m_colorList, this.m_jointList,this.m_indexList,this.m_verticesGPUList));
                }

                //初始化GPU加速缓存
                //create GPU buffer
                this.verticesGPUBuffer=ss2d.Stage2D.gl.createBuffer();
                //初始化拼接色信息
                //create texture joint buffer
                this.verticesJointBuffer = ss2d.Stage2D.gl.createBuffer();
                //从gl申请一个顶点颜色信息缓存数组
                //create vertex color buffer
                this.verticesColorBuffer = ss2d.Stage2D.gl.createBuffer();
                //从gl申请一个顶点坐标信息缓存数组
                //create vertex pos buffer
                this.vertexPositionBuffer = ss2d.Stage2D.gl.createBuffer();
                //从gl申请一个UV的缓存数组
                //create texture UV buffer
                this.vertexTextureUvdBuffer = ss2d.Stage2D.gl.createBuffer();
                //申请一个顶点索引的缓存数组
                //create vertex index buffer
                this.vertexIndexBuffer = ss2d.Stage2D.gl.createBuffer();
            },

            /**
             * 销毁
             * <br />dispose
             */
            dispose:function()
            {
                ss2d.Stage2D.gl.deleteBuffer(this.verticesGPUBuffer);
                ss2d.Stage2D.gl.deleteBuffer(this.verticesJointBuffer);
                ss2d.Stage2D.gl.deleteBuffer(this.verticesColorBuffer);
                ss2d.Stage2D.gl.deleteBuffer(this.vertexPositionBuffer);
                ss2d.Stage2D.gl.deleteBuffer(this.vertexTextureUvdBuffer);
                ss2d.Stage2D.gl.deleteBuffer(this.vertexIndexBuffer);

                this.verticesGPUBuffer=null;
                this.verticesJointBuffer=null;
                this.verticesColorBuffer=null;
                this.vertexPositionBuffer=null;
                this.vertexTextureUvdBuffer=null;
                this.vertexIndexBuffer=null;
                this.m_texture=null;

                for(var i = 0; i < this.maxQuadNum; i++)
                {
                    this.quadList[i].dispose();
                    this.quadList[i]=null;
                }
                this.quadList=null;
            },


            /**
             * 申请quad
             * <br />register quads from quad list
             * @returns {*}
             */
            applyQuad : function(cache)
            {
                if(cache)
                {
                    for(var i=this.m_applyIndex;i <this.quadList.length; i++)
                    {
                        if(this.quadList[i].getIsActivate() == false)
                        {
                            this.m_applyIndex=i;
                            this.quadList[i].launch();
                            //this.quadList[i].setScene(this);
                            return this.quadList[i];
                        }
                    }
                }else
                {
                    for(var i=0;i < this.quadList.length; i++)
                    {
                        if(this.quadList[i].getIsActivate() == false)
                        {
                            this.quadList[i].launch();
                            //this.quadList[i].setScene(this);
                            ss2d.debug=true;
                            ss2d.log(i)
                            return this.quadList[i];
                        }
                    }

                }

                return null;
            },

            /**
             * 隐藏quad
             * <br />hide quad
             * @param quad
             */
            hideQuad : function(child)
            {
                child.setScene(null);
            },

            /**
             * 显示quad
             * <br />display quad
             * @param quad
             */
            showQuad : function(child,parameter)
            {
                if(!parameter)
                {
                    var index = this.quadList.indexOf(child);
                    if (index != -1)
                    {
                        for(var i=index+1;i<this.quadList.length;i++)
                        {
                            var quad = this.quadList[i];
                            quad.setID(quad.m_id - 1)
                            quad.initIndexs();
                        }
                        child.setID(this.quadList.length - 1);
                        this.quadList.splice(index,1);
                        this.quadList.push(child);
                        child.initIndexs();
                    }
                }
                child.setScene(this);
            },

            /**
             * 设置纹理对象
             * <br />set texture
             * @param value
             */
            setTexture:function(value)
            {
                this.m_texture=value;
            },

            /**
             * 获取纹理对象
             * <br />get texture
             * @returns {null}
             */
            getTexture:function()
            {
                return this.m_texture;
            },

            /**
             * 获取对象鼠标监测状态
             * <br />get a boolean value that indicates whether the mouse event is listened
             * @returns {boolean}
             */
            getMouseEnabled : function()
            {
                return this.m_mouseEnabled;
            },

            /**
             * 设置对象鼠标监测状态
             * <br />get a boolean value that indicates whether the mouse event is listened
             * @param boolean value
             */
            setMouseEnabled : function(value)
            {
                this.m_mouseEnabled = value;
            },



            /**
             * 设置着色器
             * <br />set shader
             * @param value
             */
            setShader : function(value)
            {
                if(value!=null)
                {
                    this.shader = value;
                }else
                {
                    this.shader = ss2d.Stage2D.shader;
                }

            },

            /**
             * 获取着色器
             * <br />get shader
             * @returns {null}
             */
            getShader : function()
            {
                return this.shader;
            },



            /**
             * 设置混色参数
             * <br />set blend mode
             * @param src
             * @param dst
             */
            blend : function(value)
            {
                if(arguments.length==2)
                {
                    this.m_sfactor = arguments[0];
                    this.m_dfactor = arguments[1];
                }else if(arguments.length==1)
                {
                    this.m_sfactor = arguments[0][0];
                    this.m_dfactor = arguments[0][1];
                }
            },


            getQuadsUnderPoint : function(x, y)
            {
                var quads = null;
                for(var i = this.quadList.length - 1;i >= 0; i--)
                {
                    if(this.quadList[i].getMouseEnabled() && this.quadList[i].getScene()!= null && this.quadList[i].getVisible())
                    {
                        /*var pw = (this._quadList[i].getVertex(3)[0] - this._quadList[i].getVertex(0)[0]) / 2;
                         var ph = (this._quadList[i].getVertex(3)[1] - this._quadList[i].getVertex(0)[1]) / 2;
                         var px = this._quadList[i].getVertex(0)[0] + pw;
                         var py = this._quadList[i].getVertex(0)[1] + ph;
                         if(this._quadList[i].width != 0 && this._quadList[i].height != 0)
                         {
                         if(Math.abs(x - px) <= pw && Math.abs(y - py) <= ph)
                         {
                         if (quads == null) quads = [];
                         quads.push(this._quadList[i]);
                         }
                         }*/



                        //基于顶点的监测方式,虽然消耗一点性能,但是可以做精准的三角形拾取点击
                        if(this.quadList[i].getWidth() != 0 && this.quadList[i].getHeight() != 0)
                        {


                            var point=new ss2d.Point((x-this.quadList[i].GPUX)* 2 / ss2d.Stage2D.stageHeight,(y-this.quadList[i].GPUY)* 2 / ss2d.Stage2D.stageHeight);
                            if(ss2d.hitPoint(
                                this.quadList[i].getVertex(0),
                                this.quadList[i].getVertex(1),
                                this.quadList[i].getVertex(2),point)||
                                ss2d.hitPoint(
                                    this.quadList[i].getVertex(2),
                                    this.quadList[i].getVertex(1),
                                    this.quadList[i].getVertex(3),point))
                            {



                                if (quads == null) quads = [];
                                quads.push(this.quadList[i]);
                            }
                        }
                    }
                }
                return quads;
            },

            /**
             * 检测鼠标碰撞
             * <br />collision detection between mouse and point
             * @param x
             * @param y
             * @returns {boolean}
             */
            hitTestPoint : function(x, y)
            {
                for(var i = this.quadList.length - 1;i >= 0; i--)
                {
                    if(this.quadList[i].mouseEnabled && this.quadList[i].parent != null && this.quadList[i].m_visible)
                    {
                        var pw = (this.quadList[i].getVertex(3)[0] - this.quadList[i].getVertex(0)[0]) / 2;
                        var ph = (this.quadList[i].getVertex(3)[1] - this.quadList[i].getVertex(0)[1]) / 2;
                        var px = this.quadList[i].getVertex(0)[0] + pw;
                        var py = this.quadList[i].getVertex(0)[1] + ph;
                        if(this.quadList[i].width != 0 && this.quadList[i].height != 0)
                        {
                            if(Math.abs(x - px) <= pw && Math.abs(y - py) <= ph)
                            {
                                return this.quadList[i];
                            }
                        }
                    }
                }
                return null;
            },


            /**
             * 重绘
             * paint
             */
            paint : function()
            {
                ss2d.Stage2D.gl.scissor(this.glScissorX,this.glScissorY,this.glScissorWidth,this.glScissorHeight);
                ss2d.Stage2D.gl.blendFunc(this.m_sfactor,this.m_dfactor);
                //开始渲染批处理对象
                //paint quads from quad list
                var len=this.quadList.length;
                for(var i = 0;i < len; i++)
                {
                    var thisQuad=this.quadList[i];
                    if(thisQuad.scene != null && thisQuad.m_visible && thisQuad.m_isActivate)
                    {
                        if(thisQuad.m_isPlaying)
                         {
                             thisQuad.m_targetTime = new Date().getTime();
                             thisQuad.compareTime=thisQuad.m_targetTime - thisQuad.m_lastTime;
                             thisQuad.cacheTime+=thisQuad.compareTime;
                             thisQuad.cacheTime=thisQuad.cacheTime-thisQuad.m_delay;
                             if (thisQuad.cacheTime >= thisQuad.m_delay)
                             {
                                 thisQuad.m_lastTime=new Date().getTime();
                                 thisQuad.updateFrame(true);
                             }
                         }
                        if(thisQuad.isRedraw)
                        {

                            thisQuad.isRedraw = false;

                            //强制转换成笛卡尔第四象限坐标系
                            //transform into Cartesian coordinates (fourth quadrant)
                            thisQuad.m_quadMatrixUtil.setX(thisQuad.x * 2 / ss2d.Stage2D.stageHeight);
                            thisQuad.m_quadMatrixUtil.setY(thisQuad.y * 2 /ss2d.Stage2D.stageHeight);

                            thisQuad.m_quadMatrixUtil.setRotation(thisQuad.m_rotation);

                            thisQuad.m_quadMatrixUtil.upDateMatrixData(
                                (-thisQuad.m_pivotX + thisQuad.m_framePivotX) * thisQuad.m_scaleX * 2 / ss2d.Stage2D.stageHeight,
                                (-thisQuad.m_pivotY + thisQuad.m_framePivotY) * thisQuad.m_scaleY * 2 / ss2d.Stage2D.stageHeight,
                                thisQuad.m_scaleX * (thisQuad.m_frameWidth / thisQuad.m_Texture.width),
                                thisQuad.m_scaleY * (thisQuad.m_frameHeight / thisQuad.m_Texture.height),
                                thisQuad.m_skewX, thisQuad.m_skewY);

                            //更新面板的矩阵信息
                            //update matrix of the panel
                            thisQuad.m_quadMatrixUtil.upDateMatrix(thisQuad.m_transform == null);

                            if(thisQuad.m_transform != null)
                            {
                                thisQuad.m_quadMatrixUtil.getMatrix2D().rawData = thisQuad.m_quadMatrixUtil.getMatrix2D().add3x3(thisQuad.m_quadMatrixUtil.getMatrix2D().rawData, thisQuad.m_transform.rawData);
                                thisQuad.m_quadMatrixUtil.upDateRaw();
                            }



                            thisQuad.frameXDivWidth = thisQuad.m_frameX / thisQuad.m_Texture.width;
                            thisQuad.frameYDivHeight = thisQuad.m_frameY / thisQuad.m_Texture.height;
                            thisQuad.frameWidthDivWidth =thisQuad.m_frameWidth / thisQuad.m_Texture.width;
                            thisQuad.frameHeightDivHeight = thisQuad.m_frameHeight / thisQuad.m_Texture.height;

                            thisQuad.textureUV[thisQuad.id8_1] =  thisQuad.frameXDivWidth;
                            thisQuad.textureUV[thisQuad.id8_2] = -thisQuad.frameYDivHeight;
                            thisQuad.textureUV[thisQuad.id8_3] =  thisQuad.frameWidthDivWidth + thisQuad.frameXDivWidth;
                            thisQuad.textureUV[thisQuad.id8_4] = -thisQuad.frameYDivHeight;
                            thisQuad.textureUV[thisQuad.id8_5] =  thisQuad.frameWidthDivWidth + thisQuad.frameXDivWidth;
                            thisQuad.textureUV[thisQuad.id8_6] = -thisQuad.frameHeightDivHeight - thisQuad.frameYDivHeight;
                            thisQuad.textureUV[thisQuad.id8_7] =  thisQuad.frameXDivWidth;
                            thisQuad.textureUV[thisQuad.id8_8] = -thisQuad.frameHeightDivHeight - thisQuad.frameYDivHeight;
                        }

                        if(!thisQuad.isAnimationMatrix)
                        {
                            thisQuad.frameXDivWidth = thisQuad.m_frameX / thisQuad.m_Texture.width;
                            thisQuad.frameYDivHeight = thisQuad.m_frameY / thisQuad.m_Texture.height;
                            thisQuad.frameWidthDivWidth =thisQuad.m_frameWidth / thisQuad.m_Texture.width;
                            thisQuad.frameHeightDivHeight = thisQuad.m_frameHeight / thisQuad.m_Texture.height;

                            thisQuad.textureUV[thisQuad.id8_1] =  thisQuad.frameXDivWidth;
                            thisQuad.textureUV[thisQuad.id8_2] = -thisQuad.frameYDivHeight;
                            thisQuad.textureUV[thisQuad.id8_3] =  thisQuad.frameWidthDivWidth + thisQuad.frameXDivWidth;
                            thisQuad.textureUV[thisQuad.id8_4] = -thisQuad.frameYDivHeight;
                            thisQuad.textureUV[thisQuad.id8_5] =  thisQuad.frameWidthDivWidth + thisQuad.frameXDivWidth;
                            thisQuad.textureUV[thisQuad.id8_6] = -thisQuad.frameHeightDivHeight - thisQuad.frameYDivHeight;
                            thisQuad.textureUV[thisQuad.id8_7] =  thisQuad.frameXDivWidth;
                            thisQuad.textureUV[thisQuad.id8_8] = -thisQuad.frameHeightDivHeight - thisQuad.frameYDivHeight;
                        }

                        if(thisQuad.GPU)
                         {
                             thisQuad.verticesGPUList[thisQuad.id8_1]  = thisQuad.GPUX*2/ss2d.Stage2D.stageHeight;
                             thisQuad.verticesGPUList[thisQuad.id8_2]  = thisQuad.GPUY*2/ss2d.Stage2D.stageHeight;

                             thisQuad.verticesGPUList[thisQuad.id8_3]  = thisQuad.verticesGPUList[thisQuad.id8_1];
                             thisQuad.verticesGPUList[thisQuad.id8_4]  = thisQuad.verticesGPUList[thisQuad.id8_2];
                             thisQuad.verticesGPUList[thisQuad.id8_5]  = thisQuad.verticesGPUList[thisQuad.id8_1];
                             thisQuad.verticesGPUList[thisQuad.id8_6]  = thisQuad.verticesGPUList[thisQuad.id8_2];
                             thisQuad.verticesGPUList[thisQuad.id8_7]  = thisQuad.verticesGPUList[thisQuad.id8_1];
                             thisQuad.verticesGPUList[thisQuad.id8_8]  = thisQuad.verticesGPUList[thisQuad.id8_2];
                         }


                         thisQuad.vertices[thisQuad.id8_1]  = thisQuad.leftUpPoint.x;
                         thisQuad.vertices[thisQuad.id8_2]  = thisQuad.leftUpPoint.y;
                         thisQuad.vertices[thisQuad.id8_3]  = thisQuad.rightUpPoint.x;
                         thisQuad.vertices[thisQuad.id8_4]  = thisQuad.rightUpPoint.y;
                         thisQuad.vertices[thisQuad.id8_5]  = thisQuad.rightDownPoint.x;
                         thisQuad.vertices[thisQuad.id8_6]  = thisQuad.rightDownPoint.y;
                         thisQuad.vertices[thisQuad.id8_7]  = thisQuad.leftDownPoint.x;
                         thisQuad.vertices[thisQuad.id8_8]  = thisQuad.leftDownPoint.y;


                         thisQuad.jointList[thisQuad.id8_1] = thisQuad.m_textureID;
                         thisQuad.jointList[thisQuad.id8_2] = thisQuad.m_textureID;
                         thisQuad.jointList[thisQuad.id8_3] = thisQuad.m_textureID;
                         thisQuad.jointList[thisQuad.id8_4] = thisQuad.m_textureID;
                         thisQuad.jointList[thisQuad.id8_5] = thisQuad.m_textureID;
                         thisQuad.jointList[thisQuad.id8_6] = thisQuad.m_textureID;
                         thisQuad.jointList[thisQuad.id8_7] = thisQuad.m_textureID;
                         thisQuad.jointList[thisQuad.id8_8] = thisQuad.m_textureID;


                        if(thisQuad.isVertexColour)
                        {
                            var vr=thisQuad.m_r * thisQuad.m_alpha;
                            var vg=thisQuad.m_g * thisQuad.m_alpha;
                            var vb=thisQuad.m_b * thisQuad.m_alpha;
                            var va=thisQuad.m_a * thisQuad.m_alpha;

                            thisQuad.verticesColor[thisQuad.id16_1]  = vr *thisQuad.m_leftUpR;
                            thisQuad.verticesColor[thisQuad.id16_2]  = vg *thisQuad.m_leftUpG;
                            thisQuad.verticesColor[thisQuad.id16_3]  = vb *thisQuad.m_leftUpB;
                            thisQuad.verticesColor[thisQuad.id16_4]  = va *thisQuad.m_leftUpA;

                            thisQuad.verticesColor[thisQuad.id16_5]  = vr *thisQuad.m_rightUpR;
                            thisQuad.verticesColor[thisQuad.id16_6]  = vg *thisQuad.m_rightUpG;
                            thisQuad.verticesColor[thisQuad.id16_7]  = vb *thisQuad.m_rightUpB;
                            thisQuad.verticesColor[thisQuad.id16_8]  = va *thisQuad.m_rightUpA;

                            thisQuad.verticesColor[thisQuad.id16_9]  = vr *thisQuad.m_rightDownR;
                            thisQuad.verticesColor[thisQuad.id16_10] = vg *thisQuad.m_rightDownG;
                            thisQuad.verticesColor[thisQuad.id16_11] = vb *thisQuad.m_rightDownB;
                            thisQuad.verticesColor[thisQuad.id16_12] = va *thisQuad.m_rightDownA;

                            thisQuad.verticesColor[thisQuad.id16_13] = vr *thisQuad.m_leftDownR;
                            thisQuad.verticesColor[thisQuad.id16_14] = vg *thisQuad.m_leftDownG;
                            thisQuad.verticesColor[thisQuad.id16_15] = vb *thisQuad.m_leftDownB;
                            thisQuad.verticesColor[thisQuad.id16_16] = va *thisQuad.m_leftDownA;

                        }else
                        {
                             thisQuad.verticesColor[thisQuad.id16_1]  = 1.0;
                             thisQuad.verticesColor[thisQuad.id16_2]  = 1.0;
                             thisQuad.verticesColor[thisQuad.id16_3]  = 1.0;
                             thisQuad.verticesColor[thisQuad.id16_4]  = 1.0

                             thisQuad.verticesColor[thisQuad.id16_5]  = 1.0;
                             thisQuad.verticesColor[thisQuad.id16_6]  = 1.0;
                             thisQuad.verticesColor[thisQuad.id16_7]  = 1.0;
                             thisQuad.verticesColor[thisQuad.id16_8]  = 1.0;

                             thisQuad.verticesColor[thisQuad.id16_9]  = 1.0;
                             thisQuad.verticesColor[thisQuad.id16_10] = 1.0;
                             thisQuad.verticesColor[thisQuad.id16_11] = 1.0;
                             thisQuad.verticesColor[thisQuad.id16_12] = 1.0;

                             thisQuad.verticesColor[thisQuad.id16_13] = 1.0;
                             thisQuad.verticesColor[thisQuad.id16_14] = 1.0;
                             thisQuad.verticesColor[thisQuad.id16_15] = 1.0;
                             thisQuad.verticesColor[thisQuad.id16_16] = 1.0;
                        }
                    }
                    else
                    {

                        thisQuad.vertices[thisQuad.id8_1] = 0;
                        thisQuad.vertices[thisQuad.id8_2] = 0;
                        thisQuad.vertices[thisQuad.id8_3] = 0;
                        thisQuad.vertices[thisQuad.id8_4] = 0;
                        thisQuad.vertices[thisQuad.id8_5] = 0;
                        thisQuad.vertices[thisQuad.id8_6] = 0;
                        thisQuad.vertices[thisQuad.id8_7] = 0;
                        thisQuad.vertices[thisQuad.id8_8] = 0;
                    }
                    thisQuad.dispatchEvent(ss2d.Event.ENTER_FRAME);
                }
                this.shader.upDataShader(this);
                ss2d.Stage2D.gl.bindBuffer(ss2d.Stage2D.gl.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer);
                //上传顶点索引数据并且开始绘制,绘制类型为三角形,长度,类型为短整形,间隔为0
                //upload vertex index data and draw elements.
                ss2d.Stage2D.gl.drawElements(ss2d.Stage2D.gl.TRIANGLES, 6 * this.maxQuadNum, ss2d.Stage2D.gl.UNSIGNED_SHORT, 0);
            }
        }
    );
})();
(function()
{
    /**
     * Sprite  显示容器类，只能用于嵌套MovieClip,Sprite可以互相嵌套。
     * <br />演示地址:http://sirius2d.com/demos/d_4/
     * @class
     */
    ss2d.Sprite = Class
    (
        /** @lends ss2d.Sprite.prototype */
        {
            Extends:ss2d.Scene,
            m_width : 1,
            m_height : 1,
            m_scaleX : 1,
            m_scaleY : 1,
            m_skewX : 0,
            m_skewY : 0,
            m_pivotX : 0,
            m_pivotY : 0,
            m_rotation : 0,
            m_visible : true,
            m_parent : null,
            m_mouseEnabled : false,
            m_userData : null,
            m_center:false,
            m_forceCenter:false,
            m_quad:null,
            m_displayerlist:null,
            group:null,
            initialize : function()
            {
                this.init();
            },

            init:function()
            {
                this.m_displayerlist=[];
                this.group=new ss2d.Group();
            },

            /**
             * 销毁所有元素
             * dispose
             */
            dispose : function()
            {
                this.group.dispose();
                for(var i=0;i<this.m_displayerlist.length;i++)
                {
                    this.removeChild(this.m_displayerlist[i]);
                    this.m_displayerlist[i]=null;
                }
                this.m_displayerlist=null;
            },

            /**
             * 添加显示对象
             * add display object
             * @param child
             */
            addChild:function(child)
            {
                if(child instanceof ss2d.Sprite)
                {
                    this.m_displayerlist.push(child);
                    child.group.setParentGroup(this.group);
                    child.setParent(this);
                }else if(child instanceof ss2d.MovieClip)
                {
                    this.m_displayerlist.push(child);
                    this.group.addChild(child.m_quad);
                }

            },

            /**
             * 移除显示对象
             * remove display object
             * @param child
             */
            removeChild:function(child)
            {
                this.m_displayerlist.splice(this.m_displayerlist.indexOf(child),1);
                child.group.clearParentGroup();
                child.setParent(null);
            },

            /**
             * 重绘
             * paint
             */
            paint : function()
            {
                for(var i=0;i < this.m_displayerlist.length;i++)
                {
                    var scene = this.m_displayerlist[i];
                    scene.dispatchEvent(ss2d.Event.ENTER_FRAME);
                    scene.paint();
                }
            },

            getQuadsUnderPoint : function(x, y)
            {
                var quads = null;
                for(var i = this.m_displayerlist.length - 1;i >= 0; i--)
                {

                        quads=this.m_displayerlist[i].getQuadsUnderPoint(x,y);
                        if(quads!=null)
                        {
                            return quads;
                        }

                }
                return quads;
            },


            /**
             * 获取对象的X轴位置
             * get X
             * @returns {ss2d.Group._x|*|ss2d.Transform._x|ss2d.DisplayObject._x|number|ss2d.MovieClip._x}
             */
            getX : function() {  return this.group._x;},

            /**
             * 设置对象的X轴位置
             * set X
             * @param value
             */
            setX : function(value){ this.group._x = value; this.group.isRedraw = true; },

            /**
             * 获取对象的Y轴位置
             * get Y
             * @returns {ss2d.Group._y|*|ss2d.Transform._y|ss2d.DisplayObject._y|number|ss2d.MovieClip._y}
             */
            getY : function() {  return this.group._y;},

            /**
             * 设置对象Y轴位置
             * set Y
             * @param value
             */
            setY : function(value){ this.group._y = value; this.group.isRedraw = true; },

            /**
             * 获取对象宽度
             * get width
             * @returns {number|ss2d.File._width|ss2d.DisplayObject._width|ss2d.MovieClip._width|_width|*}
             */
            getWidth : function() {  return this.group.m_width;},

            /**
             * 设置对象宽度
             * set width
             * @param value
             */
            setWidth : function(value){ this.group.m_width = value; this.group.isRedraw = true;},

            /**
             * 获取对象高度
             * get height
             * @returns {number|ss2d.File._height|ss2d.DisplayObject._height|ss2d.MovieClip._height|_height|*}
             */
            getHeight : function() {  return this.group.m_height;},

            /**
             * 设置对象的高度
             * set height
             * @param value
             */
            setHeight : function(value){ this.group.m_height = value; this.group.isRedraw = true; },

            /**
             * 获取对象的X轴比例
             * get scale X
             * @returns {number|ss2d.Group._scaleX|ss2d.Transform._scaleX|ss2d.DisplayObject._scaleX|_scaleX|*}
             */
            getScaleX : function() {  return this.group.m_scaleX;},

            /**
             * 设置对象的X轴比例
             * set scale X
             * @param value
             */
            setScaleX : function(value){ this.group.m_scaleX = value; this.group.isRedraw = true; },

            /**
             * 获取对象的Y轴比例
             * get scale Y
             * @returns {number|ss2d.Group._scaleY|ss2d.Transform._scaleY|ss2d.DisplayObject._scaleY|_scaleY|*}
             */
            getScaleY : function() {  return this.group.m_scaleY;},

            /**
             * 设置对象的Y轴比例
             * set scale Y
             * @param value
             */
            setScaleY : function(value){ this.group.m_scaleY = value; this.group.isRedraw = true; },

            /**
             * 获取对象的X轴倾斜值
             * get skew X
             * @returns {number|ss2d.Group._skewX|ss2d.DisplayObject._skewX|_skewX|*}
             */
            getSkewX : function() {  return this.group.m_skewX;},

            /**
             * 设置对象的X轴倾斜值
             * set skew X
             * @param value
             */
            setSkewX : function(value){ this.group.m_skewX = value; this.group.isRedraw = true; },

            /**
             * 获取对象的Y轴倾斜值
             * get skew Y
             * @returns {number|ss2d.Group._skewY|ss2d.DisplayObject._skewY|_skewY|*}
             */
            getSkewY : function() {  return this.group.m_skewY;},

            /**
             * 设置对象的Y轴倾斜值
             * set skew Y
             * @param value
             */
            setSkewY : function(value){ this.group.m_skewY = value; this.group.isRedraw = true; },

            /**
             * 获取对象的角度
             * get angle
             * @returns {number|ss2d.Group._rotation|ss2d.DisplayObject._rotation|_rotation|*}
             */
            getRotation : function() {  return this.group.m_rotation;},

            /**
             * 设置对象的角度
             * set angle
             * @param value
             */
            setRotation : function(value){ this.group.m_rotation = value; this.group.isRedraw = true; },

            /**
             * 获取对象的可见性
             * get visibility
             * @returns {boolean}
             */
            getVisible : function() {  return this.m_visible;},

            /**
             * 设置对象的可见性
             * set visibility
             * @param value
             */
            setVisible : function(value){ this.m_visible = value;},

            /**
             * 获取对象的上级
             * get parent
             * @returns {null}
             */
            getParent : function() {  return this.m_parent;},

            /**
             * 设置对象的上级
             * set parent
             * @param value
             */
            setParent : function(value){ this.m_parent = value; },

            /**
             * 获取对象的鼠标监测状态
             * get a boolean value that indicates whether the mouse event is listened
             * @returns {boolean}
             */
            getMouseEnabled : function() {  return this.m_mouseEnabled;},

            /**
             * 设置对象的鼠标监测状态
             * set a boolean value that indicates whether the mouse event is listened
             * @param value
             */
            setMouseEnabled : function(value){ this.m_mouseEnabled = value; },

            /**
             * 存储用户数据
             * get user data
             * @returns {null}
             */
            getUserData : function() {  return this.m_userData;},

            /**
             * 设置用户零时数据
             * set user data
             * @param value
             */
            setUserData : function(value){ this.m_userData = value; }

        }
    );
})();
(function()
{
    /**
     * MovieClip 影片剪辑类,不建议多用,一般用于显示测试,后处理,单个大背景,如果显示数量很多建议用Scene
     * <br />movie clip class It's used for test or post-processing with a single image  Use scene class for more elements
     * <br /> 演示地址:http://sirius2d.com/demos/d_10/
     * @class
     */
    ss2d.MovieClip = Class
    (
        /** @lends ss2d.MovieClip.prototype */
        {
            Extends:ss2d.Scene,

            x : 0,
            y : 0,
            m_r : 1,
            m_g : 1,
            m_b : 1,
            m_a : 1,
            m_width : 1,
            m_height : 1,
            m_parent : null,
            m_mouseEnabled : false,
            m_userData : null,
            m_center:false,
            m_forceCenter:false,
            m_quad:null,

            initialize : function(textureData)
            {
            	ss2d.MovieClip.Super.call(this);
            	this.init(textureData);
            },

            init:function(textureData)
            {
                this.displayerlist=[];

                this.glScissorX=0.0;
                this.glScissorY=0.0;
                this.glScissorWidth=ss2d.Stage2D.canvas.width;
                this.glScissorHeight=ss2d.Stage2D.canvas.height;
                this.quadList=[];
                //对象池最大数量
                //the maximum amount of quad pool
                this.maxQuadNum = 1;
                this.m_indexList = new Uint16Array(this.maxQuadNum * 6);
                this.m_jointList = new Float32Array(this.maxQuadNum * 8);
                this.m_verticesGPUList=new Float32Array(this.maxQuadNum * 8);
                this.m_verticesList = new Float32Array(this.maxQuadNum * 8);
                this.m_uvList = new Float32Array(this.maxQuadNum * 8);
                this.m_colorList = new Float32Array(this.maxQuadNum * 16);
                this.m_texture = textureData;
                if(textureData instanceof Array)
                {
                    this.m_isJoint = true;
                    this.shader = new ss2d.ShaderJoint();
                }else
                {
                    this.shader = ss2d.Stage2D.shader;
                }

                this.m_sfactor = ss2d.Stage2D.gl.ONE;
                this.m_dfactor = ss2d.Stage2D.gl.ONE_MINUS_SRC_ALPHA;

                //创建对象池元素
                // create elements of the quad pool
                for(var i = 0; i < this.maxQuadNum; i++)
                {
                    this.quadList.push(new ss2d.Quad(i, this.m_texture,this.m_verticesList, this.m_uvList, this.m_colorList, this.m_jointList,this.m_indexList,this.m_verticesGPUList));
                };
                
                this.m_quad=this.applyQuad(true);
                this.showQuad(this.m_quad);

                //初始化GPU加速缓存
                //initialize GPU buffer
                this.verticesGPUBuffer=ss2d.Stage2D.gl.createBuffer();
                //初始化拼接色信息
                //initialize joint buffer
                this.verticesJointBuffer = ss2d.Stage2D.gl.createBuffer();
                //从gl申请一个顶点颜色信息缓存数组
                //register a vertex color buffer array
                this.verticesColorBuffer = ss2d.Stage2D.gl.createBuffer();
                //从gl申请一个顶点坐标信息缓存数组
                //register a vertex pos buffer array
                this.vertexPositionBuffer = ss2d.Stage2D.gl.createBuffer();
                //从gl申请一个UV的缓存数组
                //register a UV buffer array
                this.vertexTextureUvdBuffer = ss2d.Stage2D.gl.createBuffer();
                //申请一个顶点索引的缓存数组
                //register a vertex index buffer array
                this.vertexIndexBuffer = ss2d.Stage2D.gl.createBuffer();
            },

            /**
             * 检测对象与坐标点的碰撞
             * <br />collision detection between the object and a point
             * @param x
             * @param y
             * @returns {boolean}
             */
            hitTestPoint : function(x, y)
            {
                var point=this.absCentre();
                var distanceX = Math.abs(point.x-x);
                var distanceY = Math.abs(point.y-y);
                if (distanceX <= this.getWidth() / 2 &&
                    distanceY <= this.getHeight()/ 2)
                {
                    return true;
                }
                return false
            },

            /**
             * 检测对象与对象的碰撞
             * <br />collision detection between 2 objects
             * @param child
             * @returns {boolean}
             */
            hitTestObject : function(child)
            {
                var pointA=this.absCentre();
                var pointB=child.absCentre();
                var distanceX = Math.abs(pointA.x - pointB.x);
                var distanceY = Math.abs(pointA.y - pointB.y);
                if (distanceX <= this.getWidth() / 2 + this.getWidth() / 2 &&
                    distanceY <= child.getHeight() / 2 + child.getHeight() / 2)
                {
                    return true;
                }
                return false
            },

            /**
             * 检测对象与范围的碰撞
             * <br />collision detection between the object and an area
             * @param x
             * @param y
             * @param radius
             * @returns {boolean}
             */
            hitTestRoundness : function(x, y, radius)
            {
                var point=this.absCentre();
                var distanceX = Math.abs(point.x - x);
                var distanceY = Math.abs(point.y - y);
                var distanceZ = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
                if(distanceZ <= radius)
                {
                    return true;
                }
                return false
            },

            /**
             * 设置纹理ID
             * set texture ID
             * @param value
             */
            setTextureID : function(value)
            {
                this.m_quad.setTextureID(value);
            },

            /**
             * 获取纹理ID
             * get texture ID
             * @return {Number}
             */
            getTextureID : function()
            {
                return this.m_quad.getTextureID();
            },

            /**
             * 设置纹理片段名称
             * set tile name
             * @param name {String}
             */
            setTileName : function(name)
            {
                this.m_quad.setTileName(name);
            },

            /**
             * 设置纹理片段ID
             * set tile ID
             * @param id {number}
             */
            setTileId : function(id)
            {
                this.m_quad.setTileId(id);
            },

            /**
             * 指示动画播放的帧率.
             * set FPS of the animation
             * @param	frame 动画播放的帧率.
             */
            setAnimationSpeed : function(frame)
            {
                this.m_quad.setAnimationSpeed(frame);
            },

            /**
             * 设置影片播放的片段
             * play the clip of animation with the right name
             * @param name
             * @returns {number}
             */
            queryName : function(name)
            {
                this.m_quad.queryName(name);
            },

            /**
             * 设置是否循环播放
             * loop the animation
             * @param value
             */
            loop : function(value)
            {
                this.m_quad.loop(value);
            },

            /**
             * 开始播放动画
             * play the animation
             */
            play : function()
            {
                this.m_quad.play();
            },

            /**
             * 停止播放动画
             * stop the animation
             */
            stop : function()
            {
                this.m_quad.stop();
            },

            /**
             * 设置是否倒播动画
             * roll back the animation
             * @param value
             */
            rollbackAnimation:function(value)
            {
                this.m_quad.rollbackAnimation(value);
            },

            /**
             * 从指定的帧播放动画
             * skip to a frame and play the animation
             * @param value
             */
            gotoAndPlay : function(value)
            {
                this.m_quad.gotoAndPlay(value);
            },

            /**
             * 从指定的帧停止播放动画
             * skip to a frame and stop the animation
             * @param value
             */
            gotoAndStop : function(value)
            {
                this.m_quad.gotoAndStop(value);
            },

            /**
             * 添加帧脚本
             * add frame script
             * @param value
             */
            addFrameScript : function(value)
            {
                this.m_quad.addFrameScript(value);
            },

            /**
             * 删除帧脚本
             * delete frame script
             * @param value
             */
            removeFrameScript : function(value)
            {
                this.m_quad.removeFrameScript(value);
            },

            /**
             * 删除所有帧脚本
             * delete all frame scripts
             */
            removeAllFrameScript : function()
            {
                this.m_quad.removeAllFrameScript();
            },

            /**
             * 设置帧延迟
             * set frame delay
             * @param value
             */
            frameDelay:function(value)
            {
                this.m_quad.frameDelay(value);
            },

            /**
             * 获取对象中心对齐状态
             * get a boolean value that indicates whether the object is aligned center
             * @returns {*|boolean}
             */
            getCenter : function() {  return this.m_quad.getCenter();},

            /**
             * 设置对象中心对齐状态
             * make the object align center
             * @param value
             */
            setCenter : function(value){
                this.m_quad.setCenter(value);
            },

            /**
             * 获取动画当前播放帧
             * get the current frame of the animation
             * @returns {number}
             */
            getCurrentFrame:function()
            {
                return this.m_quad.getCurrentFrame();
            },

            /**
             * 获取动画片段总长度
             * get the length of an animation clip
             * @returns {number}
             */
            getTotalFrame:function()
            {
                return this.m_quad.getTotalFrame();
            },


            /**
             * 设置对象切片X轴偏移位置
             * set the tile offset X
             * @param value {number}
             */
            setTileXOffset : function(value)
            {
                this.m_quad.setTileXOffset(value);
            },

            /**
             * 获取对象切片X轴偏移位置
             * get the tile offset X
             * @returns {*}
             */
            getTileXOffset : function()
            {
                return this.m_quad.getTileXOffset();
            },

            /**
             * 设置对象切片Y轴偏移量
             * set the tile offset Y
             * @param value {number}
             */
            setTileYOffset : function(value)
            {
                this.m_quad.setTileYOffset(value);
            },

            /**
             * 获取对象切片Y轴偏移量
             * get the tile offset Y
             * @returns {*}
             */
            getTileYOffset : function()
            {
                return this.m_quad.setTileYOffset();
            },

            /**
             * 设置对象切片宽度偏移量
             * set the width offset of a tile
             * @param value {number}
             */
            setTileWidthOffset : function(value)
            {
                this.m_quad.setTileWidthOffset(value);
            },

            /**
             * 获取对象切片宽度偏移量
             * get the width offset of a tile
             * @returns {*}
             */
            getTileWidthOffset : function()
            {
                return this.m_quad.setTileWidthOffset();
            },

            /**
             * 设置切片高度偏移量
             * set the height offset of a tile
             * @param value {number}
             */
            setTileHeightOffset : function(value)
            {
                this.m_quad.setTileHeightOffset(value);
            },

            /**
             * 获取对象切片高度偏移量
             * get the height offset of a tile
             * @returns {*}
             */
            getTileHeightOffset : function()
            {
                return this.m_quad.setTileHeightOffset();
            },

            /**
             * 销毁
             * remove the quad
             */
            dispose : function()
            {
                this.m_quad.dispose();
            },

            /**
             * 获得绝对中心点
             * get the absolute center of the quad
             */
            absCentre:function()
            {
                return this.m_quad.absCentre();
            },

            /**
             * 设置融合矩阵
             * set the transform matrix
             * @param value
             */
            setTransform:function(value)
            {
                this.m_quad.setTransform(value);
            },

            /**
             * 获取融合矩阵
             * get the transform matrix
             * @returns {*}
             */
            getTransform:function()
            {
                return this.m_quad.getTransform();
            },


            /**
             * 重绘
             * paint
             */
            paint : function()
            {
              //  ss2d.Stage2D.gl.scissor(this.glScissorX,this.glScissorY,this.glScissorWidth,this.glScissorHeight);
                ss2d.Stage2D.gl.blendFunc(this.m_sfactor,this.m_dfactor);

                //开始渲染批处理对象
                //paint quads from quad list
                var len=this.quadList.length;
                for(var i = 0;i < len; i++)
                {
                    var thisQuad=this.quadList[i];
                    if(thisQuad.scene != null && thisQuad.m_visible && thisQuad.m_isActivate)
                    {
                        if(thisQuad.m_isPlaying)
                        {
                            thisQuad.m_targetTime = new Date().getTime();
                            if (thisQuad.m_targetTime - thisQuad.m_lastTime >= thisQuad.m_delay)
                            {
                                thisQuad.m_lastTime = thisQuad.m_targetTime;
                                thisQuad.updateFrame(true);

                            }
                        }
                        if(thisQuad.isRedraw)
                        {

                            thisQuad.isRedraw = false;

                            //强制转换成笛卡尔第四象限坐标系
                            //transform into Cartesian coordinates (fourth quadrant)
                            thisQuad.m_quadMatrixUtil.setX(thisQuad.x * 2 / ss2d.Stage2D.stageHeight);
                            thisQuad.m_quadMatrixUtil.setY(thisQuad.y * 2 /ss2d.Stage2D.stageHeight);

                            thisQuad.m_quadMatrixUtil.setRotation(thisQuad.m_rotation);

                            thisQuad.m_quadMatrixUtil.upDateMatrixData(
                                (-thisQuad.m_pivotX + thisQuad.m_framePivotX) * thisQuad.m_scaleX * 2 / ss2d.Stage2D.stageHeight,
                                (-thisQuad.m_pivotY + thisQuad.m_framePivotY) * thisQuad.m_scaleY * 2 / ss2d.Stage2D.stageHeight,
                                thisQuad.m_scaleX * (thisQuad.m_frameWidth / thisQuad.m_Texture.width),
                                thisQuad.m_scaleY * (thisQuad.m_frameHeight / thisQuad.m_Texture.height),
                                thisQuad.m_skewX, thisQuad.m_skewY);

                            //更新面板的矩阵信息
                            //update matrix of the panel
                            thisQuad.m_quadMatrixUtil.upDateMatrix(thisQuad.m_transform == null);

                            if(thisQuad.m_transform != null)
                            {
                                thisQuad.m_quadMatrixUtil.getMatrix2D().rawData = thisQuad.m_quadMatrixUtil.getMatrix2D().add3x3(thisQuad.m_quadMatrixUtil.getMatrix2D().rawData, thisQuad.m_transform.rawData);
                                thisQuad.m_quadMatrixUtil.upDateRaw();
                            }


                            thisQuad.frameXDivWidth = thisQuad.m_frameX / thisQuad.m_Texture.width;
                            thisQuad.frameYDivHeight = thisQuad.m_frameY / thisQuad.m_Texture.height;
                            thisQuad.frameWidthDivWidth =thisQuad.m_frameWidth / thisQuad.m_Texture.width;
                            thisQuad.frameHeightDivHeight = thisQuad.m_frameHeight / thisQuad.m_Texture.height;

                            thisQuad.textureUV[thisQuad.id8_1] =  thisQuad.frameXDivWidth;
                            thisQuad.textureUV[thisQuad.id8_2] = -thisQuad.frameYDivHeight;
                            thisQuad.textureUV[thisQuad.id8_3] =  thisQuad.frameWidthDivWidth + thisQuad.frameXDivWidth;
                            thisQuad.textureUV[thisQuad.id8_4] = -thisQuad.frameYDivHeight;
                            thisQuad.textureUV[thisQuad.id8_5] =  thisQuad.frameWidthDivWidth + thisQuad.frameXDivWidth;
                            thisQuad.textureUV[thisQuad.id8_6] = -thisQuad.frameHeightDivHeight - thisQuad.frameYDivHeight;
                            thisQuad.textureUV[thisQuad.id8_7] =  thisQuad.frameXDivWidth;
                            thisQuad.textureUV[thisQuad.id8_8] = -thisQuad.frameHeightDivHeight - thisQuad.frameYDivHeight;
                        }

                        if(!thisQuad.isAnimationMatrix)
                        {
                            thisQuad.frameXDivWidth = thisQuad.m_frameX / thisQuad.m_Texture.width;
                            thisQuad.frameYDivHeight = thisQuad.m_frameY / thisQuad.m_Texture.height;
                            thisQuad.frameWidthDivWidth =thisQuad.m_frameWidth / thisQuad.m_Texture.width;
                            thisQuad.frameHeightDivHeight = thisQuad.m_frameHeight / thisQuad.m_Texture.height;

                            thisQuad.textureUV[thisQuad.id8_1] =  thisQuad.frameXDivWidth;
                            thisQuad.textureUV[thisQuad.id8_2] = -thisQuad.frameYDivHeight;
                            thisQuad.textureUV[thisQuad.id8_3] =  thisQuad.frameWidthDivWidth + thisQuad.frameXDivWidth;
                            thisQuad.textureUV[thisQuad.id8_4] = -thisQuad.frameYDivHeight;
                            thisQuad.textureUV[thisQuad.id8_5] =  thisQuad.frameWidthDivWidth + thisQuad.frameXDivWidth;
                            thisQuad.textureUV[thisQuad.id8_6] = -thisQuad.frameHeightDivHeight - thisQuad.frameYDivHeight;
                            thisQuad.textureUV[thisQuad.id8_7] =  thisQuad.frameXDivWidth;
                            thisQuad.textureUV[thisQuad.id8_8] = -thisQuad.frameHeightDivHeight - thisQuad.frameYDivHeight;
                        }

                        if(thisQuad.GPU)
                        {
                            thisQuad.verticesGPUList[thisQuad.id8_1]  = thisQuad.GPUX*2/ss2d.Stage2D.stageHeight;
                            thisQuad.verticesGPUList[thisQuad.id8_2]  = thisQuad.GPUY*2/ss2d.Stage2D.stageHeight;

                            thisQuad.verticesGPUList[thisQuad.id8_3]  = thisQuad.verticesGPUList[thisQuad.id8_1];
                            thisQuad.verticesGPUList[thisQuad.id8_4]  = thisQuad.verticesGPUList[thisQuad.id8_2];
                            thisQuad.verticesGPUList[thisQuad.id8_5]  = thisQuad.verticesGPUList[thisQuad.id8_1];
                            thisQuad.verticesGPUList[thisQuad.id8_6]  = thisQuad.verticesGPUList[thisQuad.id8_2];
                            thisQuad.verticesGPUList[thisQuad.id8_7]  = thisQuad.verticesGPUList[thisQuad.id8_1];
                            thisQuad.verticesGPUList[thisQuad.id8_8]  = thisQuad.verticesGPUList[thisQuad.id8_2];
                        }


                        thisQuad.vertices[thisQuad.id8_1]  = thisQuad.leftUpPoint.x;
                        thisQuad.vertices[thisQuad.id8_2]  = thisQuad.leftUpPoint.y;
                        thisQuad.vertices[thisQuad.id8_3]  = thisQuad.rightUpPoint.x;
                        thisQuad.vertices[thisQuad.id8_4]  = thisQuad.rightUpPoint.y;
                        thisQuad.vertices[thisQuad.id8_5]  = thisQuad.rightDownPoint.x;
                        thisQuad.vertices[thisQuad.id8_6]  = thisQuad.rightDownPoint.y;
                        thisQuad.vertices[thisQuad.id8_7]  = thisQuad.leftDownPoint.x;
                        thisQuad.vertices[thisQuad.id8_8]  = thisQuad.leftDownPoint.y;

                        thisQuad.jointList[thisQuad.id8_1] = thisQuad.m_textureID;
                        thisQuad.jointList[thisQuad.id8_2] = thisQuad.m_textureID;
                        thisQuad.jointList[thisQuad.id8_3] = thisQuad.m_textureID;
                        thisQuad.jointList[thisQuad.id8_4] = thisQuad.m_textureID;
                        thisQuad.jointList[thisQuad.id8_5] = thisQuad.m_textureID;
                        thisQuad.jointList[thisQuad.id8_6] = thisQuad.m_textureID;
                        thisQuad.jointList[thisQuad.id8_7] = thisQuad.m_textureID;
                        thisQuad.jointList[thisQuad.id8_8] = thisQuad.m_textureID;

                        //设置UV信息,因为我们希望用户输入实际的像素坐标而不是UV比例,所以把实际像素转换为实际的比例,下面分别设置了最大的
                        //采样区域和偏移坐标注意有的地方只有一个值,那是因为前面的值为0，我只是把它删除了而已

                        if(thisQuad.isVertexColour)
                        {
                            var vr=thisQuad.m_r * thisQuad.m_alpha;
                            var vg=thisQuad.m_g * thisQuad.m_alpha;
                            var vb=thisQuad.m_b * thisQuad.m_alpha;
                            var va=thisQuad.m_a * thisQuad.m_alpha;

                            thisQuad.verticesColor[thisQuad.id16_1]  = vr *thisQuad.m_leftUpR;
                            thisQuad.verticesColor[thisQuad.id16_2]  = vg *thisQuad.m_leftUpG;
                            thisQuad.verticesColor[thisQuad.id16_3]  = vb *thisQuad.m_leftUpB;
                            thisQuad.verticesColor[thisQuad.id16_4]  = va *thisQuad.m_leftUpA

                            thisQuad.verticesColor[thisQuad.id16_5]  = vr *thisQuad.m_rightUpR;
                            thisQuad.verticesColor[thisQuad.id16_6]  = vg *thisQuad.m_rightUpG;
                            thisQuad.verticesColor[thisQuad.id16_7]  = vb *thisQuad.m_rightUpB;
                            thisQuad.verticesColor[thisQuad.id16_8]  = va *thisQuad.m_rightUpA;

                            thisQuad.verticesColor[thisQuad.id16_9]  = vr *thisQuad.m_rightDownR;
                            thisQuad.verticesColor[thisQuad.id16_10] = vg *thisQuad.m_rightDownG;
                            thisQuad.verticesColor[thisQuad.id16_11] = vb *thisQuad.m_rightDownB;
                            thisQuad.verticesColor[thisQuad.id16_12] = va *thisQuad.m_rightDownA;

                            thisQuad.verticesColor[thisQuad.id16_13] = vr *thisQuad.m_leftDownR;
                            thisQuad.verticesColor[thisQuad.id16_14] = vg *thisQuad.m_leftDownG;
                            thisQuad.verticesColor[thisQuad.id16_15] = vb *thisQuad.m_leftDownB;
                            thisQuad.verticesColor[thisQuad.id16_16] = va *thisQuad.m_leftDownA;

                        }else
                        {
                            thisQuad.verticesColor[thisQuad.id16_1]  = 1.0;
                            thisQuad.verticesColor[thisQuad.id16_2]  = 1.0;
                            thisQuad.verticesColor[thisQuad.id16_3]  = 1.0;
                            thisQuad.verticesColor[thisQuad.id16_4]  = 1.0

                            thisQuad.verticesColor[thisQuad.id16_5]  = 1.0;
                            thisQuad.verticesColor[thisQuad.id16_6]  = 1.0;
                            thisQuad.verticesColor[thisQuad.id16_7]  = 1.0;
                            thisQuad.verticesColor[thisQuad.id16_8]  = 1.0;

                            thisQuad.verticesColor[thisQuad.id16_9]  = 1.0;
                            thisQuad.verticesColor[thisQuad.id16_10] = 1.0;
                            thisQuad.verticesColor[thisQuad.id16_11] = 1.0;
                            thisQuad.verticesColor[thisQuad.id16_12] = 1.0;

                            thisQuad.verticesColor[thisQuad.id16_13] = 1.0;
                            thisQuad.verticesColor[thisQuad.id16_14] = 1.0;
                            thisQuad.verticesColor[thisQuad.id16_15] = 1.0;
                            thisQuad.verticesColor[thisQuad.id16_16] = 1.0;
                        }
                    }
                    else
                    {

                        thisQuad.vertices[thisQuad.id8_1] = 0;
                        thisQuad.vertices[thisQuad.id8_2] = 0;
                        thisQuad.vertices[thisQuad.id8_3] = 0;
                        thisQuad.vertices[thisQuad.id8_4] = 0;
                        thisQuad.vertices[thisQuad.id8_5] = 0;
                        thisQuad.vertices[thisQuad.id8_6] = 0;
                        thisQuad.vertices[thisQuad.id8_7] = 0;
                        thisQuad.vertices[thisQuad.id8_8] = 0;
                    }
                    thisQuad.dispatchEvent(ss2d.Event.ENTER_FRAME);
                }
                this.shader.upDataShader(this);
                ss2d.Stage2D.gl.bindBuffer(ss2d.Stage2D.gl.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer);
                //上传顶点索引数据并且开始绘制,绘制类型为三角形,长度,类型为短整形,间隔为0
                //upload vertex index data and draw elements.
                ss2d.Stage2D.gl.drawElements(ss2d.Stage2D.gl.TRIANGLES, 6 * this.maxQuadNum, ss2d.Stage2D.gl.UNSIGNED_SHORT, 0);
            },

            /**
             * 获取对象颜色值
             * get the color of the object
             */
            getColor : function(){
                this.m_quad.getColor();
            },

            /**
             * 设置对象颜色值
             * set the color of the object
             * @param value
             */
            setColor : function(value)
            {
               this.m_quad.setColor(value);
            },

            /**
             * 设置顶点颜色
             * set RGBA of vertexes
             * @param index 顶点的索引ID
             * @param r 红色通道
             * @param g 绿色通道
             * @param b 蓝色通道
             * @param a 透明通道
             */
            setVertexColour:function(index,r,g,b,a)
            {
                this.m_quad.setVertexColour(index,r,g,b,a);

            },

            /**
             * 获取对象红色通道值
             * get red channel of the object
             * @returns {*|number}
             */
            getR : function() {  return this.m_quad.getR();},

            /**
             * 设置对象红色通道值
             * set red channel of the object
             * @param value
             */
            setR : function(value){ this.m_quad.setR(value) },

            /**
             * 获取对象绿色通道值
             * get green channel of the object
             * @returns {*|number}
             */
            getG : function() {  return this.m_quad.getG();},

            /**
             * 设置对象绿色通道值
             * set green channel of the object
             * @param value
             */
            setG : function(value){ this.m_quad.setG(value)},

            /**
             * 获取对象蓝色通道值
             * get blue channel of the object
             * @returns {*|number}
             */
            getB : function() {  return this.m_quad.getB();},

            /**
             * 设置对象蓝色通道值
             * set blue channel of the object
             * @param value
             */
            setB : function(value){ this.m_quad.setB(value)},

            /**
             * 获取对象像素透明值
             * get alpha channel of the object
             * @returns {*|number}
             */
            getA : function() {  return this.m_quad.getA();},

            /**
             * 设置对象像素透明值
             * set alpha channel of the object
             * @param value
             */
            setA : function(value){ this.m_quad.setA(value)},

            /**
             * 获取对象X轴位置
             * get X of the object
             * @returns {*|number|int}
             */
            getX : function() {  return this.m_quad.getX();},

            /**
             * 设置对象的X轴位置
             * set X of the object
             * @param value
             */
            setX : function(value){ this.m_quad.setX(value); },

            /**
             * 获取对象的Y轴位置
             * get Y of the object
             * @returns {*|number|int}
             */
            getY : function() {  return this.m_quad.getY();},

            /**
             * 设置对象的Y轴位置
             * set Y of the object
             * @param value
             */
            setY : function(value){ this.m_quad.setY(value); },

            /**
             * 获取对象的宽度
             * get width of the object
             * @returns {*|int|number}
             */
            getWidth : function() {  return this.m_quad.getWidth();},

            /**
             * 设置对象的宽度
             * set width of the object
             * @param value
             */
            setWidth : function(value){ this.m_quad.setWidth(value);},

            /**
             * 获取对象的高度
             * get height of the object
             * @returns {*|int|number}
             */
            getHeight : function() {  return this.m_quad.getHeight();},

            /**
             * 设置对象的高度
             * set height of the object
             * @param value
             */
            setHeight : function(value){ this.m_quad.setHeight(value); },

            /**
             * 获取对象的X轴比例
             * get scale X of the object
             * @returns {*|number}
             */
            getScaleX : function() {  return this.m_quad.getScaleX();},

            /**
             * 设置对象的X轴比例
             * set scale X of the object
             * @param value
             */
            setScaleX : function(value){ this.m_quad.setScaleX(value); },

            /**
             * 获取对象的Y轴比例
             * get scale Y of the object
             * @returns {*|number}
             */
            getScaleY : function() {  return this.m_quad.getScaleY();},

            /**
             * 设置对象的Y轴比例
             * set scale Y of the object
             * @param value
             */
            setScaleY : function(value){ this.m_quad.setScaleY(value); },

            /**
             * 获取对象的X轴倾斜值
             * get skew X of the object
             * @returns {*|number}
             */
            getSkewX : function() {  return this.m_quad.getSkewX();},

            /**
             * 设置对象的X轴倾斜值
             * set skew X of the object
             * @param value
             */
            setSkewX : function(value){ this.m_quad.setSkewX(value); },

            /**
             * 获取对象的Y轴倾斜值
             * get skew Y of the object
             * @returns {*|number}
             */
            getSkewY : function() {  return this.m_quad.getSkewY();},

            /**
             * 设置对象的Y轴倾斜值
             * set skew Y of the object
             * @param value
             */
            setSkewY : function(value){ this.m_quad.setSkewY(value); },

            /**
             * 获取对象的角度
             * get the angle of the object
             * @returns {*|number}
             */
            getRotation : function() {  return this.m_quad.getRotation();},

            /**
             * 设置对象的角度
             * set the angle of the object
             * @param value
             */
            setRotation : function(value){ this.m_quad.setRotation(value); },

            /**
             * 获取对象的透明度 (RGBA*透明度)
             * get the alpha of the object (RGBA*alpha)
             * @returns {*|number}
             */
            getAlpha : function() {  return this.m_quad.getAlpha();},

            /**
             * 设置对象的透明度 (RGBA*透明度)
             * set the alpha of the object (RGBA*alpha)
             * @param value
             */
            setAlpha : function(value){ this.m_quad.setAlpha(value)},

            /**
             * 获取对象的可见性
             * get the visibility of the object
             * @returns {*|boolean}
             */
            getVisible : function() {  return this.m_quad.getVisible();},

            /**
             * 设置对象的可见性
             * set the visibility of the object
             * @param value
             */
            setVisible : function(value){ this.m_quad.setVisible(value);},

            /**
             * 获取对象的刷新属性
             * get a boolean value that indicates whether the object is redrawn
             * @returns {*|boolean}
             */
            getIsRedraw : function() {  return this.m_quad.getIsRedraw();},

            /**
             * 设置对象的刷新属性
             * set a boolean value that indicates whether the object is redrawn
             * @param value
             */
            setIsRedraw : function(value){ this.m_quad.setIsRedraw(value); },

            /**
             * 获取对象的上级
             * get the parent of the object
             * @returns {null}
             */
            getParent : function() {  return this.m_parent;},

            /**
             * 设置对象的上级
             * set the parent of the object
             * @param value
             */
            setParent : function(value){ this.m_parent = value; },

            /**
             * 获取对象鼠标监测状态
             * get a boolean value that indicates whether the mouse event is listened
             * @returns {*|boolean}
             */
            getMouseEnabled : function() {  return this.m_quad.getMouseEnabled();},

            /**
             * 设置对象鼠标监测状态
             * set a boolean value that indicates whether the mouse event is listened
             * @param value
             */
            setMouseEnabled : function(value){ this.m_quad.setMouseEnabled(value); },

            /**
             * 获取用户数据
             * get the user data
             * @returns {null}
             */
            getUserData : function() {  return this.m_userData;},

            /**
             * 设置用户数据
             * set the user data
             * @param value
             */
            setUserData : function(value){ this.m_userData = value; },

            /**
             * 获取对象强制中心对齐状态 (无视动画偏移量的影响)
             * get a boolean value that indicates whether the object is aligned center (ignore the offsets of animations)
             * @returns {*|boolean}
             */
            getForceCenter : function() {  return this.m_quad.getForceCenter();},

            /**
             * 设置对象强制中心对齐状态 (无视动画偏移量的影响)
             * set a boolean value that indicates whether the object is aligned center (ignore the offsets of animations)
             * @param value
             */
            setForceCenter : function(value){ this.m_quad.setForceCenter(value); }

        }
    );
})();
/**
 * GPU文本系统,测试阶段
 */
(function()
{
    /**
     * TextField 文字处理类，目前为测试版本。
     * <br />演示地址:http://sirius2d.com/demos/d_42/
     * @class
     */
    ss2d.TextField = Class
    (

        /** @lends ss2d.TextField.prototype */
        {
            Extends:ss2d.MovieClip,
            m_textCanvas:null,
            m_textStyle:null,
            m_texture:null,
            m_text:null,
            m_size:30,
            m_typeface:"黑体",
            m_textColor:"rgb(200,0,0)",
            m_alpha:null,
            m_font:"",
            m_width:null,
            m_height:null,
            initialize : function(w,h)
            {
                this.m_alpha=1;
                this.m_textCanvas=document.createElement("canvas");
                if(w)
                {
                    this.m_textCanvas.width=w;
                    this.m_width=w;
                }else
                {
                    this.m_textCanvas.width=256;
                    this.m_width=256;
                }
                if(h)
                {
                    this.m_textCanvas.height=h;
                    this.m_height=h;
                }else
                {
                    this.m_textCanvas.height=256;
                    this.m_height=256;
                }

                this.m_textStyle=this.m_textCanvas.getContext("2d");
                this.m_textStyle.textBaseline="middle";
                this.m_textStyle.font=this.m_size+"px "+this.m_typeface;
                this.m_texture=new ss2d.Texture(this.m_textCanvas);
                this.init(this.m_texture);
            },

            /**
             * 设置字体大小
             * @param value
             */
            setFontSize:function(value)
            {
                this.m_size=value;
                this.m_font=this.m_size+"px "+this.m_typeface;

            },

            /**
             * 获得字体大小
             * @return {Number}
             */
            getFontSize:function()
            {
                return this.m_size;
            },

            /**
            *设置文本内容
            *@param text {String}
            *@param x {number}
            *@param y {number}
            */
            setText:function(text,x,y)
            {
                this.m_textStyle.clearRect(0,0,this.m_width,this.m_height);
                this.m_textStyle.font=this.m_font;
                this.m_textStyle.globalAlpha=this.m_alpha;
                this.m_textStyle.fillStyle=this.m_textColor;
                this.m_text=text;
                if(x)
                {
                    this.m_textStyle.fillText(text,x,0+this.m_size/2);
                }else if(x&&y)
                {
                    this.m_textStyle.fillText(text,x,y+this.m_size/2);
                }else
                {
                    this.m_textStyle.fillText(text,0,0+this.m_size/2);
                }

                this.m_texture.dispose();
                this.m_texture.newCanvas(this.m_textCanvas,0x2901,0x2901,0x2601,0x2601);
            },

            /**
             * 获得文字内容
             * @return {*}
             */
            getText:function()
            {
              return this.m_text;
            },


            
            /**
            *设置文本字体
            *@param font {String}
            */
            setTypefac:function(font)
            {
                this.m_typeface = font;
                this.m_font=this.m_size+"px "+this.m_typeface;

            },

            /**
             * 获得文本字体
             * @return {String}
             */
            getTypefac:function()
            {
                return this.m_typeface;
            },

            /**
            *设置字体颜色
            *@param fontStyle {String}
            */
            setColor:function(r,g,b)
            {
                this.m_textColor = "rgb("+parseInt(255*r)+","+parseInt(255*g)+","+parseInt(255*b)+")";

            },

            /**
            *设置文本透明度
            *@param alpha {number}
            */  
            setAlpha:function(alpha)
            {
                this.m_alpha=alpha;

            },

            /**
             * 获得文本透明度
             * @return {*|Number}
             */
            getAlpha:function()
            {
                return this.m_alpha;
            }
        }
    );
})();
(function()
{

    ss2d.QuadFrame = Class
    (
        {
            /**
             * 帧名称
             * frame name
             */
            name : "",
            /**
             * 帧X坐标
             * frame X
             */
            x : 0,
            /**
             * 帧Y坐标
             * frame Y
             */
            y : 0,
            /**
             * 帧宽度
             * frame width
             */
            width : 0,
            /**
             * 帧高度
             * frame height
             */
            height : 0,
            /**
             * 帧X偏移坐标
             * frame offset X
             */
            frameX : 0,
            /**
             * 帧Y偏移坐标
             * frame offset Y
             */
            frameY : 0,
            /**
             * 帧最大宽度
             * frame maximum width
             */
            frameWidth : 0,
            /**
             * 帧最大高度
             * frame maximum height
             */
            frameHeight : 0
        }
    );

    /**
     *
     * @type {*}
     */
    ss2d.QuadData = Class
    (
        {
            /**
             * quad名称
             * quad name
             */
            name:null,
            /**
             * quad帧数组
             * quad frame list
             */
            quadFrameLst:null,

            ////////////////////////////////////////////////////////////////////////////
            //  constructor
            ////////////////////////////////////////////////////////////////////////////

            initialize : function()
            {
                quadFrameLst = [];
            }
        }
    );

    /**
     *
     * @type {*}
     */
    ss2d.QuadResource = Class
    (
        {
            quadDataList:null,

            ////////////////////////////////////////////////////////////////////////////
            //  constructor
            ////////////////////////////////////////////////////////////////////////////

            initialize : function()
            {
                quadDataList = [];
            }
        }
    );


    /**
     * Quad 引擎中最强大的显示对象类，它不能独立存在，只能基于Scene对象池的子对象存在，Scene代表一次渲染，而它可以在一次渲染中完成多次渲染的效果。
     * <br /> 演示地址:http://sirius2d.com/demos/d_12/
     * @class
     */
    ss2d.Quad = Class
    (
        /** @lends ss2d.Quad.prototype */
        {
            Extends : ss2d.DisplayObject,
            /**
             * 设置启用动画矩阵更新 (当动画宽高一样时，可禁用来提高效率)
             * <br />set a boolean value that indicates whether the animation matrix updates
             * disable this function when the width and height of a animation are the same to optimize efficiency
             * @param boolean value
             */
            isAnimationMatrix:true,

            /**
             * 是否启用顶点着色功能,如果对象没有颜色改变需求关闭此开关可提高性能
             * @param boolean value
             */
            isVertexColour:true,



            m_Texture:null,
            m_isJoint : false,
            m_frameX : 0,
            m_frameY : 0,
            m_frameWidth : 0,
            m_frameHeight : 0,
            m_tileOffsetX:0,
            m_tileOffsetY:0,
            m_tileOffsetWidth:0,
            m_tileOffsetHeight:0,
            m_framePivotX : 0,
            m_framePivotY : 0,
            m_isActivate : false,
            m_loop : false,
            m_quadMatrixUtil : null,

            cacheTime:0,
            compareTime:0,

            m_leftUpR:1,
            m_leftUpG:1,
            m_leftUpB:1,
            m_leftUpA:1,

            m_leftDownR:1,
            m_leftDownG:1,
            m_leftDownB:1,
            m_leftDownA:1,

            m_rightUpR:1,
            m_rightUpG:1,
            m_rightUpB:1,
            m_rightUpA:1,

            m_rightDownR:1,
            m_rightDownG:1,
            m_rightDownB:1,
            m_rightDownA:1,

            scene:null,

            m_id : -1,
            id8_1:0,
            id8_2:0,
            id8_3:0,
            id8_4:0,
            id8_5:0,
            id8_6:0,
            id8_7:0,
            id8_8:0,

            id16_1:0,
            id16_2:0,
            id16_3:0,
            id16_4:0,
            id16_5:0,
            id16_6:0,
            id16_7:0,
            id16_8:0,
            id16_9:0,
            id16_10:0,
            id16_11:0,
            id16_12:0,
            id16_13:0,
            id16_14:0,
            id16_15:0,
            id16_16:0,

            m_textureID : 0,
            texture : null,
            textureUV : null,
            verticesGPUList:null,
            vertices : null,
            verticesColor : null,
            m_isPlaying : false,
            m_transform : null,
            m_lastTime :new Date().getTime(),
            m_targetTime : 0,
            m_delay : 0,
            m_tileId : 0,
            _tileName : null,
            m_currentFrame : 0,
            m_totalFrame : 1,

            frameList :null,
            jointList : null,
            indexList:null,
            rightDownPoint : null,
            rightUpPoint : null,
            leftDownPoint : null,
            leftUpPoint : null,
            m_framedelay:-1,
            m_isRollbackAnimation:false,
            frameXDivWidth:0,
            frameYDivHeight:0,
            frameWidthDivWidth:0,
            frameHeightDivHeight:0,
            //id 索引ID,texture 纹理对象,vertices 顶点位置,textureUV 纹理UV,jointList 拼接信息,verticesGPUList GPU加速数组
            initialize : function(id, texture, vertices, textureUV, verticesColor, jointList, indexList,verticesGPUList)
            {
                ss2d.Quad.Super.call(this);

                this._absPoint=new ss2d.Point();
                this.frameList=[];
                this.m_isJoint = false;
                this.m_isActivate = false;
                if(texture instanceof Array) this.m_isJoint = true;
                this.setID(id);

                this.texture = texture;
                this.vertices = vertices;
                this.verticesGPUList=verticesGPUList;
                this.textureUV = textureUV;
                this.verticesColor = verticesColor;
                this.jointList = jointList;
                this.indexList = indexList;

                this.rightDownPoint = new ss2d.Point(0, 0);
                this.rightUpPoint = new ss2d.Point(0, 0);
                this.leftDownPoint = new ss2d.Point(0, 0);
                this.leftUpPoint = new ss2d.Point(0, 0);
                this.m_quadMatrixUtil = new ss2d.QuadMatrixUtil();
                this.setTextureID(0);


                //设置切片的宽度和高度,设置默认值为纹理的宽度和高度
                //set the clip width and height (default: width and height of the texture)


                if(this.m_isJoint)
                {
                    this.m_frameWidth = texture[this.m_textureID].width+this.m_tileOffsetWidth;
                    this.m_frameHeight = texture[this.m_textureID].height+this.m_tileOffsetHeight;
                }
                else
                {
                    this.m_frameWidth = texture.width;
                    this.m_frameHeight = texture.height;
                }

                this.initIndexs();
                this.initVerticeData();
                this.setTileId(0);
                this.gotoAndPlay(1);
            },


            /**
             * 设置顶点颜色 (0-左上，1-左下，2-右上，3-右下)
             * <br />set RGBA of vertexes (0-top left, 1-bottom left, 2-top right, 3-bottom right)
             * @param index 顶点的索引ID
             * @param r 红色通道
             * @param g 绿色通道
             * @param b 蓝色通道
             * @param a 透明通道
             */
            setVertexColour:function(index,r,g,b,a)
            {
                switch(index)
                {
                    case 0:
                        this.m_leftUpR=r;
                        this.m_leftUpG=g;
                        this.m_leftUpB=b;
                        this.m_leftUpA=a;
                        break;
                    case 1:
                        this.m_leftDownR=r;
                        this.m_leftDownG=g;
                        this.m_leftDownB=b;
                        this.m_leftDownA=a;
                        break;
                    case 2:
                        this.m_rightUpR=r;
                        this.m_rightUpG=g;
                        this.m_rightUpB=b;
                        this.m_rightUpA=a;
                        break;
                    case 3:
                        this.m_rightDownR=r;
                        this.m_rightDownG=g;
                        this.m_rightDownB=b;
                        this.m_rightDownA=a;
                        break;
                }
                this.isRedraw=true
            },


            /**
             * 获得对象宽度
             * <br />get the width of the object
             * @returns {number}
             */
            getWidth : function()
            {
                var realFrameWidth = this.m_frameWidth;
                return Math.abs(realFrameWidth * this.m_scaleX);
            },

            /**
             * 设置对象宽度
             * <br />set width of the object
             * @param value
             */
            setWidth : function(value)
            {
                var realFrameWidth = this.m_frameWidth;
                this.m_scaleX = value / realFrameWidth;
                this.isRedraw = true;
            },

            /**
             * 获取对象高度
             * <br />get height of the object
             * @returns {number}
             */
            getHeight : function()
            {
                var realFrameHeight = this.m_frameHeight;
                return Math.abs(realFrameHeight * this.m_scaleY);
            },

            /**
             * 设置对象高度
             * <br />set height of the object
             * @param value
             */
            setHeight : function(value)
            {
                var realFrameHeight = this.m_frameHeight;
                this.m_scaleY = value / realFrameHeight;
                this.isRedraw = true;
            },

            /**
             * 获取对象居中状态
             * <br />get a boolean value that indicates whether the object is aligned center
             * @returns {ss2d.DisplayObject._center|*}
             */
            getCenter : function() {  return this.m_center;},

            /**
             * 设置对象居中状态
             * <br />set a boolean value that indicates whether the object is aligned center
             * @param boolean value
             */
            setCenter : function(value){ this.m_center = value;this.updateFrame();},

            initIndexs:function()
            {
                var mul5=this.m_id * 5;
                var mul4=this.m_id * 4;
                this.indexList[this.m_id + mul5 + 0] = 0 + mul4;
                this.indexList[this.m_id + mul5 + 1] = 1 + mul4;
                this.indexList[this.m_id + mul5 + 2] = 2 + mul4;
                this.indexList[this.m_id + mul5 + 3] = 0 + mul4;
                this.indexList[this.m_id+  mul5 + 4] = 2 + mul4;
                this.indexList[this.m_id + mul5 + 5] = 3 + mul4;

            },

            initVerticeData : function()
            {
                var mul8=this.m_id * 8;
                for(var i=0;i<8;i++)
                {
                    this.verticesGPUList[mul8+i] = 0;
                    this.vertices[mul8+i] = 0;
                    this.textureUV[mul8+i] = 0;
                }

                var mul16=this.m_id * 16;
                for(var j=0;j<16;j++)
                {
                    this.verticesColor[mul16+j] = 0;
                }
            },

            /**
             * 设置纹理ID
             * <br />set texture ID
             * @param value
             */
            setTextureID : function(value)
            {
                this.m_textureID = value;
                this.m_Texture = this.m_isJoint ? this.texture[this.m_textureID] : this.texture;
                //设置4个顶点的初始化坐标
                //set pos of the 4 vertexes
                //ss2d.log(this.m_isJoint + ", "+ this.m_textureID + ", " + this.m_Texture);
                this.leftUpPoint.x = -1.0 * this.m_Texture.width / ss2d.Stage2D.stageHeight;
                this.leftUpPoint.y = -1.0 * this.m_Texture.height / ss2d.Stage2D.stageHeight;

                this.rightUpPoint.x = 1.0 * this.m_Texture.width / ss2d.Stage2D.stageHeight;
                this.rightUpPoint.y = -1.0 * this.m_Texture.height / ss2d.Stage2D.stageHeight;

                this.leftDownPoint.x = -1.0 * this.m_Texture.width / ss2d.Stage2D.stageHeight;
                this.leftDownPoint.y = 1.0 * this.m_Texture.height / ss2d.Stage2D.stageHeight;

                this.rightDownPoint.x = 1.0 * this.m_Texture.width / ss2d.Stage2D.stageHeight;
                this.rightDownPoint.y = 1.0 * this.m_Texture.height / ss2d.Stage2D.stageHeight;

                this.m_quadMatrixUtil.clear();

                //添加到面板里
                //add them into the panel
                this.m_quadMatrixUtil.addItem(this.leftUpPoint);
                this.m_quadMatrixUtil.addItem(this.leftDownPoint);
                this.m_quadMatrixUtil.addItem(this.rightUpPoint);
                this.m_quadMatrixUtil.addItem(this.rightDownPoint);

                this.setTileId(0);
            },

            /**
             * 获取纹理ID
             * <br />get texture ID
             * @return {Number}
             */
            getTextureID : function()
            {
                return this.m_textureID;
            },

            /**
             * 设置纹理片段名称
             * <br />set tile name
             * @param name {String}
             */
            setTileName : function(name)
            {

                this._tileName = name;
                if(this.m_Texture.quadResource != null)
                {
                    this.setTileId(this.queryName(this._tileName));
                }
            },

            /**
             * 设置纹理片段ID
             * <br />set tile ID
             * @param id {number}
             */
            setTileId : function(id)
            {

                if(this.m_Texture.quadResource!=null)
                {
                    this.m_tileId = id;
                    this.m_currentFrame = 0;
                    this.m_totalFrame = this.m_Texture.quadResource.quadDataList[this.m_tileId].quadFrameLst.length;
                    this.updateFrame(false);
                }
            },

            /**
             * 获取动画当前播放帧
             * <br />get the current frame of the animation
             * @returns {number}
             */
            getCurrentFrame:function()
            {
                return this.m_currentFrame;
            },

            /**
             * 获取动画片段总长度
             * <br />get the length of the animation
             * @returns {number}
             */
            getTotalFrame:function()
            {
                return this.m_totalFrame;
            },


            /**
             * 设置纹理片段X坐标偏移位置
             * <br />set tile offset X
             * @param value {number}
             */
            setTileXOffset : function(value)
            {
                this.m_tileOffsetX = value;
                this.isRedraw=true;
            },

            /**
             * 获取纹理片段X坐标偏移位置
             * <br />get tile offset X
             * @param value {number}
             */
            getTileXOffset : function(value)
            {
                return this.m_tileOffsetX;
            },

            /**
             * 设置纹理片段Y坐标偏移位置
             * <br />set tile offset Y
             * @param value {number}
             */
            setTileYOffset : function(value)
            {
                this.m_tileOffsetY = value;
                this.isRedraw=true;
            },

            /**
             * 获取纹理片段Y坐标偏移位置
             * <br />get tile offset Y
             * @param value {number}
             */
            getTileYOffset : function(value)
            {
                return this.m_tileOffsetY;
            },

            /**
             * 设置纹理片段宽度偏移位置
             * <br />set tile width offset
             * @param value {number}
             */
            setTileWidthOffset : function(value)
            {
                this.m_tileOffsetWidth = value;
                this.isRedraw=true;
            },

            /**
             * 获取纹理片段宽度偏移位置
             * <br />get tile width offset
             * @param value {number}
             */
            getTileWidthOffset : function(value)
            {
                return this.m_tileOffsetWidth;
            },

            /**
             * 设置纹理片段高度偏移位置
             * <br />set tile height offset
             * @param value {number}
             */
            setTileHeightOffset : function(value)
            {
                this.m_tileOffsetHeight = value;
                this.isRedraw=true;
            },

            /**
             * 获取纹理片段高度偏移位置
             * <br />get tile height offset
             * @param value {number}
             */
            getTileHeightOffset : function(value)
            {
                return this.m_tileOffsetHeight;
            },

            /**
             * 指示动画播放的帧率.
             * <br />set FPS of the animation
             * @param	frame 动画播放的帧率.
             */
            setAnimationSpeed : function(frame)
            {
                this.m_delay = 1000.0 / frame;

            },




            getIsActivate : function()
            {
                return this.m_isActivate;
            },


            /**
             * 设置顶点位置 (index: 0-左上，1-左下，2-右上，3-右下)
             * <br />set vertexes pos (index: 0-top left, 1-bottom left, 2-top right, 3-bottom right)
             * @param index
             * @param x
             * @param y
             */
            setIndexVertex:function(index,x,y)
            {
                this.isRedraw=true;
                this.m_quadMatrixUtil.getPoint(index).x=x* this.m_Texture.width/ ss2d.Stage2D.stageHeight;
                this.m_quadMatrixUtil.getPoint(index).y=y * this.m_Texture.height/ ss2d.Stage2D.stageHeight;
            },

            /**
             * 获取顶点位置 (index: 0-左上，1-左下，2-右上，3-右下)
             * <br />get vertexes pos (index: 0-top left, 1-bottom left, 2-top right, 3-bottom right)
             * @param index
             * @param x
             * @param y
             */
            getIndexVertex:function(index)
            {
               return new ss2d.Point(this.m_quadMatrixUtil.getPoint(index).x/this.m_Texture.width*ss2d.Stage2D.stageHeight,this.m_quadMatrixUtil.getPoint(index).y/this.m_Texture.width*ss2d.Stage2D.stageHeight);
            },


            /**
             * 获得顶点数据
             * <br />index to the right vertex
             * @param index
             */
            getVertex : function(index)
            {

                switch(index)
                {
                    case 0:
                        return this.leftUpPoint;

                    case 1:
                        return this.leftDownPoint;

                    case 2:
                        return this.rightUpPoint;

                    case 3:
                        return this.rightDownPoint;

                }
            },


            queryName : function(name)
            {
                var frameDataList;
                if(this.m_isJoint)
                    frameDataList = this.texture[this.m_textureID].quadResource.quadDataList;
                else
                    frameDataList = this.texture.quadResource.quadDataList;

                for(var i=0;i < frameDataList.length; i++)
                {
                    if(frameDataList[i].name == name)
                    {
                        return i;
                    }
                }
                return 0;
            },

            /**
             * 设置是否循环播放
             * <br />loop animation or not
             * @param boolean value
             */
            loop : function(value)
            {
                this.m_loop = value;
            },

            /**
             * 播放动画
             * <br />play animation
             */
            play : function()
            {
                this.m_isPlaying = true;
                this.m_lastTime = new Date().getTime();
            },

            /**
             * 停止播放动画
             * <br />stop animation
             */
            stop : function()
            {
                this.m_isPlaying = false;
            },


            /**
             * 跳转到指定的帧并且播放动画
             * <br />skip to a frame and play the animation
             * @param value
             */
            gotoAndPlay : function(value)
            {
                this.m_currentFrame = value - 1;
                this.m_isPlaying = true;
                this.m_lastTime = new Date().getTime();
            },

            /**
             * 跳转到指定的帧并停止动画
             * <br />skip to a frame and stop the animation
             * @param value
             */
            gotoAndStop : function(value)
            {
                this.m_isPlaying = false;
                this.m_currentFrame = value-1;
                this.updateFrame(false);
            },

            /**
             * 添加帧脚本
             * <br />add frame script
             */
            addFrameScript : function(value)
            {
                this.frameList.push(value);
            },

            /**
             * 删除帧脚本
             * <br />delete frame script
             */
            removeFrameScript : function(value)
            {
                var index = this.frameList.indexOf(value);
                this.frameList.splice(index,1);
            },

            /**
             * 删除所有帧函数
             * <br />delete all frame scripts
             */
            removeAllFrameScript : function()
            {
                for(var i = 0; i < this.frameList.length; i++)
                {
                    this.frameList.splice(i,1);
                    this.frameList[i] = null;
                }
                this.frameList = [];
            },

            /**
             * 设置是否倒播动画
             * <br />set a boolean value that indicates whether the animation is rolled back
             * @param boolean value
             */
            rollbackAnimation:function(value)
            {
                this.m_isRollbackAnimation=value;
            },


            /**
             * 设置帧延迟
             * <br />set frame delay
             * @param value
             */
            frameDelay:function(value)
            {
                this.m_framedelay=value;
            },

            //更新帧信息
            updateFrame : function(flag)
            {

                if(this.m_Texture.quadResource != null)
                {

                    if(flag)
                    {

                        if(this.m_framedelay>0)
                        {
                            this.m_framedelay--;
                        }else
                        {
                            if(this.m_isRollbackAnimation)
                            {
                                this.m_currentFrame--;
                                for(var i=0;i < this.frameList.length;i++)
                                {
                                    if(this.frameList[i].frame == this.m_currentFrame+1)
                                    {
                                        var f=this.frameList[i].callback;
                                        if (f.handleEvent) {f.handleEvent(this); }
                                        else { f(this); }
                                    }
                                }
                            }else
                            {
                                for(var i=0;i < this.frameList.length;i++)
                                {
                                    if(this.frameList[i].frame == this.m_currentFrame+1)
                                    {
                                        var f=this.frameList[i].callback;
                                        if (f.handleEvent) {f.handleEvent(this); }
                                        else { f(this); }
                                    }
                                }
                                this.m_currentFrame++;
                            }
                        }
                    }
                    if(this.m_currentFrame >= this.m_totalFrame)
                    {
                        if(this.m_loop)
                        {
                            this.m_currentFrame = 0;
                        }
                        else
                        {
                            this.m_currentFrame = this.m_totalFrame - 1;
                        }
                    }else if(this.m_currentFrame<=-1)
                    {
                        if(this.m_loop)
                        {
                            this.m_currentFrame = this.m_totalFrame-1;
                        }
                        else
                        {
                            this.m_currentFrame = 0;
                        }
                    }
                    this.updateFrameData();
                }else
                {
                    this.m_frameX = this.m_tileOffsetX;
                    this.m_frameY = this.m_tileOffsetY;
                    if(this.m_isJoint)
                    {
                        this.m_frameWidth = this.m_Texture[this.m_textureID].width+this.m_tileOffsetWidth;
                        this.m_frameHeight = this.m_Texture[this.m_textureID].height+this.m_tileOffsetHeight;
                    }
                    else
                    {
                        this.m_frameWidth = this.m_Texture.width+this.m_tileOffsetWidth;
                        this.m_frameHeight = this.m_Texture.height+this.m_tileOffsetHeight;
                    }

                    if(this.m_center)
                    {

                        this.m_framePivotX = 0;
                        this.m_framePivotY = 0;
                    }
                    else
                    {
                        this.m_framePivotY = this.m_frameHeight / 2;
                        this.m_framePivotX = this.m_frameWidth / 2;
                    }
                }
            },

            //刷新绝对中心点
            upAbsPoint:function()
            {
                var minX=Math.min.apply(Math,[this.leftUpPoint.x,this.rightUpPoint.x,this.leftDownPoint.x,this.rightDownPoint.x])
                var minY=Math.min.apply(Math,[this.leftUpPoint.y,this.rightUpPoint.y,this.leftDownPoint.y,this.rightDownPoint.y])

                var maxX=Math.max.apply(Math,[this.leftUpPoint.x,this.rightUpPoint.x,this.leftDownPoint.x,this.rightDownPoint.x])
                var maxY=Math.max.apply(Math,[this.leftUpPoint.y,this.rightUpPoint.y,this.leftDownPoint.y,this.rightDownPoint.y])

                var absX=(minX+((maxX-minX)/2.0))*ss2d.Stage2D.stageHeight/2;
                var absY=(minY+((maxY-minY)/2.0))*ss2d.Stage2D.stageHeight/2;

                this._absPoint.x=absX+this.GPUX;
                this._absPoint.y=absY+this.GPUY;

            },

            /**
             * 获得绝对中心点
             * <br />get the absolute center point
             */
            absCentre:function()
            {
               this.upAbsPoint();
               return this._absPoint;
            },

            /**
             * 设置融合矩阵
             * <br />set transform matrix
             * @param value
             */
            setTransform:function(value)
            {
                this.m_transform=value;
            },

            /**
             * 获取融合矩阵
             * <br />get transform matrix
             * @returns {*}
             */
            getTransform:function()
            {
                return this.m_transform;
            },


            updateFrameData : function()
            {

                if(this.m_Texture.quadResource != null)
                {
                    var frameData = this.m_Texture.quadResource.quadDataList[this.m_tileId].quadFrameLst[this.m_currentFrame];
                    if (!frameData) return;
                    this.m_frameX = Number(frameData.x) + this.m_tileOffsetX;
                    this.m_frameY = Number(frameData.y) + this.m_tileOffsetY;
                    this.m_frameWidth = Number(frameData.width) + this.m_tileOffsetWidth;
                    this.m_frameHeight = Number(frameData.height) + this.m_tileOffsetHeight;

                    //设置动画的X偏移量,因为我们的裁切其实是以中心点开始的,所以需要加上切片的宽度的一半
                    if(this.m_forceCenter)
                    {
                        this.m_framePivotX = - Number(frameData.frameX);
                        this.m_framePivotY = - Number(frameData.frameY);
                    }else
                    {
                        if(this.m_center)
                        {
                            this.m_framePivotX = this.m_frameWidth / 2 - Number(frameData.frameX)-Number(frameData.frameWidth)/2;
                            this.m_framePivotY = this.m_frameHeight / 2 - Number(frameData.frameY)-Number(frameData.frameHeight)/2
                        }
                        else
                        {
                            this.m_framePivotX = this.m_frameWidth / 2 - Number(frameData.frameX);
                            this.m_framePivotY = this.m_frameHeight / 2 - Number(frameData.frameY);
                        }
                    }

                }

                if(this.isAnimationMatrix)
                this.isRedraw = true;
            },



            //启动
            launch : function()
            {
                this.m_isActivate = true;
            },

            /**
             * 销毁
             * <br /> dispose
             */
            dispose : function()
            {
                this.GPUX=0;
                this.GPUY=0;
                this.m_isPlaying = true;
                this.m_lastTime = 0.0;
                this.m_targetTime = 0.0;
                this.m_delay = 0.0;
                this.m_tileId = 0.0;
                this.m_userData = null;
                this.m_transform=null;
                this.m_currentFrame = 0.0;
                this.m_totalFrame = 1.0;
                this.m_visible=true;
                this.m_isActivate = false;
                this.m_parent = null;
                this.m_rotation = 0.0;
                this.m_frameX=0;
                this.m_frameY=0;
                this.m_scaleX = 1.0;
                this.m_scaleY = 1.0;
                this.m_skewX = 0.0;
                this.m_skewY = 0.0;
                this.m_pivotX = 0.0;
                this.m_pivotY = 0.0;
                this.GPU=false;
                this.GPUX=Number.MAX_VALUE;
                this.GPUY=Number.MAX_VALUE;
                this.x=Number.MAX_VALUE;
                this.y=Number.MAX_VALUE;
                this.m_r = 1;
                this.m_g = 1;
                this.m_b = 1;
                this.m_a = 1;
                this.m_alpha = 1;
                this.m_tileOffsetX = 0;
                this.m_tileOffsetY = 0;
                this.m_tileOffsetWidth = 0;
                this.m_tileOffsetHeight = 0;
                this.m_center=false;
                this.m_forceCenter=false;
                this.m_framePivotY = this.m_frameHeight / 2;
                this.m_framePivotX = this.m_frameWidth / 2;
                this.removeAllFrameScript();
                this.setTileId(0);
            },

            /**
             * 获得对应的场景
             * <br />get scene
             * @returns {null}
             */
            getScene:function()
            {
                return this.scene;
            },

            /**
             * 设置对应的场景
             * <br />set scene
             * @param value
             */
            setScene:function(value)
            {
                this.scene=value;
            },

            /**
             * 设置网格ID
             * <br />set mesh ID
             * @param value
             */
            setID:function(value)
            {
                this.m_id=value;
                var mul8=this.m_id * 8;
                this.id8_1 = mul8;
                this.id8_2 = mul8+1;
                this.id8_3 = mul8+2;
                this.id8_4 = mul8+3;
                this.id8_5 = mul8+4;
                this.id8_6 = mul8+5;
                this.id8_7 = mul8+6;
                this.id8_8 = mul8+7;

                var mul16=this.m_id * 16;
                this.id16_1=mul16;
                this.id16_2=mul16+1;
                this.id16_3=mul16+2;
                this.id16_4=mul16+3;
                this.id16_5=mul16+4;
                this.id16_6=mul16+5;
                this.id16_7=mul16+6;
                this.id16_8=mul16+7;
                this.id16_9=mul16+8;
                this.id16_10=mul16+9;
                this.id16_11=mul16+10;
                this.id16_12=mul16+11;
                this.id16_13=mul16+12;
                this.id16_14=mul16+13;
                this.id16_15=mul16+14;
                this.id16_16=mul16+15;
            },





            //重绘
            paint : function()
            {

                /*if(this.scene != null && this.visible && this.isActivate)
                {
                    if(this._isPlaying)
                    {
                        this._targetTime = new Date().getTime();
                        if (this._targetTime - this._lastTime >= this._delay)
                        {
                            this._lastTime = this._targetTime;
                            this.updateFrame(true);

                        }
                    }
                    if(this._isRedraw)
                    {

                        this._isRedraw = false;

                        //强制转换成笛卡尔第四象限坐标系
                        //transform into Cartesian coordinates (fourth quadrant)
                        this._quadMatrixUtil.setX(this._x * 2 / ss2d.Stage2D.stageHeight);
                        this._quadMatrixUtil.setY(this._y * 2 /ss2d.Stage2D.stageHeight);

                        this._quadMatrixUtil.setRotation(this.rotation);

                        this._quadMatrixUtil.upDateMatrixData(
                            (-this._pivotX + this._framePivotX) * this._scaleX * 2 / ss2d.Stage2D.stageHeight,
                            (-this._pivotY + this._framePivotY) * this._scaleY * 2 / ss2d.Stage2D.stageHeight,
                            this._scaleX * (this._frameWidth / this.mTexture.width),
                            this._scaleY * (this._frameHeight / this.mTexture.height),
                            this._skewX, this._skewY);

                        //更新面板的矩阵信息
                        //update matrix of the panel
                        this._quadMatrixUtil.upDateMatrix(this._transform == null);

                        if(this._transform != null)
                        {
                            this._quadMatrixUtil.getMatrix2D().rawData = this._quadMatrixUtil.getMatrix2D().add3x3(this._quadMatrixUtil.getMatrix2D().rawData, this._transform.rawData);
                            this._quadMatrixUtil.upDateRaw();
                        }
                    }

                    if(this.GPU)
                    {

                        this.verticesGPUList[this._id8_1]  = this.GPUX*2/ss2d.Stage2D.stageHeight;
                        this.verticesGPUList[this._id8_2]  = this.GPUY*2/ss2d.Stage2D.stageHeight;
                        this.verticesGPUList[this._id8_3]  = this.verticesGPUList[this._id8_1];
                        this.verticesGPUList[this._id8_4]  = this.verticesGPUList[this._id8_2];
                        this.verticesGPUList[this._id8_5]  = this.verticesGPUList[this._id8_1];
                        this.verticesGPUList[this._id8_6]  = this.verticesGPUList[this._id8_2];
                        this.verticesGPUList[this._id8_7]  = this.verticesGPUList[this._id8_1];
                        this.verticesGPUList[this._id8_8]  = this.verticesGPUList[this._id8_2];
                    }


                    this.vertices[this._id8_1]  = this.leftUpPoint.x;
                    this.vertices[this._id8_2]  = this.leftUpPoint.y;
                    this.vertices[this._id8_3]  = this.rightUpPoint.x;
                    this.vertices[this._id8_4]  = this.rightUpPoint.y;
                    this.vertices[this._id8_5]  = this.rightDownPoint.x;
                    this.vertices[this._id8_6]  = this.rightDownPoint.y;
                    this.vertices[this._id8_7]  = this.leftDownPoint.x;
                    this.vertices[this._id8_8]  = this.leftDownPoint.y;

                    this.jointList[this._id8_1] = this.textureID;
                    this.jointList[this._id8_2] = this.textureID;
                    this.jointList[this._id8_3] = this.textureID;
                    this.jointList[this._id8_4] = this.textureID;
                    this.jointList[this._id8_5] = this.textureID;
                    this.jointList[this._id8_6] = this.textureID;
                    this.jointList[this._id8_7] = this.textureID;
                    this.jointList[this._id8_8] = this.textureID;

                    //设置UV信息,因为我们希望用户输入实际的像素坐标而不是UV比例,所以把实际像素转换为实际的比例,下面分别设置了最大的
                    //采样区域和偏移坐标注意有的地方只有一个值,那是因为前面的值为0，我只是把它删除了而已

                    this._frameXDivWidth = this._frameX / this.mTexture.width;
                    this._frameYDivHeight = this._frameY / this.mTexture.height;
                    this._frameWidthDivWidth =this._frameWidth / this.mTexture.width;
                    this._frameHeightDivHeight = this._frameHeight / this.mTexture.height;

                    this.textureUV[this._id8_1] =  this._frameXDivWidth;
                    this.textureUV[this._id8_2] = -this._frameYDivHeight;
                    this.textureUV[this._id8_3] =  this._frameWidthDivWidth + this._frameXDivWidth;
                    this.textureUV[this._id8_4] = -this._frameYDivHeight;
                    this.textureUV[this._id8_5] =  this._frameWidthDivWidth + this._frameXDivWidth;
                    this.textureUV[this._id8_6] = -this._frameHeightDivHeight - this._frameYDivHeight;
                    this.textureUV[this._id8_7] =  this._frameXDivWidth;
                    this.textureUV[this._id8_8] = -this._frameHeightDivHeight - this._frameYDivHeight;

                    if(this.isVertexColour)
                    {
                         var vr=this._r * this._alpha;
                         var vg=this._g * this._alpha;
                         var vb=this._b * this._alpha;
                         var va=this._a * this._alpha;
                         this.verticesColor[this._id16_1]  = vr *this._leftUpR;
                         this.verticesColor[this._id16_2]  = vg *this._leftUpG;
                         this.verticesColor[this._id16_3]  = vb *this._leftUpB;
                         this.verticesColor[this._id16_4]  = va *this._leftUpA

                         this.verticesColor[this._id16_5]  = vr *this._rightUpR;
                         this.verticesColor[this._id16_6]  = vg *this._rightUpG;
                         this.verticesColor[this._id16_7]  = vb *this._rightUpB;
                         this.verticesColor[this._id16_8]  = va *this._rightUpA;

                         this.verticesColor[this._id16_9]  = vr *this._rightDownR;
                         this.verticesColor[this._id16_10] = vg *this._rightDownG;
                         this.verticesColor[this._id16_11] = vb *this._rightDownB;
                         this.verticesColor[this._id16_12] = va *this._rightDownA;

                         this.verticesColor[this._id16_13] = vr *this._leftDownR;
                         this.verticesColor[this._id16_14] = vg *this._leftDownG;
                         this.verticesColor[this._id16_15] = vb *this._leftDownB;
                         this.verticesColor[this._id16_16] = va *this._leftDownA;

                    }else
                    {
                        this.verticesColor[this._id16_1]  = 1.0;
                        this.verticesColor[this._id16_2]  = 1.0;
                        this.verticesColor[this._id16_3]  = 1.0;
                        this.verticesColor[this._id16_4]  = 1.0

                        this.verticesColor[this._id16_5]  = 1.0;
                        this.verticesColor[this._id16_6]  = 1.0;
                        this.verticesColor[this._id16_7]  = 1.0;
                        this.verticesColor[this._id16_8]  = 1.0;

                        this.verticesColor[this._id16_9]  = 1.0;
                        this.verticesColor[this._id16_10]  = 1.0;
                        this.verticesColor[this._id16_11] = 1.0;
                        this.verticesColor[this._id16_12] = 1.0;

                        this.verticesColor[this._id16_13] = 1.0;
                        this.verticesColor[this._id16_14] = 1.0;
                        this.verticesColor[this._id16_15] = 1.0;
                        this.verticesColor[this._id16_16] = 1.0;
                    }
                }
                else
                {

                    this.vertices[this._id8_1] = 0;
                    this.vertices[this._id8_2] = 0;
                    this.vertices[this._id8_3] = 0;
                    this.vertices[this._id8_4] = 0;
                    this.vertices[this._id8_5] = 0;
                    this.vertices[this._id8_6] = 0;
                    this.vertices[this._id8_7] = 0;
                    this.vertices[this._id8_8] = 0;
                }
                this.dispatchEvent(ss2d.Event.ENTER_FRAME);*/
            }
        }
    );
})();
(function()
{
    ss2d.ParticleCPU = Class
    (
        {
            quad:null,
            scaleXValue:0,
            scaleYValue:0,
            addR:0,
            addG:0,
            addB:0,
            addA:0,
            angleValue:0,
            rotationValue:0,
            speedValue:0,
            alphaValue:0,
            isStart:false,
            initialize : function(v_quad)
            {
                this.quad=v_quad;
                this.quad.GPU=true;
                this.quad.setCenter(true);
                this.quad.setVisible(false);
            },

            //绘制函数,核心功能
            paint:function(){
                //让角度加上旋转角度
                this.rotationValue += this.angleValue;

                //让粒子按照指定的速度和方向运动
                this.quad.GPUX+=Math.cos(this.rotationValue) * this.speedValue;
                this.quad.GPUY+=Math.sin(this.rotationValue) * this.speedValue;

                //this.quad.setX((this.quad.getX()+Math.cos(this.rotationValue) * this.speedValue));
                //this.quad.setY((this.quad.getY()+Math.sin(this.rotationValue) * this.speedValue));

                this.quad.setScaleX(this.quad.getScaleX()+this.scaleXValue);
                this.quad.setScaleY(this.quad.getScaleY()+this.scaleYValue);

                //所有属性加上某个值
                this.quad.setAlpha((this.quad.getAlpha()+this.alphaValue));
                this.quad.setR(this.quad.getR()+this.addR);
                this.quad.setG(this.quad.getG()+this.addG);
                this.quad.setB(this.quad.getB()+this.addB);
                this.quad.setA(this.quad.getA()+this.addA);

                //如果透明度小于0就清理粒子
                if (this.quad.getAlpha()<= 0)
                {
                    this.clear();
                }
            },


            //初始化粒子的所有状态
            show:function()
            {
                this.quad.setAlpha(1);
                this.quad.setScaleX(1);
                this.quad.setScaleY(1);
                this.quad.setR(1);
                this.quad.setG(1);
                this.quad.setB(1);
                this.quad.setA(1);
                this.quad.setVisible(true);
                this.isStart = true;
            },

            /**
             * 清理粒子
             */
            clear:function()
            {
                this.quad.setVisible(false);
                this.isStart = false;
            }
        }
    );
})();
(function()
{
    /**
     * ParticleEmittersCPU 粒子发射器,可用于发射任何Quad,通常在粒子，幻影，残影时用到。
     * <br /> 演示地址:http://sirius2d.com/demos/d_32/
     * @class
     */
    ss2d.ParticleEmittersCPU = Class
    (
        /** @lends ss2d.ParticleEmittersCPU.prototype */
        {
            isPlay:true,
            frameRun:null,
            list :null,
            run:function()
            {
                this.paint();
            },
            initialize : function(v_scene,v_value)
            {
                this.list=[];
                for (var i = 0; i < v_value; i++)
                {
                    var quad=v_scene.applyQuad();
                    v_scene.showQuad(quad);
                    quad.setVisible(false);
                    quad.loop(true);
                    quad.play();
                    this.list.push(new ss2d.ParticleCPU(quad));
                };
                this.frameRun=this.run.bind(this);
                ss2d.stage.addEventListener(ss2d.Event.ENTER_FRAME,this.frameRun);
            },

            /**
             * 销毁粒子发射器
             */
            dispose:function()
            {
                ss2d.stage.removeEventListener(ss2d.Event.ENTER_FRAME,this.frameRun);
                for(var i=0;i<this.list.length;i++)
                {
                    this.list[i]=null;
                }
                this.list=null;
                this.frameRun=null;
            },

            //刷新函数
            paint:function()
            {
                if(this.list)
                for(var j=0;j<this.list.length;j++)
                {
                    //如果粒子是启用状态
                    if(this.list[j].isStart)
                    {
                        //刷新粒子逻辑
                        this.list[j].paint();
                    }
                }
            },

            /**
             * 获得粒子
             * @return
             */
            sendParticle:function(x,y,v_particleStyle)
            {
                if(this.isPlay&&this.list)
                    for (var i = 0; i <this.list.length; i++)
                    {
                        //如果粒子未启动
                        if (this.list[i].isStart==false)
                        {
                            //填充粒子属性
                            var grain = this.list[i];
                            grain.show();


                            grain.quad.loop(v_particleStyle.loop);
                            (v_particleStyle.loop)?grain.quad.play():grain.quad.stop();

                            if(v_particleStyle.gotoFrame!=0)
                            grain.quad.gotoAndStop(v_particleStyle.gotoFrame);

                            if(v_particleStyle.tileName!=null)
                            grain.quad.setTileName(v_particleStyle.tileName);

                            grain.quad.setScaleX(v_particleStyle.scaleX);
                            grain.quad.setScaleY(v_particleStyle.scaleY);
                            grain.quad.GPUX=x+ Math.random()* v_particleStyle.scopeX - v_particleStyle.scopeX / 2;
                            grain.quad.GPUY=y+ Math.random()* v_particleStyle.scopeY - v_particleStyle.scopeY / 2;

                            //grain.quad.setX(x+ Math.random()* v_particleStyle.scopeX - v_particleStyle.scopeX / 2);
                            //grain.quad.setY(y+ Math.random()* v_particleStyle.scopeY - v_particleStyle.scopeY / 2);

                            grain.quad.setR(v_particleStyle.r);
                            grain.quad.setG(v_particleStyle.g);
                            grain.quad.setB(v_particleStyle.b);
                            grain.quad.setA(v_particleStyle.a);

                            grain.quad.setRotation(v_particleStyle.rotationValue);


                            grain.addR = v_particleStyle.addR;
                            grain.addG = v_particleStyle.addG;
                            grain.addB = v_particleStyle.addB;
                            grain.addA = v_particleStyle.addA;

                            grain.angleValue = v_particleStyle.angleValue;
                            grain.alphaValue = v_particleStyle.alphaValue;
                            grain.scaleXValue= v_particleStyle.scaleXValue;
                            grain.scaleYValue= v_particleStyle.scaleYValue;
                            grain.rotationValue = v_particleStyle.rotationValue + Math.random() * v_particleStyle.rotationRandom;
                            grain.speedValue = v_particleStyle.speedValue;


                            break;
                        }
                    }
            }
        }
    );
})();
(function()
{
    /**
     * ParticleStyle 粒子样式表，用于处理粒子发射时的各项参数
     * <br /> 演示地址:http://sirius2d.com/demos/d_32/
     * @class
     */
    ss2d.ParticleStyle = Class
    (
        /** @lends ss2d.ParticleStyle.prototype */
        {

            /**
             * 是否播放动画
             */
            loop:false,

            /**
             * 设置动画片段名称
             */
            tileName:null,

            /**
             * 跳转到第几帧
             */
            gotoFrame:0,

            /*
             *粒子X随机范围
             */
            scopeX:10,

            /**
             * 粒子Y随机范围
             */
            scopeY:10,

            /**
             * 粒子的X轴比例
             */
            scaleX:1,

            /**
             * 粒子的Y轴比例
             */
            scaleY:1,

            /**
             * 粒子X比例缩放值
             */
            scaleXValue:-.01,

            /**
             * 粒子Y比例缩放值
             */
            scaleYValue:-.01,

            /**
             * 粒子透明度
             */
            a:1,

            /**
             * 粒子红色通道值
             */
            r:.5,

            /**
             * 粒子绿色通道值
             */
            g:.8,

            /**
             * 粒子蓝色通道值
             */
            b: 1,

            /**
             * 粒子角度递增值
             */
            angleValue:0,

            /**
             * 粒子初始化角度
             */
            rotationValue:Math.PI/180*-90.0,

            /**
             * 粒子随机角度
             */
            rotationRandom:0,

            /**
             * 粒子运动速度
             */
            speedValue:5,

            /**
             * 粒子初始化透明度
             */
            alphaValue:-.02,

            /**
             * 粒子递增红色通道值
             */
            addR :.3,

            /**
             * 粒子递增绿色通道值
             */
            addG : .02,

            /**
             * 粒子递增蓝色通道值
             */
            addB :-.003,

            /**
             * 粒子递增透明度
             */
            addA :-.004
        }
    );
})();
(function()
{
    /**
     * Stage2D 游戏的主场景类，只能存在一个，提供游戏的渲染架构支持。
     * <br /> 演示地址:http://sirius2d.com/demos/d_1/
     * @class
     */
    ss2d.Stage2D = Class
        (
            /** @lends ss2d.Stage2D.prototype */
            {
                Extends:ss2d.EventDispatcher,

                STATIC:
                /** @lends ss2d.Stage2D */
                {
                    instance : null,

                    /**
                     * 场景的宽度
                     * stage width
                     */
                    stageWidth : 640,

                    /**
                     * 场景的高度
                     * stage height
                     */
                    stageHeight : 480,

                    /**
                     * 鼠标X轴坐标
                     * mouse X
                     */
                    mouseX:0,

                    /**
                     * 鼠标Y轴坐标
                     * mouse Y
                     */
                    mouseY:0,

                    /**
                     * 场景的红色通道
                     * red channel
                     */
                    r:0.0,

                    /**
                     * 场景的绿色通道
                     * green channel
                     */
                    g:0.0,

                    /**
                     * 场景的蓝色通道
                     * blue channel
                     */
                    b:0.0,

                    /**
                     * 场景的透明度
                     * alpha channel
                     */
                    a:1.0,


                     //GL场景正交比例
                    ratio : 1,

                    /**
                     * 全局着色器
                     * global shader
                     */
                    shader : null,

                    /**
                     * 正交矩阵容器
                     * orthogonal matrix
                     */
                    ovMatrix : [0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0],

                    /**
                     * 画布
                     * canvas
                     */
                    canvas : null,

                    /**
                     * 设备上下文
                     * device context
                     */
                    context : null,

                    textCanvas:null,
                    textContext:null,

                    /**
                     * WEBGL句柄
                     * webgl hwnd
                     */
                    gl : null,

                    /**
                     * 帧缓存
                     * frame buffer
                     */
                    rttFramebuffer:null,

                    /**
                     * 纹理缓存
                     * texture buffer
                     */
                    rttTexture:null,

                    /**
                     * FPS统计
                     * fps data
                     */
                    fps:0,
                    fpsTime:0,

                    getTextCanvas:function()
                    {
                        if(ss2d.Stage2D.textCanvas==null)
                        {
                            ss2d.Stage2D.textCanvas=document.createElement("canvas");
                        }
                        return ss2d.Stage2D.textCanvas;
                    },

                    getTextContext:function()
                    {
                        if(ss2d.Stage2D.textContext==null)
                        {
                            ss2d.Stage2D.textContext=ss2d.Stage2D.getTextCanvas().getContext("2d");
                        }
                        return ss2d.Stage2D.textContext;
                    }
                },

                //////////////////////////////////////////////////////////////////////////
                //  public property
                //////////////////////////////////////////////////////////////////////////

                /**
                 * 显示对象列表
                 * list of display objects
                 * @type {Array}
                 */
                displayerlist : null,

                /**
                 * 缓存显示列表
                 * list of frame buffer
                 */
                frameBufflist:null,

                //////////////////////////////////////////////////////////////////////////
                //  public property
                //////////////////////////////////////////////////////////////////////////

                _stats : null,
                _showStats : false,

                ////////////////////////////////////////////////////////////////////////////
                //  constructor
                ////////////////////////////////////////////////////////////////////////////

                initialize : function(canvasId, width, height)
                {
                    this.displayerlist=[];
                    this.frameBufflist=[];
                    ss2d.stage=this;
                    ss2d.Stage2D.instance = this;
                    ss2d.Stage2D.canvas = document.getElementById(canvasId);
                    if (ss2d.Stage2D.canvas == undefined)
                    {
                        ss2d.Stage2D.canvas = ss2d.canvas;
                    }
                    width = width || "auto";
                    height = height || "auto";
                    this.size(width, height);
                    //检测浏览器是否支持webgl
                    //check if the browser supports webgl
                    ss2d.Stage2D.gl = ss2d.WebGLUtil.setupWebGL(ss2d.Stage2D.canvas);
                    if (ss2d.Stage2D.gl == null)
                    {
                        alert("当前浏览器不支持webgl！");
                        return;
                    }
                    ss2d.Stage2D.gl.viewport(0, 0, ss2d.Stage2D.canvas.width, ss2d.Stage2D.canvas.height);
                    //ss2d.Stage2D.gl.depthFunc(ss2d.Stage2D.gl.LEQUAL);
                    ss2d.Stage2D.gl.enable(ss2d.Stage2D.gl.BLEND);
                    ss2d.Stage2D.gl.enable(ss2d.Stage2D.gl.SCISSOR_TEST);
                    ss2d.Stage2D.gl.disable(ss2d.Stage2D.gl.DEPTH_TEST);
                    ss2d.Stage2D.shader = new ss2d.ShaderGLSL();

                    ss2d[this.onMouseEventHandler] = this.onMouseEventHandler.bind(this);
                    ss2d[this.onDrawFrame] = this.onDrawFrame.bind(this);

                    ss2d.Stage2D.canvas.addEventListener('mousedown', ss2d[this.onMouseEventHandler], false);
                    ss2d.Stage2D.canvas.addEventListener('mouseup', ss2d[this.onMouseEventHandler], false);
                    ss2d.Stage2D.canvas.addEventListener('mousemove', ss2d[this.onMouseEventHandler], false);
                    ss2d.Stage2D.canvas.addEventListener('touchstart', ss2d[this.onMouseEventHandler], false);
                    ss2d.Stage2D.canvas.addEventListener('touchend', ss2d[this.onMouseEventHandler], false);
                    ss2d.Stage2D.canvas.addEventListener('touchmove', ss2d[this.onMouseEventHandler], false);

                    this.onDrawFrame();
                },

                ////////////////////////////////////////////////////////////////////////////
                //  public methods
                ////////////////////////////////////////////////////////////////////////////

                /**
                 * 添加新的显示对象
                 * add display object
                 * @param child 子显示对象
                 */
                addChild : function(child)
                {
                    var index = this.displayerlist.indexOf(child);
                    if(index!=-1) this.displayerlist.splice(index,1);
                    child.stage = this;
                    this.displayerlist.push(child);
                },

                /**
                 * 移除显示对象
                 * remove display object
                 * @param child
                 */
                removeChild : function(child)
                {
                    var index = this.displayerlist.indexOf(child);
                   if(index !=-1)
                    {
                        child.stage = null;
                        this.displayerlist.splice(index, 1);
                    }
                },

                size : function (width, height)
                {
                    if (typeof width == "string" && width == "auto")
                    {
                        width = window.screen.availWidth;
                        //width = document.body.clientWidth;
                    }
                    if (typeof height == "string" && height == "auto")
                    {
                        height = window.screen.availHeight;
                        //height = document.body.clientHeight;
                    }
                    ss2d.Stage2D.canvas.style.width = width + "px";
                    ss2d.Stage2D.canvas.style.height = height + "px";
                    ss2d.Stage2D.stageWidth = ss2d.Stage2D.canvas.width = width;
                    ss2d.Stage2D.stageHeight = ss2d.Stage2D.canvas.height = height;
                    ss2d.Stage2D.ratio = width / height;
                },

                showStats : function(value)
                {
                    if (value == this._showStats) return;
                    this._showStats = value;
                    if (value == true)
                    {
                        this._stats = new ss2d.Stats();
                        // Align top-left
                        this._stats.getDomElement().style.position = 'absolute';
                        this._stats.getDomElement().style.left = '6px';
                        this._stats.getDomElement().style.top = '6px';
                        ss2d.Stage2D.canvas.parentNode.appendChild( this._stats.getDomElement() );
                    }
                    else
                    {
                        this._stats.getDomElement().parentNode.removeChild(this._stats.getDomElement());
                        this._stats = null;
                    }
                },

                /**
                 * 添加帧缓存
                 * add frame buffer
                 * @param value
                 */
                addFrameBuffer:function(value)
                {
                    this.frameBufflist.push(value);
                },

                /**
                 * 重绘画布
                 * redraw the canvas
                 */
                onDrawFrame : function()
                {
                    ss2d.Stage2D.fps=parseInt(1000.0/(new Date().getTime()-ss2d.Stage2D.fpsTime));
                    ss2d.Stage2D.fpsTime=new Date().getTime();
                    this.dispatchEvent(ss2d.Event.ENTER_FRAME);

                    if (this._stats) this._stats.update();

                    if(this.frameBufflist.length!=0)
                    {
                        ss2d.Stage2D.gl.clear(ss2d.Stage2D.gl.COLOR_BUFFER_BIT);
                        //设置画布颜色为黑色
                        //set the background color to black
                        ss2d.Stage2D.gl.clearColor(ss2d.Stage2D.r,ss2d.Stage2D.g,ss2d.Stage2D.b,ss2d.Stage2D.a);

                        for(var f=0;f<this.frameBufflist.length;f++)
                        {
                            ss2d.Stage2D.gl.bindFramebuffer(ss2d.Stage2D.gl.FRAMEBUFFER,this.frameBufflist[f]._frameBuff.getTexture().rttFramebuffer);
                            if(this.frameBufflist[f]._clear)
                            {
                                ss2d.Stage2D.gl.clear(ss2d.Stage2D.gl.COLOR_BUFFER_BIT);
                                ss2d.Stage2D.gl.clearColor(ss2d.Stage2D.r,ss2d.Stage2D.g,ss2d.Stage2D.b,ss2d.Stage2D.a);
                            }
                            this.frameBufflist[f].paint();
                            ss2d.Stage2D.gl.bindFramebuffer(ss2d.Stage2D.gl.FRAMEBUFFER, null);
                        }
                    }

                    ss2d.Stage2D.gl.clear(ss2d.Stage2D.gl.COLOR_BUFFER_BIT);
                    //设置画布颜色为黑色
                    //set the background color to black
                    ss2d.Stage2D.gl.clearColor(ss2d.Stage2D.r,ss2d.Stage2D.g,ss2d.Stage2D.b,ss2d.Stage2D.a);

                    for(var i=0;i < this.displayerlist.length;i++)
                    {
                        var scene = this.displayerlist[i];
                        scene.dispatchEvent(ss2d.Event.ENTER_FRAME);
                        scene.paint();
                    }
                    window.requestAnimFrame(ss2d[this.onDrawFrame]);
                },

                getSceneForemostQuadUnderPoint:function(scene, x, y)
                {
                    var foremostQuad = null;
                    var quads = scene.getQuadsUnderPoint(x, y);

                    if (quads)
                    {
                        var min = {index:quads.length - 1, id:0};
                        for(var j = 0; j < quads.length; j++)
                        {
                            if (quads[j].id > min.id)
                            {
                                min.id = quads[j].id;
                                min.index = j;
                            }
                        }

                        foremostQuad = quads[min.index];

                    }
                    return foremostQuad;
                },


                onMouseEventHandler : function(e)
                {
                    var type = null;
                    var hitObj = null;
                    switch (e.type)
                    {
                        case "mousedown":
                        case "touchstart":
                            type = ss2d.MouseEvent.MOUSE_DOWN;
                            break;
                        case "mouseup":
                        case "touchend":
                            type = ss2d.MouseEvent.MOUSE_UP;
                            break;
                        case "mousemove":
                        case "touchmove":
                            type = ss2d.MouseEvent.MOUSE_MOVE;
                            break;
                    }

                    var pos = ss2d.getElementOffset(ss2d.Stage2D.canvas);
                    var tx = e.pageX;
                    var ty = e.pageY;
                    if (e["touches"])
                    {
                        tx = e["touches"][0].clientX;
                        ty = e["touches"][0].clientY;
                    }

                    ss2d.Stage2D.mouseX = (tx - pos.left);
                    ss2d.Stage2D.mouseY = (ty - pos.top);

                    var evt = new ss2d.MouseEvent(type, false, false, ss2d.Stage2D.mouseX, ss2d.Stage2D.mouseY);

                    for(var i=this.displayerlist.length-1;i>=0;i--)
                    {
                        var scene = this.displayerlist[i];
                        //是否开启鼠标事件
                        //check if the mouse event is enabled
                        if (scene.mouseEnabled == false) continue;

                        hitObj = this.getSceneForemostQuadUnderPoint(scene, ss2d.Stage2D.mouseX, ss2d.Stage2D.mouseY);
                        if (hitObj)
                        {
                            scene.dispatchEvent(evt, hitObj);
                            hitObj.dispatchEvent(evt);
                            break;
                        }
                    }

                    this.dispatchEvent(evt, hitObj);

                    e.stopPropagation();
                    e.preventDefault();
                }
            }
        );
})();
(function()
{
    /**
     * Texture 纹理贴图类 游戏里显示图像的核心封装类，所有的图像必须转换为纹理才能提交给引擎使用
     *  <br /> 演示地址:http://sirius2d.com/demos/d_1/
     * @class
     */
    ss2d.Texture = Class
    (
        /** @lends ss2d.Texture.prototype */
        {
            //////////////////////////////////////////////////////////////////////////
            //  public property
            //////////////////////////////////////////////////////////////////////////

            /**
             * 纹理宽度
             * <br />texture width
             */
            width : 0,

            /**
             * 纹理高度
             * <br />texture height
             */
            height : 0,

            /**
             * 纹理
             * <br />texture object
             */
            texture : null,

            /**
             * 纹理集
             * <br />quad resource
             */
            quadResource : null,

            regExpTail:new RegExp(/[a-z,0-9,_*]+[0-9]{4}/),
            regExpUnderline:new RegExp(/[A-Za-z0-9]*_[A-Za-z0-9]/),
            regExpIndex:0,
            cacheframeWidth:0,
            cacheframeHeight:0,
            cacheWidth:0,
            cacheHeight:0,
            cacheFrameX:0,
            cacheFrameY:0,
            rttFramebuffer:null,

            initialize : function(value)
            {

                if(arguments.length==1)
                {
                    this.width = arguments[0].width;
                    this.height = arguments[0].height;
                    if(arguments[0] instanceof HTMLImageElement)
                    {
                        if(ss2d.isPower_2(arguments[0].width)==false||ss2d.isPower_2(arguments[0].height)==false)
                        {
                            ss2d.canvas.width=ss2d.getScope(arguments[0].width);
                            ss2d.canvas.height=ss2d.getScope(arguments[0].height);
                            ss2d.context.clearRect(0,0,ss2d.canvas.width,ss2d.canvas.height);
                            ss2d.context.drawImage(arguments[0],0,0,arguments[0].width,arguments[0].height,
                                0,
                                0,
                                ss2d.canvas.width,ss2d.canvas.height);
                            this.newCanvas(ss2d.canvas,0x2901,0x2901,0x2601,0x2601);
                        }else
                        {
                            this.newBitmap(arguments[0],0x2901,0x2901,0x2601,0x2601);
                        }


                    }else if(arguments[0] instanceof HTMLCanvasElement)
                    {

                        this.newCanvas(arguments[0],0x2901,0x2901,0x2601,0x2601);
                    }
                }else if(arguments.length==2)
                {

                    if(arguments[0] instanceof HTMLImageElement&&arguments[1] instanceof Document)
                    {
                        this.width = arguments[0].width;
                        this.height = arguments[0].height;
                        this.newSprite(arguments[0],arguments[1],0x2901,0x2901,0x2601,0x2601);

                    }else if(arguments[0] instanceof HTMLImageElement&&arguments[1] instanceof ss2d.TextureStyle)
                    {
                        if(ss2d.isPower_2(arguments[0].width)==false||ss2d.isPower_2(arguments[0].height)==false)
                        {
                            this.width = arguments[0].width;
                            this.height = arguments[0].height;
                            ss2d.canvas.width=ss2d.getScope(arguments[0].width);
                            ss2d.canvas.height=ss2d.getScope(arguments[0].height);

                            ss2d.context.clearRect(0,0,ss2d.canvas.width,ss2d.canvas.height);
                            ss2d.context.drawImage(arguments[0],0,0,arguments[0].width,arguments[0].height,
                                0,
                                0,
                                ss2d.canvas.width,ss2d.canvas.height);

                            this.newCanvas(ss2d.canvas,arguments[1].xTile,arguments[1].yTile,arguments[1].xSampling,arguments[1].ySampling);
                        }else
                        {
                            this.width = arguments[0].width;
                            this.height = arguments[0].height;
                            this.newBitmap(arguments[0],arguments[1].xTile,arguments[1].yTile,arguments[1].xSampling,arguments[1].ySampling);
                        }

                    }else if(arguments[0] instanceof HTMLCanvasElement&&arguments[1] instanceof ss2d.TextureStyle)
                    {
                        this.width = arguments[0].width;
                        this.height = arguments[0].height;
                        this.newCanvas(arguments[0],arguments[1].xTile,arguments[1].yTile,arguments[1].xSampling,arguments[1].ySampling);
                    }else if(!isNaN(arguments[0])&&!isNaN(arguments[1]))
                    {
                        this.width = arguments[0];
                        this.height = arguments[1];
                        this.newTexture(arguments[0],arguments[1],0x2901,0x2901,0x2601,0x2601);
                    }

                }else if(arguments.length==3)
                {
                    if(arguments[0] instanceof HTMLImageElement&&arguments[1] instanceof Document&&arguments[2] instanceof ss2d.TextureStyle)
                    {
                        this.width = arguments[0].width;
                        this.height = arguments[0].height;
                        this.newSprite(arguments[0],arguments[1],arguments[2].xTile,arguments[2].yTile,arguments[2].xSampling,arguments[2].ySampling);
                    }else if(!isNaN(arguments[0])&&!isNaN(arguments[1])&&arguments[2] instanceof ss2d.TextureStyle)
                    {

                        this.width = arguments[0];
                        this.height = arguments[1];
                        this.newTexture(arguments[0],arguments[1],arguments[2].xTile,arguments[2].yTile,arguments[2].xSampling,arguments[2].ySampling);
                    }
                }
            },

            /**
             * 基于canvas创建新的纹理
             * <br />create new texture based on canvases
             * @param canvas
             * @param xTile
             * @param yTile
             * @param xSampling
             * @param ySampling
             */
            newCanvas:function(canvas,xTile,yTile,xSampling,ySampling)
            {

                //申请一个纹理
                //create a new texture

                this.texture = ss2d.Stage2D.gl.createTexture();

                ss2d.Stage2D.gl.bindTexture(ss2d.Stage2D.gl.TEXTURE_2D,this.texture);
                ss2d.Stage2D.gl.pixelStorei(ss2d.Stage2D.gl.UNPACK_FLIP_Y_WEBGL, 1);
                ss2d.Stage2D.gl.pixelStorei(ss2d.Stage2D.gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);

                /*var text=document.createElement("canvas");
                 text.width=512;
                 text.height=512;
                 var s2d=text.getContext("2d");
                 //对其绘制文字
                 //设置文字属性
                 s2d.textBaseline="middle";
                 s2d.textAlign="center";
                 s2d.font="18px 楷体";
                 s2d.fontStyle="rgba(0,0,0,0.3)";
                 //设置文字渐变
                 s2d.fillStyle=s2d.createLinearGradient(0,0,text.width,0);
                 s2d.fillStyle.addColorStop(0,"rgba(255,255,0,0.5)");
                 s2d.fillStyle.addColorStop(0.5,"rgba(0,255,255,0.5)");
                 s2d.fillStyle.addColorStop(1,"rgba(255,0,255,0.5)");
                 //绘制文字
                 s2d.fillText("文本测试",0,0);*/

                //ss2d.Stage2D.gl.drawImage(text,0,0,text.width,text.height,-512/2+512/2,-512/2+512/2,512,512);
                ss2d.Stage2D.gl.texImage2D(ss2d.Stage2D.gl.TEXTURE_2D, 0, ss2d.Stage2D.gl.RGBA,ss2d.Stage2D.gl.RGBA,ss2d.Stage2D.gl.UNSIGNED_BYTE,canvas);
                //ss2d.Stage2D.gl.texImage2D(ss2d.Stage2D.gl.TEXTURE_2D, 0, ss2d.Stage2D.gl.RGBA, ss2d.Stage2D.gl.RGBA, ss2d.Stage2D.gl.UNSIGNED_BYTE, image);
                //ss2d.Stage2D.gl.texImage2D(ss2d.Stage2D.gl.TEXTURE_2D, 0, ss2d.Stage2D.gl.RGBA, ss2d.Stage2D.gl.RGBA, ss2d.Stage2D.gl.UNSIGNED_BYTE, image);
                //ss2d.Stage2D.gl.texParameteri(ss2d.Stage2D.gl.TEXTURE_2D, ss2d.Stage2D.gl.TEXTURE_MAG_FILTER, ss2d.Stage2D.gl.NEAREST);
                //ss2d.Stage2D.gl.texParameteri(ss2d.Stage2D.gl.TEXTURE_2D, ss2d.Stage2D.gl.TEXTURE_MIN_FILTER, ss2d.Stage2D.gl.NEAREST);



                ss2d.Stage2D.gl.texParameteri(ss2d.Stage2D.gl.TEXTURE_2D, ss2d.Stage2D.gl.TEXTURE_MAG_FILTER,xSampling);
                ss2d.Stage2D.gl.texParameteri(ss2d.Stage2D.gl.TEXTURE_2D, ss2d.Stage2D.gl.TEXTURE_MIN_FILTER,ySampling);


                ss2d.Stage2D.gl.texParameteri(ss2d.Stage2D.gl.TEXTURE_2D, ss2d.Stage2D.gl.TEXTURE_WRAP_S,xTile);
                ss2d.Stage2D.gl.texParameteri(ss2d.Stage2D.gl.TEXTURE_2D, ss2d.Stage2D.gl.TEXTURE_WRAP_T,yTile);

                //ss2d.Stage2D.gl.texParameteri(ss2d.Stage2D.gl.TEXTURE_2D, ss2d.Stage2D.gl.TEXTURE_WRAP_S, ss2d.Stage2D.gl.CLAMP_TO_EDGE);
                //ss2d.Stage2D.gl.texParameteri(ss2d.Stage2D.gl.TEXTURE_2D, ss2d.Stage2D.gl.TEXTURE_WRAP_T, ss2d.Stage2D.gl.CLAMP_TO_EDGE);

                //清空状态机里的纹理,这里只是清除引用而已,不是清除纹理,纹理我们已经经过状态机加工过了
                //only delete the ref
                ss2d.Stage2D.gl.bindTexture(ss2d.Stage2D.gl.TEXTURE_2D, null);
            },

            /**
             * 基于图片创建纹理
             * <br />create texture based on images
             * @param image
             * @param xTile
             * @param yTile
             * @param xSampling
             * @param ySampling
             */
            newBitmap:function(image,xTile,yTile,xSampling,ySampling)
            {
                //申请一个纹理
                //create a new texture
                this.texture = ss2d.Stage2D.gl.createTexture();

                ss2d.Stage2D.gl.bindTexture(ss2d.Stage2D.gl.TEXTURE_2D, this.texture);
                ss2d.Stage2D.gl.pixelStorei(ss2d.Stage2D.gl.UNPACK_FLIP_Y_WEBGL, 1);
                ss2d.Stage2D.gl.pixelStorei(ss2d.Stage2D.gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);

                ss2d.Stage2D.gl.texImage2D(ss2d.Stage2D.gl.TEXTURE_2D, 0, ss2d.Stage2D.gl.RGBA, ss2d.Stage2D.gl.RGBA, ss2d.Stage2D.gl.UNSIGNED_BYTE, image);

                ss2d.Stage2D.gl.texParameteri(ss2d.Stage2D.gl.TEXTURE_2D, ss2d.Stage2D.gl.TEXTURE_MAG_FILTER,xSampling);
                ss2d.Stage2D.gl.texParameteri(ss2d.Stage2D.gl.TEXTURE_2D, ss2d.Stage2D.gl.TEXTURE_MIN_FILTER,ySampling);

                ss2d.Stage2D.gl.texParameteri(ss2d.Stage2D.gl.TEXTURE_2D, ss2d.Stage2D.gl.TEXTURE_WRAP_S,xTile);
                ss2d.Stage2D.gl.texParameteri(ss2d.Stage2D.gl.TEXTURE_2D, ss2d.Stage2D.gl.TEXTURE_WRAP_T,yTile);

                //清空状态机里的纹理,这里只是清除引用而已,不是清除纹理,纹理我们已经经过状态机加工过了
                //only delete the ref
                ss2d.Stage2D.gl.bindTexture(ss2d.Stage2D.gl.TEXTURE_2D, null);
            },


            /**
             * 基于精灵创建纹理
             * <br />create texture based on sprites
             * @param image
             * @param xml
             * @param xTile
             * @param yTile
             * @param xSampling
             * @param ySampling
             */
            newSprite:function(image, xml,xTile,yTile,xSampling,ySampling)
            {


                this.loadXml(xml);

                //申请一个纹理
                //create a new texture
                this.texture = ss2d.Stage2D.gl.createTexture();

                ss2d.Stage2D.gl.bindTexture(ss2d.Stage2D.gl.TEXTURE_2D, this.texture);
                ss2d.Stage2D.gl.pixelStorei(ss2d.Stage2D.gl.UNPACK_FLIP_Y_WEBGL, 1);
                ss2d.Stage2D.gl.pixelStorei(ss2d.Stage2D.gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);

                ss2d.Stage2D.gl.texImage2D(ss2d.Stage2D.gl.TEXTURE_2D, 0, ss2d.Stage2D.gl.RGBA, ss2d.Stage2D.gl.RGBA, ss2d.Stage2D.gl.UNSIGNED_BYTE, image);
                ss2d.Stage2D.gl.texParameteri(ss2d.Stage2D.gl.TEXTURE_2D, ss2d.Stage2D.gl.TEXTURE_MAG_FILTER,xSampling);
                ss2d.Stage2D.gl.texParameteri(ss2d.Stage2D.gl.TEXTURE_2D, ss2d.Stage2D.gl.TEXTURE_MIN_FILTER,ySampling);

                ss2d.Stage2D.gl.texParameteri(ss2d.Stage2D.gl.TEXTURE_2D, ss2d.Stage2D.gl.TEXTURE_WRAP_S,xTile);
                ss2d.Stage2D.gl.texParameteri(ss2d.Stage2D.gl.TEXTURE_2D, ss2d.Stage2D.gl.TEXTURE_WRAP_T,yTile);

                //清空状态机里的纹理,这里只是清除引用而已,不是清除纹理,纹理我们已经经过状态机加工过了
                //only delete the ref
                ss2d.Stage2D.gl.bindTexture(ss2d.Stage2D.gl.TEXTURE_2D, null);
            },


            /**
             * 创建空纹理
             * <br />create a null texture
             * @param width
             * @param height
             * @param xTile
             * @param yTile
             * @param xSampling
             * @param ySampling
             */
            newTexture:function(width,height,xTile,yTile,xSampling,ySampling)
            {
                //清空状态机里的纹理,这里只是清除引用而已,不是清除纹理,纹理我们已经经过状态机加工过了
                //only delete the ref
                this.texture = ss2d.Stage2D.gl.createTexture();
                ss2d.Stage2D.gl.bindTexture(ss2d.Stage2D.gl.TEXTURE_2D, this.texture);
                ss2d.Stage2D.gl.pixelStorei(ss2d.Stage2D.gl.UNPACK_FLIP_Y_WEBGL, 1);
                ss2d.Stage2D.gl.pixelStorei(ss2d.Stage2D.gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);

                ss2d.Stage2D.gl.texImage2D(ss2d.Stage2D.gl.TEXTURE_2D, 0,ss2d.Stage2D.gl.RGBA,width,height,0, ss2d.Stage2D.gl.RGBA, ss2d.Stage2D.gl.UNSIGNED_BYTE, null);

                ss2d.Stage2D.gl.texParameteri(ss2d.Stage2D.gl.TEXTURE_2D, ss2d.Stage2D.gl.TEXTURE_MAG_FILTER,xSampling);
                ss2d.Stage2D.gl.texParameteri(ss2d.Stage2D.gl.TEXTURE_2D, ss2d.Stage2D.gl.TEXTURE_MIN_FILTER,ySampling);

                ss2d.Stage2D.gl.texParameteri(ss2d.Stage2D.gl.TEXTURE_2D, ss2d.Stage2D.gl.TEXTURE_WRAP_S,xTile);
                ss2d.Stage2D.gl.texParameteri(ss2d.Stage2D.gl.TEXTURE_2D, ss2d.Stage2D.gl.TEXTURE_WRAP_T,yTile);

                //清空状态机里的纹理,这里只是清除引用而已,不是清除纹理,纹理我们已经经过状态机加工过了
                //only delete the ref
                ss2d.Stage2D.gl.bindTexture(ss2d.Stage2D.gl.TEXTURE_2D, null);

            },

            /**
             * 转换为帧缓存
             * <br />transform texture into buffer
             */
            transformTextureBuffer:function()
            {
                this.rttFramebuffer = ss2d.Stage2D.gl.createFramebuffer();
                ss2d.Stage2D.gl.bindFramebuffer(ss2d.Stage2D.gl.FRAMEBUFFER, this.rttFramebuffer);
                ss2d.Stage2D.gl.framebufferTexture2D(ss2d.Stage2D.gl.FRAMEBUFFER, ss2d.Stage2D.gl.COLOR_ATTACHMENT0, ss2d.Stage2D.gl.TEXTURE_2D,this.texture, 0);
                ss2d.Stage2D.gl.bindTexture(ss2d.Stage2D.gl.TEXTURE_2D, null);
                ss2d.Stage2D.gl.bindFramebuffer(ss2d.Stage2D.gl.FRAMEBUFFER, null);
            },


            ////////////////////////////////////////////////////////////////////////////
            //  public methods
            ////////////////////////////////////////////////////////////////////////////

            /**
             * 销毁纹理
             * <br />delete the textures
             */
            dispose:function()
            {
                this.quadResource=null;
                ss2d.Stage2D.gl.deleteTexture(this.texture);
                this.texture=null;
            },

            /**
             * 读取XML
             * <br />load xml
             * @param xml
             */
            loadXml : function(xml)
            {
                this.quadResource = new ss2d.QuadResource();
                var name;
                var textureAtlas = xml.getElementsByTagName("SubTexture");
                var quadDataList=[];
                var quadFrameList=[];
                for (var i = 0; i< textureAtlas.length; i++)
                {
                    var subTexture = textureAtlas[i];
                    var regExpBool=this.regExpUnderline.test(subTexture.getAttribute("name"));

                   if(ss2d.xmlUnderline)
                   {
                       if(regExpBool)
                       {
                           this.regExpIndex=0;
                           if(name !=  subTexture.getAttribute("name").split("_")[0])
                           {
                               name = subTexture.getAttribute("name").split("_")[0];
                               quadFrameList=[];
                               var quadData = new ss2d.QuadData();
                               quadData.name = subTexture.getAttribute("name").split("_")[0];
                               quadData.quadFrameLst = quadFrameList;
                               quadDataList.push(quadData);
                               this.cacheframeWidth=0;
                               this.cacheframeHeight=0;
                               this.cacheWidth=0;
                               this.cacheHeight=0;
                               this.cacheFrameX=0;
                               this.cacheFrameY=0;
                           }

                       }else
                       {

                           var regExpBoolean=this.regExpTail.test(subTexture.getAttribute("name"));
                           if(regExpBoolean)
                           {
                               this.regExpIndex=1;
                               if(name!=subTexture.getAttribute("name").substr(0,subTexture.getAttribute("name").length-4))
                               {
                                   name=subTexture.getAttribute("name").substr(0,subTexture.getAttribute("name").length-4);
                                   quadFrameList=[];
                                   var quadData = new ss2d.QuadData();
                                   quadData.name=subTexture.getAttribute("name").substr(0,subTexture.getAttribute("name").length-4);
                                   quadData.quadFrameLst = quadFrameList;
                                   quadDataList.push(quadData);
                                   this.cacheframeWidth=0;
                                   this.cacheframeHeight=0;
                                   this.cacheWidth=0;
                                   this.cacheHeight=0;
                                   this.cacheFrameX=0;
                                   this.cacheFrameY=0;
                               }
                           }else
                           {
                               this.regExpIndex=2;
                               if(name!=subTexture.getAttribute("name"))
                               {
                                   name = subTexture.getAttribute("name");
                                   quadFrameList=[];
                                   var quadData = new ss2d.QuadData();
                                   quadData.name=subTexture.getAttribute("name");
                                   quadData.quadFrameLst = quadFrameList;
                                   quadDataList.push(quadData);
                                   this.cacheframeWidth=0;
                                   this.cacheframeHeight=0;
                                   this.cacheWidth=0;
                                   this.cacheHeight=0;
                                   this.cacheFrameX=0;
                                   this.cacheFrameY=0;
                               }
                           }

                       }
                   }else
                   {
                       var regExpBoolean=this.regExpTail.test(subTexture.getAttribute("name"));
                       if(regExpBoolean)
                       {
                           this.regExpIndex=1;
                           if(name!=subTexture.getAttribute("name").substr(0,subTexture.getAttribute("name").length-4))
                           {
                               name=subTexture.getAttribute("name").substr(0,subTexture.getAttribute("name").length-4);
                               quadFrameList=[];
                               var quadData = new ss2d.QuadData();
                               quadData.name=subTexture.getAttribute("name").substr(0,subTexture.getAttribute("name").length-4);
                               quadData.quadFrameLst = quadFrameList;
                               quadDataList.push(quadData);
                               this.cacheframeWidth=0;
                               this.cacheframeHeight=0;
                               this.cacheWidth=0;
                               this.cacheHeight=0;
                               this.cacheFrameX=0;
                               this.cacheFrameY=0;
                           }
                       }else
                       {
                           this.regExpIndex=2;
                           if(name!=subTexture.getAttribute("name"))
                           {
                               name = subTexture.getAttribute("name");
                               quadFrameList=[];
                               var quadData = new ss2d.QuadData();
                               quadData.name=subTexture.getAttribute("name");
                               quadData.quadFrameLst = quadFrameList;
                               quadDataList.push(quadData);
                               this.cacheframeWidth=0;
                               this.cacheframeHeight=0;
                               this.cacheWidth=0;
                               this.cacheHeight=0;
                               this.cacheFrameX=0;
                               this.cacheFrameY=0;
                           }
                       }


                   }



                    var quadFrame = new ss2d.QuadFrame();
                    quadFrame.name=subTexture.getAttribute("name");

                    var replace = subTexture.getAttribute("x");
                    if(replace != null) quadFrame.x = replace;

                    replace = subTexture.getAttribute("y");
                    if(replace != null) quadFrame.y = replace;

                    replace = subTexture.getAttribute("width");
                    if(replace != null)
                    {
                        quadFrame.width = replace;
                        this.cacheWidth = replace;
                    }

                    replace = subTexture.getAttribute("height");
                    if(replace != null)
                    {
                        quadFrame.height = replace;
                        this.cacheHeight = replace;
                    }

                    replace = subTexture.getAttribute("frameX");
                    if(replace != null)
                    {
                        quadFrame.frameX = subTexture.getAttribute("frameX");
                        this.cacheFrameX=quadFrame.frameX;

                    }
                    else
                    {

                        if(this.cacheFrameX!=0)
                        {
                            quadFrame.frameX=this.cacheFrameX;
                        }else
                        {
                            quadFrame.frameX = 0;
                        }
                    }

                    replace = subTexture.getAttribute("frameY");
                    if(replace != null)
                    {
                        quadFrame.frameY = replace;
                        this.cacheFrameY=quadFrame.frameY;
                    }
                    else
                    {
                        if(this.cacheFrameY!=0)
                        {
                            quadFrame.frameY=this.cacheFrameY;
                        }else
                        {
                            quadFrame.frameY = 0;
                        }

                    }

                    replace = subTexture.getAttribute("frameWidth");
                    if(replace != null)
                    {
                        quadFrame.frameWidth = replace;
                        this.cacheframeWidth = replace;
                    }
                    else
                    {
                        if(this.cacheframeWidth != 0)
                        {
                            quadFrame.frameWidth = this.cacheframeWidth;
                        }
                        else
                        {
                            quadFrame.frameWidth = this.cacheWidth;
                        }
                    }

                    replace = subTexture.getAttribute("frameHeight");
                    if(replace != null)
                    {
                        quadFrame.frameHeight = replace;
                        this.cacheframeHeight = replace;
                    }
                    else
                    {
                        if(this.cacheframeHeight != 0)
                        {
                            quadFrame.frameHeight = this.cacheframeHeight;
                        }
                        else
                        {
                            quadFrame.frameHeight = this.cacheHeight;

                        }
                    }

                    /*ss2d.log("Texture2D -> quadFrame:{" +
                        "name:" + quadFrame.name +
                        ", x:" + quadFrame.x +
                        ", y:" + quadFrame.y +
                        ", width:" + quadFrame.width +
                        ", height:" + quadFrame.height +
                        ", frameX:" + quadFrame.frameX +
                        ", frameY:" + quadFrame.frameY +
                        ", frameWidth:" + quadFrame.frameWidth +
                        ", frameHeight:" + quadFrame.frameHeight);*/


                    quadFrameList.push(quadFrame);
                }
                this.quadResource.quadDataList = quadDataList;
            }
        }
    );
})();
(function()
{
    /**
     * TextureStyle 设置纹理显示采样样式，通常用于设置循环滚动的背景。
     * <br /> 演示地址:http://sirius2d.com/demos/d_28/
     * @class
     */
    ss2d.TextureStyle = Class
    (
        /** @lends ss2d.TextureStyle.prototype */
        {
            STATIC:
            {
                REPEAT:0x2901,
                MIRRORED_REPEAT:0x8370,
                CLAMP_TO_EDGE:0x812F,
                LINEAR:0x2601,
                NEAREST:0x2600
            },

            /**
             * X轴边缘采样模式
             * X axis sampling mode
             */
            xTile:0,

            /**
             * Y轴边缘年采样模式
             * Y axis sampling mode
             */
            yTile:0,

            /**
             * X轴缩放采样模式
             * scale X sampling mode
             */
            xSampling:0,

            /**
             * Y轴缩放采样模式
             * scale Y sampling mode
             */
            ySampling:0,
            initialize : function(value)
            {
               this.xTile=0x2901;
               this.yTile=0x2901;
               this.xSampling=0x2601;
               this.ySampling=0x2601;
            }
        }
    );
})();
(function()
{
    /**
     * ShaderAbstract 虚化效果着色器
     * @class
     */
    ss2d.ShaderAbstract = Class
    (
        /** @lends ss2d.ShaderAbstract.prototype */
        {
            Extends : ss2d.ShaderBasis,
            time:0,

            initialize : function()
            {
                this.time=0;
                ss2d.ShaderAbstract.Super.call(this);
                this.vertexShader = this.getShader(ss2d.Stage2D.gl,
                    this.basisVertexHead+
                        this.basisVertexStart+
                        this.basisVertexEnd,
                    "vs");

                this.fragmentShader = this.getShader(ss2d.Stage2D.gl,
                    this.basisPixelHead+
                    "uniform float time;"+
                    "const vec2 mouse=vec2(0.0,0.0);"+
                    "const vec2 resolution=vec2(1024.0,1024.0);"+
                    "void main(void)"+
                    "{"+
                        "float scale = resolution.y / 50.0;"+
                        "float ring = 20.0;"+
                        "float radius = resolution.x*1.0;"+
                        "float gap = scale*.5;"+
                        "vec2 pos = gl_FragCoord.xy - resolution.xy*.5;"+
                        "float d = length(pos);"+
                        "d += mouse.x*(sin(pos.y*0.25/scale+time)*sin(pos.x*0.25/scale+time*.5))*scale*5.0;"+
                        "float v = mod(d + radius/(ring*2.0), radius/ring);"+
                        "v = abs(v - radius/(ring*2.0));"+
                        "v = clamp(v-gap, 0.0, 1.0);"+
                        "d /= radius;"+
                        "vec3 m = fract((d-1.0)*vec3(ring*-.5, -ring, ring*.25)*0.5);"+
                        "gl_FragColor = texture2D(texture,vTextureUV)*vec4(m*v, 1.0);"+
                    "}","fs");

                this.newShader();
            },

            upDataShader : function(scene)
            {
                ss2d.Stage2D.gl.useProgram(this.shaderProgram);
                this.upDataMatrix();
                this.upDataTexture(scene);
                this.upDataVertex(scene);
                this.upDataCache(scene);

                this.time+=.01;
                ss2d.Stage2D.gl.uniform1f(ss2d.Stage2D.gl.getUniformLocation(this.shaderProgram,"time"),this.time);
            }

        }
    );
})();
(function()
{
    /**
     * ShaderAdvanced 高级上色效果着色器
     * @class
     */
    ss2d.ShaderAdvanced = Class
    (
        /** @lends ss2d.ShaderAdvanced.prototype */
        {
            Extends : ss2d.ShaderBasis,
            r:0.0,
            g:0.0,
            b:0.0,
            a:0.0,

            initialize : function()
            {
                ss2d.ShaderAdvanced.Super.call(this);
               this.vertexShader = this.getShader(ss2d.Stage2D.gl,
                        this.basisVertexHead+
                            this.basisVertexStart+
                            this.basisVertexEnd,
                        "vs");

                this.fragmentShader = this.getShader(ss2d.Stage2D.gl,
                         this.basisPixelHead+
                        "uniform vec4 value;"+
                        "void main(void) {"+
                            "gl_FragColor = texture2D(texture,vTextureUV)*vVertexColor+value;"+
                        "}","fs");
                this.newShader();
            },

            upDataShader : function(scene)
            {
                ss2d.Stage2D.gl.useProgram(this.shaderProgram);
                this.upDataMatrix();
                this.upDataTexture(scene);
                this.upDataVertex(scene);
                this.upDataCache(scene);
                ss2d.Stage2D.gl.uniform4f(ss2d.Stage2D.gl.getUniformLocation(this.shaderProgram,"value"),this.r,this.g,this.b,this.a);
            }
        }
    );
})();
(function()
{
    /**
     * ShaderBasis 基础效果着色器
     * @class
     */
    ss2d.ShaderBasis = Class
    (
        /** @lends ss2d.ShaderBasis.prototype */
        {

            basisVertexHead:null,
            basisVertexStart:null,
            basisVertexEnd:null,


            basisPixelHead:null,
            basisPixelStart:null,
            basisPixelEnd:null,


            //获取顶点着色器
            vertexShader : null,

            //获取像素着色器
            fragmentShader : null,


            orMatrix : null,

            fuseMatrix3D:null,

            initialize : function()
            {
                this.orMatrix=[0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0],

                this.basisVertexHead=
                    "precision mediump float;"+
                    "attribute vec2 aVertexPosition;"+
                    "attribute vec2 aTextureUV;"+
                    "attribute vec2 aVertexGPU;"+
                    "attribute vec4 aVertexColor;"+
                    "varying vec2 vTextureUV;"+
                    "varying vec4 vVertexColor;"+
                    "uniform mat4 oRMatrix;";
                   // "uniform sampler2D texture;";
                this.basisVertexStart=
                    "void main(void) {";
                this.basisVertexEnd=
                    "vTextureUV = aTextureUV;"+
                    "vVertexColor=aVertexColor;"+
                     //"vec4 map=texture2D(texture,aTextureUV);"+
                    "gl_Position =  oRMatrix*vec4(aVertexPosition+aVertexGPU,1.0,1.0);"+
                    "}";

                this.basisPixelHead=
                    "precision mediump float;"+
                    "varying vec2 vTextureUV;"+
                    "varying vec4 vVertexColor;"+
                    "uniform sampler2D texture;"
                this.basisPixelStart=
                    "void main(void) {";
                this.basisPixelEnd=
                    "gl_FragColor = texture2D(texture,vTextureUV)*vVertexColor;"+
                    "}";
            },

            dispose:function()
            {
                //st = smoothstep (0.001,0.001,sqrt(dot(vec2(sin(time) * 0.5,cos(time) * 0.3), vec2(sin(time) * 0.5,cos(time) * 0.3))));
                ss2d.Stage2D.gl.deleteShader(this.vertexShader);
                ss2d.Stage2D.gl.deleteShader(this.fragmentShader);
                ss2d.Stage2D.gl.deleteProgram(this.shaderProgram);
                this.vertexShader=null;
                this.fragmentShader=null;
                this.shaderProgram=null;
            },

            newShader:function()
            {
                //创建一个着色器程序
                this.shaderProgram = ss2d.Stage2D.gl.createProgram();
                //把顶点着色器上传到这个着色器程序里
                ss2d.Stage2D.gl.attachShader(this.shaderProgram,this.vertexShader);
                //把像素着色器上传到这个着色器程序里
                ss2d.Stage2D.gl.attachShader(this.shaderProgram,this.fragmentShader);
                //链接这个着色器
                ss2d.Stage2D.gl.linkProgram(this.shaderProgram);
                //如果你创建失败了,那你又写错代码了
                if (!ss2d.Stage2D.gl.getProgramParameter(this.shaderProgram, ss2d.Stage2D.gl.LINK_STATUS))
                {
                    alert("Could not initialise shaders");
                }
                //把这个着色器上传到GPU
                ss2d.Stage2D.gl.useProgram(this.shaderProgram);
                this.shaderProgram.vertexPositionAttribute = ss2d.Stage2D.gl.getAttribLocation(this.shaderProgram, "aVertexPosition");
                ss2d.Stage2D.gl.enableVertexAttribArray(this.shaderProgram.vertexPositionAttribute);

                this.shaderProgram.textureCoordAttribute = ss2d.Stage2D.gl.getAttribLocation(this.shaderProgram, "aTextureUV");
                ss2d.Stage2D.gl.enableVertexAttribArray(this.shaderProgram.textureCoordAttribute);

                this.shaderProgram.vertexGPUAttribute = ss2d.Stage2D.gl.getAttribLocation(this.shaderProgram, "aVertexGPU");
                ss2d.Stage2D.gl.enableVertexAttribArray(this.shaderProgram.vertexGPUAttribute);

                this.shaderProgram.verticesColourAttribute = ss2d.Stage2D.gl.getAttribLocation(this.shaderProgram, "aVertexColor");
                ss2d.Stage2D.gl.enableVertexAttribArray(this.shaderProgram.verticesColourAttribute);

                ss2d.orthographicViewportMatrix(this.orMatrix,
                    -ss2d.Stage2D.ratio - ss2d.Stage2D.ratio,
                    ss2d.Stage2D.ratio - ss2d.Stage2D.ratio,
                    2,0, 0, 1);
            },



            setTransform:function(value)
            {
                this.fuseMatrix3D=value;
            },


            upDataMatrix:function()
            {
                //计算正交视口矩阵
                if(this.fuseMatrix3D!=null)
                {
                    ss2d.orthographicViewportMatrix(this.orMatrix,
                        -ss2d.Stage2D.ratio - ss2d.Stage2D.ratio,
                        ss2d.Stage2D.ratio - ss2d.Stage2D.ratio,
                        2,0, 0, 1);
                    this.orMatrix=this.fuseMatrix3D.add4x4(this.orMatrix,this.fuseMatrix3D.rawData);
                }
            },


            upDataTexture:function(scene)
            {
                ss2d.Stage2D.gl.activeTexture(ss2d.Stage2D.gl.TEXTURE0);
                ss2d.Stage2D.gl.bindTexture(ss2d.Stage2D.gl.TEXTURE_2D, scene.m_texture.texture);
                ss2d.Stage2D.gl.uniform1i(ss2d.Stage2D.gl.getUniformLocation(this.shaderProgram,"texture"),0);
            },


            upDataVertex:function(scene)
            {
                //推送GPU加速顶点坐标缓存到WEBGL状态机
                ss2d.Stage2D.gl.bindBuffer(ss2d.Stage2D.gl.ARRAY_BUFFER, scene.verticesGPUBuffer);
                //上传顶点坐标数据到顶点缓存
                ss2d.Stage2D.gl.bufferData(ss2d.Stage2D.gl.ARRAY_BUFFER, scene.m_verticesGPUList, ss2d.Stage2D.gl.STREAM_DRAW);


                //推送顶点坐标缓存到WEBGL状态机
                ss2d.Stage2D.gl.bindBuffer(ss2d.Stage2D.gl.ARRAY_BUFFER, scene.vertexPositionBuffer);
                //上传顶点坐标数据到顶点缓存
                ss2d.Stage2D.gl.bufferData(ss2d.Stage2D.gl.ARRAY_BUFFER, scene.m_verticesList, ss2d.Stage2D.gl.STREAM_DRAW);


                //推送UV缓存到WEBGL状态机
                ss2d.Stage2D.gl.bindBuffer(ss2d.Stage2D.gl.ARRAY_BUFFER, scene.vertexTextureUvdBuffer);
                //上传顶点UV数据到顶点缓存
                ss2d.Stage2D.gl.bufferData(ss2d.Stage2D.gl.ARRAY_BUFFER, scene.m_uvList, ss2d.Stage2D.gl.STREAM_DRAW);


                //推送颜色缓存到WEBGL状态机
                ss2d.Stage2D.gl.bindBuffer(ss2d.Stage2D.gl.ARRAY_BUFFER, scene.verticesColorBuffer);
                //上传顶点颜色数据到顶点缓存
                ss2d.Stage2D.gl.bufferData(ss2d.Stage2D.gl.ARRAY_BUFFER, scene.m_colorList, ss2d.Stage2D.gl.STREAM_DRAW);

                ss2d.Stage2D.gl.bindBuffer(ss2d.Stage2D.gl.ELEMENT_ARRAY_BUFFER, scene.vertexIndexBuffer);
                ss2d.Stage2D.gl.bufferData(ss2d.Stage2D.gl.ELEMENT_ARRAY_BUFFER, scene.m_indexList, ss2d.Stage2D.gl.STATIC_DRAW);
            },


            upDataCache:function(scene)
            {
                //上传顶点坐标数据的缓存到着色器
                ss2d.Stage2D.gl.bindBuffer(ss2d.Stage2D.gl.ARRAY_BUFFER,scene.verticesGPUBuffer);
                //第一个参数为绑定的寄存器,每个顶点的数据长度为2,浮点型,它会自动帮我们区分,然后是不启用法线辅助功能,间隔为0
                ss2d.Stage2D.gl.vertexAttribPointer(this.shaderProgram.vertexGPUAttribute,2, ss2d.Stage2D.gl.FLOAT, false, 0, 0);


                //上传顶点坐标数据的缓存到着色器
                ss2d.Stage2D.gl.bindBuffer(ss2d.Stage2D.gl.ARRAY_BUFFER,scene.vertexPositionBuffer);
                //第一个参数为绑定的寄存器,每个顶点的数据长度为2,浮点型,它会自动帮我们区分,然后是不启用法线辅助功能,间隔为0
                ss2d.Stage2D.gl.vertexAttribPointer(this.shaderProgram.vertexPositionAttribute,2, ss2d.Stage2D.gl.FLOAT, false, 0, 0);


                //推送UV信息到WEBGL状态机
                ss2d.Stage2D.gl.bindBuffer(ss2d.Stage2D.gl.ARRAY_BUFFER, scene.vertexTextureUvdBuffer);
                //上传顶点UV数据的缓存到着色器
                ss2d.Stage2D.gl.vertexAttribPointer(this.shaderProgram.textureCoordAttribute,2, ss2d.Stage2D.gl.FLOAT, false, 0, 0);


                //推送颜色信息到WEBGL状态机
                ss2d.Stage2D.gl.bindBuffer(ss2d.Stage2D.gl.ARRAY_BUFFER, scene.verticesColorBuffer);
                //上传顶点颜色数据的缓存到着色器
                ss2d.Stage2D.gl.vertexAttribPointer(this.shaderProgram.verticesColourAttribute,4, ss2d.Stage2D.gl.FLOAT, false, 0, 0);

                //上传正交矩阵到着色器,不需要归一化
                ss2d.Stage2D.gl.uniformMatrix4fv(ss2d.Stage2D.gl.getUniformLocation(this.shaderProgram, "oRMatrix"),false,this.orMatrix);
            },


            upDataShader : function(scene)
            {
                ss2d.Stage2D.gl.useProgram(this.shaderProgram);

                this.upDataMatrix();
                this.upDataTexture(scene);
                this.upDataVertex(scene);
                this.upDataCache(scene);

            },

            //创建着色器
            getShader : function(gl, code,type) 
            {
                    var shader;
                    if (type=="fs")
                    {
                        shader = ss2d.Stage2D.gl.createShader(ss2d.Stage2D.gl.FRAGMENT_SHADER);
                    }
                    else if (type=="vs") {
                        shader = ss2d.Stage2D.gl.createShader(ss2d.Stage2D.gl.VERTEX_SHADER);
                    }
                    else
                    {
                        return null;
                    }
                    //绑定着色器字符串到到着色器里
                    ss2d.Stage2D.gl.shaderSource(shader, code);
        
                    //编译这个着色器,就是生成这段程序
                    ss2d.Stage2D.gl.compileShader(shader);
        
                    //如果创建不成功,那就是你写错代码了
                    if (!ss2d.Stage2D.gl.getShaderParameter(shader, ss2d.Stage2D.gl.COMPILE_STATUS)) {
                        alert(ss2d.Stage2D.gl.getShaderInfoLog(shader));
                        return null;
                    }

                    //最后返回出这个着色器
                    return shader;
                }
            }
    );
})();
(function()
{
    /**
     * ShaderBlur 模糊效果着色器
     * @class
     */
    ss2d.ShaderBlur = Class
    (
        /** @lends ss2d.ShaderBlur.prototype */
        {
            Extends : ss2d.ShaderBasis,

            /**
             * X轴模糊阈值
             */
            blurX:1.5,

            /**
             * Y轴模糊阈值
             */
            blurY:1.5,

            initialize : function()
            {
                ss2d.ShaderBlur.Super.call(this);
                this.vertexShader = this.getShader(ss2d.Stage2D.gl,
                    this.basisVertexHead+
                        this.basisVertexStart+
                        this.basisVertexEnd,
                    "vs");

                this.fragmentShader = this.getShader(ss2d.Stage2D.gl,
                        this.basisPixelHead+
                        "uniform vec2 value;"+
                        "uniform vec2 textureValue;"+
                        "const float max=1.0;"+
                        "void main()"+
                        "{"+
                            "vec4 vec4Sum = vec4(0.0);"+
                            "for(float i=-max;i<=max;i+=1.0)"+
                            "{"+
                                "for(float j=-max;j<=max;j+=1.0)"+
                                "{"+
                                    "vec2 xy_int = vec2(vTextureUV.x*textureValue.x  , vTextureUV.y*textureValue.y);"+
                                    "vec2 xy_new = vec2(xy_int.x+i*value.x, xy_int.y+j*value.y);"+
                                    "vec2 uv_new = vec2(xy_new.x/textureValue.x, xy_new.y/textureValue.y);"+
                                    "vec4Sum += texture2D(texture,uv_new)*vVertexColor;"+
                                "};"+
                            "};"+
                        "gl_FragColor = vec4Sum*0.111;"+
                        "}","fs");
                this.newShader();

            },

            upDataShader : function(scene)
            {
                ss2d.Stage2D.gl.useProgram(this.shaderProgram);
                this.upDataMatrix();
                this.upDataTexture(scene);
                this.upDataVertex(scene);
                this.upDataCache(scene);
                ss2d.Stage2D.gl.uniform2f(ss2d.Stage2D.gl.getUniformLocation(this.shaderProgram, "textureValue"),scene.m_texture.width,scene.m_texture.height);
                ss2d.Stage2D.gl.uniform2f(ss2d.Stage2D.gl.getUniformLocation(this.shaderProgram, "value"),this.blurX,this.blurY);
            }
        }
    );
})();
(function()
{
    /**
     * ShaderFigure 抽象效果着色器
     * @class
     */
    ss2d.ShaderFigure = Class
    (
        /** @lends ss2d.ShaderFigure.prototype */
        {
            Extends : ss2d.ShaderBasis,
            time:1.0,

            initialize : function()
            {
                ss2d.ShaderFigure.Super.call(this);
                this.vertexShader = this.getShader(ss2d.Stage2D.gl,
                    this.basisVertexHead+
                        this.basisVertexStart+
                        this.basisVertexEnd,
                    "vs");

                this.fragmentShader = this.getShader(ss2d.Stage2D.gl,
                    this.basisPixelHead+
                    "uniform float time;"+
                    "const vec2 mouse=vec2(0.0,0.0);"+
                    "const vec2 resolution=vec2(1024.0,768.0);"+
                        "void main() {"+
                        "vec2 position = vec2("+
                            "mod(gl_FragCoord.x, 64.0),"+
                            "mod(gl_FragCoord.y, 64.0)"+
                        ");"+

                        "float xang = 10.0*time + (gl_FragCoord.y / 20.0);"+
                        "float zang = 10.0*time + (gl_FragCoord.x / 20.0);"+

                        "vec3 whatamidoing = vec3("+
                            "sin(xang)+cos(gl_FragCoord.x/6.0) /2.0 + 0.5,"+
                            "sin(mod(time*4.0, 2.0*3.14159265))/2.0 + 0.5,"+
                            "cos(zang)+sin(gl_FragCoord.y/6.0) /2.0 + 0.5"+
                        ");"+
                        "gl_FragColor = texture2D(texture,vTextureUV)*vVertexColor+vec4(whatamidoing, 1.0);"+
                "}","fs");
                this.newShader();
            },

            upDataShader : function(scene)
            {
                ss2d.Stage2D.gl.useProgram(this.shaderProgram);
                this.upDataMatrix();
                this.upDataTexture(scene);
                this.upDataVertex(scene);
                this.upDataCache(scene);

                this.time+=.01;
                ss2d.Stage2D.gl.uniform1f(ss2d.Stage2D.gl.getUniformLocation(this.shaderProgram,"time"),this.time);

            }
        }
    );
})();
(function()
{
    /**
     * ShaderFlame 火焰效果着色器
     * @class
     */
    ss2d.ShaderFlame = Class
    (
        /** @lends ss2d.ShaderFlame.prototype */
        {
            Extends : ss2d.ShaderBasis,


            initialize : function()
            {
                ss2d.ShaderFlame.Super.call(this);
                this.vertexShader = this.getShader(ss2d.Stage2D.gl,
                    this.basisVertexHead+
                        this.basisVertexStart+
                        this.basisVertexEnd,
                    "vs");

                this.fragmentShader = this.getShader(ss2d.Stage2D.gl,
                    this.basisPixelHead+
                    "void main(void) {"+
                    "vec2  upLeftUV = vec2(vTextureUV.x - 1.0/1.01 , vTextureUV.y - 1.0/1.01);"+
                    "vec4  bkColor = vec4(0.5 , 0.5 , 0.5 , 1.0);"+
                    "vec4  curColor    =  texture2D(texture,vTextureUV);"+
                    "vec4  upLeftColor =  texture2D(texture,upLeftUV);"+
                    //相减得到颜色的差
                    "vec4  delColor = curColor - upLeftColor;"+
                    //需要把这个颜色的差设置
                    "vec2  h = vec2(0.3 * delColor.x + 0.59 * delColor.y + 0.11* delColor.z,0.0);"+
                    "gl_FragColor =  vec4(h.x,h.x,h.x,0.0)+bkColor;"+
                    "}","fs");

                this.newShader();
            }
        }
    );
})();
(function()
{
    /**
     * ShaderFractal 不规则上色效果着色器
     * @class
     */
    ss2d.ShaderFractal = Class
    (
        /** @lends ss2d.ShaderFractal.prototype */
        {
            Extends : ss2d.ShaderBasis,
            time:1.0,

            initialize : function()
            {
                ss2d.ShaderFractal.Super.call(this);
                this.vertexShader = this.getShader(ss2d.Stage2D.gl,
                    this.basisVertexHead+
                        this.basisVertexStart+
                        this.basisVertexEnd,
                    "vs");

                this.fragmentShader = this.getShader(ss2d.Stage2D.gl,
                    this.basisPixelHead+
                    "uniform float time;"+
                    "const vec2 mouse=vec2(0.0,0.0);"+
                    "const vec2 resolution=vec2(1024.0,768.0);"+
                 "vec2 CircleInversion(vec2 vPos, vec2 vOrigin, float fRadius)"+
                "{"+
                    "vec2 vOP = vPos - vOrigin;"+

                    "vOrigin = vOrigin - vOP * fRadius * fRadius / dot(vOP, vOP);"+
                    "vOrigin.x += sin(vOrigin.x * 0.01);"+
                    "vOrigin.y -= cos(vOrigin.y* 0.01);"+

                    "return vOrigin;"+
                "}"+

                "float Parabola( float x, float n )"+
                "{"+
                    "return pow( 2.0*x*(1.0-x), n );"+
                "}"+

                "void main(void)"+
                "{"+
                    "vec2 vPos = gl_FragCoord.xy / resolution.xy;"+
                    "vPos = vPos - 0.5;"+

                    "vPos.x *= resolution.x / resolution.y;"+

                    "vec2 vScale = vec2(1.2);"+
                    "vec2 vOffset = vec2( sin(time * 0.123), atan(time * 0.0567));"+

                    "float l = 0.0;"+
                    "float minl = 10000.0;"+

                    "for(int i=0; i<48; i++)"+
                    "{"+
                        "vPos.x = abs(vPos.x);"+
                        "vPos = vPos * vScale + vOffset;"+

                        "vPos = CircleInversion(vPos, vec2(0.5, 0.5), 0.9);"+

                        "l = length(vPos);"+
                        "minl = min(l, minl);"+
                    "}"+


                    "float t = 4.1 + time * 0.055;"+
                    "vec3 vBaseColour = normalize(vec3(sin(t * 1.790), sin(t * 1.345), sin(t * 1.123)) * 0.5 + 0.5);"+

                    //vBaseColour = vec3(1.0, 0.15, 0.05);

                    "float fBrightness = 11.0;"+

                    "vec3 vColour = vBaseColour * l * l * fBrightness;"+

                    "minl = Parabola(minl, 5.0);"+

                    "vColour *= minl + 0.1;"+

                    "vColour = 1.0 - exp(-vColour);"+

                "gl_FragColor = texture2D(texture,vTextureUV)*vVertexColor+vec4(vColour,1.0);"+
                        "}","fs");
                this.newShader();
            },

            upDataShader : function(scene)
            {
                ss2d.Stage2D.gl.useProgram(this.shaderProgram);
                this.upDataMatrix();
                this.upDataTexture(scene);
                this.upDataVertex(scene);
                this.upDataCache(scene);

                this.time+=.1;
                ss2d.Stage2D.gl.uniform1f(ss2d.Stage2D.gl.getUniformLocation(this.shaderProgram,"time"),this.time);

            }
        }
    );
})();
(function()
{
    /**
     * ShaderGlass 玻璃效果着色器
     * @class
     */
    ss2d.ShaderGlass = Class
    (
        /** @lends ss2d.ShaderGlass.prototype */
        {
            Extends : ss2d.ShaderBasis,

            /**
             * 动画时间步长
             */
            timer:0,

            /**
             * 动画运动速度
             */
            speed:10.0,

            /**
             * 动画运动频率
             */
            frequency:200,

            /**
             *动画运行分辨率
             */
            resolution:30,

            /**
             * 动画噪点阈值
             */
            noisy:0.009,


            initialize : function()
            {
                ss2d.ShaderGlass.Super.call(this);
                this.vertexShader = this.getShader(ss2d.Stage2D.gl,
                    this.basisVertexHead+
                        this.basisVertexStart+
                        this.basisVertexEnd,
                    "vs");

                this.fragmentShader = this.getShader(ss2d.Stage2D.gl,
                    this.basisPixelHead+
                        "uniform vec4 value;"+
                        "void main(void) {"+
                        "vec2 backgroundUv = vTextureUV;"+
                        "backgroundUv.x =backgroundUv.x+sin(value.w /value.x + backgroundUv.x *value.y) *value.z;"+
                        "backgroundUv.y =backgroundUv.y+cos(value.w /value.x + backgroundUv.y *value.y) *value.z;"+
                        "gl_FragColor=texture2D(texture,backgroundUv)*vVertexColor;"+
                        "}","fs");

                this.newShader();
            },

            upDataShader : function(scene)
            {
                ss2d.Stage2D.gl.useProgram(this.shaderProgram);
                this.upDataMatrix();
                this.upDataTexture(scene);
                this.upDataVertex(scene);
                this.upDataCache(scene);

                this.timer+=this.speed;
                ss2d.Stage2D.gl.uniform4f(ss2d.Stage2D.gl.getUniformLocation(this.shaderProgram,"value"),this.frequency,this.resolution,this.noisy,this.timer);
            }
        }
    );
})();
(function()
{
    /**
     * ShaderGLSL 默认着色器
     * @class
     */
    ss2d.ShaderGLSL = Class
    (
        /** @lends ss2d.ShaderGLSL.prototype */
        {
            Extends : ss2d.ShaderBasis,

            initialize : function()
            {
                ss2d.ShaderGLSL.Super.call(this);
                this.vertexShader = this.getShader(ss2d.Stage2D.gl,
                    this.basisVertexHead+
                        this.basisVertexStart+
                        this.basisVertexEnd,
                    "vs");

                this.fragmentShader = this.getShader(ss2d.Stage2D.gl,
                    this.basisPixelHead+
                        this.basisPixelStart+
                        this.basisPixelEnd
                    ,"fs");

                this.newShader();
            }


        }
    );
})();
(function()
{
    /**
     * ShaderGray 灰度效果着色器
     * @class
     */
    ss2d.ShaderGray = Class
    (
        /** @lends ss2d.ShaderGray.prototype */
        {
            Extends : ss2d.ShaderBasis,

            initialize : function()
            {
                ss2d.ShaderGray.Super.call(this);
                this.vertexShader = this.getShader(ss2d.Stage2D.gl,
                    this.basisVertexHead+
                        this.basisVertexStart+
                        this.basisVertexEnd,
                    "vs");

                this.fragmentShader = this.getShader(ss2d.Stage2D.gl,
                        this.basisPixelHead+
                        "void main(void) {"+
                        "gl_FragColor = texture2D(texture,vTextureUV)*vVertexColor;"+
                        "vec4 gray=vec4(1, 1, 1, 1);"+
                        "vec4 grayValue=vec4(0.3,0.59,0.11,1.0);"+
                        "gray.r=gl_FragColor.r*grayValue.x;"+
                        "gray.g=gl_FragColor.g*grayValue.y;"+
                        "gray.b=gl_FragColor.b*grayValue.z;"+
                        "gray.a=gray.r+gray.g+gray.b;"+
                        "gl_FragColor.r=gray.a;"+
                        "gl_FragColor.g=gray.a;"+
                        "gl_FragColor.b=gray.a;"+
                        "}","fs");

                this.newShader();
            }
        }
    );
})();
(function()
{
    /**
     * ShaderHdr HDR效果着色器
     * @class
     */
    ss2d.ShaderHdr = Class
    (
        /** @lends ss2d.ShaderHdr.prototype */
        {
            Extends : ss2d.ShaderBasis,

            /**
             * 饱和度阈值
             */
            mLuminance:1.3,

            /**
             * 初始化着色器
             */
            initialize : function()
            {
                ss2d.ShaderHdr.Super.call(this);
                this.vertexShader = this.getShader(ss2d.Stage2D.gl,
                    this.basisVertexHead+
                        this.basisVertexStart+
                        this.basisVertexEnd,
                    "vs");

                this.fragmentShader = this.getShader(ss2d.Stage2D.gl,
                    this.basisPixelHead+
                        "uniform float mLuminance;"+
                        "vec4 xposure(vec4 _color , float gray , float ex) {"+
                        "float b = ( 4.0 * ex -  1.0 );"+
                        "float a = 1.0 - b;"+
                        "float f = gray * ( a * gray + b );"+
                        "return  _color*f;"+
                        "}"+
                        "void main(void) {"+
                        "vec4 _dsColor = texture2D(texture , vTextureUV);"+
                        "float _lum = 0.3 * _dsColor.x + 0.59 * _dsColor.y + 0.11* _dsColor.z;"+
                        "vec4 vec4Sum = vec4(0.0);"+

                        "for(float i=-1.0;i<=1.0;i+=1.0)"+
                        "{"+
                        "for(float j=-1.0;j<=1.0;j+=1.0)"+
                        "{"+
                        "vec2  intXY = vec2(vTextureUV.x * 1500.0 , vTextureUV.y * 1500.0);"+
                        "vec2 _xy_new = vec2(intXY.x+i , intXY.y+j);"+
                        "vec2 _uv_new = vec2(_xy_new.x/1500.0, _xy_new.y/1500.0);"+
                        "vec4Sum += texture2D(texture,_uv_new);"+
                        "};"+
                        "};"+

                        "vec4 _fColor = vec4Sum*(1.0/9.0);"+
                        "gl_FragColor=xposure(_fColor,_lum,mLuminance)*vVertexColor;"+
                        "}","fs");

                this.newShader();
            },

            upDataShader : function(scene)
            {

                ss2d.Stage2D.gl.useProgram(this.shaderProgram);
                this.upDataMatrix();
                this.upDataTexture(scene);
                this.upDataVertex(scene);
                this.upDataCache(scene);

                ss2d.Stage2D.gl.uniform1f(ss2d.Stage2D.gl.getUniformLocation(this.shaderProgram,"mLuminance"),this.mLuminance);
            }
        }
    );
})();
(function()
{
    /**
     * ShaderHeartbeat 跳动效果着色器
     * @class
     */
    ss2d.ShaderHeartbeat = Class
    (
        /** @lends ss2d.ShaderHeartbeat.prototype */
        {
            Extends : ss2d.ShaderBasis,
            time:1.0,

            /**
             * 初始化着色器
             */
            initialize : function()
            {
                ss2d.ShaderHeartbeat.Super.call(this);
                this.vertexShader = this.getShader(ss2d.Stage2D.gl,
                    this.basisVertexHead+
                        this.basisVertexStart+
                        this.basisVertexEnd,
                    "vs");

                this.fragmentShader = this.getShader(ss2d.Stage2D.gl,
                    this.basisPixelHead+
                    "uniform float time;"+
                    "const vec2 mouse=vec2(0.0,0.0);"+
                        "const vec2 resolution=vec2(1024.0,768.0);"+

                "void main( void ) {"+

                "vec2 e;"+
                "vec2 p = ( gl_FragCoord.xy / resolution.xy ) - 0.5;"+
                "float sx = 0.2 * (p.x + 0.5) * sin( 25.0 * p.x - 10. * time);"+
                "float dy = 1./ ( 50. * abs(p.y - sx));"+
                "dy += 1./ (20. * length(p - vec2(p.x, 0.)));"+
                "gl_FragColor = texture2D(texture,vTextureUV)+vec4( (p.x + 0.5) * dy, 0.5 * dy, dy, 1.0 )*vVertexColor;"+
                        "}","fs");
                this.newShader();
            },

            upDataShader : function(scene)
            {
                ss2d.Stage2D.gl.useProgram(this.shaderProgram);
                this.upDataMatrix();
                this.upDataTexture(scene);
                this.upDataVertex(scene);
                this.upDataCache(scene);

                this.time+=.1;

                ss2d.Stage2D.gl.uniform1f(ss2d.Stage2D.gl.getUniformLocation(this.shaderProgram,"time"),this.time);

            }
        }
    );
})();
(function()
{
    /**
     * ShaderJoint 纹理拼接着色器
     * @class
     */
    ss2d.ShaderJoint = Class
    (
        /** @lends ss2d.ShaderJoint.prototype */
        {
            Extends : ss2d.ShaderBasis,
            initialize : function()
            {
                ss2d.ShaderJoint.Super.call(this);
                this.vertexShader = this.getShader(ss2d.Stage2D.gl,
                    this.basisVertexHead+
                    "varying vec2 jointListvarying;"+
                    "attribute vec2 jointList;"+
                    "void main(void) {"+
                    "jointListvarying=jointList;"+
                    this.basisVertexEnd,
                    "vs");

                this.fragmentShader = this.getShader(ss2d.Stage2D.gl,
                    "precision mediump float;"+
                        "varying vec2 vTextureUV;"+
                        "varying vec2 jointListvarying;"+
                        "varying vec4 vVertexColor;"+
                        "uniform sampler2D texture_0;"+
                        "uniform sampler2D texture_1;"+
                        "uniform sampler2D texture_2;"+
                        "uniform sampler2D texture_3;"+
                        "uniform sampler2D texture_4;"+
                        "uniform sampler2D texture_5;"+
                        "uniform sampler2D texture_6;"+
                        "uniform sampler2D texture_7;"+
                        "void main(void) {"+
                        "if(jointListvarying.x==0.0)"+
                        "{"+
                            "gl_FragColor = texture2D(texture_0,vTextureUV)*vVertexColor;"+
                        "}else if(jointListvarying.x==1.0)"+
                        "{"+
                            "gl_FragColor = texture2D(texture_1,vTextureUV)*vVertexColor;"+
                        "}else if(jointListvarying.x==2.0)"+
                        "{"+
                            "gl_FragColor = texture2D(texture_2,vTextureUV)*vVertexColor;"+
                        "}else if(jointListvarying.x==3.0)"+
                        "{"+
                            "gl_FragColor = texture2D(texture_3,vTextureUV)*vVertexColor;"+
                        "}else if(jointListvarying.x==4.0)"+
                        "{"+
                            "gl_FragColor = texture2D(texture_4,vTextureUV)*vVertexColor;"+
                        "}else if(jointListvarying.x==5.0)"+
                        "{"+
                            "gl_FragColor = texture2D(texture_5,vTextureUV)*vVertexColor;"+
                        "}else if(jointListvarying.x==6.0)"+
                        "{"+
                            "gl_FragColor = texture2D(texture_6,vTextureUV)*vVertexColor;"+
                        "}else if(jointListvarying.x==7.0)"+
                        "{"+
                            "gl_FragColor = texture2D(texture_7,vTextureUV)*vVertexColor;"+
                        "}"+
                        "}",
                    "fs");
                this.newShader();
            },

            upDataShader : function(scene)
            {

                ss2d.Stage2D.gl.useProgram(this.shaderProgram);
                this.upDataMatrix();
                this.upDataVertex(scene);
                this.upDataCache(scene);

                if(!scene.m_isJoint)
                {
                    ss2d.Stage2D.gl.activeTexture(ss2d.Stage2D.gl.TEXTURE0);
                    ss2d.Stage2D.gl.bindTexture(ss2d.Stage2D.gl.TEXTURE_2D, scene.m_texture.texture);
                    ss2d.Stage2D.gl.uniform1i(ss2d.Stage2D.gl.getUniformLocation(this.shaderProgram,"texture_0"),0);
                }
                else
                {
                    for(var i = 0;i < scene.m_texture.length; i++)
                    {
                        ss2d.Stage2D.gl.activeTexture(ss2d.Stage2D.gl.TEXTURE0+i);
                        ss2d.Stage2D.gl.bindTexture(ss2d.Stage2D.gl.TEXTURE_2D, scene.m_texture[i].texture);
                        ss2d.Stage2D.gl.uniform1i(ss2d.Stage2D.gl.getUniformLocation(this.shaderProgram,"texture_"+i), i);
                    }
                }

                //推送拼接缓存到WEBGL状态机
                ss2d.Stage2D.gl.bindBuffer(ss2d.Stage2D.gl.ARRAY_BUFFER, scene.verticesJointBuffer);
                //上传拼接数据到顶点缓存
                ss2d.Stage2D.gl.bufferData(ss2d.Stage2D.gl.ARRAY_BUFFER, scene.m_jointList, ss2d.Stage2D.gl.STREAM_DRAW);

                //上传拼接数据的缓存到着色器
                ss2d.Stage2D.gl.bindBuffer(ss2d.Stage2D.gl.ARRAY_BUFFER, scene.verticesJointBuffer);
                //第一个参数为绑定的寄存器,每个顶点的数据长度为2,浮点型,它会自动帮我们区分,然后是不启用法线辅助功能,间隔为0
                ss2d.Stage2D.gl.vertexAttribPointer(this.shaderProgram.verticesjointAttribute,2, ss2d.Stage2D.gl.FLOAT, false, 0, 0);
            }
        }
    );
})();
(function()
{
    /**
     * ShaderLaser 激光效果着色器
     * @class
     */
    ss2d.ShaderLaser = Class
    (
        /** @lends ss2d.ShaderLaser.prototype */
        {
            Extends : ss2d.ShaderBasis,


            time:1.0,

            /**
             * 初始化着色器
             */
            initialize : function()
            {
                ss2d.ShaderLaser.Super.call(this);
                this.vertexShader = this.getShader(ss2d.Stage2D.gl,
                    this.basisVertexHead+
                    this.basisVertexStart+
                    this.basisVertexEnd,
                "vs");

                this.fragmentShader = this.getShader(ss2d.Stage2D.gl,
                    this.basisPixelHead+
                    "uniform float time;"+
                    "const vec2 mouse=vec2(0.0,0.0);"+
                    "const vec2 resolution=vec2(1024.0,768.0);"+

                "const vec3 ORANGE = vec3(1.4, 0.8, 0.4);"+
                "const vec3 BLUE = vec3(0.5, 0.9, 1.3);"+
                "const vec3 GREEN = vec3(0.9, 1.4, 0.4);"+
                "const vec3 RED = vec3(1.8, 0.4, 0.3);"+

                "void main() {"+
                "float x, y, xpos, ypos;"+
                "float t = time * 10.0;"+
                "vec3 c = vec3(0.0);"+

                "xpos = (gl_FragCoord.x / resolution.x);"+
                "ypos = (gl_FragCoord.y / resolution.y);"+

                "x = xpos;"+
                "for (float i = 0.0; i < 8.0; i += 1.0){"+
                    "for(float j = 0.0; j < 2.0; j += 1.0){"+
                        "y = ypos"+
                            "+ (0.30 * sin(x * 2.000 +( i * 1.5 + j) * 0.4 + t * 0.050)"+
                            "+ 0.100 * cos(x * 6.350 + (i  + j) * 0.7 + t * 0.050 * j)"+
                            "+ 0.024 * sin(x * 12.35 + ( i + j * 4.0 ) * 0.8 + t * 0.034 * (8.0 *  j))"+
                            "+ 0.5);"+
                        "c += vec3(1.0 - pow(clamp(abs(1.0 - y) * 5.0, 0.0,1.0), 0.25));"+
                    "}"+
                "}"+
                "c *= mix("+
                    "mix(ORANGE, BLUE, xpos)"+
                    ", mix(GREEN, RED, xpos)"+
                    ",(sin(t * 0.02) + 1.0) * 0.45"+
                ") * 0.5;"+

                "gl_FragColor = texture2D(texture,vTextureUV)*vVertexColor+vec4(c,1.0);"+
                        "}","fs");

                this.newShader();
            },

            upDataShader : function(scene)
            {
                ss2d.Stage2D.gl.useProgram(this.shaderProgram);
                this.upDataMatrix();
                this.upDataTexture(scene);
                this.upDataVertex(scene);
                this.upDataCache(scene);

                this.time+=.1;
                ss2d.Stage2D.gl.uniform1f(ss2d.Stage2D.gl.getUniformLocation(this.shaderProgram,"time"),this.time);

            }
        }
    );
})();
(function()
{
    /**
     * ShaderLight 2D灯光效果着色器
     * @class
     */
    ss2d.ShaderLight = Class
    (
        /** @lends ss2d.ShaderLight.prototype */
        {
            Extends : ss2d.ShaderBasis,

            /**
             * 灯光X轴位置
             */
            lightX:.5,

            /**
             * 灯光Y轴位置
             */
            lightY:-.5,

            /**
             * 灯光强度
             */
            lightScale:10,

            /**
             * 初始化着色器
             */
            initialize : function()
            {
                ss2d.ShaderLight.Super.call(this);
                this.vertexShader = this.getShader(ss2d.Stage2D.gl,
                    this.basisVertexHead+
                        this.basisVertexStart+
                        this.basisVertexEnd,
                    "vs");

                this.fragmentShader = this.getShader(ss2d.Stage2D.gl,
                           this.basisPixelHead+
                        "uniform vec3 lightingValue;" +
                        "void main() {" +
                        "vec3 lighting=vec3(1, 1, 1);"+
                        "lighting.x=abs(lightingValue.x-vTextureUV.x);"+
                        "lighting.y=abs(lightingValue.y-vTextureUV.y);"+
                        "lighting.z=sqrt(lighting.x*lighting.x+lighting.y*lighting.y);"+
                        "gl_FragColor=texture2D(texture,vTextureUV)/(lighting.z*lightingValue.z)*vVertexColor;"+
                        "}","fs");

                this.newShader();
            },

            upDataShader : function(scene)
            {

                ss2d.Stage2D.gl.useProgram(this.shaderProgram);
                this.upDataMatrix();
                this.upDataTexture(scene);
                this.upDataVertex(scene);
                this.upDataCache(scene);
                ss2d.Stage2D.gl.uniform3f(ss2d.Stage2D.gl.getUniformLocation(this.shaderProgram,"lightingValue"),this.lightX,this.lightY,this.lightScale);
            }
        }
    );
})();
(function()
{
    /**
     * ShaderMosaic 马赛克效果着色器
     * @class
     */
    ss2d.ShaderMosaic = Class
    (
        /** @lends ss2d.ShaderMosaic.prototype */
        {
            Extends : ss2d.ShaderBasis,

            /**
             * 噪点阈值
             */
            noisy:10,


            /**
             * 初始化着色器
             */
            initialize : function()
            {
                ss2d.ShaderMosaic.Super.call(this);
                this.vertexShader = this.getShader(ss2d.Stage2D.gl,
                    this.basisVertexHead+
                        this.basisVertexStart+
                        this.basisVertexEnd,
                    "vs");

                this.fragmentShader = this.getShader(ss2d.Stage2D.gl,
                    this.basisPixelHead+
                        "uniform vec3 value;"+
                        "void main(void) {"+
                        "vec2  intXY = vec2(vTextureUV.x * value.x , vTextureUV.y * value.y);"+
                        "vec2  XYMosaic = vec2(ceil(intXY.x/value.z) *value.z,ceil(intXY.y/value.z) * value.z);"+
                        "vec2  UVMosaic = vec2(XYMosaic.x/value.x , XYMosaic.y/value.y);"+
                        "gl_FragColor=texture2D(texture,UVMosaic)*vVertexColor;"+
                        "}","fs");

                this.newShader();
            },



            upDataShader : function(scene)
            {

                ss2d.Stage2D.gl.useProgram(this.shaderProgram);
                this.upDataMatrix();
                this.upDataTexture(scene);
                this.upDataVertex(scene);
                this.upDataCache(scene);

                ss2d.Stage2D.gl.uniform3f(ss2d.Stage2D.gl.getUniformLocation(this.shaderProgram,"value"),scene.m_texture.width,scene.m_texture.height,this.noisy);

            }
        }
    );
})();
(function()
{
    /**
     * ShaderNet 网状效果着色器
     * @class
     */
    ss2d.ShaderNet = Class
    (
        /** @lends ss2d.ShaderNet.prototype */
        {
            Extends : ss2d.ShaderBasis,



            time:1.0,

            /**
             * 初始化着色器
             */
            initialize : function()
            {
                ss2d.ShaderNet.Super.call(this);

                this.vertexShader = this.getShader(ss2d.Stage2D.gl,
                    this.basisVertexHead+
                        this.basisVertexStart+
                        this.basisVertexEnd,
                    "vs");

                this.fragmentShader = this.getShader(ss2d.Stage2D.gl,
                    this.basisPixelHead+
                    "uniform float time;"+
                    "const vec2 mouse=vec2(0.0,0.0);"+
                    "const vec2 resolution=vec2(1024.0,768.0);"+

                "const vec3 ORANGE = vec3(1.4, 0.1, 0.3);"+
                "const vec3 BLUE = vec3(0.5, 0.1, 1.3);"+
                "const vec3 GREEN = vec3(1.0, 0.4, 0.4);"+
                "const vec3 RED = vec3(1.8, 0.4, 0.8);"+

                "void main() {"+
                "float x, y, xpos, ypos;"+
               "float t = time * 1.5;"+
                "vec3 c = vec3(0.0);"+

                "ypos = (gl_FragCoord.x / resolution.x);"+
                "xpos = (gl_FragCoord.y / resolution.y);"+

                "x = xpos;"+
                "for (float i = 0.0; i < 8.0; i += 1.0) {"+
                    "for(float j = 0.0; j < 2.0; j += 1.0){"+
                        "y = ypos"+
                            "+ (0.30 * sin(x * 2.000 +( i * 1.5 + j) * 0.4 + t * 0.050)"+
                            "+ 0.100 * cos(x * 6.350 + (i  + j) * 0.7 + t * 0.050 * j)"+
                            "+ 0.024 * sin(x * 12.35 + ( i + j * 4.0 ) * 0.8 + t * 0.034 * (8.0 *  j))"+
                            "+ 0.5);"+

                        "c += vec3(1.0 - pow(clamp(abs(1.0 - y) * 5.0, 0.0,1.0), 0.25));"+
                    "}"+
                "}"+

                "c *= mix("+
                    "mix(ORANGE, BLUE, xpos)"+
                    ", mix(GREEN, RED, xpos)"+
                    ",(sin(t * 0.02) + 1.0) * 0.45"+
                ") * 0.5;"+
                "gl_FragColor = texture2D(texture,vTextureUV)*vVertexColor+vec4(c,1.0);"+
                        "}","fs");

               this.newShader();
            },

            upDataShader : function(scene)
            {

                ss2d.Stage2D.gl.useProgram(this.shaderProgram);
                this.upDataMatrix();
                this.upDataTexture(scene);
                this.upDataVertex(scene);
                this.upDataCache(scene);

                this.time+=.1;

                ss2d.Stage2D.gl.uniform1f(ss2d.Stage2D.gl.getUniformLocation(this.shaderProgram,"time"),this.time);

            }
        }
    );
})();
(function()
{
    /**
     * ShaderQuick 快速渲染着色器
     * @class
     */
    ss2d.ShaderQuick = Class
    (
        /** @lends ss2d.ShaderQuick.prototype */
        {

            Extends : ss2d.ShaderBasis,
            /**
             * 初始化着色器
             */
            initialize : function()
            {
                ss2d.ShaderQuick.Super.call(this);

                this.vertexShader = this.getShader(ss2d.Stage2D.gl,
                    this.basisVertexHead+
                        this.basisVertexStart+
                        this.basisVertexEnd,
                    "vs");

                this.fragmentShader = this.getShader(ss2d.Stage2D.gl,
                    "precision mediump float;"+
                        "varying vec2 vTextureUV;"+
                        "varying vec4 vVertexColor;"+
                        "uniform sampler2D texture;"+
                        "void main(void) {"+
                        "gl_FragColor = texture2D(texture,vTextureUV);"+
                        "}","fs");

                this.newShader();
            }
        }
    );
})();
(function()
{
    /**
     * ShaderRelief 浮雕效果着色器
     * @class
     */
    ss2d.ShaderRelief = Class
    (
        /** @lends ss2d.ShaderRelief.prototype */
        {
            Extends : ss2d.ShaderBasis,

            /**
             * 初始化着色器
             */
            initialize : function()
            {
                ss2d.ShaderRelief.Super.call(this);
                this.vertexShader = this.getShader(ss2d.Stage2D.gl,
                    this.basisVertexHead+
                        this.basisVertexStart+
                        this.basisVertexEnd,
                    "vs");

                this.fragmentShader = this.getShader(ss2d.Stage2D.gl,
                    this.basisPixelHead+
                    "void main(void) {"+
                    "vec2  upLeftUV = vec2(vTextureUV.x - 1.0/1.01 , vTextureUV.y - 1.0/1.01);"+
                    "vec4  bkColor = vec4(0.5 , 0.5 , 0.5 , 1.0);"+
                    "vec4  curColor    =  texture2D(texture,vTextureUV);"+
                    "vec4  upLeftColor =  texture2D(texture,upLeftUV);"+
                    //相减得到颜色的差
                    "vec4  delColor = curColor - upLeftColor;"+
                    //需要把这个颜色的差设置
                    "vec2  h = vec2(0.3 * delColor.x + 0.59 * delColor.y + 0.11* delColor.z,0.0);"+
                    "gl_FragColor =  vec4(h.x,h.x,h.x,0.0)+bkColor;"+
                    "}","fs");

                this.newShader();
            }
        }
    );
})();
(function()
{
    ss2d.AbstractLoader = Class
    (
        {
            Extends:ss2d.EventDispatcher,

            STATIC:
            {
                //////////////////////////////////////////////////////////////////////////
                //  public static property
                //////////////////////////////////////////////////////////////////////////

                FILE_PATTERN : /^(?:(\w+:)\/{2}(\w+(?:\.\w+)*\/?)|(.{0,2}\/{1}))?([/.]*?(?:[^?]+)?\/)?((?:[^/?]+)\.(\w+))(?:\?(\S+)?)?$/,
                PATH_PATTERN : /^(?:(\w+:)\/{2})|(.{0,2}\/{1})?([/.]*?(?:[^?]+)?\/?)?$/
            },

            //////////////////////////////////////////////////////////////////////////
            //  private property
            //////////////////////////////////////////////////////////////////////////

            _item : null,

            //////////////////////////////////////////////////////////////////////////
            //  public property
            //////////////////////////////////////////////////////////////////////////

            loaded : false,
            canceled : false,
            progress : 0,

            ////////////////////////////////////////////////////////////////////////////
            //  constructor
            ////////////////////////////////////////////////////////////////////////////

            initialize:function()
            {

            },

            ////////////////////////////////////////////////////////////////////////////
            //  public methods
            ////////////////////////////////////////////////////////////////////////////

            getItem : function()
            {
                return this._item;
            },

            load : function()
            {

            },

            close : function()
            {

            },

            buildPath : function(src, data)
            {
                if (data == null) return src;
                var query = [];
                var idx = src.indexOf('?');
                if (idx != -1)
                {
                    var q = src.slice(idx+1);
                    query = query.concat(q.split('&'));
                }
                if (idx != -1)
                {
                    return src.slice(0, idx) + '?' + this._formatQueryString(data, query);
                }
                else
                {
                    return src + '?' + this._formatQueryString(data, query);
                }
            },

            ////////////////////////////////////////////////////////////////////////////
            //  private methods
            ////////////////////////////////////////////////////////////////////////////

            _isCanceled : function()
            {
                if (window.ss2d == null || this.canceled)
                {
                    return true;
                }
                return false;
            },

            _sendLoadStart : function()
            {
                if (this._isCanceled()) { return; }
                this.dispatchEvent("loadstart");
            },

            _sendProgress : function(value)
            {
                if (this._isCanceled()) { return; }
                var event = null;
                if (typeof(value) == "number")
                {
                    this.progress = value;
                    event = new ss2d.Event("progress");
                    event.loaded = this.progress;
                    event.total = 1;
                }
                else
                {
                    event = value;
                    this.progress = value.loaded / value.total;
                    if (isNaN(this.progress) || this.progress == Infinity) { this.progress = 0; }
                }
                event.progress = this.progress;
                this.hasEventListener("progress") && this.dispatchEvent(event);
            },

            _sendComplete : function()
            {
                if (this._isCanceled()) { return; }
                this.dispatchEvent("complete");
            },

            _sendError : function(event)
            {
                if (this._isCanceled() || !this.hasEventListener("error")) { return; }
                if (event == null)
                {
                    event = new ss2d.Event("error");
                }
                this.dispatchEvent(event);
            },

            _parseURI : function(path)
            {
                if (!path) { return null; }
                return path.match(ss2d.AbstractLoader.FILE_PATTERN);
            },

            _parsePath : function(path)
            {
                if (!path) { return null; }
                return path.match(ss2d.AbstractLoader.PATH_PATTERN);
            },

            _formatQueryString : function(data, query)
            {
                if (data == null)
                {
                    throw new Error('You must specify data.');
                }
                var params = [];
                for (var n in data)
                {
                    params.push(n+'='+escape(data[n]));
                }
                if (query)
                {
                    params = params.concat(query);
                }
                return params.join('&');
            },

            _isCrossDomain : function(item)
            {
                var target = document.createElement("a");
                target.href = item.src;

                var host = document.createElement("a");
                host.href = location.href;

                var crossdomain = (target.hostname != "") &&
                        (target.port != host.port ||
                        target.protocol != host.protocol ||
                        target.hostname != host.hostname);
                return crossdomain;
            },

            _isLocal : function(item)
            {
                var target = document.createElement("a");
                target.href = item.src;
                return target.hostname == "" && target.protocol == "file:";
            }
        }
    );
})();
(function()
{
    /**
     * 队列加载器 用于加载多个游戏用资源。
     * <br/>演示地址:http://sirius2d.com/demos/d_1/
     * @type {Class}
     */
    ss2d.LoadQueue = Class
    (
        /** @lends ss2d.LoadQueue.prototype */
        {
            Extends:ss2d.AbstractLoader,

            ////////////////////////////////////////////////////////////////////////////
            //  static  property
            ////////////////////////////////////////////////////////////////////////////

            STATIC:
            {
                LOAD_TIMEOUT : 0,
                BINARY : "binary",
                CSS : "css",
                IMAGE : "image",
                JAVASCRIPT : "javascript",
                JSON : "json",
                JSONP : "jsonp",
                MANIFEST : "manifest",
                SOUND : "sound",
                SVG : "svg",
                TEXT : "text",
                XML : "xml",
                HTML: "html",
                POST : 'POST',
                GET : 'GET',
                loadTimeout : 8000,

                isBinary : function(type)
                {
                    switch (type)
                    {
                        case this.IMAGE:
                        case this.BINARY:
                            return true;
                        default:
                            return false;
                    }
                },

                isText : function(type)
                {
                    switch (type)
                    {
                        case this.TEXT:
                        case this.JSON:
                        case this.MANIFEST:
                        case this.XML:
                        case this.HTML:
                        case this.CSS:
                        case this.SVG:
                        case this.JAVASCRIPT:
                            return true;
                        default:
                            return false;
                    }
                }
            },

            //////////////////////////////////////////////////////////////////////////
            //  private property
            //////////////////////////////////////////////////////////////////////////

            _basePath : null,
            _crossOrigin : "",
            _typeCallbacks : null,
            _extensionCallbacks : null,
            _loadStartWasDispatched : false,
            _maxConnections : 1,
            _currentlyLoadingScript : null,
            _currentLoads : null,
            _loadQueue : null,
            _loadQueueBackup : null,
            _loadItemsById : null,
            _loadItemsBySrc : null,
            _loadedResults : null,
            _loadedRawResults : null,
            _numItems : 0,
            _numItemsLoaded : 0,
            _scriptOrder : null,
            _loadedScripts : null,
            _paused : false,

            //////////////////////////////////////////////////////////////////////////
            //  public property
            //////////////////////////////////////////////////////////////////////////

            useXHR : true,
            stopOnError : false,
            maintainScriptOrder : true,
            next : null,

            ////////////////////////////////////////////////////////////////////////////
            //  constructor
            ////////////////////////////////////////////////////////////////////////////

            initialize : function(useXHR, basePath, crossOrigin)
            {
                this._numItems = this._numItemsLoaded = 0;
                this._paused = false;
                this._loadStartWasDispatched = false;

                this._currentLoads = [];
                this._loadQueue = [];
                this._loadQueueBackup = [];
                this._scriptOrder = [];
                this._loadedScripts = [];
                this._loadItemsById = {};
                this._loadItemsBySrc = {};
                this._loadedResults = {};
                this._loadedRawResults = {};

                // Callbacks for plugins
                this._typeCallbacks = {};
                this._extensionCallbacks = {};

                this._basePath = basePath;
                this.setUseXHR(useXHR);
                this._crossOrigin = (crossOrigin === true)
                    ? "Anonymous" : (crossOrigin === false || crossOrigin == null)
                    ? "" : crossOrigin;
            },

            setUseXHR : function(value)
            {
                // Determine if we can use XHR. XHR defaults to TRUE, but the browser may not support it.
                //TODO: Should we be checking for the other XHR types? Might have to do a try/catch on the different types similar to createXHR.
                this.useXHR = (value != false && window.XMLHttpRequest != null);
                return this.useXHR;
            },

            removeAll : function()
            {
                this.remove();
            },

            remove : function(idsOrUrls)
            {
                var args = null;

                if (idsOrUrls && !(idsOrUrls instanceof Array))
                {
                    args = [idsOrUrls];
                }
                else if (idsOrUrls)
                {
                    args = idsOrUrls;
                }
                else if (arguments.length > 0)
                {
                    return;
                }

                var itemsWereRemoved = false;

                // Destroy everything
                if (!args)
                {
                    this.close();
                    for (var n in this._loadItemsById)
                    {
                        this._disposeItem(this._loadItemsById[n]);
                    }
                    this.init(this.useXHR);

                    // Remove specific items
                }
                else
                {
                    while (args.length)
                    {
                        var item = args.pop();
                        var r = this.getResult(item);

                        //Remove from the main load Queue
                        for (i = this._loadQueue.length-1;i>=0;i--)
                        {
                            loadItem = this._loadQueue[i].getItem();
                            if (loadItem.id == item || loadItem.src == item)
                            {
                                this._loadQueue.splice(i,1)[0].cancel();
                                break;
                            }
                        }

                        //Remove from the backup queue
                        for (i = this._loadQueueBackup.length-1;i>=0;i--)
                        {
                            loadItem = this._loadQueueBackup[i].getItem();
                            if (loadItem.id == item || loadItem.src == item)
                            {
                                this._loadQueueBackup.splice(i,1)[0].cancel();
                                break;
                            }
                        }

                        if (r)
                        {
                            delete this._loadItemsById[r.id];
                            delete this._loadItemsBySrc[r.src];
                            this._disposeItem(r);
                        }
                        else
                        {
                            for (var i=this._currentLoads.length-1;i>=0;i--)
                            {
                                var loadItem = this._currentLoads[i].getItem();
                                if (loadItem.id == item || loadItem.src == item)
                                {
                                    this._currentLoads.splice(i,1)[0].cancel();
                                    itemsWereRemoved = true;
                                    break;
                                }
                            }
                        }
                    }

                    // If this was called during a load, try to load the next item.
                    if (itemsWereRemoved)
                    {
                        this._loadNext();
                    }
                }
            },

            reset : function()
            {
                this.close();
                for (var n in this._loadItemsById)
                {
                    this._disposeItem(this._loadItemsById[n]);
                }

                //Reset the queue to its start state
                var a = [];
                for (var i=0, l=this._loadQueueBackup.length; i<l; i++)
                {
                    a.push(this._loadQueueBackup[i].getItem());
                }

                this.loadManifest(a, false);
            },

            installPlugin : function(plugin)
            {
                if (plugin == null || plugin.getPreloadHandlers == null) { return; }
                var map = plugin.getPreloadHandlers();
                map.scope = plugin;

                if (map.types != null)
                {
                    for (var i=0, l=map.types.length; i<l; i++)
                    {
                        this._typeCallbacks[map.types[i]] = map;
                    }
                }
                if (map.extensions != null)
                {
                    for (i=0, l=map.extensions.length; i<l; i++)
                    {
                        this._extensionCallbacks[map.extensions[i]] = map;
                    }
                }
            },

            setMaxConnections : function (value)
            {
                this._maxConnections = value;
                if (!this._paused && this._loadQueue.length > 0)
                {
                    this._loadNext();
                }
            },

            loadFile : function(file, loadNow, basePath)
            {
                if (file == null)
                {
                    var event = new ss2d.Event("error");
                    event.text = "PRELOAD_NO_FILE";
                    this._sendError(event);
                    return;
                }
                this._addItem(file, null, basePath);

                if (loadNow !== false)
                {
                    this.setPaused(false);
                }
                else
                {
                    this.setPaused(true);
                }
            },

            /**
             * 载入加载队列
             * @param manifest 加载队列
             * @param loadNow
             * @param basePath
             */
            loadManifest : function(manifest, loadNow, basePath)
            {
                var fileList = null;
                var path = null;

                // Array-based list of items
                if (manifest instanceof Array)
                {
                    if (manifest.length == 0)
                    {
                        var event = new ss2d.Event("error");
                        event.text = "PRELOAD_MANIFEST_EMPTY";
                        this._sendError(event);
                        return;
                    }
                    fileList = manifest;

                    // String-based. Only file manifests can be specified this way. Any other types will cause an error when loaded.
                }
                else if (typeof(manifest) === "string")
                {
                    fileList = [{
                        src: manifest,
                        type: ss2d.LoadQueue.MANIFEST
                    }];

                }
                else if (typeof(manifest) == "object")
                {

                    // An object that defines a manifest path
                    if (manifest.src !== undefined)
                    {
                        if (manifest.type == null)
                        {
                            manifest.type = ss2d.LoadQueue.MANIFEST;
                        }
                        else if (manifest.type != ss2d.LoadQueue.MANIFEST)
                        {
                            var event = new ss2d.Event("error");
                            event.text = "PRELOAD_MANIFEST_ERROR";
                            this._sendError(event);
                        }
                        fileList = [manifest];
                        // An object that defines a manifest
                    }
                    else if (manifest.manifest !== undefined)
                    {
                        fileList = manifest.manifest;
                        path = manifest.path;
                    }
                    // Unsupported. This will throw an error.
                }
                else
                {
                    var event = new ss2d.Event("error");
                    event.text = "PRELOAD_MANIFEST_NULL";
                    this._sendError(event);
                    return;
                }

                for (var i=0, l=fileList.length; i<l; i++)
                {
                    this._addItem(fileList[i], path, basePath);
                }

                if (loadNow !== false)
                {
                    this.setPaused(false);
                }
                else
                {
                    this.setPaused(true);
                }
            },

            load : function()
            {
                this.setPaused(false);
            },

            getItem : function(value)
            {
                return this._loadItemsById[value] || this._loadItemsBySrc[value];
            },

            getResult : function(value, rawResult)
            {
                var item = this._loadItemsById[value] || this._loadItemsBySrc[value];
                if (item == null) { return null; }
                var id = item.id;
                if (rawResult && this._loadedRawResults[id])
                {
                    return this._loadedRawResults[id];
                }
                return this._loadedResults[id];
            },

            setPaused : function(value)
            {
                this._paused = value;
                if (!this._paused)
                {
                    this._loadNext();
                }
            },

            close : function()
            {
                while (this._currentLoads.length)
                {
                    this._currentLoads.pop().cancel();
                }
                this._scriptOrder.length = 0;
                this._loadedScripts.length = 0;
                this.loadStartWasDispatched = false;
            },

            _addItem : function(value, path, basePath)
            {
                var item = this._createLoadItem(value, path, basePath); // basePath and manifest path are added to the src.
                if (item == null) { return; } // Sometimes plugins or types should be skipped.
                var loader = this._createLoader(item);
                if (loader != null)
                {
                    this._loadQueue.push(loader);
                    this._loadQueueBackup.push(loader);

                    this._numItems++;
                    this._updateProgress();

                    // Only worry about script order when using XHR to load scripts. Tags are only loading one at a time.
                    if (this.maintainScriptOrder
                        && item.type == ss2d.LoadQueue.JAVASCRIPT
                        && loader instanceof ss2d.XHRLoader)
                    {
                        this._scriptOrder.push(item);
                        this._loadedScripts.push(null);
                    }
                }
            },

            _createLoadItem : function(value, path, basePath)
            {
                var item = null;
                // Create/modify a load item
                switch(typeof(value))
                {
                    case "string":
                        item = { src: value };
                        break;
                    case "object":
                        if (window.HTMLAudioElement && value instanceof window.HTMLAudioElement)
                        {
                            item = {
                                tag: value,
                                src: item.tag.src,
                                type: ss2d.LoadQueue.SOUND
                            };
                        }
                        else
                        {
                            item = value;
                        }
                        break;
                    default:
                        return null;
                }

                // Determine Extension, etc.
                var match = this._parseURI(item.src);
                if (match != null) { item.ext = match[6]; }
                if (item.type == null)
                {
                    item.type = this._getTypeByExtension(item.ext);
                }

                // Inject path & basePath
                var bp = ""; // Store the generated basePath
                var useBasePath = basePath || this._basePath;
                var autoId = item.src;
                if (match && match[1] == null && match[3] == null)
                {
                    if (path)
                    {
                        bp = path;
                        var pathMatch = this._parsePath(path);
                        autoId = path + autoId;
                        // Also append basePath
                        if (useBasePath != null && pathMatch && pathMatch[1] == null && pathMatch[2] == null) {
                            bp = useBasePath + bp;
                        }
                    }
                    else if (useBasePath != null)
                    {
                        bp = useBasePath;
                    }
                }
                item.src = bp + item.src;
                item.path = bp;

                if (item.type == ss2d.LoadQueue.JSON || item.type == ss2d.LoadQueue.MANIFEST)
                {
                    item._loadAsJSONP = (item.callback != null);
                }

                if (item.type == ss2d.LoadQueue.JSONP && item.callback == null)
                {
                    throw new Error('callback is required for loading JSONP requests.');
                }

                // Create a tag for the item. This ensures there is something to either load with or populate when finished.
                if (item.tag === undefined || item.tag === null)
                {
                    item.tag = this._createTag(item);
                }

                // If there's no id, set one now.
                if (item.id === undefined || item.id === null || item.id === "") {
                    item.id = autoId;
                }

                // Give plugins a chance to modify the loadItem:
                var customHandler = this._typeCallbacks[item.type] || this._extensionCallbacks[item.ext];
                if (customHandler)
                {
                    // Plugins are now passed both the full source, as well as a combined path+basePath (appropriately)
                    var result = customHandler.callback.call(customHandler.scope, item.src, item.type, item.id, item.data,
                        bp, this);
                    // NOTE: BasePath argument is deprecated. We pass it to plugins.allow SoundJS to modify the file. to sanymore. The full path is sent to the plugin

                    // The plugin will handle the load, or has canceled it. Ignore it.
                    if (result === false)
                    {
                        return null;

                        // Load as normal:
                    }
                    else if (result === true)
                    {
                        // Do Nothing

                        // Result is a loader class:
                    }
                    else
                    {
                        if (result.src != null) { item.src = result.src; }
                        if (result.id != null) { item.id = result.id; } // TODO: Evaluate this. An overridden ID could be problematic
                        if (result.tag != null) { // Assumes that the returned tag either has a load method or a src setter.
                            item.tag = result.tag;
                        }
                        if (result.completeHandler != null) { item.completeHandler = result.completeHandler; }

                        // Allow type overriding:
                        if (result.type) { item.type = result.type; }

                        // Update the extension in case the type changed:
                        match = this._parseURI(item.src);
                        if (match != null && match[6] != null) {
                            item.ext = match[6].toLowerCase();
                        }
                    }
                }

                // Store the item for lookup. This also helps clean-up later.
                this._loadItemsById[item.id] = item;
                this._loadItemsBySrc[item.src] = item;

                return item;
            },

            _createLoader : function(item)
            {
                // Initially, try and use the provided/supported XHR mode:
                var useXHR = this.useXHR;

                // Determine the XHR usage overrides:
                switch (item.type)
                {
                    case ss2d.LoadQueue.JSON:
                    case ss2d.LoadQueue.MANIFEST:
                        useXHR = !item._loadAsJSONP;
                        break;
                    case ss2d.LoadQueue.XML:
                    case ss2d.LoadQueue.TEXT:
                        useXHR = true; // Always use XHR2 with text/XML
                        break;
                    case ss2d.LoadQueue.SOUND:
                    case ss2d.LoadQueue.JSONP:
                        useXHR = false; // Never load audio using XHR. WebAudio will provide its own loader.
                        break;
                    case null:
                        return null;
                    // Note: IMAGE, CSS, SCRIPT, SVG can all use TAGS or XHR.
                }

                if (useXHR)
                {
                    return new ss2d.XHRLoader(item, this._crossOrigin);
                }
                else
                {
                    return new ss2d.TagLoader(item);
                }
            },

            _loadNext : function()
            {
                if (this._paused) { return; }

                // Only dispatch loadstart event when the first file is loaded.
                if (!this._loadStartWasDispatched)
                {
                    this._sendLoadStart();
                    this._loadStartWasDispatched = true;
                }

                // The queue has completed.
                if (this._numItems == this._numItemsLoaded)
                {
                    this.loaded = true;
                    this._sendComplete();

                    // Load the next queue, if it has been defined.
                    if (this.next && this.next.load)
                    {
                        this.next.load();
                    }
                }
                else
                {
                    this.loaded = false;
                }

                // Must iterate forwards to load in the right order.
                for (var i=0; i<this._loadQueue.length; i++)
                {
                    if (this._currentLoads.length >= this._maxConnections) { break; }
                    var loader = this._loadQueue[i];

                    // Determine if we should be only loading one at a time:
                    if (this.maintainScriptOrder
                        && loader instanceof ss2d.TagLoader
                        && loader.getItem().type == ss2d.LoadQueue.JAVASCRIPT)
                    {
                        if (this._currentlyLoadingScript) { continue; } // Later items in the queue might not be scripts.
                        this._currentlyLoadingScript = true;
                    }
                    this._loadQueue.splice(i, 1);
                    i--;
                    this._loadItem(loader);
                }
            },

            _loadItem : function(loader)
            {
                loader.on("progress", this._handleProgress, this);
                loader.on("complete", this._handleFileComplete, this);
                loader.on("error", this._handleFileError, this);
                this._currentLoads.push(loader);
                this._sendFileStart(loader.getItem());
                loader.load();
            },

            _handleFileError : function(event)
            {
                var loader = event.target;
                this._numItemsLoaded++;
                this._updateProgress();

                var newEvent = new ss2d.Event("error");
                newEvent.text = "FILE_LOAD_ERROR";
                newEvent.item = loader.getItem();
                // TODO: Propagate actual error message.

                this._sendError(newEvent);

                if (!this.stopOnError)
                {
                    this._removeLoadItem(loader);
                    this._loadNext();
                }
            },

            _handleFileComplete : function(event)
            {
                var loader = event.target;
                var item = loader.getItem();
                this._loadedResults[item.id] = loader.getResult();
                if (loader instanceof ss2d.XHRLoader)
                {
                    this._loadedRawResults[item.id] = loader.getResult(true);
                }
                this._removeLoadItem(loader);
                // Ensure that script loading happens in the right order.
                if (this.maintainScriptOrder && item.type == ss2d.LoadQueue.JAVASCRIPT)
                {
                    if (loader instanceof ss2d.TagLoader)
                    {
                        this._currentlyLoadingScript = false;
                    }
                    else
                    {
                        this._loadedScripts[ss2d.indexOf(this._scriptOrder, item)] = item;
                        this._checkScriptLoadOrder(loader);
                        return;
                    }
                }
                // Clean up the load item
                delete item._loadAsJSONP;
                // If the item was a manifest, then
                if (item.type == ss2d.LoadQueue.MANIFEST)
                {
                    var result = loader.getResult();
                    if (result != null && result.manifest !== undefined)
                    {
                        this.loadManifest(result, true);
                    }
                }
                this._processFinishedLoad(item, loader);
            },

            _processFinishedLoad : function(item, loader)
            {
                // Old handleFileTagComplete follows here.
                this._numItemsLoaded++;
                this._updateProgress();
                this._sendFileComplete(item, loader);
                this._loadNext();
            },

            _checkScriptLoadOrder : function ()
            {
                var l = this._loadedScripts.length;
                for (var i=0;i<l;i++)
                {
                    var item = this._loadedScripts[i];
                    if (item === null) { break; } // This is still loading. Do not process further.
                    if (item === true) { continue; } // This has completed, and been processed. Move on.

                    // Append script tags to the head automatically. Tags do this in the loader, but XHR scripts have to maintain order.
                    var loadItem = this._loadedResults[item.id];
                    (document.body || document.getElementsByTagName("body")[0]).appendChild(loadItem);

                    this._processFinishedLoad(item);
                    this._loadedScripts[i] = true;
                }
            },

            _removeLoadItem : function(loader)
            {
                var l = this._currentLoads.length;
                for (var i=0;i<l;i++)
                {
                    if (this._currentLoads[i] == loader)
                    {
                        this._currentLoads.splice(i,1); break;
                    }
                }
            },

            _handleProgress : function(event)
            {
                var loader = event.target;
                this._sendFileProgress(loader.getItem(), loader.progress);
                this._updateProgress();
            },

            _updateProgress : function ()
            {
                var loaded = this._numItemsLoaded / this._numItems; // Fully Loaded Progress
                var remaining = this._numItems-this._numItemsLoaded;
                if (remaining > 0)
                {
                    var chunk = 0;
                    for (var i=0, l=this._currentLoads.length; i<l; i++) {
                        chunk += this._currentLoads[i].progress;
                    }
                    loaded += (chunk / remaining) * (remaining/this._numItems);
                }
                this._sendProgress(loaded);
            },

            _disposeItem : function(item)
            {
                delete this._loadedResults[item.id];
                delete this._loadedRawResults[item.id];
                delete this._loadItemsById[item.id];
                delete this._loadItemsBySrc[item.src];
            },

            _createTag : function(item)
            {
                var tag = null;
                switch (item.type)
                {
                    case ss2d.LoadQueue.IMAGE:
                        tag = document.createElement("img");
                        if (this._crossOrigin != "" && !this._isLocal(item)) { tag.crossOrigin = this._crossOrigin; }
                        return tag;
                    case ss2d.LoadQueue.SOUND:
                        tag = document.createElement("audio");
                        tag.autoplay = false;
                        // Note: The type property doesn't seem necessary.
                        return tag;
                    case ss2d.LoadQueue.JSON:
                    case ss2d.LoadQueue.JSONP:
                    case ss2d.LoadQueue.JAVASCRIPT:
                    case ss2d.LoadQueue.MANIFEST:
                        tag = document.createElement("script");
                        tag.type = "text/javascript";
                        return tag;
                    case ss2d.LoadQueue.CSS:
                        if (this.useXHR)
                        {
                            tag = document.createElement("style");
                        }
                        else
                        {
                            tag = document.createElement("link");
                        }
                        tag.rel  = "stylesheet";
                        tag.type = "text/css";
                        return tag;
                    case ss2d.LoadQueue.SVG:
                        if (this.useXHR)
                        {
                            tag = document.createElement("svg");
                        }
                        else
                        {
                            tag = document.createElement("object");
                            tag.type = "image/svg+xml";
                        }
                        return tag;
                }
                return null;
            },

            _getTypeByExtension : function(extension)
            {
                if (extension == null)
                {
                    return ss2d.LoadQueue.TEXT;
                }
                switch (extension.toLowerCase())
                {
                    case "jpeg":
                    case "jpg":
                    case "gif":
                    case "png":
                    case "webp":
                    case "bmp":
                        return ss2d.LoadQueue.IMAGE;
                    case "ogg":
                    case "mp3":
                    case "wav":
                        return ss2d.LoadQueue.SOUND;
                    case "json":
                        return ss2d.LoadQueue.JSON;
                    case "xml":
                        return ss2d.LoadQueue.XML;
                    case "css":
                        return ss2d.LoadQueue.CSS;
                    case "js":
                        return ss2d.LoadQueue.JAVASCRIPT;
                    case 'svg':
                        return ss2d.LoadQueue.SVG;
                    default:
                        return ss2d.LoadQueue.TEXT;
                }
            },

            _sendFileProgress : function(item, progress)
            {
                if (this._isCanceled())
                {
                    this._cleanUp();
                    return;
                }
                if (!this.hasEventListener("fileprogress")) { return; }
                var event = new ss2d.Event("fileprogress");
                event.progress = progress;
                event.loaded = progress;
                event.total = 1;
                event.item = item;
                this.dispatchEvent(event);
            },

            _sendFileComplete : function(item, loader)
            {
                if (this._isCanceled()) { return; }
                var event = new ss2d.Event("fileload");
                event.loader = loader;
                event.item = item;
                event.result = this._loadedResults[item.id];
                event.rawResult = this._loadedRawResults[item.id];
                // This calls a handler specified on the actual load item. Currently, the SoundJS plugin uses this.
                if (item.completeHandler)
                {
                    item.completeHandler(event);
                }
                this.hasEventListener("fileload") && this.dispatchEvent(event)
            },

            _sendFileStart : function(item)
            {
                var event = new ss2d.Event("filestart");
                event.item = item;
                this.hasEventListener("filestart") && this.dispatchEvent(event);
            }
        }
    );
})();
(function()
{
    ss2d.SamplePlugin = Class
    (
        {
            ////////////////////////////////////////////////////////////////////////////
            //  static  property
            ////////////////////////////////////////////////////////////////////////////

            STATIC:
            {
                preloadHandler : function(src, type, id, data, basePath, queue)
                {

                },
                fileLoadHandler : function(event)
                {
                    // Do something with the result.
                },
                getPreloadHandlers : function()
                {
                    return {
                        callback: this.preloadHandler, // Proxy the method to maintain scope
                        types: ["image"],
                        extensions: ["jpg", "jpeg", "png", "gif"]
                    };
                }
            },

            ////////////////////////////////////////////////////////////////////////////
            //  constructor
            ////////////////////////////////////////////////////////////////////////////

            initialize : function()
            {
                throw "SamplePlugin cannot be instantiated";
            }
        }
    );
})();
(function()
{
    ss2d.TagLoader = Class
    (
        {
            Extends:ss2d.AbstractLoader,

            //////////////////////////////////////////////////////////////////////////
            //  private property
            //////////////////////////////////////////////////////////////////////////

            _loadTimeout : null,
            _tagCompleteProxy : null,
            _isAudio : false,
            _tag : null,
            _jsonResult : null,

            //////////////////////////////////////////////////////////////////////////
            //  public property
            //////////////////////////////////////////////////////////////////////////

            ////////////////////////////////////////////////////////////////////////////
            //  public methods
            ////////////////////////////////////////////////////////////////////////////

            initialize : function(item)
            {
                this._item = item;
                this._tag = item.tag;
                this._isAudio = (window.HTMLAudioElement && item.tag instanceof window.HTMLAudioElement);
                this._tagCompleteProxy = ss2d.proxy(this._handleLoad, this);
            },

            getResult : function()
            {
                if (this._item.type == ss2d.LoadQueue.JSONP ||
                    this._item.type == ss2d.LoadQueue.MANIFEST)
                {
                    return this._jsonResult;
                }
                else
                {
                    return this._tag;
                }
            },

            cancel : function()
            {
                this.canceled = true;
                this._clean();
            },

            // Overrides abstract method in AbstractLoader
            load : function()
            {
                var item = this._item;
                var tag = this._tag;

                clearTimeout(this._loadTimeout); // Clear out any existing timeout
                var duration = ss2d.LoadQueue.LOAD_TIMEOUT;
                if (duration == 0) { duration = ss2d.LoadQueue.loadTimeout; }
                this._loadTimeout = setTimeout(ss2d.proxy(this._handleTimeout, this), duration);

                if (this._isAudio)
                {
                    tag.src = null; // Unset the source so we can set the preload type to "auto" without kicking off a load. This is only necessary for audio tags passed in by the developer.
                    tag.preload = "auto";
                }

                // Handlers for all tags
                tag.onerror = ss2d.proxy(this._handleError,  this);
                // Note: We only get progress events in Chrome, but do not fully load tags in Chrome due to its behaviour, so we ignore progress.

                if (this._isAudio)
                {
                    tag.onstalled = ss2d.proxy(this._handleStalled,  this);
                    // This will tell us when audio is buffered enough to play through, but not when its loaded.
                    // The tag doesn't keep loading in Chrome once enough has buffered, and we have decided that behaviour is sufficient.
                    tag.addEventListener("canplaythrough", this._tagCompleteProxy, false); // canplaythrough callback doesn't work in Chrome, so we use an event.
                }
                else
                {
                    tag.onload = ss2d.proxy(this._handleLoad,  this);
                    tag.onreadystatechange = ss2d.proxy(this._handleReadyStateChange,  this);
                }

                var src = this.buildPath(item.src, item.values);

                // Set the src after the events are all added.
                switch(item.type)
                {
                    case ss2d.LoadQueue.CSS:
                        tag.href = src;
                        break;
                    case ss2d.LoadQueue.SVG:
                        tag.data = src;
                        break;
                    default:
                        tag.src = src;
                }

                // If we're loading JSONP, we need to add our callback now.
                if (item.type == ss2d.LoadQueue.JSONP
                    || item.type == ss2d.LoadQueue.JSON
                    || item.type == ss2d.LoadQueue.MANIFEST)
                {
                    if (item.callback == null)
                    {
                        throw new Error('callback is required for loading JSONP requests.');
                    }

                    if (window[item.callback] != null)
                    {
                        throw new Error('JSONP callback "' + item.callback + '" already exists on window. You need to specify a different callback. Or re-name the current one.');
                    }

                    window[item.callback] = ss2d.proxy(this._handleJSONPLoad, this);
                }

                // If its SVG, it needs to be on the DOM to load (we remove it before sending complete).
                // It is important that this happens AFTER setting the src/data.
                if (item.type == ss2d.LoadQueue.SVG ||
                    item.type == ss2d.LoadQueue.JSONP ||
                    item.type == ss2d.LoadQueue.JSON ||
                    item.type == ss2d.LoadQueue.MANIFEST ||
                    item.type == ss2d.LoadQueue.JAVASCRIPT ||
                    item.type == ss2d.LoadQueue.CSS)
                {
                    this._startTagVisibility = tag.style.visibility;
                    tag.style.visibility = "hidden";
                    (document.body || document.getElementsByTagName("body")[0]).appendChild(tag);
                }

                // Note: Previous versions didn't seem to work when we called load() for OGG tags in Firefox. Seems fixed in 15.0.1
                if (tag.load != null)
                {
                    tag.load();
                }
            },

            ////////////////////////////////////////////////////////////////////////////
            //  private methods
            ////////////////////////////////////////////////////////////////////////////

            _handleJSONPLoad : function(data)
            {
                this._jsonResult = data;
            },

            /**
             * Handle an audio timeout. Newer browsers get a callback from the tags, but older ones may require a setTimeout
             * to handle it. The setTimeout is always running until a response is handled by the browser.
             * @method _handleTimeout
             * @private
             */
            _handleTimeout : function()
            {
                this._clean();
                var event = new ss2d.Event("error");
                event.text = "PRELOAD_TIMEOUT";
                this._sendError(event);
            },

            /**
             * Handle a stalled audio event. The main place we seem to get these is with HTMLAudio in Chrome when we try and
             * playback audio that is already in a load, but not complete.
             * @method _handleStalled
             * @private
             */
            _handleStalled : function()
            {
                //Ignore, let the timeout take care of it. Sometimes its not really stopped.
            },

            /**
             * Handle an error event generated by the tag.
             * @method _handleError
             * @private
             */
            _handleError : function(event)
            {
                this._clean();
                var newEvent = new ss2d.Event("error");
                //TODO: Propagate actual event error?
                this._sendError(newEvent);
            },

            /**
             * Handle the readyStateChange event from a tag. We sometimes need this in place of the onload event (mainly SCRIPT
             * and LINK tags), but other cases may exist.
             * @method _handleReadyStateChange
             * @private
             */
            _handleReadyStateChange : function()
            {
                clearTimeout(this._loadTimeout);
                // This is strictly for tags in browsers that do not support onload.
                var tag = this.getItem().tag;
                // Complete is for old IE support.
                if (tag.readyState == "loaded" || tag.readyState == "complete")
                {
                    this._handleLoad();
                }
            },

            /**
             * Handle a load (complete) event. This is called by tag callbacks, but also by readyStateChange and canPlayThrough
             * events. Once loaded, the item is dispatched to the {{#crossLink "LoadQueue"}}{{/crossLink}}.
             * @method _handleLoad
             * @param {Object} [event] A load event from a tag. This is sometimes called from other handlers without an event.
             * @private
             */
            _handleLoad : function(event)
            {
                if (this._isCanceled()) { return; }
                var item = this.getItem();
                var tag = item.tag;
                if (this.loaded || this._isAudio && tag.readyState !== 4) { return; } //LM: Not sure if we still need the audio check.
                this.loaded = true;

                // Remove from the DOM
                switch (item.type)
                {
                    case ss2d.LoadQueue.SVG:
                    case ss2d.LoadQueue.JSON:
                    case ss2d.LoadQueue.JSONP: // Note: Removing script tags is a fool's errand.
                    case ss2d.LoadQueue.MANIFEST:
                    case ss2d.LoadQueue.CSS:
                        // case ss2d.LoadQueue.CSS:
                        //LM: We may need to remove CSS tags loaded using a LINK
                        tag.style.visibility = this._startTagVisibility;
                        (document.body || document.getElementsByTagName("body")[0]).removeChild(tag);
                        break;
                    default:
                }
                this._clean();
                this._sendComplete();
            },

            /**
             * Clean up the loader.
             * This stops any timers and removes references to prevent errant callbacks and clean up memory.
             * @method _clean
             * @private
             */
            _clean : function()
            {
                clearTimeout(this._loadTimeout);
                // Delete handlers.
                var item = this.getItem();
                var tag = item.tag;
                if (tag != null)
                {
                    tag.onload = null;
                    tag.removeEventListener && tag.removeEventListener("canplaythrough", this._tagCompleteProxy, false);
                    tag.onstalled = null;
                    tag.onprogress = null;
                    tag.onerror = null;

                    //TODO: Test this
                    if (tag.parentNode != null
                        && item.type == ss2d.LoadQueue.SVG
                        && item.type == ss2d.LoadQueue.JSON
                        && item.type == ss2d.LoadQueue.MANIFEST
                        && item.type == ss2d.LoadQueue.CSS
                        && item.type == ss2d.LoadQueue.JSONP)
                    {
                        // Note: Removing script tags is a fool's errand.
                        tag.parentNode.removeChild(tag);
                    }
                }

                var item = this.getItem();
                if (item.type == ss2d.LoadQueue.JSONP ||
                    item.type == ss2d.LoadQueue.MANIFEST)
                {
                    window[item.callback] = null;
                }
            }
        }
    );
})();
(function()
{
    ss2d.XHRLoader = Class
    (
        {
            Extends:ss2d.AbstractLoader,

            _request : null,
            _loadTimeout : null,
            _xhrLevel : 1,
            _response : null,
            _rawResponse : null,
            _crossOrigin : "",

            initialize : function (item, crossOrigin)
            {
                this._item = item;
                this._crossOrigin = crossOrigin;
                if (!this._createXHR(item))
                {
                    //TODO: Throw error?
                }
            },

            /**
             * Look up the loaded result.
             * @method getResult
             * @param {Boolean} [rawResult=false] Return a raw result instead of a formatted result. This applies to content
             * loaded via XHR such as scripts, XML, CSS, and Images. If there is no raw result, the formatted result will be
             * returned instead.
             * @return {Object} A result object containing the content that was loaded, such as:
             * <ul>
             *      <li>An image tag (&lt;image /&gt;) for images</li>
             *      <li>A script tag for JavaScript (&lt;script /&gt;). Note that scripts loaded with tags may be added to the
             *      HTML head.</li>
             *      <li>A style tag for CSS (&lt;style /&gt;)</li>
             *      <li>Raw text for TEXT</li>
             *      <li>A formatted JavaScript object defined by JSON</li>
             *      <li>An XML document</li>
             *      <li>An binary arraybuffer loaded by XHR</li>
             * </ul>
             * Note that if a raw result is requested, but not found, the result will be returned instead.
             */
            getResult : function (rawResult)
            {
                if (rawResult && this._rawResponse)
                {
                    return this._rawResponse;
                }
                return this._response;
            },

            // Overrides abstract method in AbstractLoader
            cancel : function ()
            {
                this.canceled = true;
                this._clean();
                this._request.abort();
            },

            // Overrides abstract method in AbstractLoader
            load : function ()
            {
                if (this._request == null)
                {
                    this._handleError();
                    return;
                }

                //Events
                this._request.onloadstart = ss2d.proxy(this._handleLoadStart, this);
                this._request.onprogress = ss2d.proxy(this._handleProgress, this);
                this._request.onabort = ss2d.proxy(this._handleAbort, this);
                this._request.onerror = ss2d.proxy(this._handleError, this);
                this._request.ontimeout = ss2d.proxy(this._handleTimeout, this);
                // Set up a timeout if we don't have XHR2
                if (this._xhrLevel == 1)
                {
                    var duration = ss2d.LoadQueue.LOAD_TIMEOUT;
                    if (duration == 0)
                    {
                        duration = ss2d.LoadQueue.loadTimeout;
                    }
                    else
                    {
                        try { console.warn("LoadQueue.LOAD_TIMEOUT has been deprecated in favor of LoadQueue.loadTimeout");} catch(e) {}
                    }
                    this._loadTimeout = setTimeout(ss2d.proxy(this._handleTimeout, this), duration);
                }

                // Note: We don't get onload in all browsers (earlier FF and IE). onReadyStateChange handles these.
                this._request.onload = ss2d.proxy(this._handleLoad, this);

                this._request.onreadystatechange = ss2d.proxy(this._handleReadyStateChange, this);

                // Sometimes we get back 404s immediately, particularly when there is a cross origin request.  // note this does not catch in Chrome
                try
                {
                    if (!this._item.values || this._item.method == ss2d.LoadQueue.GET)
                    {
                        this._request.send();
                    }
                    else if (this._item.method == ss2d.LoadQueue.POST)
                    {
                        this._request.send(this._formatQueryString(this._item.values));
                    }
                }
                catch (error)
                {
                    var event = new ss2d.Event("error");
                    event.error = error;
                    this._sendError(event);
                }
            },

            /**
             * Get all the response headers from the XmlHttpRequest.
             *
             * <strong>From the docs:</strong> Return all the HTTP headers, excluding headers that are a case-insensitive match
             * for Set-Cookie or Set-Cookie2, as a single string, with each header line separated by a U+000D CR U+000A LF pair,
             * excluding the status line, and with each header name and header value separated by a U+003A COLON U+0020 SPACE
             * pair.
             * @method getAllResponseHeaders
             * @return {String}
             * @since 0.4.1
             */
            getAllResponseHeaders : function ()
            {
                if  (this._request.getAllResponseHeaders instanceof Function)
                {
                    return this._request.getAllResponseHeaders();
                }
                else
                {
                    return null;
                }
            },

            /**
             * Get a specific response header from the XmlHttpRequest.
             *
             * <strong>From the docs:</strong> Returns the header field value from the response of which the field name matches
             * header, unless the field name is Set-Cookie or Set-Cookie2.
             * @method getResponseHeader
             * @param {String} header The header name to retrieve.
             * @return {String}
             * @since 0.4.1
             */
            getResponseHeader : function (header)
            {
                if (this._request.getResponseHeader instanceof Function)
                {
                    return this._request.getResponseHeader(header);
                }
                else
                {
                    return null;
                }
            },

            /**
             * The XHR request has reported progress.
             * @method _handleProgress
             * @param {Object} event The XHR progress event.
             * @private
             */
            _handleProgress : function (event)
            {
                if (!event || event.loaded > 0 && event.total == 0)
                {
                    return; // Sometimes we get no "total", so just ignore the progress event.
                }

                var newEvent = new ss2d.Event("progress");
                newEvent.loaded = event.loaded;
                newEvent.total = event.total;
                this._sendProgress(newEvent);
            },

            /**
             * The XHR request has reported a load start.
             * @method _handleLoadStart
             * @param {Object} event The XHR loadStart event.
             * @private
             */
            _handleLoadStart : function (event)
            {
                clearTimeout(this._loadTimeout);
                this._sendLoadStart();
            },

            /**
             * The XHR request has reported an abort event.
             * @method handleAbort
             * @param {Object} event The XHR abort event.
             * @private
             */
            _handleAbort : function (event)
            {
                this._clean();
                var newEvent = new ss2d.Event("error");
                newEvent.text = "XHR_ABORTED";
                this._sendError(newEvent);
            },

            /**
             * The XHR request has reported an error event.
             * @method _handleError
             * @param {Object} event The XHR error event.
             * @private
             */
            _handleError : function (event)
            {
                this._clean();
                var newEvent = new ss2d.Event("error");
                //TODO: Propagate event error
                this._sendError(newEvent);
            },

            /**
             * The XHR request has reported a readyState change. Note that older browsers (IE 7 & 8) do not provide an onload
             * event, so we must monitor the readyStateChange to determine if the file is loaded.
             * @method _handleReadyStateChange
             * @param {Object} event The XHR readyStateChange event.
             * @private
             */
            _handleReadyStateChange : function (event)
            {
                if (this._request.readyState == 4)
                {
                    this._handleLoad();
                }
            },

            /**
             * The XHR request has completed. This is called by the XHR request directly, or by a readyStateChange that has
             * <code>request.readyState == 4</code>. Only the first call to this method will be processed.
             * @method _handleLoad
             * @param {Object} event The XHR load event.
             * @private
             */
            _handleLoad : function (event)
            {
                if (this.loaded)
                {
                    return;
                }
                this.loaded = true;

                if (!this._checkError())
                {
                    this._handleError();
                    return;
                }
                this._response = this._getResponse();
                this._clean();
                var isComplete = this._generateTag();
                if (isComplete)
                {
                    this._sendComplete();
                }
            },

            /**
             * The XHR request has timed out. This is called by the XHR request directly, or via a <code>setTimeout</code>
             * callback.
             * @method _handleTimeout
             * @param {Object} [event] The XHR timeout event. This is occasionally null when called by the backup setTimeout.
             * @private
             */
            _handleTimeout : function (event)
            {
                this._clean();
                var newEvent = new ss2d.Event("error");
                newEvent.text = "PRELOAD_TIMEOUT";
                //TODO: Propagate actual event error
                this._sendError(event);
            },

            /**
             * Determine if there is an error in the current load. This checks the status of the request for problem codes. Note
             * that this does not check for an actual response. Currently, it only checks for 404 or 0 error code.
             * @method _checkError
             * @return {Boolean} If the request status returns an error code.
             * @private
             */
            _checkError : function ()
            {
                //LM: Probably need additional handlers here, maybe 501
                var status = parseInt(this._request.status);
                switch (status)
                {
                    case 404:   // Not Found
                    case 0:     // Not Loaded
                        return false;
                }
                return true;
            },

            /**
             * Validate the response. Different browsers have different approaches, some of which throw errors when accessed
             * in other browsers. If there is no response, the <code>_response</code> property will remain null.
             * @method _getResponse
             * @private
             */
            _getResponse : function ()
            {
                if (this._response != null)
                {
                    return this._response;
                }

                if (this._request.response != null)
                {
                    return this._request.response;
                }

                // Android 2.2 uses .responseText
                try
                {
                    if (this._request.responseText != null)
                    {
                        return this._request.responseText;
                    }
                }
                catch (e)
                {
                }

                // When loading XML, IE9 does not return .response, instead it returns responseXML.xml
                //TODO: TEST
                try
                {
                    if (this._request.responseXML != null)
                    {
                        return this._request.responseXML;
                    }
                }
                catch (e)
                {
                }
                return null;
            },

            /**
             * Create an XHR request. Depending on a number of factors, we get totally different results.
             * <ol><li>Some browsers get an <code>XDomainRequest</code> when loading cross-domain.</li>
             *      <li>XMLHttpRequest are created when available.</li>
             *      <li>ActiveX.XMLHTTP objects are used in older IE browsers.</li>
             *      <li>Text requests override the mime type if possible</li>
             *      <li>Origin headers are sent for crossdomain requests in some browsers.</li>
             *      <li>Binary loads set the response type to "arraybuffer"</li></ol>
             * @method _createXHR
             * @param {Object} item The requested item that is being loaded.
             * @return {Boolean} If an XHR request or equivalent was successfully created.
             * @private
             */
            _createXHR : function (item)
            {
                // Check for cross-domain loads. We can't fully support them, but we can try.
                var crossdomain = this._isCrossDomain(item);

                // Create the request. Fall back to whatever support we have.
                var req = null;
                if (crossdomain && window.XDomainRequest)
                {
                    req = new XDomainRequest(); // Note: IE9 will fail if this is not actually cross-domain.
                }
                else if (window.XMLHttpRequest)
                {
                    // Old IE versions use a different approach
                    req = new XMLHttpRequest();
                }
                else
                {
                    try
                    {
                        req = new ActiveXObject("Msxml2.XMLHTTP.6.0");
                    }
                    catch (e)
                    {
                        try
                        {
                            req = new ActiveXObject("Msxml2.XMLHTTP.3.0");
                        }
                        catch (e)
                        {
                            try
                            {
                                req = new ActiveXObject("Msxml2.XMLHTTP");
                            }
                            catch (e)
                            {
                                return false;
                            }
                        }
                    }
                }

                // IE9 doesn't support overrideMimeType(), so we need to check for it.
                if (ss2d.LoadQueue.isText(item.type) && req.overrideMimeType)
                {
                    req.overrideMimeType("text/plain; charset=utf-8");
                }

                // Determine the XHR level
                this._xhrLevel = (typeof req.responseType === "string") ? 2 : 1;

                var src = null;
                if (item.method == ss2d.LoadQueue.GET)
                {
                    src = this.buildPath(item.src, item.values);
                } else {
                    src = item.src;
                }
                // Open the request.  Set cross-domain flags if it is supported (XHR level 1 only)
                req.open(item.method || ss2d.LoadQueue.GET, src, true);

                if (crossdomain && req instanceof XMLHttpRequest && this._xhrLevel == 1) {
                    req.setRequestHeader("Origin", location.origin);
                }
                /*TODO: Test and implement.
                 if (crossDomain && !headers["X-Requested-With"] ) {
                 headers["X-Requested-With"] = "XMLHttpRequest";
                 }*/

                // To send data we need to set the Content-type header)
                if (item.values && item.method == ss2d.LoadQueue.POST)
                {
                    req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                }
                // Binary files are loaded differently.
                if (ss2d.LoadQueue.isBinary(item.type))
                {
                    req.responseType = "arraybuffer";
                }
                this._request = req;
                return true;
            },

            /**
             * A request has completed (or failed or canceled), and needs to be disposed.
             * @method _clean
             * @private
             */
            _clean : function ()
            {
                clearTimeout(this._loadTimeout);

                var req = this._request;
                req.onloadstart = null;
                req.onprogress = null;
                req.onabort = null;
                req.onerror = null;
                req.onload = null;
                req.ontimeout = null;
                req.onloadend = null;
                req.onreadystatechange = null;
            },

            /**
             * Generate a tag for items that can be represented as tags. For example, IMAGE, SCRIPT, and LINK. This also handles
             * XML and SVG objects.
             * @method _generateTag
             * @return {Boolean} If a tag was generated and is ready for instantiation. If it still needs processing, this
             * method returns false.
             * @private
             */
            _generateTag : function ()
            {
                var type = this._item.type;
                var tag = this._item.tag;
                switch (type)
                {
                    // Note: Images need to wait for onload, but do use the cache.
                    case ss2d.LoadQueue.IMAGE:
                        tag.onload = ss2d.proxy(this._handleTagReady, this);
                        if (this._crossOrigin != "") { tag.crossOrigin = "Anonymous"; }// We can assume this, since XHR images are always loaded on a server.
                        tag.src = this.buildPath(this._item.src, this._item.values);
                        this._rawResponse = this._response;
                        this._response = tag;
                        return false; // Images need to get an onload event first
                    case ss2d.LoadQueue.JAVASCRIPT:
                        tag = document.createElement("script");
                        tag.text = this._response;
                        this._rawResponse = this._response;
                        this._response = tag;
                        return true;
                    case ss2d.LoadQueue.CSS:
                        // Maybe do this conditionally?
                        var head = document.getElementsByTagName("head")[0]; //Note: This is unavoidable in IE678
                        head.appendChild(tag);
                        if (tag.styleSheet) // IE
                        {
                            tag.styleSheet.cssText = this._response;
                        }
                        else
                        {
                            var textNode = document.createTextNode(this._response);
                            tag.appendChild(textNode);
                        }

                        this._rawResponse = this._response;
                        this._response = tag;
                        return true;
                    case ss2d.LoadQueue.XML:
                        var xml = this._parseXML(this._response, "text/xml");
                        this._rawResponse = this._response;
                        this._response = xml;
                        return true;

                    case ss2d.LoadQueue.SVG:
                        var xml = this._parseXML(this._response, "image/svg+xml");
                        this._rawResponse = this._response;
                        if (xml.documentElement != null)
                        {
                            tag.appendChild(xml.documentElement);
                            this._response = tag;
                        }
                        else
                        // For browsers that don't support SVG, just give them the XML. (IE 9-8)
                        {
                            this._response = xml;
                        }
                        return true;
                    case ss2d.LoadQueue.JSON:
                    case ss2d.LoadQueue.MANIFEST:
                        var json = {};
                        try
                        {
                            json = JSON.parse(this._response);
                        }
                        catch (error)
                        {
                            json = error;
                        }
                        this._rawResponse = this._response;
                        this._response = json;
                        return true;
                }
                return true;
            },

            /**
             * Parse XML using the DOM. This is required when preloading XML or SVG.
             * @method _parseXML
             * @param {String} text The raw text or XML that is loaded by XHR.
             * @param {String} type The mime type of the XML.
             * @return {XML} An XML document.
             * @private
             */
            _parseXML : function (text, type)
            {
                var xml = null;
                if (window.DOMParser)
                {
                    var parser = new DOMParser();
                    xml = parser.parseFromString(text, type);  // OJR Opera throws DOMException: NOT_SUPPORTED_ERR  // potential solution https://gist.github.com/1129031
                }
                else
                // IE
                {
                    xml = new ActiveXObject("Microsoft.XMLDOM");
                    xml.async = false;
                    xml.loadXML(text);
                }
                return xml;
            },

            /**
             * A generated tag is now ready for use.
             * @method _handleTagReady
             * @private
             */
            _handleTagReady : function ()
            {
                this._sendComplete();
            }
        }
    );
})();


if (typeof JSON !== 'object') {
    JSON = {};
}

(function () {
    'use strict';

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function (key) {

            return isFinite(this.valueOf())
                ? this.getUTCFullYear() + '-' +
                f(this.getUTCMonth() + 1) + '-' +
                f(this.getUTCDate()) + 'T' +
                f(this.getUTCHours()) + ':' +
                f(this.getUTCMinutes()) + ':' +
                f(this.getUTCSeconds()) + 'Z'
                : null;
        };

        String.prototype.toJSON =
            Number.prototype.toJSON =
                Boolean.prototype.toJSON = function (key) {
                    return this.valueOf();
                };
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
            '\b':'\\b',
            '\t':'\\t',
            '\n':'\\n',
            '\f':'\\f',
            '\r':'\\r',
            '"':'\\"',
            '\\':'\\\\'
        },
        rep;


    function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
            var c = meta[a];
            return typeof c === 'string'
                ? c
                : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
    }


    function str(key, holder) {

// Produce a string from holder[key].

        var i, // The loop counter.
            k, // The member key.
            v, // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
            typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
            case 'string':
                return quote(value);

            case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

                return isFinite(value) ? String(value) : 'null';

            case 'boolean':
            case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

                return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

            case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

                if (!value) {
                    return 'null';
                }

// Make an array to hold the partial results of stringifying this object value.

                gap += indent;
                partial = [];

// Is the value an array?

                if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                    length = value.length;
                    for (i = 0; i < length; i += 1) {
                        partial[i] = str(i, value) || 'null';
                    }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                    v = partial.length === 0
                        ? '[]'
                        : gap
                        ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']'
                        : '[' + partial.join(',') + ']';
                    gap = mind;
                    return v;
                }

// If the replacer is an array, use it to select the members to be stringified.

                if (rep && typeof rep === 'object') {
                    length = rep.length;
                    for (i = 0; i < length; i += 1) {
                        if (typeof rep[i] === 'string') {
                            k = rep[i];
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
                            }
                        }
                    }
                } else {

// Otherwise, iterate through all of the keys in the object.

                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
                            }
                        }
                    }
                }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

                v = partial.length === 0
                    ? '{}'
                    : gap
                    ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}'
                    : '{' + partial.join(',') + '}';
                gap = mind;
                return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                (typeof replacer !== 'object' ||
                    typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

            return str('', {'':value});
        };
    }


// If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with '()' and 'new'
// because they can cause invocation, and '=' because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (/^[\],:{}\s]*$/
                .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                    .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                    .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function'
                    ? walk({'':j}, '')
                    : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    }
}());
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
(function()
{
    /**
     * 音效元素
     * @class
     * @param {Audio} sound 声音文件
     */
    ss2d.SoundItem = Class
    (
        /** @lends ss2d.SoundItem.prototype */
        {
            //////////////////////////////////////////////////////////////////////////
            //  Extends
            //////////////////////////////////////////////////////////////////////////

            Extends : ss2d.SoundControl,

            //////////////////////////////////////////////////////////////////////////
            //  public property
            //////////////////////////////////////////////////////////////////////////

            /**
             * 声音文件
             * @type {Audio}
             */
            sound : null,

            /**
             * 播放声音的循环次数
             * @type {number}
             * @default 0
             */
            loops : 0,

            /**
             * 播放声音的延迟时间
             * @type {number}
             * @default 0
             */
            delay : 0,

            /**
             * 播放声音的延迟时间的计时器
             * @private
             */
            timeout : 0,

            /**
             * 声音播放当前位置
             * @type {number}
             * @default 0
             */
            lastPosition : 0,

            /**
             * 声音文件的地址
             * @type {string}
             * @default null
             */
            url : null,

            /**
             * @private
             */
            loadingCallbacks :  null,

            //////////////////////////////////////////////////////////////////////////
            //  private property
            //////////////////////////////////////////////////////////////////////////

            /**
             * 是否副本文件，如果是副本文件，一般在播放完毕以后就会被销毁。
             * @type {Boolean}
             * @default false
             * @private
             */
            mIsDuplicate : false,

            ////////////////////////////////////////////////////////////////////////////
            //  constructor
            ////////////////////////////////////////////////////////////////////////////

            /**
             * 初始化
             * @private
             * @param sound
             */
            initialize : function(sound)
            {
                ss2d.SoundItem.Super.call(this);
                if (!(sound instanceof Audio)) sound = null;
                this.sound = sound;
                this.lastPosition = 0;
                this.loadingCallbacks = {};
            },

            ////////////////////////////////////////////////////////////////////////////
            //  Additional getters and setters
            ////////////////////////////////////////////////////////////////////////////

            /**
             * 获取音频音量
             * @returns {*}
             */
            getVolume : function()
            {
                if (this.sound == null) return 0;
                return this.sound.volume;
            },

            /**
             * 设置音频音量
             * @param value
             */
            setVolume : function(value)
            {
                if(this.sound == null) return;
                this.sound.volume = value;
            },

            /**
             * 获取音频总长度
             * @returns {*}
             */
            getLength : function()
            {
                if (this.sound == null) return 0;
                return this.sound.duration;
            },

            /**
             * 获取音频当前播放位置
             * @returns {*}
             */
            getPosition : function()
            {
                if (this.sound == null) return 0;
                return this.sound.currentTime;
            },

            /**
             * 设置音频当前播放位置
             * @param value
             */
            setPosition : function(value)
            {
                this.stop();
                this.lastPosition = value;
                this.play();
            },

            /**
             * 获取音频当前播放位置的百分比
             * @returns {number}
             */
            getPositionPercent : function()
            {
                return this.position / this.length;
            },

            /**
             * 设置音频当前播放位置的百分比
             * @param value
             */
            setPositionPercent : function(value)
            {
                this.position = this.length * value;
            },

            ////////////////////////////////////////////////////////////////////////////
            //  public methods
            ////////////////////////////////////////////////////////////////////////////

            /**
             * 加载
             * @param {String} path 音效文件路径
             * @returns {*}
             */
            load : function(path)
            {
                var probe = new Audio();
                var extension = path.split(".").pop().toUpperCase().split("?")[0];
                var format = ss2d.sound.config[extension];
                if (format == null ||
                    probe.canPlayType(format.mime) == false)
                {
                    throw new Error("The music format '" + extension +"' is not supported");
                }
                probe = null;

                if (this.sound != null)
                {
                    this.sound.removeEventListener('canplaythrough', ss2d[this._onCanPlayThroughHandler]);
                    this.sound.removeEventListener('ended', ss2d[this._onEndedHandler]);
                    this.sound.removeEventListener('error', ss2d[this._onErrorHandler]);
                    ss2d[this._onCanPlayThroughHandler] = null;
                    ss2d[this._onEndedHandler] = null;
                    ss2d[this._onErrorHandler] = null;
                    this.sound.pause();
                    this.sound = null;
                }
                ss2d[this._onCanPlayThroughHandler] = this._onCanPlayThroughHandler.bind(this);
                ss2d[this._onEndedHandler] = this._onEndedHandler.bind(this);
                ss2d[this._onErrorHandler] = this._onErrorHandler.bind(this);
                this.sound = new Audio(path + "?" + ss2d.nocache);
                this.sound.addEventListener('canplaythrough', ss2d[this._onCanPlayThroughHandler]);
                this.sound.addEventListener('ended', ss2d[this._onEndedHandler]);
                this.sound.addEventListener('error', ss2d[this._onErrorHandler]);
                this.sound.load();
                return this;
            },

            /**
             * 播放
             * @param {Number} loops 循环次数
             * @param {Number} delay 延时播放
             * @returns {*|void}
             */
            play : function(loops, delay)
            {
                if (this.isPlaying)
                {
                    ss2d.log("音效还在播放中，克隆新音效......");
                    var duplicate = this.clone();
                    duplicate.mIsDuplicate = true;
                    duplicate.loops = loops == -1 ? Number.MAX_VALUE : loops;
                    duplicate.delay = delay;
                    ss2d[duplicate._playHandler] = duplicate._playHandler.bind(duplicate);
                    duplicate.timeout = setTimeout(ss2d[duplicate._playHandler], delay * 1000);
                    return ss2d.SoundItem.Super.prototype.play.call(duplicate);
                }
                loops = loops || 0;
                delay = delay || 0;
                this.loops = loops == -1 ? Number.MAX_VALUE : loops;
                this.delay = delay;
                this.cancel();
                ss2d[this._playHandler] = this._playHandler.bind(this);
                this.timeout = setTimeout(ss2d[this._playHandler], delay * 1000);
                return ss2d.SoundItem.Super.prototype.play.call(this);
            },

            /**
             * 暂停
             * @returns {*|void}
             */
            pause : function()
            {
                this.lastPosition = this.sound.currentTime;
                this.sound.pause();
                return ss2d.SoundItem.Super.prototype.pause.call(this);
            },

            /**
             * 停止播放
             * @returns {*}
             */
            stop : function()
            {
                this.lastPosition = 0;
                this.sound.pause();
                return ss2d.SoundItem.Super.prototype.stop.call(this);
            },

            /**
             * 离开
             * @returns {*}
             */
            cancel : function()
            {
                clearTimeout(this.timeout);
                var callback = this.controlCallbacks["cancel"];
                if(callback != null) callback();
                return this;
            },

            /**
             * 给音频加载完毕添加一个回调函数
             * @param {Function} callBack 回调函数
             * @returns {*}
             */
            onLoad : function(callBack)
            {
                this.loadingCallbacks["complete"] = callBack;
                return this;
            },

            /**
             * 克隆这个音效。
             */
            clone : function()
            {
                var cSound = new ss2d.SoundItem();
                cSound.load(this.sound.src);
                return cSound;
            },

            /**
             * 释放
             */
            dispose : function()
            {
                this.cancel();
                this.loadingCallbacks = null;
                if (this.sound != null)
                {
                    this.sound.removeEventListener('canplaythrough', ss2d[this._onCanPlayThroughHandler]);
                    this.sound.removeEventListener('ended', ss2d[this._onEndedHandler]);
                    this.sound.removeEventListener('error', ss2d[this._onErrorHandler]);
                    ss2d[this._onCanPlayThroughHandler] = null;
                    ss2d[this._onEndedHandler] = null;
                    ss2d[this._onErrorHandler] = null;
                    this.sound.pause();
                    this.sound = null;
                }
            },

            ////////////////////////////////////////////////////////////////////////////
            //  private methods
            ////////////////////////////////////////////////////////////////////////////


            /**
             * 播放音频处理函数
             * @private
             */
            _playHandler : function()
            {
                //this.sound.currentTime = this.lastPosition;
                this.sound.play();
                var callback = this.controlCallbacks["play"];
                if(callback != null) callback.call();
            },

            /**
             * 当浏览器可在不因缓冲而停顿的情况下进行播放时的事件处理
             * @param e
             * @private
             */
            _onCanPlayThroughHandler : function(e)
            {
                var callback = this.loadingCallbacks["complete"];
                if(callback != null) callback.apply(this, [e]);
            },

            /**
             * 当目前的播放列表已结束时的事件处理
             * @param e
             * @private
             */
            _onEndedHandler : function(e)
            {
                this.loops--;
                if (this.loops > 0) this.sound.play();
                else
                {
                    this.isPlaying = false;
                    this.lastPosition = 0;
                    var callback = this.controlCallbacks["soundComplete"];
                    if(callback != null) callback.apply(this, [e]);
                    if (this.mIsDuplicate)
                    {
                        ss2d.log("副本播放完毕，执行销毁!");
                        this.dispose();
                    }
                }
            },

            /**
             * 当在音频加载期间发生错误时事件处理
             * @param e
             * @private
             */
            _onErrorHandler : function(e)
            {
                var callback = this.controlCallbacks["cancel"];
                if(callback != null) callback();
            }
        }
    );
})();
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
(function()
{
    /**
     * 按钮组件
     * @class
     * @param skinQuad 按钮皮肤四边形
     * @param iconQuad 按钮Icon四边形
     */
    ss2d.Button = Class
    (
        /** @lends ss2d.Button.prototype */
        {
            //////////////////////////////////////////////////////////////////////////
            //  Extends
            //////////////////////////////////////////////////////////////////////////

            Extends:ss2d.Group,

            //////////////////////////////////////////////////////////////////////////
            //  STATIC
            //////////////////////////////////////////////////////////////////////////

            STATIC:
            {
                STATE_UP : "up",
                STATE_DOWN : "down",
                STATE_HOVER : "hover",
                STATE_DISABLED : "disabled",
                ICON_POSITION_TOP : "top",
                ICON_POSITION_RIGHT : "right",
                ICON_POSITION_BOTTOM : "bottom",
                ICON_POSITION_LEFT : "left",
                ICON_POSITION_MANUAL : "manual",
                ICON_POSITION_LEFT_BASELINE : "leftBaseline",
                ICON_POSITION_RIGHT_BASELINE : "rightBaseline"

            },

            //////////////////////////////////////////////////////////////////////////
            //  public property
            //////////////////////////////////////////////////////////////////////////

            /**
             * 当鼠标移开的时候是否保持按钮按下状态
             * @type {Boolean}
             * @default false
             */
            keepDownStateOnRollOut : false,

            //////////////////////////////////////////////////////////////////////////
            //  private property
            //////////////////////////////////////////////////////////////////////////

            /**
             * 按钮组件所属场景
             * @type  {ss2d.Scene}
             */
            _scene : null,

            /**
             * 按钮皮肤四边形
             * 注：要将按钮显示出来必须先给该属性赋值。
             * @private
             * @type {ss2d.Quad}
             */
            _skinQuad : null,

            /**
             * 默认皮肤
             * @private
             * @type {String}
             */
            _defaultSkin : null,

            /**
             * 按钮被选中时的默认皮肤
             * @private
             * @type {String}
             */
            _defaultSelectedSkin : null,

            /**
             * 按钮弹起时的皮肤
             * @private
             * @type {String}
             */
            _upSkin : null,

            /**
             * 选中状态下，按钮弹起时的皮肤
             * @private
             * @type {String}
             */
            _selectedUpSkin : null,

            /**
             * 按钮被按下时的皮肤
             * @private
             * @type {String}
             */
            _downSkin : null,

            /**
             * 选中状态下，按钮被按下时的皮肤。
             * @private
             * @type {String}
             */
            _selectedDownSkin : null,

            /**
             * 鼠标经过按钮时的皮肤。
             * @private
             * @type {String}
             */
            _hoverSkin : null,

            /**
             * 选中状态下，鼠标经过按钮时的皮肤。
             * @private
             * @type {String}
             */
            _selectedHoverSkin : null,

            /**
             * 按钮被禁用时的皮肤。
             * @private
             * @type {String}
             */
            _disabledSkin : null,

            /**
             * 选中状态下，按钮被禁用时的皮肤。
             * @private
             * @type {String}
             */
            _selectedDisabledSkin : null,

            /**
             * 按钮Icon四边形
             * 注：要将按钮的icon显示出来必须先给该属性赋值。
             * @private
             * @type {ss2d.Quad}
             */
            _iconQuad : null,

            /**
             * 默认icon的皮肤。
             * @private
             * @type {String}
             */
            _defaultIcon : null,

            /**
             * 选中状态下，默认icon的皮肤。
             * @private
             * @type {String}
             */
            _defaultSelectedIcon : null,

            /**
             * 按钮弹起时的icon皮肤。
             * @private
             * @type {String}
             */
            _upIcon : null,

            /**
             * 选中状态下，按钮弹起时的icon皮肤。
             * @private
             * @type {String}
             */
            _selectedUpIcon : null,

            /**
             * 按钮按下时的icon皮肤。
             * @private
             * @type {String}
             */
            _downIcon : null,

            /**
             * 选中状态下，按钮按下时的icon皮肤。
             * @private
             * @type {String}
             */
            _selectedDownIcon : null,

            /**
             * 鼠标经过按钮时的icon皮肤。
             * @private
             * @type {String}
             */
            _hoverIcon : null,

            /**
             * 选中状态下，鼠标经过按钮时的icon皮肤。
             * @private
             * @type {String}
             */
            _selectedHoverIcon : null,

            /**
             * 按钮被禁用时的icon皮肤。
             * @private
             * @type {String}
             */
            _disabledIcon : null,

            /**
             * 选中状态下，按钮被禁用时的icon皮肤。
             * @private
             * @type {String}
             */
            _selectedDisabledIcon : null,

            /**
             * icon在按钮中的位置。
             * @private
             * @type {String}
             */
            _iconPosition : null,

            /**
             * 合法按钮状态列表
             * @private
             * @type {Array}
             */
            _stateNames : null,

            /**
             * 当前按钮的状态
             * @private
             * @type {String}
             */
            _currentState : null,

            /**
             * 按钮是否可用
             * @private
             * @type {Boolean}
             */
            _isEnabled : true,

            /**
             * 按钮是允许同时选中
             * @private
             * @type {Boolean}
             */
            _isToggle : false,

            /**
             * 按钮是否选中
             * @private
             * @type {Boolean}
             */
            _isSelected : false,

            /**
             * 按钮是否支持监听鼠标移动
             * @private
             * @type {Boolean}
             */
            _isHoverSupported : false,

            /**
             * 按钮文字内容
             * @private
             * @type {String}
             */
            _label : null,

            /**
             * 按钮文本对象
             * @private
             * @type {ss2d.TextField}
             */
            _textField : null,

            _paddingTop : 0,

            _paddingRight : 0,

            _paddingBottom : 0,

            _paddingLeft : 0,

            ////////////////////////////////////////////////////////////////////////////
            //  constructor
            ////////////////////////////////////////////////////////////////////////////

            /**
             * 初始化
             * @private
             */
            initialize : function(scene)
            {
                ss2d.Button.Super.call(this);

                this._scene = scene;
                this._iconPosition = ss2d.Button.ICON_POSITION_LEFT;
                this._currentState = ss2d.Button.STATE_UP;
                this._stateNames = [ss2d.Button.STATE_UP, ss2d.Button.STATE_DOWN,
                    ss2d.Button.STATE_HOVER, ss2d.Button.STATE_DISABLED];

                ss2d[this.onMouseDownHandler] = this.onMouseDownHandler.bind(this);
                ss2d[this.onMouseUpHandler] = this.onMouseUpHandler.bind(this);
                ss2d[this.onMouseMoveHandler] = this.onMouseMoveHandler.bind(this);

                this._skinQuad = this._scene.applyQuad();
                this._scene.showQuad(this._skinQuad);
                this.addChild(this._skinQuad);
                this._skinQuad.setMouseEnabled(true);
                this._skinQuad.addEventListener(ss2d.MouseEvent.MOUSE_DOWN, ss2d[this.onMouseDownHandler], false);
                this._skinQuad.addEventListener(ss2d.MouseEvent.MOUSE_UP, ss2d[this.onMouseUpHandler], false);
                this._skinQuad.addEventListener(ss2d.MouseEvent.MOUSE_MOVE, ss2d[this.onMouseMoveHandler], false);

                this._iconQuad = this._scene.applyQuad();
                this._scene.showQuad(this._iconQuad);
                this.addChild(this._iconQuad);
                this._iconQuad.setMouseEnabled(false);

                ss2d[this.onEnterFrameHandler] = this.onEnterFrameHandler.bind(this);
                ss2d.stage.addEventListener(ss2d.Event.ENTER_FRAME, ss2d[this.onEnterFrameHandler]);
            },

            ////////////////////////////////////////////////////////////////////////////
            //  Additional getters and setters
            ////////////////////////////////////////////////////////////////////////////

            getCurrentState : function() { return this._currentState; },
            setCurrentState : function(value)
            {
                if(this._currentState == value) return;
                if(this._stateNames.indexOf(value) < 0)
                {
                    throw "Invalid state: " + value + ".";
                }
                this._currentState = value;
            },

            getLabel : function(){ return this._label; },
            setLabel : function(value)
            {
                if(this._label == value) return;
                this._label = value;
                if (this._textField == null)
                {
                    this._textField = new ss2d.TextField();
                    ss2d.stage.addChild(this._textField);
                }
            },

            getToggle : function() { return this._isToggle; },
            setToggle : function(value)
            {
                this._isToggle = value;
            },

            getSelected : function(){ return this._isSelected; },
            setSelected : function(value)
            {
                if(this._isSelected == value) return;
                this._isSelected = value;
            },

            getIconPosition : function() { return this._iconPosition; },
            setIconPosition : function(value)
            {
                if(this._iconPosition == value) return;
                this._iconPosition = value;
            },

            getPadding : function(){ return this._paddingTop; },
            setPadding : function(value)
            {
                this.setPaddingTop(value);
                this.setPaddingRight(value);
                this.setPaddingBottom(value);
                this.setPaddingLeft(value);
            },

            getPaddingTop : function() { return this._paddingTop; },
            setPaddingTop : function(value)
            {
                if(this._paddingTop == value)  return;
                this._paddingTop = value;
            },

            getPaddingRight : function() { return this._paddingRight; },
            setPaddingRight : function(value)
            {
                if(this._paddingRight == value)  return;
                this._paddingRight = value;
            },

            getPaddingBottom : function() { return this._paddingBottom; },
            setPaddingBottom : function(value)
            {
                if(this._paddingBottom == value)  return;
                this._paddingBottom = value;
            },

            getPaddingLeft : function() { return this._paddingLeft; },
            setPaddingLeft : function(value)
            {
                if(this._paddingLeft == value)  return;
                this._paddingLeft = value;
            },

            getDefaultSkin : function(){ return this._defaultSkin; },
            setDefaultSkin : function(value)
            {
                if(this._defaultSkin == value)  return;
                this._defaultSkin = value;
            },

            getDefaultSelectedSkin : function(){ return this._defaultSelectedSkin; },
            setDefaultSelectedSkin : function(value)
            {
                if(this._defaultSelectedSkin == value)  return;
                this._defaultSelectedSkin = value;
            },

            getUpSkin : function(){ return this._upSkin; },
            setUpSkin : function(value)
            {
                if(this._upSkin == value)  return;
                this._upSkin = value;
            },

            getDownSkin : function(){ return this._downSkin; },
            setDownSkin : function(value)
            {
                if(this._downSkin == value)  return;
                this._downSkin = value;
            },

            getHoverSkin : function() { return this._hoverSkin; },
            setHoverSkin : function(value)
            {
                if(this._hoverSkin == value)  return;
                this._hoverSkin = value;
            },

            getDisabledSkin : function(){ return this._disabledSkin; },
            setDisabledSkin : function(value)
            {
                if(this._disabledSkin == value)  return;
                this._disabledSkin = value;
            },

            getSelectedUpSkin : function(){ return this._selectedUpSkin; },
            setSelectedUpSkin : function(value)
            {
                if(this._selectedUpSkin == value)  return;
                this._selectedUpSkin = value;
            },

            getSelectedDownSkin : function(){ return this._selectedDownSkin; },
            setSelectedDownSkin : function(value)
            {
                if(this._selectedDownSkin == value)  return;
                this._selectedDownSkin = value;
            },

            getSelectedHoverSkin : function(){ return this._selectedHoverSkin; },
            setSelectedHoverSkin : function(value)
            {
                if(this._selectedHoverSkin == value)  return;
                this._selectedHoverSkin = value;
            },

            getSelectedDisabledSkin : function(){ return this._selectedDisabledSkin; },
            setSelectedDisabledSkin : function(value)
            {
                if(this._selectedDisabledSkin == value)  return;
                this._selectedDisabledSkin = value;
            },

            getDefaultIcon : function(){ return this._defaultIcon; },
            setDefaultIcon : function(value)
            {
                if(this._defaultIcon == value)  return;
                this._defaultIcon = value;
            },

            getDefaultSelectedIcon : function(){ return this._defaultSelectedIcon; },
            setDefaultSelectedIcon : function(value)
            {
                if(this._defaultSelectedIcon == value)  return;
                this._defaultSelectedIcon = value;
            },

            getUpIcon : function(){ return this._upIcon; },
            setUpIcon : function(value)
            {
                if(this._upIcon == value)  return;
                this._upIcon = value;
            },

            getDownIcon : function(){ return this._downIcon; },
            setDownIcon : function(value)
            {
                if(this._downIcon == value)  return;
                this._downIcon = value;
            },

            getHoverIcon : function() { return this._hoverIcon; },
            setHoveIcon : function(value)
            {
                if(this._hoverIcon == value)  return;
                this._hoverIcon = value;
            },

            getDisabledIcon : function(){ return this._disabledIcon; },
            setDisabledIcon : function(value)
            {
                if(this._disabledIcon == value)  return;
                this._disabledIcon = value;
            },

            getSelectedUpIcon : function(){ return this._selectedUpIcon; },
            setSelectedUpIcon : function(value)
            {
                if(this._selectedUpIcon == value)  return;
                this._selectedUpIcon = value;
            },

            getSelectedDownIcon : function(){ return this._selectedDownIcon; },
            setSelectedDownIcon : function(value)
            {
                if(this._selectedDownIcon == value)  return;
                this._selectedDownIcon = value;
            },

            getSelectedHoverIcon : function(){ return this._selectedHoverIcon; },
            setSelectedHoverIcon : function(value)
            {
                if(this._selectedHoverIcon == value)  return;
                this._selectedHoverIcon = value;
            },

            getSelectedDisabledIcon : function(){ return this._selectedDisabledIcon; },
            setSelectedDisabledIcon : function(value)
            {
                if(this._selectedDisabledIcon == value)  return;
                this._selectedDisabledIcon = value;
            },

            ////////////////////////////////////////////////////////////////////////////
            //  private methods
            ////////////////////////////////////////////////////////////////////////////

            ////////////////////////////////////////////////////////////////////////////
            //  public methods
            ////////////////////////////////////////////////////////////////////////////

            isEnabled : function(value)
            {
                if(this._isEnabled == value) return;
                if(!this._isEnabled)
                {
                    this.currentState = ss2d.Button.STATE_DISABLED;
                }
                else
                {
                    if(this.currentState == ss2d.Button.STATE_DISABLED)
                    {
                        this.currentState = ss2d.Button.STATE_UP;
                    }
                }
            },

            /**
             * 释放
             */
            dispose : function()
            {
                ss2d.Button.Super.prototype.dispose.call(this);
                if (this._skinQuad)
                {
                    this.removeChild(this._skinQuad);
                    this._skinQuad.removeEventListener(ss2d.MouseEvent.MOUSE_DOWN, ss2d[this.onMouseDownHandler], false);
                    this._skinQuad.removeEventListener(ss2d.MouseEvent.MOUSE_UP, ss2d[this.onMouseUpHandler], false);
                    this._skinQuad.removeEventListener(ss2d.MouseEvent.MOUSE_MOVE, ss2d[this.onMouseMoveHandler], false);
                    this._skinQuad.dispose();
                }
                if (this._iconQuad)
                {
                    this.removeChild(this._iconQuad);
                    this._iconQuad.dispose();
                }
                ss2d.stage.removeEventListener(ss2d.Event.ENTER_FRAME, ss2d[this.onEnterFrameHandler]);

                ss2d[this.onMouseDownHandler] = null;
                ss2d[this.onMouseUpHandler] = null;
                ss2d[this.onMouseMoveHandler] = null;
                ss2d[this.onEnterFrameHandler] = null;
                this._skinQuad = null;
                this._iconQuad = null;
            },

            ////////////////////////////////////////////////////////////////////////////
            //  Eventhandling
            ////////////////////////////////////////////////////////////////////////////

            onEnterFrameHandler : function(e)
            {
                var currentSkin = null;
                var currentIcon = null;
                switch (this._currentState)
                {
                    case ss2d.Button.STATE_UP:
                        currentSkin = this._isSelected ? this.getSelectedUpSkin() : this.getUpSkin();
                        currentIcon = this._isSelected ? this.getSelectedUpIcon() : this.getUpIcon();
                        break;
                    case ss2d.Button.STATE_DOWN:
                        currentSkin = this._isSelected ? this.getSelectedDownSkin() : this.getDownSkin();
                        currentIcon = this._isSelected ? this.getSelectedDownIcon() : this.getDownIcon();
                        break;
                    case ss2d.Button.STATE_HOVER:
                        currentSkin = this._isSelected ? this.getSelectedHoverSkin() : this.getHoverSkin();
                        currentIcon = this._isSelected ? this.getSelectedHoverIcon() : this.getHoverIcon();
                        break;
                    case ss2d.Button.STATE_DISABLED:
                        currentSkin = this._isSelected ? this.getSelectedDisabledSkin() : this.getDisabledSkin();
                        currentIcon = this._isSelected ? this.getSelectedDisabledIcon() : this.getDisabledIcon();
                        break;
                }
                if (currentSkin == null) currentSkin = this._isSelected ? this.getDefaultSelectedSkin() : this.getDefaultSkin();
                if (currentIcon == null) currentIcon = this._isSelected ? this.getDefaultSelectedIcon() : this.getDefaultIcon();
                if (currentSkin)
                {
                    if (this._skinQuad._tileName != currentSkin)
                        this._skinQuad.setTileName(currentSkin);
                    this._skinQuad.setVisible(true);
                }
                else this._skinQuad.setVisible(false);

                if (currentIcon)
                {
                    if (this._iconQuad._tileName != currentIcon)
                        this._iconQuad.setTileName(currentIcon);
                    this._iconQuad.setVisible(true);
                }
                else this._iconQuad.setVisible(false);
            },

            /**
             * @private
             * @param e
             */
            onMouseDownHandler : function(e)
            {
                if (this._isEnabled)
                {
                    this._currentState = ss2d.Button.STATE_DOWN;
                    this.dispatchEvent(e);
                }
            },

            /**
             * @private
             * @param e
             */
            onMouseUpHandler : function(e)
            {
                if (this._isEnabled)
                {
                    this._currentState = ss2d.Button.STATE_UP;
                    this.dispatchEvent(e);
                }
            },

            /**
             * @private
             * @param e
             */
            onMouseMoveHandler : function(e)
            {
                if (this._isEnabled)
                {
                    this._currentState = ss2d.Button.STATE_HOVER;
                    this.dispatchEvent(e);
                }
            }
        }
    );
})();