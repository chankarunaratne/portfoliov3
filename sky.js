// Sky Configuration
const SKY_CONFIG = {
  cloudSpeed: 0.3,
  cloudDensity: 0.6,
  cloudScale: 1.5,
  colorTint: { r: 1.0, g: 1.0, b: 1.0 },
  parallaxStrength: 0.002,
  grainIntensity: 0.03,
  chromaticAberration: 0.0015,
  // Soft central clearing parameters
  clearRadius: 0.33,
  clearFeather: 0.22,
  clearStrength: 0.6,
  clearEllipse: { x: 1.6, y: 1.0 },
  // Horizontal center band where clouds dissolve so the hero stays clear
  sideClearWidth: 0.5, // slightly narrower default so clouds come in more
  sideFeather: 0.16, // a bit tighter feather
  sideClearStrength: 0.92, // allow a touch of clouds within the band
};

class SkyRenderer {
  constructor() {
    this.canvas = document.getElementById("skyCanvas");
    this.mouse = { x: 0, y: 0 };
    this.time = 0;

    this.init();
    this.setupEventListeners();
    this.animate();
  }

  init() {
    // Create Three.js scene
    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: false,
      alpha: false,
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Match renderer size to actual CSS size of the canvas to avoid stretching
    const rect = this.canvas.getBoundingClientRect();
    this.renderer.setSize(rect.width, rect.height, false);

    // Create shader material
    this.createShaderMaterial();

    // Create fullscreen quad
    const geometry = new THREE.PlaneGeometry(2, 2);
    this.mesh = new THREE.Mesh(geometry, this.material);
    this.scene.add(this.mesh);

    // Apply initial responsive tuning (mobile vs desktop)
    this.applyResponsiveConfig();
  }

  createShaderMaterial() {
    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      uniform float uTime;
      uniform vec2 uResolution;
      uniform vec2 uMouse;
      uniform float uCloudSpeed;
      uniform float uCloudDensity;
      uniform float uCloudScale;
      uniform vec3 uColorTint;
      uniform float uParallaxStrength;
      uniform float uGrainIntensity;
      uniform float uChromaticAberration;
      // Central clearing controls
      uniform float uClearRadius;
      uniform float uClearFeather;
      uniform float uClearStrength;
      uniform vec2 uClearEllipse;
      // Side clear band controls
      uniform float uSideClearWidth;
      uniform float uSideFeather;
      uniform float uSideClearStrength;
      
      varying vec2 vUv;

      // Noise functions
      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

      float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
        vec2 i = floor(v + dot(v, C.yy));
        vec2 x0 = v - i + dot(i, C.xx);
        vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod289(i);
        vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
        m = m*m;
        m = m*m;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
        vec3 g;
        g.x = a0.x * x0.x + h.x * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
      }

      // Fractal Brownian Motion for clouds
      float fbm(vec2 p, float time) {
        float f = 0.0;
        float amplitude = 0.5;
        float frequency = 1.0;
        
        for (int i = 0; i < 6; i++) {
          vec2 offset = vec2(time * uCloudSpeed * 0.1, 0.0);
          f += amplitude * snoise((p + offset) * frequency * uCloudScale);
          amplitude *= 0.5;
          frequency *= 2.0;
        }
        
        return f;
      }

