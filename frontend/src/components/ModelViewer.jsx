// src/components/ModelViewer.jsx

import React, { Suspense, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";

const AnimatedModel = () => {
    const group = useRef();
    const { scene, animations } = useGLTF("/models/doctor/scene.gltf");
    const mixer = useRef();

    useEffect(() => {
        if (animations && animations.length) {
            mixer.current = new THREE.AnimationMixer(scene);
            animations.forEach((clip) => {
                mixer.current.clipAction(clip, group.current).play();
            });
        }
    }, [animations, scene]);

    useFrame((state, delta) => {
        mixer.current?.update(delta);
    });

    return <primitive ref={group} object={scene} scale={1.5} />;
};

export default function ModelViewer() {
    return (
        <div className="w-full h-[60vh] bg-transparent rounded-lg shadow-lg overflow-hidden">
            <Canvas camera={{ position: [0, -1.5, 6], fov: 50 }}>
                <ambientLight intensity={0.8} />
                {/* <directionalLight position={[5, 2, 2]} intensity={2} color={"green"} /> */}
                {/* <directionalLight position={[-5, 2, 2]} intensity={2} color={"green"} /> */}
                <Suspense fallback={null}>
                    <AnimatedModel />
                </Suspense>
                <OrbitControls target={[0, -2, 0]} enableRotate={false} enableZoom={true} />
            </Canvas>
        </div>
    );
}
