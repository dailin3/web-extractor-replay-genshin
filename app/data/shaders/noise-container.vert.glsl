varying vec2 vUv;
void main(){
    mat4 param3 = projectionMatrix * modelViewMatrix;
    vec4 param6 = vec4(position, 1.);
    vUv = uv;
    vec4 param7 = param3 * param6;
    gl_Position = param7;
}


