varying vec2 vUv;
void main() {
  vUv = uv;
  #if USE_SPRITE == 1
  	gl_Position = vec4(2.*(uv - .5),0.,1.0);
  #else
  	gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0);
  #endif
}
