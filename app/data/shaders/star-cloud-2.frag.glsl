varying vec3 v_position;
uniform vec2 resolution;
void fragCoord_e737_main(vec2 p_resolution, out vec2 xy, out vec3 xyz, out vec4 xyzw){
    xyzw = gl_FragCoord.xyzw;
    xyzw.xy /= p_resolution;
    xy = xyzw.xy;
    xyz = xyzw.xyz;
}
uniform sampler2D tint;
void texture_35bf_main(sampler2D arg1, vec2 coord, out vec4 rgba, out vec3 rgb, out float alpha){
  rgba = texture2D(arg1, coord);
  rgb = rgba.rgb;
  alpha = rgba.a;
}
void pointCoord_a640_main(out vec2 xy){
    xy = gl_PointCoord;
}
uniform sampler2D diffuse;
void multiply_7b3e_main(float arg1, float arg2, out float value){
  value = arg1 * arg2;
}
void multiply_7b3e_main(vec3 arg1, vec3 arg2, out vec3 value){
  value = arg1 * arg2;
}
uniform float opacity;
void length_432c_main(vec3 arg1, out float value){
  value = length(arg1);
}
void step_2ef5_main(float edge, float x, out float value){
  value = step(edge, x);
}
void main() {
  vec2 xy_a70d; vec3 xyz_26e7; vec4 xyzw_6c26;
  fragCoord_e737_main(resolution, xy_a70d, xyz_26e7, xyzw_6c26);
  vec4 rgba_c48c; vec3 rgb_d6f; float alpha_ff25;
  texture_35bf_main(tint, xy_a70d, rgba_c48c, rgb_d6f, alpha_ff25);
  vec2 xy_9c43;
  pointCoord_a640_main(xy_9c43);
  vec4 rgba_169b; vec3 rgb_1b57; float alpha_f1b7;
  texture_35bf_main(diffuse, xy_9c43, rgba_169b, rgb_1b57, alpha_f1b7);
  float value_ce2c;
  multiply_7b3e_main(alpha_f1b7, alpha_ff25, value_ce2c);
  float value_4b96;
  multiply_7b3e_main(opacity, value_ce2c, value_4b96);
  vec3 value_232;
  multiply_7b3e_main(rgb_d6f, rgb_1b57, value_232);
  float value_6f52;
  length_432c_main(v_position, value_6f52);
  float value_240f;
  step_2ef5_main(value_6f52, 1.0, value_240f);
  vec3 color_f00f = value_232;
  float alpha_4ff4 = value_4b96;
  bool p_discard_e31 = bool(value_240f);
  if(p_discard_e31) discard;
  gl_FragColor = vec4(color_f00f, alpha_4ff4);
}