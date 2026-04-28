import React, { useRef } from "react";
import { View, Pressable } from "react-native";
import { GLView } from "expo-gl";
import { Renderer } from "expo-three";
import * as THREE from "three";
import { Asset } from "expo-asset";
import { GLTFLoader } from "three-stdlib";

export default function ThreeDumbbell() {
  const requestRef = useRef<number | null>(null);
  const speedRef = useRef(0.025);
  const zoomRef = useRef(10);

  const onPowerSpin = () => {
    speedRef.current = 0.25;
    zoomRef.current = 6;

    setTimeout(() => {
      speedRef.current = 0.025;
    }, 1200);
  };

  const onContextCreate = async (gl: any) => {
    const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;

    const renderer: any = new Renderer({ gl });
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = zoomRef.current;

    scene.add(new THREE.AmbientLight(0xffffff, 1.2));

    const purpleLight = new THREE.PointLight(0x7c3aed, 3);
    purpleLight.position.set(2, 2, 3);
    scene.add(purpleLight);

    const blueLight = new THREE.PointLight(0x38bdf8, 2);
    blueLight.position.set(-2, -1, 2);
    scene.add(blueLight);

    const asset = Asset.fromModule(require("../../assets/models/dumbbell.glb"));
    await asset.downloadAsync();

    const loader = new GLTFLoader();

    loader.load(asset.localUri || asset.uri, (gltf) => {
      const model = gltf.scene;

      model.scale.set(1.3, 1.3, 1.3);

    //   model.traverse((child: any) => {
    //     if (child.isMesh) {
    //       child.material = new THREE.MeshStandardMaterial({
    //         color: 0x8b5cf6,
    //         metalness: 0.8,
    //         roughness: 0.25,
    //         emissive: 0x3b0764,
    //         emissiveIntensity: 0.45,
    //       });
    //     }
    //   });

      scene.add(model);

      const render = () => {
        requestRef.current = requestAnimationFrame(render);

        if (zoomRef.current > 4) {
          zoomRef.current -= 0.08;
        }

        camera.position.z = zoomRef.current;
       scene.add(new THREE.AmbientLight(0xffffff, 0.9));

const mainLight = new THREE.DirectionalLight(0xffffff, 1.1);
mainLight.position.set(3, 5, 4);
scene.add(mainLight);

const fillLight = new THREE.PointLight(0xffffff, 0.35);
fillLight.position.set(-3, 2, 3);
scene.add(fillLight);

        // const glowPulse = Math.sin(Date.now() * 0.003) * 0.3 + 0.7;
        // purpleLight.intensity = 2 + glowPulse;

        model.rotation.y += speedRef.current;
        model.rotation.x = Math.sin(Date.now() * 0.001) * 0.15;
        model.position.y = Math.sin(Date.now() * 0.002) * 0.08;

        renderer.render(scene, camera);
        gl.endFrameEXP();
      };

      render();
    });
  };

  return (
    <Pressable onPress={onPowerSpin}>
      <View style={{ width: 160, height: 160 }}>
        <GLView style={{ flex: 1 }} onContextCreate={onContextCreate} />
      </View>
    </Pressable>
  );
}