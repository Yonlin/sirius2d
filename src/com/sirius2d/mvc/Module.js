/**
 * Created by zane.deng on 13-12-15.
 */
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