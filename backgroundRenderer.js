const canvas = document.getElementById("backgroundCanvas");
const gl = canvas.getContext("webgl2", {
	alpha: false,
	antialias: false,
	depth: false,
	desynchronized: true,
	failIfMajorPerformanceCaveat: true,
	powerPreference: "high-performance",
	premultipliedAlpha: false,
	preserveDrawingBuffer: false,
	stencil: false
});

if (!gl) {
	console.error("WebGL2 is not supported.");
}

const vertexShaderSource = `#version 300 es
precision mediump float;
in vec2 aClipPosition;
void main() {
	gl_Position = vec4(aClipPosition, 0.0, 1.0);
}`;

const fragmentShaderSource = `#version 300 es
precision mediump float;
out vec4 fragColor;
uniform vec2 uResolution;
uniform float uTime;
void main() {
	const vec3 colorLo = vec3(0.08, 0.08, 0.08);
	const vec3 colorHi = vec3(0.12, 0.12, 0.12);
	
	float aspect = uResolution.x / uResolution.y;
	vec2 uv = gl_FragCoord.xy / uResolution;
	uv.x *= aspect;

	float influence = 0.0;
	float radiusBase = max(aspect, 1.0);
	int count = clamp(int(uResolution.x * 0.01), 16, 128);
	for (int i = 0; i < count; ++i) {
		float radius = radiusBase * (sin(float(i) * 15.30 + 11.02) * 0.1 + 0.2);
		vec2 pos = vec2(
			(sin(float(i) * 73.23 + 84.52) * 0.5 + 0.5) * aspect,
			sin(float(i) * 56.20 + 82.82) * 0.5 + 0.5
		);
		float phase = sin(float(i) * 31.26 + 73.78) * 81.29;
		pos.x += sin(phase + uTime * 0.1) * 0.2;
		float speed = (sin(float(i) * 82.80 + 58.44) + 2.0) * 0.02;
		pos.y = mod(pos.y + uTime * speed, 1.0) * (1.0 + 4.0 * radius) - 2.0 * radius;
		influence += 1.0 - smoothstep(radius * 0.1, radius, length(pos - uv));
	}
	fragColor = vec4(mix(colorLo, colorHi, min(influence, 1.0)), 1.0);
}`;

function createShader(gl, type, source) {
	const shader = gl.createShader(type);
	gl.shaderSource(shader, source);
	gl.compileShader(shader);
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		console.error("Shader compilation failed: ", gl.getShaderInfoLog(shader));
		gl.deleteShader(shader);
		return null;
	}
	return shader;
}

function createProgram(gl, vertexSrc, fragmentSrc) {
	const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSrc);
	const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSrc);
	const program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);
	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		console.error("Program linking failed: ", gl.getProgramInfoLog(program));
		gl.deleteProgram(program);
		return null;
	}
	return program;
}

const program = createProgram(gl, vertexShaderSource, fragmentShaderSource);
gl.useProgram(program);

const aClipPosition = gl.getAttribLocation(program, "aClipPosition");
const uResolution = gl.getUniformLocation(program, "uResolution");
const uTime = gl.getUniformLocation(program, "uTime");

const vao = gl.createVertexArray();
gl.bindVertexArray(vao);

const clipPosBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, clipPosBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Int8Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
gl.enableVertexAttribArray(aClipPosition);
gl.vertexAttribPointer(aClipPosition, 2, gl.BYTE, false, 0, 0);

function resizeCanvas() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	gl.viewport(0, 0, canvas.width, canvas.height);
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function render(time) {
	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.useProgram(program);
	gl.bindVertexArray(vao);
	gl.uniform2fv(uResolution, [gl.drawingBufferWidth, gl.drawingBufferHeight]);
	gl.uniform1f(uTime, time * 0.001);
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
	requestAnimationFrame(render);
}

requestAnimationFrame(render);
