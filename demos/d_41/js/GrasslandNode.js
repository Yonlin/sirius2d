this.demo = this.demo || {};
(function()
{
    /**
     * 游戏主类
     * @class
     */
    demo.GrasslandNode = Class
        (
            /** @lends demo.Main.prototype */
            {

                quad:null,

                /**
                 * 比例
                 */
                scale :0,

                /**
                 * 角度
                 */
                angle: 0,

                /**
                 * 速度
                 */
                speed:0,

                /**
                 * 加速度
                 */
                velocity:0,
                /**
                 * 初始化
                 */
                initialize : function(quad)
                {

                    this.quad = quad;

                    //设置居中对其
                    this.quad.setCenter(true);

                    //设置草地偏移量,把中心点定位到草地下方
                    this.quad.setPivotY(20);
                    this.quad.setPivotX(-160);
                    var rand = Math.random() * 100;
                    if (rand > 50)
                    {
                        this.scale = 1;
                        this.speed = (Math.random() * 2 + 7);
                    }else {
                        this.scale = -1;
                        this.speed = -7 - Math.random()*2;
                    }
                    this.velocity=.03*Math.random()+Math.random()*.01;
                    this.angle=.017*Math.random()+Math.random()*.01;
                },

                run:function()
                {
                    //让它们很微妙的运动
                    this.angle += this.velocity;
                    this.quad.setRotation(90*-this.scale+Math.sin(this.angle)*this.speed)
                    this.quad.setScaleX((.5+Math.sin(this.angle/1.8)*3/100)*this.scale);
                    this.quad.setScaleY(.5+Math.sin(this.angle/1.8)*3/100);
                }

            }
        );
})();