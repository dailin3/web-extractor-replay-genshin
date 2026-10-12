#ifdef USE_INSTANCE
  attribute vec4 rotation;
  attribute vec3 offset;
  attribute vec3 scale;
#endif

#include <skinning_pars_vertex>

#ifdef USE_MORPH
  attribute vec3 morphTarget0;
  attribute vec3 morphTarget1;
  attribute vec3 morphTarget2;
  attribute vec3 morphTarget3;
  #if USE_MORPH > 4
    attribute vec3 morphTarget4;
  #endif
  uniform float morphTargetInfluences[ USE_MORPH ];
#endif

varying vec3 vNormal;
varying vec4 vViewPosition;
varying vec2 vUv;
vec4 fun2(){
    #ifdef USE_INSTANCE
      vec3 scaledPosition = position*scale;
      vec3 transformed = (scaledPosition + 2.0 * cross(rotation.xyz, cross(rotation.xyz, scaledPosition) + rotation.w * scaledPosition))+offset;
    #else
    
      #include <beginnormal_vertex>
      #include <skinbase_vertex>
      #include <skinnormal_vertex>
      #include <begin_vertex>
        
      #ifdef USE_MORPH
        transformed += ( morphTarget0 ) * morphTargetInfluences[ 0 ];
        transformed += ( morphTarget1 ) * morphTargetInfluences[ 1 ];
        transformed += ( morphTarget2 ) * morphTargetInfluences[ 2 ];
        transformed += ( morphTarget3 ) * morphTargetInfluences[ 3 ];
      #endif
      #include <skinning_vertex>
    #endif
    
    vNormal = normalize(normalMatrix * objectNormal);
    vViewPosition = modelViewMatrix * vec4(transformed , 1.);
    
    return projectionMatrix * vViewPosition;
}

vec4 fun1(){
    vec4 param1 = fun2();
      return param1;
}


void main(){
    vec4 param2 = fun1();
    vUv = uv;
      gl_Position = param2;
}


