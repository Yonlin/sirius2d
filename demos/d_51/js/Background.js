/**
 * Created by zane.deng on 14-3-12.
 */
(function()
{

    demo.Background = Class
    (
        {
            Extends : ss2d.Group,

            _scene : null,

            _bgTL : null,
            _bgTC : null,
            _bgTR : null,
            _bgCL : null,
            _bgCC : null,
            _bgCR : null,
            _bgBL : null,
            _bgBC : null,
            _bgBR : null,

            _width : 1,
            _height : 1,

            /**
             * 初始化
             */
            initialize : function(scene)
            {
                demo.Background.Super.call(this);
                this._scene = scene;
                this.createChildren();
            },

            getWidth : function(){ return this._width; },
            setWidth : function(value)
            {
                if (this._width != value)
                {
                    this._width = value;
                    this.layout();
                }
            },

            getHeight : function(){ return this._height; },
            setHeight : function(value)
            {
                if (this._height != value)
                {
                    this._height = value;
                    this.layout();
                }
            },

            createChildren : function()
            {
                this._bgTL = this._scene.applyQuad();
                this._bgTL.setTileName("bgTL");
                this._scene.showQuad(this._bgTL);
                this.addChild(this._bgTL);

                this._bgTC = this._scene.applyQuad();
                this._bgTC.setTileName("bgTC");
                this._scene.showQuad(this._bgTC);
                this.addChild(this._bgTC);

                this._bgTR = this._scene.applyQuad();
                this._bgTR.setTileName("bgTR");
                this._scene.showQuad(this._bgTR);
                this.addChild(this._bgTR);

                this._bgBL = this._scene.applyQuad();
                this._bgBL.setTileName("bgBL");
                this._scene.showQuad(this._bgBL);
                this.addChild(this._bgBL);

                this._bgBC = this._scene.applyQuad();
                this._bgBC.setTileName("bgBC");
                this._scene.showQuad(this._bgBC);
                this.addChild(this._bgBC);

                this._bgBR = this._scene.applyQuad();
                this._bgBR.setTileName("bgBR");
                this._scene.showQuad(this._bgBR);
                this.addChild(this._bgBR);

                this._bgCL = this._scene.applyQuad();
                this._bgCL.setTileName("bgCL");
                this._scene.showQuad(this._bgCL);
                this.addChild(this._bgCL);

                this._bgCC = this._scene.applyQuad();
                this._bgCC.setTileName("bgCC");
                this._scene.showQuad(this._bgCC);
                this.addChild(this._bgCC);

                this._bgCR = this._scene.applyQuad();
                this._bgCR.setTileName("bgCR");
                this._scene.showQuad(this._bgCR);
                this.addChild(this._bgCR);

                this.layout();
            },

            layout : function()
            {
                var cw = this.getWidth() - this._bgTL.getWidth() - this._bgTR.getWidth();
                var ch = this.getHeight() - this._bgTL.getHeight() - this._bgBL.getHeight();

                this._bgTL.setX(0);
                this._bgTL.setY(0);

                this._bgTC.setX(this._bgTL.getWidth());
                this._bgTC.setY(0);
                if (cw > 0) this._bgTC.setWidth( cw );

                this._bgTR.setX(this._bgTL.getWidth() + this._bgTC.getWidth());
                this._bgTR.setY(0);

                this._bgCL.setX(0);
                this._bgCL.setY(this._bgTL.getHeight());
                if (ch > 0) this._bgCL.setHeight( ch );

                this._bgCC.setX(this._bgTL.getWidth());
                this._bgCC.setY(this._bgCL.getY());
                if (cw > 0) this._bgCC.setWidth( cw );
                if (ch > 0) this._bgCC.setHeight( ch );

                this._bgCR.setX(this._bgTR.getX());
                this._bgCR.setY(this._bgCL.getY());
                if (ch > 0) this._bgCR.setHeight( ch );

                this._bgBL.setX(0);
                this._bgBL.setY(this._bgTL.getHeight() + this._bgCL.getHeight());

                this._bgBC.setX(this._bgBL.getWidth());
                this._bgBC.setY(this._bgBL.getY());
                if (cw > 0) this._bgBC.setWidth( cw );

                this._bgBR.setX(this._bgTR.getX());
                this._bgBR.setY(this._bgBL.getY());
            }
        }
    );
})();