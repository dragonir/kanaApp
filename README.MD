# かなゲーム 五十音小游戏中的前端知识

> 在线体验地址 <https://dragonir.github.io/kanaApp/>

![kana](https://img2020.cnblogs.com/blog/772544/202107/772544-20210721223750054-1799916628.png)

## 背景

在日语学习初期阶段，我发现日语五十音的记忆并不是很容易的，片假名的记忆尤其令人费神。这时我想如果有一个应用可以充分利用碎片时间，在午休或地铁上随时可以练习五十音该多好。于是搜索 `App Store`，确实有很多五十音学习的小软件，但是商店的软件不是含有内购、夹带广告、就是动辄 `40M` 以上，没找到一个自己满意的应用。于是打算自己写一个，主要介绍自己在开发设计该应用过程中的一些收获。

## 实现

实现效果如下，该应用主要分为三个页面：

* 首页：包括菜单选项（平假名练习、片假名练习、混合练习）、深色模式切换按钮。
* 答题页：包括剩余机会和分数显示区、中间出题区、底部答题按钮。
* 结果页：结果分数显示和返回首页按钮。

答题逻辑规则是从给出的 `4` 个答案按钮中选出题目展示区的那个单词对应正确的那个选项，应用根据点击给出错对反馈并进行记分，错误 `10` 次后游戏结束，加载结果页。游戏逻辑实现不是本文的主要内容，因此后面不再赘述。本文后续主要内容是此次小游戏开发流程涉及到的前端知识的介绍。

![app](https://img2020.cnblogs.com/blog/772544/202107/772544-20210721223829975-903753135.gif)


### 深色模式 `⚪⚫`

随着 `Windows 10`、 `MacOs`、 `Android` 等系统陆续推出深色模式，浏览器也开始支持检测系统主题色配置，越来越多的网页应用都配置了深色模式切换功能。为了优化 `50音小游戏` 的视觉体验，我也配置了深色样式，实现效果如下：

![dark](https://img2020.cnblogs.com/blog/772544/202107/772544-20210721223855331-621898059.png)


#### `CSS` 媒体查询判断深色模式

`prefers-color-scheme` 媒体特性用于检测用户是否有将系统的主题色设置为亮色或者暗色。使用语法如下所示：

`@media (prefers-color-scheme: value) {}` 其中 `value` 有以下 `3` 种值，其中：

* `light`：表示用户系统支持深色模式，并且已设置为浅色主题（默认值）。
* `dark`：表示用户系统支持深色模式，并且已设置为深色主题。
* `no-preference`：表示用户系统不支持深色模式或无法得知是否设置为深色模式（已废弃）。

> 若结果为 `no-preference`，无法通过此媒体特性获知宿主系统是否支持设置主题色，或者用户是否主动将其设置为无偏好。出于隐私保护等方面的考虑，用户或用户代理也可能在一些情况下在浏览器内部将其设置为 `no-preference`。

下面例子中，当系统主题色为深色时 `.demo` 元素的背景色为 `#FFFFFF`；当系统主题色为浅色时，`.demo` 元素的背景色为 `#000000`。

```css
@media (prefers-color-scheme: dark) {
  .demo { background:  #FFFFFF; }
}
@media (prefers-color-scheme: light) {
  .demo { background: #000000; }
}
```

#### `JavaScript` 判断深色模式

`window.matchMedia()` 方法返回一个新的 `MediaQueryList` 对象，表示指定的媒体查询 `(en-US)字符串` 解析后的结果。返回的 `MediaQueryList` 可被用于判定 `Document` 是否匹配媒体查询，或者监控一个 `document` 来判定它匹配了或者停止匹配了此媒体查询。其中 `MediaQueryList` 对象具有属性 `matches`和 `media`，方法 `addListener` 和 `removeListener`。

使用 `matchMedia` 作为判断媒介，也可以识别系统是否支持主题色：

```js
if (window.matchMedia('(prefers-color-scheme)').media === 'not all') {
  // 浏览器不支持主题色设置
}
if (window.matchMedia('(prefers-color-scheme: dark)').matches){
  // 深色模式
} else {
  // 浅色模式
}
```

另外还可以动态监听系统深色模式的状态，根据系统深色模式的切换做出实时响应：

```js
window.matchMedia('(prefers-color-scheme: dark)').addListener(e => {
  if (e.matches) {
    // 开启深色模式
  } else {
    // 关闭深色模式
  }
});
```

或者单独检测深色或浅色模式：

```js
const listeners = {
  dark: (mediaQueryList) => {
    if (mediaQueryList.matches) {
      // 开启深色模式
    }
  },
  light: (mediaQueryList) => {
    if (mediaQueryList.matches) {
      // 开启浅色模式
    }
  }
};
window.matchMedia('(prefers-color-scheme: dark)').addListener(listeners.dark);
window.matchMedia('(prefers-color-scheme: light)').addListener(listeners.light);
```

在50音小游戏中，就是使用 `JavaScript` 检测系统是否开启深色模式，动态添加 `css` 类名来自动加载深色模式，同时也提供深浅色切换按钮，可以手动切换主题。

#### `HTML` 元素中判断深色模式

页面使用图片元素时，可以直接在 `HTML` 中判断系统是否开启深色模式。如：

```html
<picture>
  <source srcset="dark.png" media="(prefers-color-scheme: dark)">
  <img src="light.png">
</picture>
```

`picture` 元素允许我们在不同的设备上显示不同的图片，一般用于响应式。`HTML5` 引入了 `<picture>` 元素，该元素可以让图片资源的调整更加灵活。`<picture>` 元素零或多个 `<source>` 元素和一个 `<img>` 元素，每个 `<source>` 元素匹配不同的设备并引用不同的图像源，如果没有匹配的，就选择 `<img>` 元素的 `src` 属性中的 `url`。

> 注意: `<img>` 元素是放在最后一个 `<picture>` 元素之后，如果浏览器不支持该属性则显示 `<img>` 元素的的图片。

### 离线缓存

为了能够像原生应用一样可以在桌面生成快捷方式快速访问，随时随地离线使用，`50音小游戏` 使用了离线缓存技术，它是一个 `PWA应用` 。下面内容是 `PWA离线应用` 实现技术的简要描述。

> `PWA (progressing web app)`，渐进式网页应用程序，是 `下一代WEB应用模型`。一个 `PWA` 应用首先是一个网页, 并借助于 `App Manifest` 和 `Service Worker` 来实现安装和离线等功能。

特点：

* 渐进式：适用于选用任何浏览器的所有用户，因为它是以渐进式增强作为核心宗旨来开发的。
* 自适应：适合任何机型：桌面设备、移动设备、平板电脑或任何未来设备。
* 连接无关性：能够借助于服务工作线程在离线或低质量网络状况下工作。
* 离线推送：使用推送消息通知，能够让我们的应用像 `Native App` 一样，提升用户体验。
* 及时更新：在服务工作线程更新进程的作用下时刻保持最新状态。
* 安全性：通过 `HTTPS` 提供，以防止窥探和确保内容不被篡改。

#### 配置页面参数

在项目根目录添加文件 `manifest.webmanifest` 或 `manifest.json` 文件，并在文件内写入如下配置信息，本例中 `50音小游戏` 的页面参数信息配置如下：

```json
// manifest.webmainifest
{
  "name": "かなゲーム",
  "short_name": "かなゲーム",
  "start_url": "index.html",
  "display": "standalone",
  "background_color": "#fff",
  "description": "かなゲーム",
  "icons": [
    {
      "src": "assets/images/icon-64x64.png",
      "sizes": "64x64",
      "type": "image/png"
    },
    {
      "src": "assets/images/icon-256x256.png",
      "sizes": "256x256",
      "type": "image/png"
    }
  ]
}
```

**参数说明**：

* `name`：`Web App` 的名称，也是保存到桌面上时应用图标的名称。
* `short_name`：`name` 过长时，将会使用 `short_name` 代替 `name` 显示，是 `Web App` 的简称。
* `start_url`：指定了用户打开该 `Web App` 时加载 `URL`。`URL` 会相对于 `manifest` 文件所在路径。
* `display`：指定了应用的显示模式，它有四个值可以选择：
  * `fullscreen`：全屏显示，会尽可能将所有的显示区域都占满。
  * `standalone`：浏览器相关 `UI`（如导航栏、工具栏等）将被隐藏，看起来更像一个 `Native App`。
  * `minimal-ui`：显示形式与 `standalone` 类似，浏览器相关 `UI` 会最小化为一个按钮，不同浏览器在实现上略有不同。
  * `browser`：一般来说，会和正常使用浏览器打开样式一致。
  * 需要说明的是，当一些系统的浏览器不支持 `fullscreen` 时将会显示成 `standalone` 效果，当不支持 `standalone` 时，将会显示成 `minimal-ui` 的效果，以此类推。
* `description`：应用描述。
* `icons`：指定了应用的桌面图标和启动页图像，用数组表示：
  * sizes：图标大小。通过指定大小，系统会选取最合适的图标展示在相应位置上。
  * src：图标路径。相对路径是相对于 `manifest` 文件，也可以使用绝对路径。
  * type：图标图片类型。 浏览器会从 `icons` 中选择最接近 `128dp(px = dp * (dpi / 160))` 的图片作为启动画面图像。
* `background_color`：指定启动画面的背景颜色，采用相同颜色可以实现从启动画面到首页的平稳过渡，也可以用来改善页面资源正在加载时的用户体验。
* `theme_color`：指定了`Web App` 的主题颜色。可以通过该属性来控制浏览器 `UI` 的颜色。比如状态栏、内容页中状态栏、地址栏的颜色。

> 配置信息自动生成工具：<https://tomitm.github.io/appmanifest/>

#### 配置 `HTML` 文件

在 `index.html` 中引入 `manifest` 配置文件，并在 `head` 中添加以下配置信息以兼容 `iOS系统`

```html
<meta name=viewport content="width=device-width,initial-scale=1,maximum-scale=1,minimum-scale=1,user-scalable=no,viewport-fit=cover">
<meta name="apple-mobile-web-app-capable" content="yes"  />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="かなゲーム">
<link rel="stylesheet" type="text/css" href="./assets/css/main.css">
<link rel="stylesheet" type="text/css" href="./assets/css/dark.css">
<link rel="stylesheet" type="text/css" href="./assets/css/petals.css">
<link rel="shortcut icon" href="./assets/images/icon-256x256.png">
<link rel="apple-touch-icon" href="./assets/images/icon-256x256.png"/>
<link rel="apple-touch-icon-precomposed" href="./assets/images/icon-256x256.png">
<link rel="Bookmark" href="./assets/images/icon-256x256.png" />
<link rel="manifest" href="./manifest.webmanifest">
<title>かなゲーム</title>
```

* `apple-touch-icon`: 指定应用图标，类似与 `manifest.json` 文件的 `icons` 配置，也是支持 `sizes` 属性，来供不同场景的选择。
* `apple-mobile-web-app-capable`：类似于 `manifest.json` 中的 `display` 的功能，通过设置为 `yes` 可以进入 `standalone` 模式。
* `apple-mobile-web-app-title`：指定应用的名称。
* `apple-mobile-web-app-status-bar-style`：指定iOS移动设备的 `状态栏status bar` 的样式，有 `Default`，`Black`，`Black-translucent` 可以设置。

#### 注册使用 `Service Worker`

**在 `index.html` 中添加如下代码进行server-worker注册：**

```js
window.addEventListener('load', () => {
  registerSW();
});
async function registerSW() {
  if ('serviceWorker' in navigator) {
    try {
      await navigator.serviceWorker.register('./sw.js');
    } catch (e) {
      console.log(`SW registration failed`);
    }
  }
}
```

使用 `serviceWorkerContainer.register()` 进行 `Service worker` 注册，同时添加 `try...catch...` 容错判断，以保证在不支持 `Service worker` 的情况下正常运行。另外需要注意的是只有在 `https` 下，`navigator` 里才会有 `serviceWorker` 对象。

> `Service workers` 本质上充当 `Web` 应用程序、浏览器与网络（可用时）之间的代理服务器。旨在创建有效的离线体验，它会拦截网络请求并根据网络是否可用采取来适当的动作、更新来自服务器的的资源。它还提供入口以推送通知和访问后台同步 `API`。了解更多 `Service workder` 知识可以访问文章末尾链接 `🔗`。

**在根目录添加 `sw.js`，定义缓存信息和方法**

```js
// 定义缓存的key值
const cacheName = 'kana-v1';
// 定义需要缓存的文件
const staticAssets = [
  './',
  './index.html',
  './assets/css/main.css',
  './assets/js/main.js',
  './assets/images/bg.png'
  // ...
];

// 监听install事件，安装完成后，进行文件缓存
self.addEventListener('install', async e => {
  // 找到key对应的缓存并且获得可以操作的cache对象
  const cache = await caches.open(cacheName);
  // 将需要缓存的文件加进来
  await cache.addAll(staticAssets);
  return self.skipWaiting();
});

// 监听activate事件来更新缓存数据
self.addEventListener('activate', e => {
  // 保证第一次加载fetch触发
  self.clients.claim();
});

// 监听fetch事件来使用缓存数据：
self.addEventListener('fetch', async e => {
  const req = e.request;
  const url = new URL(req.url);
  if (url.origin === location.origin) {
    e.respondWith(cacheFirst(req));
  } else {
    e.respondWith(networkAndCache(req));
  }
});

async function cacheFirst(req) {
  // 判断当前请求是否需要缓存
  const cache = await caches.open(cacheName);
  const cached = await cache.match(req);
  // 有缓存就用缓存，没有就从新发请求获取
  return cached || fetch(req);
}

async function networkAndCache(req) {
  const cache = await caches.open(cacheName);
  try {
    // 缓存报错还直接从新发请求获取
    const fresh = await fetch(req);
    await cache.put(req, fresh.clone());
    return fresh;
  } catch (e) {
    const cached = await cache.match(req);
    return cached;
  }
}
```

在 `sw.js` 中采用的标准的 `web worker` 的编程方式，由于运行在另一个全局上下文中 `（self）`，这个全局上下文不同于 `window`，所以采用 `self.addEventListener()`。

`Cache API` 是 `Service Worker` 提供用来操作缓存的的接口，这些接口基于 `Promise` 实现，包括 `Cache` 和 `Cache Storage`，`Cache` 直接和请求打交道，为缓存的 `Request / Response` 对象对提供存储机制，`CacheStorage` 表示 `Cache` 对象的存储实例，我们可以直接使用全局的 `caches` 属性访问 `Cache API`。

** `Cache` 相关 `API` 说明：

* `Cache.match(request, options)`：返回一个 `Promise` 对象，`resolve` 的结果是跟 `Cache` 对象匹配的第一个已经缓存的请求。
* `Cache.matchAll(request, options)`：返回一个 `Promise` 对象，`resolve` 的结果是跟 `Cache` 对象匹配的所有请求组成的数组。
* `Cache.addAll(requests)`：接收一个 `URL` 数组，检索并把返回的 `response` 对象添加到给定的 `Cache` 对象。
* `Cache.delete(request, options)`：搜索 `key` 值为 `request` 的 `Cache` 条目。如果找到，则删除该 `Cache` 条目，并且返回一个 `resolve` 为 `true` 的 `Promise` 对象；如果未找到，则返回一个 `resolve` 为 `false` 的 `Promise` 对象。
* `Cache.keys(request, options)`：返回一个 `Promise` 对象，`resolve` 的结果是 `Cache` 对象 `key` 值组成的数组。

> 注：使用 `request.clone()` 和 `response.clone()` 是因为 `request` 和 `response` 是一个流，只能消耗一次。缓存时已经消耗一次，再发起 `HTTP` 请求还要消耗一次，此时使用 `clone` 方法克隆请求。

至此，当已安装的 `Service Worker` 页面被打开时，便会触发 `Service Worker` 脚本更新。当上次脚本更新写入 `Service Worker` 数据库的时间戳与本次更新超过 `24小时`，便会触发 `Service Worker` 脚本更新。当 `sw.js` 文件改变时，便会触发 `Service Worker` 脚本更新。更新流程与安装类似，只是在更新安装成功后不会立即进入 `active` 状态，更新后的 `Service Worker` 会和原始的 `Service Worker` 共同存在，并运行它的 `install`，一旦新 `Service Worker` 安装成功，它会进入 `wait` 状态，需要等待旧版本的 `Service Worker` 进/线程终止。

> 更多 `Server Worker` 进阶知识可以查看文章末尾链接 `🔗`

**实现效果**：

**PC端 🖥️**：`Windows`上，在浏览器中初次打开应用后会有安装提示，点击安装图标之后进行安装，桌面和开始菜单中会生成应用快捷方式，点击快捷方式就可以打开应用。

![windows](https://img2020.cnblogs.com/blog/772544/202107/772544-20210721223951772-1357923258.png)


**`Mac 💻`**： 上面 `chromiumn内核` 的浏览器（`chrome`、`opera`、新版`edge`）也是类似的。安装之后会在 `launchpad` 中生成快捷方式。

![mac](https://img2020.cnblogs.com/blog/772544/202107/772544-20210721224148524-278618387.png)


**移动端 📱**：`iPhone`。浏览器中选择保存到桌面，就可生成桌面图标，点击图标打开离线应用。

![iphone](https://img2020.cnblogs.com/blog/772544/202107/772544-20210721224205132-754758074.png)


### 樱花飘落动画 `🌸`

![petals](https://img2020.cnblogs.com/blog/772544/202107/772544-20210721224227602-1027411374.gif)


为增强视觉效果和趣味性，于是在页面增加了樱花 `🌸` 飘落的效果。飘落效果动画主要使用到 `Element.animate()` 方法。

`Element` 的 `animate()` 方法是一个创建新 `Animation` 的便捷方法，将它应用于元素，然后运行动画。它将返回一个新建的 `Animation` 对象实例。一个元素上可以应用多个动画效果。你可以通过调用此函数获得这些动画效果的一个列表： `Element.getAnimations()`。

**基本语法**：

```js
var animation = element.animate(keyframes, options);
```

**参数**：

* `keyframes`：关键帧。一个对象，代表关键帧的一个集合。
* `options`：可选项代表动画持续时间的整形数字 (以毫秒为单位), 或者一个包含一个或多个时间属性的对象：
  * `id`： 可选，在 `animate()` 里可作为唯一标识的属性: 一个用来引用动画的字符串（ `DOMString` ）
  * `delay`：可选，开始时间的延迟毫秒数，默认值为 `0`。
  * `direction`：可选，动画的运动方向。向前运行 `normal`、向后运行 `reverse`、每次迭代后切换方向 `alternate`，向后运行并在每次迭代后切换方向 `alternate-reverse`。默认为 `normal`。
  * `duration`：可选，动画完成每次迭代的毫秒数，默认值为 `0`。
  * `easing`：可选，动画随时间变化的频率。接受预设的值包括 `linear`、`ease`、 `ease-in`、`ease-out`、`ease-in-out`及一个自定义值 `cubic-bezier`， 如 `cubic-bezier(0.42, 0, 0.58, 1)`。默认值为 `linear`。
  * `endDelay`：可选，一个动画结束后的延迟，默认值为 `0`。
  * `fill`：可选，定义动画效果对元素的影响时机，`backwards` 动画开始前影响到元素上、 `forwards` 动画完成后影响到元素上、`both` 两者兼具。默认值为 `none`。
  * `iterationStart`：可选，描述动画应该在迭代中的哪个点开始。例如，`0.5` 表示在第一次迭代中途开始，并且设置此值后，具有 `2` 次迭代的动画将在第三次迭代中途结束。默认为 `0.0`。
  * `iterations`：可选，动画应该重复的次数。默认为 `1`，也可以取 `infinity` 的值，使其在元素存在时重复。

以下代码为本例中的具体实现，`HTML`中有若干个 `.petal` 元素，然后 `JavaScript` 中获取到所有 `.petal` 元素添加随机动画，css中添加两种旋转和变形两种动画，实现樱花花瓣飘落的效果。

```html
<div id="petals_container">
  <div class="petal"></div>
  <!-- ... -->
  <div class="petal"></div>
</div>
```

```js
var petalPlayers = [];
function animatePetals() {
  var petals = document.querySelectorAll('.petal');
  if (!petals[0].animate) {
    var petalsContainer = document.getElementById('petals_container');
    return false;
  }
  for (var i = 0, len = petals.length; i < len; ++i) {
    var petal = petals[i];
    petal.innerHTML = '<div class="rotate"><img src="petal.png" class="askew"></div>';
    var scale = Math.random() * .6 + .2;
    var player = petal.animate([{
        transform: 'translate3d(' + (i / len * 100) + 'vw,0,0) scale(' + scale + ')',
        opacity: scale
      },
      {
        transform: 'translate3d(' + (i / len * 100 + 10) + 'vw,150vh,0) scale(' + scale + ')',
        opacity: 1
      }
    ], {
      duration: Math.random() * 90000 + 8000,
      iterations: Infinity,
      delay: -(Math.random() * 5000)
    });
    petalPlayers.push(player);
  }
}
animatePetals();
```

```css
.petal .rotate {
  animation: driftyRotate 1s infinite both ease-in-out;
  perspective: 1000;
}
.petal .askew {
  transform: skewY(10deg);
  display: block;
  animation: drifty 1s infinite alternate both ease-in-out;
  perspective: 1000;
}
.petal:nth-of-type(7n) .askew {
  animation-delay: -.6s;
  animation-duration: 2.25s;
}
.petal:nth-of-type(7n + 1) .askew {
  animation-delay: -.879s;
  animation-duration: 3.5s;
}
/* ... */
.petal:nth-of-type(9n) .rotate {
  animation-duration: 2s;
}
.petal:nth-of-type(9n + 1) .rotate {
  animation-duration: 2.3s;
}
/* ... */
@keyframes drifty {
  0% {
    transform: skewY(10deg) translate3d(-250%, 0, 0);
    display: block;
  }
  100% {
    transform: skewY(-12deg) translate3d(250%, 0, 0);
    display: block;
  }
}
@keyframes driftyRotate {
  0% {
    transform: rotateX(0);
    display: block;
  }
  100% {
    transform: rotateX(359deg);
    display: block;
  }
}
```

> 完整代码可查看文后链接 `🔗`。

### `CSS` 判断手机横屏

本例 `50音小游戏` 应用是针对移动端开发，未作pc端的样式适配，所以可以添加一个横屏引导页面提示用户使用竖屏。在 `CSS` 中判断移动设备是否处于横屏状态，需要用到 `aspect-ratio` 进行媒体查询，通过测试 `viewport` 的宽高比来进行判断。

`aspect-ratio`宽高比属性被指定为 `<ratio>` 值来代表 `viewport` 的宽高比。其为一个范围，可以使用 `min-aspect-ratio` 和 `max-aspect-ratio` 分别查询最小和最大值。基本语法如下：

```css
/* 最小宽高比 */
@media (min-aspect-ratio: 8/5) {
  // ...
}
/* 最大宽高比 */
@media (max-aspect-ratio: 3/2) {
  // ...
}
/* 明确的宽高比, 放在最下部防止同时满足条件时的覆盖 */
@media (aspect-ratio: 1/1) {
  // ...
}
```

在应用中的具体实现方式是添加一个 `.mod_orient_layer` 引导层并隐藏，当达到最小宽高比时将其显示：

```html
<div class="mod_orient_layer"></div>
```

```css
.mod_orient_layer {
  display: none;
  position: fixed;
  height: 100%;
  width: 100%;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  background: #FFFFFF url('landscape.png') no-repeat center;
  background-size: auto 100%;
}
@media screen and (min-aspect-ratio: 13/8) {
  .mod_orient_layer {
    display: block;
  }
}
```

实现效果：

![landscape](https://img2020.cnblogs.com/blog/772544/202107/772544-20210721224300427-1482049129.png)


## 兼容性

下面是本文中涉及的几个属性的兼容性视图，在实际生产项目中需要注意兼容性适配。

![caniuse](https://img2020.cnblogs.com/blog/772544/202107/772544-20210721224319574-849017663.png)


## Photoshop 技能

### logo设计

`logo` 主要由两个元素构成由一个 `⛩️` 图标和日语平假名 `あ` 构成，都是经典的日系元素，同时对 `あ` 进行拉伸渐变，形成类似 `⛩️` 的阴影，使字母和图形巧妙连接在一起，使画面和谐。logo背景色使用应用主题背景色，与页面在无形之中建立联系，形成 `全链路` 统一风格标准。（编不下去了。。。😂

![](https://img2020.cnblogs.com/blog/772544/202107/772544-20210721224448266-1711041498.png)


> `⛩` 鸟居原始模型来源于 `dribbble`： <https://dribbble.com>

## 外部链接及参考资料

* 樱花散落动画完整版 <https://codepen.io/dragonir/full/WNjEPwW>
* Dark Mode Support in WebKit <https://webkit.org/blog/8840/dark-mode-support-in-webkit>
* PWA技术理论+实战全解析 <https://www.cnblogs.com/yangyangxxb/p/9964959.html>
* H5 PWA技术 <https://zhuanlan.zhihu.com/p/144512343>
* aspect-ratio <https://developer.mozilla.org/zh-CN/docs/Web/CSS/@media/aspect-ratio>
* Service Worker <https://developer.mozilla.org/zh-CN/docs/Web/API/Service_Worker_API>
* Element.animate() <https://developer.mozilla.org/zh-CN/docs/Web/API/Element/animate>

> 作者：dragonir 博客地址：https://www.cnblogs.com/dragonir/p/15041977.html
