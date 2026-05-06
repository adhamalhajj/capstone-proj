'use client';

import { useRef, useEffect } from 'react';
import Link from 'next/link';

const SHADER_SRC = `#version 300 es
precision highp float;
out vec4 O;
uniform vec2 resolution;
uniform float time;

float hash2(vec2 p){
  p=fract(p*vec2(127.1,311.7));
  p+=dot(p,p+34.56);
  return fract(p.x*p.y);
}
float noise(vec2 p){
  vec2 i=floor(p),f=fract(p);
  f=f*f*(3.-2.*f);
  return mix(
    mix(hash2(i),      hash2(i+vec2(1.,0.)),f.x),
    mix(hash2(i+vec2(0.,1.)),hash2(i+vec2(1.,1.)),f.x),
    f.y
  );
}
float fbm(vec2 p){
  float v=0.,a=.5;
  for(int i=0;i<5;i++){v+=a*noise(p);p*=2.;a*=.5;}
  return v;
}

void main(){
  vec2 res = resolution;
  vec2 uv  = gl_FragCoord.xy / res.y;
  uv.x    -= (res.x/res.y - 1.) * .5;

  // Sky gradient: warm horizon -> deep blue zenith
  vec3 col = mix(
    vec3(.78, .90, 1.00),
    vec3(.10, .38, .80),
    pow(clamp(uv.y, 0., 1.), .55)
  );

  // Sun atmosphere glow
  vec2 sunP = vec2(.65, .76);
  float sd  = length(uv - sunP);
  col += vec3(1., .88, .45) * .055 / (sd*sd*3.5 + .004);

  // Animated sun rays (two counter-rotating spoke sets)
  float ang  = atan(uv.y - sunP.y, uv.x - sunP.x);
  float rays = pow(max(0., sin(ang*8.  + time*.40)), 16.)
             + pow(max(0., sin(ang*13. - time*.32)), 24.) * .40
             + pow(max(0., sin(ang*5.  + time*.15)), 10.) * .28;
  col += vec3(1., .92, .55) * rays
       * smoothstep(.40, .07, sd) * smoothstep(.04, .09, sd) * .22;

  // Sun disk: warm corona -> bright white core
  col = mix(col, vec3(1., .97, .72), smoothstep(.053, .034, sd));
  col = mix(col, vec3(1.,  1.,  1.), smoothstep(.020, .008, sd));

  // Drifting clouds
  float cld = fbm(vec2(uv.x * 1.5 + time * .020, uv.y * 2.7 + .40));
  cld = smoothstep(.50, .72, cld) * smoothstep(.32, .52, uv.y);
  col = mix(col, vec3(1., .99, .97), cld * .72);

  // Ground soil beneath all grass layers
  float GY = .30;
  if (uv.y < GY) {
    col = mix(vec3(.09, .15, .06), vec3(.17, .24, .09), fbm(uv * 8.));
  }

  // 4 grass layers drawn back-to-front: i=0 back (dark/short) -> i=3 front (bright/tall)
  for (int i = 0; i <= 3; i++) {
    float fi    = float(i);
    float baseY = GY   - fi * .024;   // front layers sit lower on screen
    float maxH  = .022 + fi * .024;   // front layers are taller
    float wAmp  = .014 + fi * .007;   // front layers sway further
    float freq  = 18.  + fi * 8.;    // blade density increases toward front
    float seed  = fi   * 79.3;

    // Multi-harmonic wind: slow gust + medium ripple + fast flutter
    float wf = sin(time * 1.3 + uv.x * 2.8) * .70
             + sin(time * 2.2 + uv.x * 5.5) * .28
             + sin(time * .55 + uv.x * 1.1) * .48;

    // Tips lean more than bases (physically accurate blade flex)
    float lean = clamp((uv.y - baseY) / maxH, 0., 1.);
    float wx   = uv.x - wf * wAmp * lean;

    // Multi-octave noise for jagged blade-like silhouette top edge
    float n1     = noise(vec2(wx * freq         + seed,       .5));
    float n2     = noise(vec2(wx * freq * 2.1   + seed + 7.,  1.5));
    float n3     = noise(vec2(wx * freq * 4.4   + seed + 14., 2.5));
    float grassH = baseY + maxH * (n1 * .45 + n2 * .35 + n3 * .20);

    if (uv.y < grassH) {
      float t  = fi / 3.;
      vec3 gc  = mix(vec3(.09, .18, .06), vec3(.36, .62, .20), t);

      // Warm sunlight tint on front layers
      gc += vec3(.04, .07, .00) * t * .6;

      // Tip brightening: sun catching the sharp blade edges
      float tipT = clamp((grassH - uv.y) / (maxH * .28), 0., 1.);
      gc += vec3(.06, .10, .01) * smoothstep(1., 0., tipT) * .45;

      // Ambient occlusion: darken blades near ground level
      float ao = clamp((uv.y - (baseY - maxH * .12)) / (maxH * .55), 0., 1.);
      gc *= .52 + .48 * ao;

      // Atmospheric haze on distant back layers
      gc = mix(gc, vec3(.45, .57, .38), (1. - t) * .10);

      col = gc;
    }
  }

  // Vignette
  vec2 v = gl_FragCoord.xy / res - .5;
  col   *= 1. - dot(v, v) * 1.15;

  O = vec4(clamp(col, 0., 1.), 1.);
}`;

