varying vec2 vUv;

void main() {

    vec3 color = vec3(gl_PointCoord.x, gl_PointCoord.y, 0.5);

    gl_FragColor = vec4(color, 1.0);
}