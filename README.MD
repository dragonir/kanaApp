# かなゲーム

![kana](http://127.0.0.1:8080/markdown/kana.png)

> 在线体验地址 <https://dragonir.github.io/kanaApp/>

## 五十音小游戏中的前端知识

## 背景

在学习日语的初期阶段，我发现日语五十音的记忆并不是很容易的，平假名的记忆尤其令人费神。这时我想如果有一个应用可以充分利用碎片时间，在午休或地铁上随时可以练习该多好。于是搜遍整个App Store，商店的软件不是含有内购、夹带广告就是动辄40M以上，没找到一个自己满意的应用。于是打算自己造轮子写一个，因此有了该网页应用和文章的产生。在这篇文章中，主要介绍自己在开发这个应用过程中的收获。

## 实现

### 深色模式

#### `prefers-color-scheme` 媒体查询

`prefers-color-scheme` 媒体特性用于检测用户是否有将系统的主题色设置为亮色或者暗色。

语法

`@media (prefers-color-scheme: value) {}` 其中 `value` 有以下 `3` 种值，它们分别表示：

* `light`：表示用户系统支持深色模式，并且已设置为浅色主题（默认值）。
* `dark`：表示用户系统支持深色模式，并且已设置为深色主题。
* `no-preference`：表示用户系统不支持深色模式或无法得知是否设置为深色模式（已废弃）。

> 若结果为 `no-preference`，无法通过此媒体特性获知宿主系统是否支持设置主题色，或者用户是否主动将其设置为无偏好。出于隐私保护等方面的考虑，用户或用户代理也可能在一些情况下在浏览器内部将其设置为 `no-preference`。

如以下例子所示，当系统主题色为深色时 `.demo` 元素的背景色为 `#FFFFFF`；当系统主题色为浅色时，`.demo` 元素的背景色为 `#000000`。

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

使用matchMedia作为判断媒介，也可以识别系统是否支持主题色：

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
  if (e.matches) { /* 开启深色模式 */ }
  else { /* 关闭深色模式 */ }
});

// 或
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

#### `HTML` 元素中判断

`picture` 元素允许我们在不同的设备上显示不同的图片，一般用于响应式。
`HTML5` 引入了 `<picture>` 元素，该元素可以让图片资源的调整更加灵活。
`<picture>` 元素零或多个 `<source>` 元素和一个 `<img>` 元素，每个 `<source>` 元素匹配不同的设备并引用不同的图像源，如果没有匹配的，就选择 `<img>` 元素的 src 属性中的 url。

```html
<picture>
  <source srcset="dark.png" media="(prefers-color-scheme: dark)">
  <img src="light.png">
</picture>
```

> 注意:`<img>` 元素是放在最后一个 `<picture>` 元素之后，如果浏览器不支持该属性则显示 `<img>` 元素的的图片。
> Darkmode.js GitHub 开源项目 Darkmode.js，通过 CSS 属性 mix-blend-mode 暴力实现深色模式，现在它有 2.2k Star。mix-blend-mode 描述当前元素的内容应该与当前元素的直系父元素的内容和元素的背景如何混合，值为 difference 时即“反相”。

### 离线缓存

