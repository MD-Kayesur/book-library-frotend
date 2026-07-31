"use client";

import * as React from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import {
  RotateCcw,
  Sparkles,
  Sun,
  Palette,
  Maximize2,
  MousePointer,
  ArrowUp,
  ArrowDown,
  Eye,
  Zap,
  CheckCircle2,
} from "lucide-react";

// Preset Color Palettes for Nike Alphafly Next%
const UPPER_COLOR_PRESETS = [
  { name: "Atomknit Black (Exact Photo)", hex: "#0f172a" },
  { name: "Pure White", hex: "#f8fafc" },
  { name: "Neon Volt", hex: "#84cc16" },
  { name: "Cyber Teal", hex: "#06b6d4" },
];

const FOAM_COLOR_PRESETS = [
  { name: "Champagne Cream (Exact Photo)", hex: "#fef9c3" },
  { name: "Crisp White", hex: "#ffffff" },
  { name: "Gold Metallic", hex: "#eab308" },
  { name: "Jet Black", hex: "#09090b" },
];

const SWOOSH_COLOR_PRESETS = [
  { name: "Metallic Gold (Exact Photo)", hex: "#d4af37" },
  { name: "Electric Blue", hex: "#2563eb" },
  { name: "Hyper Violet", hex: "#9333ea" },
  { name: "Crimson Red", hex: "#ef4444" },
];

