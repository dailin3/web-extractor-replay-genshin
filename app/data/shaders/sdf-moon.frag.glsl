uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;
uniform vec2 resolution;
uniform float radius;
uniform sampler2D diffuse;
uniform vec2 xy_speed;
uniform float speed;
uniform float time;
uniform vec3 lightDir;
uniform vec2 lightPower;
uniform vec3 lightColor;
uniform vec3 innerGlowColor;
uniform sampler2D lightFallOff;
uniform float opacity;
uniform vec3 outGlowColor;
uniform float glowRadius;
uniform float alphaFallOff;
uniform vec4 glowCurve;
varying vec3 vRayOrigin;
varying vec3 vRayDirection;

vec4 iEllipsoid( vec3 ro, vec3 rd, vec3 r ){
    vec3 r2 = r*r;
    float a = dot( rd, rd/r2 );
    float b = dot( ro, rd/r2 );
    float c = dot( ro, ro/r2 );
    float h = b*b - a*(c-1.0);
    if( h<0.0 ) return vec4(0.,0.,0.,h);
	  float t = (-b - sqrt( h ))/a;
    vec3 n = normalize( (ro+t*rd)/r2 );
    return vec4(n,h);
}

vec2 mapUV(vec3 n) {
    if (n == vec3(0.0)) return vec2(0.0);
    float phi = atan(n.x, n.z);
    float theta = acos(n.y);
    return vec2(
        phi / (2.0 * 3.1415926535) + 0.5,
        1.0 - theta / 3.1415926535
    );
}

void main() {
  float fov = projectionMatrix[1][1]; 
  vec2 p = (-resolution.xy + 2.0*gl_FragCoord.xy) / resolution.y ;
  vec3 ww = vRayDirection;
  vec3 uu = normalize( cross(ww,vec3(0.0,1.0,0.0) ) );
  vec3 vv = normalize( cross(uu,ww));
  vec3 rd = normalize( p.x*uu + p.y*vv + fov*ww ); 
  vec4 normal = iEllipsoid(vRayOrigin, rd, vec3(radius));
  normal.xyz *= normalMatrix;

  float power = dot(normal.xyz,normalize(lightDir))+lightPower.x;
  vec3 shadowColor = lightColor*lightPower.y*texture2D(lightFallOff, vec2(power,.5)).r;
  normal.w*=10000.;
  float alpha = smoothstep(0.,alphaFallOff,normal.w);
  vec2 uv = mapUV(normal.xyz)+xy_speed*speed*time;
  vec3 color = texture2D(diffuse, uv).rgb-shadowColor;
  float outGlowAlpha = smoothstep(glowCurve.x,glowCurve.y,normal.w)-alpha;
  vec3 innerGlow = (1.-smoothstep(glowCurve.z,glowCurve.w,normal.w))*innerGlowColor*alpha;
  gl_FragColor = vec4(mix(mix(innerGlowColor,color+innerGlow,alpha),outGlowColor,1.-alpha), opacity*(alpha+max(0.,outGlowAlpha)));
}
