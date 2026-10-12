varying vec2 vUv;
uniform vec2 resolution;
#if USE_SCREEN_UV

#endif
#if USE_SPEED_MAP == 1 || USE_SPEED_MAP == 2
	uniform sampler2D speedMap;
	uniform vec2 speedMapLevel;
	uniform vec2 speedMapCenter;
float remap(float value, float min1, float max1, float min2, float max2) {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

#endif
#if USE_LEVEL_MAP == 1 ||USE_LEVEL_MAP == 2
	uniform sampler2D levelMap;
#endif
#if USE_CHANGE == 1
	uniform float changeSpeed;
#endif
#if USE_RING_UV == 1
	uniform float centerMaskOpacity;
	uniform float centerMaskWidth;
vec2 ringUv(vec2 param1, float scale){
    vec2 param8 = param1 - 0.5;
    float param15 = length(param8);
    float param11 = atan(param8.x,param8.y);
    float param17 = param15 * 2.;
    float param13 = param11 / 6.283185307;
    float param14 = 0.5 + param13;
    vec2 param18 = vec2(param14, pow(param17,scale));
    return param18;
}
vec2 invRingUv(vec2 param18, float scale){
    param18.y = pow(param18.y,1./scale);
    param18.x = param18.x * 6.283185307;
    vec2 param8 = -vec2(sin(param18.x),cos(param18.x)) * param18.y / 2.;
    return param8 + 0.5;
}

#endif

uniform sampler2D diffuse;
uniform sampler2D noiseMap;
uniform vec2 noiseScale;
uniform vec2 noiseCenter;
uniform vec3 uvScale;
uniform vec2 noiseSpeed;
uniform float time;
uniform vec2 noiseCurve;
uniform vec2 noiseLevel;
uniform float opacity;
vec2 fun1(){
    #if USE_SCREEN_UV == 1
    	return gl_FragCoord.xy/resolution;
    #else
    	return vUv;
    #endif
}

vec4 fun2(vec4 originColor, vec4 debugColor, vec4 debugColor2){
    #if DEBUG_MODE == 1
    	return debugColor;
    #elif DEBUG_MODE == 2
    	return debugColor2;
    #else
    	return originColor;
    #endif
}

float fun3(vec4 rgba){
    #if X_NOISE == 2
    	return rgba.g;
    #elif X_NOISE == 3
    	return rgba.b;
    #else
    	return rgba.r;
    #endif
}

float fun4(vec4 rgba){
    #if Y_NOISE == 1
    	return rgba.r;
    #elif Y_NOISE == 3
    	return rgba.b;
    #else
    	return rgba.g;
    #endif
}

vec2 fun5(vec2 level){
    vec4 levelColor;
    #if USE_LEVEL_MAP == 1
    	levelColor = texture2D(levelMap, vUv);
    	float xLevel = 0.;
    	#if X_LEVEL_MAP == 1
    		xLevel = levelColor.r;
    	#elif X_LEVEL_MAP == 2
    		xLevel = levelColor.g;
    	#elif X_LEVEL_MAP == 3
    		xLevel = levelColor.b;
    	#endif
    	float yLevel = 0.;
    	#if Y_LEVEL_MAP == 1
    		yLevel = levelColor.r;
    	#elif Y_LEVEL_MAP == 2
    		yLevel = levelColor.g;
    	#elif Y_LEVEL_MAP == 3
    		yLevel = levelColor.b;
    	#endif
    	#if DEBUG_MODE == 2
    		return vec2(xLevel,yLevel);
    	#else
    		return vec2(xLevel,yLevel)*level;
    	#endif
    
    #elif USE_LEVEL_MAP == 2
    	levelColor = 1. - texture2D(levelMap, vUv);
    	float xLevel = 0.;
    	#if X_LEVEL_MAP == 1
    		xLevel = levelColor.r;
    	#elif X_LEVEL_MAP == 2
    		xLevel = levelColor.g;
    	#elif X_LEVEL_MAP == 3
    		xLevel = levelColor.b;
    	#endif
    	float yLevel = 0.;
    	#if Y_LEVEL_MAP == 1
    		yLevel = levelColor.r;
    	#elif Y_LEVEL_MAP == 2
    		yLevel = levelColor.g;
    	#elif Y_LEVEL_MAP == 3
    		yLevel = levelColor.b;
    	#endif
    	#if DEBUG_MODE == 2
    		return vec2(xLevel,yLevel);
    	#else
    		return vec2(xLevel,yLevel)*level;
    	#endif
    #else
    	return level;
    #endif
}

vec4 fun6(vec4 rgba){
    #if USE_CHANGE == 1
    	float nr = rgba.r*abs(sin(time*changeSpeed+vUv.x));
      float ng = rgba.g*abs(cos(time*changeSpeed+vUv.y));
    	vec4 color= vec4(nr, ng, rgba.b, rgba.a);
    	#if USE_RING_UV == 1
    		float r = centerMaskWidth;
    		float d = length(vUv-0.5);
    		float c = 1.0-smoothstep(r, r-centerMaskWidth, d)*centerMaskOpacity;
    		return vec4(color.rgb*c,color.a);
    	#else
    		return color;
    	#endif
    #else
    	#if USE_RING_UV == 1
    		float r = centerMaskWidth;
    		float d = length(vUv-0.5);
    		float c = 1.0-smoothstep(r, r-centerMaskWidth, d)*centerMaskOpacity;
    		return vec4(rgba.rgb*c,rgba.a);
    	#else
    		return rgba;
    	#endif
    #endif
}

float fun7(float a){
    #if USE_SCREEN_UV == 1
    	return 1.;
    #else
    	return a;
    #endif
}

vec2 fun8(vec2 center, vec3 scale){
    vec2 uv = scale.xy*(vUv-.5)+.5;
    #if USE_RING_UV == 1
    	uv = ringUv(uv+center, scale.z);
    #endif
    return uv;
}

vec2 fun9(vec2 noiseUv, vec3 scale, vec2 center){
    vec2 speedUv;
    vec4 speedColor;
    #if USE_SPEED_MAP == 1
    	#if USE_SCREEN_UV == 1
    		speedUv = gl_FragCoord.xy/resolution;
    	#elif USE_RING_UV == 1
    		speedUv = ringUv(vUv+noiseUv, 1.);
    	#else
    		speedUv = vUv;
    	#endif
    
    	speedColor = texture2D(speedMap, vUv);
      
    float xSpeed = 0.;
    	#if X_SPEED_MAP == 1
    			xSpeed = speedColor.r;
    		#elif X_SPEED_MAP == 2
    			xSpeed = speedColor.g;
    		#elif X_SPEED_MAP == 3
    			xSpeed = speedColor.b;
    		#endif
    		float ySpeed = 0.;
    		#if Y_SPEED_MAP == 1
    			ySpeed = speedColor.r;
    		#elif Y_SPEED_MAP == 2
    			ySpeed = speedColor.g;
    		#elif Y_SPEED_MAP == 3
    			ySpeed = speedColor.b;
    		#endif
    
    #if USE_RING_UV == 1
      return	speedMapLevel*vec2 (xSpeed, ySpeed) * (invRingUv(speedUv,1.) - vUv);
    	#endif
    
    	return speedMapLevel*noiseUv*vec2 (xSpeed, ySpeed);
    #elif USE_SPEED_MAP == 2
    	#if USE_SCREEN_UV == 1
    		speedUv = gl_FragCoord.xy/resolution;
    	#else
    		speedUv = vUv;
    	#endif
    	speedColor = 1.0-texture2D(speedMap, speedUv);
    	float xSpeed = 0.;
    	#if X_SPEED_MAP == 1
    			xSpeed = speedColor.r;
    		#elif X_SPEED_MAP == 2
    			xSpeed = speedColor.g;
    		#elif X_SPEED_MAP == 3
    			xSpeed = speedColor.b;
    		#endif
    		float ySpeed = 0.;
    		#if Y_SPEED_MAP == 1
    			ySpeed = speedColor.r;
    		#elif Y_SPEED_MAP == 2
    			ySpeed = speedColor.g;
    		#elif Y_SPEED_MAP == 3
    			ySpeed = speedColor.b;
    		#endif
    	#if USE_RING_UV == 1
      return	speedMapLevel*vec2 (xSpeed, ySpeed) * (invRingUv(speedUv,1.) - vUv);
    	#endif
    	return speedMapLevel*noiseUv*vec2 (xSpeed, ySpeed);
    #else 
    	return noiseUv;
    #endif
}


void main(){
    vec2 param15 = fun8(noiseCenter, uvScale);
    vec2 param19 = noiseSpeed * time;
    vec3 param31 = vec3(noiseCurve.y);
    vec2 param36 = fun5(noiseLevel);
    vec2 param12 = fun1();
      vec2 param16 = noiseScale * param15;
    vec2 param20 = param16 + param19;
    vec4 param6 = texture2D(noiseMap, param20);
    vec4 param4 = fun6(param6);
      float param21 = fun3(param4);
        float param22 = fun4(param4);
        vec2 param23 = vec2(param21, param22);
    vec3 param25 = vec3(param23, 1.);
    vec3 param27 = param25 + noiseCurve.x;
    vec3 param30 = clamp(param27, 0., 1.);
    vec3 param32 = pow(param30, param31);
    vec2 param35 = param32.xy - 0.5;
      vec2 param37 = param35 * param36;
    vec2 param10 = param37 * 1.;
      vec2 param39 = fun9(param10, uvScale, noiseCenter);
        vec2 param40 = param12 + param39;
    vec4 param41 = texture2D(diffuse, param40);
    float param7 = param41.w * opacity;
    float param45 = fun7(param7);
    vec2 param47 = vec2(1., param45);
      vec4 param2 = vec4(param4.rgb, param45);
    vec4 param1 = vec4(param41.rgb, param7);
    vec4 param3 = vec4(param40, param47);
    vec4 param48 = fun2(param1, param2, param3);
      gl_FragColor = param48;
}