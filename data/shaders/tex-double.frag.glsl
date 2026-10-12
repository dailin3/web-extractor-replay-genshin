varying vec2 vUv;
uniform sampler2D diffuse;
uniform sampler2D back;
uniform float percent;
uniform float opacity;
void main(){
    vec4 param3 = texture2D(diffuse, vUv);
    vec4 param9 = texture2D(back, vUv);
    vec3 param6 = param3.rgb * param3.a;
    vec3 param12 = param9.rgb * param9.a;
    float param16 = mix(param3.a, param9.a, percent);
    float param22 = param16 * opacity;
    vec3 param14 = mix(param6, param12, percent);
    vec3 param17 = param14 / param16;
    vec3 param20 = clamp(param17, vec3(0.), vec3(1.));
    vec4 param23 = vec4(param20, param22);
    gl_FragColor = param23;
}