const VERTEX_SRC = `#version 300 es
precision highp float;
in vec4 position;
void main(){gl_Position=position;}`;

function useShaderBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl2');
    if (!gl) return;

    const dpr = Math.max(1, 0.5 * window.devicePixelRatio);

    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();

    const compile = (type, src) => {
      const sh = gl.createShader(type);
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      return sh;
    };

    const vs = compile(gl.VERTEX_SHADER, VERTEX_SRC);
    const fs = compile(gl.FRAGMENT_SHADER, SHADER_SRC);
    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,1,-1,-1,1,1,1,-1]), gl.STATIC_DRAW);
    const pos = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(program, 'resolution');
    const uTime = gl.getUniformLocation(program, 'time');

    let animId;
    const loop = (now) => {
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, now * 1e-3);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);

    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buf);
    };
  }, []);

  return canvasRef;
}

export default function AnimatedShaderHero({
  trustBadge,
  headline,
  subtitle,
  buttons,
  className = '',
}) {
  const canvasRef = useShaderBackground();

  return (
    <div className={`relative w-full h-screen overflow-hidden bg-black ${className}`}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full touch-none"
      />

      {/* Gradient overlay: darker at top for text legibility, clear at bottom for grass */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-transparent" />

      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-white px-5 sm:px-8">
        {trustBadge && (
          <div className="mb-6 sm:mb-8 hero-fade-in-down">
            <div className="flex flex-wrap items-center justify-center gap-1.5 px-4 py-2 sm:px-5 sm:py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-xs sm:text-sm">
              {trustBadge.icons?.map((icon, i) => (
                <span key={i}>{icon}</span>
              ))}
              <span className="text-white/90 font-medium">{trustBadge.text}</span>
            </div>
          </div>
        )}

        <div className="text-center space-y-4 sm:space-y-5 max-w-5xl mx-auto w-full">
          {/* Single H1 for SEO — two visually-styled spans */}
          <h1 className="space-y-1">
            <span className="block text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-white hero-fade-in-up hero-delay-200 drop-shadow-lg leading-tight">
              {headline.line1}
            </span>
            <span className="block text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-[#7dc76a] hero-fade-in-up hero-delay-400 drop-shadow-lg leading-tight">
              {headline.line2}
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-xl text-white/80 font-light leading-relaxed hero-fade-in-up hero-delay-600 px-2">
            {subtitle}
          </p>

          {buttons && (
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mt-8 sm:mt-10 hero-fade-in-up hero-delay-800 w-full max-w-sm sm:max-w-none mx-auto">
              {buttons.primary && (
                buttons.primary.href ? (
                  <Link
                    href={buttons.primary.href}
                    className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-[#477a40] hover:bg-[#3a6433] active:bg-[#2f5a29] text-white rounded-full font-semibold text-base sm:text-lg transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-xl hover:shadow-black/40 text-center"
                  >
                    {buttons.primary.text}
                  </Link>
                ) : (
                  <button
                    onClick={buttons.primary.onClick}
                    className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-[#477a40] hover:bg-[#3a6433] active:bg-[#2f5a29] text-white rounded-full font-semibold text-base sm:text-lg transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-xl hover:shadow-black/40"
                  >
                    {buttons.primary.text}
                  </button>
                )
              )}
              {buttons.secondary && (
                buttons.secondary.href ? (
                  <Link
                    href={buttons.secondary.href}
                    className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-white/10 hover:bg-white/20 active:bg-white/30 border border-white/30 hover:border-white/50 text-white rounded-full font-semibold text-base sm:text-lg transition-all duration-300 hover:scale-105 active:scale-95 backdrop-blur-sm text-center"
                  >
                    {buttons.secondary.text}
                  </Link>
                ) : (
                  <button
                    onClick={buttons.secondary.onClick}
                    className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-white/10 hover:bg-white/20 active:bg-white/30 border border-white/30 hover:border-white/50 text-white rounded-full font-semibold text-base sm:text-lg transition-all duration-300 hover:scale-105 active:scale-95 backdrop-blur-sm"
                  >
                    {buttons.secondary.text}
                  </button>
                )
              )}
            </div>
          )}
        </div>

        {/* Scroll hint — hidden on very small screens to avoid clutter */}
        <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 hero-fade-in-up hero-delay-800 hidden xs:flex flex-col items-center gap-2 text-white/50">
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-white/40 to-transparent" />
        </div>
      </div>
    </div>
  );
}
