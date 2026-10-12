#define SHADER_FRAGMENT
varying vec2 v_uv;
uniform sampler2D diffuse;
void texture_35bf_main(sampler2D arg1, vec2 coord, out vec4 rgba, out vec3 rgb, out float alpha){
  rgba = texture2D(arg1, coord);
  rgb = rgba.rgb;
  alpha = rgba.a;
}
void pow_f867_main(float arg1, float arg2, out float value){
  value = pow(arg1, arg2);
}
void pow_f867_main(vec3 arg1, vec3 arg2, out vec3 value){
  value = pow(arg1, arg2);
}
uniform vec3 direct_speed;
void separation_94bf_main(vec3 arg1, out float x, out float y, out float z){
  x = arg1.x;
  y = arg1.y;
  z = arg1.z;
}
uniform float time;
void multiply_7b3e_main(float arg1, float arg2, out float value){
  value = arg1 * arg2;
}
void multiply_7b3e_main(vec2 arg1, vec2 arg2, out vec2 value){
  value = arg1 * arg2;
}
void multiply_7b3e_main(vec3 arg1, vec3 arg2, out vec3 value){
  value = arg1 * arg2;
}
void f_3To2_aa4a_main(vec3 arg1, out vec2 value){
  value = arg1.xy;
}
void divide_87b8_main(vec2 arg1, vec2 arg2, out vec2 value){
  value = arg1 / arg2;
}
void divide_87b8_main(vec3 arg1, vec3 arg2, out vec3 value){
  value = arg1 / arg2;
}
void add_1ac2_main(vec2 arg1, vec2 arg2, out vec2 value){
  value = arg1 + arg2;
}
void add_1ac2_main(vec3 arg1, vec3 arg2, out vec3 value){
  value = arg1 + arg2;
}
uniform sampler2D noise;
uniform sampler2D star1;
uniform sampler2D light;
void sin_2a82_main(vec3 arg1, out vec3 value){
  value = sin(arg1);
}
uniform float strength;
uniform sampler2D star2;
void max_aab7_main(vec3 arg1, vec3 arg2, out vec3 value){
  value = max(arg1, arg2);
}
uniform float opacity;
void vec3_b989_main(float x, float y, float z, out vec3 value){
  value = vec3(x, y, z);
}
void min_a431_main(vec3 arg1, float arg2, out vec3 value){
  value = min(arg1, arg2);
}
void main() {
  vec4 rgba_12d4; vec3 rgb_1458; float alpha_5f2;
  texture_35bf_main(diffuse, v_uv, rgba_12d4, rgb_1458, alpha_5f2);
  float value_eebc;
  pow_f867_main(alpha_5f2, 5.0, value_eebc);
  float x_630f; float y_a3ce; float z_a28e;
  separation_94bf_main(direct_speed, x_630f, y_a3ce, z_a28e);
  vec2 value_be42;
  multiply_7b3e_main(vec2(time), vec2(z_a28e), value_be42);
  vec2 value_31de;
  f_3To2_aa4a_main(direct_speed, value_31de);
  vec2 value_2dc5;
  multiply_7b3e_main(value_31de, value_be42, value_2dc5);
  vec2 value_daaa;
  divide_87b8_main(value_2dc5, vec2(10, 10), value_daaa);
  vec2 value_4aa4;
  add_1ac2_main(v_uv, value_daaa, value_4aa4);
  vec2 value_9423;
  multiply_7b3e_main(value_4aa4, vec2(4, 4), value_9423);
  vec4 rgba_1260; vec3 rgb_a058; float alpha_72f2;
  texture_35bf_main(noise, value_9423, rgba_1260, rgb_a058, alpha_72f2);
  float x_f689; float y_3648; float z_3708;
  separation_94bf_main(rgb_a058, x_f689, y_3648, z_3708);
  vec2 value_a606;
  multiply_7b3e_main(v_uv, vec2(2, 2), value_a606);
  vec2 value_c55f;
  divide_87b8_main(value_2dc5, vec2(50, 50), value_c55f);
  vec2 value_b66d;
  divide_87b8_main(value_c55f, vec2(3, 3), value_b66d);
  vec2 value_78af;
  add_1ac2_main(value_b66d, value_a606, value_78af);
  vec4 rgba_731; vec3 rgb_b16b; float alpha_8e26;
  texture_35bf_main(star1, value_78af, rgba_731, rgb_b16b, alpha_8e26);
  vec3 value_2f68;
  multiply_7b3e_main(rgb_b16b, vec3(y_3648), value_2f68);
  vec2 value_af1;
  multiply_7b3e_main(value_daaa, vec2(6, 0), value_af1);
  vec2 value_4cbd;
  add_1ac2_main(value_af1, v_uv, value_4cbd);
  vec2 value_6308;
  divide_87b8_main(value_4cbd, vec2(3, 3), value_6308);
  vec4 rgba_de89; vec3 rgb_4848; float alpha_fcff;
  texture_35bf_main(noise, value_6308, rgba_de89, rgb_4848, alpha_fcff);
  float x_cc2a; float y_ceb; float z_dab;
  separation_94bf_main(rgb_4848, x_cc2a, y_ceb, z_dab);
  vec3 value_6929;
  multiply_7b3e_main(vec3(z_a28e), vec3(time), value_6929);
  vec4 rgba_704e; vec3 rgb_cedf; float alpha_6e10;
  texture_35bf_main(light, v_uv, rgba_704e, rgb_cedf, alpha_6e10);
  vec3 value_f6e7;
  add_1ac2_main(rgb_cedf, value_6929, value_f6e7);
  vec3 value_a330;
  sin_2a82_main(value_f6e7, value_a330);
  vec3 value_96a8;
  pow_f867_main(value_a330, vec3(4, 4, 4), value_96a8);
  vec3 value_50a9;
  add_1ac2_main(value_96a8, vec3(1, 1, 1), value_50a9);
  vec3 value_2d01;
  divide_87b8_main(value_50a9, vec3(2, 2, 2), value_2d01);
  vec3 value_f80b;
  multiply_7b3e_main(vec3(z_dab), value_2d01, value_f80b);
  vec3 value_1ff1;
  multiply_7b3e_main(value_f80b, vec3(strength), value_1ff1);
  vec3 value_733a;
  multiply_7b3e_main(value_1ff1, rgb_1458, value_733a);
  vec2 value_33d2;
  add_1ac2_main(value_c55f, value_a606, value_33d2);
  vec4 rgba_e943; vec3 rgb_c203; float alpha_ab48;
  texture_35bf_main(star2, value_33d2, rgba_e943, rgb_c203, alpha_ab48);
  vec3 value_30ae;
  multiply_7b3e_main(vec3(x_f689), rgb_c203, value_30ae);
  vec3 value_edb3;
  add_1ac2_main(value_733a, value_30ae, value_edb3);
  vec3 value_c26b;
  add_1ac2_main(value_edb3, value_2f68, value_c26b);
  vec3 value_9b13;
  multiply_7b3e_main(value_c26b, vec3(value_eebc), value_9b13);
  vec3 value_e44b;
  max_aab7_main(value_9b13, rgb_1458, value_e44b);
  float value_a84c;
  pow_f867_main(alpha_5f2, 0.75, value_a84c);
  float value_3e0;
  multiply_7b3e_main(value_a84c, opacity, value_3e0);
  vec3 value_fa6c;
  vec3_b989_main(value_3e0, value_3e0, value_3e0, value_fa6c);
  vec3 value_9af7;
  min_a431_main(value_fa6c, 1.0, value_9af7);
  vec3 value_3670;
  multiply_7b3e_main(value_e44b, value_9af7, value_3670);
  #ifdef USE_SHADER_NODE_DEBUG
    gl_FragColor = vec4(value_3670, 1.0);
    return;
  #endif
  vec3 color_6be5 = value_3670;
  float alpha_d41e = value_3e0;
  bool p_discard_c53f = false;
  if(p_discard_c53f) discard;
  gl_FragColor = vec4(color_6be5, alpha_d41e);
}