import { THREE } from '../engine/vendor/libraries.js';

const clean = (value) => (Math.abs(value) < 1e-10 ? 0 : value);

export function cameraMatrixCSS(matrix) {
  const values = matrix.elements.map((value, index) =>
    clean([1, 5, 9, 13].includes(index) ? -value : value),
  );
  return `matrix3d(${values.join(',')})`;
}

export function objectMatrixCSS(matrix) {
  const values = matrix.elements.map((value, index) =>
    clean(index >= 4 && index <= 7 ? -value : value),
  );
  return `translate(-50%,-50%)matrix3d(${values.join(',')})`;
}

class CSS3DObject extends THREE.Object3D {
  constructor(element = document.createElement('div')) {
    super();
    this.isCSS3DObject = true;
    this.element = element;
    element.style.position = 'absolute';
    element.style.pointerEvents = 'auto';
    this.addEventListener('removed', () => {
      this.traverse((object) => {
        if (object.element instanceof Element) object.element.remove();
      });
    });
  }

  copy(source, recursive) {
    super.copy(source, recursive);
    this.element = source.element.cloneNode(true);
    return this;
  }
}

/** Projects the authored hit areas through the same camera as the WebGL artwork. */
class CSS3DRenderer {
  constructor() {
    this.width = 0;
    this.height = 0;
    this.cameraCache = { fov: 0, style: '' };
    this.objectCache = new WeakMap();
    this.domElement = document.createElement('div');
    this.domElement.style.overflow = 'hidden';
    this.cameraElement = document.createElement('div');
    this.cameraElement.style.transformStyle = 'preserve-3d';
    this.cameraElement.style.pointerEvents = 'none';
    this.domElement.appendChild(this.cameraElement);
  }

  getSize() {
    return { width: this.width, height: this.height };
  }

  setSize(width, height) {
    this.width = width;
    this.height = height;
    for (const element of [this.domElement, this.cameraElement]) {
      element.style.width = `${width}px`;
      element.style.height = `${height}px`;
    }
  }

  render(scene, camera) {
    const halfHeight = this.height / 2;
    const focalLength = camera.projectionMatrix.elements[5] * halfHeight;
    if (this.cameraCache.fov !== focalLength) {
      this.domElement.style.perspective = camera.isPerspectiveCamera
        ? `${focalLength}px`
        : '';
      this.cameraCache.fov = focalLength;
    }
    const cameraTransform = camera.isOrthographicCamera
      ? `scale(${focalLength})translate(${clean(-(camera.right + camera.left) / 2)}px,${clean((camera.top + camera.bottom) / 2)}px)${cameraMatrixCSS(camera.matrixWorldInverse)}`
      : `translateZ(${focalLength}px)${cameraMatrixCSS(camera.matrixWorldInverse)}`;
    const style = `${cameraTransform}translate(${this.width / 2}px,${halfHeight}px)`;
    if (style !== this.cameraCache.style) {
      this.cameraElement.style.transform = style;
      this.cameraCache.style = style;
    }
    const renderObject = (object) => {
      if (object.visible === false) return;
      if (object.isCSS3DObject) {
        const transform = objectMatrixCSS(object.matrixWorld);
        if (this.objectCache.get(object) !== transform) {
          object.element.style.transform = transform;
          this.objectCache.set(object, transform);
        }
        object.element.style.display = object.visible ? '' : 'none';
        if (object.element.parentNode !== this.cameraElement)
          this.cameraElement.appendChild(object.element);
      }
      object.children.forEach(renderObject);
    };
    if (scene.css3dObjects) scene.css3dObjects.forEach(renderObject);
    else renderObject(scene);
  }
}

