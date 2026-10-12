varying vec3 vNormal;
varying vec3 vViewPosition;
varying vec3 vWorldPosition;
varying vec2 vUv;
vec4 fun1(vec3 param1, vec3 param2){
    vec3 param5 = normalMatrix * param1;
    vec4 param11 = vec4(param2, 1.);
    vec3 param6 = normalize(param5);
    vec4 param12 = modelViewMatrix * param11;
    vec4 param18 = modelMatrix * param11;
    vNormal = param6;
    vec4 param14 = param12 * -1.;
    vWorldPosition = param18.xyz;
    vec4 param22 = projectionMatrix * param12;
    vViewPosition = param14.xyz;
    return param22;
}


void main(){
    vec4 param23 = fun1(normal, position);
    vUv = uv;
      gl_Position = param23;
}


