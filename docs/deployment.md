# 重构版部署

源码分支为 `codex/moon-reconstruction`，静态发布产物位于 `gh-pages`。

## 克隆和运行

```sh
git clone --branch codex/moon-reconstruction https://github.com/dailin3/web-extractor-replay-genshin.git
cd web-extractor-replay-genshin
npm ci
npm start
```

打开 http://127.0.0.1:4174。运行所需104份图片、字体、音频等二进制已保存到
`app/local-assets/`，原字节不变。正常运行不需要被忽略的 `projects/` 目录。
原站逐像素对照、重新提取和 `npm run pack:assets` 仍需要本机原始捕获资源。

## 静态站点和 GitHub Pages

```sh
npm run build          # dist/，部署在站点根目录
npm run build:pages    # dist/，部署在 /web-extractor-replay-genshin/
npm run deploy:pages   # 重新打包 Pages 产物，再上传 origin 的 gh-pages 分支
```

`gh-pages` 是发布用开发依赖，需要本机Git凭据具备仓库写权限。
仓库Pages来源配置为 `gh-pages` 分支的 `/` 目录。
地址为 https://dailin3.github.io/web-extractor-replay-genshin/。

静态导出约16 MiB，包含359个运行文件及 `.nojekyll`。
只对HTML、CSS、JS和JSON中的应用根资源路径添加项目路径；
相对模块导入、GLSL和二进制字节保持不变。
原业务包、回放服务器和离线验证脚本不进入产物。

## 内网运行

```sh
HOST=0.0.0.0 PORT=4174 npm start
```

在同网段访问 `http://本机内网地址:4174`。也可将根目录版本的 `dist/` 交给现有静态服务器。

## 验证部署

```sh
RECONSTRUCTION_URL=https://dailin3.github.io/web-extractor-replay-genshin/ \
RECON_SMOKE_OUTPUT=artifacts/deployment-online-smoke npm run verify:browser
```

真实Chrome依次操作开始、两次滚轮、四个目标、关闭故事、音量开关与简介，
检查资源、控制台、字体、首屏边界与约15.7秒的开场时长。
部署本身不改变[严格像素验收尚未全部通过的结论](phase-one.md)。

2026-10-12，本机以相同Pages子目录运行独立 `dist/`：真实操作检查通过，
开场至提示15.712秒，四个故事、简介暂停/恢复和音乐开关通过，资源/控制台错误为零。
另一个代理审查了253个静态资源引用、154个模块导入，均无缺失；
二进制与34份GLSL的字节保持不变。
双尺寸逐像素结果为28/30检查点零差，两个加载帧最大差一个色阶。

同日GitHub Pages发布提交为 `5dfa0788cae570015948a3a542eeb58d70ab9747`，
状态 `built`，HTTPS已启用。线上真实操作复验通过：开场至提示15.709秒，
四目标、故事关闭、首屏边界、音乐开关与简介暂停/恢复均通过；
页面/控制台错误、失败/缺失资源、外部依赖请求均为零。
测试在每次音乐切换后确认图标成功解码，仍严格检查所有失败请求。
主模块、样式、引擎入口、月亮纹理和中文字体的线上字节与静态产物一致。
记录在 `artifacts/deployment-online-smoke/`。
