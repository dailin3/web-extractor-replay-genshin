varying vec2 vUv;
vec4 fun1(vec3 param1){
    mat4 param4 = projectionMatrix * modelViewMatrix;
    vec4 param7 = vec4(param1, 1.);
    vec4 param8 = param4 * param7;
    return param8;
}


void main(){
    vec4 param9 = fun1(position);
    vUv = uv;
      gl_Position = param9;
}


