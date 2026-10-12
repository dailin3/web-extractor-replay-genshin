varying vec2 vUv;
uniform sampler2D diffuse;
uniform float opacity;
void main(){
    vec4 param3 = texture2D(diffuse, vUv);
    float param6 = param3.w * opacity;
    vec4 param7 = vec4(param3.rgb, param6);
    gl_FragColor = param7;
}