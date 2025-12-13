import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { motion, AnimatePresence } from "framer-motion";

const ThreeJSBagBuilder = ({
  selectedBag,
  selectedCharms,
  onCharmAdd,
  onCharmRemove,
}) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const bagRef = useRef(null);
  const charmsRef = useRef([]);
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());

  const [isDragging, setIsDragging] = useState(false);
  const [dragCharm, setDragCharm] = useState(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 2, 5);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(
      mountRef.current.clientWidth,
      mountRef.current.clientHeight
    );
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xffffff, 0.5, 100);
    pointLight.position.set(-10, 10, 10);
    scene.add(pointLight);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 3;
    controls.maxDistance = 10;
    controls.maxPolarAngle = Math.PI / 2;
    controlsRef.current = controls;

    // Create 3D Bag
    create3DBag();

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Event listeners
    const handleResize = () => {
      if (!mountRef.current) return;
      camera.aspect =
        mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(
        mountRef.current.clientWidth,
        mountRef.current.clientHeight
      );
    };

    const handleMouseDown = event => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.current.setFromCamera(mouse.current, camera);
      const intersects = raycaster.current.intersectObjects(scene.children);

      if (intersects.length > 0) {
        const clickedObject = intersects[0].object;
        if (clickedObject.userData.isCharm) {
          setDragCharm(clickedObject);
          setIsDragging(true);
        }
      }
    };

    const handleMouseMove = event => {
      if (!isDragging || !dragCharm) return;

      const rect = renderer.domElement.getBoundingClientRect();
      mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.current.setFromCamera(mouse.current, camera);
      const intersects = raycaster.current.intersectObjects([bagRef.current]);

      if (intersects.length > 0) {
        const point = intersects[0].point;
        dragCharm.position.copy(point);
      }
    };

    const handleMouseUp = () => {
      if (isDragging && dragCharm) {
        setIsDragging(false);
        setDragCharm(null);
      }
    };

    window.addEventListener("resize", handleResize);
    renderer.domElement.addEventListener("mousedown", handleMouseDown);
    renderer.domElement.addEventListener("mousemove", handleMouseMove);
    renderer.domElement.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("resize", handleResize);
      renderer.domElement.removeEventListener("mousedown", handleMouseDown);
      renderer.domElement.removeEventListener("mousemove", handleMouseMove);
      renderer.domElement.removeEventListener("mouseup", handleMouseUp);

      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    if (bagRef.current) {
      // Update bag color based on selected bag
      const material = bagRef.current.material;
      if (material && selectedBag.color) {
        material.color.setHex(parseInt(selectedBag.color.replace("#", "0x")));
      }
    }
  }, [selectedBag.color]);

  const create3DBag = () => {
    // Bag body
    const bagGeometry = new THREE.BoxGeometry(2, 2.5, 0.8);
    const bagMaterial = new THREE.MeshPhongMaterial({
      color: selectedBag.color || 0xffb6c1,
      shininess: 30,
    });

    const bag = new THREE.Mesh(bagGeometry, bagMaterial);
    bag.position.set(0, 0, 0);
    bag.castShadow = true;
    bag.receiveShadow = true;
    bag.userData.isBag = true;

    sceneRef.current.add(bag);
    bagRef.current = bag;

    // Bag handles
    const handleGeometry = new THREE.TorusGeometry(0.8, 0.05, 8, 16, Math.PI);
    const handleMaterial = new THREE.MeshPhongMaterial({ color: 0x8b4513 });

    const leftHandle = new THREE.Mesh(handleGeometry, handleMaterial);
    leftHandle.position.set(-0.6, 1.2, 0);
    leftHandle.rotation.z = Math.PI;
    leftHandle.castShadow = true;

    const rightHandle = new THREE.Mesh(handleGeometry, handleMaterial);
    rightHandle.position.set(0.6, 1.2, 0);
    rightHandle.rotation.z = Math.PI;
    rightHandle.castShadow = true;

    sceneRef.current.add(leftHandle);
    sceneRef.current.add(rightHandle);

    // Add decorative elements
    addBagDecorations();
  };

  const addBagDecorations = () => {
    // Add some geometric decorations to make it more kawaii
    const decorationGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.2);
    const decorationMaterial = new THREE.MeshPhongMaterial({ color: 0xff69b4 });

    for (let i = 0; i < 4; i++) {
      const decoration = new THREE.Mesh(decorationGeometry, decorationMaterial);
      decoration.position.set(
        Math.cos((i / 4) * Math.PI * 2) * 0.8,
        0.5,
        Math.sin((i / 4) * Math.PI * 2) * 0.4
      );
      decoration.rotation.x = Math.PI / 2;
      decoration.castShadow = true;
      sceneRef.current.add(decoration);
    }
  };

  const addCharmToBag = (charm, position = null) => {
    if (!bagRef.current) return;

    // Create 3D charm (simplified geometry for demo)
    const charmGeometry = new THREE.SphereGeometry(0.15, 16, 16);
    const charmMaterial = new THREE.MeshPhongMaterial({
      color: getRandomCharmColor(),
      shininess: 100,
    });

    const charmMesh = new THREE.Mesh(charmGeometry, charmMaterial);

    // Position on bag surface
    if (position) {
      charmMesh.position.copy(position);
    } else {
      // Random position on bag front
      charmMesh.position.set(
        (Math.random() - 0.5) * 1.5,
        (Math.random() - 0.5) * 1.5,
        0.45
      );
    }

    charmMesh.userData.isCharm = true;
    charmMesh.userData.charmData = charm;
    charmMesh.castShadow = true;

    sceneRef.current.add(charmMesh);
    charmsRef.current.push(charmMesh);

    // Add floating animation
    charmMesh.position.y += 0.1;
  };

  const removeCharmFromBag = charmId => {
    const charmIndex = charmsRef.current.findIndex(
      charm => charm.userData.charmData?.id === charmId
    );

    if (charmIndex !== -1) {
      const charm = charmsRef.current[charmIndex];
      sceneRef.current.remove(charm);
      charmsRef.current.splice(charmIndex, 1);
    }
  };

  const getRandomCharmColor = () => {
    const colors = [0xff69b4, 0x9370db, 0x20b2aa, 0xffd700, 0xff4500, 0x32cd32];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Update charms when selectedCharms changes
  useEffect(() => {
    if (!sceneRef.current) return;

    // Remove existing charms
    charmsRef.current.forEach(charm => {
      sceneRef.current.remove(charm);
    });
    charmsRef.current = [];

    // Add new charms
    selectedCharms.forEach(charm => {
      addCharmToBag(charm);
    });
  }, [selectedCharms]);

  return (
    <div className="relative w-full h-full">
      <div
        ref={mountRef}
        className="w-full h-full rounded-kawaii overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      />

      {/* Controls Overlay */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-kawaii p-3 shadow-lg">
        <div className="text-sm font-semibold text-dark-slate mb-2">
          3D Bag Builder
        </div>
        <div className="text-xs text-dark-slate/70">
          🖱️ Click and drag charms
          <br />
          🔄 Rotate view with mouse
          <br />⚡ Double-click to remove
        </div>
      </div>

      {/* Performance indicator */}
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-kawaii p-2 shadow-lg">
        <div className="text-xs text-dark-slate/70">3D Mode Active</div>
      </div>

      {/* Loading indicator */}
      <AnimatePresence>
        {!bagRef.current && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-gray-100/80 backdrop-blur-sm rounded-kawaii"
          >
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bubblegum mx-auto mb-4"></div>
              <div className="text-dark-slate font-medium">
                Loading 3D Bag...
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ThreeJSBagBuilder;
