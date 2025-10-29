import React, { useRef, useEffect, useMemo, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function DepthPlane({
  image0,
  image1,
  hThreshold = 0.1,
  vThreshold = 0.1,
  scrollTarget = "#scroll-section",
  start,
  end
}) {
  const meshRef = useRef();
  const materialRef = useRef();
  const { size, viewport } = useThree();
  const [textures, setTextures] = useState({ original: null, depth: null });

  // --- Scroll and mouse state ---
  const scrollBase = useRef(0);
  const mouseDelta = useRef([0, 0]);
  const combinedMouse = useRef([0, 0]);
  const mouseFactor = 1.5; // mouse influence

  // --- Load textures ---
  useEffect(() => {
    const loader = new THREE.TextureLoader();
    Promise.all([
      new Promise((resolve) => loader.load(image0, resolve)),
      new Promise((resolve) => loader.load(image1, resolve)),
    ]).then(([tex0, tex1]) => {
      tex0.wrapS = tex0.wrapT = tex1.wrapS = tex1.wrapT = THREE.MirroredRepeatWrapping;
      tex0.minFilter = tex1.minFilter = THREE.LinearFilter;
      tex0.magFilter = tex1.magFilter = THREE.LinearFilter;
      setTextures({ original: tex0, depth: tex1 });
    });
  }, [image0, image1]);

  // --- Shaders ---
  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;
  const fragmentShader = `
    precision mediump float;
    uniform vec2 mouse;
    uniform vec2 threshold;
    uniform sampler2D image0;
    uniform sampler2D image1;
    varying vec2 vUv;
    vec2 mirrored(vec2 v) {
      vec2 m = mod(v, 2.0);
      return mix(m, 2.0 - m, step(1.0, m));
    }
    void main() {
      vec2 uv = vUv;
      vec4 depth = texture2D(image1, mirrored(uv));
      vec2 fake3d = vec2(
        uv.x + (depth.r - 0.5) * mouse.x / threshold.x,
        uv.y + (depth.r - 0.5) * mouse.y / threshold.y
      );
      gl_FragColor = texture2D(image0, mirrored(fake3d));
    }
  `;

  const uniforms = useMemo(() => ({
    mouse: { value: new THREE.Vector2(0, 0) },
    threshold: { value: new THREE.Vector2(hThreshold, vThreshold) },
    image0: { value: null },
    image1: { value: null },
  }), [hThreshold, vThreshold]);

  // assign textures
  useEffect(() => {
    if (textures.original && materialRef.current) {
      uniforms.image0.value = textures.original;
      uniforms.image1.value = textures.depth;
    }
  }, [textures, uniforms]);

  // --- ScrollTrigger base ---
  useEffect(() => {
    if (!scrollTarget) return;
    const trigger = ScrollTrigger.create({
      trigger: scrollTarget,
      start: `${start} top`,
      end: `${end} top`,
      scrub: true,
      onUpdate: self => {
        scrollBase.current = -(1 - self.progress * 5); // flip Y
      }
    });
    return () => trigger.kill();
  }, [scrollTarget]);

  // --- Mouse tracking ---
  useEffect(() => {
    const handleMouseMove = (e) => {
      const mx = -(e.clientX / size.width - 0.5) * mouseFactor; // flipped X
      const my = -(0.5 - e.clientY / size.height) * mouseFactor; // flipped Y
      mouseDelta.current = [mx, my];
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [size]);

  // --- Object-cover scaling ---
  const updateScale = () => {
    if (!textures.original || !meshRef.current) return;
    const img = textures.original.image;
    if (!img) return;
    const imageAspect = img.width / img.height;
    const screenAspect = size.width / size.height;

    let scaleX, scaleY;
    if (screenAspect < imageAspect) {
      scaleX = viewport.width;
      scaleY = viewport.width / imageAspect;
    } else {
      scaleY = viewport.height;
      scaleX = viewport.height * imageAspect;
    }

    const coverScale = Math.max(
      viewport.width / scaleX,
      viewport.height / scaleY
    );

    meshRef.current.scale.set(scaleX * coverScale, scaleY * coverScale, 1);
  };

  useEffect(() => {
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [textures, size, viewport]);

  // --- Frame updates ---
  useFrame(() => {
    // combine scroll base + mouse delta
    combinedMouse.current[0] += (mouseDelta.current[0] - combinedMouse.current[0]) * 0.1;
    combinedMouse.current[1] += ((scrollBase.current + mouseDelta.current[1]) - combinedMouse.current[1]) * 0.1;

    if (materialRef.current) {
      materialRef.current.uniforms.mouse.value.set(
        combinedMouse.current[0],
        combinedMouse.current[1]
      );
    }
  });

  if (!textures.original || !textures.depth) return null;

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}