      // Film grain
      float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
      }

      // Sky gradient
      vec3 getSkyColor(vec2 uv) {
        float horizon = 1.0 - uv.y;
        vec3 topColor = vec3(0.227, 0.502, 0.769);
        vec3 horizonColor = vec3(0.627, 0.784, 0.922);
        return mix(topColor, horizonColor, horizon * horizon);
      }

      void main() {
        vec2 uv = vUv;
        vec2 st = uv * uResolution.xy / min(uResolution.x, uResolution.y);
        
        // Apply parallax based on mouse position
        vec2 parallaxOffset = (uMouse - 0.5) * uParallaxStrength;
        st += parallaxOffset;
        
        // Base sky gradient
        vec3 skyColor = getSkyColor(uv);
        
        // Generate clouds using FBM
        float cloudNoise = fbm(st * 2.0, uTime);
        cloudNoise = smoothstep(-uCloudDensity, uCloudDensity, cloudNoise);
        
        // Add multiple cloud layers for depth
        float cloudLayer1 = fbm(st * 1.5 + vec2(uTime * 0.02, 0.0), uTime);
        cloudLayer1 = smoothstep(-0.3, 0.7, cloudLayer1) * 0.8;
        
        float cloudLayer2 = fbm(st * 3.0 + vec2(uTime * 0.015, 0.0), uTime);
        cloudLayer2 = smoothstep(-0.2, 0.5, cloudLayer2) * 0.6;
        
        // Combine cloud layers
        float totalClouds = max(cloudNoise, max(cloudLayer1 * 0.7, cloudLayer2 * 0.5));
        totalClouds = clamp(totalClouds, 0.0, 1.0);
        
        // Apply a soft central clearing (elliptical, feathered)
        vec2 centerUv = vUv - 0.5;
        centerUv.x /= uClearEllipse.x;
        centerUv.y /= uClearEllipse.y;
        float centerDist = length(centerUv);
        float clearMask = smoothstep(uClearRadius, uClearRadius - uClearFeather, centerDist);
        totalClouds *= 1.0 - (clearMask * uClearStrength);

        // Vertical center band: dissolve clouds near the hero area
        float dx = abs(vUv.x - 0.5);
        float halfBand = clamp(uSideClearWidth * 0.5, 0.0, 0.5);
        // 0 at center (inside band), 1 at far sides with soft feathering
        float sideMask = smoothstep(halfBand, halfBand + uSideFeather, dx);
        totalClouds *= mix(1.0, sideMask, uSideClearStrength);
        
        // Cloud color (white with slight blue tint)
        vec3 cloudColor = vec3(1.0, 1.0, 1.0) * 0.95;
        
        // Mix sky and clouds
        vec3 finalColor = mix(skyColor, cloudColor, totalClouds * 0.8);
        
        // Apply color tint
        finalColor *= uColorTint;
        
        // Add film grain
        float grain = random(uv + uTime * 0.1) * uGrainIntensity;
        finalColor += grain;
        
        // Chromatic aberration effect
        vec2 aberrationOffset = (uv - 0.5) * uChromaticAberration;
        float r = finalColor.r;
        float g = mix(finalColor.g, getSkyColor(uv + aberrationOffset).g, 0.3);
        float b = mix(finalColor.b, getSkyColor(uv - aberrationOffset).b, 0.3);
        
        finalColor = vec3(r, g, b);
        
        // Subtle vignette
        float vignette = 1.0 - length(uv - 0.5) * 0.3;
        finalColor *= vignette;
        
        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uResolution: {
          value: new THREE.Vector2(
            this.canvas.getBoundingClientRect().width,
            this.canvas.getBoundingClientRect().height
          ),
        },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uCloudSpeed: { value: SKY_CONFIG.cloudSpeed },
        uCloudDensity: { value: SKY_CONFIG.cloudDensity },
        uCloudScale: { value: SKY_CONFIG.cloudScale },
        uColorTint: {
          value: new THREE.Vector3(
            SKY_CONFIG.colorTint.r,
            SKY_CONFIG.colorTint.g,
            SKY_CONFIG.colorTint.b
          ),
        },
        uParallaxStrength: { value: SKY_CONFIG.parallaxStrength },
        uGrainIntensity: { value: SKY_CONFIG.grainIntensity },
        uChromaticAberration: { value: SKY_CONFIG.chromaticAberration },
        uClearRadius: { value: SKY_CONFIG.clearRadius },
        uClearFeather: { value: SKY_CONFIG.clearFeather },
        uClearStrength: { value: SKY_CONFIG.clearStrength },
        uClearEllipse: {
          value: new THREE.Vector2(
            SKY_CONFIG.clearEllipse.x,
            SKY_CONFIG.clearEllipse.y
          ),
        },
        uSideClearWidth: { value: SKY_CONFIG.sideClearWidth },
        uSideFeather: { value: SKY_CONFIG.sideFeather },
        uSideClearStrength: { value: SKY_CONFIG.sideClearStrength },
      },
    });
  }

  setupEventListeners() {
    // Mouse movement for parallax
    window.addEventListener("mousemove", (e) => {
      this.mouse.x = e.clientX / window.innerWidth;
      this.mouse.y = 1.0 - e.clientY / window.innerHeight;

      this.material.uniforms.uMouse.value.set(this.mouse.x, this.mouse.y);
    });

    // Window resize
    window.addEventListener("resize", () => {
      const rect = this.canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      this.renderer.setSize(width, height, false);
      this.material.uniforms.uResolution.value.set(width, height);
      // Update side clear based on new layout
      this.updateSideClearWidth();
      // Re-apply responsive tuning on resize (e.g., device rotation)
      this.applyResponsiveConfig();
    });

    // Touch support for mobile parallax
    window.addEventListener("touchmove", (e) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        this.mouse.x = touch.clientX / window.innerWidth;
        this.mouse.y = 1.0 - touch.clientY / window.innerHeight;

        this.material.uniforms.uMouse.value.set(this.mouse.x, this.mouse.y);
      }
    });
  }

  // Tweak central clearing on mobile so side clouds appear along the whole hero
  applyResponsiveConfig() {
    const viewportWidth =
      window.innerWidth || document.documentElement.clientWidth;
    if (viewportWidth <= 768) {
      // Reduce the central ellipse impact on mobile so clouds appear beside the hero
      const mobileClearRadius = 0.22; // smaller center
      const mobileClearStrength = 0.25; // much weaker clearing
      const mobileClearEllipseX = 1.2; // narrower horizontally (less clearing across width)
      const mobileClearEllipseY = 0.9; // slightly narrower vertically
      // Slightly increase cloud coverage on mobile so sides feel fuller
      const mobileCloudDensity = 0.7;
      SKY_CONFIG.clearRadius = mobileClearRadius;
      SKY_CONFIG.clearStrength = mobileClearStrength;
      SKY_CONFIG.clearEllipse.x = mobileClearEllipseX;
      SKY_CONFIG.clearEllipse.y = mobileClearEllipseY;
      SKY_CONFIG.cloudDensity = mobileCloudDensity;
      this.material.uniforms.uClearRadius.value = mobileClearRadius;
      this.material.uniforms.uClearStrength.value = mobileClearStrength;
      this.material.uniforms.uClearEllipse.value.set(
        mobileClearEllipseX,
        mobileClearEllipseY
      );
      this.material.uniforms.uCloudDensity.value = mobileCloudDensity;
    } else {
      // Restore desktop defaults
      const desktopClearRadius = 0.33;
      const desktopClearStrength = 0.6;
      const desktopClearEllipseX = 1.6;
      const desktopClearEllipseY = 1.0;
      const desktopCloudDensity = 0.6;
      SKY_CONFIG.clearRadius = desktopClearRadius;
      SKY_CONFIG.clearStrength = desktopClearStrength;
      SKY_CONFIG.clearEllipse.x = desktopClearEllipseX;
      SKY_CONFIG.clearEllipse.y = desktopClearEllipseY;
      SKY_CONFIG.cloudDensity = desktopCloudDensity;
      this.material.uniforms.uClearRadius.value = desktopClearRadius;
      this.material.uniforms.uClearStrength.value = desktopClearStrength;
      this.material.uniforms.uClearEllipse.value.set(
        desktopClearEllipseX,
        desktopClearEllipseY
      );
      this.material.uniforms.uCloudDensity.value = desktopCloudDensity;
    }
  }

  animate() {
    this.time += 0.016; // 60fps delta
    this.material.uniforms.uTime.value = this.time;

    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(() => this.animate());
  }

  // Public methods to update configuration
  updateCloudSpeed(speed) {
    SKY_CONFIG.cloudSpeed = speed;
    this.material.uniforms.uCloudSpeed.value = speed;
  }

  updateCloudDensity(density) {
    SKY_CONFIG.cloudDensity = density;
    this.material.uniforms.uCloudDensity.value = density;
  }

  updateColorTint(r, g, b) {
    SKY_CONFIG.colorTint = { r, g, b };
    this.material.uniforms.uColorTint.value.set(r, g, b);
  }

  updateParallaxStrength(strength) {
    SKY_CONFIG.parallaxStrength = strength;
    this.material.uniforms.uParallaxStrength.value = strength;
  }

  // Keep clouds off the hero by clearing a responsive center band
  updateSideClearWidth() {
    const hero = document.querySelector(".hero");
    const viewportWidth =
      window.innerWidth || document.documentElement.clientWidth;
    let widthFraction = SKY_CONFIG.sideClearWidth;
    if (hero && viewportWidth > 0) {
      const rect = hero.getBoundingClientRect();
      // Smaller cushion so clouds can come closer to the hero edges
      const cushion = Math.min(120, viewportWidth * 0.07);
      // Allow slight overlap into the hero by shrinking the clear band a bit
      const sideOverlap = Math.min(64, rect.width * 0.08);
      const desired = Math.min(
        viewportWidth * 0.9,
        Math.max(0, rect.width - sideOverlap) + cushion
      );
      widthFraction = desired / viewportWidth;
    }
    // Mobile-only adjustment: keep the clear band narrower so side clouds are visible
    // without affecting the hero content. Desktop behavior remains unchanged.
    if (viewportWidth <= 768) {
      const maxCenterBand = 0.66; // leave ~17% per side for stronger side clouds on mobile
      widthFraction = Math.min(widthFraction, maxCenterBand);
    }
    SKY_CONFIG.sideClearWidth = widthFraction;
    this.material.uniforms.uSideClearWidth.value = widthFraction;
    // Scale feather with band width for natural transition
    const feather = Math.max(0.06, Math.min(0.22, widthFraction * 0.3));
    SKY_CONFIG.sideFeather = feather;
    this.material.uniforms.uSideFeather.value = feather;
  }
}

// Initialize the sky renderer when the page loads
window.addEventListener("DOMContentLoaded", () => {
  window.skyRenderer = new SkyRenderer();
  // Size the clear band once layout is ready
  window.skyRenderer.updateSideClearWidth();
});

// Ensure final layout (after fonts/images) also updates the clear band
window.addEventListener("load", () => {
  if (
    window.skyRenderer &&
    typeof window.skyRenderer.updateSideClearWidth === "function"
  ) {
    window.skyRenderer.updateSideClearWidth();
  }
});

// Export configuration for external access
window.SKY_CONFIG = SKY_CONFIG;
