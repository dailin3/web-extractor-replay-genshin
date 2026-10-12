uniform sampler2D diffuse;
#if CUSTOM_BACK_SIDE == 1
  // 背面纹理
  uniform sampler2D backDiffuse;
#elif CUSTOM_BACK_SIDE == 2
  // 背面颜色
  uniform vec3 backColor;
#elif CUSTOM_BACK_SIDE == 3
  // 背面UV
  uniform vec3 backColor;
#endif

uniform vec2 resolution;
uniform float opacity;

#if USE_MASK != 0 || COLOR_ADJUST != 0 || defined(IS_SCENE_CONTAINER)
	varying vec2 vUv;
#endif

#if BLEND_MODE != 0
uniform vec3 blendColor;
uniform float blendIntensity;
#endif

#if USE_SHADOW == 1
uniform sampler2D blurMap;
uniform vec2 shadowOffset;
uniform vec3 shadowColor;
uniform float shadowOpacity;
#endif

#if USE_STROKE != 0
uniform vec3 strokeColor;
uniform float strokeWidth;
#endif

#if COLOR_ADJUST != 0
uniform vec3 colorCSB;
vec3 colorDesaturate(vec3 col, float saturation){
 return mix(col, vec3(dot(col, vec3(.3,.59,.11))), saturation);
}
#endif

#if USE_MASK != 0
uniform sampler2D mask;
uniform vec3 maskCurve;
uniform vec2 maskOffset;
uniform float maskAngle;
#if USE_MASK_OUTLINE == 1
  uniform vec3 outlineColor;
  uniform vec2 outlineIntensity;
#endif
#endif


// simple image rotate and translate
#if USE_MASK == 1 || USE_MASK == -1 || COLOR_ADJUST == 2
vec2 rotate2D(vec2 pos, float ang){
    float param4 = cos(ang);
    float param5 = sin(ang);
    float param7 = param5 * -1.;
    mat2 param8 = mat2(param4, param7, param5, param4);
    vec2 param10 = param8 * pos;
    return param10;
}
#elif USE_MASK > 1 || USE_MASK < -1
uniform vec2 feather;
uniform vec2 maskSize;
uniform float maskPadding; 
vec2 gridUv(float time, vec2 uv, vec2 grid){
    float index = floor(time * grid.x);
    index = mod(index, grid.x * grid.y);
    float indexX = mod(index, grid.x);
    float indexY = grid.y - 1. - mod(floor(index / grid.x), grid.y);
    vec2 subUV = uv;
    // subUV = (subUV * (maskSize - 2. * maskPadding) + maskPadding) / maskSize;
    subUV = (subUV * (maskSize - 2. * maskPadding) + maskPadding) / maskSize;
    return (vec2(indexX, indexY) + subUV) / grid;
}
#endif

//  msdf mask
#if USE_MASK == 3 || USE_MASK == -3
float median(vec3 color){
    return max(min(color.r, color.g), min(max(color.r, color.g), color.b));
}
#endif

vec4 getDiffuseColor(vec2 uv){
  vec4 color = texture2D(diffuse, uv);
  #if CUSTOM_BACK_SIDE > 0
    if(!gl_FrontFacing){
      #if CUSTOM_BACK_SIDE == 1
        vec4 b_color = texture2D(backDiffuse, uv);
        color = vec4(b_color.xyz, color.a * b_color.a);
      #elif CUSTOM_BACK_SIDE == 2
        color = vec4(backColor, color.a);
      #elif CUSTOM_BACK_SIDE == 3
        vec4 b_color = texture2D(diffuse, backColor.xy);
        color = vec4(b_color.xyz, color.a * b_color.a);
      #endif
    }
  #endif
  return color;
}

