'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { Suspense, useEffect, useRef, useMemo, useState } from 'react';
import * as THREE from 'three';
// import { suspend } from 'suspend-react';

interface AudioData extends Uint8Array {
  avg: number;
}

interface AudioContextType {
  context: AudioContext;
  source: AudioBufferSourceNode;
  gain: GainNode;
  data: AudioData;
  buffer: AudioBuffer | null;
  update: () => number;
}

function createColorGenerator() {
  const colors = [
    "#FF5733", "#33FF57", "#3357FF", "#F833FF", "#33FFF8",
    "#F8FF33", "#FF3380", "#3380FF", "#80FF33", "#FF9633",
    "#9633FF", "#33FF96", "#FF3396", "#3396FF", "#96FF33",
    "#33FFCA", "#CAFF33", "#FFCA33", "#33CAFF", "#CA33FF"
  ];
  let currentIndex = 0;

  return function getNextColor() {
    const color = colors[currentIndex];
    currentIndex = (currentIndex + 1) % colors.length;
    return color;
  };
}

function BackgroundAnimator({ speed }: { speed: number }) {
  const { gl } = useThree();
  const getNextColor = useMemo(createColorGenerator, []);
  const [color, setColor] = useState(getNextColor());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setColor(getNextColor());
    }, speed);

    return () => clearInterval(intervalId);
  }, [speed, getNextColor]);

  useEffect(() => {
    gl.setClearColor(color);
  }, [color, gl]);

  return null;
}

type AudioVisualizerProps = {
  y?: number;
  space?: number;
  width?: number;
  height?: number;
  obj?: THREE.Object3D;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  children?: React.ReactNode;
};

