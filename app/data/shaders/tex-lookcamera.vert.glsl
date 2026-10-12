varying vec2 vUv;
vec4 fun1(vec3 param1){
    vec4 param5 = modelViewMatrix * vec4(0.,0.,0.,1.);
    vec4 param8 = vec4(param1, 0.);
    vec4 param9 = param5 + param8;
    vec4 param10 = projectionMatrix * param9;
    return param10;
}

vec3 fun2(){
    vec3 scale;
    scale.x = length(vec3(modelMatrix[0]));
    scale.y = length(vec3(modelMatrix[1]));
    scale.z = length(vec3(modelMatrix[2]));
    return scale;
}


void main(){
    vec3 param13 = fun2();
    vUv = uv;
      vec3 param6 = position * param13;
    vec4 param11 = fun1(param6);
      gl_Position = param11;
}


