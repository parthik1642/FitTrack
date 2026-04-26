import React, { useRef } from "react";
import { View } from "react-native";
import { GLView } from "expo-gl";
import { Renderer } from "expo-three";
import * as THREE from "three";

export default function ThreeDumbbell() {
  const requestRef = useRef<number | null>(null);

  const onContextCreate = async (gl: any) => {
    const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;

    const renderer: any = new Renderer({ gl });
    renderer.setSize(width, height);

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;

    const light = new THREE.PointLight(0xffffff, 1.5);
    light.position.set(5, 5, 5);
    scene.add(light);

    const material = new THREE.MeshStandardMaterial({ color: 0x7c3aed });

    const bar = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1, 0.1, 2, 32),
      material
    );
    bar.rotation.z = Math.PI / 2;

    const plate1 = new THREE.Mesh(
      new THREE.CylinderGeometry(0.4, 0.4, 0.3, 32),
      material
    );
    plate1.rotation.z = Math.PI / 2;
    plate1.position.x = -1;

    const plate2 = new THREE.Mesh(
      new THREE.CylinderGeometry(0.4, 0.4, 0.3, 32),
      material
    );
    plate2.rotation.z = Math.PI / 2;
    plate2.position.x = 1;

    const group = new THREE.Group();
    group.add(bar);
    group.add(plate1);
    group.add(plate2);
    scene.add(group);

    const render = () => {
      requestRef.current = requestAnimationFrame(render);

      group.rotation.y += 0.025;
      group.rotation.x += 0.008;

      renderer.render(scene, camera);
      gl.endFrameEXP();
    };

    render();
  };

  return (
    <View style={{ width: 150, height: 150 }}>
      <GLView style={{ flex: 1 }} onContextCreate={onContextCreate} />
    </View>
  );
}