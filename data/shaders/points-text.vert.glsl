varying vec3 v_position;
varying vec2 v_uv;
void whiteNoise_a12a_main(float seed, out float value){
  value = fract(sin((seed + 12.9898) * 78.233) * 43758.5453);
}
void whiteNoise_a12a_main(vec3 seed, out float value, out vec3 vector){
  const float c = 43758.5453;
  const mat3 coeffs = mat3(
    165.15, 253.34, 323.22,
    241.49, 329.07, 147.79,
    376.31, 143.45, 281.63
  );
  vec3 sn = mod(coeffs * seed, 6.283185307179586);
  vector = -1.0 + 2.0 * fract(sin(sn) * c);
  value = length(vector);
}
void multiply_7b3e_main(float arg1, float arg2, out float value){
  value = arg1 * arg2;
}
void multiply_7b3e_main(vec3 arg1, vec3 arg2, out vec3 value){
  value = arg1 * arg2;
}
uniform float time;
void sin_2a82_main(float arg1, out float value){
  value = sin(arg1);
}
void add_1ac2_main(float arg1, float arg2, out float value){
  value = arg1 + arg2;
}
void add_1ac2_main(vec3 arg1, vec3 arg2, out vec3 value){
  value = arg1 + arg2;
}
void divide_87b8_main(float arg1, float arg2, out float value){
  value = arg1 / arg2;
}
void divide_87b8_main(vec3 arg1, vec3 arg2, out vec3 value){
  value = arg1 / arg2;
}
uniform vec2 pointInfo;
void separation_94bf_main(vec2 arg1, out float x, out float y){
  x = arg1.x;
  y = arg1.y;
}
void separation_94bf_main(vec3 arg1, out float x, out float y, out float z){
  x = arg1.x;
  y = arg1.y;
  z = arg1.z;
}
void mix_6ab0_main(float x, float y, float a, out float value){
  value = mix(x, y, a);
}
void mix_6ab0_main(vec3 x, vec3 y, float a, out vec3 value){
  value = mix(x, y, a);
}
uniform float progress;
varying float v_noise;
void pointInfo_be00_main(float noise, float progress, out float pointProgress, out float lifeTime, out float startTime){
  pointProgress = progress;
  lifeTime = 1.;
  startTime = 0.;
  return;
  #ifdef FRAGMENT_SHADER
    float noise2 = v_noise * 2.;
  #else
    float noise2 = noise * 2.;
  #endif
  float lifeTimeFactor = min(1., noise2);
  float startTimeFactor = max(0., noise2 - 1.);
  startTime = mix(0., 0.5, startTimeFactor);
  float totalTime = 1. - startTime;
  lifeTime = mix(totalTime / 2., totalTime, lifeTimeFactor);

  pointProgress = min(1.,max(0., progress-startTime) / lifeTime);
}
void cos_4640_main(float arg1, out float value){
  value = cos(arg1);
}
void vec3_b989_main(float x, float y, float z, out vec3 value){
  value = vec3(x, y, z);
}
uniform vec3 scale;
void main() {
  v_position = position;
  v_uv = uv;
  float value_79a0; vec3 vector_e95c;
  whiteNoise_a12a_main(v_position, value_79a0, vector_e95c);
  float value_3ecc;
  multiply_7b3e_main(value_79a0, 50000.0, value_3ecc);
  float value_35b9;
  whiteNoise_a12a_main(value_3ecc, value_35b9);
  float value_a6cf;
  multiply_7b3e_main(time, value_35b9, value_a6cf);
  float value_deb9;
  multiply_7b3e_main(value_a6cf, 10.0, value_deb9);
  float value_413b;
  sin_2a82_main(value_deb9, value_413b);
  float value_3a22;
  add_1ac2_main(value_413b, 1.0, value_3a22);
  float value_f600;
  divide_87b8_main(value_3a22, 2.0, value_f600);
  float value_479a;
  multiply_7b3e_main(value_79a0, 10000.0, value_479a);
  float value_b0c9;
  whiteNoise_a12a_main(value_479a, value_b0c9);
  float x_69bc; float y_a97d;
  separation_94bf_main(pointInfo, x_69bc, y_a97d);
  float value_ebd;
  divide_87b8_main(x_69bc, 5.0, value_ebd);
  float value_3abf;
  mix_6ab0_main(value_ebd, x_69bc, value_b0c9, value_3abf);
  float value_2280;
  multiply_7b3e_main(value_3abf, value_f600, value_2280);
  float pointProgress_adef; float lifeTime_6282; float startTime_62d1;
  pointInfo_be00_main(value_79a0, progress, pointProgress_adef, lifeTime_6282, startTime_62d1);
  vec3 value_9235;
  multiply_7b3e_main(vec3(value_35b9), vec3(5, 5, 5), value_9235);
  float value_583b;
  multiply_7b3e_main(value_79a0, 2.0, value_583b);
  float value_e71f;
  add_1ac2_main(startTime_62d1, pointProgress_adef, value_e71f);
  float value_59e4;
  multiply_7b3e_main(value_e71f, value_583b, value_59e4);
  float value_87d;
  add_1ac2_main(progress, value_59e4, value_87d);
  float value_42f3;
  multiply_7b3e_main(value_87d, 0.1, value_42f3);
  float value_dcb;
  cos_4640_main(value_42f3, value_dcb);
  float value_9107;
  sin_2a82_main(value_42f3, value_9107);
  vec3 value_aa52;
  vec3_b989_main(value_9107, value_dcb, 0.0, value_aa52);
  vec3 value_ce33;
  multiply_7b3e_main(value_aa52, value_9235, value_ce33);
  float x_b446; float y_7487; float z_75c7;
  separation_94bf_main(scale, x_b446, y_7487, z_75c7);
  float value_ee24;
  multiply_7b3e_main(y_7487, z_75c7, value_ee24);
  float value_9060;
  multiply_7b3e_main(x_b446, z_75c7, value_9060);
  vec3 value_a81e;
  vec3_b989_main(value_9060, value_ee24, z_75c7, value_a81e);
  vec3 value_85e1;
  multiply_7b3e_main(value_ce33, value_a81e, value_85e1);
  vec3 value_a3f7;
  divide_87b8_main(value_85e1, vec3(10, 10, 10), value_a3f7);
  vec3 value_d2ae;
  multiply_7b3e_main(vector_e95c, value_a81e, value_d2ae);
  vec3 value_7248;
  add_1ac2_main(value_a3f7, value_d2ae, value_7248);
  vec3 value_d018;
  mix_6ab0_main(value_7248, vec3(0, 0, 0), pointProgress_adef, value_d018);
  float value_6b13;
  multiply_7b3e_main(y_a97d, y_7487, value_6b13);
  float value_7025;
  multiply_7b3e_main(y_a97d, x_b446, value_7025);
  vec3 value_2682;
  vec3_b989_main(value_7025, value_6b13, y_a97d, value_2682);
  vec3 value_ec7f;
  multiply_7b3e_main(vector_e95c, value_2682, value_ec7f);
  vec3 value_df33;
  add_1ac2_main(v_position, value_ec7f, value_df33);
  vec3 value_f702;
  add_1ac2_main(value_df33, value_d018, value_f702);
  vec3 p_position_840b = value_f702;
  float p_pointSize_435c = value_2280;
  float p_noise_e182 = value_79a0;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p_position_840b, 1.0);
  // gl_PointSize = p_pointSize_435c / abs(gl_Position.w) * 200.0;
  gl_PointSize = p_pointSize_435c;
  v_noise = p_noise_e182;
}
