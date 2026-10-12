import { THREE } from '../engine/vendor/libraries.js';
import { createCSS3DModifier } from './css3d.mjs';

function sampleWiggle(time, delay, octaves) {
  let sum = 0;
  let frequency = 1 / (2 - 1 / 2 ** octaves);
  for (let octave = 0; octave < octaves; octave++) {
    sum += Math.sin((time + delay) * frequency);
    frequency *= 2.56;
  }
  return sum;
}

/** Modifiers are called with the authored object as this and its player as argument. */
export function createModifiers({ getFrame, schedule = setTimeout } = {}) {
  return {
    CSS3DObject: createCSS3DModifier({ getFrame }),

    drawScene(
      config,
      player,
      {
        id = '',
        bufferId = '',
        clearColor = 0xffffff,
        clearAlpha = true,
        paused = false,
        autoSetBuffer = true,
        autoClearDepth = true,
      } = {},
    ) {
      const node = this;
      const renderer = player.renderer;
      const color = new THREE.Color(clearColor);
      let sceneName = id;
      let buffer = null;
      Object.defineProperty(node, 'clearColor', {
        configurable: true,
        get: () => color,
        set: (value) => color.set(value),
      });
      node.clearAlpha = clearAlpha;
      node.scenePaused = paused;
      if (bufferId) {
        buffer = player.getBuffer(bufferId);
        if (autoSetBuffer)
          node.material.uniforms.diffuse.value = buffer.texture;
      }
      node.setBufferId = (name) => {
        sceneName = name;
      };
      let firstRender = true;
      node.onBeforeRender = () => {
        if (!sceneName || (node.scenePaused && !firstRender)) return;
        const previousColor = renderer.getClearColor(new THREE.Color());
        const previousAlpha = renderer.getClearAlpha();
        const previousTarget = renderer.getRenderTarget();
        renderer.setClearColor(node.clearColor, +!node.clearAlpha);
        if (!bufferId) player.renderScene(sceneName);
        else {
          const scene = player.getScene(sceneName);
          renderer.setRenderTarget(buffer);
          renderer.clear();
          renderer.render(scene, scene.camera);
        }
        if (autoClearDepth) renderer.clearDepth();
        renderer.setClearColor(previousColor, previousAlpha);
        renderer.setRenderTarget(previousTarget);
        firstRender = false;
      };
    },

    playTimeline(
      config,
      player,
      { sceneName = '', trackName = '', frame = 0 } = {},
    ) {
      const timeline = player.getTimeline(
        sceneName ? player.getScene(sceneName) : this,
        trackName,
      );
      Object.defineProperty(this, `trackTime_${trackName}`, {
        get: () => (timeline ? timeline.time : 0),
        set: (value) => {
          if (timeline) timeline.seek(value);
        },
      });
      this[`trackTime_${trackName}`] = frame;
    },

    wiggle_roty_posxz(
      config,
      player,
      {
        moveSpeed = [1, 1, 1],
        moveAmp = [10, 10, 0],
        moveDelay = [0, 0, 0],
        moveOctaves = 1,
        rotSpeed = [1, 1, 1],
        rotAmp = [0, 0, 0],
        rotDelay = [0, 0, 0],
        rotOctaves = 1,
        spinSpeed = [0, 0, 0],
        scaleSpeed = [1, 1, 1],
        scaleAmp = [0.1, 0.1, 0],
        scaleDelay = [0, 0, 0],
        scaleOctaves = 1,
        opacitySpeed = 1,
        opacityAmp = 0,
        opacityCenter = 0,
        opacityDelay = 0,
        opacityOctaves = 1,
      } = {},
    ) {
      const node = this;
      const moveTime = new THREE.Vector3();
      const rotationTime = new THREE.Vector3();
      const spin = new THREE.Vector3();
      const rotation = new THREE.Vector3(
        node.userData.initRot.x,
        node.userData.initRot.y,
        node.userData.initRot.z,
      );
      const scaleTime = new THREE.Vector3();
      for (const [key, value] of Object.entries({
        moveSpeed,
        moveAmp,
        moveDelay,
        rotSpeed,
        rotAmp,
        rotDelay,
        spinSpeed,
        scaleSpeed,
        scaleAmp,
        scaleDelay,
      })) {
        node[`wiggle${key[0].toUpperCase()}${key.slice(1)}`] =
          new THREE.Vector3().fromArray(value);
      }
      Object.assign(node, {
        wiggleOpacitySpeed: opacitySpeed,
        wiggleOpacityAmp: opacityAmp,
        wiggleOpacityCenter: opacityCenter,
        wiggleOpacityDelay: opacityDelay,
      });
      node.matrixAutoUpdate = true;
      let opacityTime = 0;
      node.addEventListener('tick', () => {
        if (!node.scene.autoUpdate) return;
        const delta = player.uniformSetting.delta.value;
        for (const axis of ['x', 'y', 'z']) {
          if (node.wiggleMoveAmp[axis] !== 0) {
            moveTime[axis] += delta * node.wiggleMoveSpeed[axis];
            node.position[axis] =
              node.userData.initPos[axis] +
              node.wiggleMoveAmp[axis] *
                sampleWiggle(
                  moveTime[axis],
                  node.wiggleMoveDelay[axis],
                  moveOctaves,
                );
          }
          if (node.wiggleSpinSpeed[axis] !== 0)
            spin[axis] += node.wiggleSpinSpeed[axis] * delta;
          // The captured implementation gates the y rotation with the x amplitude.
          const rotationGate = axis === 'y' ? 'x' : axis;
          if (node.wiggleRotAmp[rotationGate] !== 0) {
            rotationTime[axis] += delta * node.wiggleRotSpeed[axis];
            rotation[axis] =
              node.userData.initRot[axis] +
              node.wiggleRotAmp[axis] *
                sampleWiggle(
                  rotationTime[axis],
                  node.wiggleRotDelay[axis],
                  rotOctaves,
                );
          }
          node.rotation[axis] = spin[axis] + rotation[axis];
          // Its z scale similarly uses the z rotation amplitude as the gate.
          const scaleEnabled =
            axis === 'z' ? node.wiggleRotAmp.z : node.wiggleScaleAmp[axis];
          if (scaleEnabled !== 0) {
            scaleTime[axis] += delta * node.wiggleScaleSpeed[axis];
            node.scale[axis] =
              node.userData.initScl[axis] +
              node.wiggleScaleAmp[axis] *
                sampleWiggle(
                  scaleTime[axis],
                  node.wiggleScaleDelay[axis],
                  scaleOctaves,
                );
          }
        }
        if (node.wiggleOpacityAmp && node.material.uniforms.opacity) {
          opacityTime += delta * node.wiggleOpacitySpeed;
          node.material.uniforms.opacity.value =
            node.wiggleOpacityCenter +
            node.wiggleOpacityAmp *
              sampleWiggle(
                opacityTime,
                node.wiggleOpacityDelay,
                opacityOctaves,
              );
        }
      });
    },

    maskContainer(config, player, { target = '', clearColor = 0xffffff } = {}) {
      const node = this;
      const maskScene = new THREE.Scene();
      const buffer = player.getBuffer(`${node.name}maskContainer`, {
        resizable: false,
        stencilBuffer: true,
      });
      const resolution = new THREE.Vector2();
      node.material.uniforms.resolution = { value: resolution };
      node.material.uniforms.diffuse = { value: buffer.texture };
      schedule(() => {
        const maskedObject = target
          ? node.scene.getObjectByProperty('uuid', target)
          : null;
        const originalParent = maskedObject?.parent;
        if (maskedObject) maskScene.add(maskedObject);
        else while (node.children.length) maskScene.add(node.children[0]);
        const previousColor = new THREE.Color();
        node.onBeforeRender = function (renderer, scene, camera) {
          const previousTarget = renderer.getRenderTarget();
          renderer.getClearColor(previousColor);
          renderer.setClearColor(clearColor, 0);
          if (previousTarget)
            resolution.set(previousTarget.width, previousTarget.height);
          else renderer.getSize(resolution);
          if (buffer.width !== resolution.x || buffer.height !== resolution.y)
            buffer.setSize(resolution.x, resolution.y);
          const matrix = maskedObject
            ? originalParent.matrixWorld
            : this.matrixWorld;
          matrix.decompose(
            maskScene.position,
            maskScene.quaternion,
            maskScene.scale,
          );
          renderer.setRenderTarget(buffer);
          renderer.clear();
          renderer.render(maskScene, camera);
          renderer.setRenderTarget(previousTarget);
          renderer.setClearColor(previousColor, 0);
        };
        for (const method of ['add', 'attach', 'remove'])
          node[method] = (object) => {
            maskScene[method === 'attach' ? 'add' : method](object);
            return node;
          };
        node.getObjectByProperty = (property, value) =>
          node[property] === value
            ? node
            : maskScene.getObjectByProperty(property, value);
      });
    },

    effect_dofBlur(config, player, { enableLod = false } = {}) {
      const scene = this;
      const renderer = player.renderer;
      const mesh = scene.children[0];
      const material = mesh.material;
      const resolution = new THREE.Vector2();
      const targets = [0, 1].map(
        () =>
          new THREE.WebGLRenderTarget(2, 2, {
            generateMipmaps: enableLod,
            minFilter: enableLod
              ? THREE.LinearMipMapLinearFilter
              : THREE.LinearFilter,
            depthBuffer: false,
            stencilBuffer: false,
          }),
      );
      let index = 0;
      let inputWidth = 2;
      let inputHeight = 2;
      scene.overrideRender = (clear = true, options) => {
        if (!options) {
          if (clear) renderer.clear();
          renderer.render(scene, scene.camera);
          return;
        }
        const {
          blur = 50,
          angle = 0,
          curve = { x: 0, y: 1 },
          offset,
          camera = scene.camera,
          target,
          map,
          inBuffer,
          writeBuffer,
        } = options;
        const { width, height } = inBuffer;
        if (width !== inputWidth || height !== inputHeight) {
          const bufferWidth = 2 ** Math.floor(Math.log(width) / Math.LN2);
          const bufferHeight = 2 ** Math.floor(Math.log(height) / Math.LN2);
          targets.forEach((buffer) =>
            buffer.setSize(bufferWidth, bufferHeight),
          );
          resolution.set(bufferWidth, bufferHeight);
          inputWidth = width;
          inputHeight = height;
        }
        if (target) {
          mesh.geometry = target.geometry;
          target.matrixWorld.decompose(
            mesh.position,
            mesh.quaternion,
            mesh.scale,
          );
          mesh.updateMatrix();
        }
        scene.autoUpdate = true;
        material.uniforms.angle.value = angle;
        material.uniforms.map.value = map;
        material.uniforms.curve.value.copy(curve);
        material.uniforms.offset.value.copy(offset);
        material.uniforms.resolution.value.copy(resolution);
        material.uniforms.diffuse.value = inBuffer.texture;
        for (const [pass, multiplier] of [0.5, 1, 1, 1.5].entries()) {
          material.uniforms.blur.value = multiplier * blur;
          if (pass === 2) material.uniforms.resolution.value.copy(resolution);
          renderer.setRenderTarget(targets[index]);
          renderer.clear();
          renderer.render(scene, camera);
          if (pass === 0) scene.autoUpdate = false;
          material.uniforms.diffuse.value = targets[index].texture;
          if (pass < 3) index = 1 - index;
        }
        material.uniforms.resolution.value.set(width, height);
        renderer.setRenderTarget(writeBuffer);
        if (clear) renderer.clear();
        renderer.render(scene, camera);
      };
    },
  };
}
