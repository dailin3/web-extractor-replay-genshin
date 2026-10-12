
#if USE_MASK != 0 || COLOR_ADJUST != 0 || defined(IS_SCENE_CONTAINER)
	varying vec2 vUv;
#endif

#ifdef IS_SCENE_CONTAINER
  #include <skinning_pars_vertex>
#endif

void main() {
  #if USE_MASK != 0 || COLOR_ADJUST != 0 || defined(IS_SCENE_CONTAINER)
  	vUv = uv;
  #endif
  #if USE_SPRITE == 1
  	gl_Position = vec4((uv-.5)*2.,0.,1.);
  #else
    #ifdef IS_SCENE_CONTAINER
      #include <skinbase_vertex>
      #include <begin_vertex>
      #include <skinning_vertex>
      #include <project_vertex>
    #else
  	  gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0);
    #endif
  #endif
  
}