export function Alphafly3DViewer() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const rendererRef = React.useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = React.useRef<OrbitControls | null>(null);
  const cameraRef = React.useRef<THREE.PerspectiveCamera | null>(null);
  const shoeGroupRef = React.useRef<THREE.Group | null>(null);

  // Material Refs for Dynamic Customization
  const upperMatRef = React.useRef<THREE.MeshStandardMaterial | null>(null);
  const foamMatRef = React.useRef<THREE.MeshStandardMaterial | null>(null);
  const swooshMatRef = React.useRef<THREE.MeshStandardMaterial | null>(null);
  const airPodMatRef = React.useRef<THREE.MeshPhysicalMaterial | null>(null);

  // UI States
  const [upperColor, setUpperColor] = React.useState(UPPER_COLOR_PRESETS[0].hex);
  const [foamColor, setFoamColor] = React.useState(FOAM_COLOR_PRESETS[0].hex);
  const [swooshColor, setSwooshColor] = React.useState(SWOOSH_COLOR_PRESETS[0].hex);
  const [autoRotate, setAutoRotate] = React.useState(true);
  const [wireframe, setWireframe] = React.useState(false);
  const [fullscreen, setFullscreen] = React.useState(false);
  const [activeAngle, setActiveAngle] = React.useState<string>("default");

  const targetCamPosRef = React.useRef<THREE.Vector3 | null>(null);

  // Setup Photorealistic Three.js Scene for Nike Alphafly
  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Clean White Studio Scene & Soft Atmospheric Lighting (Exact Match to Photo)
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff); // Clean studio white background
    scene.fog = new THREE.FogExp2(0xffffff, 0.015);

    const aspect = container.clientWidth / container.clientHeight;
    const camera = new THREE.PerspectiveCamera(40, aspect, 0.1, 100);
    // Camera angle matching side-profile floating stance of Alphafly photo
    camera.position.set(3.8, 1.4, 3.8);
    cameraRef.current = camera;

    // 2. High-Precision WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;

    container.innerHTML = "";
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 3. OrbitControls (Unrestricted 360° Mouse Orbiting: Top, Bottom Sole, Sides)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 10;
    controls.minDistance = 1.8;
    controls.minPolarAngle = 0.01; // Top view (Opra)
    controls.maxPolarAngle = Math.PI - 0.01; // Bottom sole view (Nicha)
    controls.target.set(0, 0.1, 0);
    controlsRef.current = controls;

    // 4. Studio Lighting System
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.15);
    scene.add(ambientLight);

    const topKeyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    topKeyLight.position.set(6, 9, 6);
    topKeyLight.castShadow = true;
    topKeyLight.shadow.mapSize.width = 2048;
    topKeyLight.shadow.mapSize.height = 2048;
    topKeyLight.shadow.bias = -0.0001;
    scene.add(topKeyLight);

    const fillLight = new THREE.DirectionalLight(0xf8fafc, 1.3);
    fillLight.position.set(-6, 4, -4);
    scene.add(fillLight);

    // Soft Uplight for bottom sole tread inspection ("Nicha View")
    const bottomLight = new THREE.DirectionalLight(0xffffff, 1.2);
    bottomLight.position.set(0, -8, 0);
    scene.add(bottomLight);

    // 5. Build Photorealistic 3D Nike Alphafly Next% Model
    const shoeGroup = new THREE.Group();
    shoeGroup.rotation.y = 0.1;
    shoeGroupRef.current = shoeGroup;
    scene.add(shoeGroup);

    // Atomknit Fabric Bump Texture
    const knitCanvas = document.createElement("canvas");
    knitCanvas.width = 256;
    knitCanvas.height = 256;
    const ctx = knitCanvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(0, 0, 256, 256);
      ctx.fillStyle = "#1e293b";
      for (let x = 0; x < 256; x += 6) {
        for (let y = 0; y < 256; y += 6) {
          if ((x + y) % 12 === 0) {
            ctx.fillRect(x, y, 3, 3);
          }
        }
      }
    }
    const knitTexture = new THREE.CanvasTexture(knitCanvas);
    knitTexture.wrapS = THREE.RepeatWrapping;
    knitTexture.wrapT = THREE.RepeatWrapping;
    knitTexture.repeat.set(6, 6);

    // Materials
    const upperMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(upperColor),
      roughness: 0.55,
      metalness: 0.05,
      map: knitTexture,
    });
    upperMatRef.current = upperMat;

    const foamMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(foamColor),
      roughness: 0.35,
      metalness: 0.05,
    });
    foamMatRef.current = foamMat;

    const swooshMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(swooshColor),
      metalness: 0.85,
      roughness: 0.15,
    });
    swooshMatRef.current = swooshMat;

    // Translucent Air Zoom Pod Material
    const airPodMat = new THREE.MeshPhysicalMaterial({
      color: 0xd97706, // Translucent Amber/Gold Air Zoom pod like photo
      transmission: 0.7,
      opacity: 0.85,
      transparent: true,
      roughness: 0.1,
      metalness: 0.2,
      ior: 1.4,
      thickness: 0.4,
    });
    airPodMatRef.current = airPodMat;

    const blackRubberMat = new THREE.MeshStandardMaterial({
      color: 0x09090b,
      roughness: 0.8,
    });

    // 5a. Massive ZoomX Foam Midsole (High-Stack Curved Champagne Cream Heel from Photo)
    const foamLength = 3.3;
    const foamWidth = 1.4;
    const foamHeight = 0.55;

    const foamGeo = new THREE.BoxGeometry(foamLength, foamHeight, foamWidth);
    const foamMesh = new THREE.Mesh(foamGeo, foamMat);
    foamMesh.position.set(-0.05, -0.18, 0);
    foamMesh.castShadow = true;
    foamMesh.receiveShadow = true;
    shoeGroup.add(foamMesh);

    // Curved Rear Heel Extension (Flared heel stack of Alphafly from photo)
    const heelFlareGeo = new THREE.CylinderGeometry(0.7, 0.4, 0.55, 24, 1, false, Math.PI / 2, Math.PI);
    const heelFlareMesh = new THREE.Mesh(heelFlareGeo, foamMat);
    heelFlareMesh.position.set(-1.45, -0.18, 0);
    heelFlareMesh.rotation.y = Math.PI / 2;
    heelFlareMesh.castShadow = true;
    shoeGroup.add(heelFlareMesh);

    // 5b. Dual Translucent Forefoot Air Zoom Pod Capsules
    const podGroup = new THREE.Group();
    podGroup.position.set(0.75, -0.15, 0);

    const pod1Geo = new THREE.CylinderGeometry(0.28, 0.28, 0.35, 24);
    const pod1 = new THREE.Mesh(pod1Geo, airPodMat);
    pod1.position.set(0, 0, 0.32);
    pod1.rotation.x = Math.PI / 2;
    podGroup.add(pod1);

    const pod2 = new THREE.Mesh(pod1Geo, airPodMat);
    pod2.position.set(0, 0, -0.32);
    pod2.rotation.x = Math.PI / 2;
    podGroup.add(pod2);
    shoeGroup.add(podGroup);

    // 5c. Black Atomknit Upper Mesh
    const upperShape = new THREE.Shape();
    upperShape.moveTo(-1.45, 0.35);
    upperShape.quadraticCurveTo(-0.8, 1.15, 0.2, 0.72);
    upperShape.quadraticCurveTo(1.25, 0.4, 1.6, 0.08);
    upperShape.quadraticCurveTo(1.15, -0.12, 0.0, -0.12);
    upperShape.quadraticCurveTo(-1.0, -0.12, -1.45, 0.35);

    const extrudeSettings = { depth: 1.05, bevelEnabled: true, bevelSegments: 6, steps: 2, bevelSize: 0.08, bevelThickness: 0.08 };
    const upperGeo = new THREE.ExtrudeGeometry(upperShape, extrudeSettings);
    upperGeo.center();
    const upperMesh = new THREE.Mesh(upperGeo, upperMat);
    upperMesh.position.set(0, 0.48, 0);
    upperMesh.castShadow = true;
    shoeGroup.add(upperMesh);

    // 5d. Dual Metallic Gold Swooshes (Sweeping from toe to midfoot like in photo)
    const swooshCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(1.35, 0.4, 0.55),
      new THREE.Vector3(0.65, 0.64, 0.56),
      new THREE.Vector3(-0.15, 0.74, 0.56),
      new THREE.Vector3(-0.75, 0.9, 0.52),
      new THREE.Vector3(-1.1, 0.72, 0.48),
    ]);
    const swooshGeo = new THREE.TubeGeometry(swooshCurve, 32, 0.07, 8, false);
    const swooshMesh = new THREE.Mesh(swooshGeo, swooshMat);
    shoeGroup.add(swooshMesh);

    // Medial side Swoosh
    const swooshCurveMedial = new THREE.CatmullRomCurve3([
      new THREE.Vector3(1.35, 0.4, -0.55),
      new THREE.Vector3(0.65, 0.64, -0.56),
      new THREE.Vector3(-0.15, 0.74, -0.56),
      new THREE.Vector3(-0.75, 0.9, -0.52),
      new THREE.Vector3(-1.1, 0.72, -0.48),
    ]);
    const swooshGeoMedial = new THREE.TubeGeometry(swooshCurveMedial, 32, 0.07, 8, false);
    const swooshMeshMedial = new THREE.Mesh(swooshGeoMedial, swooshMat);
    shoeGroup.add(swooshMeshMedial);

    // 5e. Black Sockliner & Heel Loop
    const collarGeo = new THREE.CylinderGeometry(0.48, 0.52, 0.55, 16);
    const collarMesh = new THREE.Mesh(collarGeo, blackRubberMat);
    collarMesh.position.set(-0.55, 0.88, 0);
    collarMesh.rotation.z = -0.15;
    collarMesh.castShadow = true;
    shoeGroup.add(collarMesh);

    const heelTabGeo = new THREE.BoxGeometry(0.08, 0.45, 0.24);
    const heelTabMesh = new THREE.Mesh(heelTabGeo, blackRubberMat);
    heelTabMesh.position.set(-1.38, 0.88, 0);
    heelTabMesh.rotation.z = 0.25;
    shoeGroup.add(heelTabMesh);

    // Black Rubber Outsole Tread Under Sole
    const outsoleGeo = new THREE.BoxGeometry(3.1, 0.08, 1.25);
    const outsoleMesh = new THREE.Mesh(outsoleGeo, blackRubberMat);
    outsoleMesh.position.set(-0.05, -0.44, 0);
    shoeGroup.add(outsoleMesh);

    // Soft Studio Contact Shadow Plane (Matching exact photo shadow!)
    const shadowPlaneGeo = new THREE.PlaneGeometry(12, 12);
    const shadowPlaneMat = new THREE.ShadowMaterial({ opacity: 0.24 });
    const shadowPlane = new THREE.Mesh(shadowPlaneGeo, shadowPlaneMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -0.48;
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);

    // 6. Animation Loop
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Auto Spin
      if (autoRotate && shoeGroupRef.current) {
        shoeGroupRef.current.rotation.y += 0.006;
      }

      // Smooth Camera Lerp
      if (targetCamPosRef.current && cameraRef.current && controlsRef.current) {
        cameraRef.current.position.lerp(targetCamPosRef.current, 0.08);
        controlsRef.current.update();
        if (cameraRef.current.position.distanceTo(targetCamPosRef.current) < 0.05) {
          targetCamPosRef.current = null;
        }
      } else {
        controls.update();
      }

      renderer.render(scene, camera);
    };

    animate();

    // 7. Responsive Resize Handler
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
      scene.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          (obj as THREE.Mesh).geometry.dispose();
        }
      });
      renderer.forceContextLoss();
      renderer.dispose();
    };
  }, []);

  // Update Shader Colors
  React.useEffect(() => {
    if (upperMatRef.current) {
      upperMatRef.current.color.set(upperColor);
      upperMatRef.current.wireframe = wireframe;
    }
    if (foamMatRef.current) {
      foamMatRef.current.color.set(foamColor);
      foamMatRef.current.wireframe = wireframe;
    }
    if (swooshMatRef.current) {
      swooshMatRef.current.color.set(swooshColor);
      swooshMatRef.current.wireframe = wireframe;
    }
  }, [upperColor, foamColor, swooshColor, wireframe]);

  // Quick Camera Presets
  const setCameraAngle = (angle: string) => {
    setActiveAngle(angle);
    setAutoRotate(false);

    if (!cameraRef.current) return;

    switch (angle) {
      case "bottom": // Nicha View - Bottom Tread & Air Pods
        targetCamPosRef.current = new THREE.Vector3(0.01, -4.5, 0.01);
        break;
      case "top": // Opra View - Top Down
        targetCamPosRef.current = new THREE.Vector3(0.01, 4.5, 0.01);
        break;
      case "side": // Side Profile Angle
        targetCamPosRef.current = new THREE.Vector3(0.01, 0.2, 4.5);
        break;
      case "reset":
        targetCamPosRef.current = new THREE.Vector3(3.8, 1.4, 3.8);
        if (shoeGroupRef.current) {
          shoeGroupRef.current.rotation.set(0, 0.1, 0);
        }
        break;
    }
  };

  return (
    <div
      className={`relative w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden shadow-2xl transition-all duration-300 ${
        fullscreen ? "fixed inset-0 z-50 rounded-none h-screen" : "h-[650px]"
      }`}
    >
      {/* 3D Canvas */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Instructions Badge */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md px-3.5 py-2 rounded-full border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-800 dark:text-zinc-200 shadow-lg">
        <CheckCircle2 className="w-4 h-4 text-emerald-500 animate-pulse" />
        <span>Nike Alphafly Next% 3D | Drag UP/DOWN for Top & Bottom Sole ("Opra-Nicha")</span>
      </div>

      {/* Top Right Quick Angle Presets */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        <button
          onClick={() => setCameraAngle("bottom")}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold border backdrop-blur-md transition-all shadow-md ${
            activeAngle === "bottom"
              ? "bg-amber-500 text-zinc-950 border-amber-400"
              : "bg-white/90 dark:bg-zinc-900/90 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100"
          }`}
          title="Inspect Bottom Sole Tread (Nicha)"
        >
          <ArrowDown className="w-3.5 h-3.5" />
          <span>Sole (Nicha)</span>
        </button>

        <button
          onClick={() => setCameraAngle("top")}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold border backdrop-blur-md transition-all shadow-md ${
            activeAngle === "top"
              ? "bg-cyan-500 text-zinc-950 border-cyan-400"
              : "bg-white/90 dark:bg-zinc-900/90 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100"
          }`}
          title="Inspect Upper (Opra)"
        >
          <ArrowUp className="w-3.5 h-3.5" />
          <span>Top (Opra)</span>
        </button>

        <button
          onClick={() => setCameraAngle("reset")}
          title="Reset View"
          className="p-2 bg-white/90 dark:bg-zinc-900/90 hover:bg-zinc-100 text-zinc-700 dark:text-zinc-300 rounded-full border border-zinc-200 dark:border-zinc-800 backdrop-blur-md transition-all shadow-md"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          onClick={() => setFullscreen(!fullscreen)}
          title="Toggle Fullscreen"
          className="p-2 bg-white/90 dark:bg-zinc-900/90 hover:bg-zinc-100 text-zinc-700 dark:text-zinc-300 rounded-full border border-zinc-200 dark:border-zinc-800 backdrop-blur-md transition-all shadow-md"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Bottom Floating Control Panel */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 w-[94%] max-w-3xl bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 p-4 rounded-2xl shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Upper Body Color */}
        <div className="flex flex-col gap-1.5 w-full md:w-auto">
          <span className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-1">
            <Palette className="w-3.5 h-3.5 text-zinc-500" /> Upper Knit
          </span>
          <div className="flex items-center gap-1.5">
            {UPPER_COLOR_PRESETS.map((preset) => (
              <button
                key={preset.hex}
                onClick={() => setUpperColor(preset.hex)}
                style={{ backgroundColor: preset.hex }}
                className={`w-6 h-6 rounded-full border-2 transition-all hover:scale-110 ${
                  upperColor === preset.hex
                    ? "border-amber-400 ring-2 ring-amber-400/50 scale-110"
                    : "border-zinc-300 dark:border-zinc-700"
                }`}
                title={preset.name}
              />
            ))}
          </div>
        </div>

        {/* ZoomX Foam Color */}
        <div className="flex flex-col gap-1.5 w-full md:w-auto">
          <span className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-1">
            <Sun className="w-3.5 h-3.5 text-amber-500" /> ZoomX Foam Sole
          </span>
          <div className="flex items-center gap-1.5">
            {FOAM_COLOR_PRESETS.map((preset) => (
              <button
                key={preset.hex}
                onClick={() => setFoamColor(preset.hex)}
                style={{ backgroundColor: preset.hex }}
                className={`w-6 h-6 rounded-full border-2 transition-all hover:scale-110 ${
                  foamColor === preset.hex
                    ? "border-amber-400 ring-2 ring-amber-400/50 scale-110"
                    : "border-zinc-300 dark:border-zinc-700"
                }`}
                title={preset.name}
              />
            ))}
          </div>
        </div>

        {/* Metallic Swoosh Accent */}
        <div className="flex flex-col gap-1.5 w-full md:w-auto">
          <span className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-yellow-500" /> Gold Swoosh
          </span>
          <div className="flex items-center gap-1.5">
            {SWOOSH_COLOR_PRESETS.map((preset) => (
              <button
                key={preset.hex}
                onClick={() => setSwooshColor(preset.hex)}
                style={{ backgroundColor: preset.hex }}
                className={`w-6 h-6 rounded-full border-2 transition-all hover:scale-110 ${
                  swooshColor === preset.hex
                    ? "border-amber-400 ring-2 ring-amber-400/50 scale-110"
                    : "border-zinc-300 dark:border-zinc-700"
                }`}
                title={preset.name}
              />
            ))}
          </div>
        </div>

        {/* Action Toggles */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end border-t md:border-t-0 border-zinc-200 dark:border-zinc-800 pt-2 md:pt-0">
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
              autoRotate
                ? "bg-amber-500/20 border-amber-500/50 text-amber-600 dark:text-amber-300"
                : "bg-zinc-100 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400"
            }`}
          >
            {autoRotate ? "Auto Spin On" : "Auto Spin Off"}
          </button>

          <button
            onClick={() => setWireframe(!wireframe)}
            className={`p-1.5 rounded-xl border text-xs transition-all ${
              wireframe
                ? "bg-amber-500/20 border-amber-500/50 text-amber-600 dark:text-amber-300"
                : "bg-zinc-100 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400"
            }`}
            title="Wireframe View"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
