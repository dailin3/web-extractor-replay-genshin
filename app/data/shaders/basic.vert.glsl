#if USE_TEXTURE == 1
  varying vec2 vUv;
#endif

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
  uniform float morphTargetInfluences[ 4 ];
#endif

#if USE_GRADIENT != 0
  varying vec3 vPosition;
#endif

#include <object_forceField_pars>

void main(){
  #if USE_TEXTURE == 1
    vUv = uv;
  #endif

  #if USE_GRADIENT != 0
    vPosition = position;
  #endif
  
  #ifdef USE_INSTANCE
    vec3 scaledPosition = position*scale;
    vec3 transformed = (scaledPosition + 2.0 * cross(rotation.xyz, cross(rotation.xyz, scaledPosition) + rotation.w * scaledPosition))+offset;
  #else
    #include <beginnormal_vertex>
    #include <skinbase_vertex>
    #include <skinnormal_vertex>
    #include <defaultnormal_vertex>

    #include <begin_vertex>
    
    #ifdef USE_MORPH
      transformed += morphTarget0 * morphTargetInfluences[ 0 ];
      transformed += morphTarget1 * morphTargetInfluences[ 1 ];
      transformed += morphTarget2 * morphTargetInfluences[ 2 ];
      transformed += morphTarget3 * morphTargetInfluences[ 3 ];
    #endif
    #include <skinning_vertex>
  #endif
  #ifdef USE_FORCE_FIELD
    #include <begin_force_vertex>

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

    #include <force_project_vertex>
  #else
    #include <project_vertex>
  #endif
}
