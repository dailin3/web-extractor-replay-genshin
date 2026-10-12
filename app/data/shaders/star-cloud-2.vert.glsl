varying vec3 v_position;
uniform vec3 pointInfo;
void separation_94bf_main(vec3 arg1, out float x, out float y, out float z){
  x = arg1.x;
  y = arg1.y;
  z = arg1.z;
}
void separation_94bf_main(vec4 arg1, out float x, out float y, out float z, out float w){
  x = arg1.x;
  y = arg1.y;
  z = arg1.z;
  w = arg1.w;
}
void whiteNoise_a12a_main(vec3 seed, out float value, out vec3 vector){
  vector = vec3(fract(sin(vec2(
    dot(seed.xy, vec2(127.1, 311.7)),
    dot(seed.xy, vec2(269.5, 183.3))
  )) * 43758.5453) * 2. - 1., 0.);
  value = length(vector);
  // const float c = 43758.5453;
  // const mat3 coeffs = mat3(
  //   165.15, 253.34, 323.22,
  //   241.49, 329.07, 147.79,
  //   376.31, 143.45, 281.63
  // );
  // vec3 sn = mod(coeffs * seed, 6.283185307179586);
  // vector = fract(sin(sn) * c) * 2. - 1.;
  // value = length(vector);
}
void multiply_7b3e_main(float arg1, float arg2, out float value){
  value = arg1 * arg2;
}
void multiply_7b3e_main(vec2 arg1, vec2 arg2, out vec2 value){
  value = arg1 * arg2;
}
void multiply_7b3e_main(vec3 arg1, vec3 arg2, out vec3 value){
  value = arg1 * arg2;
}
void multiply_7b3e_main(mat4 arg1, mat4 arg2, out mat4 value){
  value = arg1 * arg2;
}
void multiply_7b3e_main(mat4 arg1, vec4 arg2, out vec4 value){
  value = arg1 * arg2;
}
void add_1ac2_main(float arg1, float arg2, out float value){
  value = arg1 + arg2;
}
void add_1ac2_main(vec2 arg1, vec2 arg2, out vec2 value){
  value = arg1 + arg2;
}
void add_1ac2_main(vec3 arg1, vec3 arg2, out vec3 value){
  value = arg1 + arg2;
}
void f_3To4_a8ca_main(vec3 arg1, float w, out vec4 value){
  value = vec4(arg1, w);
}
// = camera.matrixWorldInverse * object.matrixWorld
// = camera.projectionMatrix
void f_4To3_1e8a_main(vec4 arg1, out vec3 value){
  value = arg1.xyz;
}
void divide_87b8_main(float arg1, float arg2, out float value){
  value = arg1 / arg2;
}
void divide_87b8_main(vec2 arg1, vec2 arg2, out vec2 value){
  value = arg1 / arg2;
}
void divide_87b8_main(vec3 arg1, vec3 arg2, out vec3 value){
  value = arg1 / arg2;
}
void vec2_7948_main(float x, float y, out vec2 value){
  value = vec2(x, y);
}
uniform sampler2D vectorMap;
void texture_35bf_main(sampler2D arg1, vec2 coord, out vec4 rgba, out vec3 rgb, out float alpha){
  rgba = texture2D(arg1, coord);
  rgb = rgba.rgb;
  alpha = rgba.a;
}
void f_3To2_aa4a_main(vec3 arg1, out vec2 value){
  value = arg1.xy;
}
void subtract_12d_main(float arg1, float arg2, out float value){
  value = arg1 - arg2;
}
void subtract_12d_main(vec2 arg1, vec2 arg2, out vec2 value){
  value = arg1 - arg2;
}
uniform vec3 scale;
void normalize_298b_main(vec2 x, out vec2 value){
  value = normalize(x);
}
void f_2To3_968a_main(vec2 arg1, float z, out vec3 value){
  value = vec3(arg1, z);
}
uniform float time;
void sin_2a82_main(float arg1, out float value){
  value = sin(arg1);
}
void mix_6ab0_main(float x, float y, float a, out float value){
  value = mix(x, y, a);
}
void floor_334d_main(float arg1, out float value){
  value = floor(arg1);
}
void main() {
  v_position = position;
  float x_decc; float y_1e0d; float z_1f4d;
  separation_94bf_main(pointInfo, x_decc, y_1e0d, z_1f4d);
  float value_16d8; vec3 vector_cb33;
  whiteNoise_a12a_main(v_position, value_16d8, vector_cb33);
  vec3 value_1b88;
  multiply_7b3e_main(vector_cb33, vec3(y_1e0d), value_1b88);
  vec3 value_9740;
  add_1ac2_main(v_position, value_1b88, value_9740);
  vec3 value_e7d9;
  add_1ac2_main(vec3(0, 0, 0), value_9740, value_e7d9);
  vec4 value_6243;
  f_3To4_a8ca_main(value_e7d9, 1.0, value_6243);
  mat4 value_7bac;
  multiply_7b3e_main(projectionMatrix, modelViewMatrix, value_7bac);
  vec4 value_2777;
  multiply_7b3e_main(value_7bac, value_6243, value_2777);
  float x_e9c6; float y_2907; float z_2847; float w_ed86;
  separation_94bf_main(value_2777, x_e9c6, y_2907, z_2847, w_ed86);
  vec3 value_817f;
  f_4To3_1e8a_main(value_2777, value_817f);
  vec3 value_781a;
  divide_87b8_main(value_817f, vec3(w_ed86), value_781a);
  float x_e56c; float y_25ad; float z_24ed;
  separation_94bf_main(value_781a, x_e56c, y_25ad, z_24ed);
  vec2 value_ea25;
  vec2_7948_main(x_e56c, y_25ad, value_ea25);
  vec2 value_b8e0;
  add_1ac2_main(value_ea25, vec2(1, 1), value_b8e0);
  vec2 value_180f;
  divide_87b8_main(value_b8e0, vec2(2, 2), value_180f);
  vec4 rgba_6a48; vec3 rgb_88f8; float alpha_6c8a;
  texture_35bf_main(vectorMap, value_180f, rgba_6a48, rgb_88f8, alpha_6c8a);
  vec2 value_be6e;
  f_3To2_aa4a_main(rgb_88f8, value_be6e);
  vec2 value_8d13;
  subtract_12d_main(value_be6e, vec2(0.5, 0.5), value_8d13);
  vec2 value_a37;
  multiply_7b3e_main(value_8d13, vec2(2, 2), value_a37);
  float x_eca1; float y_2c60; float z_2d20;
  separation_94bf_main(scale, x_eca1, y_2c60, z_2d20);
  vec2 value_a8c1;
  vec2_7948_main(x_eca1, y_2c60, value_a8c1);
  vec2 value_5e90;
  normalize_298b_main(value_a8c1, value_5e90);
  vec2 value_1ca;
  multiply_7b3e_main(vec2(z_2d20), value_5e90, value_1ca);
  vec2 value_5499;
  divide_87b8_main(value_a37, value_1ca, value_5499);
  vec2 value_7ddb;
  add_1ac2_main(value_ea25, value_5499, value_7ddb);
  vec3 value_4a86;
  f_2To3_968a_main(value_7ddb, z_24ed, value_4a86);
  float value_33ee;
  multiply_7b3e_main(value_16d8, 1000.0, value_33ee);
  float value_5455;
  subtract_12d_main(time, value_33ee, value_5455);
  float value_ad98;
  multiply_7b3e_main(value_5455, 3.0, value_ad98);
  float value_6c0d;
  sin_2a82_main(value_ad98, value_6c0d);
  float value_a235;
  divide_87b8_main(value_6c0d, 2.0, value_a235);
  float value_f5f8;
  add_1ac2_main(value_a235, 0.5, value_f5f8);
  float value_6d98;
  multiply_7b3e_main(value_f5f8, value_16d8, value_6d98);
  float value_448;
  divide_87b8_main(x_decc, 5.0, value_448);
  float value_2cce;
  mix_6ab0_main(value_448, x_decc, value_6d98, value_2cce);
  float value_f7c6;
  divide_87b8_main(value_2cce, w_ed86, value_f7c6);
  float value_519e;
  multiply_7b3e_main(value_f7c6, 200.0, value_519e);
  float value_2c95;
  multiply_7b3e_main(value_519e, z_1f4d, value_2c95);
  float value_a756;
  floor_334d_main(value_2c95, value_a756);
  vec3 p_position_840b = value_4a86;
  float p_pointSize_435c = value_a756;
  // gl_Position = projectionMatrix * modelViewMatrix * vec4(p_position_840b, 1.0);
  gl_Position = vec4(p_position_840b, 1.0);
  // gl_PointSize = p_pointSize_435c / abs(gl_Position.w) * 200.0;
  gl_PointSize = p_pointSize_435c;
}
