// varying vec2 vUv;

// uniform sampler2D texturePosition;

// attribute vec2 reference;

// void main() {

//     vUv = reference;
//     vec3 pos = texture(texturePosition, reference).xyz;

//     vec4 mvPosition = modelViewMatrix * vec4(pos, 1.);

//     gl_PointSize = 50. * (1. / -mvPosition.z);

//     gl_Position = projectionMatrix * mvPosition;
// }

varying vec2 vUv;

uniform sampler2D positionTexture;

attribute vec2 reference;

void main() {

    vUv = reference;
    vec3 pos = texture(positionTexture, reference).xyz;
    pos = pos * position;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.);

    gl_PointSize = 50. * (1. / -mvPosition.z);

    gl_Position = projectionMatrix * mvPosition;
}