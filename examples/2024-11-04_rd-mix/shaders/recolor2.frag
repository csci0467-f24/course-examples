precision highp float;

  // x,y coordinates, given from the vertex shader
varying vec2 vTexCoord;

  // the canvas contents, given from filter()
uniform sampler2D tex0;
  // other useful information from the canvas
uniform vec2 texelSize;
uniform vec2 canvasSize;

uniform float rotation;

vec2 offset(vec2 offset) {
	vec2 pos = vTexCoord + offset * texelSize;
	pos.x = mod(pos.x, canvasSize.x);
	pos.y = mod(pos.y, canvasSize.y);
	return pos;
}

void main() {
	float radius = distance(vTexCoord, vec2(0.5));
	float angle = atan(vTexCoord.y - 0.5, vTexCoord.x - 0.5);

	angle = mod(angle + 3.14159265359, 3.14159265359 / 2.0);

	if(angle > 3.14159265359 / 4.0) {
		angle = 3.14159265359 / 2.0 - angle;
	}

	float x = radius * cos(angle + rotation) + 0.5;
	float y = radius * sin(angle + rotation) + 0.5;

	vec4 currentColor = texture2D(tex0, vec2(x, y));

	if(currentColor.b < 0.17) {
		gl_FragColor = vec4(0.06, 0.04, 0.45, 1.0);
	} else {
		vec4 color1 = vec4(0.12, 0.87, 0.45, 1.0);
		vec4 color2 = vec4(0.96, 0.94, 0.6, 1.0);
		gl_FragColor = mix(color1, color2, (currentColor.b - 0.15)/0.35);
	}

}