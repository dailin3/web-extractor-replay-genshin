/** Compare reconstructed adapters with isolated original factories, without executing a page bundle. */
const assert = require("node:assert/strict");
const path = require("node:path");
const { createRequire } = require("node:module");
const { createAppServer } = require("../../app-server.cjs");
const { loadChunkFactories } = require("../../tools/extract-engine.cjs");
let chromium;
try {
  ({ chromium } = require("playwright"));
} catch {
  const modules =
    process.env.BROWSER_MODULES ||
    path.join(
      process.env.HOME,
      ".cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules",
    );
  ({ chromium } = createRequire(path.join(modules, "package.json"))(
    "playwright",
  ));
}

async function verify() {
  const modules = loadChunkFactories(
    "projects/ys.mihoyo.com/assets/index_44ff6b130c7baea7b639.js",
  );
  const server = createAppServer();
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  let browser;
  try {
    browser = await chromium.launch({
      executablePath:
        process.env.CHROME_PATH ||
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
      headless: true,
      args: ["--no-sandbox"],
    });
    const page = await browser.newPage({
      viewport: { width: 1200, height: 660 },
    });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.route("**/engine-verification", (route) =>
      route.fulfill({
        contentType: "text/html",
        body: "<!doctype html><html><body></body></html>",
      }),
    );
    await page.goto(
      `http://127.0.0.1:${server.address().port}/engine-verification`,
    );
    const result = await page.evaluate(
      async ({ pluginSource, modifierSource }) => {
        const engine = await import("/engine/index.js");
        const { createModifiers } = await import("/render/modifiers.mjs");
        const { THREE } = engine;
        const frame = {
          width: 1200,
          height: 660,
          rem: 660 / 10.8,
          canvasWidth: (660 * 2500) / 1080,
        };
        document.documentElement.style.fontSize = `${frame.rem}px`;
        const delta = { value: 0.0167 };
        function Vue() {}
        Vue.prototype.$frame = {
          layoutState: frame,
          rem: frame.rem,
          canvasStateToLayout: { width: frame.canvasWidth },
        };
        Vue.prototype.$getI18nWord = (key) =>
          ({ hint: "新的月神将要重临…" })[key] || key;
        Vue.prototype.$getLang = () => "zh-cn";
        const dependencies = {
          23402: THREE,
          74061: Vue,
          93823: engine,
          74681: { IS_MOB: false },
          26968: {},
          37668: {},
          19034: { A: { delta } },
        };
        function evaluateFactory(source) {
          const exports = {};
          const require = (id) => {
            if (!(id in dependencies))
              throw new Error(`Unexpected original dependency ${id}`);
            return dependencies[id];
          };
          require.d = (object, definitions) =>
            Object.entries(definitions).forEach(([key, get]) =>
              Object.defineProperty(object, key, { get }),
            );
          require.n = (value) => () => value;
          (0, eval)(`(${source})`)({}, exports, require);
          return exports.A;
        }
        const originalPlugins = evaluateFactory(pluginSource);
        const originalModifiers = evaluateFactory(modifierSource);
        const plugins = engine.createPlugins({
          translate: Vue.prototype.$getI18nWord,
          getLanguage: () => "zh-cn",
        });
        const modifiers = createModifiers({ getFrame: () => frame });
        function seeded(callback) {
          const previous = Math.random;
          let seed = 42;
          Math.random = () =>
            (seed = (1664525 * seed + 1013904223) >>> 0) / 4294967296;
          try {
            return callback();
          } finally {
            Math.random = previous;
          }
        }
        function particle(factory) {
          const material = new THREE.ShaderMaterial({
            defines: { LOOP_COUNT: 3 },
            uniforms: {},
          });
          const node = seeded(() =>
            factory.call({}, { uuid: "particle" }, material, {
              count: 64,
              isEquality: false,
            }),
          );
          return {
            positions: [...node.geometry.attributes.posFract.array],
            ids: [...node.geometry.attributes.id.array],
            start: material.uniforms.startTime.value,
          };
        }
        function textNode(factory) {
          const material = new THREE.ShaderMaterial({
            uniforms: {
              diffuse: { value: new THREE.Texture(new Image()) },
              progress: { value: 0.95 },
              pointInfo: { value: new THREE.Vector3(2, 3, 4) },
              scale: { value: new THREE.Vector2(1, 1) },
            },
          });
          const host = {
            createGeometry: () => new THREE.PlaneBufferGeometry(100, 30, 4, 2),
            shaderSetting: {
              BASIC: new THREE.ShaderMaterial({
                uniforms: { opacity: { value: 1 }, diffuse: { value: null } },
              }),
            },
          };
          return factory.call(host, { geometry: {} }, material, {
            fontSize: 36,
            maxWidth: 1500,
            textAlign: "center",
          });
        }
        const nativeText = textNode(originalPlugins.Points);
        const reconstructedText = textNode(plugins.Points);
        const text =
          "但追逐着潮汐的人们并未停止欢歌与祈祷，<br/>因为新的月神将要重临…";
        nativeText.setText({ text });
        reconstructedText.setText({ text });
        await Promise.resolve();
        const textSnapshot = (node) => {
          const points = node.children[0];
          const canvas = points.material.uniforms.diffuse.value.image;
          return {
            width: canvas.width,
            height: canvas.height,
            rgba: [
              ...canvas
                .getContext("2d")
                .getImageData(0, 0, canvas.width, canvas.height).data,
            ],
            scale: points.scale.toArray(),
            pointInfo: node.material.uniforms.pointInfo.value.toArray(),
            pointScale: node.material.uniforms.scale.value.toArray(),
            backingOpacity: points.children[0].material.uniforms.opacity.value,
          };
        };
        function wiggle(factory) {
          const node = new THREE.Object3D();
          node.scene = { autoUpdate: true };
          node.userData = {
            initPos: new THREE.Vector3(10, 20, 30),
            initRot: new THREE.Euler(0.1, 0.2, 0.3),
            initScl: new THREE.Vector3(1, 2, 3),
          };
          node.material = { uniforms: { opacity: { value: 0.7 } } };
          factory.call(
            node,
            {},
            { uniformSetting: { delta } },
            {
              moveSpeed: [2, 3, 4],
              moveAmp: [5, 7, 9],
              moveDelay: [0.3, 0.7, 1.3],
              moveOctaves: 3,
              rotAmp: [0.02, 0.03, 0.04],
              rotOctaves: 2,
              scaleAmp: [0.01, 0.02, 0.03],
              scaleOctaves: 2,
              spinSpeed: [0.1, 0.2, 0.3],
              opacityAmp: 0.1,
              opacityCenter: 0.5,
            },
          );
          for (let tick = 0; tick < 123; tick++)
            node.dispatchEvent({ type: "tick" });
          return {
            position: node.position.toArray(),
            rotation: node.rotation.toArray(),
            scale: node.scale.toArray(),
            opacity: node.material.uniforms.opacity.value,
          };
        }
        function css3d(factory) {
          const parent = document.createElement("div");
          document.body.appendChild(parent);
          const canvas = document.createElement("canvas");
          canvas.width = 1200;
          canvas.height = 660;
          parent.appendChild(canvas);
          const scene = new THREE.Scene();
          scene.buffer = { texture: new THREE.Texture() };
          scene.camera = new THREE.PerspectiveCamera(
            31.417,
            2500 / 1080,
            10,
            20000,
          );
          scene.camera.position.z = 1920;
          scene.camera.updateMatrixWorld();
          const ui = new THREE.Scene();
          ui.sceneConfig = { uiWidth: 2500, uiHeight: 1080 };
          const layer = new THREE.Mesh(
            new THREE.PlaneGeometry(1, 1),
            new THREE.ShaderMaterial({
              uniforms: {
                opacity: { value: 0.8 },
                diffuse: { value: scene.buffer.texture },
              },
            }),
          );
          ui.add(layer);
          const node = new THREE.Mesh(
            new THREE.PlaneGeometry(100, 80),
            new THREE.ShaderMaterial({ uniforms: { opacity: { value: 0.9 } } }),
          );
          node.name = "point";
          node.scene = scene;
          node.position.set(50, 30, 90);
          node.scale.set(1.2, 0.8, 0.9);
          scene.add(node);
          const player = {
            renderer: { domElement: canvas },
            domElement: canvas,
            getScene: () => ui,
          };
          factory.call(node, {}, player, { id: "verification-hit" });
          scene.updateMatrixWorld();
          node.children[0].dispatchEvent({ type: "tick" });
          ui.dispatchEvent({ type: "tick" });
          scene.dispatchEvent({ type: "afterRender" });
          const renderer = player.CSS3DRenderer;
          const element = node.children[0].element;
          const snapshot = {
            size: renderer.getSize(),
            rendererStyle: renderer.domElement.getAttribute("style"),
            cameraStyle: renderer.domElement.children[1].getAttribute("style"),
            objectStyle: element.getAttribute("style"),
            pointerEvents: element.dataset.pointerEvents,
          };
          parent.remove();
          return snapshot;
        }
        function dof(factory) {
          const scene = new THREE.Scene();
          scene.camera = {};
          const material = new THREE.ShaderMaterial({
            uniforms: {
              blur: { value: 0 },
              angle: { value: 0 },
              map: { value: null },
              curve: { value: new THREE.Vector2() },
              offset: { value: new THREE.Vector2() },
              resolution: { value: new THREE.Vector2() },
              diffuse: { value: null },
            },
          });
          const mesh = new THREE.Mesh(
            new THREE.PlaneGeometry(10, 10),
            material,
          );
          scene.add(mesh);
          const calls = [];
          const targets = new Map();
          let currentTarget;
          const renderer = {
            setRenderTarget(buffer) {
              currentTarget = buffer;
              if (!targets.has(buffer)) targets.set(buffer, targets.size);
            },
            clear() {
              calls.push(["clear"]);
            },
            render() {
              calls.push([
                "render",
                targets.get(currentTarget),
                currentTarget.width,
                currentTarget.height,
                scene.autoUpdate,
                material.uniforms.blur.value,
                material.uniforms.resolution.value.toArray(),
                mesh.position.toArray(),
                mesh.scale.toArray(),
              ]);
            },
          };
          factory.call(scene, {}, { renderer }, {});
          const target = new THREE.Mesh(new THREE.PlaneGeometry(20, 30));
          target.position.set(4, 5, 6);
          target.scale.set(1.2, 0.8, 0.9);
          target.updateMatrixWorld();
          const inBuffer = { width: 1023, height: 657, texture: {} };
          const writeBuffer = { width: 1023, height: 657 };
          for (let frame = 0; frame < 2; frame++)
            scene.overrideRender(true, {
              blur: 12,
              angle: 0.7,
              curve: new THREE.Vector2(0.2, 0.8),
              offset: new THREE.Vector2(0.1, 0.2),
              target,
              inBuffer,
              writeBuffer,
              map: {},
            });
          return calls;
        }
        async function mask(factory) {
          const scene = new THREE.Scene();
          const parent = new THREE.Group();
          parent.position.set(4, 5, 6);
          scene.add(parent);
          const target = new THREE.Group();
          target.name = "masked";
          parent.add(target);
          const node = new THREE.Mesh(
            new THREE.PlaneGeometry(10, 10),
            new THREE.ShaderMaterial({ uniforms: {} }),
          );
          node.scene = scene;
          node.name = "mask";
          scene.add(node);
          scene.updateMatrixWorld();
          const buffer = {
            width: 2,
            height: 2,
            texture: {},
            setSize(width, height) {
              this.width = width;
              this.height = height;
            },
          };
          factory.call(
            node,
            {},
            { getBuffer: () => buffer },
            { target: target.uuid },
          );
          await new Promise((resolve) => setTimeout(resolve, 5));
          const previousTarget = { width: 1200, height: 660 };
          const calls = [];
          const renderer = {
            getRenderTarget: () => previousTarget,
            getClearColor: (color) => color.set(0x223344),
            setClearColor: (color, alpha) =>
              calls.push([
                "color",
                color.isColor ? color.getHex() : color,
                alpha,
              ]),
            setRenderTarget: (target) =>
              calls.push(["target", target === buffer ? "mask" : "previous"]),
            clear: () => calls.push(["clear"]),
            render: (renderScene) =>
              calls.push([
                "render",
                renderScene.position.toArray(),
                renderScene.children.map((child) => child.name),
              ]),
          };
          node.onBeforeRender(renderer, scene, {});
          const found = node.getObjectByProperty("name", "masked") === target;
          const attached = new THREE.Group();
          attached.name = "attached";
          node.attach(attached);
          return {
            calls,
            found,
            bufferSize: [buffer.width, buffer.height],
            attachedParent: attached.parent === target.parent,
          };
        }
        return {
          versions: {
            three: THREE.REVISION,
            gsap: engine.gsap.version,
            spine: typeof engine.spine.threejs.SkeletonMesh,
            runtime: typeof regeneratorRuntime.mark,
          },
          particles: {
            native: particle(originalPlugins.BEZIER_PARTICLE),
            reconstructed: particle(plugins.BEZIER_PARTICLE),
          },
          text: {
            native: textSnapshot(nativeText),
            reconstructed: textSnapshot(reconstructedText),
          },
          wiggle: {
            native: wiggle(originalModifiers.wiggle_roty_posxz),
            reconstructed: wiggle(modifiers.wiggle_roty_posxz),
          },
          css3d: {
            native: css3d(originalModifiers.CSS3DObject),
            reconstructed: css3d(modifiers.CSS3DObject),
          },
          dof: {
            native: dof(originalModifiers.effect_dofBlur),
            reconstructed: dof(modifiers.effect_dofBlur),
          },
          mask: {
            native: await mask(originalModifiers.maskContainer),
            reconstructed: await mask(modifiers.maskContainer),
          },
        };
      },
      {
        pluginSource: modules[36019].toString(),
        modifierSource: modules[65675].toString(),
      },
    );
    assert.deepEqual(errors, []);
    assert.deepEqual(result.versions, {
      three: "130",
      gsap: "3.12.7",
      spine: "function",
      runtime: "function",
    });
    for (const name of ["particles", "text", "wiggle", "css3d", "dof", "mask"])
      assert.deepEqual(
        result[name].reconstructed,
        result[name].native,
        `${name} adapter differs from the isolated original`,
      );
    console.log(
      "Engine import, particle buffers, text RGBA, wiggle/CSS3D, five-pass blur, and offscreen mask match the isolated original.",
    );
  } finally {
    await browser?.close();
    await new Promise((resolve) => server.close(resolve));
  }
}

verify().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
