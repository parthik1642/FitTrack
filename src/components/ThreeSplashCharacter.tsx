import React, { useRef } from "react";
import { View } from "react-native";
import { GLView } from "expo-gl";
import { Renderer } from "expo-three";
import * as THREE from "three";
import { Asset } from "expo-asset";
import { GLTFLoader } from "three-stdlib";

export default function ThreeSplashCharacter({
  onLoaded,
}: {
  onLoaded?: () => void;
}) {
  const requestRef = useRef<number | null>(null);

  const onContextCreate = async (gl: any) => {
    const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;

    const renderer: any = new Renderer({ gl });
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 1.2, 3.5); // closer → visible

    scene.add(new THREE.AmbientLight(0xffffff, 1.2));

    const light = new THREE.DirectionalLight(0xffffff, 1.4);
    light.position.set(3, 5, 4);
    scene.add(light);

    const asset = Asset.fromModule(
      require("../../assets/models/rope_skipper.glb")
    );
    await asset.downloadAsync();

    const loader = new GLTFLoader();

    loader.load(asset.localUri || asset.uri, (gltf) => {
      const model = gltf.scene;

      model.scale.set(3.2, 3.2, 3.2); // BIG FIX
      model.position.set(0, -1.5, 0); // bring into frame

      scene.add(model);

      // tell splash "I'm ready"
      onLoaded?.();

      const mixer =
        gltf.animations.length > 0
          ? new THREE.AnimationMixer(model)
          : null;

      if (mixer && gltf.animations[0]) {
        mixer.clipAction(gltf.animations[0]).play();
      }

      const clock = new THREE.Clock();

      const render = () => {
        requestRef.current = requestAnimationFrame(render);

        const delta = clock.getDelta();
        if (mixer) mixer.update(delta);

        renderer.render(scene, camera);
        gl.endFrameEXP();
      };

      render();
    });
  };

  return (
    <View style={{ width: 360, height: 460 }}>
      <GLView style={{ flex: 1 }} onContextCreate={onContextCreate} />
    </View>
  );
}