varying vec3 v_position;
varying vec2 v_uv;
#define FRAGMENT_SHADER
void pointCoord_a640_main(out vec2 xy){
    xy = gl_PointCoord;
}
void distance_f1a_main(vec2 p0, vec2 p1, out float value){
  value = distance(p0, p1);
}
void step_2ef5_main(float edge, float x, out float value){
  value = step(edge, x);
}
void multiply_7b3e_main(float arg1, float arg2, out float value){
  value = arg1 * arg2;
}
void subtract_12d_main(float arg1, float arg2, out float value){
  value = arg1 - arg2;
}
void pow_f867_main(float arg1, float arg2, out float value){
  value = pow(arg1, arg2);
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
void mix_6ab0_main(float x, float y, float a, out float value){
  value = mix(x, y, a);
}
#define PI 3.141592653589793
void sin_2a82_main(float arg1, out float value){
  value = sin(arg1);
}
uniform sampler2D diffuse;
void texture_35bf_main(sampler2D arg1, vec2 coord, out vec4 rgba, out vec3 rgb, out float alpha){
  rgba = texture2D(arg1, coord);
  rgb = rgba.rgb;
  alpha = rgba.a;
}
void main() {
  vec2 xy_ec51;
  pointCoord_a640_main(xy_ec51);
  float value_b292;
  distance_f1a_main(xy_ec51, vec2(0.5, 0.5), value_b292);
  float value_cc43;
  step_2ef5_main(0.5, value_b292, value_cc43);
  float value_a9e6;
  multiply_7b3e_main(value_b292, 2.0, value_a9e6);
  float value_9ebd;
  subtract_12d_main(1.0, value_a9e6, value_9ebd);
  float value_5053;
  pow_f867_main(value_9ebd, 2.0, value_5053);
  float value_79a0; vec3 vector_e95c;
  whiteNoise_a12a_main(v_position, value_79a0, vector_e95c);
  float pointProgress_adef; float lifeTime_6282; float startTime_62d1;
  pointInfo_be00_main(value_79a0, progress, pointProgress_adef, lifeTime_6282, startTime_62d1);
  float value_6b07;
  mix_6ab0_main(0.2, 1.0, pointProgress_adef, value_6b07);
  float value_598d;
  pow_f867_main(value_6b07, 6.0, value_598d);
  float value_45f5;
  multiply_7b3e_main(value_598d, PI, value_45f5);
  float value_a87;
  sin_2a82_main(value_45f5, value_a87);
  vec4 rgba_442c; vec3 rgb_2c91; float alpha_87a5;
  texture_35bf_main(diffuse, v_uv, rgba_442c, rgb_2c91, alpha_87a5);
  float value_3b39;
  multiply_7b3e_main(alpha_87a5, value_a87, value_3b39);
  float value_f782;
  multiply_7b3e_main(value_5053, value_3b39, value_f782);
  vec3 color_f00f = rgb_2c91;
  float alpha_4ff4 = value_f782;
  bool p_discard_e31 = bool(value_cc43);
  if(p_discard_e31) discard;
  gl_FragColor = vec4(color_f00f, alpha_4ff4);
}