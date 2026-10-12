attribute vec4 color;
varying vec2 vUv;
varying vec4 vColor;
uniform float opacity;
#ifdef TWO_COLOR
attribute vec4 color2;
varying vec4 vColor2;
#endif

#if USE_GRADIENT != 0
  varying vec3 vPosition;
#endif

void main() {
  vUv = uv;
  vColor = color;
  vColor.a *= opacity;
  #if USE_GRADIENT != 0
    vPosition = position;
  #endif
  #ifdef TWO_COLOR
    vColor2 = color2;
  #endif
  gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0);
}
