varying vec2 vUv;

#include <skinning_pars_vertex>

void main(){
  vUv = uv;
  #include <skinbase_vertex>
  #include <begin_vertex>    
  #include <skinning_vertex>
  #include <project_vertex>
}