function AudioVisualizer({ y = 2500, space = 1.8, width = 0.01, height = 0.05, obj = new THREE.Object3D(), isPlaying, audioContext, ...props }: AudioVisualizerProps & { isPlaying: boolean, audioContext: AudioContextType }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const { data, update } = audioContext;

  useFrame(() => {
    if (!ref.current) return;
    const avg = isPlaying ? update() : 0;
    for (let i = 0; i < data.length; i++) {
      obj.position.set(i * width * space - (data.length * width * space) / 2, data[i] / y, 0);
      obj.updateMatrix();
      ref.current.setMatrixAt(i, obj.matrix);
    }
    if (ref.current.material instanceof THREE.MeshBasicMaterial) {
      ref.current.material.color.setHSL(avg / 500, 0.75, 0.75);
    }
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh castShadow ref={ref} args={[undefined, undefined, data.length]} {...props}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial toneMapped={false} />
    </instancedMesh>
  );
}

function House({ isPlaying, audioContext }: { isPlaying: boolean, audioContext: AudioContextType }) {
  const houseRef = useRef<THREE.Group>(null);
  const { data } = audioContext;

  useFrame((state) => {
    if (houseRef.current) {
      const avg = isPlaying ? data.avg : 0;
      const time = state.clock.getElapsedTime();
      
      // Base bounce
      houseRef.current.position.y = Math.sin(time * 2) * (avg / 1000);
      
      // Backflip rotation based on music intensity
      const flipIntensity = avg / 500;
      houseRef.current.rotation.x = Math.sin(time * 3) * flipIntensity;
      houseRef.current.rotation.y = Math.sin(time * 2) * (avg / 500);
      houseRef.current.rotation.z = Math.sin(time * 1.5) * (avg / 1000);
      
      // Scale pulsing with the beat
      const scale = 1 + (avg / 2000);
      houseRef.current.scale.set(scale, scale, scale);

      // Add some wobble to make it more dynamic
      houseRef.current.position.x = Math.sin(time * 1.5) * (avg / 2000);
      houseRef.current.position.z = Math.cos(time * 1.5) * (avg / 2000);
    }
  });

  return (
    <group ref={houseRef}>
      {/* House body - bigger and more detailed */}
      <mesh position={[0, 2, 0]}>
        <boxGeometry args={[4, 4, 4]} />
        <meshStandardMaterial color="#FFD700" />
      </mesh>
      
      {/* Roof - bigger and more detailed */}
      <mesh position={[0, 5, 0]}>
        <coneGeometry args={[3, 2, 4]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      
      {/* Door - bigger and more detailed */}
      <mesh position={[0, 1, 2.01]}>
        <boxGeometry args={[1, 2, 0.1]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      
      {/* Windows - bigger and more detailed */}
      <mesh position={[-1.5, 2, 2.01]}>
        <boxGeometry args={[0.8, 0.8, 0.1]} />
        <meshStandardMaterial color="#87CEEB" />
      </mesh>
      <mesh position={[1.5, 2, 2.01]}>
        <boxGeometry args={[0.8, 0.8, 0.1]} />
        <meshStandardMaterial color="#87CEEB" />
      </mesh>

      {/* Chimney */}
      <mesh position={[1, 5, 1]}>
        <boxGeometry args={[0.5, 1, 0.5]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>

      {/* Front porch */}
      <mesh position={[0, 0, 2]}>
        <boxGeometry args={[5, 0.5, 2]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>

      {/* Stairs */}
      <mesh position={[0, 0.25, 1]}>
        <boxGeometry args={[1, 0.5, 1]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      
      {/* Ground - bigger and more detailed */}
      <mesh position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#228B22" />
      </mesh>

      {/* Trees */}
      <mesh position={[-8, 0, -8]}>
        <coneGeometry args={[1, 3, 8]} />
        <meshStandardMaterial color="#228B22" />
      </mesh>
      <mesh position={[8, 0, -8]}>
        <coneGeometry args={[1, 3, 8]} />
        <meshStandardMaterial color="#228B22" />
      </mesh>

      {/* Sun */}
      <mesh position={[10, 10, 10]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

async function createAudio(url: string): Promise<AudioContextType> {
  const res = await fetch(url);
  const buffer = await res.arrayBuffer();
  const context = new AudioContext();
  const source = context.createBufferSource();
  source.buffer = await new Promise((res) => context.decodeAudioData(buffer, res));
  source.loop = true;
  
  const gain = context.createGain();
  const analyser = context.createAnalyser();
  analyser.fftSize = 64;
  source.connect(analyser);
  analyser.connect(gain);
  gain.connect(context.destination);
  
  const data = new Uint8Array(analyser.frequencyBinCount) as AudioData;
  
  return {
    context,
    source,
    gain,
    data,
    buffer: source.buffer,
    update: () => {
      analyser.getByteFrequencyData(data);
      return (data.avg = data.reduce((prev, cur) => prev + cur / data.length, 0));
    },
  };
}

export default function InteractiveHouse() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioContext, setAudioContext] = useState<AudioContextType | null>(null);

  useEffect(() => {
    const initAudio = async () => {
      const context = await createAudio('/house-music.mp3');
      setAudioContext(context);
    };
    initAudio();

    return () => {
      if (audioContext) {
        audioContext.source.stop();
        audioContext.context.close();
      }
    };
  }, [audioContext]);

  const togglePlay = () => {
    if (audioContext) {
      if (isPlaying) {
        audioContext.source.stop();
      } else {
        audioContext.source.start(0);
      }
      setIsPlaying(!isPlaying);
    }
  };

  if (!audioContext) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full h-[1000px] rounded-2xl overflow-hidden bg-gradient-to-br from-amber-900/50 to-purple-900/50">
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 text-center">
        <h2 className="text-4xl font-bold text-white mb-2">Welcome to HOUSECOIN! 🏠</h2>
        <button
          onClick={togglePlay}
          className="px-6 py-3 bg-gradient-to-r from-amber-500 to-purple-500 text-white rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
        >
          {isPlaying ? '⏸️ Pause Music' : '▶️ Play Music'}
        </button>
      </div>
      <Canvas
        camera={{ position: [10, 10, 10], fov: 45 }}
      >
        <Suspense fallback={null}>
          <House isPlaying={isPlaying} audioContext={audioContext} />
          <AudioVisualizer position={[0, -2, 0]} isPlaying={isPlaying} audioContext={audioContext} />
          <BackgroundAnimator speed={1000} />
          <Environment preset="sunset" />
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <OrbitControls 
            enableZoom={true}
            enablePan={true}
            enableRotate={true}
            minDistance={5}
            maxDistance={30}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 2}
          />
        </Suspense>
      </Canvas>
    </div>
  );
} 