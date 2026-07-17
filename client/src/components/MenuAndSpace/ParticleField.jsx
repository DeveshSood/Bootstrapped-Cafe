import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const PARTICLE_COUNT = 120;

function Particles() {
  const mesh = useRef();
  const light = useRef();

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const t = Math.random() * 100;
      const factor = 20 + Math.random() * 80;
      const speed = 0.002 + Math.random() / 200;
      const xFactor = -30 + Math.random() * 60;
      const yFactor = -15 + Math.random() * 30;
      const zFactor = -15 + Math.random() * 30;
      temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 });
    }
    return temp;
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    particles.forEach((particle, i) => {
      let { t, factor, speed, xFactor, yFactor, zFactor } = particle;
      t = particle.t += speed / 2;
      const a = Math.cos(t) + Math.sin(t * 1 / 10) / 10;
      const b = Math.sin(t) + Math.cos(t * 2 / 10) / 10;
      const s = Math.cos(t);

      dummy.position.set(
        (particle.mx / 10) * a + xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10,
        (particle.my / 10) * b + yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10,
        (particle.my / 10) * b + zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10
      );

      const scale = Math.max(0.15, Math.cos(t) * 0.5 + 0.5);
      dummy.scale.set(scale, scale, scale);
      dummy.rotation.set(s * 5, s * 5, s * 5);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight ref={light} position={[10, 10, 10]} intensity={0.8} color="#e8a87c" />
      <pointLight position={[-10, -10, -5]} intensity={0.4} color="#c8512d" />
      <instancedMesh ref={mesh} args={[null, null, PARTICLE_COUNT]}>
        <dodecahedronGeometry args={[0.3, 0]} />
        <meshPhongMaterial
          color="#c8512d"
          emissive="#3d1c11"
          emissiveIntensity={0.3}
          transparent
          opacity={0.35}
          shininess={100}
        />
      </instancedMesh>
    </>
  );
}

const ParticleField = () => {
  return (
    <Canvas
      camera={{ position: [0, 0, 25], fov: 75, near: 0.1, far: 100 }}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
      gl={{ alpha: true, antialias: true }}
      dpr={[1, 1.5]}
    >
      <Particles />
    </Canvas>
  );
};

export default ParticleField;
