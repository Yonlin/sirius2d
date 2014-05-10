/**
 * Created by zane.deng on 13-12-15.
 */
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