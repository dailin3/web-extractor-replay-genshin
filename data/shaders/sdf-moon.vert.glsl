
varying vec2 vUv;
varying vec3 vRayOrigin;
varying vec3 vRayDirection;
// matrix inverse
mat3 transpose2(mat3 m) {
  return mat3(m[0][0], m[1][0], m[2][0],
              m[0][1], m[1][1], m[2][1],
              m[0][2], m[1][2], m[2][2]);
}

// apply quaternion
vec3 transform(vec3 pos, vec4 quat){
   return pos + 2.0 * cross(quat.xyz, cross(quat.xyz, pos) + quat.w * pos);
}

void main() { 
  mat3 inverseViewMat = transpose2(mat3(viewMatrix));
  vRayOrigin = (cameraPosition - (modelMatrix*vec4(0.,0.,0.,1.0)).xyz);
  vRayDirection = normalize(inverseViewMat * vec3(0.,0.,-1.));
  vUv = uv;
  gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0);
}
