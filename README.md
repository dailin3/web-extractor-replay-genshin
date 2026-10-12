# **web-extractor-replay-genshin**

一个玩具。
1. 可以通过HAR文件提取网页资源。
2. 可以通过MITM在本地复现一个可以动的网页。

## 「空月之歌」开场和月亮首屏重构

[在线预览](https://dailin3.github.io/web-extractor-replay-genshin/)。

`npm start` 启动可读重构版，打开 http://127.0.0.1:4174。

运行所需的104份原二进制素材已打包到 `app/local-assets/`，克隆重构分支后执行 `npm ci` 即可启动。
`npm run build` 输出独立静态站点到 `dist/`；GitHub项目路径使用 `npm run build:pages`。
部署方式见 [docs/deployment.md](docs/deployment.md)。

页面、加载流程、场景控制器、粒子文字插件、遮罩/景深/CSS3D 与交互已组织成独立模块。原图片、字体、音频、GLSL、Spine 和关键帧数据保留；运行页面不加载原 index/styles/Vue 业务包。恢复的底层渲染包拆成59个静态 ES 模块，其内部编译变量名仍保留，第三方库使用捕获的原版本；具体边界见 [app/engine/PROVENANCE.md](app/engine/PROVENANCE.md)。

当前范围为桌面横屏、中文：加载、开场、两段滚轮提示、月亮与三星、四段故事、音乐和简介。默认刷新重播，`?keepProgress` 保留进度。账户登录、外部分享服务、手机排版和后续章节未实现。

`replay/` 仅保留原业务包回放对照：`npm run start:reference`，端口4173。旧 `demo/` 和其他现有实验文件保留。

```bash
npm test                  # 控制器、数据、渲染适配器、HTTP测试
npm run verify:visual     # 原资源对照 vs 重构版，同时间逐像素比较
npm run verify:browser    # 正常速度，实际点击四目标并关闭故事
npm run verify:ui         # 简介键盘隔离、焦点与进入/退出动效
npm run verify:startup    # 字体/WebGL失败与重试恢复
npm run verify:introduction # 简介文字、排版与过渡逐像素对照
npm run verify:engine     # 粒子、文字纹理、CSS3D、景深和遮罩算法对照
npm run extract           # 离线重新生成场景/底层渲染模块
npm run verify:live       # 官方视觉源文件SHA256核对
```

视觉验证使用 Playwright、pngjs 和 Chrome，优先使用已安装或 Codex 自带依赖。可设置 `BROWSER_MODULES`、`CHROME_PATH`、`RECONSTRUCTION_URL`。截图和报告位于 `artifacts/reconstruction/` 与 `artifacts/reconstruction-smoke/`。原回放验证报告不能替代重构版验收。结构与验证说明见 [docs/phase-one.md](docs/phase-one.md)。

当前62项自动测试通过；子目录静态产物双尺寸主流程28/30个检查点零差，简介18/18零差。
早期加载淡出仍有一个色阶的少量差异，严格零容差验收尚未通过；原站自身的同源控制也观察到同量级波动。详见上述验收说明。

素材版权归米哈游，本项目用于本地研究。

以下网页已经过测试可行（）：
- ✅ [原神官网首页](https://ys.mihoyo.com)
- ✅ [「空月之歌」](https://ys.mihoyo.com/moon)
- ✅ [「空月之歌」挪德卡莱概念站](https://act.mihoyo.com/ys/event/e20250723light-uowufz/index.html)
- ✅ [始于挪德卡莱](https://act.mihoyo.com/ys/event/e20250829reserve-6htzhx/index.html)

## **环境**

请确保您已安装以下软件：

1. **Node.js**
2. **Python 3**
3. **项目依赖**:  
   * 在项目根目录打开终端并安装 Node.js 依赖：  
     npm install express http-mitm-proxy commander

   * 安装 Python 依赖：  
     pip install requests

## **1: har_extractor.py 静态资源提取**

注：这一部分是串行下载，因此很慢（）

### HAR获取
和这个工具：https://github.com/LCYBFF/genshinEventSourceDL 执行类似的功能。区别是不限文件类型。

这一部分可以参照：https://lcybff.github.io/p/%E5%8E%9F%E7%A5%9E%E7%BD%91%E9%A1%B5%E5%B0%8F%E6%B4%BB%E5%8A%A8%E5%9B%BE%E7%89%87%E8%B5%84%E6%BA%90%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD%E5%B7%A5%E5%85%B7/

1. 在 浏览器 中，按 F12 打开开发者工具，转到 **网络 (Network)** 选项卡。  
2. **Ctrl+F5**刷新页面，防止浏览器缓存
3. 接着把能点击的都点了（比如游玩剧情，分享等操作，尽可能将所有的资源都显示过一次），等到你觉得资源都加载完后，点击图中图标下载har文件。 

### 运行
在项目根目录运行：
```bash
python har_extractor.py path/to/your/har/file.har
```
默认在``projects``下创建一个与har文件名相同的文件夹，存放所有资源与一张资源映射表。
#### 命令行选项
| 选项 | 参数 | 描述 | 默认值 |
| :---- | :---- | :---- | :---- |
| har\_file | 必需 | 要处理的 HAR 文件的路径。这是一个位置参数，必须提供。 | 无 |
| \--out | 可选 | 指定输出项目的主目录。如果未提供，脚本将根据 HAR 文件名在 projects/ 目录下自动创建一个新目录。 | projects/\<har文件名\> |
| \--timeout | 可选 | 下载单个文件时的网络请求超时时间（单位：秒）。 | 10 |


## **2：server.js 启动服务**

试图使用本地资源打开网页。本地检索不到就联网正常请求。

### **运行**
```bash
node server.js -d path/to/your/project/dir
```
示例：
```bash
node server.js -d projects/空月之歌
```
默认使用``autoLaunch``打开一个浏览器窗口。

#### **命令行选项**
| 选项 (Option)                   | 描述 (Description)                                                                      | 是否必需 (Required) | 默认值 (Default) |
|:------------------------------|:--------------------------------------------------------------------------------------|:----------------|:--------------|
| `-d, --project-dir <path>`    | 指定包含 HAR 资源和 `url_mapping.json` 文件的项目根目录。脚本会在此目录下寻找映射文件，并将此目录作为 Web 服务器的根目录来托管所有本地资源。 | **是** (Yes)     | 无 (None)      |
| `-c, --config <path>`         | 指定配置文件的路径。用于加载代理端口、浏览器路径等自定义设置。                                                       | 否 (No)          | `config.json` |
| `-k, --no-ignore-cert-errors` | 启动浏览器时，**不**忽略 SSL/TLS 证书错误。**警告**: 启用此选项可能导致浏览器因证书无受信任而无法连接MITM代理。                   | 否 (No)          | 默认忽略证书错误。     |
| `-i, --incognito`             | 使用无痕模式启动浏览器 | 否 (No)          | 默认不使用。        |

### **配置文件**

在项目根目录中创建一个``config.json``文件来控制服务器的行为。

**config.json 示例:**
```json
{
  "server": {
    "proxyPort": 3000,
    "webPort": 3001,
    "sslCaDir": "my-ca"
  },
  "proxyRules": {
    "spoofHeaders": {
      "enabled": true,
      "targetDomains": ["mihoyo.com", "hoyoverse.com"],
      "fakeOrigin": "auto"
    }
  },
  "browser": {
    "autoLaunch": true,
    "executablePath": "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    "ignoreCertErrors": true
  }
}
```
* server.proxyPort: MITM 代理服务器的端口。  
* server.webPort: 本地 Express Web 服务器的端口。（用于展示网页。） 
* server.sslCaDir: **（重要）** 存储 SSL 证书（ca.crt）的目录。**请手动生成根证书并添加信任。** 
* browser.executablePath: 浏览器可执行文件的路径。  
* browser.autoLaunch: 是否自动打开浏览器展示页面。可以通过手动输入http://127.0.0.1:${webPort}（默认：http://127.0.0.1:3001）打开。
* browser.ignoreCertErrors: 启动浏览器时，是否忽略证书错误。（注意!该选项设为false可能导致浏览器因为不信任证书而无法连接MITM代理。）
* proxyRules.spoofHeaders.targetDomains: 一个域名列表，用于对未映射的请求应用请求头伪装。  
* proxyRules.spoofHeaders.fakeOrigin: 用于伪装的 Origin。"auto" 使用 HAR 记录的第一个文件的源。

### **(仅限首次) 信任 SSL 证书**
总之，需要生成一个根证书，并在系统中安装，才能使用server.js的服务。

一个使用openssl的示例：
1. 进入存放证书的目录：
2. 生成CA私钥、创建自签名的 CA 根证书
    ```bash
    openssl genrsa -out ca.key 2048
    openssl req -x509 -new -nodes -key ca.key -sha256 -days 3650 -out ca.crt
    ```
3. 根据提示填写信息（不重要，可以猛按回车）。common name可以填一个便于识别的名字。
4. 在windows中安装证书：
    - 双击``ca.crt`，安装证书
    - 选择 “将所有的证书都放入下列存储” -> “**受信任的根证书颁发机构**”
    - 下一步，弹出警告就“是”。
    - 验证方法：``Win+R``输入``certlm.msc``。``受信任的根证书颁发机构`` -> ``证书``列表中能找到一个你刚刚起的common name的证书。

**另：MITM server出现问题可以尝试删掉自动生成的``.http-mitm-proxy``和``edge-temp-profile``文件夹（相当于手动删缓存）再试试（）**


## **3: run_all.bat 一键启动**

使用 ``run_all.bat`` 脚本，并将 HAR 文件路径作为参数传递，一条龙启动``har_extractor.py``和``server.js``

```bash
run_all.bat "path/to/your/har/file.har"
```
将全部使用默认行为与默认值。
