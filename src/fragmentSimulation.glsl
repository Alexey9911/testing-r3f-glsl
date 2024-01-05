varying vec2 vUv;

void main() {

    vec2 uv = gl_FragCoord.xy / resolution.xy;

    vec4 tmpPos = texture2D(texturePosition, uv);

    vec3 position = tmpPos.xyz
    


    gl_FragCoord = vec4(position + vec3(0.001), phase);
}