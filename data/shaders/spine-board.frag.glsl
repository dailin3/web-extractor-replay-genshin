uniform sampler2D diffuse;
varying vec2 vUv;
varying vec4 vColor;
#if BLEND_MODE != 0
  uniform vec3 blendColor;
  uniform float blendIntensity;
#endif
#if USE_GRADIENT != 0
  varying vec3 vPosition;
  // x:渐变角度、y:范围、z:偏移
  uniform vec3 gradient;
#endif
#ifdef TWO_COLOR
  varying vec4 vColor2;
#endif
void main() {
  gl_FragColor = texture2D(diffuse, vUv);
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
  #ifdef TWO_COLOR
    gl_FragColor.rgb = ((gl_FragColor.a - 1.0) * vColor2.a + 1.0 - gl_FragColor.rgb) * vColor2.rgb + gl_FragColor.rgb * vColor.rgb;
    gl_FragColor.a *= vColor.a;
  #else
    gl_FragColor *= vColor;
  #endif  
}