windows
![windows](http://127.0.0.1:8080/markdown/windows.png)

Mac

iPhone
![iphone](http://127.0.0.1:8080/markdown/iphone.png)

为了能够像原生应用一样可以随时随地离线使用，50音小游戏使用了离线缓存技术，是一个 `PWA` 应用。下面内容简要描述pwa离线应用的简要实现技术。

PWA(progressing web app)，渐进式网页应用程序，是Google在2016年GoogleI/O大会上提出的下一代web应用模型，并在随后的日子里迅速发展。 一个 PWA 应用首先是一个网页, 可以通过 Web 技术编写出一个网页应用. 随后借助于 App Manifest 和 Service Worker 来实现 PWA 的安装和离线等功能。

PWA的特点
渐进式：适用于选用任何浏览器的所有用户，因为它是以渐进式增强作为核心宗旨来开发的。
自适应：适合任何机型：桌面设备、移动设备、平板电脑或任何未来设备。
连接无关性：能够借助于服务工作线程在离线或低质量网络状况下工作。
离线推送：使用推送消息通知，能够让我们的应用像 Native App 一样，提升用户体验。
及时更新：在服务工作线程更新进程的作用下时刻保持最新状态。
安全性：通过 HTTPS 提供，以防止窥探和确保内容不被篡改。

#### 配置页面参数

在项目根目录添加文件 `manifest.webmanifest` 或 `manifest.json` 文件，并在文件内写入如下配置信息，例如50音小游戏的配置如下：

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

参数说明：

* `name`：`Web App` 的名称，也是保存到桌面上时应用图标的名称。
* `short_name`：`name` 过长时，将会使用 `short_name` 代替 `name` 显示，是 `Web App` 的简称。
* `start_url`：指定了用户打开该 `Web App` 时加载 `URL`。`URL` 会相对于 `manifest` 文件所在路径。
* `display`：指定了应用的显示模式，它有四个值可以选择：
  * `fullscreen`：全屏显示，会尽可能将所有的显示区域都占满。
  * `standalone`：浏览器相关 `UI`（如导航栏、工具栏等）将被隐藏，看起来更像一个 `Native App`。
  * `minimal-ui`：显示形式与 `standalone` 类似，浏览器相关 `UI` 会最小化为一个按钮，不同浏览器在实现上略有不同。
  * `browser`：一般来说，会和正常使用浏览器打开样式一致。
  > 需要说明的是，当一些系统的浏览器不支持 `fullscreen` 时将会显示成 `standalone` 效果，当不支持 `standalone` 时，将会显示成 `minimal-ui` 的效果，以此类推。
* `description`：应用描述。
* `icons`：指定了应用的桌面图标和启动页图像，用数组表示：
  * sizes：图标大小。通过指定大小，系统会选取最合适的图标展示在相应位置上。
  * src：图标路径。相对路径是相对于 `manifest` 文件，也可以使用绝对路径。
  * type：图标图片类型。 浏览器会从 `icons` 中选择最接近 `128dp(px = dp * (dpi / 160))` 的图片作为启动画面图像。
* `background_color`：指定启动画面的背景颜色，采用相同颜色可以实现从启动画面到首页的平稳过渡，也可以用来改善页面资源正在加载时的用户体验。
* `theme_color`：指定了`Web App` 的主题颜色。可以通过该属性来控制浏览器 UI 的颜色。比如状态栏、内容页中状态栏、地址栏的颜色。

> 配置信息自动生成工具：<https://tomitm.github.io/appmanifest/>

#### 配置 `HTML`

在 `index.html` 中引入 `manifest` 配置文件，并在 `head` 中添加以下配置信息以兼容 `iOS系统`

```html
<meta name=viewport content="width=device-width,initial-scale=1,maximum-scale=1,minimum-scale=1,user-scalable=no,viewport-fit=cover">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="かなゲーム">
<link rel="stylesheet" type="text/css" href="./assets/css/main.css">
<link rel="stylesheet" type="text/css" href="./assets/css/dark.css">
<link rel="stylesheet" type="text/css" href="./assets/css/petals.css">
<link rel="shortcut icon" href="./assets/images/icon-256x256.png">
<link rel="apple-touch-icon-precomposed" href="./assets/images/icon-256x256.png">
<link rel="apple-touch-icon" href="./assets/images/icon-256x256.png"/>
<link rel="Bookmark" href="./assets/images/icon-256x256.png" />
<link rel="manifest" href="./manifest.webmanifest">
<title>かなゲーム</title>
```

* `apple-touch-icon`: 指定了应用的图标，类似与manifest.json文件的icons配置，也是支持sizes属性，来供不同场景的选择。
* apple-mobile-web-app-capable：类似于 manifest.json 中的display的功能，通过设置为yes可以进入 standalone模式，目前来说iOS系统还支持这个模式。
* apple-mobile-web-app-title：指定了应用的名称。
* apple-mobile-web-app-status-bar-style：指定了iOS移动设备的状态栏(status bar)的样式，有Default，Black，Black-translucent可以设置。

采用iOS12.0测试下来看，apple-touch-icon，apple-mobile-web-app-status-bar-style是真实生效的，而 manifest.json 的 icons 则不会被iOS系统识别，下面是iOS系统safari保存到桌面操作的截图：

#### 注册使用 `Service Worker`

1. 要将Service Worker进行注册：
在前端项目public文件夹下的index.html中添加如下代码：

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

采用serviceWorkerContainer.register()来注册Service Worker，这里要做好容错判断，保证某些机型在不支持Service Worker的情况下可以正常运行，而不会报错。

另外需要注意的是只有在https下，navigator里才会有serviceWorker这个对象。

2. 在前端项目public文件夹下新建sw-my.js，并定义需要缓存的文件路径：
// 定义需要缓存的文件
var cacheFiles = [
  './lib/weui/weui.min.js',
  './lib/slider/slider.js',
  './lib/weui/weui.min.css'
]
// 定义缓存的key值
var cacheName = '20190301'
3. 监听install事件，来进行相关文件的缓存操作：
// 监听install事件，安装完成后，进行文件缓存
self.addEventListener('install', function (e) {
  console.log('Service Worker 状态： install')

  // 找到key对应的缓存并且获得可以操作的cache对象
  var cacheOpenPromise = caches.open(cacheName).then(function (cache) {
    // 将需要缓存的文件加进来
    return cache.addAll(cacheFiles)
  })
  // 将promise对象传给event
  e.waitUntil(cacheOpenPromise)
})

我们在sw-my.js里面采用的标准的web worker的编程方式，由于运行在另一个全局上下文中（self），这个全局上下文不同于window，所以我们采用self.addEventListener()。

Cache API是由Service Worker提供用来操作缓存的的接口，这些接口基于Promise来实现，包括了Cache和Cache Storage，Cache直接和请求打交道，为缓存的 Request / Response 对象对提供存储机制，CacheStorage 表示 Cache 对象的存储实例，我们可以直接使用全局的caches属性访问Cache API。

Cache相关API说明：

Cache.match(request, options) 返回一个 Promise对象，resolve的结果是跟 Cache 对象匹配的第一个已经缓存的请求。
Cache.matchAll(request, options) 返回一个Promise 对象，resolve的结果是跟Cache对象匹配的所有请求组成的数组。
Cache.addAll(requests)接收一个URL数组，检索并把返回的response对象添加到给定的Cache对象。
Cache.delete(request, options)搜索key值为request的Cache 条目。如果找到，则删除该Cache 条目，并且返回一个resolve为true的Promise对象；如果未找到，则返回一个resolve为false的Promise对象。
Cache.keys(request, options)返回一个Promise对象，resolve的结果是Cache对象key值组成的数组。

4. 监听fetch事件来使用缓存数据：
self.addEventListener('fetch', function (e) {
  console.log('现在正在请求：' + e.request.url)

  e.respondWith(
    // 判断当前请求是否需要缓存
    caches.match(e.request).then(function (cache) {
      // 有缓存就用缓存，没有就从新发请求获取
      return cache || fetch(e.request)
    }).catch(function (err) {
      console.log(err)
      // 缓存报错还直接从新发请求获取
      return fetch(e.request)
    })
  )
})
上一步我们将相关的资源进行了缓存，那么接下来就要使用这些缓存，这里同样要做好容错逻辑，记住一旦请求被Service Worker接管，浏览器的默认请求就不再生效了，意思就是请求的发与不发，出错与否全部由自己的代码控制，这里一定要做好兼容，当缓存失效或者发生内部错误时，及时调用fetch重新在发起请求。 正如上面提到的Service Worker的生命周期，fetch事件的触发，必须依赖Service Worker进入activated状态，于是来到第五步。

5. 监听activate事件来更新缓存数据：

使用缓存一个必不可少的步骤就是更新缓存，如果缓存无法更新，那么将毫无意义。 我们在sw-my.js中添加如下代码：

```js
// 监听activate事件，激活后通过cache的key来判断是否更新cache中的静态资源
self.addEventListener('activate', function (e) {
  console.log('Service Worker 状态： activate')
  var cachePromise = caches.keys().then(function (keys) {
    // 遍历当前scope使用的key值
    return Promise.all(keys.map(function (key) {
      // 如果新获取到的key和之前缓存的key不一致，就删除之前版本的缓存
      if (key !== cacheName) {
        return caches.delete(key)
      }
    }))
  })
  e.waitUntil(cachePromise)
  // 保证第一次加载fetch触发
  return self.clients.claim()
})
```

每当已安装的Service Worker页面被打开时，便会触发Service Worker脚本更新。
当上次脚本更新写入Service Worker数据库的时间戳与本次更新超过24小时，便会触发Service Worker脚本更新。
当sw-my.js文件改变时，便会触发Service Worker脚本更新。
更新流程与安装类似，只是在更新安装成功后不会立即进入active状态，更新后的Service Worker会和原始的Service Worker共同存在，并运行它的install，一旦新Service Worker安装成功，它会进入wait状态，需要等待旧版本的Service Worker进/线程终止。 self.skipWaiting()可以阻止等待，让新Service Worker安装成功后立即激活。 self.clients.claim()方法来让没被控制的 clients 受控，也就是设置本身为activate的Service Worker。

```js
const cacheName = 'kana-v1';
const staticAssets = [
  './',
  './index.html',
  './assets/css/main.css',
  './assets/css/dark.css',
  './assets/css/petals.css',
  './assets/js/main.js',
  './assets/js/kanaList.js',
  './assets/js/petals.js',
  './assets/json/kanaList.json',
  './assets/images/bg.png',
  './assets/images/bg_dark.png',
  './assets/images/mode_toggle.png',
  './assets/images/miraitowa.png',
  './assets/images/icon-64x64.png',
  './assets/images/icon-256x256.png',
  './assets/images/petal.png',
  './assets/images/prize.png',
];

self.addEventListener('install', async e => {
  const cache = await caches.open(cacheName);
  await cache.addAll(staticAssets);
  return self.skipWaiting();
});

self.addEventListener('activate', e => {
  self.clients.claim();
});

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
  const cache = await caches.open(cacheName);
  const cached = await cache.match(req);
  return cached || fetch(req);
}

async function networkAndCache(req) {
  const cache = await caches.open(cacheName);
  try {
    const fresh = await fetch(req);
    await cache.put(req, fresh.clone());
    return fresh;
  } catch (e) {
    const cached = await cache.match(req);
    return cached;
  }
}
```

参考

```js
var cacheName = 'helloWorld';     // 缓存的名称  
// install 事件，它发生在浏览器安装并注册 Service Worker 时        
self.addEventListener('install', event => { 
/* event.waitUtil 用于在安装成功之前执行一些预装逻辑
 但是建议只做一些轻量级和非常重要资源的缓存，减少安装失败的概率
 安装成功后 ServiceWorker 状态会从 installing 变为 installed */
  event.waitUntil(
    caches.open(cacheName)                  
    .then(cache => cache.addAll([    // 如果所有的文件都成功缓存了，便会安装完成。如果任何文件下载失败了，那么安装过程也会随之失败。        
      '/js/script.js',
      '/images/hello.png'
    ]))
  );
});
  
/**
为 fetch 事件添加一个事件监听器。接下来，使用 caches.match() 函数来检查传入的请求 URL 是否匹配当前缓存中存在的任何内容。如果存在的话，返回缓存的资源。
如果资源并不存在于缓存当中，通过网络来获取资源，并将获取到的资源添加到缓存中。
*/
self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request)                  
    .then(function (response) {
      if (response) {                            
        return response;                         
      }
      var requestToCache = event.request.clone();  //          
      return fetch(requestToCache).then(                   
        function (response) {
          if (!response || response.status !== 200) {      
            return response;
          }
          var responseToCache = response.clone();          
          caches.open(cacheName)                           
            .then(function (cache) {
              cache.put(requestToCache, responseToCache);  
            });
          return response;             
    })
  );
});
```

> 注：为什么用request.clone()和response.clone()
需要这么做是因为request和response是一个流，它只能消耗一次。因为我们已经通过缓存消耗了一次，然后发起 HTTP 请求还要再消耗一次，所以我们需要在此时克隆请求
Clone the request—a request is a stream and can only be consumed once.

### 樱花飘落效果

![petals](http://127.0.0.1:8080/markdown/petals.gif)

```html
<div id="petals_container">
  <div class="petal"></div>
  <!-- ... -->
  <div class="petal"></div>
</div>
```

```css
.petal {
  width: 1rem;
  height: 1rem;
  display: inline-block;
  position: absolute;
  top: -10rem;
  bottom: 0;
  z-index: 150;
}
.petal .rotate {
  animation: driftyRotate 1s infinite both ease-in-out;
  perspective: 1000;
}
.petal .askew {
  background: currentColor;
  transform: skewY(10deg);
  display: block;
  width: 2rem;
  height: 2rem;
  animation: drifty 1s infinite alternate both ease-in-out;
  perspective: 1000;
}
.petal {
  color: rgba(0, 0, 0, 0);
}
.petal:nth-of-type(7n) .askew {
  animation-delay: -.6s;
  animation-duration: 2.25s;
}
.petal:nth-of-type(7n + 1) .askew {
  animation-delay: -.879s;
  animation-duration: 3.5s;
}
.petal:nth-of-type(7n + 2) .askew {
  animation-delay: -.11s;
  animation-duration: 1.95s;
}
.petal:nth-of-type(7n + 3) .askew {
  animation-delay: -.246s;
  animation-duration: .85s;
}
.petal:nth-of-type(7n + 4) .askew {
  animation-delay: -.43s;
  animation-duration: 2.5s;
}
.petal:nth-of-type(7n + 5) .askew {
  animation-delay: -.56s;
  animation-duration: 1.75s;
}
.petal:nth-of-type(7n + 6) .askew {
  animation-delay: -.76s;
  animation-duration: 1.5s;
}
.petal:nth-of-type(9n) .rotate {
  animation-duration: 2s;
}
.petal:nth-of-type(9n + 1) .rotate {
  animation-duration: 2.3s;
}
.petal:nth-of-type(9n + 2) .rotate {
  animation-duration: 1.1s;
}
.petal:nth-of-type(9n + 3) .rotate {
  animation-duration: .75s;
}
.petal:nth-of-type(9n + 4) .rotate {
  animation-duration: 4.3s;
}
.petal:nth-of-type(9n + 5) .rotate {
  animation-duration: 3.05s;
}
.petal:nth-of-type(9n + 6) .rotate {
  animation-duration: 2.76s;
}
.petal:nth-of-type(9n + 7) .rotate {
  animation-duration: 7.6s;
}
.petal:nth-of-type(9n + 8) .rotate {
  animation-duration: 1.78s;
}
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

### CSS手机横屏判断

在 `CSS` 中判断移动设备是否处于横屏状态，需要用到 `aspect-ratio` 进行媒体查询，通过测试 `viewport` 的宽高比来进行判断。`aspect-ratio` 媒体查询的基本语法如下：

宽高比属性被指定为 `<ratio>` 值来代表viewport的宽高比。其为一个范围，可以使用 `min-aspect-ratio` 和 `max-aspect-ratio` 分别查询最小和最大值。

```css
/* 最小宽高比 */
@media (min-aspect-ratio: 8/5) {
  /* ... */
}
/* 最大宽高比 */
@media (max-aspect-ratio: 3/2) {
  /* ... */
}
/* 明确的宽高比, 放在最下部防止同时满足条件时的覆盖 */
@media (aspect-ratio: 1/1) {
  /* ... */
}
```

在本示例中的具体实现方式如下，添加一个

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
  z-index: 99999;
  background: #FFFFFF url('../images/landscape.png') no-repeat center;
  background-size: auto 100%;
}
@media screen and (min-aspect-ratio: 13/8) {
  .mod_orient_layer {
    display: block;
  }
}
```

实现效果

![landscape](http://127.0.0.1:8080/markdown/landscape.png)

### Photoshop 技能

#### logo设计

![logo](http://127.0.0.1:8080/markdown/logo.png)

## 参考资料

* <https://webkit.org/blog/8840/dark-mode-support-in-webkit>
* PWA技术理论+实战全解析 <https://www.cnblogs.com/yangyangxxb/p/9964959.html>
* H5 PWA技术 <https://zhuanlan.zhihu.com/p/144512343>
* aspect-ratio <https://developer.mozilla.org/zh-CN/docs/Web/CSS/@media/aspect-ratio>
