varying vec2 vUv;
varying vec3 vNormal;
uniform float time;
uniform float speed;
uniform sampler2D diffuse;
uniform vec2 xy_speed;
uniform vec3 lightDir;
uniform vec2 lightPower;
uniform sampler2D lightFallOff;
uniform vec3 lightColor;
uniform float opacity;
float fun1(){
    float param5 = time * speed;
    return param5;
}

vec2 fun2(vec2 param1, vec2 param2){
    vec2 param9 = vUv * param1;
    float param6 = fun1();
      vec2 param11 = param6 * param2;
    vec2 param12 = param9 + param11;
    return param12;
}


void main(){
    vec2 param13 = fun2(vec2(1.), xy_speed);
    vec3 param19 = normalize(lightDir);
    vec3 param30 = lightColor * lightPower.y;
      vec4 param15 = texture2D(diffuse, param13);
    float param20 = dot(vNormal, param19);
    float param22 = param20 + lightPower.x;
    float param35 = param15.w * opacity;
    float param23 = 1. - param22;
    vec2 param26 = vec2(param22, 0.5);
    vec4 param27 = texture2D(lightFallOff, param26);
    vec3 param31 = param27.r * param30;
    vec3 param32 = param23 * param31;
    vec3 param33 = param15.rgb - param32;
    vec4 param36 = vec4(param33, param35);
    gl_FragColor = param36;
}