# かなゲーム

![kana](http://127.0.0.1:8080/markdown/kana.png)

> 在线体验地址 <https://dragonir.github.io/kanaApp/>

## 从开发一款日语五十音小游戏过程中可以学到哪些前端知识

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
    if (mediaQueryList.matches) { /* 开启深色模式 */ }
  },
  light: (mediaQueryList) => {
    if (mediaQueryList.matches) { /* 开启浅色模式 */ }
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
    petal.innerHTML = '<div class="rotate"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKAAAAClCAMAAADs3AasAAAAw1BMVEUAAADzgLTyhLb0msH0msHyerH0msHxb6vwbqr0msHwbqr0msH0msH0mcHwbqr0msH0msH0msH0msH0msH0msHwbqrwbqr0msHwbqr0msH0msHwbqrwbqr0msHwbqr0msHxbqvxb6vwbqr0msHxb6vwbqrwbqr0msHwbqr0msH0msH0msH0msH0msHwbqrxb6v0msHxcKzwbqr0msHxb6v0msHwbqryhrf0msHwbqrxc63zjrzxeLDzhrf0lb/ygLTxfbJmUQOCAAAAOHRSTlMADQX79hvpJs4U8fCpXzCVMNvTyk33rjj548NuVSi7notJNiHooeC32b2Dem9pw2GLgnpFllc8vgewmhIAAAVaSURBVHja7ZzZctowFECRbBmwsTGLzb7vECCQQK02lPz/V9VuZnqbJjixtcQz1XnI85m76UoBcgqFQqFQKBQKhUKhUCgUCoVCEhihXKaZ2Nt6D2Gcyyj41LaMyqq8rTfckEkRZUy1uDGCEM0yWq1KbVUqr7d1t5ghSVLWA0DT9TCe7fK2UcxlhF4J9ECzFTlmI47uW8GXlFfag20jAw0Ogm/jaNQGdw+9IkOHC0oxOFqt6mqwYe0a9iaJc9R0K5xCdk++I4wZ4Ha2V/enr+kadKrFy0HXLMr2Fzhit6QFHwNdU+9Jbu3iXSX4PHqrVrq3ezLjiBslPUiApkeBtCXGEdnVICm60V4/EFlxnKytIDGaUSvbLpLiiN1FMjnoa0lhxLYRpELTqwPblVCN+W8/g5TorcVG/E6BDpcgNZpVLdcFK+Lu9EfAgFUdCFZ0CteAhbAYyw2R7ZL3n34EbFi1zSQnDPJIrz8ZDTVjcRKWZ3Kg338ErGiVtZsTA+qYEEIGjNJJzHUQd5f0+yVgR6+uxaw6jk8p9AkL1uJBRCWSoUfp808ehlr1TkCacXdOIcnMlShgJjp9CklmRattIYj8JmEIdDIjrbXLOYio41FIMo80c+4VFA4aSDIH9NpdkfugCbkGvNBaZa5pJscox3DicRmJdY6GeLSkEc8BP/S2jXiuXPRVCDM3tNGRhnA6T2DB2RBuhiOPUhg13AzvXW45DosQRg2/Zi7xuq+gGX1lmLmJiPcehTLkm+YJn1kd5filDMGQ137DLcfQKDyxVjwKEXco5V2GUIg24nCYeH9CGC1e2WsVZ06FJTnQqxtmQ+JTAUmGiXhPmLfWJqXcOxkwyqzjZlwQE0Iw7DGGcPhXCK8iDAeMA/G8pLeSnI0rKXmkwJMIQ6v0gJku8OYrw4A/1oLpUHF2lL5ulIwZkiG9YZiRqwrqTinAefOCq4qN2HMMh7IAQkOGPpZgqFVsxHrcgWG2soxHU/qP4SVbWXb69I1hIAAt7QpLDpBjkcMm0Ffpnm7QaE4lGaY8l/MzKsnQGvRShXA/lWVorAlDm8gwrGxRqv9vm7IMtdoJp9m5CvQdnsUsDmnWQwfaRPjioJd6aY47aBPhA9tIcRnF4z5911BMo6R4ckBHk77Hk6DNJnkZnqFNZGw2yc88MvOovDLUVg2c+DRZUomG+sBNauj4TUpltnIPJ22TOQ2Rdua11pOkk8b35BreT5JWYYHeSHLMmSfzbY7cTPL3ayYMcX5oyjVsJXw9xI5PpWZZMxK+fOERlKGkO0B7M2HYakQaQhDdRPenYTPGUMh93lgnm4azGMOLmAU22TQ8xxiGzSxAcZVwXjtD87bh04W/Yjvpdk06cxqjyD2K7RSPrgVIc0yi5QuC4c6j8Yr8HLVFqvekvkljFZ+5FaM+yKUAnR+XXrxi1DBcDuRNLhVk789B8WYc2cNYq+fSgcloGDZLPOxhtAaTXGpQvlMwhSnCYxIDOH8ERQHTW2f/MBrO7/3ph4rP1zSSeoXPp6jQ+ABhjJFM6mgstlB/rGHs7EAxZvJcr5fLJ4e41uL6jRRMupDpOMmQKOEhoWrEu76abrS5f/QajY87cPzQ84WniMj4L0/dqK7KNuEqBw2zjE11fI1eLrpuVNrRN6wRbzfI9LA/b9JEeKZpzgt9f/Y4POxHeYJyQkFkdOx/MoxN05wu+7NhZz86j0OzGDXejof+fGqaXtPzvOYNs3khUuue86EZlv89akTG3c5h+Dib+X5/t9sVgF3fD8VGYyeKGc59IRgjREj+N8547Djh30iLoAz/2IlCoVAoFAqFQqFQKP4zfgGYz7dpMHj1eAAAAABJRU5ErkJggg==" class="askew"></div>';
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

### Photoshop 技能

#### logo设计

## 参考资料

* <https://webkit.org/blog/8840/dark-mode-support-in-webkit>

## TODO

* 樱花效果
* 样式优化
* ✔ PWA 保存到桌面
* ✔ 深色浅色模式替换
* 礼炮庆祝效果🎉