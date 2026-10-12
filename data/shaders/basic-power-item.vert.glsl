#define SHADER_VERTEX
varying vec2 v_uv;
void main() {
  v_uv = uv;
  vec3 p_position_3436 = position;
  float p_pointSize_922d = 10.0;
  bool sizeAttenuation_d2c5 = true;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p_position_3436, 1.0);
  gl_PointSize = p_pointSize_922d;
  if(sizeAttenuation_d2c5){
    gl_PointSize *= 200.0 / abs(gl_Position.w);
  }
}
