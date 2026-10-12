import { THREE } from './vendor/libraries.js';
import richText from './renderer/rich-text.js';

/** First-stage custom geometry plugins, with translation/device inputs explicit. */
export function createPlugins({
  translate = (key) => key,
  getLanguage = () => 'zh-cn',
  isMobile = false,
} = {}) {
  return {
    BEZIER_PARTICLE(
      config,
      material,
      { count = 100, isEquality = false, shape = '' },
    ) {
      const source = shape
        ? this.getGeometry(shape)
        : new THREE.PlaneBufferGeometry(1, 1);
      const geometry = new THREE.InstancedBufferGeometry().copy(source);
      const positions = new Float32Array(count);
      const identifiers = new Float32Array(count);
      for (let index = 0; index < count; index++) {
        positions[index] = isEquality ? index / count : Math.random();
        identifiers[index] = Math.random();
      }
      geometry.setAttribute(
        'posFract',
        new THREE.InstancedBufferAttribute(positions, 1, false),
      );
      geometry.setAttribute(
        'id',
        new THREE.InstancedBufferAttribute(identifiers, 1, false),
      );
      if (material.defines.LOOP_COUNT > 0)
        material.uniforms.startTime = { value: Math.random() };
      return new THREE.Mesh(geometry, material);
    },

    Points(
      config,
      material,
      {
        mi18nID = '',
        fontSize = 36,
        color = 0xffffff,
        lineHeight = 1.5,
        maxWidth = 1500,
        textAlign = 'center',
      },
    ) {
      const geometry = this.createGeometry(config.geometry);
      if (geometry.boundingBox === null) geometry.computeBoundingBox();
      if (textAlign === 'left' || textAlign === 'right') {
        const edge =
          textAlign === 'left'
            ? geometry.boundingBox.min.x
            : geometry.boundingBox.max.x;
        geometry.translate(-edge, 0, 0);
        geometry.computeBoundingBox();
      }
      const sourceWidth =
        geometry.boundingBox.max.x - geometry.boundingBox.min.x;
      const sourceHeight =
        geometry.boundingBox.max.y - geometry.boundingBox.min.y;
      const translated = mi18nID ? translate(mi18nID) : '';
      const points = new THREE.Points(geometry, material);
      const backingMaterial = this.shaderSetting.BASIC.clone();
      backingMaterial.uniforms = {
        ...backingMaterial.uniforms,
        opacity: { value: 0.5 },
      };
      Object.defineProperty(backingMaterial.uniforms.opacity, 'value', {
        get: () => Math.max(0, 10 * (material.uniforms.progress.value - 0.9)),
      });
      backingMaterial.defines = { ...backingMaterial.defines, USE_TEXTURE: 1 };
      for (const property of ['transparent', 'depthTest', 'depthWrite', 'side'])
        backingMaterial[property] = material[property];
      const backing = new THREE.Mesh(
        new THREE.PlaneGeometry(sourceWidth, sourceHeight),
        backingMaterial,
      );
      if (textAlign === 'left' || textAlign === 'right') {
        backing.geometry.translate(
          ((textAlign === 'left' ? 1 : -1) * sourceWidth) / 2,
          0,
          0,
        );
        backing.geometry.computeBoundingBox();
      }
      points.add(backing);

      const container = new THREE.Object3D();
      if (isMobile && !translated) container.scale.set(1 / 0.7, 1 / 0.7, 1);
      container.updateMatrix();
      for (const property of ['renderOrder', 'frustumCulled']) {
        Object.defineProperty(container, property, {
          get: () => points[property],
          set(value) {
            points[property] = value;
            backing[property] = value;
          },
        });
      }
      Object.defineProperty(container, 'material', { get: () => material });
      container.add(points);
      const originalPointInfo = material.uniforms.pointInfo.value.clone();
      let previousText = '';

      container.setText = ({
        text = '',
        _fontSize = fontSize,
        _color = color,
        _lineHeight = lineHeight,
      }) => {
        if (previousText === text) return;
        previousText = text;
        const languageScale = isMobile ? 1 : 0.7;
        const style = {
          ...richText.defaultStyle,
          x: 0,
          y: (getLanguage() === 'zh-cn' ? -7 : 0) * languageScale,
          text,
          width: maxWidth,
          height: 1080,
          fontSize: _fontSize * languageScale,
          fontWeight: 'normal',
          fontStyle: 'normal',
          textAlign,
          lineSpacing: (_lineHeight - 1) * _fontSize,
          spaceWidth: 5,
          strokeWidth: 0,
          fontFamily: 'fontLink',
          align: 'top',
          strokeColor: new THREE.Color(0).getStyle(),
          color: new THREE.Color(_color).getStyle(),
        };
        const block = richText.parseBlocks(text, style);
        const { width, height } = block;
        style.width = width;
        style.height = height;
        let texture;
        if (
          points.material.uniforms.diffuse.value.image instanceof
          HTMLCanvasElement
        ) {
          texture = points.material.uniforms.diffuse.value;
          texture.image.width = width;
          texture.image.height = height;
          texture.drawStyle = style;
          texture.drawStyle.width = width - 2 * style.x;
          texture.drawOffset = { x: style.x, y: style.y, z: style.align };
          richText.updateTextTexture(texture, text);
        } else {
          texture = richText.createTextTexture(style).texture;
        }
        const context = texture.image.getContext('2d');
        context.save();
        context.globalCompositeOperation = 'source-atop';
        const gradient = context.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, 'rgba(0,0,0,0)');
        gradient.addColorStop(0.5, 'rgba(0,0,0,0.1)');
        gradient.addColorStop(1, 'rgba(0,0,0,0.3)');
        context.fillStyle = gradient;
        context.fillRect(0, 0, width, height);
        context.restore();
        points.material.uniforms.diffuse = { value: texture };
        backingMaterial.uniforms.diffuse = points.material.uniforms.diffuse;

        Promise.resolve().then(() => {
          points.scale.set(width / sourceWidth, height / sourceHeight, 1);
          material.uniforms.pointInfo.value.x =
            originalPointInfo.x * (isMobile ? 1 : 1.5);
          material.uniforms.scale.value.x =
            (1 / points.scale.x) * (isMobile ? 1.2 : 1);
          material.uniforms.scale.value.y =
            (1 / points.scale.y) * (isMobile ? 1.2 : 1);
          points.updateMatrix();
          const left = container.getObjectByName('arrow_left');
          const right = container.getObjectByName('arrow_right');
          for (const [arrow, direction] of [
            [left, -1],
            [right, 1],
          ]) {
            if (!arrow) continue;
            arrow.material.uniforms.opacity = material.uniforms.progress;
            arrow.position.x = direction * (width / 2 + (isMobile ? 100 : 50));
            arrow.scale.x = -direction * (isMobile ? 1 : 0.5);
            arrow.scale.y = Math.abs(arrow.scale.x);
            arrow.scale.z = Math.abs(arrow.scale.x);
            arrow.updateMatrix();
          }
        });
      };

      let previousTranslation = '';
      container.setTextForI18n = (key) => {
        points.onBeforeRender = () => {
          const text = translate(key);
          if (previousTranslation === text) return;
          previousTranslation = text;
          container.setText({ text, fontSize, color, lineHeight });
        };
        points.onBeforeRender();
      };
      if (translated) container.setTextForI18n(mi18nID);
      else backingMaterial.uniforms.diffuse = points.material.uniforms.diffuse;
      return container;
    },

    dofBlurDisplay(config, material) {
      const player = this;
      const mesh = new THREE.Mesh(
        this.createGeometry(config.geometry),
        material,
      );
      const buffer = this.getBuffer('dofBlurContainer');
      const blurScene = new THREE.Scene();
      material.uniforms.diffuse = { value: buffer.texture };
      material.uniforms.resolution = { value: new THREE.Vector2() };
      const resolution = material.uniforms.resolution.value;
      let detached = false;
      mesh.onTick = function () {
        if (!detached && this.scene.autoUpdate) {
          while (this.children.length) blurScene.add(this.children[0]);
          detached = true;
        }
        this.onTick = null;
      };
      mesh.onBeforeRender = function (renderer, scene, camera) {
        const previousTarget = renderer.getRenderTarget();
        if (previousTarget)
          resolution.set(previousTarget.width, previousTarget.height);
        else renderer.getSize(resolution);
        if (buffer.width !== resolution.x || buffer.height !== resolution.y)
          buffer.setSize(resolution.x, resolution.y);
        this.matrixWorld.decompose(
          blurScene.position,
          blurScene.quaternion,
          blurScene.scale,
        );
        renderer.setRenderTarget(buffer);
        renderer.clear();
        renderer.render(blurScene, camera);
        const designWidth = (this.scene.sceneConfig || {}).uiWidth || 2500;
        const blur =
          (material.uniforms.blur.value / designWidth) * resolution.x;
        if (blur > 0)
          player.renderScene('effect_dofBlur', true, {
            angle: material.uniforms.angle.value,
            map: material.uniforms.map.value,
            offset: material.uniforms.offset.value,
            curve: material.uniforms.curve.value,
            blur,
            inBuffer: buffer,
            writeBuffer: buffer,
            target: this,
            camera: this.scene.camera,
          });
        renderer.setRenderTarget(previousTarget);
      };
      for (const method of ['add', 'attach', 'remove']) {
        const original = mesh[method];
        mesh[method] = function (object) {
          if (detached) {
            blurScene[method === 'attach' ? 'add' : method](object);
            return this;
          }
          return original.call(this, object);
        };
      }
      const find = mesh.getObjectByProperty;
      mesh.getObjectByProperty = function (property, value) {
        if (!detached) return find.call(this, property, value);
        return this[property] === value
          ? this
          : blurScene.getObjectByProperty(property, value);
      };
      return mesh;
    },

    star(config, material) {
      return new THREE.Points(this.createGeometry(config.geometry), material);
    },

    star_circle(
      config,
      material,
      { radius = 100, segments = 36, thetaStart = 0, thetaLength = 1 },
    ) {
      return new THREE.Points(
        new THREE.CircleGeometry(
          radius,
          segments,
          thetaStart * Math.PI * 2,
          thetaLength * Math.PI * 2,
        ),
        material,
      );
    },
  };
}
