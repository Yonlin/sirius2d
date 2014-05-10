/**
 * Created by zane.deng on 13-12-15.
 */

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