import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

const NODE_COUNT = 230;
const LINK_DISTANCE = 2.6;
const PALETTE = {
  dark: { points: '#c7d2fe', line: '#818cf8', shapes: ['#818cf8', '#2dd4bf', '#a78bfa'] },
  light: { points: '#4f46e5', line: '#6366f1', shapes: ['#4f46e5', '#0d9488', '#7c3aed'] },
};

/**
 * Pulls the camera back on wide viewports so the network fills more of the
 * frame instead of collapsing into a small cluster in the middle.
 */
function ResponsiveCamera() {
  const { camera, size } = useThree();
  useEffect(() => {
    const wide = size.width > size.height;
    camera.fov = wide ? 46 : 62;
    camera.position.z = wide ? 12 : 17;
    camera.updateProjectionMatrix();
  }, [camera, size.width, size.height]);
  return null;
}

function DataNetwork({ mouse, light }) {
  const group = useRef();
  const colors = light ? PALETTE.light : PALETTE.dark;

  const { positions, linePositions } = useMemo(() => {
    const pts = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      // flattened shell, denser toward the viewer for a sense of depth
      const r = 3.2 + Math.random() * 5.4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pts.push(new THREE.Vector3(r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta) * 0.62, r * Math.cos(phi)));
    }
    const lines = [];
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        if (pts[i].distanceTo(pts[j]) < LINK_DISTANCE) lines.push(pts[i].x, pts[i].y, pts[i].z, pts[j].x, pts[j].y, pts[j].z);
      }
    }
    const flat = new Float32Array(pts.flatMap((p) => [p.x, p.y, p.z]));
    return { positions: flat, linePositions: new Float32Array(lines) };
  }, []);

  useFrame((state, delta) => {
    if (!group.current) return;
    group.current.rotation.y += delta * 0.05;
    const ty = mouse.current.x * 0.4;
    const tx = mouse.current.y * 0.28;
    group.current.rotation.x += (tx - group.current.rotation.x) * 0.05;
    group.current.position.x += (ty * 1.6 - group.current.position.x) * 0.05;
    group.current.position.y += (-mouse.current.y * 0.5 - group.current.position.y) * 0.05;
  });

  return (
    <group ref={group}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.115} color={colors.points} transparent opacity={light ? 0.8 : 1} sizeAttenuation depthWrite={false} />
      </points>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={linePositions.length / 3} array={linePositions} itemSize={3} />
        </bufferGeometry>
        <lineBasicMaterial color={colors.line} transparent opacity={light ? 0.3 : 0.42} depthWrite={false} />
      </lineSegments>
    </group>
  );
}

function FloatingShapes({ light }) {
  const [a, b, c] = (light ? PALETTE.light : PALETTE.dark).shapes;
  return (
    <>
      <Float speed={1.1} rotationIntensity={0.7} floatIntensity={1}>
        <mesh position={[-6.2, 2.4, -3]}>
          <icosahedronGeometry args={[1.05, 0]} />
          <meshBasicMaterial color={a} wireframe transparent opacity={light ? 0.45 : 0.5} />
        </mesh>
      </Float>
      <Float speed={0.95} rotationIntensity={0.9} floatIntensity={0.8}>
        <mesh position={[6.6, -2, -2]}>
          <octahedronGeometry args={[0.95, 0]} />
          <meshBasicMaterial color={b} wireframe transparent opacity={light ? 0.42 : 0.46} />
        </mesh>
      </Float>
      <Float speed={0.75} rotationIntensity={0.6} floatIntensity={0.65}>
        <mesh position={[4.2, 3.6, -5]}>
          <torusKnotGeometry args={[0.72, 0.18, 96, 10]} />
          <meshBasicMaterial color={c} wireframe transparent opacity={light ? 0.32 : 0.34} />
        </mesh>
      </Float>
      <Float speed={0.6} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh position={[-4.4, -3.4, -6]}>
          <torusGeometry args={[0.85, 0.16, 12, 40]} />
          <meshBasicMaterial color={c} wireframe transparent opacity={light ? 0.26 : 0.3} />
        </mesh>
      </Float>
    </>
  );
}

export default function Background3D({ light = false }) {
  const mouse = useRef({ x: 0, y: 0 });
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const onMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  // Stop the render loop entirely while the tab is in the background.
  useEffect(() => {
    const onVisibility = () => setPaused(document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
      <Canvas frameloop={paused ? 'never' : 'always'} camera={{ position: [0, 0, 12], fov: 46 }} dpr={[1, 1.75]} gl={{ antialias: false, alpha: true, powerPreference: 'low-power' }}>
        <ResponsiveCamera />
        <DataNetwork mouse={mouse} light={light} />
        <FloatingShapes light={light} />
      </Canvas>
      {/* Colour wash so the scene reads as lit rather than floating on flat black. */}
      <div className={`absolute inset-0 ${light ? 'bg-[radial-gradient(60rem_40rem_at_15%_0%,rgba(99,102,241,0.16),transparent_60%),radial-gradient(50rem_36rem_at_100%_85%,rgba(20,184,166,0.14),transparent_60%)]' : 'bg-[radial-gradient(60rem_40rem_at_15%_0%,rgba(99,102,241,0.22),transparent_62%),radial-gradient(55rem_38rem_at_100%_85%,rgba(20,184,166,0.16),transparent_62%)]'}`} />
      {/* Fade the lower half so content stays readable over the network. */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--bg)] opacity-90" />
    </div>
  );
}