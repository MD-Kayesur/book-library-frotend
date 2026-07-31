# 🚀 Three.js 3D WebGL Interactive Master Guide

A complete, step-by-step blueprint for building production-grade, interactive 3D WebGL scenes and customizers in React & Next.js using Three.js.

---

## 📋 Table of Contents
1. [Prerequisites & Package Setup](#1-prerequisites--package-setup)
2. [Step 1: WebGL Container & Client Isolation](#step-1-webgl-container--client-isolation)
3. [Step 2: Core 3D Trinity (Scene, Camera, Renderer)](#step-2-core-3d-trinity-scene-camera-renderer)
4. [Step 3: Orbit Controls for 360° Mouse Interaction](#step-3-orbit-controls-for-360-mouse-interaction)
5. [Step 4: Professional Studio Lighting Setup](#step-4-professional-studio-lighting-setup)
6. [Step 5: Creating Procedural 3D Objects & Mesh Groups](#step-5-creating-procedural-3d-objects--mesh-groups)
7. [Step 6: Realistic Materials & Shaders (Gold, Glass, Metal)](#step-6-realistic-materials--shaders-gold-glass-metal)
8. [Step 7: The Animation Render Loop & Smooth Physics](#step-7-the-animation-render-loop--smooth-physics)
9. [Step 8: React State Sync for Real-Time Customization](#step-8-react-state-sync-for-real-time-customization)
10. [Step 9: Responsive Canvas & Memory Cleanup](#step-9-responsive-canvas--memory-cleanup)

---

## 1. Prerequisites & Package Setup

Install Three.js and TypeScript types:

```bash
npm install three @types/three
```

---

## Step 1: WebGL Container & Client Isolation

Three.js interacts directly with WebGL DOM APIs. In Next.js App Router, mark your 3D component with `"use client"` and attach Three.js to a container `div` via `useRef`.

```tsx
"use client";

import * as React from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export function Custom3DViewer() {
  const containerRef = React.useRef<HTMLDivElement>(null);

  return (
    <div className="relative w-full h-[650px] bg-zinc-950 rounded-2xl overflow-hidden">
      {/* 3D WebGL Canvas Container */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
    </div>
  );
}
```

---

## Step 2: Core 3D Trinity (Scene, Camera, Renderer)

Inside a `React.useEffect`, initialize the **Scene**, **Camera**, and **WebGLRenderer**:

```tsx
React.useEffect(() => {
  const container = containerRef.current;
  if (!container) return;

  // 1. Scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x09090b); // Deep dark background
  scene.fog = new THREE.FogExp2(0x09090b, 0.035); // Atmospheric depth fog

  // 2. Perspective Camera (Field of View, Aspect Ratio, Near, Far)
  const aspect = container.clientWidth / container.clientHeight;
  const camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 100);
  camera.position.set(3.5, 2.5, 4.5);

  // 3. WebGL Renderer with Soft Shadows & Filmic Tone Mapping
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Ultra smooth shadows
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;

  container.innerHTML = "";
  container.appendChild(renderer.domElement);
}, []);
```

---

## Step 3: Orbit Controls for 360° Mouse Interaction

Use `OrbitControls` to give users full mouse orbiting capabilities:
- **Left-Click + Drag**: Rotate model
- **Scroll Wheel**: Zoom in / out
- **Right-Click + Drag**: Pan camera

```tsx
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Enables smooth inertia physics
controls.dampingFactor = 0.05;
controls.minDistance = 2.0;
controls.maxDistance = 12;

// Unrestricted vertical rotation (0.01 to PI - 0.01 rad allows top & bottom sole views)
controls.minPolarAngle = 0.01;
controls.maxPolarAngle = Math.PI - 0.01;
controls.target.set(0, 0, 0);
```

---

## Step 4: Professional Studio Lighting Setup

Combine ambient, directional key lights, bottom uplights, and accent rim lights for maximum depth:

```tsx
// 1. Soft Ambient Fill Light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

// 2. Main Key Directional Light (Casts Shadow)
const dirLight = new THREE.DirectionalLight(0xffffff, 2.0);
dirLight.position.set(5, 8, 5);
dirLight.castShadow = true;
dirLight.shadow.mapSize.width = 2048;
dirLight.shadow.mapSize.height = 2048;
scene.add(dirLight);

// 3. Bottom Uplight (Ensures bottom of object is clearly visible when rotated)
const bottomLight = new THREE.DirectionalLight(0xffffff, 1.2);
bottomLight.position.set(-3, -8, -3);
scene.add(bottomLight);

// 4. Colored Accent Rim Light
const rimLight = new THREE.PointLight(0x38bdf8, 1.5, 12);
rimLight.position.set(-4, 3, -4);
scene.add(rimLight);
```

---

## Step 5: Creating Procedural 3D Objects & Mesh Groups

Group primitive geometries or custom shapes inside a `THREE.Group()` so you can rotate or animate the entire product as one object:

```tsx
const productGroup = new THREE.Group();
scene.add(productGroup);

// Example: Combining Box & Cylinder Geometries
const bodyGeo = new THREE.BoxGeometry(2.0, 1.0, 1.0);
const bodyMesh = new THREE.Mesh(bodyGeo, bodyMaterial);
bodyMesh.castShadow = true;
productGroup.add(bodyMesh);

const detailGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.5, 32);
const detailMesh = new THREE.Mesh(detailGeo, accentMaterial);
detailMesh.position.set(0, 0.6, 0);
productGroup.add(detailMesh);
```

---

## Step 6: Realistic Materials & Shaders (Gold, Glass, Metal)

### Standard Matte / Glossy Material
```tsx
const mainMaterial = new THREE.MeshStandardMaterial({
  color: 0x2563eb,
  roughness: 0.3, // Lower = glossier
  metalness: 0.1, // Higher = more metallic reflection
});
```

### Metallic Gold Material
```tsx
const goldMaterial = new THREE.MeshStandardMaterial({
  color: 0xd4af37,
  roughness: 0.15,
  metalness: 0.9,
});
```

### Translucent Glass / Glass Capsule (`MeshPhysicalMaterial`)
```tsx
const glassPodMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xff5500,
  transmission: 0.65, // Glass transparency
  opacity: 0.9,
  transparent: true,
  roughness: 0.1,
  ior: 1.4, // Index of Refraction
  thickness: 0.4,
});
```

---

## Step 7: The Animation Render Loop & Smooth Physics

Use `requestAnimationFrame` to run the render loop, update `OrbitControls`, and handle auto-rotation or smooth camera angle transitions:

```tsx
let animationFrameId: number;

const animate = () => {
  animationFrameId = requestAnimationFrame(animate);

  // 1. Auto Spin
  if (autoRotate && productGroup) {
    productGroup.rotation.y += 0.006;
  }

  // 2. Smooth Camera Angle Position Interpolation
  if (targetCamPos && camera) {
    camera.position.lerp(targetCamPos, 0.08); // Smooth transition
  }

  // 3. Update Controls & Render
  controls.update();
  renderer.render(scene, camera);
};

animate();
```

---

## Step 8: React State Sync for Real-Time Customization

Store materials in `useRef` and use `React.useEffect` to sync user UI selections (color pickers, wireframe toggles) in real time without tearing down the WebGL scene:

```tsx
const materialRef = React.useRef<THREE.MeshStandardMaterial | null>(null);
const [color, setColor] = React.useState("#2563eb");
const [wireframe, setWireframe] = React.useState(false);

// Real-time material update effect
React.useEffect(() => {
  if (materialRef.current) {
    materialRef.current.color.set(color);
    materialRef.current.wireframe = wireframe;
    materialRef.current.needsUpdate = true;
  }
}, [color, wireframe]);
```

---

## Step 9: Responsive Canvas & Memory Cleanup

Always handle window resize events and clean up WebGL memory when the React component unmounts:

```tsx
// Resize handler
const handleResize = () => {
  if (!container || !renderer) return;
  const w = container.clientWidth;
  const h = container.clientHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
};

window.addEventListener("resize", handleResize);

// Clean up effect return function
return () => {
  window.removeEventListener("resize", handleResize);
  cancelAnimationFrame(animationFrameId);
  renderer.dispose();
};
```

---

## 🎯 Summary Checklist for Any Project
1. **Setup `"use client"`** & create container ref.
2. **Initialize Scene, Perspective Camera, and WebGLRenderer** with soft shadows.
3. **Attach OrbitControls** with damping.
4. **Add Ambient, Directional Key, and Uplights**.
5. **Create 3D Meshes & Group them**.
6. **Set up Animation Loop** (`controls.update()`, `renderer.render()`).
7. **Sync React State** (Color, Wireframe, Camera Presets).
8. **Clean up memory on unmount**.