void main() {
  vec2 uv;
  #if defined(IS_SCENE_CONTAINER)
    uv = vUv;
  #else
    uv = gl_FragCoord.xy/resolution;
  #endif
  vec4 color = getDiffuseColor(uv);
  
  #if USE_STROKE == 1
   float outlineAlpha = 0.0;
		float angle = 0.0;
		for( int i=0; i<6; i++ ){
			angle += 1.0466667;
			vec2 testPoint = strokeWidth*vec2( cos(angle), sin(angle) )/resolution + uv;
			float sampledAlpha = getDiffuseColor(testPoint ).a;
			outlineAlpha = max( outlineAlpha, sampledAlpha );
		}
   color = mix(vec4(strokeColor, outlineAlpha), color, 1.-step(0.01,1.-color.a));
  #endif
  
  #if USE_STROKE == 2
   float outlineAlpha = 1.0;
		float angle = 0.0;
		for( int i=0; i<6; i++ ){
			angle += 1.0466667;
			vec2 testPoint = strokeWidth*vec2( cos(angle), sin(angle) )/resolution + uv;
			float sampledAlpha = getDiffuseColor(testPoint ).a;
			outlineAlpha = min( outlineAlpha, sampledAlpha );
		}
   color = vec4(mix(strokeColor, color.rgb, outlineAlpha), color.a);
  #endif
  
  #if USE_SHADOW == 1
    float shadow = texture2D(blurMap, uv + shadowOffset/resolution).a * shadowOpacity;
    color = vec4( mix( color.rgb, shadowColor, (1.-color.a)), min(1.,max(color.a,shadow)));
  #endif

  
  
  gl_FragColor = color;
  float maskAlpha = 1.;
   
  #if USE_MASK != 0 || COLOR_ADJUST == 2
    #if USE_MASK == 1 || USE_MASK == -1 || COLOR_ADJUST == 2
      maskAlpha = texture2D(mask, rotate2D(uv-vec2(.5),maskAngle)+vec2(.5)+maskOffset)[MASK_CHANNEL];
      #if USE_MASK < 0
        maskAlpha = 1.-maskAlpha;
      #endif
    #elif USE_MASK == 2 || USE_MASK == -2
      #if MASK_CHANNEL == 0
        float maskFrame = max(0., min(maskOffset.y * 3. - 1e-5,maskAngle));
      #else
        float maskFrame = max(0., min(maskOffset.y * 3. - 1e-5,maskAngle));
      #endif
      #if MASK_CHANNEL == 0
        vec4 mask = texture2D(mask, gridUv(maskFrame, uv, maskOffset));
        float maskChannel = floor(maskFrame / maskOffset.y);
        maskAlpha = mix(mask.r, mix(mask.g, mask.b, float(maskChannel > 1.)), float(maskChannel > 0.));
      #else
        maskAlpha = texture2D(mask, gridUv(maskAngle, uv, maskOffset))[MASK_CHANNEL];
      #endif
      maskAlpha = smoothstep(feather.x, feather.y, maskAlpha);
      #if USE_MASK < 0
        maskAlpha = 1.-maskAlpha;
      #endif
    #elif USE_MASK == 3 || USE_MASK == -3
      maskAlpha = median(texture2D(mask, gridUv(maskAngle, uv, maskOffset)).rgb);
      maskAlpha = smoothstep(feather.x, feather.y, maskAlpha);
      #if USE_MASK < 0
        maskAlpha = 1.-maskAlpha;
      #endif
    #endif
    maskAlpha = mix(1.-maskAlpha,maskAlpha,max(0.,min(1.,maskCurve.z)));
    maskAlpha = pow(maskAlpha+maskCurve.x, maskCurve.y);
    #if USE_MASK_OUTLINE == 1
      float outline = abs(maskAlpha-.5) * 2.;
      outline = clamp(outline, 0., 1.);
      outline = 1. - pow(outline, outlineIntensity.y);
      gl_FragColor.rgb = mix(gl_FragColor.rgb, outlineColor, outline);
      gl_FragColor.a = mix(gl_FragColor.a, gl_FragColor.a * outline * outlineIntensity.x, outline * float(gl_FragColor.a > 0.9 ));
      // gl_FragColor.a *= mix(1., 10., float(gl_FragColor.a > 0.9 ));
    #endif
  		gl_FragColor.a *= max(0.,min(1.,maskAlpha));
  		// gl_FragColor = vec4(vec3(maskAlpha),1);
  #endif
  
  #if COLOR_ADJUST != 0
  	vec3 adjLev = colorCSB * maskAlpha;
  	gl_FragColor.rgb = colorDesaturate(gl_FragColor.rgb, adjLev.y);
  	gl_FragColor.rgb = pow(gl_FragColor.rgb, vec3(adjLev.x + 1.));
  	gl_FragColor.rgb = min(gl_FragColor.rgb + adjLev.z, vec3(1.));
  #endif
  
  #if BLEND_MODE == 1
  	gl_FragColor.rgb = mix(gl_FragColor.rgb, blendColor, blendIntensity);
  #elif BLEND_MODE == 2
  	gl_FragColor.rgb += blendColor * blendIntensity;
  #elif BLEND_MODE == 3
  	gl_FragColor.rgb -= blendColor * blendIntensity;
  #elif BLEND_MODE == 4
  	gl_FragColor.rgb *= blendColor * blendIntensity;
  #elif BLEND_MODE == 5
  	gl_FragColor.rgb = mix(gl_FragColor.rgb, blendColor - gl_FragColor.rgb, blendIntensity);
  #endif

  #if ALPHA_TEST != 0
      const float alphaTest = min(1., float(ALPHA_TEST) / 100.);
if(gl_FragColor.a < alphaTest){
    discard;
}else{
    // 保留的透明颜色做柔化处理（避免出现硬边）
    gl_FragColor.a = min(gl_FragColor.a, (gl_FragColor.a-alphaTest)/(1.-alphaTest));
}
  #endif
  gl_FragColor.a*=opacity;
}
