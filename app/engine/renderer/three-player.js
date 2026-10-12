/** Maintained scene/resource player. Numerical operations retain the captured order. See ../PROVENANCE.md. */
import { THREE } from "../vendor/libraries.js";
import * as motion from "./motion.js";
import * as gradient from "./gradient.js";
import * as spine from "./spine-runtime.js";
import * as msdf from "./msdf.js";
import * as decoder from "./decoder.js";
import * as mouse from "./mouse.js";
import * as mouseUniforms from "./mouse-uniforms.js";
import * as cameraUtils from "./camera.js";
import * as sceneData from "./scene-data.js";
import * as resourceLoader from "./resource-loader.js";
import * as renderPasses from "./render-passes.js";
import * as sourceLoader from "./source-loader.js";
export const __esModule = true;
const geometryTypes = {
    1: THREE.BufferGeometry,
    2: THREE.InstancedBufferGeometry,
  },
  attributeTypes = {
    1: THREE.BufferAttribute,
    2: THREE.InstancedBufferAttribute,
    3: THREE.InterleavedBufferAttribute,
  };
function parseVector(serialized) {
  return serialized
    .slice(1, serialized.length - 1)
    .split(",")
    .map((component) => parseFloat(component));
}
class THREEPlayer {
  constructor(options) {
    const {
      devSpeed = 1,
      renderer = null,
      layoutData = {
        geometries: {},
        sceneList: [],
      },
      animationSetting = {},
      shaderSetting = {},
      bufferSetting = {},
      spineSetting = {},
      pluginSetting = {},
      fontSetting = {},
      imageSetting = {},
      timelineSetting = {},
      modifierSetting = {},
      machineSetting = {},
      classSetting = {},
      uniformSetting = {
        fps: {
          value: 1,
        },
        delta: {
          value: 0.016,
        },
        time: {
          value: 0,
        },
        resolution: {
          value: new THREE.Vector2(1, 1),
        },
        mouse: {
          value: new THREE.Vector2(),
        },
        offset: {
          value: new THREE.Vector2(),
        },
        mouseDelta: {
          value: new THREE.Vector2(0, 0),
        },
      },
    } = options || {};
    this.renderer = renderer;
    this.devSpeed = devSpeed;
    const gl = renderer.getContext();
    Object.assign(this, {
      animationSetting,
      shaderSetting,
      spineSetting,
      bufferSetting,
      uniformSetting,
      modifierSetting,
      fontSetting,
      pluginSetting,
      timelineSetting,
      classSetting,
      imageSetting,
      machineSetting,
    });
    this.clock = new THREE.Clock();
    const player = this;
    this.reportData = {
      tickTime: 0,
      tickCount: 0,
      hasReported: false,
    };
    this.defaultAnimationSetting = {
      SKIN: function () {
        this.scene.autoUpdate &&
          this.userData.animationMixer.update(
            player.uniformSetting.delta.value,
          );
      },
      SPINE: function () {
        (this.scene && !this.scene.autoUpdate) ||
          this.update(
            player.uniformSetting.delta.value,
            player.uniformSetting.time.value,
          );
      },
      DRAW_MASK: function () {
        gl.clearStencil(0);
        gl.clear(gl.STENCIL_BUFFER_BIT);
        gl.stencilFunc(gl.ALWAYS, 1, 1);
        gl.stencilOp(gl.REPLACE, gl.REPLACE, gl.REPLACE);
        gl.colorMask(false, false, false, false);
        gl.enable(gl.STENCIL_TEST);
      },
      BEGIN_INVERT_MASK: function () {
        gl.stencilFunc(gl.NOTEQUAL, 1, 1);
        gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
        gl.colorMask(true, true, true, true);
      },
      BEGIN_MASK: function () {
        gl.stencilFunc(gl.EQUAL, 1, 1);
        gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
        gl.colorMask(true, true, true, true);
      },
      STOP_MASK: function () {
        gl.disable(gl.STENCIL_TEST);
      },
    };
    this.geometries = {};
    this.shaders = {};
    this.spines = {};
    this.textures = {};
    this.buffers = {};
    this.fonts = {};
    this.sourcePool = {};
    this.loader = new sourceLoader.SourceLoad({
      sourcePool: this.sourcePool,
    });
    this.timelines = {};
    this.skinning = {};
    this.skeletons = {};
    this.exportResources = {};
    this.mouseController = null;
    this.scenes = {};
    this.layoutData = layoutData;
    this.initLayout(layoutData);
  }
  static decode(encoded) {
    return decoder.default.Decoder.parse(encoded);
  }
  static updateTextTexture(texture, text) {
    var canvas = texture.image,
      context = canvas.getContext("2d");
    texture.opt.background
      ? ((context.fillStyle = texture.opt.background),
        context.fillRect(0, 0, canvas.width, canvas.height))
      : context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = texture.opt.color;
    context.textBaseline = texture.opt.baseline;
    context.textAlign = texture.opt.align;
    context.font = [
      texture.opt.style,
      texture.opt.variant,
      texture.opt.weight,
      texture.opt.size + "px",
      texture.opt.family,
    ].join(" ");
    var lineHeight = texture.opt.lineHeight;
    texture.opt.strokeStyle &&
      texture.opt.strokeWidth &&
      ((context.lineWidth = texture.opt.strokeWidth),
      (context.strokeStyle = texture.opt.strokeStyle));
    for (
      var lineIndex = 0,
        lines = text.split(/(?:\r\n|\r|\n)/),
        index = 0,
        lineCount = lines.length;
      index < lineCount;
      index++
    ) {
      var line = lines[index],
        lineWidth = context.measureText(line).width;
      if (lineWidth > texture.opt.lineWidth) {
        for (
          var tokens = line.split(
              /(\s|[\u4e00-\u9fa5,\uac00-\ud7af,\u0e00-\u0e7f]+)/,
            ),
            words = [],
            wordIndex = 0;
          wordIndex < tokens.length;
          wordIndex++
        ) {
          var word = tokens[wordIndex];
          "" !== word &&
            (/([\u4e00-\u9fa5]+)/.test(word)
              ? (words = words.concat(word.split("")))
              : words.push(word));
        }
        line = (tokens = words)[0];
        lineWidth = context.measureText(line).width;
        for (
          var tokenIndex = 1, tokenCount = tokens.length;
          tokenIndex < tokenCount;
          tokenIndex += 1
        ) {
          var tokenWidth = context.measureText(tokens[tokenIndex]).width;
          lineWidth + tokenWidth >= texture.opt.lineWidth
            ? (texture.opt.strokeStyle &&
                texture.opt.strokeWidth &&
                context.strokeText(
                  line,
                  texture.opt.x,
                  texture.opt.y + lineIndex * lineHeight,
                ),
              context.fillText(
                line,
                texture.opt.x,
                texture.opt.y + lineIndex * lineHeight,
              ),
              " " !== tokens[tokenIndex]
                ? ((line = tokens[tokenIndex]), (lineWidth = tokenWidth))
                : ((line = ""), (lineWidth = 0)),
              (lineIndex += 1))
            : ((line += tokens[tokenIndex]), (lineWidth += tokenWidth));
        }
      }
      texture.opt.strokeStyle &&
        texture.opt.strokeWidth &&
        context.strokeText(
          line,
          texture.opt.x,
          texture.opt.y + lineIndex * lineHeight,
        );
      context.fillText(
        line,
        texture.opt.x,
        texture.opt.y + lineIndex * lineHeight,
      );
      null == lineWidth && (lineWidth = context.measureText(line).width);
      lineIndex += 1;
    }
    texture.needsUpdate = true;
    return {
      count: lineIndex,
      opt: texture.opt,
      width: canvas.width,
      height: canvas.height,
    };
  }
  static buildMorph(object) {
    object &&
      object.material &&
      object.geometry &&
      object.geometry.attributes.morphTarget0 &&
      ((object.morphTargetInfluences = []),
      Object.keys(object.geometry.attributes).forEach(function (item) {
        0 === item.indexOf("morphTarget") &&
          object.morphTargetInfluences.push(0);
      }),
      Array.isArray(object.material)
        ? object.material.forEach(function (material) {
            material.uniforms.morphTargetInfluences = {
              value: object.morphTargetInfluences,
            };
            material.defines.USE_MORPH = object.morphTargetInfluences.length;
          })
        : ((object.material.uniforms.morphTargetInfluences = {
            value: object.morphTargetInfluences,
          }),
          (object.material.defines.USE_MORPH =
            object.morphTargetInfluences.length)));
  }
  static getTextTexture(parameters) {
    var canvas = document.createElement("canvas"),
      texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    THREEPlayer.setParameter(texture, parameters, "wrapT");
    THREEPlayer.setParameter(texture, parameters, "wrapS");
    THREEPlayer.setParameter(texture, parameters, "minFilter");
    texture.minFilter = THREE.LinearFilter;
    var width = THREEPlayer.getParameter(parameters, "width") || 300,
      height = THREEPlayer.getParameter(parameters, "height") || 300;
    texture.minFilter !== THREE.LinearFilter ||
    texture.wrapS !== THREE.ClampToEdgeWrapping ||
    texture.wrapT !== THREE.ClampToEdgeWrapping
      ? ((canvas.width = Math.pow(2, Math.ceil(Math.log(width) / Math.LN2))),
        (canvas.height = Math.pow(2, Math.ceil(Math.log(height) / Math.LN2))))
      : ((canvas.width = width), (canvas.height = height));
    texture.opt = {
      family: getComputedStyle
        ? getComputedStyle(document.body).fontFamily
        : "Microsoft YaHei,微软雅黑",
      color: "#fff",
      align: "center",
      style: "normal",
      variant: "normal",
      weight: "bolder",
      size: "26",
      baseline: "top",
      x: 0,
      y: 0,
      scaleX: canvas.width / width,
      scaleY: canvas.height / height,
      lineWidth: canvas.width,
      lineHeight: "26",
      background: null,
      strokeStyle: null,
      strokeWidth: null,
    };
    THREEPlayer.setParameter(texture.opt, parameters, "background");
    THREEPlayer.setParameter(texture.opt, parameters, "color");
    THREEPlayer.setParameter(texture.opt, parameters, "align");
    THREEPlayer.setParameter(texture.opt, parameters, "family");
    THREEPlayer.setParameter(texture.opt, parameters, "style");
    THREEPlayer.setParameter(texture.opt, parameters, "variant");
    THREEPlayer.setParameter(texture.opt, parameters, "weight");
    THREEPlayer.setParameter(texture.opt, parameters, "size");
    THREEPlayer.setParameter(texture.opt, parameters, "x");
    THREEPlayer.setParameter(texture.opt, parameters, "y");
    THREEPlayer.setParameter(texture.opt, parameters, "baseline");
    THREEPlayer.setParameter(texture.opt, parameters, "lineWidth");
    THREEPlayer.setParameter(texture.opt, parameters, "lineHeight");
    THREEPlayer.setParameter(texture.opt, parameters, "strokeStyle");
    THREEPlayer.setParameter(texture.opt, parameters, "strokeWidth");
    canvas.getContext("2d").scale(texture.opt.scaleX, texture.opt.scaleY);
    var text = THREEPlayer.getParameter(parameters, "text");
    text &&
      (THREEPlayer.updateTextTexture(texture, text),
      (texture.needsUpdate = true));
    return texture;
  }
  static updateProp(target, properties) {
    Object.keys(properties).forEach(function (item) {
      target[item] = properties[item];
    });
  }
  static getEventDispatcher() {
    return mouseUniforms.default;
  }
  static getLoader() {
    return resourceLoader.loader;
  }
  static createLoader() {
    return (0, resourceLoader.createLoader)();
  }
  static getSourceLoader() {
    return sourceLoader.sourceLoader;
  }
  static createSourceLoader() {
    return (0, sourceLoader.createSourceLoader)();
  }
  static getParameter(parameters, key) {
    var value = parameters.match(new RegExp("(^|&)" + key + "=([^&]*)(&|$)"));
    return value ? value[2] : null;
  }
  static getParameters(parameters) {
    const result = {};
    for (const entry of parameters.split("&")) {
      const [key, value] = entry.split("=");
      result[key] = parseInt(value, 10);
    }
    return result;
  }
  static setParameter(target, parameters, key) {
    var value = THREEPlayer.getParameter(parameters, key);
    if (value) {
      var previousValue = target[key];
      target[key] = isNaN(value) ? value : parseInt(value);
      return previousValue !== target[key];
    }
    return false;
  }
  static getObjScreenElePos(object, camera, viewport) {
    var width = viewport.width,
      height = viewport.height;
    camera.updateMatrixWorld();
    var position = new THREE.Vector3(0, 0, 0);
    object.getWorldPosition(position);
    position.project(camera);
    return {
      position: "absolute",
      transform:
        "translate(calc(-50% + " +
        ((position.x * width) / 100 / 2).toFixed(2) +
        "rem), calc(-50% + " +
        ((-position.y * height) / 100 / 2).toFixed(2) +
        "rem))",
      left: "50%",
      top: "50%",
    };
  }
  static getObjWorldPos(xOffset, yOffset, camera, viewport) {
    var cameraHalfWidth = camera.right / camera.zoom / 100,
      cameraHalfHeight = camera.top / camera.zoom / 100,
      width = viewport.width,
      height = viewport.height,
      viewportHalfWidth = width / 2 / 100,
      viewportHalfHeight = height / 2 / 100,
      marginX = viewportHalfWidth - cameraHalfWidth,
      marginY = viewportHalfHeight - cameraHalfHeight,
      normalizedX =
        xOffset > 0
          ? (viewportHalfWidth - (marginX + xOffset)) / viewportHalfWidth
          : -(viewportHalfWidth - (marginX - xOffset)) / viewportHalfWidth,
      normalizedY =
        yOffset > 0
          ? (viewportHalfHeight - (marginY + yOffset)) / viewportHalfHeight
          : -(viewportHalfHeight - (marginY - yOffset)) / viewportHalfHeight;
    return new THREE.Vector3(
      (normalizedX * width) / 2,
      (normalizedY * height) / 2,
      0,
    );
  }
  createLoader() {
    return new sourceLoader.SourceLoad({
      sourcePool: this.sourcePool,
    });
  }
  getSourcePoolResult(id) {
    return this.sourcePool[id] ? this.sourcePool[id].result : null;
  }
  checkGPUAcceleratorEnabled() {
    var gl = this.renderer.getContext(),
      debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
    if (debugInfo) {
      var rendererName = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
      return !/SwiftShader/gi.test(rendererName);
    }
    return false;
  }
  reportRenderInfo(interval, onReport) {
    var report = this.reportData,
      elapsed = report.tickTime,
      frames = report.tickCount,
      hasReported = report.hasReported;
    if (elapsed >= interval && !hasReported) {
      this.reportData.hasReported = true;
      var result = {
          averageFps: parseInt(frames / elapsed, 10),
          gpu: null,
          maxTextureSize: null,
          resolution:
            parseInt(this.uniformSetting.resolution.value.x, 10) +
            "-" +
            parseInt(this.uniformSetting.resolution.value.y, 10),
          ua: window.navigator.userAgent,
        },
        gl = this.renderer.getContext(),
        debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
      debugInfo &&
        ((result.gpu =
          gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || null),
        (result.maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE) || null));
      return void onReport(result);
    }
    this.reportData.tickTime += this.uniformSetting.delta.value;
    this.reportData.tickCount += 1;
  }
  initLayout(layout) {
    var player = this,
      configuredBuffers = layout.bufferMap,
      bufferMap = void 0 === configuredBuffers ? {} : configuredBuffers;
    this.initGeometry(layout);
    layout.sceneList.forEach(function (nodeConfig) {
      var idOption = (nodeConfig.classConfig || {}).id,
        entry = new (player.classSetting[idOption] || THREE.Scene)(),
        value = (0, cameraUtils.getCamera)(
          nodeConfig.camera[0],
          nodeConfig.sceneConfig,
        );
      void 0 === nodeConfig.buffer
        ? "scene_ui" !== nodeConfig.id
          ? (entry.buffer = player.getBuffer(
              nodeConfig.id,
              bufferMap[nodeConfig.id],
            ))
          : (entry.buffer = null)
        : (entry.buffer = player.getBuffer(
            nodeConfig.buffer,
            bufferMap[nodeConfig.buffer],
          ));
      entry.name = nodeConfig.id;
      entry.camera = value;
      entry.sceneInited = false;
      entry.sceneConfig = nodeConfig.sceneConfig;
      player.scenes[nodeConfig.id] = entry;
    });
  }
  renderScene(name) {
    var clear =
        !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1],
      renderOptions = arguments[2],
      scene = this.getScene(name);
    scene.overrideRender
      ? scene.overrideRender(clear, renderOptions)
      : (this.renderer.setRenderTarget(scene.buffer),
        clear && this.renderer.clear(),
        this.renderer.render(scene, scene.camera));
  }
  /** Height-led cropping and the native 1.3 render scale cap are part of the visual contract. Keep the arithmetic order to avoid rounding drift. */
  resizeUI(viewportWidth, viewportHeight, options) {
    var player = this,
      scaleOption = options.scale,
      scale = void 0 === scaleOption ? 1 : scaleOption,
      fixedSizeOption = options.isFixedSize,
      fixedSize = void 0 !== fixedSizeOption && fixedSizeOption,
      fixedAspectOption = options.isFixedAspect,
      fixedAspect = void 0 !== fixedAspectOption && fixedAspectOption,
      widthOption = options.width,
      designWidth = void 0 === widthOption ? 2500 : widthOption,
      heightOption = options.height,
      designHeight = void 0 === heightOption ? 1080 : heightOption,
      allOption = options.all,
      all = void 0 !== allOption && allOption,
      croppedWidth = designWidth,
      croppedHeight = designHeight,
      renderScale = Math.min(1.3, scale),
      aspectRatio =
        viewportWidth / viewportHeight / (croppedWidth / croppedHeight);
    aspectRatio < 1
      ? (croppedWidth *= aspectRatio)
      : (croppedHeight /= aspectRatio);
    var renderWidth =
        croppedWidth *
        (renderScale *= Math.min(
          1,
          Math.max(
            viewportWidth / croppedWidth,
            viewportHeight / croppedHeight,
          ),
        )),
      renderHeight = croppedHeight * renderScale,
      bufferScale = Math.max(
        renderWidth / options.width,
        renderHeight / options.height,
      ),
      bufferWidth = options.width * bufferScale,
      bufferHeight = options.height * bufferScale;
    this.renderer.setSize(renderWidth, renderHeight);
    (0, cameraUtils.cameraAdaptScreen)(
      this.getScene("scene_ui").camera,
      Object.assign({}, options, {
        width: croppedWidth,
        height: croppedHeight,
      }),
      renderWidth,
      renderHeight,
    );
    fixedSize ||
      (all
        ? Object.keys(this.buffers).forEach(function (item) {
            var value = player.buffers[item];
            value &&
              value.resizable &&
              (fixedAspect
                ? value.setSize(bufferWidth, bufferHeight)
                : value.setSize(renderWidth, renderHeight));
          })
        : Object.keys(this.scenes).forEach(function (item) {
            var bufferOption = player.scenes[item].buffer;
            bufferOption &&
              bufferOption.resizable &&
              (fixedAspect
                ? bufferOption.setSize(bufferWidth, bufferHeight)
                : bufferOption.setSize(renderWidth, renderHeight));
          }),
      this.uniformSetting.bufferSize &&
        (fixedAspect
          ? this.uniformSetting.bufferSize.value.set(bufferWidth, bufferHeight)
          : this.uniformSetting.bufferSize.value.set(
              renderWidth,
              renderHeight,
            )),
      this.uniformSetting.resolution.value.set(renderWidth, renderHeight));
    return {
      width: renderWidth,
      height: renderHeight,
    };
  }
  getScene(name) {
    var scene = this.scenes[name];
    scene.children.length ||
      this.initScene((0, sceneData.getSceneData)(this.layoutData, name), scene);
    return scene;
  }
  getBufferAnimationFunc(buffer) {
    return {
      onBufferClick: function (item) {
        bufferAnimationSceneHitTest.call(this, "onClick", item, buffer.dom);
      },
      onBufferDown: function (item) {
        bufferAnimationSceneHitTest.call(this, "onMouseDown", item, buffer.dom);
      },
      onBufferUp: function (item) {
        bufferAnimationSceneHitTest.call(this, "onMouseUp", item, buffer.dom);
      },
      onBufferMove: function (item) {
        bufferAnimationSceneHitTest.call(this, "onMouseMove", item, buffer.dom);
      },
    };
  }
  drawCopy(input, output, options) {
    var resizeOption = (options || {}).resize,
      resize = void 0 !== resizeOption && resizeOption;
    input !== output &&
      renderPasses.default.copyPass.render(
        this.renderer,
        input,
        output,
        resize,
      );
  }
  drawBlur(input, output, options) {
    var settings = options || {},
      resizeOption = settings.resize,
      resize = void 0 !== resizeOption && resizeOption,
      xOption = settings.x,
      blurX = void 0 === xOption ? 1 : xOption,
      yOption = settings.y,
      blurY = void 0 === yOption ? 1 : yOption,
      target = settings.target,
      camera = settings.camera;
    blurX > 1e-5 || blurY > 1e-5
      ? renderPasses.default.blurPass.render(
          this.renderer,
          input,
          output,
          resize,
          blurX,
          blurY,
          target,
          camera,
        )
      : input !== output &&
        renderPasses.default.copyPass.render(
          this.renderer,
          input,
          output,
          resize,
        );
  }
  getFont(name) {
    this.fonts[name] ||
      (this.fontSetting[name].json || console.error("no font atlas:" + name),
      (this.fonts[name] = new msdf.default.MSDFAtlas(
        name,
        this.fontSetting[name].json,
        this.getTexture(name),
      )));
    return this.fonts[name];
  }
  createText(config, material) {
    return new msdf.default.MSDFTextMesh(config.text, material, {
      atlas: this.getFont(config.font),
      dynamic: !config.static,
      needsCenterAttribute: config.nca,
      fontSize: config.fontSize,
      align: config.align,
      lineWidth: config.lineWidth,
      lineHeight: config.lineHeight,
      letterSpacing: config.letterSpacing,
      letterItalic: config.letterItalic,
      color: config.color,
      shadow:
        void 0 !== config.shadowColor ||
        void 0 !== config.shadowOpacity ||
        void 0 !== config.shadowOffset
          ? {
              color: config.shadowColor
                ? new THREE.Color(config.shadowColor)
                : null,
              opacity: config.shadowOpacity,
              offset: config.shadowOffset
                ? new THREE.Vector2().fromArray(config.shadowOffset)
                : null,
            }
          : null,
    });
  }
  /** Cache by object UUID and timeline name: two scene objects must not share mutable track weights. */
  getTimeline(root, name, options) {
    var excludesOption = (options || {}).excludes,
      excludes = void 0 === excludesOption ? null : excludesOption,
      cacheKey = root.uuid + "_" + name;
    if (!this.timelines[cacheKey]) {
      if (!this.timelineSetting[name])
        throw new Error("timeline " + name + " is not found");
      this.timelines[cacheKey] = motion.default.createTimeline(
        Object.assign({}, this.timelineSetting[name], {
          methods: this.animationSetting,
          root: root,
        }),
      );
    }
    excludes &&
      this.timelines[cacheKey].traverse(function (entry) {
        excludes.includes(entry.name) ? (entry.weight = 0) : (entry.weight = 1);
      });
    return this.timelines[cacheKey];
  }
  findTimeline(name) {
    var suffix = "_" + name,
      key = Object.keys(this.timelines).find(function (item) {
        return -1 !== item.indexOf(suffix);
      });
    return key ? this.timelines[key] : null;
  }
  stopTimeline(root, name) {
    if (name) {
      var timeline = this.getTimeline(root, name);
      timeline && timeline.stop();
    } else root._playedTimeline && root._playedTimeline.stop();
  }
  /** Track data uses native frame units; GSAP mixing duration is derived from fps and speed. */
  playTimeline(root, names) {
    var player = this,
      options =
        arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
    1 !== this.devSpeed && (options.speed = this.devSpeed);
    var mixOption = options.mix,
      mix = void 0 === mixOption ? 0 : mixOption,
      fpsOption = options.fps,
      fps = void 0 === fpsOption ? 30 : fpsOption,
      speedOption = options.speed,
      speed = void 0 === speedOption ? 1 : speedOption,
      loopOption = options.loop,
      loop = void 0 !== loopOption && loopOption,
      overwriteOption = options.overwrite,
      overwrite = void 0 === overwriteOption || overwriteOption,
      startOption = options.start,
      start = void 0 === startOption ? 0 : startOption,
      mixDuration = (1e3 * mix) / speed / fps;
    if (
      (overwrite && root._playedTimeline && root._playedTimeline.stop(),
      Array.isArray(names))
    ) {
      var sequence = motion.default.createTimeline({
        type: 1,
      });
      root._playedTimeline = sequence;
      var offset = 0;
      names.forEach(function (item, index) {
        var value = player.getTimeline(root, item, options);
        if (
          ((value.start += offset),
          (value.loop = index === names.length - 1 && loop),
          (offset += value.duration - mixDuration),
          sequence.add(value),
          index > 0 && 0 !== mix)
        ) {
          var updated = motion.default.createTimeline({
            start: value.start,
            type: 3,
            data: [
              {
                start: 0,
                end: mixDuration,
                frames: [0, 1],
              },
            ],
            name: ".weight",
            root: value,
          });
          sequence.add(updated);
        }
      });
      return sequence.play(options);
    }
    var timeline = this.getTimeline(root, names, options);
    if (((timeline.loop = loop), 0 === mix)) {
      root._playedTimeline = timeline;
      return timeline.play(options);
    }
    var group = motion.default.createTimeline({
        type: 1,
      }),
      weightTrack = motion.default.createTimeline({
        start: start,
        type: 3,
        data: [
          {
            start: 0,
            end: mixDuration,
            frames: [0, 1],
          },
        ],
        name: ".weight",
        root: timeline,
      });
    group.add(weightTrack);
    group.add(timeline);
    root._playedTimeline = group;
    return group.play(options);
  }
  initBuffer(name, buffer) {
    this.buffers[name] = buffer;
  }
  getBuffer(name, options) {
    if ("" === name) return null;
    if (!this.buffers[name]) {
      var settings = options || {},
        resizableOption = settings.resizable,
        resizable = void 0 === resizableOption || resizableOption,
        widthOption = settings.width,
        width = void 0 === widthOption ? 512 : widthOption,
        heightOption = settings.height,
        height = void 0 === heightOption ? 512 : heightOption,
        wrapSOption = settings.wrapS,
        wrapS =
          void 0 === wrapSOption ? THREE.ClampToEdgeWrapping : wrapSOption,
        wrapTOption = settings.wrapT,
        wrapT =
          void 0 === wrapTOption ? THREE.ClampToEdgeWrapping : wrapTOption,
        formatOption = settings.format,
        format = void 0 === formatOption ? THREE.RGBAFormat : formatOption,
        premultiplyAlphaOption = settings.premultiplyAlpha,
        premultiplyAlpha =
          void 0 === premultiplyAlphaOption || premultiplyAlphaOption,
        stencilBufferOption = settings.stencilBuffer,
        stencilBuffer = void 0 !== stencilBufferOption && stencilBufferOption,
        depthBufferOption = settings.depthBuffer,
        depthBuffer = void 0 === depthBufferOption || depthBufferOption,
        generateMipmapsOption = settings.generateMipmaps,
        generateMipmaps =
          void 0 !== generateMipmapsOption && generateMipmapsOption,
        size = this.uniformSetting.bufferSize || this.uniformSetting.resolution,
        buffer = new THREE.WebGLRenderTarget(
          resizable ? size.value.x : width,
          resizable ? size.value.y : height,
          {
            wrapS: wrapS,
            wrapT: wrapT,
            format: format,
            stencilBuffer: stencilBuffer,
            depthBuffer: depthBuffer,
            premultiplyAlpha: premultiplyAlpha,
            generateMipmaps: generateMipmaps,
          },
        );
      buffer.resizable = resizable;
      this.initBuffer(name, buffer);
    }
    return this.buffers[name];
  }
  getImage(name) {
    return (
      (this.imageSetting[name] ? this.imageSetting[name].image : null) ||
      resourceLoader.loader.getResult(name) ||
      sourceLoader.sourceLoader.getResult(name) ||
      this.getSourcePoolResult(name)
    );
  }
  removeTexture(source) {
    const [name] = source.split("?");
    if (this.textures[name]) {
      this.textures[name].dispose();
      delete this.textures[name];
    }
  }
  initTexture(name) {
    var texture = this.getTexture(name);
    texture && this.renderer.setTexture(texture);
  }
  getTextureConfig(name) {
    if (this.imageSetting[name] && this.imageSetting[name].config) {
      var config = this.imageSetting[name].config;
      return Object.assign(
        {
          wrapS: config.wrapS || THREE.ClampToEdgeWrapping,
          wrapT: config.wrapT || THREE.ClampToEdgeWrapping,
          minFilter: config.minFilter || THREE.LinearFilter,
          magFilter: config.magFilter || THREE.LinearFilter,
        },
        THREEPlayer.getParameters(config.other || ""),
      );
    }
    return {};
  }
  getTexture(source) {
    const [name, parameters] = source.split("?");
    let changed = false;
    if (!this.textures[name]) {
      const image = this.getImage(name);
      if (!image) {
        if (source !== "") console.warn("no texture:" + name);
        return null;
      }
      this.textures[name] = new THREE.Texture(image);
      this.textures[name].name = name;
      this.textures[name].minFilter = THREE.LinearFilter;
      changed = true;
    }
    const texture = this.textures[name];
    texture.name = name;
    if (parameters) {
      if (THREEPlayer.setParameter(texture, parameters, "wrapS"))
        changed = true;
      if (THREEPlayer.setParameter(texture, parameters, "wrapT"))
        changed = true;
      if (THREEPlayer.setParameter(texture, parameters, "minFilter"))
        changed = true;
    } else {
      THREEPlayer.updateProp(texture, this.getTextureConfig(name));
    }
    texture.needsUpdate = changed;
    return texture;
  }
  getUniform(config) {
    switch (config.type) {
      case "f":
        return {
          value: config.value,
          type: "f",
        };
      case "i":
        return {
          value: config.value,
          type: "i",
        };
      case "v2":
        return {
          value: new THREE.Vector2().fromArray(
            Array.isArray(config.value)
              ? config.value
              : parseVector(config.value),
          ),
        };
      case "v3":
        return {
          value: new THREE.Vector3().fromArray(
            Array.isArray(config.value)
              ? config.value
              : parseVector(config.value),
          ),
        };
      case "v4":
        return {
          value: new THREE.Vector4().fromArray(
            Array.isArray(config.value)
              ? config.value
              : parseVector(config.value),
          ),
        };
      case "c":
        return {
          value: new THREE.Color(config.value),
        };
      case "t":
        return {
          value: this.getTexture(config.value),
          src: config.value,
          type: "t",
        };
      case "w":
        return {
          value: THREEPlayer.getTextTexture(config.value),
          type: "t",
        };
      case "b":
        return {
          value: this.getBuffer(config.value).texture,
          type: "t",
        };
      case "u":
        return (
          this.uniformSetting[config.value] || {
            value: null,
          }
        );
      case "g":
        return {
          value: (0, gradient.createGradientTexture)(config.value),
          type: "t",
        };
      default:
        return {
          value: config.value,
        };
    }
  }
  getMaterial(configs, objectType) {
    var player = this;
    if (0 !== configs.length) {
      var materials = [];
      configs.forEach(function (material, item) {
        var value = player.shaderSetting[material.id];
        if (!value) throw new Error("unknown shader:" + material.id);
        materials[item] = value.clone();
        materials[item].name = material.id;
        materials[item].skinning = 2 === objectType;
        void 0 !== material.transparent &&
          (materials[item].transparent = material.transparent);
        void 0 !== material.depthTest &&
          (materials[item].depthTest = material.depthTest);
        void 0 !== material.depthWrite &&
          (materials[item].depthWrite = material.depthWrite);
        void 0 !== material.side && (materials[item].side = material.side);
        void 0 !== material.blending &&
          (materials[item].blending = material.blending);
        void 0 !== material.wireframe &&
          (materials[item].wireframe = material.wireframe);
        void 0 !== material.derivatives &&
          (materials[item].extensions.derivatives = material.derivatives);
        material.lights &&
          ((materials[item].lights = true),
          (materials[item].uniforms = THREE.UniformsUtils.clone(
            THREE.UniformsLib.lights,
          )));
        material.uniforms &&
          material.uniforms.forEach(function (config) {
            "t" === config.type && (materials[item].defines.USE_TEXTURE = 1);
            materials[item].uniforms[config.key] = player.getUniform(config);
          });
        material.globalUniform &&
          material.globalUniform.forEach(function (uniformName) {
            materials[item].uniforms[uniformName] =
              player.uniformSetting[uniformName];
          });
        material.defines &&
          (materials[item].defines = Object.assign(
            {},
            materials[item].defines,
            material.defines,
          ));
        material.glsl3 && (materials[item].glslVersion = THREE.GLSL3);
        material.others &&
          material.others.split("&").forEach(function (parameter) {
            var pair = parameter.split("=");
            if (2 === pair.length) {
              var key = pair[0],
                value = pair[1];
              "false" === value || "true" === value
                ? (materials[item][key] = "false" !== value)
                : isNaN(parseInt(value))
                  ? (materials[item][key] = value)
                  : (materials[item][key] = parseInt(value));
            }
          });
      });
      return 1 === materials.length ? materials[0] : materials;
    }
  }
  initSpineData(name) {
    var player = this,
      atlas = new spine.default.TextureAtlas(this.spineSetting[name].atlas);
    atlas.pages.forEach(function (entry) {
      var value,
        imageName = entry.name.substr(0, entry.name.indexOf("."));
      value = new spine.default.threejs.ThreeJsTexture(
        player.getImage(imageName),
      );
      entry.setTexture(value);
    });
    var skeleton = new spine.default.SkeletonJson(
      new spine.default.AtlasAttachmentLoader(atlas),
    ).readSkeletonData(this.spineSetting[name].json);
    this.spines[name] = {
      skeleton: skeleton,
      atlas: atlas,
    };
  }
  getSpineData(name) {
    if (!this.spines[name]) {
      if (!this.spineSetting[name])
        return void console.error("no spine:" + name);
      this.initSpineData(name);
    }
    return this.spines[name];
  }
  createSpine(config, material, depthMaterial) {
    var player = this,
      data = this.getSpineData(config.id);
    if (!data) return new THREE.Object3D();
    var classId = (config.classConfig || {}).id,
      mesh = new (
        this.classSetting[classId] || spine.default.threejs.SkeletonMesh
      )(
        data.skeleton,
        function (shader) {
          shader.defines = {};
          material &&
            ((shader.fragmentShader = material.fragmentShader),
            (shader.vertexShader = material.vertexShader),
            (shader.depthTest = material.depthTest),
            (shader.depthWrite = material.depthWrite),
            (shader.depthFunc = material.depthFunc),
            (shader.side = material.side),
            (shader.blending = material.blending),
            (shader.blendDst = material.blendDst),
            (shader.blendDstAlpha = material.blendDstAlpha),
            (shader.blendEquation = material.blendEquation),
            (shader.blendEquationAlpha = material.blendEquationAlpha),
            (shader.blendSrc = material.blendSrc),
            (shader.blendSrcAlpha = material.blendSrcAlpha),
            (shader.lights = material.lights),
            (shader.wireframe = material.wireframe),
            (shader.glslVersion = material.glslVersion),
            Object.keys(material.uniforms).forEach(function (item) {
              shader.uniforms[item] = material.uniforms[item];
            }),
            Object.keys(material.defines).forEach(function (item) {
              shader.defines[item] = material.defines[item];
            }),
            config.twoColor && (shader.defines.TWO_COLOR = 1));
          return shader;
        },
        depthMaterial
          ? function (shader) {
              shader.defines = {};
              shader.fragmentShader = depthMaterial.fragmentShader;
              shader.vertexShader = depthMaterial.vertexShader;
              shader.depthTest = depthMaterial.depthTest;
              shader.depthWrite = depthMaterial.depthWrite;
              shader.side = depthMaterial.side;
              shader.transparent = shader.transparent;
              shader.glslVersion = depthMaterial.glslVersion;
              Object.keys(depthMaterial.uniforms).forEach(function (item) {
                shader.uniforms[item] = depthMaterial.uniforms[item];
              });
              Object.keys(depthMaterial.defines).forEach(function (item) {
                shader.defines[item] = depthMaterial.defines[item];
              });
              return shader;
            }
          : null,
        config.maxVert,
        config.twoColor,
      );
    mesh.playerType = 3;
    mesh.userData.spineId = config.id;
    material && (mesh.material = material);
    try {
      mesh.state.setAnimation(
        0,
        config.defaultAnimation ||
          mesh.state.data.skeletonData.animations[0].name,
        !config.playOnce,
      );
      config.skin
        ? mesh.skeleton.setSkinByName(config.skin)
        : mesh.skeleton &&
          mesh.skeleton.data &&
          mesh.skeleton.data.skins.length > 1 &&
          mesh.skeleton.setSkin(mesh.skeleton.data.skins[1]);
    } catch (e) {
      console.error(e);
    }
    config.trackOffset &&
      (mesh.state.tracks[0].trackTime += Math.random() * config.trackOffset);
    config.timeScale &&
      (mesh.state.timeScale = config.timeScale * this.devSpeed);
    mesh.onTick = this.defaultAnimationSetting.SPINE.bind(mesh);
    var events = [
        {
          name: "event",
          event: "onEvent",
        },
        {
          name: "start",
          event: "onStart",
        },
        {
          name: "end",
          event: "onEnd",
        },
        {
          name: "dispose",
          event: "onDispose",
        },
        {
          name: "interrupted",
          event: "onInterrupted",
        },
        {
          name: "complete",
          event: "onComplete",
        },
      ],
      removeListener = function (index) {
        mesh.state.removeListener(mesh.userData[index + "Listener"]);
        mesh.userData[index + "Listener"] = null;
      };
    mesh.playAnimation = function (item, options) {
      var value = options || {},
        mixOption = value.mix,
        mix = void 0 === mixOption ? 0.3 : mixOption,
        speedOption = value.speed,
        speed = void 0 === speedOption ? 1 : speedOption,
        loopOption = value.loop,
        loop = void 0 !== loopOption && loopOption,
        channelOption = value.channel,
        channel = void 0 === channelOption ? 0 : channelOption,
        overwriteOption = value.overwrite,
        overwrite = void 0 === overwriteOption || overwriteOption,
        onEventOption = value.onEvent,
        onEvent = void 0 === onEventOption ? null : onEventOption,
        onStartOption = value.onStart,
        onStart = void 0 === onStartOption ? null : onStartOption,
        onEndOption = value.onEnd,
        onEnd = void 0 === onEndOption ? null : onEndOption,
        onDisposeOption = value.onDispose,
        onDispose = void 0 === onDisposeOption ? null : onDisposeOption,
        onInterruptedOption = value.onInterrupted,
        onInterrupted =
          void 0 === onInterruptedOption ? null : onInterruptedOption,
        onCompleteOption = value.onComplete,
        onComplete = void 0 === onCompleteOption ? null : onCompleteOption;
      mesh.state.data.defaultMix = mix;
      mesh.state.timeScale = speed * player.devSpeed;
      mesh.visible = true;
      var lastAnimation = void 0;
      Array.isArray(item)
        ? item.forEach(function (animationName, index) {
            0 === index
              ? mesh.state.setAnimation(channel, animationName, false)
              : mesh.state.addAnimation(
                  channel,
                  animationName,
                  loop && index === item.length - 1,
                  0,
                );
            index === item.length - 1 && (lastAnimation = animationName);
          })
        : ((lastAnimation = item),
          mesh.state.setAnimation(channel, item, loop));
      events.forEach(function (entry) {
        overwrite &&
          mesh.userData[entry.name + "Listener"] &&
          removeListener(entry.name);
      });
      onEvent &&
        ((mesh.userData.eventListener = {
          event: function (track, event) {
            removeListener("event");
            onEvent(track, event);
          },
        }),
        mesh.state.addListener(mesh.userData.eventListener));
      onStart &&
        ((mesh.userData.startListener = {
          start: function (track) {
            removeListener("start");
            onStart(track);
          },
        }),
        mesh.state.addListener(mesh.userData.startListener));
      onEnd &&
        ((mesh.userData.endListener = {
          end: function (track) {
            onEnd(track);
          },
        }),
        mesh.state.addListener(mesh.userData.endListener));
      onDispose &&
        ((mesh.userData.disposeListener = {
          dispose: function (track) {
            removeListener("dispose");
            onDispose(track);
          },
        }),
        mesh.state.addListener(mesh.userData.disposeListener));
      onInterrupted &&
        ((mesh.userData.interruptedListener = {
          interrupted: function (track) {
            removeListener("interrupted");
            onInterrupted(track);
          },
        }),
        mesh.state.addListener(mesh.userData.interruptedListener));
      onComplete &&
        ((mesh.userData.completeListener = {
          complete: function (track) {
            track.animation.name === lastAnimation &&
              (removeListener("complete"), onComplete(track));
          },
        }),
        mesh.state.addListener(mesh.userData.completeListener));
    };
    mesh.update(0, this.uniformSetting.time.value);
    return mesh;
  }
  createGeometry(config) {
    const settings = config.config || {};
    switch (config.type) {
      case 1:
        return this.getGeometry(config.id);
      case 2: {
        const {
          width = 100,
          height = 100,
          widthSegments = 1,
          heightSegments = 1,
          cx = 0,
          cy = 0,
          cz = 0,
        } = settings;
        return new THREE.PlaneBufferGeometry(
          width,
          height,
          widthSegments,
          heightSegments,
        ).translate(cx, cy, cz);
      }
      case 3: {
        const {
          width = 100,
          height = 100,
          depth = 100,
          widthSegments = 1,
          heightSegments = 1,
          depthSegments = 1,
        } = settings;
        return new THREE.BoxBufferGeometry(
          width,
          height,
          depth,
          widthSegments,
          heightSegments,
          depthSegments,
        );
      }
      case 4: {
        const {
          radius = 50,
          widthSegments = 12,
          heightSegments = 12,
        } = settings;
        return new THREE.SphereBufferGeometry(
          radius,
          widthSegments,
          heightSegments,
        );
      }
      case 5: {
        const { radius = 100, circleSegment = 20 } = settings;
        return new THREE.CircleGeometry(radius, circleSegment);
      }
      case 6: {
        const { shapPointList = [] } = settings;
        const shape = new THREE.Shape();
        shapPointList.forEach((point, index) => {
          if (index === 0) shape.moveTo(point.x, point.y);
          else shape.lineTo(point.x, point.y);
        });
        return new THREE.ShapeGeometry(shape);
      }
      case 7: {
        const {
          radius = 30,
          length = 100,
          capSubdivisions = 4,
          radialSegments = 8,
        } = settings;
        return new THREE.CapsuleGeometry(
          radius,
          length,
          capSubdivisions,
          radialSegments,
        );
      }
      default:
        return null;
    }
  }
  createCamera(config) {
    var camera = void 0,
      settings = config.camera || {};
    switch (settings.type) {
      case 1:
        camera = new THREE.PerspectiveCamera(
          settings.fov || 32,
          settings.aspect || 1,
          settings.near || 0.01,
          settings.far || 1e4,
        );
        break;
      case 2:
        camera = new THREE.OrthographicCamera(
          settings.left || -100,
          settings.right || 100,
          settings.top || 100,
          settings.bottom || -100,
          settings.near || 0.01,
          settings.far || 1e4,
        );
        break;
      case 3:
        camera = new THREE.CubeCamera(
          settings.near || 0.01,
          settings.far || 1e4,
          this.getBuffer(settings.buffer),
        );
      default:
        throw new Error("unknown camera type:" + config.cameraType);
    }
    return camera;
  }
  initScene(config, scene) {
    var player = this;
    scene.getPlayer = function () {
      return player;
    };
    scene.playTimeline = function (item, timelineName) {
      return player.playTimeline(scene, item, timelineName);
    };
    scene.stopTimeline = function (item) {
      return player.stopTimeline(scene, item);
    };
    scene.getTimeline = function (item, options) {
      return player.getTimeline(scene, item, options);
    };
    config.hooksFunc &&
      config.hooksFunc.render &&
      this.animationSetting[config.hooksFunc.render] &&
      (scene.onBeforeRender =
        this.animationSetting[config.hooksFunc.render].bind(scene));
    config.children.forEach(function (item) {
      player.initObject(item, scene, scene);
    });
    scene.children.forEach(function (item) {
      player.finalizeObject(item);
    });
    this.modifierObject(scene, config);
    config.hooksFunc &&
      config.hooksFunc.init &&
      this.animationSetting[config.hooksFunc.init] &&
      this.animationSetting[config.hooksFunc.init].apply(scene, [config, this]);
  }
  createObject(config, geometry, material, depthMaterial) {
    var object = void 0,
      classId = (config.classConfig || {}).id;
    switch (config.type) {
      case 0:
        object = new (this.classSetting[classId] || THREE.Object3D)();
        break;
      case 1:
        object = new (this.classSetting[classId] || THREE.Mesh)(
          geometry,
          material,
        );
        THREEPlayer.buildMorph(object);
        break;
      case 2:
        object = new (this.classSetting[classId] || THREE.SkinnedMesh)(
          geometry,
          material,
        );
        THREEPlayer.buildMorph(object);
        break;
      case 3:
        var passMaterial =
          false !== config.setDepthMaterial ? depthMaterial : null;
        object = this.createSpine(
          Object.assign({}, config.spine, {
            classConfig: config.classConfig,
          }),
          material,
          passMaterial,
        );
        break;
      case 4:
        var plugin = this.pluginSetting[config.pluginId];
        if (plugin)
          try {
            object = plugin.call(
              this,
              config,
              material,
              config.userData.pluginData,
            );
          } catch (e) {
            console.log(e);
          }
        object || (object = new THREE.Object3D());
        break;
      case 5:
        switch (config.light.type) {
          case 1:
            object = new THREE.AmbientLight(
              config.light.color,
              config.light.intensity,
            );
            break;
          case 2:
            object = new THREE.DirectionalLight(
              config.light.color,
              config.light.intensity,
            );
            break;
          case 3:
            object = new THREE.SpotLight(
              config.light.color,
              config.light.intensity,
              config.light.distance,
              config.light.angle,
              config.light.penumbra,
              config.light.decay,
            );
            break;
          case 4:
            object = new THREE.PointLight(
              config.light.color,
              config.light.intensity,
              config.light.distance,
              config.light.decay,
            );
            break;
          default:
            throw new Error("unknown light type:" + config.light.type);
        }
        config.castShadow &&
          ((object.shadow.bias = config.light.bias),
          (object.shadow.radius = config.light.radius),
          (object.shadow.normalBias = config.light.normalBias),
          object.shadow.mapSize.fromArray(config.light.mapSize));
        break;
      case 6:
        object = new THREE.Bone();
        break;
      case 7:
        object = this.createCamera(config);
        break;
      case 9:
        object = this.createText(config.text, material);
        break;
      default:
        object = new THREE.Object3D();
        console.warn("不存在该 type");
    }
    object.uuid = config.uuid;
    object.visible = config.visible;
    object.renderOrder = config.renderOrder;
    return object;
  }
  initObjectByID(id, parent) {
    var scene =
        arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : parent,
      recursive =
        !(arguments.length > 3 && void 0 !== arguments[3]) || arguments[3],
      config = this.exportResources[id];
    if (config) {
      var object = this.initObject(config, parent, scene, recursive);
      this.finalizeObject(object);
      return object;
    }
    return null;
  }
  /** Create and link nodes first. finalizeObject runs after all siblings exist so bones, modifiers and hooks can resolve their targets. */
  initObject(config, parent) {
    var scene =
        arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : parent,
      player = this,
      recursive =
        !(arguments.length > 3 && void 0 !== arguments[3]) || arguments[3],
      existingObject = arguments[4],
      object = void 0,
      geometry = void 0,
      material = void 0,
      depthMaterial = void 0;
    config.geometry && (geometry = this.createGeometry(config.geometry));
    config.material &&
      (material = this.getMaterial(
        config.material,
        config.type,
        config.geometry,
      ));
    config.passMaterial &&
      (depthMaterial = this.getMaterial(
        config.passMaterial,
        config.type,
        config.geometry,
      ));
    (object =
      existingObject ||
      this.createObject(config, geometry, material, depthMaterial)).scene =
      scene;
    object.name = config.name;
    object.frustumCulled =
      void 0 === config.frustumCulled || config.frustumCulled;
    object.castShadow = !!config.castShadow;
    object.receiveShadow = !!config.receiveShadow;
    config.material && (object.userData.colorMaterial = material);
    depthMaterial &&
      ((object.userData.passMaterial = depthMaterial),
      false !== config.setDepthMaterial &&
        (object.customDepthMaterial = depthMaterial));
    config.position && object.position.fromArray(config.position);
    config.rotation && object.rotation.fromArray(config.rotation, "XYZ");
    config.scale && object.scale.fromArray(config.scale);
    object.userData.initPos = object.position.clone();
    object.userData.initRot = object.rotation.clone();
    object.userData.initScl = object.scale.clone();
    config.eventList &&
      (config.eventList.forEach(function (item) {
        var keyOption = item.key,
          funcNameOption = item.funcName;
        player.animationSetting[funcNameOption] &&
          (object.userData[keyOption] =
            player.animationSetting[funcNameOption].bind(object));
        ("onRollOver" !== keyOption && "onRollOut" !== keyOption) ||
          object.userData.onMouseMove ||
          (object.userData.onMouseMove = function () {});
      }),
      scene.clicks || (scene.clicks = []),
      -1 === scene.clicks.indexOf(object) && scene.clicks.push(object),
      (object.userData.mouseEnabled = true));
    config.userData && Object.assign(object.userData, config.userData);
    object.matrixAutoUpdate = void 0 !== config.autoMatrix && config.autoMatrix;
    object.matrixAutoUpdate || object.updateMatrix();
    config.hooksFunc &&
      config.hooksFunc.render &&
      this.animationSetting[config.hooksFunc.render] &&
      (object.onBeforeRender =
        this.animationSetting[config.hooksFunc.render].bind(object));
    config.children &&
      recursive &&
      config.children.forEach(function (item) {
        player.initObject(item, object, scene, recursive);
      });
    config.exportID && (this.exportResources[config.exportID] = config);
    1 === config.mask
      ? ((object.onBeforeRender = this.defaultAnimationSetting.DRAW_MASK),
        (object.onAfterRender = this.defaultAnimationSetting.BEGIN_MASK))
      : 2 === config.mask
        ? ((object.onBeforeRender = this.defaultAnimationSetting.DRAW_MASK),
          (object.onAfterRender =
            this.defaultAnimationSetting.BEGIN_INVERT_MASK))
        : 3 === config.mask &&
          (object.onAfterRender = this.defaultAnimationSetting.STOP_MASK);
    parent && parent.add(object);
    3 !== config.type &&
      ((object.playTimeline = function (item, options) {
        return player.playTimeline(object, item, options);
      }),
      (object.stopTimeline = function (item) {
        return player.stopTimeline(object, item);
      }),
      (object.getTimeline = function (item, options) {
        return player.getTimeline(object, item, options);
      }),
      (object.getTexture = this.getTexture.bind(this)));
    object.getPlayer = function () {
      return player;
    };
    object.userData._initializeData = config;
    return object;
  }
  modifierObject(object, config) {
    var player = this;
    config.modifier &&
      config.modifier.forEach(function (item) {
        player.modifierSetting[item.id] &&
          player.modifierSetting[item.id].call(
            object,
            config,
            player,
            item.data,
          );
      });
    config.machine &&
      config.machine.forEach(function (item) {
        player.machineSetting[item.id] &&
          player.machineSetting[item.id].call(object, item.data);
      });
    object.onInit && object.onInit();
  }
  /** Resolve children before parent hooks, then remove initialization metadata to prevent double initialization. */
  finalizeObject(object) {
    var player = this;
    if (object.userData._initializeData) {
      object.children.forEach(function (item) {
        player.finalizeObject(item);
      });
      var config = object.userData._initializeData,
        hooks = config.hooksFunc,
        skinning = config.skinning;
      if (2 === config.type)
        try {
          var skeleton = this.getSkeleton(skinning, object.parent);
          object.bind(skeleton, object.matrixWorld);
        } catch (e) {
          throw (
            console.log("err", e),
            new Error("no skinning:" + skinning, e)
          );
        }
      this.modifierObject(object, object.userData._initializeData);
      hooks &&
        hooks.init &&
        this.animationSetting[hooks.init] &&
        this.animationSetting[hooks.init].call(
          object,
          object.userData._initializeData,
          this,
        );
      delete object.userData._initializeData;
    }
  }
  getGeometry(name) {
    return this.geometries[name]
      ? this.geometries[name]
      : (console.error("no geometry:" + name), null);
  }
  removeGeometry(name) {
    this.geometries[name] &&
      (this.geometries[name].dispose(), delete this.geometries[name]);
  }
  initGeometry(layout) {
    var player = this;
    if (!layout.geometries) throw new Error("no geometries data");
    Object.keys(layout.geometries).forEach(function (item) {
      player.geometries[item] ||
        (player.geometries[item] = THREEPlayer.buildGeometry(
          layout.geometries[item],
        ));
    });
    layout.skinning &&
      Object.keys(layout.skinning).forEach(function (item) {
        player.skinning[item] ||
          (player.skinning[item] = layout.skinning[item]);
      });
  }
  getBone(name, root) {
    return (
      root.getObjectByName(name) ||
      (root.parent ? this.getBone(name, root.parent) : null)
    );
  }
  getSkeleton(name, root) {
    var config = this.skinning[name];
    if (!config) throw new Error("no skinning:" + name);
    var rootBone = this.getBone(config.bones[0].name, root),
      cacheKey = "" + name + rootBone.id;
    if (!this.skeletons[cacheKey]) {
      var bones = [],
        inverseMatrices = [];
      config.bones.forEach(function (entry, index) {
        var value = void 0;
        0 === index
          ? (value = rootBone)
          : (value = rootBone.getObjectByName(entry.name)) ||
            (value = rootBone.scene.getObjectByName(entry.name));
        bones.push(value);
        inverseMatrices.push(
          new THREE.Matrix4().fromArray(config.matrix[index]),
        );
      });
      var skeleton = new THREE.Skeleton(bones, inverseMatrices);
      this.skeletons[cacheKey] = skeleton;
    }
    return this.skeletons[cacheKey];
  }
  /** Skip intervals of 10 ms or less and cap delta at 30 ms exactly as the captured player does; shader time wraps at 10,000 seconds. */
  tick() {
    return (
      ("undefined" == typeof performance ? Date.now() : performance.now()) -
        this.clock.oldTime >
        10 &&
      ((this.uniformSetting.delta.value = Math.min(
        this.clock.getDelta(),
        0.03,
      )),
      (this.uniformSetting.fps.value =
        this.uniformSetting.delta.value / 0.0167),
      (this.uniformSetting.time.value =
        (this.uniformSetting.time.value + this.uniformSetting.delta.value) %
        1e4),
      true)
    );
  }
  /** Temporarily move visible meshes into a warm-up scene, then restore their parent and visibility before normal rendering. */
  compile(scene, camera, target) {
    var objects = [],
      compileScene = new THREE.Scene();
    scene.traverse(function (object) {
      object.material &&
        object.userData.initPos &&
        ((object.userData.visible = object.visible),
        (object.userData.parent = object.parent),
        (object.userData.frustumCulled = object.frustumCulled),
        (object.visible = true),
        (object.frustumCulled = false),
        objects.push(object));
    });
    objects.forEach(function (item) {
      compileScene.add(item);
    });
    var previousTarget = this.renderer.getRenderTarget();
    this.renderer.setRenderTarget(target);
    this.renderer.render(compileScene, camera);
    this.renderer.setRenderTarget(previousTarget);
    objects.forEach(function (item) {
      item.frustumCulled = item.userData.frustumCulled;
      item.visible = item.userData.visible;
      item.userData.parent.add(item);
    });
    objects.length = 0;
  }
  compileScene(name) {
    var value = this.getScene(name);
    this.compile(value, value.camera, value.buffer);
  }
  initTouch(element) {
    this.mouseController ||
      (this.mouseController = new mouse.default.MouseController(this, element));
    return this.mouseController;
  }
  disableTouch() {
    this.mouseController &&
      (this.mouseController.dispose(), (this.mouseController = null));
  }
  get domElement() {
    return this.renderer.domElement;
  }
  /** Typed-array precision and the 65,535-vertex index threshold affect WebGL output; do not replace these conversions with generic arrays. */
  static buildGeometry(config) {
    var geometry = new geometryTypes[config.type || 1]();
    Object.keys(config.attributes).forEach(function (index) {
      var value,
        _config = config.attributes[index];
      value =
        3 === _config.type
          ? new THREE.InterleavedBufferAttribute(
              new THREE.InterleavedBuffer(
                new Float32Array(_config.array),
                _config.stride,
              ),
              _config.itemSize,
              _config.offset,
            )
          : "skinIndex" === index
            ? new attributeTypes[_config.type](
                new Uint16Array(_config.array),
                _config.itemSize,
              )
            : new attributeTypes[_config.type](
                new Float32Array(_config.array),
                _config.itemSize,
              );
      geometry.setAttribute(index, value);
    });
    config.groups && (geometry.groups = config.groups);
    config.index &&
      geometry.setIndex(
        new THREE.BufferAttribute(
          new (config.attributes.position.array.length > 196605
            ? Uint32Array
            : Uint16Array)(config.index),
          1,
        ),
      );
    config.attributes.normal || geometry.computeVertexNormals();
    return geometry;
  }
  static updateGeometry(geometry, config) {
    geometryTypes[config.type] !== geometry.constructor
      ? (geometry.dispose(), (geometry = THREEPlayer.buildGeometry(config)))
      : (config.groups && (geometry.groups = config.groups),
        Object.keys(config.attributes).forEach(function (item) {
          var value = config.attributes[item],
            attribute = geometry.attributes[item];
          attribute.array = new Float32Array(value.array);
          attribute.itemSize = value.itemSize;
          attribute.count = value.array.length / value.itemSize;
          attribute.needsUpdate = true;
        }),
        (geometry.index.array = new (
          config.attributes.position.array.length > 196605
            ? Uint32Array
            : Uint16Array
        )(config.index)),
        (geometry.index.count = geometry.index.array.length),
        (geometry.index.needsUpdate = true));
    return geometry;
  }
}
export { THREEPlayer };
