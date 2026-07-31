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
} from "lucide-react";

// Color presets for the Racing Super-Shoe
const UPPER_COLOR_PRESETS = [
  { name: "Pro White", hex: "#f8fafc" },
  { name: "Stealth Black", hex: "#0f172a" },
  { name: "Neon Volt", hex: "#84cc16" },
  { name: "Cyber Teal", hex: "#06b6d4" },
];

const SWOOSH_COLOR_PRESETS = [
  { name: "Electric Royal Blue", hex: "#2563eb" },
  { name: "Hyper Violet", hex: "#9333ea" },
  { name: "Crimson Red", hex: "#ef4444" },
  { name: "Metallic Gold", hex: "#eab308" },
];

const AIR_POD_COLOR_PRESETS = [
  { name: "Translucent Orange", hex: "#ff5500" },
  { name: "Neon Lime Pod", hex: "#22c55e" },
  { name: "Hyper Pink Pod", hex: "#ec4899" },
  { name: "Electric Cyan Pod", hex: "#00d8ff" },
];

export function Shoe3DViewer() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const rendererRef = React.useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = React.useRef<OrbitControls | null>(null);
  const cameraRef = React.useRef<THREE.PerspectiveCamera | null>(null);
  const shoeGroupRef = React.useRef<THREE.Group | null>(null);

  // Material Refs for Live Customization
  const upperMatRef = React.useRef<THREE.MeshStandardMaterial | null>(null);
  const swooshMatRef = React.useRef<THREE.MeshStandardMaterial | null>(null);
  const airPodMatRef = React.useRef<THREE.MeshPhysicalMaterial | null>(null);
  const spikeMatRef = React.useRef<THREE.MeshStandardMaterial | null>(null);

  // UI States
  const [upperColor, setUpperColor] = React.useState(UPPER_COLOR_PRESETS[0].hex);
  const [swooshColor, setSwooshColor] = React.useState(SWOOSH_COLOR_PRESETS[0].hex);
  const [airPodColor, setAirPodColor] = React.useState(AIR_POD_COLOR_PRESETS[0].hex);
  const [autoRotate, setAutoRotate] = React.useState(true);
  const [wireframe, setWireframe] = React.useState(false);
  const [fullscreen, setFullscreen] = React.useState(false);
  const [activeAngle, setActiveAngle] = React.useState<string>("default");

  const targetCamPosRef = React.useRef<THREE.Vector3 | null>(null);

  // Setup Three.js Scene
  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene & Dark Gradient Background with Floor Glow
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x060814); // Deep navy dark background like reference image
    scene.fog = new THREE.FogExp2(0x060814, 0.03);

    const aspect = container.clientWidth / container.clientHeight;
    const camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 100);
    // Initial camera position matching the dynamic 45° floating perspective in the image
    camera.position.set(3.6, 1.8, 3.8);
    cameraRef.current = camera;

    // 2. WebGL Renderer with High-End Lighting & Translucent Glass Shaders
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;

    container.innerHTML = "";
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 3. OrbitControls (Unrestricted 360° Mouse Orbiting: Top, Bottom Sole, Sides)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 12;
    controls.minDistance = 1.8;
    controls.minPolarAngle = 0.01; // Allows looking straight down from top
    controls.maxPolarAngle = Math.PI - 0.01; // Allows looking straight up under bottom sole
    controls.target.set(0, 0.2, 0);
    controlsRef.current = controls;

    // 4. Lighting Environment (Top key light, bottom sole uplight, vibrant blue floor glow)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const topKeyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    topKeyLight.position.set(5, 8, 6);
    topKeyLight.castShadow = true;
    topKeyLight.shadow.mapSize.width = 2048;
    topKeyLight.shadow.mapSize.height = 2048;
    scene.add(topKeyLight);

    // Bottom Uplight to illuminate sole spikes & Air Pod underneath
    const bottomLight = new THREE.DirectionalLight(0xff8833, 1.8);
    bottomLight.position.set(-3, -8, -2);
    scene.add(bottomLight);

    // Deep Blue Floor Ambient Light (Recreating the image's blue glow horizon)
    const floorGlowLight = new THREE.PointLight(0x2563eb, 3.5, 15);
    floorGlowLight.position.set(0, -3, 0);
    scene.add(floorGlowLight);

    const rimLight = new THREE.PointLight(0x38bdf8, 1.8, 10);
    rimLight.position.set(-4, 3, -4);
    scene.add(rimLight);

    // 5. Build 3D Nike Air Zoom Track Spike Super-Shoe Model
    const shoeGroup = new THREE.Group();
    // Default tilt angle matching the image floating posture
    shoeGroup.rotation.z = 0.25;
    shoeGroup.rotation.x = -0.15;
    shoeGroupRef.current = shoeGroup;
    scene.add(shoeGroup);

    // Materials
    const upperMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(upperColor),
      roughness: 0.25,
      metalness: 0.05,
    });
    upperMatRef.current = upperMat;

    const swooshMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(swooshColor),
      roughness: 0.15,
      metalness: 0.6,
    });
    swooshMatRef.current = swooshMat;

    // Translucent Orange Air Zoom Pod Cushion Material
    const airPodMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(airPodColor),
      transmission: 0.65,
      opacity: 0.9,
      transparent: true,
      roughness: 0.1,
      metalness: 0.1,
      ior: 1.4,
      thickness: 0.4,
    });
    airPodMatRef.current = airPodMat;

    const spikeMat = new THREE.MeshStandardMaterial({
      color: 0xff5500,
      metalness: 0.8,
      roughness: 0.2,
    });
    spikeMatRef.current = spikeMat;

    const carbonPlateMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.3,
      metalness: 0.7,
    });

    const innerLiningMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.8,
    });

    // 5a. Sleek Racing Shoe Upper Mesh (Aerodynamic Slanted Body)
    const upperShape = new THREE.Shape();
    upperShape.moveTo(-1.4, 0.4);
    upperShape.quadraticCurveTo(-0.8, 1.1, 0.2, 0.7);
    upperShape.quadraticCurveTo(1.2, 0.4, 1.6, 0.1);
    upperShape.quadraticCurveTo(1.2, -0.2, 0.0, -0.2);
    upperShape.quadraticCurveTo(-1.0, -0.2, -1.4, 0.4);

    const extrudeSettings = { depth: 0.9, bevelEnabled: true, bevelSegments: 6, steps: 2, bevelSize: 0.1, bevelThickness: 0.1 };
    const upperGeo = new THREE.ExtrudeGeometry(upperShape, extrudeSettings);
    upperGeo.center();
    const upperMesh = new THREE.Mesh(upperGeo, upperMat);
    upperMesh.position.set(0, 0.45, 0);
    upperMesh.castShadow = true;
    shoeGroup.add(upperMesh);

    // Ankle Collar Inner Mesh
    const collarGeo = new THREE.CylinderGeometry(0.42, 0.48, 0.6, 16);
    const collarMesh = new THREE.Mesh(collarGeo, innerLiningMat);
    collarMesh.position.set(-0.55, 0.85, 0);
    collarMesh.rotation.z = -0.2;
    shoeGroup.add(collarMesh);

    // 5b. Translucent Orange Air Zoom Cushion Pods (Forefoot Cushion Pods under sole)
    const airPodPodGroup = new THREE.Group();
    airPodPodGroup.position.set(0.75, 0.05, 0);

    const pod1Geo = new THREE.CylinderGeometry(0.28, 0.28, 0.32, 24);
    const pod1 = new THREE.Mesh(pod1Geo, airPodMat);
    pod1.position.set(0, 0, 0.3);
    pod1.rotation.x = Math.PI / 2;
    airPodPodGroup.add(pod1);

    const pod2 = new THREE.Mesh(pod1Geo, airPodMat);
    pod2.position.set(0, 0, -0.3);
    pod2.rotation.x = Math.PI / 2;
    airPodPodGroup.add(pod2);

    // Inner Glowing Core of Air Zoom Pod
    const coreGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.34, 16);
    const coreMat = new THREE.MeshBasicMaterial({ color: 0xffaa00 });
    const core1 = new THREE.Mesh(coreGeo, coreMat);
    core1.position.set(0, 0, 0.3);
    core1.rotation.x = Math.PI / 2;
    airPodPodGroup.add(core1);

    const core2 = new THREE.Mesh(coreGeo, coreMat);
    core2.position.set(0, 0, -0.3);
    core2.rotation.x = Math.PI / 2;
    airPodPodGroup.add(core2);

    shoeGroup.add(airPodPodGroup);

    // 5c. Carbon Flyplate / Midsole Wave (Extending along the bottom sole)
    const plateGeo = new THREE.BoxGeometry(2.9, 0.12, 1.05);
    const plateMesh = new THREE.Mesh(plateGeo, carbonPlateMat);
    plateMesh.position.set(0.05, 0.15, 0);
    plateMesh.rotation.z = -0.08;
    plateMesh.castShadow = true;
    shoeGroup.add(plateMesh);

    // 5d. Track Spike Plate & Spikes (Forefoot Outsole with Spikes for "Nicha" View)
    const spikePlateGeo = new THREE.BoxGeometry(1.2, 0.1, 1.0);
    const spikePlateMesh = new THREE.Mesh(spikePlateGeo, spikeMat);
    spikePlateMesh.position.set(0.9, -0.05, 0);
    spikePlateMesh.castShadow = true;
    shoeGroup.add(spikePlateMesh);

    // Track Metal Spikes / Studs protruding from front sole
    const spikeGroup = new THREE.Group();
    spikeGroup.position.set(0.9, -0.15, 0);

    const spikePositions = [
      [0.3, 0.35], [0.3, -0.35],
      [0.0, 0.38], [0.0, -0.38],
      [-0.3, 0.3], [-0.3, -0.3],
      [0.4, 0.0]
    ];

    spikePositions.forEach(([x, z]) => {
      const spikeGeo = new THREE.ConeGeometry(0.045, 0.18, 8);
      const spikeMesh = new THREE.Mesh(spikeGeo, spikeMat);
      spikeMesh.position.set(x, 0, z);
      spikeMesh.rotation.x = Math.PI; // point downwards
      spikeGroup.add(spikeMesh);
    });
    shoeGroup.add(spikeGroup);

    // Heel Carbon Outsole Cushion Guard
    const heelOutsoleGeo = new THREE.BoxGeometry(1.0, 0.14, 0.85);
    const heelOutsoleMesh = new THREE.Mesh(heelOutsoleGeo, carbonPlateMat);
    heelOutsoleMesh.position.set(-0.85, 0.08, 0);
    shoeGroup.add(heelOutsoleMesh);

    // 5e. Iconic Large Blue Swoosh Logo Sweeping Across Lateral Side
    // Curved Swoosh geometry matching the exact blue swoosh in user image
    const swooshCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(1.3, 0.38, 0.52),
      new THREE.Vector3(0.6, 0.62, 0.53),
      new THREE.Vector3(-0.2, 0.72, 0.53),
      new THREE.Vector3(-0.8, 0.88, 0.48),
      new THREE.Vector3(-1.1, 0.7, 0.46),
    ]);
    const swooshGeo = new THREE.TubeGeometry(swooshCurve, 32, 0.08, 8, false);
    const swooshMesh = new THREE.Mesh(swooshGeo, swooshMat);
    shoeGroup.add(swooshMesh);

    // Medial side Swoosh
    const swooshCurveMedial = new THREE.CatmullRomCurve3([
      new THREE.Vector3(1.3, 0.38, -0.52),
      new THREE.Vector3(0.6, 0.62, -0.53),
      new THREE.Vector3(-0.2, 0.72, -0.53),
      new THREE.Vector3(-0.8, 0.88, -0.48),
      new THREE.Vector3(-1.1, 0.7, -0.46),
    ]);
    const swooshGeoMedial = new THREE.TubeGeometry(swooshCurveMedial, 32, 0.08, 8, false);
    const swooshMeshMedial = new THREE.Mesh(swooshGeoMedial, swooshMat);
    shoeGroup.add(swooshMeshMedial);

    // Floating Ground Shadow Plane with Blue Ambient Glow
    const shadowPlaneGeo = new THREE.PlaneGeometry(12, 12);
    const shadowPlaneMat = new THREE.ShadowMaterial({ opacity: 0.55 });
    const shadowPlane = new THREE.Mesh(shadowPlaneGeo, shadowPlaneMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -0.8;
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);

    // 6. Animation Loop
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Auto Rotation
      if (autoRotate && shoeGroupRef.current) {
        shoeGroupRef.current.rotation.y += 0.007;
      }

      // Smooth Camera Angle Lerp Interpolation
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

    // 7. Resize Handler
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
    if (swooshMatRef.current) {
      swooshMatRef.current.color.set(swooshColor);
      swooshMatRef.current.wireframe = wireframe;
    }
    if (airPodMatRef.current) {
      airPodMatRef.current.color.set(airPodColor);
      airPodMatRef.current.wireframe = wireframe;
    }
  }, [upperColor, swooshColor, airPodColor, wireframe]);

  // Quick Camera Presets
  const setCameraAngle = (angle: string) => {
    setActiveAngle(angle);
    setAutoRotate(false);

    if (!cameraRef.current) return;

    switch (angle) {
      case "bottom": // Nicha View - Directly looking under sole at spikes & Air Zoom Pods
        targetCamPosRef.current = new THREE.Vector3(0.01, -4.5, 0.01);
        break;
      case "top": // Opra View - Directly looking down from top
        targetCamPosRef.current = new THREE.Vector3(0.01, 4.5, 0.01);
        break;
      case "side": // Lateral Swoosh View
        targetCamPosRef.current = new THREE.Vector3(0.01, 0.4, 4.5);
        break;
      case "reset":
        targetCamPosRef.current = new THREE.Vector3(3.6, 1.8, 3.8);
        if (shoeGroupRef.current) {
          shoeGroupRef.current.rotation.set(0.25, 0, -0.15);
        }
        break;
    }
  };

  return (
    <div
      className={`relative w-full rounded-2xl border border-zinc-800 bg-zinc-950 overflow-hidden shadow-2xl transition-all duration-300 ${
        fullscreen ? "fixed inset-0 z-50 rounded-none h-screen" : "h-[680px]"
      }`}
    >
      {/* 3D WebGL Canvas */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Badge Instructions */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-zinc-900/80 backdrop-blur-md px-3.5 py-2 rounded-full border border-zinc-800 text-xs font-medium text-zinc-300 shadow-lg">
        <MousePointer className="w-4 h-4 text-cyan-400 animate-pulse" />
        <span>Drag UP/DOWN for Top & Bottom Sole ("Opra-Nicha") | 360° Mouse Control</span>
      </div>

      {/* Top Right Quick Angle Presets */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        <button
          onClick={() => setCameraAngle("bottom")}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold border backdrop-blur-md transition-all shadow-md ${
            activeAngle === "bottom"
              ? "bg-amber-500 text-zinc-950 border-amber-400"
              : "bg-zinc-900/80 text-zinc-300 border-zinc-800 hover:bg-zinc-800"
          }`}
          title="Inspect Air Pod & Spikes Bottom Sole (Nicha)"
        >
          <ArrowDown className="w-3.5 h-3.5" />
          <span>Sole (Nicha)</span>
        </button>

        <button
          onClick={() => setCameraAngle("top")}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold border backdrop-blur-md transition-all shadow-md ${
            activeAngle === "top"
              ? "bg-cyan-500 text-zinc-950 border-cyan-400"
              : "bg-zinc-900/80 text-zinc-300 border-zinc-800 hover:bg-zinc-800"
          }`}
          title="Inspect Upper Top View (Opra)"
        >
          <ArrowUp className="w-3.5 h-3.5" />
          <span>Top (Opra)</span>
        </button>

        <button
          onClick={() => setCameraAngle("reset")}
          title="Reset View"
          className="p-2 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 rounded-full border border-zinc-800 backdrop-blur-md transition-all shadow-md"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          onClick={() => setFullscreen(!fullscreen)}
          title="Toggle Fullscreen"
          className="p-2 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 rounded-full border border-zinc-800 backdrop-blur-md transition-all shadow-md"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Bottom Floating Customizer Controls Bar */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 w-[94%] max-w-3xl bg-zinc-900/90 backdrop-blur-xl border border-zinc-800 p-4 rounded-2xl shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Upper Body Color */}
        <div className="flex flex-col gap-1.5 w-full md:w-auto">
          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
            <Palette className="w-3.5 h-3.5 text-slate-300" /> Upper Body
          </span>
          <div className="flex items-center gap-1.5">
            {UPPER_COLOR_PRESETS.map((preset) => (
              <button
                key={preset.hex}
                onClick={() => setUpperColor(preset.hex)}
                style={{ backgroundColor: preset.hex }}
                className={`w-6 h-6 rounded-full border-2 transition-all hover:scale-110 ${
                  upperColor === preset.hex
                    ? "border-cyan-400 ring-2 ring-cyan-400/50 scale-110"
                    : "border-zinc-700"
                }`}
                title={preset.name}
              />
            ))}
          </div>
        </div>

        {/* Swoosh Logo Color */}
        <div className="flex flex-col gap-1.5 w-full md:w-auto">
          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" /> Swoosh Logo
          </span>
          <div className="flex items-center gap-1.5">
            {SWOOSH_COLOR_PRESETS.map((preset) => (
              <button
                key={preset.hex}
                onClick={() => setSwooshColor(preset.hex)}
                style={{ backgroundColor: preset.hex }}
                className={`w-6 h-6 rounded-full border-2 transition-all hover:scale-110 ${
                  swooshColor === preset.hex
                    ? "border-blue-400 ring-2 ring-blue-400/50 scale-110"
                    : "border-zinc-700"
                }`}
                title={preset.name}
              />
            ))}
          </div>
        </div>

        {/* Air Zoom Pod Color */}
        <div className="flex flex-col gap-1.5 w-full md:w-auto">
          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-amber-400" /> Air Zoom Cushion
          </span>
          <div className="flex items-center gap-1.5">
            {AIR_POD_COLOR_PRESETS.map((preset) => (
              <button
                key={preset.hex}
                onClick={() => setAirPodColor(preset.hex)}
                style={{ backgroundColor: preset.hex }}
                className={`w-6 h-6 rounded-full border-2 transition-all hover:scale-110 ${
                  airPodColor === preset.hex
                    ? "border-amber-400 ring-2 ring-amber-400/50 scale-110"
                    : "border-zinc-700"
                }`}
                title={preset.name}
              />
            ))}
          </div>
        </div>

        {/* Action Toggles */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end border-t md:border-t-0 border-zinc-800 pt-2 md:pt-0">
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
              autoRotate
                ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-300"
                : "bg-zinc-950/80 border-zinc-800 text-zinc-400"
            }`}
          >
            {autoRotate ? "Auto Spin On" : "Auto Spin Off"}
          </button>

          <button
            onClick={() => setWireframe(!wireframe)}
            className={`p-1.5 rounded-xl border text-xs transition-all ${
              wireframe
                ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-300"
                : "bg-zinc-950/80 border-zinc-800 text-zinc-400"
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
