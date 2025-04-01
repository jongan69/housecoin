'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Text3D, Float } from '@react-three/drei';
import { Suspense, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

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

// function createColorGenerator() {
//   const colors = [
//     "#FF5733", "#33FF57", "#3357FF", "#F833FF", "#33FFF8",
//     "#F8FF33", "#FF3380", "#3380FF", "#80FF33", "#FF9633",
//     "#9633FF", "#33FF96", "#FF3396", "#3396FF", "#96FF33",
//     "#33FFCA", "#CAFF33", "#FFCA33", "#33CAFF", "#CA33FF"
//   ];
//   let currentIndex = 0;

//   return function getNextColor() {
//     const color = colors[currentIndex];
//     currentIndex = (currentIndex + 1) % colors.length;
//     return color;
//   };
// }

function VideoBackground({ isPlaying }: { isPlaying: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(err => {
          console.error('Error playing video:', err);
          setError(true);
        });
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying]);

  const handleError = () => {
    console.error('Video failed to load');
    setError(true);
  };

  if (error) {
    return (
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-amber-900/50 to-purple-900/50 z-0" />
    );
  }

  return (
    <video
      ref={videoRef}
      className="absolute top-0 left-0 w-full h-full object-cover z-0"
      onError={handleError}
      loop
      muted
      playsInline
    >
      <source src="/house-video.mp4" type="video/mp4" />
      {/* MOV is too big for github */}
      {/* <source src="/house-video.mov" type="video/quicktime" /> */}
      Your browser does not support the video tag.
    </video>
  );
}

type AudioVisualizerProps = {
  url: string;
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

function AudioVisualizer({ url, y = 2500, space = 1.8, width = 0.01, height = 0.05, obj = new THREE.Object3D(), isPlaying, audioContext, ...props }: AudioVisualizerProps & { isPlaying: boolean, audioContext: AudioContextType }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const { data, update } = audioContext;

  useFrame((state) => {
    if (!ref.current) return;
    let avg = isPlaying ? update() : 0;
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
  const textRef = useRef<THREE.Mesh>(null);
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

      // Update text color based on music intensity
      if (textRef.current) {
        const avg = isPlaying ? data.avg : 0;
        const time = state.clock.getElapsedTime();
        
        // Create more dramatic color changes based on music intensity
        const hue = (time * 0.5 + avg / 500) % 1; // Faster color cycling
        const saturation = 0.8 + (avg / 1000); // Dynamic saturation
        const lightness = 0.5 + (avg / 2000); // Dynamic brightness
        
        const color = new THREE.Color().setHSL(hue, saturation, lightness);
        if (textRef.current.material instanceof THREE.MeshPhysicalMaterial) {
          textRef.current.material.color = color;
          textRef.current.material.emissive = color;
          textRef.current.material.emissiveIntensity = 0.8 + (avg / 500); // More dramatic glow
          textRef.current.material.metalness = 0.9 + (avg / 2000); // Dynamic metalness
          textRef.current.material.roughness = 0.1 - (avg / 2000); // Dynamic roughness
        }
      }
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

      {/* House Coin Text */}
      {isPlaying && (
        <Float
          speed={1}
          rotationIntensity={0.2}
          floatIntensity={0.2}
        >
          <Text3D
            ref={textRef}
            // font="/fonts/SFProBold.json"
            font="/fonts/optimer_bold.typeface.json"
            size={1.1}
            height={0.4}
            curveSegments={32}
            bevelEnabled={true}
            bevelThickness={0.2}
            bevelSize={0.05}
            bevelOffset={0}
            bevelSegments={20}
            position={[-3, -1.9, 5]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            HOUSE COIN
            <meshPhysicalMaterial 
              color="#FFD700"
              metalness={0.9}
              roughness={0.1}
              clearcoat={1}
              clearcoatRoughness={0.1}
              envMapIntensity={2}
              emissive="#FFD700"
              emissiveIntensity={0.8}
              reflectivity={0.9}
              ior={1.5}
              transmission={0}
              thickness={0.8}
            />
          </Text3D>
        </Float>
      )}
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
  }, []);

  const togglePlay = () => {
    if (audioContext) {
      if (isPlaying) {
        audioContext.source.stop();
      } else {
        // Create a new source node
        const newSource = audioContext.context.createBufferSource();
        newSource.buffer = audioContext.buffer;
        newSource.loop = true;
        
        // Create a new analyzer
        const analyser = audioContext.context.createAnalyser();
        analyser.fftSize = 64;
        
        // Reconnect the audio graph with analyzer
        const gain = audioContext.gain;
        newSource.connect(analyser);
        analyser.connect(gain);
        gain.connect(audioContext.context.destination);
        
        // Create new data array for the analyzer
        const data = new Uint8Array(analyser.frequencyBinCount) as AudioData;
        
        // Update the audioContext with the new source, analyzer, and data
        audioContext.source = newSource;
        audioContext.data = data;
        audioContext.update = () => {
          analyser.getByteFrequencyData(data);
          return (data.avg = data.reduce((prev, cur) => prev + cur / data.length, 0));
        };
        audioContext.source.start(0);
      }
      setIsPlaying(!isPlaying);
    }
  };

  if (!audioContext) {
    return (
      <div className="w-full h-[100vh] md:h-[1000px] rounded-2xl overflow-hidden relative flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-white">Loading HOUSECOIN...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[100vh] md:h-[1000px] rounded-2xl overflow-hidden relative">
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/30 z-10" />
      
      <VideoBackground isPlaying={isPlaying} />
      
      {/* Controls container with glassmorphism */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20 text-center px-6 py-4 rounded-2xl backdrop-blur-md bg-white/10 border border-white/20 shadow-xl">
        <h2 className="text-2xl md:text-4xl font-bold text-white mb-4 tracking-tight">
          Welcome to <span className="text-amber-400">HOUSECOIN</span> 🏠
        </h2>
        <button
          onClick={togglePlay}
          className="group relative px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-amber-500 to-purple-500 text-white rounded-full font-bold text-base md:text-lg shadow-lg hover:shadow-amber-500/30 transition-all duration-300 transform hover:scale-105 active:scale-95 overflow-hidden"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            {isPlaying ? (
              <>
                <span className="text-xl">⏸️</span>
                <span>Pause</span>
              </>
            ) : (
              <>
                <span className="text-xl">▶️</span>
                <span>Play</span>
              </>
            )}
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </button>
      </div>

      <Canvas
        camera={{ position: [30, 30, 30], fov: 45 }}
        style={{ touchAction: 'none' }}
        className="relative z-10"
      >
        <Suspense fallback={null}>
          <House isPlaying={isPlaying} audioContext={audioContext} />
          <AudioVisualizer url="/house-music.mp3" position={[0, -2, 0]} isPlaying={isPlaying} audioContext={audioContext} />
          <Environment preset="sunset" />
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <OrbitControls 
            enableZoom={true}
            enablePan={true}
            enableRotate={true}
            minDistance={10}
            maxDistance={100}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 2}
            enableDamping={true}
            dampingFactor={0.05}
            rotateSpeed={0.5}
            zoomSpeed={0.5}
            panSpeed={0.5}
          />
        </Suspense>
      </Canvas>
    </div>
  );
} 