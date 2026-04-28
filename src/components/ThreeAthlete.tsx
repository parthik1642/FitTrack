import React, { useRef } from "react";
import { View } from "react-native";
import { GLView } from "expo-gl";
import { Renderer } from "expo-three";
import * as THREE from "three";
import { Asset } from "expo-asset";
import { GLTFLoader } from "three-stdlib";

export default function ThreeAthlete() {
  const requestRef = useRef<number | null>(null);

  const onContextCreate = async (gl: any) => {
    const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;

    const renderer: any = new Renderer({ gl });
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 1.1, 5);

   scene.add(new THREE.AmbientLight(0xffffff, 0.9));

const mainLight = new THREE.DirectionalLight(0xffffff, 1.1);
mainLight.position.set(3, 5, 4);
scene.add(mainLight);

const fillLight = new THREE.PointLight(0xffffff, 0.35);
fillLight.position.set(-3, 2, 3);
scene.add(fillLight);
    const asset = Asset.fromModule(require("../../assets/models/athlete.glb"));
    await asset.downloadAsync();

    const loader = new GLTFLoader();

    loader.load(
      asset.localUri || asset.uri,
      (gltf) => {
        const model = gltf.scene;

        model.scale.set(1.4, 1.4, 1.4);
        model.position.set(0, -1.2, 0);

        // model.traverse((child: any) => {
        //   if (child.isMesh) {
        //     child.material = new THREE.MeshStandardMaterial({
        //       color: 0x111827,
        //       metalness: 0.2,
        //       roughness: 0.45,
        //       emissive: 0x1e1b4b,
        //       emissiveIntensity: 0.25,
        //     });
        //   }
        // });

        scene.add(model);

        const render = () => {
          requestRef.current = requestAnimationFrame(render);

          model.rotation.y += 0.006;
          model.position.y = -1.2 + Math.sin(Date.now() * 0.002) * 0.04;

        //   purpleLight.intensity = 2.5 + Math.sin(Date.now() * 0.003) * 0.5;

          renderer.render(scene, camera);
          gl.endFrameEXP();
        };

        render();
      },
      undefined,
      (error) => {
        console.log("Athlete GLB load error:", error);
      }
    );
  };

  return (
    <View style={{ width: 180, height: 220 }}>
      <GLView style={{ flex: 1 }} onContextCreate={onContextCreate} />
    </View>
  );
}