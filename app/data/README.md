这些文件是开场和第一屏的声明式资源，浏览器不读取原业务 bundle。

`index.mjs` 的 `loadSceneData({ THREE, utils })` 读取具名 JSON 和 GLSL，返回：

| 字段 | 用途 |
| --- | --- |
| `layoutData` | 5 个场景、完整父子层级、摄像机、遮罩、几何体和材质实例参数 |
| `timelineSetting` | 首阶段 9 条动画轨道，保留原帧、缓动、Spine 片段和可见性变化 |
| `imageManifest` / `loadingManifest` | 174 张主资源图源 / 加载图源；内嵌 PNG 已拆成 `textures/` 文件 |
| `imageSetting` | 纹理 wrap 参数，直接传给 `THREEPlayer` |
| `spineSetting` | 首阶段 9 类 Spine 的 atlas 和 skeleton；亦保存于 `spines/` |
| `shaderSetting` | 由 `materials.json` 的类型标记、默认值和独立 GLSL 构建的 `ShaderMaterial` |
| `words` / `font` | 中文原文、标点、换行和原 `fontLink` WOFF2 字体地址 |
| `uiAssets` / `soundAssets` | 本地图片与音乐、音效地址 |

`scene_moon_0` 是开场三个月亮使用的子场景，`scene_moon` 是随后可交互的月亮与三颗星星，`scene_ui` 负责合成加载层和月亮层。`effect_dofBlur` 是景深处理场景。删除后续页面的合成层时，保留节点的坐标、层级、遮罩、着色器和轨道数值均不改动。

生成命令：`node tools/extract-scene.cjs`。生成器只捕获 webpack 的工厂定义，读取 JSON 字面量和图源、材质登记，禁止执行应用入口或账户逻辑。来源模块 ID 和源文件 SHA256 记录在 `extraction.json`。GLSL 文本和图片二进制逐字节保留；材质中的 Three 类型、渐变纹理在入口中重建。

生成器保留原资源加载图源数量；`map_text` 按原中文国际化覆盖逻辑换成已经捕获的中文图。`localeTextureKeys` 供加载流程识别同一覆盖规则。原字体、外部纹理、音频通过 `/local-assets/` 的捕获清单提供，内嵌纹理由 `/data/textures/` 提供。

验证命令：`node --test tests/scene-data.test.cjs`，比较原场景、轨道和 GLSL 内容，并验证文字、Spine 和图源数量。
