/**
 * Created by zane.deng on 14-3-13.
 */
(function()
{
    demo.Components = Class
    (
        {
            Extends : ss2d.Group,

            _scene : null,

            _startBtn : null,

            /**
             * 初始化
             */
            initialize : function(scene)
            {
                demo.Components.Super.call(this);
                this._scene = scene;
                this.createChildren();
            },

            createChildren : function()
            {
                this._startBtn = new ss2d.Button(this._scene);
                //this._startBtn.setDefaultSkin("btn0001");
                this._startBtn.setLabel("播放音效");
                this._startBtn.setUpSkin("btnUp");
                this._startBtn.setDownSkin("btnDown");
                this._startBtn.setHoverSkin("btnHover");
                this._startBtn.setX(100);
                this._startBtn.setY(15);
                this._startBtn.addEventListener(ss2d.MouseEvent.MOUSE_DOWN, function(e)
                {
                    demo.Main.sound.group("sound").item("long3hit").play(1);
                });
            }
        }
    );
})();