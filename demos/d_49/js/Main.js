this.demo = this.demo || {};
(function()
{
    /**
     * 游戏主类
     * @class
     */
    demo.Main = Class
    (
        /** @lends demo.Main.prototype */
        {

            STATIC :
            /** @lends demo.Main */
            {
                /**
                 * 舞台
                 */
                stage : null,

                sound : null
            },

            /**
             * 初始化
             */
            initialize : function(canvasId, width, height)
            {
                demo.Main.sound = new ss2d.SoundManager();
                demo.Main.sound.group("sound").add("long3hit").load("audio/long3hit.mp3");

                //创建舞台
                demo.Main.stage = new ss2d.Stage2D(canvasId, width, height);

                var text=new ss2d.TextField();
                text.setText("点击屏幕播放音效");
                ss2d.stage.addChild(text);
                ss2d.stage.addEventListener(ss2d.MouseEvent.MOUSE_DOWN, function(e)
                {
                    demo.Main.sound.group("sound").item("long3hit").play(1);
                });
            }
        }
    );
})();