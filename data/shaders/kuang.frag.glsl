varying vec2 vUv;
uniform sampler2D diffuse;
uniform float time;
uniform vec2 grid;
vec2 fun1(float time, vec2 uv, vec2 grid){
    vec2 uvmapGrid = uv / grid;
    float mapGridXNow = floor(fract(time)*grid.x)/grid.x;
    float mapGridYNow = 1.-(floor(fract(time/grid.y)*grid.y)+1.)/grid.y;
    return vec2(mapGridXNow,mapGridYNow) + uvmapGrid;  
}


void main(){
    vec2 param5 = fun1(time, vUv, grid);
      vec4 param6 = texture2D(diffuse, param5);
    gl_FragColor = param6;
}