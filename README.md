####sirius2d
天狼星2D（Sirius2D）是中国本土第一款以WebGL为渲染核心的HTML5跨平台游戏引擎，其核心理念为“精于源，修于行，泽于众”。
通过文档、案例、社区资源、网络教程与实体书籍，手把手地教会开发者掌握HTML5游戏开发这门手艺。


####快速入门

天狼星(Sirius2d) HTML5游戏引擎的目录结构如下。其中`bin`目录下为Sirius2d引擎的单文件发布版本和压缩发布版本。`demos`目录下为引擎的演示实例的源代码，包含[Sirius2d演示实例](http://sirius2d.com/demo.html)页面所有展示的演示实例。`doc`目录中为引擎的说明文档。`src`目录下为引擎的源文件。
```sh
|-- bin
|-- demos
|-- doc
|-- src
```
其中`src`源文件目录下的结构如下：
```sh
|-- src
  |--com
    |-- sirius2d
      |-- core
      |-- data
        |-- list
      |-- display
      |-- events
      |-- geom
      |-- loader
      |-- message
      |-- mvc
      |-- particle
      |-- shader
      |-- sound
      |-- system
      |-- ui
      |-- utils
```
- `core`目录包含了引擎的核心类定义
- `data`目录包含了引擎数据结构定义，目前仅对链表进行了实现，用于存储解码后的xml格式数据
- `display`目录包含了引擎渲染的核心类定义，包括批处理对象，纹理，场景，舞台，动画，混色等
- `events`目录包含游戏事件类的定义，包括舞台中的对象的生命周期事件及鼠标事件和定时器事件
- `geom`目录包含对基本集合形状（如点，矩形等）的定义，还对常用形状相关函数进行了封装
- `loader`目录包含各类异步资源加载器，例如`TagLoader`和`XHRLLoader`
- `message`目录包含了组件消息通信的核心类文件
- `mvc`目录为“模型-控制-视图”模式的核心实现类文件
- `partical`目录为粒子、粒子样式和粒子发射器等类的实现
- `shader`目录包括各中特殊效果的着色器实现，里面包含了丰富的渲染特效
- `sound`目录为游戏音效控制类文件
- `system`对各类终端设备系统属性的封装
- `ui`目录包括对游戏界面各UI类的实现，目前暂未完成
- `utils`目录对各种实用函数和工具库进行了封装


####起步
##### 1. 创建index.html
首先我们需要创建游戏的主页面，页面中应当包含一个Canvas元素对象，我们所有的游戏渲染工作将在其上进行。
```html
<!DOCTYPE html>
<html>
<head>
    <title>Sirius2d HTML5游戏引擎快速入门</title>
</head>
<body>
    <canvas id="canvas"></canvas>
</body>
</html>
```




#####2.引入`Sirius2d.1.0.9.min.js`文件

然后我们需要在页面`<head>`标签中引入引擎的压缩发布版`Sirius2d.1.0.9.min.js`文件。此文件在全局命名空间中定义了`ss2d`变量。
```html
<script src="Sirius2d.1.0.9.min.js"></script>
```

#####3.创建游戏的主文件Main.js
新建一个Main.js文件，并将其也引入到index.html页面中，完整的index.html页面如下所示：
```html
<!DOCTYPE html>
<html>
<head>
    <title>Sirius2d HTML5游戏引擎快速入门</title>
    <script src="Sirius2d.1.0.9.min.js"></script>
</head>
<body>
    <canvas id="canvas"></canvas>
    <script src="js/Main.js" type="text/javascript" charset="utf-8"></script>
    <script type="text/javascript">
        new demo.Main("canvas",1024, 512);
    </script>

</body>
</html>
```
#####4.创建游戏主类
```js
this.demo = this.demo || {};
(function()
{
  //游戏主类
  demo.Main = Class({});
})();
```
Class方法为Sirius2d引擎中定义类的实现，它会自动将传入的参数构造成为一个对象。

######(1)定义游戏主类的静态变量（STATIC）
每个游戏都会包含如下几个必备游戏元素：舞台(Stage)，场景(Scene)，资源(Assets)。
```js
STATIC :
   {
   //舞台
   stage : null,
   //场景
   scene : null,
   //游戏资源
   assets : null
},
```

######（2）游戏主类的初始化函数
主类初始化函数主要工作包括，加载对应的资源，并在加载图片资源的时候显示加载进度
```js
initialize : function(canvasId, width, height){
    //创建舞台
    demo.Main.stage = new ss2d.Stage2D(canvasId, width, height);
	//加载文本
    this.txt = new ss2d.TextField(256,32);
    this.txt.setFontSize(16);
    this.txt.setColor(0xff,0xff,0xff);
    this.txt.setText("进度");
    this.txt.setX(120);
    this.txt.setY(20);
    ss2d.stage.addChild(this.txt);
    //预加载资源列表
    this._manifest =[
        {src:"images/logo.png", id:"logo"}
    ];

    //把事件处理函数存放在demo中
    demo["handleFileLoad"] = this._handleFileLoad.bind(this);
    demo["handleOverallProgress"] = this._handleOverallProgress.bind(this);

    //资源加载器
    demo.Main.assets = new ss2d.LoadQueue(true);
    demo.Main.assets.on("fileload", demo["handleFileLoad"]);
    demo.Main.assets.on("progress", demo["handleOverallProgress"]);
    demo.Main.assets.loadManifest(this._manifest);
},
```
######（3）资源加载处理
包括两个函数，加载进度函数和加载完成回调函数。加载进度函数`_handleOverallProgress()`实时刷新资源的加载进度，并以文本的形式在屏幕上进行显示。加载完成回调函数`_handleFileLoad()`在每个文件加载完成时调用一次并进行计数，如果计数器达到预加载资源总数，说明所有资源以及记载完成，清除对应的事件监听器和资源加载回调函数。清除舞台上的进度文本对象并调用自定义的舞台初始化函数`_init()`。
```js
//资源文件加载完毕事件处理器
_handleFileLoad : function(e){
  this._loaded++;
  if (this._loaded == this._manifest.length){
    //移除文本对象
	ss2d.stage.removeChild( this.txt);
    //删除对应的事件监听器
    demo.Main.assets.removeEventListener("fileload", demo["handleFileLoad"]);
    demo.Main.assets.removeEventListener("progress", demo["handleOverallProgress"]);
    //销毁对应的方法
    demo["handleFileLoad"] = null;
    demo["handleOverallProgress"] = null;
    //加载完成后，调用自定义的舞台初始化函数，显示对象
    this._init();
  }
},

//资源文件加载进度事件处理器
_handleOverallProgress : function(e){
  var str = String(demo.Main.assets.progress).slice(2,4);
  this.txt.setText("正在加载......" + str + "%");
},

```

######（4）创建影片剪辑类并添加到舞台
创建影片剪辑类并添加到舞台由自定义的舞台初始化函数`_init()`中进行。首先通过Texture类的构造方法，生成了一个纹理对象，然后通过该纹理对象创建了MovieClip对象，并添加到舞台居中显示。
```js
mc:null,
_init:function(){
   //创建纹理对象
   var texture=new ss2d.Texture(demo.Main.assets.getResult("logo"));
   //创建一个影片剪辑类
   this.mc=new ss2d.MovieClip(texture);
  this.mc.setCenter(true);
  //添加到场景显示
  ss2d.stage.addChild(this.mc);

  this.mc.setX(ss2d.Stage2D.stageWidth/2);
  this.mc.setY(ss2d.Stage2D.stageHeight/2);
}

```

#####5. 结果展示
如果您跟着前面的教程一步一步做下来，那么当你打开浏览器，访问类似`http://localhost/demo/index.html`的地址，那么您就可以看到如下的效果了。如果您只是想看下最终的效果而没有跟随我们的脚步，那么请访问[演示实例](http://sirius2d.com/demos/d_1/)页面查看最终结果。

![Sirius2d demo](http://sirius2d.com/style/images/demo/demo1.jpg)


至此，我们使用Sirius2d游戏引擎制作的第一个游戏就完成了！恭喜您！虽然我们暂时只是显示了一张图片，但是更多的复杂功能等待您去发现和探索。起航吧！

####更多演示
您可以在[Srius2d演示](http://sirius2d.com/demo.html)页面找到更多的演示实例和源码。如果您在使用或学习过程中有任何疑问，请毫无顾虑的联系我们进行咨询或者寻求帮助！


####关于我们
Sirius2D由HTML5游戏开发者社区成员共同编写而成。每位创作人员都曾在国内外知名公司担任要职，有着非常丰富的游戏开发经验。对高质量游戏的共同追求促使团队成员将引擎核心定位在高效渲染上。在此基础上不断钻研挑战，寻求游戏功能效果的思路与方案，并将其分享出来。

HTML5游戏开发者社区成立于2013年06月，是国内最大的专注HTML5跨平台游戏开发的社区。本社区集游戏设计教程，游戏开发教程，游戏资源分享于一身，让用户参与其中，进行教程的编辑和发布，教程“取之于民，用之于民”，在大家的共同努力下，HTML5游戏开发者社区会愈来愈强大。如果您在使用Sirius2D的过程中，发现BUG、提供建议或者想参与我们共同编写引擎，请联系我们欢迎你的加入！

####联系方式
- QQ群:HTML5游戏开发者社区
- 邮箱:support@sirius2d.com

####相关链接
- [HTML5游戏开发者社区](http://html5gamedev.org)
- [Sirius2d.com](http://sirius2d.com)



