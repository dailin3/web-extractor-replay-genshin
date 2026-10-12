#include <particle_info_pars>
#if USE_TINT != 0
  uniform sampler2D tint;
  uniform vec2 resolution;
  uniform vec2 tintScale;
  #if USE_TINT == 2
    uniform float time;
    uniform vec2 tintOffset;
  #endif
#endif
#if USE_TEXTURE == 1
  uniform sampler2D diffuse;
  varying vec2 vUv;
#else
  uniform vec3 color;
#endif
#if BLEND_MODE != 0
  uniform vec3 blendColor;
  uniform float blendIntensity;
#endif
#if USE_GRADIENT != 0
  varying vec3 vPosition;
  // x:渐变角度、y:范围、z:偏移
  uniform vec3 gradient;
#endif

uniform float opacity;

void main(){
  #include <particle_info_fragment>
  #if USE_TEXTURE == 1
    vec2 uv = vUv;
    #ifdef USE_POINTS
      uv = gl_PointCoord.xy;
      #include <particle_point_rotation_uv_fragment>
    #endif
    gl_FragColor = texture2D(diffuse,uv);
  #else
    gl_FragColor = vec4(color,1.);
  #endif
  #if USE_TINT != 0
    vec2 fragCoord = gl_FragCoord.xy / resolution;
    vec2 tintUV = fragCoord;
    tintUV *= tintScale;
    vec4 tintColor = texture2D(tint,tintUV);
    gl_FragColor.rgb *= tintColor.rgb;
    gl_FragColor.a = min(gl_FragColor.a,tintColor.a);
    #if USE_TINT == 2
      tintUV += time * tintOffset / 100.;
      tintColor.xyz = pow(texture2D(tint,tintUV).xyz, vec3(.5));
      gl_FragColor.rgb = max(gl_FragColor.rgb, tintColor.rgb);
      vec2 timeLight = fragCoord * vec2(20,5) + time * 2.;
      float timeOffset = max(timeLight.x, timeLight.y);
      timeOffset = pow(max(0.,sin(timeOffset)), 5.);
      gl_FragColor.rgb = mix(gl_FragColor.rgb *.8, gl_FragColor.rgb * 1.25, timeOffset);
    #endif
    // gl_FragColor.rgb *= texture2D(diffuse,gl_FragCoord.xy/resolution).rgb;
    // gl_FragColor = vec4(gl_FragCoord.xy/resolution,0,1);
  #endif
  
  #ifdef USE_PARTICLE_SYSTEM
    // particleInfo.particleIndex  ->  粒子索引(float) 
    // particleInfo.instanceIndex  -> 实例索引(float)
    // particleInfo.scale  -> 缩放(float)
    // particleInfo.lifeTime  -> 生命周期(float 0-1)
    // particleInfo.age  -> 年龄(float)
    // particleInfo.uv  -> 粒子所处的emitShape uv(vec2) 
    // particleInfo.position  -> 位置(vec3)
    // particleInfo.velocity  -> 速度(vec3)
    // particleInfo.acceleration  -> 加速度(vec3)
    // particleInfo.quaternion  -> 旋转矩阵(mat3)
  #endif

  #ifdef USE_POINTS
    // if(length(gl_PointCoord.xy-.5)>0.5) discard;
    #ifdef USE_PARTICLE_SYSTEM
      if(particleInfo.scale < 1e-2) discard;
    #endif
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
  #if USE_GRADIENT != 0
    float gradientAngle = gradient.x;
    float gradientRange = gradient.y;
    float gradientOffset = gradient.z;

    float gradientsRadian = (gradientAngle - 90.) / 180. * 3.1415926;
    vec2 gradientsDirection = vec2(cos(gradientsRadian), sin(gradientsRadian));
    vec2 gradientsDirectionInv = vec2(cos(-gradientsRadian), sin(-gradientsRadian));
    float c_gradientsRange = max(gradientRange, 1e-5);
    vec2 gradientsBounds = (vPosition.xy - gradientOffset) / c_gradientsRange;
    float gradientsDot = dot(gradientsDirection, gradientsBounds) + .5;
    float gradientsAlpha = pow(min(1., max(0., gradientsDot)), 2.);
    gl_FragColor.a *= gradientsAlpha;
  #endif
  gl_FragColor.a*=opacity;
}