const CSS3D_STYLES = `
#css3d-renderer{position:absolute;overflow:hidden;left:50%;top:50%;transform:translate(-50%,-50%)}
#css3d-renderer>*{position:absolute}
.css3d-object{position:absolute;top:0;left:0}
.css3d-ui{position:absolute;top:0;left:0;width:var(--width);height:var(--height);pointer-events:none!important;transform-origin:0 0;transform:scale(var(--scale))}
.css3d-ui>.css3d-scene{position:absolute;top:calc((var(--height) - var(--design-height))/2);left:calc((var(--width) - var(--design-width))/2);width:var(--design-width);height:var(--design-height);pointer-events:none!important}
.css3d-object[data-pointer-events="none"],.css3d-ui[data-pointer-events="none"]>*{pointer-events:none}
.css3d-object[data-pointer-events="auto"],.css3d-ui[data-pointer-events="auto"]>*{pointer-events:auto}
`;

/** frame describes CSS layout dimensions, independently of the renderer's DPR. */
export function createCSS3DModifier({
  getFrame = () => ({
    width: innerWidth,
    height: innerHeight,
    rem: parseFloat(getComputedStyle(document.documentElement).fontSize),
    canvasWidth: innerWidth,
  }),
} = {}) {
  const domScale = new THREE.Vector3(1, 1, 1);

  return function attachCSS3D(
    config,
    player,
    { id = '', renderPath = '' } = {},
  ) {
    const source = this;
    const scene = source.scene || source;
    scene.css3dObjects ||= new Set();
    const uiScene = player.getScene('scene_ui');
    if (!player.CSS3DRenderer) {
      player.CSS3DRenderer = new CSS3DRenderer();
      player.CSS3DRenderer.domElement.id = 'css3d-renderer';
      const parent =
        document.querySelector('#css3d-container') ||
        player.renderer.domElement.parentNode;
      parent.appendChild(player.CSS3DRenderer.domElement);
      const style = document.createElement('style');
      style.textContent = CSS3D_STYLES;
      player.CSS3DRenderer.domElement.prepend(style);
    }
    const renderer = player.CSS3DRenderer;
    const element = document.createElement('div');
    element.classList.add(
      source.scene ? 'css3d-object' : 'css3d-ui',
      source.name,
    );
    element.id = id || `css3d-object-${source.uuid}`;
    if (!source.scene) {
      const designFrame = document.createElement('div');
      designFrame.classList.add('css3d-scene');
      element.appendChild(designFrame);
    }
    const object = new CSS3DObject(element);
    object.scene = scene;
    object.addEventListener('removed', () => scene.css3dObjects.delete(object));
    Object.defineProperty(object, 'scale', { get: () => domScale });
    element.style.cssText = '';

    if (!scene.renderCSS3D) {
      renderer.domElement.style.setProperty(
        '--design-width',
        `${uiScene.sceneConfig.uiWidth / 100}rem`,
      );
      renderer.domElement.style.setProperty(
        '--design-height',
        `${uiScene.sceneConfig.uiHeight / 100}rem`,
      );
      scene.renderCSS3D = () => {
        const frame = getFrame();
        if (!frame) return;
        const size = renderer.getSize();
        if (size.width !== frame.width || size.height !== frame.height) {
          renderer.setSize(frame.width, frame.height);
          const ratio = Math.min(
            uiScene.sceneConfig.uiWidth / player.domElement.width,
            uiScene.sceneConfig.uiHeight / player.domElement.height,
          );
          const width = ratio * player.domElement.width;
          const height = ratio * player.domElement.height;
          renderer.domElement.style.setProperty('--scale', 1);
          const scale = 100 / frame.rem;
          domScale.set(scale, scale, scale);
          renderer.domElement.style.setProperty('--width', `${width / 100}rem`);
          renderer.domElement.style.setProperty(
            '--height',
            `${height / 100}rem`,
          );
        }
        renderer.render(scene, scene.camera);
      };
      scene.addEventListener('afterRender', scene.renderCSS3D);
    }
    object.name = source.name;
    object.__visible = object.visible;
    Object.defineProperty(object, 'visible', {
      get() {
        return this.__visible;
      },
      set(visible) {
        if (visible === this.__visible) return;
        this.__visible = visible;
        Promise.resolve().then(() => {
          element.style.display = this.__visible ? '' : 'none';
        });
      },
    });

    if (source.scene) {
      const previousMatrix = new THREE.Matrix4();
      const position = new THREE.Vector3();
      const rotation = new THREE.Quaternion();
      const scale = new THREE.Vector3();
      object.addEventListener('tick', () => {
        if (previousMatrix.equals(source.matrixWorld)) return;
        previousMatrix.copy(source.matrixWorld);
        previousMatrix.decompose(position, rotation, scale);
        element.style.setProperty('--scale', 1 / scale.length());
        element.style.setProperty(
          '--scale-max',
          1 / Math.min(scale.x, scale.y, scale.z),
        );
        element.style.setProperty(
          '--scale-min',
          1 / Math.max(scale.x, scale.y, scale.z),
        );
        for (const axis of ['x', 'y', 'z'])
          element.style.setProperty(`--scale-${axis}`, 1 / scale[axis]);
      });
      source.add(object);
      scene.css3dObjects.add(object);
    } else {
      renderer.domElement.appendChild(element);
    }

    const layers = [];
    if (renderPath) {
      const path = renderPath.split('/');
      if (path[0] === 'scene_ui') path.shift();
      let parent = uiScene;
      for (const name of path) {
        const targetScene = player.getScene(name);
        let layer;
        if (targetScene)
          parent.traverse((node) => {
            if (
              node.name === name &&
              node.isMesh &&
              node.material?.uniforms?.diffuse?.value ===
                targetScene.buffer.texture
            )
              layer = node;
          });
        if (!layer) break;
        layers.push(layer);
        parent = targetScene;
      }
    } else {
      let layer;
      uiScene.traverse((node) => {
        if (
          scene.buffer &&
          node.isMesh &&
          node.material?.uniforms?.diffuse?.value === scene.buffer.texture
        )
          layer = node;
      });
      if (layer) layers.push(layer);
    }

    uiScene.addEventListener('tick', () => {
      const matrix = source.matrixWorld.elements;
      const scaleX2 = matrix[0] ** 2 + matrix[1] ** 2 + matrix[2] ** 2;
      const scaleY2 = matrix[4] ** 2 + matrix[5] ** 2 + matrix[6] ** 2;
      const scale = Math.sqrt(Math.min(scaleX2, scaleY2));
      let opacity = 1;
      let visible = scale > 0.01;
      for (const layer of layers) {
        opacity *= layer.material.uniforms.opacity.value;
        if (opacity < 0.1 || !layer.visible) {
          visible = false;
          break;
        }
      }
      let materialOpacity;
      for (
        let ancestor = source;
        ancestor && visible;
        ancestor = ancestor.parent
      ) {
        if (!ancestor.visible) {
          visible = false;
          break;
        }
        if (
          !materialOpacity &&
          (ancestor.isMesh || ancestor.isSpine) &&
          ancestor.material?.uniforms?.opacity
        ) {
          materialOpacity = ancestor.material.uniforms.opacity;
          opacity = Math.min(materialOpacity.value, opacity);
          if (opacity < 0.1) {
            visible = false;
            break;
          }
        }
      }
      element.style.opacity = opacity;
      element.dataset.pointerEvents =
        opacity > 0.5 && scale > 0.25 ? 'auto' : 'none';
      object.visible = visible;
    });

    const geometry =
      source.geometry || (source.isSpine ? source.children[0].geometry : null);
    if (geometry) {
      geometry.boundingBox ||=
        (geometry.computeBoundingBox(), geometry.boundingBox);
      const { min, max } = geometry.boundingBox;
      element.style.width = `${(max.x - min.x) / 100}rem`;
      element.style.height = `${(max.y - min.y) / 100}rem`;
      object.position.set(
        (max.x + min.x) / 2,
        (max.y + min.y) / 2,
        (max.z + min.z) / 2,
      );
    }
  };
}
