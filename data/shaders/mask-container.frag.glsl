uniform sampler2D diffuse;
uniform vec2 resolution;
uniform float opacity;

// enable mask

#if USE_MASK > 0
uniform sampler2D mask;
uniform vec2 maskCurve;
uniform vec2 maskOffset;
uniform float maskAngle;
varying vec2 vUv;
#endif

// simple image rotate and translate
#if USE_MASK == 1
vec2 rotate2D(vec2 pos, float ang){
    float param4 = cos(ang);
    float param5 = sin(ang);
    float param7 = param5 * -1.;
    mat2 param8 = mat2(param4, param7, param5, param4);
    vec2 param10 = param8 * pos;
    return param10;
}
#elif USE_MASK > 1
uniform vec2 feather;
vec2 gridUv(float time, vec2 uv, vec2 grid){
    vec2 uvmapGrid = uv / grid;
    float mapGridXNow = floor(fract(time)*grid.x)/grid.x;
    float mapGridYNow = 1.-(floor(fract(time/grid.y)*grid.y)+1.)/grid.y;
    return vec2(mapGridXNow,mapGridYNow) + uvmapGrid;  
}
#endif

//  msdf mask
#if USE_MASK == 3
float median(vec3 color){
    return max(min(color.r, color.g), min(max(color.r, color.g), color.b));
}
#endif

void main() {
  vec2 uv = gl_FragCoord.xy/resolution;
  gl_FragColor = texture2D(diffuse, uv);
  gl_FragColor.a *= opacity;
  #if USE_MASK > 0
    #if USE_MASK == 1
      float a = texture2D(mask, rotate2D(vUv,maskAngle)+maskOffset)[MASK_CHANNEL];
    #elif USE_MASK == 2
      float a = texture2D(mask, gridUv(maskAngle, vUv, maskOffset))[MASK_CHANNEL];
      a = smoothstep(feather.x, feather.y, a);
    #elif USE_MASK == 3
      float a = median(texture2D(mask, gridUv(maskAngle, vUv, maskOffset)).rgb);
      a = smoothstep(feather.x, feather.y, a);
    #endif
    #if INVERSE_MASK == 1
      a = 1.-a;
    #endif
    gl_FragColor.a *= pow(min(1.,max(0.,a+maskCurve.x)), maskCurve.y);
  #endif
}
