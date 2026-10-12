
  uniform sampler2D diffuse;
  uniform float opacity;

  varying vec2 vUv;
  varying float vOpacity;

  void main() {
    vec4 color = texture2D(diffuse, vUv);
    color.a *= vOpacity * opacity;
    gl_FragColor = color;
  }
