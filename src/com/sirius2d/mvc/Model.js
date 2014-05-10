/**
 * Created by zane.deng on 13-12-15.
 */
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