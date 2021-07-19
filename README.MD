## かなゲーム

![logo]('https://dragonir.github.io/kanaApp/assets/images/icon-64x64.png')

> 在线体验地址 <https://dragonir.github.io/kanaApp/>

## 从开发一款日语五十音小游戏过程中可以学到哪些前端知识

## 背景

在学习日语的初期阶段，我发现日语五十音的记忆并不是很容易的，平假名的记忆尤其令人费神。这时我想如果有一个应用可以充分利用碎片时间，在午休或地铁上随时可以练习该多好。于是搜遍整个App Store，商店的软件不是含有内购、夹带广告就是动辄40M以上，没找到一个自己满意的应用。于是打算自己造轮子写一个，因此有了该网页应用和文章的产生。在这篇文章中，主要介绍自己在开发这个应用过程中的收获。

## 实现

### 深色模式

### 离线缓存

prefers-color-scheme
prefers-color-scheme CSS 媒体特性用于检测用户是否有将系统的主题色设置为亮色或者暗色。

语法
no-preference
表示系统未得知用户在这方面的选项。在布尔值上下文中，其执行结果为 false。
light
表示用户已告知系统他们选择使用浅色主题的界面。
dark
表示用户已告知系统他们选择使用暗色主题的界面。
译者注：“未得知”、“已告知”等用语，英文原文如此。
“未得知”可理解为：浏览器的宿主系统不支持设置主题色，或者支持主题色并默认为/被设为了未设置/无偏好。
“已告知”为：浏览器的宿主系统支持设置主题色，且被设置为了亮色或者暗色。

目前，若结果为 no-preference，无法通过此媒体特性获知宿主系统是否支持设置主题色，或者用户是否主动将其设置为无偏好。出于隐私保护等方面的考虑，用户或用户代理也可能在一些情况下在浏览器内部将其设置为 no-preference。

样例
这个例子使用了一个有黑色背景和白色文字的元素，当用户使用浅色主题时，会翻转黑白颜色。

HTML
<div class="day">Day (initial)</div>
<div class="day light-scheme">Day (changes in light scheme)</div>
<div class="day dark-scheme">Day (changes in dark scheme)</div> <br>

<div class="night">Night (initial)</div>
<div class="night light-scheme">Night (changes in light scheme)</div>
<div class="night dark-scheme">Night (changes in dark scheme)</div>
Copy to Clipboard
CSS
.day   { background: #eee; color: black; }
.night { background: #333; color: white; }

@media (prefers-color-scheme: dark) {
  .day.dark-scheme   { background:  #333; color: white; }
  .night.dark-scheme { background: black; color:  #ddd; }
}

@media (prefers-color-scheme: light) {
  .day.light-scheme   { background: white; color:  #555; }
  .night.light-scheme { background:  #eee; color: black; }
}

.day, .night {
  display: inline-block;
  padding: 1em;
  width: 7em;
  height: 2em;
  vertical-align: middle;
}
Copy to Clipboard


1.2.6 Darkmode.js
GitHub 开源项目 Darkmode.js，通过 CSS 属性 mix-blend-mode 暴力实现深色模式，现在它有 2.2k Star。mix-blend-mode 描述当前元素的内容应该与当前元素的直系父元素的内容和元素的背景如何混合，值为 difference 时即“反相”。

JS判断深色模式
使用matchMedia判断是否符合媒介。
返回一个MediaQueryList对象，该对象具有属性matches和media，方法addListener和removeListener。
判断是否支持主题色：
if (window.matchMedia('(prefers-color-scheme)').media === 'not all') {
  console.log('Browser doesn\'t support dark mode');
}

判断是否处于深色模式：
if(window.matchMedia('(prefers-color-scheme: dark)').matches){
  //...
}

addListener接收一个MediaQueryList对象作为参数。
为深色模式添加监听器，以响应系统切换到或切换出深色模式：
let listeners={
  dark:(mediaQueryList )=>{
    if(mediaQueryList.matches){
      alert('您切换到深色模式了！')
    }
  },
  light:(mediaQueryList)=>{
    if(mediaQueryList.matches){
      alert('您切换到浅色模式了！')
    }
  }
}

window.matchMedia('(prefers-color-scheme: dark)').addListener(listeners.dark)
window.matchMedia('(prefers-color-scheme: light)').addListener(listeners.light)


web端适配深色模式的一些的认识
预计阅读时间：2分钟
介绍
深色模式是WWDC(Worldwide Developers Conference 2018提到，2019正式引进的的一个系统级的feature)，让整个生态系统对于用户更加友好优雅。

实践
要适配深色模式，代码层面主要做2件事情

去判断当前用户偏好设置的深色模式
针对深色模式，调整css
针对第一件事：判断偏好
media query 支持 prefers-color-scheme这个查询，所以可以在任何支持查询的地方使用

在css中
@media (prefers-color-scheme: dark) {
    :root {
      XXX: YYY
    }
}
js中
var darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
darkQuery.addListener(function(e) {
  window.__setPreferredTheme(e.matches ? 'dark' : 'light')
});
html element中
<picture>
  <source srcset="mojave-night.jpg" media="(prefers-color-scheme: dark)">
  <img src="mojave-day.jpg">
</picture>
针对第二件事：改变css
可以编译两套css，然后代码中根据matchMedia判断状态，然后加载/移除dark的css，一些库中用的比较多，比如rsuite
直接使用css变量


  :root {
      color-scheme: light dark;
      --special-text-color: hsla(60, 100%, 50%, 0.5);
      --border-color: black;
  }
  @media (prefers-color-scheme: dark) {
      :root {
          --special-text-color: hsla(60, 50%, 70%, 0.75);
          --border-color: white;
      }
  }
  .special {
      color: var(--special-text-color);
      border: 1px solid var(--border-color);
  }
结合css预处理器和css变量，参考 https://css-tricks.com/difference-between-types-of-css-variables/#article-header-id-4
等等等等

https://webkit.org/blog/8840/dark-mode-support-in-webkit/



### 离线缓存
https://www.cnblogs.com/yangyangxxb/p/9964959.html
https://zhuanlan.zhihu.com/p/144512343

### 樱花飘落效果

```html
<div id="petals_container">
  <div class="petal"></div>
  <div class="petal"></div>
  <div class="petal"></div>
  <div class="petal"></div>
  <div class="petal"></div>
  <div class="petal"></div>
  <div class="petal"></div>
  <div class="petal"></div>
  <div class="petal"></div>
  <div class="petal"></div>
  <div class="petal"></div>
  <div class="petal"></div>
  <div class="petal"></div>
  <div class="petal"></div>
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
    petal.innerHTML = '<div class="rotate"><img src="data:image/png;base64,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" class="askew"></div>';
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


## TODO

* 樱花效果
* 样式优化
* ✔ PWA 保存到桌面
* ✔ 深色浅色模式替换
* 礼炮庆祝效果🎉