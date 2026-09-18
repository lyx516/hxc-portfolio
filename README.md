# 胡雪纯｜美术教师作品集

桌面「作品集」文件夹里的单文件网页版作品集，整体迁移到这个 Next.js 项目里。
设计、文案、图片与交互全部来自桌面作品集，没有保留原模板的任何内容。

## 命令

```bash
npm install        # 安装依赖（Node 18 以上）
npm run dev        # 本地预览 http://localhost:3000
npm run build      # 静态导出，产物在 out/
npm run sync       # 从 reference/ 里的原始单文件页面重新生成页面样式、正文与脚本
```

`npm run build` 使用 Next.js 的 `output: 'export'`（见 [next.config.mjs](next.config.mjs)），
生成的是纯静态站点，不需要 Node 运行时。

## 部署

### 方式一：任意静态空间 / 对象存储

1. `npm install && npm run build`
2. 把 `out/` 目录整个上传（网站根目录指向 `out/index.html`）

页面里的图片用的是相对路径 `assets/…`，放在子目录（比如 `https://example.com/portfolio/`）也能正常显示。
但如果整个站点要挂在子路径下，`_next/…` 这些引用是绝对路径，要用 `BASE_PATH=/子路径 npm run build` 构建（见[方式三](#方式三github-pages已配好自动部署)）。

### 方式二：Vercel / EdgeOne Pages / Netlify 等

- 安装命令：`npm install`
- 构建命令：`npm run build`
- 输出目录：`out`

（这些平台连仓库后按上面的配置即可，框架预设选 Next.js 也可以，`output: 'export'` 会自动走静态导出。）

注意：**EdgeOne Pages 的默认域名只是预览链接**，只对生成它的那个浏览器有效，换设备打开会返回 `401 UNAUTHORIZED`。要给别人（HR、评委）打开，得在控制台「域名管理 → 添加自定义域名」绑自己的域名；加速区域选「全球（不含中国大陆）」不需要实名/备案，但国内访问速度一般。

### 方式三：GitHub Pages（已配好自动部署）

仓库里放了 [.github/workflows/deploy-pages.yml](.github/workflows/deploy-pages.yml)，推到 `main` 就自动构建并发布：

1. 仓库 Settings → Pages → Source 选 **GitHub Actions**（只需做一次；workflow 里也带了自动开启，失败就手动选一下）。
2. 推代码后到 Actions 页面看 `Deploy to GitHub Pages` 跑完。
3. 站点地址：<https://lyx516.github.io/hxc-portfolio/>

项目页挂在 `/<仓库名>/` 子路径下，workflow 会自动把仓库名算成 `BASE_PATH` 交给构建（见 [next.config.mjs](next.config.mjs)）；改了仓库名也不用改配置。手动构建子路径版本：

```bash
BASE_PATH=/hxc-portfolio npm run build
```

（`out/` 里提交的是不带子路径的版本，用于方式一/二；GitHub Pages 用的是 CI 自己构建的子路径版本。）

### 方式四：本地直接看构建结果

```bash
npx serve out        # 或 python3 -m http.server -d out 3000
```

## 目录结构

| 路径 | 内容 |
|---|---|
| [src/app/page.tsx](src/app/page.tsx) | 首页：把作品集正文挂到页面上 |
| [src/app/layout.tsx](src/app/layout.tsx) | 站点外壳：`lang="zh-CN"`、标题与描述 |
| [src/app/icon.png](src/app/icon.png) | 站点小图标（由作品集里的剪纸《生命树》裁出） |
| [src/app/globals.css](src/app/globals.css) | 页面样式（自动生成） |
| [src/config/portfolio-body.ts](src/config/portfolio-body.ts) | 页面正文 HTML（自动生成） |
| [src/components/portfolio-script.tsx](src/components/portfolio-script.tsx) | 挂载交互脚本的客户端组件 |
| [public/portfolio.js](public/portfolio.js) | 放大查看 / 键盘切换 / 顶栏高亮脚本（自动生成） |
| [public/assets/](public/assets) | 116 张图片：59 件作品各一张缩略图（`_t`，长边 780px）与一张大图（长边 1700px） |
| [reference/胡雪纯｜美术教师作品集.html](reference/胡雪纯｜美术教师作品集.html) | 桌面作品集的原始单文件页面（改内容的源头） |
| [reference/说明.md](reference/说明.md) | 原始页面的文件说明、页面结构、待办与踩坑记录 |
| [scripts/extract-portfolio.mjs](scripts/extract-portfolio.mjs) | 拆分脚本：原始 HTML → 上面的三个自动生成文件 |
| [.github/workflows/deploy-pages.yml](.github/workflows/deploy-pages.yml) | 推到 main 后自动构建并发布到 GitHub Pages |

## 改内容 / 改样式

页面正文、样式、脚本都由 [reference/胡雪纯｜美术教师作品集.html](reference/胡雪纯｜美术教师作品集.html) 这一个文件生成，改的时候只改它，然后：

```bash
npm run sync       # 重新生成 globals.css、portfolio-body.ts、public/portfolio.js
npm run dev        # 本地看效果
```

图片放在 [public/assets/](public/assets)，命名规则见 [reference/说明.md](reference/说明.md)：
带 `_t` 的是列表用缩略图，不带的是点击放大用的大图。

`npm run sync` 会核对正文引用的每张图片是否都在 `public/assets/` 里，缺图会报错并返回非零退出码。

## 交接时需要补的内容

原始页面的待办（见 [reference/说明.md](reference/说明.md)）：

1. 动画门类 6 件作品预留了视频入口，`data-video=""` 还是空的，填上视频网址后，放大查看时才会出现「▶ 观看动画视频」。
2. 版画五件作品的题名、国画三件的作品名是按画心下沿的铅笔题名 / 看图命名，需要本人核对。
3. 首屏作品图目前是剪纸《生命树》（`assets/img36.jpg`），可以换。
