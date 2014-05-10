/**
 * Created by zane.deng on 13-12-15.
 */
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