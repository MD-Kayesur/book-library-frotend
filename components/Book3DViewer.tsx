"use client";

import * as React from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import {
  RotateCcw,
  Sparkles,
  Sun,
  Eye,
  BookOpen,
  Palette,
  Maximize2,
  MousePointer,
} from "lucide-react";

// Preset Color Palettes
const COLOR_PRESETS = [
  { name: "Midnight Sapphire", hex: "#1e3a8a", goldFinish: true },
  { name: "Crimson Royal", hex: "#881337", goldFinish: true },
  { name: "Emerald Cyber", hex: "#064e3b", goldFinish: true },
  { name: "Obsidian Gold", hex: "#18181b", goldFinish: true },
  { name: "Sunset Copper", hex: "#7c2d12", goldFinish: true },
];

// Lighting Environment Presets
const LIGHTING_PRESETS = [
  { id: "studio", name: "Studio White", mainColor: 0xffffff, fill: 0x818cf8, intensity: 1.8 },
  { id: "warm", name: "Warm Sunset", mainColor: 0xfde047, fill: 0xf97316, intensity: 2.0 },
  { id: "neon", name: "Cyber Neon", mainColor: 0x38bdf8, fill: 0xe0e7ff, intensity: 2.2 },
];

export function Book3DViewer() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const rendererRef = React.useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = React.useRef<OrbitControls | null>(null);
  const bookGroupRef = React.useRef<THREE.Group | null>(null);
  const coverMaterialsRef = React.useRef<THREE.MeshStandardMaterial[]>([]);
  const frontCoverMeshRef = React.useRef<THREE.Mesh | null>(null);
  const dirLightRef = React.useRef<THREE.DirectionalLight | null>(null);

  // UI States
  const [selectedColor, setSelectedColor] = React.useState(COLOR_PRESETS[0].hex);
  const [activeLighting, setActiveLighting] = React.useState("studio");
  const [autoRotate, setAutoRotate] = React.useState(true);
  const [isBookOpen, setIsBookOpen] = React.useState(false);
  const [roughness, setRoughness] = React.useState(0.3);
  const [metalness, setMetalness] = React.useState(0.1);
  const [wireframe, setWireframe] = React.useState(false);
  const [fullscreen, setFullscreen] = React.useState(false);

  // Setup Three.js Scene
  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x09090b); // Tailwind zinc-950
    scene.fog = new THREE.FogExp2(0x09090b, 0.04);

    const aspect = container.clientWidth / container.clientHeight;
    const camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 100);
    camera.position.set(3.5, 2.5, 4.5);

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    // Clear previous canvas if re-rendering
    container.innerHTML = "";
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 3. OrbitControls (Mouse Interaction)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 10;
    controls.minDistance = 2.5;
    controls.maxPolarAngle = Math.PI / 1.9; // Prevent camera going under floor
    controls.target.set(0, 0, 0);
    controlsRef.current = controls;

    // 4. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.8);
    dirLight.position.set(5, 8, 5);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.bias = -0.0001;
    scene.add(dirLight);
    dirLightRef.current = dirLight;

    const fillLight = new THREE.PointLight(0x818cf8, 1.0, 15);
    fillLight.position.set(-5, 3, -4);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0xf59e0b, 1.2, 12);
    rimLight.position.set(0, 4, -5);
    scene.add(rimLight);

    // 5. Build 3D Realistic Book Model
    const bookGroup = new THREE.Group();
    bookGroupRef.current = bookGroup;
    scene.add(bookGroup);

    // Book Dimensions
    const width = 2.2;
    const height = 3.0;
    const thickness = 0.55;
    const coverThickness = 0.04;

    coverMaterialsRef.current = [];

    // Shared Cover Material
    const createCoverMaterial = () => {
      const mat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(selectedColor),
        roughness: roughness,
        metalness: metalness,
        wireframe: wireframe,
      });
      coverMaterialsRef.current.push(mat);
      return mat;
    };

    // Gold Metallic Accent Material
    const goldMaterial = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.9,
      roughness: 0.2,
    });

    // Page Block (Inner Paper)
    const pageWidth = width - 0.08;
    const pageHeight = height - 0.08;
    const pageThickness = thickness - coverThickness * 2;

    const pagesGeo = new THREE.BoxGeometry(pageWidth, pageHeight, pageThickness);
    
    // Create textured canvas for page edges
    const pageCanvas = document.createElement("canvas");
    pageCanvas.width = 128;
    pageCanvas.height = 128;
    const ctx = pageCanvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#fdfbf7";
      ctx.fillRect(0, 0, 128, 128);
      ctx.fillStyle = "#e5e0d8";
      for (let i = 0; i < 128; i += 2) {
        ctx.fillRect(0, i, 128, 1);
      }
    }
    const pageTexture = new THREE.CanvasTexture(pageCanvas);
    pageTexture.wrapS = THREE.RepeatWrapping;
    pageTexture.wrapT = THREE.RepeatWrapping;
    pageTexture.repeat.set(1, 10);

    const pagesMat = new THREE.MeshStandardMaterial({
      color: 0xf5f2eb,
      roughness: 0.9,
      map: pageTexture,
    });

    const pagesMesh = new THREE.Mesh(pagesGeo, pagesMat);
    pagesMesh.position.set(0.04, 0, 0);
    pagesMesh.castShadow = true;
    pagesMesh.receiveShadow = true;
    bookGroup.add(pagesMesh);

    // Back Cover
    const backCoverGeo = new THREE.BoxGeometry(width, height, coverThickness);
    const backCoverMat = createCoverMaterial();
    const backCoverMesh = new THREE.Mesh(backCoverGeo, backCoverMat);
    backCoverMesh.position.set(0, 0, -thickness / 2 + coverThickness / 2);
    backCoverMesh.castShadow = true;
    backCoverMesh.receiveShadow = true;
    bookGroup.add(backCoverMesh);

    // Spine (Left Edge)
    const spineGeo = new THREE.BoxGeometry(coverThickness, height, thickness);
    const spineMat = createCoverMaterial();
    const spineMesh = new THREE.Mesh(spineGeo, spineMat);
    spineMesh.position.set(-width / 2 + coverThickness / 2, 0, 0);
    spineMesh.castShadow = true;
    spineMesh.receiveShadow = true;
    bookGroup.add(spineMesh);

    // Spine Gold Ribbon Details
    const spineRibbonGeo = new THREE.BoxGeometry(coverThickness + 0.01, 0.08, thickness + 0.01);
    const spineRibbon1 = new THREE.Mesh(spineRibbonGeo, goldMaterial);
    spineRibbon1.position.set(-width / 2 + coverThickness / 2, height / 3, 0);
    bookGroup.add(spineRibbon1);

    const spineRibbon2 = new THREE.Mesh(spineRibbonGeo, goldMaterial);
    spineRibbon2.position.set(-width / 2 + coverThickness / 2, -height / 3, 0);
    bookGroup.add(spineRibbon2);

    // Front Cover (Grouped for opening animation pivot at left edge)
    const frontCoverGroup = new THREE.Group();
    frontCoverGroup.position.set(-width / 2 + coverThickness / 2, 0, thickness / 2 - coverThickness / 2);

    const frontCoverGeo = new THREE.BoxGeometry(width, height, coverThickness);
    const frontCoverMat = createCoverMaterial();
    const frontCoverMesh = new THREE.Mesh(frontCoverGeo, frontCoverMat);
    frontCoverMesh.position.set(width / 2 - coverThickness / 2, 0, 0);
    frontCoverMesh.castShadow = true;
    frontCoverMesh.receiveShadow = true;
    frontCoverGroup.add(frontCoverMesh);
    frontCoverMeshRef.current = frontCoverMesh;

    // Gold Emblem / Title Frame on Front Cover
    const emblemGeo = new THREE.BoxGeometry(1.2, 1.2, 0.02);
    const emblemMesh = new THREE.Mesh(emblemGeo, goldMaterial);
    emblemMesh.position.set(width / 2 - coverThickness / 2, 0.4, coverThickness / 2 + 0.01);
    frontCoverGroup.add(emblemMesh);

    // Inner Emblem Inset
    const innerEmblemGeo = new THREE.BoxGeometry(1.0, 1.0, 0.03);
    const innerEmblemMesh = new THREE.Mesh(innerEmblemGeo, createCoverMaterial());
    innerEmblemMesh.position.set(width / 2 - coverThickness / 2, 0.4, coverThickness / 2 + 0.015);
    frontCoverGroup.add(innerEmblemMesh);

    // Book Title Decorative Lines (Gold)
    const lineGeo = new THREE.BoxGeometry(1.2, 0.04, 0.02);
    const line1 = new THREE.Mesh(lineGeo, goldMaterial);
    line1.position.set(width / 2 - coverThickness / 2, -0.6, coverThickness / 2 + 0.01);
    frontCoverGroup.add(line1);

    const line2 = new THREE.Mesh(lineGeo, goldMaterial);
    line2.position.set(width / 2 - coverThickness / 2, -0.75, coverThickness / 2 + 0.01);
    frontCoverGroup.add(line2);

    bookGroup.add(frontCoverGroup);

    // 6. Ground Shadow Plane
    const shadowPlaneGeo = new THREE.PlaneGeometry(15, 15);
    const shadowPlaneMat = new THREE.ShadowMaterial({ opacity: 0.45 });
    const shadowPlane = new THREE.Mesh(shadowPlaneGeo, shadowPlaneMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -height / 2 - 0.01;
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);

    // Subtle Grid Helper for Depth Perception
    const grid = new THREE.GridHelper(12, 24, 0x3f3f46, 0x27272a);
    grid.position.y = -height / 2 - 0.02;
    scene.add(grid);

    // 7. Animation Loop
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Handle Auto Rotation
      if (autoRotate && bookGroupRef.current) {
        bookGroupRef.current.rotation.y += 0.006;
      }

      // Smooth Front Cover Open Animation
      const targetAngle = isBookOpen ? -Math.PI * 0.75 : 0;
      frontCoverGroup.rotation.y += (targetAngle - frontCoverGroup.rotation.y) * 0.1;

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // 8. Responsive Resize Handler
    const handleResize = () => {
      if (!container || !rendererRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
    };
  }, [isBookOpen]);

  // Update Materials when Color / Metallic / Roughness / Wireframe changes
  React.useEffect(() => {
    coverMaterialsRef.current.forEach((mat) => {
      mat.color.set(selectedColor);
      mat.roughness = roughness;
      mat.metalness = metalness;
      mat.wireframe = wireframe;
      mat.needsUpdate = true;
    });
  }, [selectedColor, roughness, metalness, wireframe]);

  // Update Lighting Presets
  const handleLightingChange = (presetId: string) => {
    setActiveLighting(presetId);
    const preset = LIGHTING_PRESETS.find((p) => p.id === presetId);
    if (preset && dirLightRef.current) {
      dirLightRef.current.color.setHex(preset.mainColor);
      dirLightRef.current.intensity = preset.intensity;
    }
  };

  // Reset Camera View
  const handleResetCamera = () => {
    if (controlsRef.current && bookGroupRef.current) {
      controlsRef.current.reset();
      bookGroupRef.current.rotation.set(0, 0, 0);
    }
  };

  return (
    <div
      className={`relative w-full rounded-2xl border border-zinc-800 bg-zinc-950 overflow-hidden shadow-2xl transition-all duration-300 ${
        fullscreen ? "fixed inset-0 z-50 rounded-none h-screen" : "h-[650px]"
      }`}
    >
      {/* 3D WebGL Canvas Container */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Overlay Badge - Mouse Instructions */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-zinc-900/80 backdrop-blur-md px-3.5 py-2 rounded-full border border-zinc-800 text-xs font-medium text-zinc-300 shadow-lg">
        <MousePointer className="w-4 h-4 text-indigo-400 animate-pulse" />
        <span>Drag to rotate 3D | Scroll to zoom | Right-click to pan</span>
      </div>

      {/* Top Right Quick Controls */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        <button
          onClick={handleResetCamera}
          title="Reset Camera View"
          className="p-2.5 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 rounded-full border border-zinc-800 backdrop-blur-md transition-all shadow-md"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        <button
          onClick={() => setFullscreen(!fullscreen)}
          title="Toggle Fullscreen"
          className="p-2.5 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 rounded-full border border-zinc-800 backdrop-blur-md transition-all shadow-md"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Bottom Floating Control Panel */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 w-[92%] max-w-2xl bg-zinc-900/90 backdrop-blur-xl border border-zinc-800 p-4 rounded-2xl shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Color Palette Presets */}
        <div className="flex flex-col gap-1.5 w-full md:w-auto">
          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-indigo-400" /> Cover Color
          </span>
          <div className="flex items-center gap-2">
            {COLOR_PRESETS.map((preset) => (
              <button
                key={preset.hex}
                onClick={() => setSelectedColor(preset.hex)}
                style={{ backgroundColor: preset.hex }}
                className={`w-7 h-7 rounded-full border-2 transition-all hover:scale-110 shadow-md ${
                  selectedColor === preset.hex
                    ? "border-amber-400 scale-110 ring-2 ring-amber-400/50"
                    : "border-zinc-700 hover:border-zinc-400"
                }`}
                title={preset.name}
              />
            ))}
          </div>
        </div>

        {/* Lighting Selector */}
        <div className="flex flex-col gap-1.5 w-full md:w-auto">
          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sun className="w-3.5 h-3.5 text-amber-400" /> Lighting
          </span>
          <div className="flex items-center gap-1 bg-zinc-950/80 p-1 rounded-xl border border-zinc-800">
            {LIGHTING_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleLightingChange(preset.id)}
                className={`px-2.5 py-1 text-xs rounded-lg transition-all font-medium ${
                  activeLighting === preset.id
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        {/* Action Toggles (Auto Rotate, Open Book, Wireframe) */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end border-t md:border-t-0 border-zinc-800 pt-2 md:pt-0">
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
              autoRotate
                ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300"
                : "bg-zinc-950/80 border-zinc-800 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            {autoRotate ? "Auto Spin On" : "Auto Spin Off"}
          </button>

          <button
            onClick={() => setIsBookOpen(!isBookOpen)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
              isBookOpen
                ? "bg-amber-500/20 border-amber-500/50 text-amber-300"
                : "bg-zinc-950/80 border-zinc-800 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            {isBookOpen ? "Close Book" : "Open Book"}
          </button>

          <button
            onClick={() => setWireframe(!wireframe)}
            className={`p-1.5 rounded-xl border text-xs transition-all ${
              wireframe
                ? "bg-indigo-500/20 border-indigo-500/50 text-indigo-300"
                : "bg-zinc-950/80 border-zinc-800 text-zinc-400 hover:text-zinc-200"
            }`}
            title="Toggle Wireframe Mode"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
