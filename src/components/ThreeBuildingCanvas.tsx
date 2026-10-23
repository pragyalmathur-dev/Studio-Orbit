import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface ThreeBuildingCanvasProps {
  progress: number; // 0.0 to 1.0 scroll progress
  reducedMotion?: boolean;
}

export const ThreeBuildingCanvas: React.FC<ThreeBuildingCanvasProps> = ({
  progress,
  reducedMotion = false,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(progress);
  const currentProgressRef = useRef(progress);
  const [webGlSupported, setWebGlSupported] = useState(true);

  // Keep progressRef updated with latest prop
  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Test WebGL support
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setWebGlSupported(false);
        return;
      }
    } catch {
      setWebGlSupported(false);
      return;
    }

    let animationFrameId: number;
    let isDisposed = false;

    // 1. Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1e1b); // Deep dark charcoal to match stage background
    scene.fog = new THREE.FogExp2(0x1a1e1b, 0.022);

    // 2. Camera setup - stable three-quarter architectural perspective
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    const camera = new THREE.PerspectiveCamera(32, width / height, 0.1, 100);
    const baseCamPos = new THREE.Vector3(13.5, 9.5, 14.5);
    camera.position.copy(baseCamPos);
    camera.lookAt(0, 1.4, 0);

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    container.appendChild(renderer.domElement);

    // Handle WebGL context events
    const handleContextLost = (e: Event) => {
      e.preventDefault();
      cancelAnimationFrame(animationFrameId);
    };
    const handleContextRestored = () => {
      // Reinitialize if restored
    };
    renderer.domElement.addEventListener('webglcontextlost', handleContextLost);
    renderer.domElement.addEventListener('webglcontextrestored', handleContextRestored);

    // 4. Lighting setup - Soft architectural studio lighting
    const ambientLight = new THREE.AmbientLight(0xdbe4dc, 0.85);
    scene.add(ambientLight);

    // Key Light (warm low-angle morning sunlight)
    const sunLight = new THREE.DirectionalLight(0xfff6e8, 1.8);
    sunLight.position.set(16, 22, 12);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.camera.near = 5;
    sunLight.shadow.camera.far = 45;
    sunLight.shadow.camera.left = -12;
    sunLight.shadow.camera.right = 12;
    sunLight.shadow.camera.top = 12;
    sunLight.shadow.camera.bottom = -12;
    sunLight.shadow.bias = -0.0005;
    scene.add(sunLight);

    // Fill Light (cool sky tone from opposite side)
    const fillLight = new THREE.DirectionalLight(0x9aaec0, 0.7);
    fillLight.position.set(-14, 12, -10);
    scene.add(fillLight);

    // Subtle Rim Light for edge definition
    const rimLight = new THREE.DirectionalLight(0xdfe7dc, 0.6);
    rimLight.position.set(0, 10, -18);
    scene.add(rimLight);

    // 5. Materials
    const materials = {
      stoneLimestone: new THREE.MeshStandardMaterial({
        color: 0xdedad2,
        roughness: 0.82,
        metalness: 0.05,
      }),
      stonePlatform: new THREE.MeshStandardMaterial({
        color: 0xcdc7bc,
        roughness: 0.9,
        metalness: 0.02,
      }),
      groundTerrain: new THREE.MeshStandardMaterial({
        color: 0x364036,
        roughness: 0.95,
        metalness: 0.0,
      }),
      bronzeMetal: new THREE.MeshStandardMaterial({
        color: 0x222623,
        roughness: 0.35,
        metalness: 0.65,
      }),
      glass: new THREE.MeshStandardMaterial({
        color: 0xb5c4b8,
        roughness: 0.1,
        metalness: 0.15,
        transparent: true,
        opacity: 0.42,
      }),
      woodCedar: new THREE.MeshStandardMaterial({
        color: 0x9e7b5a,
        roughness: 0.65,
        metalness: 0.05,
      }),
      waterPool: new THREE.MeshStandardMaterial({
        color: 0x2f3e3a,
        roughness: 0.08,
        metalness: 0.8,
      }),
      interiorMarble: new THREE.MeshStandardMaterial({
        color: 0xedeae3,
        roughness: 0.4,
        metalness: 0.1,
      }),
      foliage: new THREE.MeshStandardMaterial({
        color: 0x54634e,
        roughness: 0.85,
        metalness: 0.0,
      }),
    };

    // 6. Architectural Building Components
    // Layer Groups that will separate during scroll
    const landscapeGroup = new THREE.Group();
    const foundationGroup = new THREE.Group();
    const groundInteriorGroup = new THREE.Group();
    const groundWallsGroup = new THREE.Group();
    const groundGlazingGroup = new THREE.Group();
    const upperSlabGroup = new THREE.Group();
    const upperWallsGroup = new THREE.Group();
    const upperGlazingGroup = new THREE.Group();
    const roofGroup = new THREE.Group();

    scene.add(landscapeGroup);
    scene.add(foundationGroup);
    scene.add(groundInteriorGroup);
    scene.add(groundWallsGroup);
    scene.add(groundGlazingGroup);
    scene.add(upperSlabGroup);
    scene.add(upperWallsGroup);
    scene.add(upperGlazingGroup);
    scene.add(roofGroup);

    // --- A. LANDSCAPE BASE (Always Anchored at Ground) ---
    // Terrain base
    const terrainGeo = new THREE.BoxGeometry(22, 0.4, 18);
    const terrainMesh = new THREE.Mesh(terrainGeo, materials.groundTerrain);
    terrainMesh.position.set(0, -0.2, 0);
    terrainMesh.receiveShadow = true;
    landscapeGroup.add(terrainMesh);

    // Reflecting Pool
    const poolGeo = new THREE.BoxGeometry(6.5, 0.15, 3.2);
    const poolMesh = new THREE.Mesh(poolGeo, materials.waterPool);
    poolMesh.position.set(4.2, 0.05, 4.8);
    poolMesh.receiveShadow = true;
    landscapeGroup.add(poolMesh);

    // Stone pool coping frame
    const poolFrameGeo = new THREE.BoxGeometry(6.9, 0.18, 3.6);
    const poolFrameMesh = new THREE.Mesh(poolFrameGeo, materials.stonePlatform);
    poolFrameMesh.position.set(4.2, -0.01, 4.8);
    poolFrameMesh.receiveShadow = true;
    landscapeGroup.add(poolFrameMesh);

    // Architectural perimeter hedge blocks
    const hedge1 = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.8, 6.0), materials.foliage);
    hedge1.position.set(-8.5, 0.4, -2.0);
    hedge1.castShadow = true;
    hedge1.receiveShadow = true;
    landscapeGroup.add(hedge1);

    const hedge2 = new THREE.Mesh(new THREE.BoxGeometry(5.0, 0.6, 1.0), materials.foliage);
    hedge2.position.set(-4.0, 0.3, -7.0);
    hedge2.castShadow = true;
    hedge2.receiveShadow = true;
    landscapeGroup.add(hedge2);

    // Minimalist pathway pavers
    for (let i = 0; i < 4; i++) {
      const paver = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.06, 0.8), materials.stonePlatform);
      paver.position.set(-2.5 + i * 2.2, 0.03, 6.2);
      paver.receiveShadow = true;
      landscapeGroup.add(paver);
    }

    // --- B. FOUNDATION / GROUND PLATFORM ---
    const foundationPlinth = new THREE.Mesh(
      new THREE.BoxGeometry(13.0, 0.35, 10.5),
      materials.stonePlatform
    );
    foundationPlinth.position.set(0, 0.175, 0);
    foundationPlinth.castShadow = true;
    foundationPlinth.receiveShadow = true;
    foundationGroup.add(foundationPlinth);

    // Terrace extension step
    const terracePlinth = new THREE.Mesh(
      new THREE.BoxGeometry(4.5, 0.25, 3.8),
      materials.stonePlatform
    );
    terracePlinth.position.set(2.0, 0.125, 4.2);
    terracePlinth.receiveShadow = true;
    foundationGroup.add(terracePlinth);

    // --- C. GROUND INTERIOR ELEMENTS ---
    // Central travertine hearth / structural spine
    const hearthGeo = new THREE.BoxGeometry(1.4, 2.2, 3.2);
    const hearthMesh = new THREE.Mesh(hearthGeo, materials.interiorMarble);
    hearthMesh.position.set(-0.8, 1.45, -0.6);
    hearthMesh.castShadow = true;
    hearthMesh.receiveShadow = true;
    groundInteriorGroup.add(hearthMesh);

    // Kitchen island volume
    const islandGeo = new THREE.BoxGeometry(2.4, 0.8, 1.0);
    const islandMesh = new THREE.Mesh(islandGeo, materials.bronzeMetal);
    islandMesh.position.set(-3.2, 0.75, 1.2);
    islandMesh.castShadow = true;
    islandMesh.receiveShadow = true;
    groundInteriorGroup.add(islandMesh);

    // Minimalist cantilevered staircase treads
    for (let step = 0; step < 9; step++) {
      const tread = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.06, 0.32), materials.woodCedar);
      tread.position.set(0.6, 0.5 + step * 0.22, -1.8 + step * 0.3);
      tread.castShadow = true;
      groundInteriorGroup.add(tread);
    }

    // --- D. GROUND FLOOR EXTERIOR WALLS ---
    // West solid wall (limestone)
    const westWall = new THREE.Mesh(new THREE.BoxGeometry(0.5, 2.4, 6.2), materials.stoneLimestone);
    westWall.position.set(-5.6, 1.55, -0.8);
    westWall.castShadow = true;
    westWall.receiveShadow = true;
    groundWallsGroup.add(westWall);

    // North service wall
    const northWall = new THREE.Mesh(new THREE.BoxGeometry(6.8, 2.4, 0.5), materials.stoneLimestone);
    northWall.position.set(-2.0, 1.55, -4.6);
    northWall.castShadow = true;
    northWall.receiveShadow = true;
    groundWallsGroup.add(northWall);

    // Southeast corner return wall
    const seWall = new THREE.Mesh(new THREE.BoxGeometry(0.5, 2.4, 3.4), materials.stoneLimestone);
    seWall.position.set(5.4, 1.55, -2.4);
    seWall.castShadow = true;
    seWall.receiveShadow = true;
    groundWallsGroup.add(seWall);

    // --- E. GROUND FLOOR GLAZING & BRONZE MULLIONS ---
    // South main living glass
    const southGlass = new THREE.Mesh(new THREE.BoxGeometry(8.2, 2.35, 0.08), materials.glass);
    southGlass.position.set(0.4, 1.55, 3.8);
    groundGlazingGroup.add(southGlass);

    // Bronze frame for south glass
    const southFrameTop = new THREE.Mesh(new THREE.BoxGeometry(8.2, 0.1, 0.14), materials.bronzeMetal);
    southFrameTop.position.set(0.4, 2.7, 3.8);
    groundGlazingGroup.add(southFrameTop);

    const southFrameBottom = new THREE.Mesh(new THREE.BoxGeometry(8.2, 0.1, 0.14), materials.bronzeMetal);
    southFrameBottom.position.set(0.4, 0.4, 3.8);
    groundGlazingGroup.add(southFrameBottom);

    // East courtyard glass
    const eastGlass = new THREE.Mesh(new THREE.BoxGeometry(0.08, 2.35, 4.4), materials.glass);
    eastGlass.position.set(5.35, 1.55, 1.5);
    groundGlazingGroup.add(eastGlass);

    // --- F. UPPER FLOOR SLAB ---
    // Cantilevered floor slab separating ground and upper volume
    const upperSlab = new THREE.Mesh(
      new THREE.BoxGeometry(13.8, 0.4, 10.8),
      materials.stoneLimestone
    );
    upperSlab.position.set(0.2, 2.95, 0);
    upperSlab.castShadow = true;
    upperSlab.receiveShadow = true;
    upperSlabGroup.add(upperSlab);

    // Underside warm wood soffit accent
    const soffitWood = new THREE.Mesh(
      new THREE.BoxGeometry(13.6, 0.05, 10.6),
      materials.woodCedar
    );
    soffitWood.position.set(0.2, 2.73, 0);
    upperSlabGroup.add(soffitWood);

    // --- G. UPPER FLOOR WALLS ---
    // Cantilevered master suite limestone box (offset toward front-left)
    const upperMasterSuite = new THREE.Mesh(
      new THREE.BoxGeometry(5.2, 2.3, 5.8),
      materials.stoneLimestone
    );
    upperMasterSuite.position.set(-3.0, 4.3, 0.8);
    upperMasterSuite.castShadow = true;
    upperMasterSuite.receiveShadow = true;
    upperWallsGroup.add(upperMasterSuite);

    // Rear wall
    const upperRearWall = new THREE.Mesh(
      new THREE.BoxGeometry(6.4, 2.3, 0.45),
      materials.stoneLimestone
    );
    upperRearWall.position.set(2.4, 4.3, -3.8);
    upperRearWall.castShadow = true;
    upperRearWall.receiveShadow = true;
    upperWallsGroup.add(upperRearWall);

    // --- H. UPPER GLAZING & PERGOLA ---
    // Upper studio glazed pavilion
    const upperGlass = new THREE.Mesh(new THREE.BoxGeometry(5.6, 2.25, 0.08), materials.glass);
    upperGlass.position.set(2.6, 4.28, 2.4);
    upperGlazingGroup.add(upperGlass);

    const upperGlassSide = new THREE.Mesh(new THREE.BoxGeometry(0.08, 2.25, 4.2), materials.glass);
    upperGlassSide.position.set(5.45, 4.28, 0.3);
    upperGlazingGroup.add(upperGlassSide);

    // Bronze corner mullion column
    const cornerCol = new THREE.Mesh(new THREE.BoxGeometry(0.16, 2.3, 0.16), materials.bronzeMetal);
    cornerCol.position.set(5.45, 4.3, 2.4);
    upperGlazingGroup.add(cornerCol);

    // --- I. ROOF SLAB & PARAPET ---
    // Floating cantilevered thin architectural roof
    const roofSlab = new THREE.Mesh(
      new THREE.BoxGeometry(14.6, 0.32, 11.6),
      materials.stoneLimestone
    );
    roofSlab.position.set(0.2, 5.6, 0);
    roofSlab.castShadow = true;
    roofGroup.add(roofSlab);

    // Roof fascia trim in dark bronze
    const roofTrim = new THREE.Mesh(
      new THREE.BoxGeometry(14.7, 0.12, 11.7),
      materials.bronzeMetal
    );
    roofTrim.position.set(0.2, 5.7, 0);
    roofGroup.add(roofTrim);

    // Warm timber soffit on underside of roof
    const roofSoffit = new THREE.Mesh(
      new THREE.BoxGeometry(14.4, 0.04, 11.4),
      materials.woodCedar
    );
    roofSoffit.position.set(0.2, 5.42, 0);
    roofGroup.add(roofSoffit);

    // Skylight opening border
    const skylightBorder = new THREE.Mesh(
      new THREE.BoxGeometry(2.4, 0.18, 1.8),
      materials.bronzeMetal
    );
    skylightBorder.position.set(-1.2, 5.78, -1.0);
    roofGroup.add(skylightBorder);

    // Store base positions for all animated groups to perform pure deterministic offsets
    const basePositions = {
      landscape: new THREE.Vector3(0, 0, 0),
      foundation: new THREE.Vector3(0, 0, 0),
      groundInterior: new THREE.Vector3(0, 0, 0),
      groundWalls: new THREE.Vector3(0, 0, 0),
      groundGlazing: new THREE.Vector3(0, 0, 0),
      upperSlab: new THREE.Vector3(0, 0, 0),
      upperWalls: new THREE.Vector3(0, 0, 0),
      upperGlazing: new THREE.Vector3(0, 0, 0),
      roof: new THREE.Vector3(0, 0, 0),
    };

    // 7. Render Loop with Smooth Interpolation & Deterministic Axis Offsets
    const animate = () => {
      if (isDisposed) return;
      animationFrameId = requestAnimationFrame(animate);

      // Lerp progress for ultra-smooth responsiveness
      const targetP = reducedMotion ? 0 : Math.max(0, Math.min(1, progressRef.current));
      currentProgressRef.current += (targetP - currentProgressRef.current) * 0.09;
      const p = currentProgressRef.current;

      // EXPLODED VIEW GEOMETRIC OFFSETS:
      // Controlled, physically coherent movement along aligned architectural axes:
      // 1. Landscape remains anchored (Y = 0)
      landscapeGroup.position.copy(basePositions.landscape);

      // 2. Foundation: subtly settles or stays solid
      foundationGroup.position.set(0, -p * 0.3, 0);

      // 3. Ground Interior: gentle hover and reveal
      groundInteriorGroup.position.set(0, p * 0.4, -p * 0.2);

      // 4. Ground Walls: expand outward along X & Z axes
      groundWallsGroup.position.set(-p * 1.8, p * 0.2, -p * 1.2);

      // 5. Ground Glazing: separates slightly further outward
      groundGlazingGroup.position.set(p * 1.2, p * 0.15, p * 1.9);

      // 6. Upper Slab: rises vertically + subtle lift
      upperSlabGroup.position.set(0, p * 2.2, 0);

      // 7. Upper Walls: rises with upper volume and expands
      upperWallsGroup.position.set(-p * 1.6, p * 3.4, p * 0.8);

      // 8. Upper Glazing: lifts and offsets
      upperGlazingGroup.position.set(p * 1.6, p * 3.6, p * 1.4);

      // 9. Roof: lifts high vertically along Y-axis (+4.8 units)
      roofGroup.position.set(0, p * 5.2, 0);

      // Lock camera rock-steady to avoid any viewport shaking or rotational jitter during scroll
      camera.position.set(13.6, 9.6, 14.2);
      camera.lookAt(0, 1.8, 0);

      renderer.render(scene, camera);
    };

    animate();

    // 8. Window resize handler
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth || window.innerWidth;
      const newHeight = container.clientHeight || window.innerHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      isDisposed = true;
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('webglcontextlost', handleContextLost);
      renderer.domElement.removeEventListener('webglcontextrestored', handleContextRestored);

      // Dispose geometries & materials
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else if (obj.material) {
            obj.material.dispose();
          }
        }
      });

      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [reducedMotion]);

  if (!webGlSupported) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-[#1F2421] text-[#DEDAD2] p-8 text-center">
        <div className="w-16 h-16 rounded-full border border-[#DEDAD2]/30 flex items-center justify-center mb-4">
          <span className="text-xl font-serif">3D</span>
        </div>
        <p className="font-serif text-lg mb-2">Architectural Model View</p>
        <p className="text-sm text-[#DEDAD2]/70 max-w-sm">
          WebGL acceleration is not available in your current environment. The full portfolio and interactive services remain fully explorable below.
        </p>
      </div>
    );
  }

  return (
    <div
      ref={mountRef}
      className="w-full h-full relative cursor-grab active:cursor-grabbing select-none"
      aria-label="3D architectural exploded view model of boutique contemporary villa"
    />
  );
};
