import { useEffect, useRef } from "react";
import * as THREE from "three";
import setCharacter from "./utils/character";
import setLighting from "./utils/lighting";
import { useLoading } from "../../context/loadingContext";
import handleResize from "./utils/resizeUtils";
import {
  handleMouseMove,
  handleTouchEnd,
  handleHeadRotation,
  handleTouchMove,
} from "./utils/mouseUtils";
import setAnimations from "./utils/animationUtils";
import { setProgress } from "../utils/progress";

const Scene = () => {
  const canvasDiv = useRef<HTMLDivElement | null>(null);
  const hoverDivRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef(new THREE.Scene());
  const { setLoading } = useLoading();

  useEffect(() => {
    const canvas = canvasDiv.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const container = { width: rect.width, height: rect.height };
    if (!container.width || !container.height) return;

    const aspect = container.width / container.height;
    const scene = sceneRef.current;
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    renderer.setSize(container.width, container.height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    canvas.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(14.5, aspect, 0.1, 1000);
    camera.position.set(0, 13.1, 24.7);
    camera.zoom = 1.1;
    camera.updateProjectionMatrix();

    let headBone: THREE.Object3D | null = null;
    let screenLight: THREE.Mesh | null = null;
    let mixer: THREE.AnimationMixer | null = null;
    let loadedCharacter: THREE.Object3D | null = null;
    let debounce: number | undefined;
    let introTimer: number | undefined;
    let animationFrameId = 0;
    let removeHoverListeners: (() => void) | undefined;
    let disposed = false;

    const clock = new THREE.Clock();
    const light = setLighting(scene);
    const progress = setProgress((value) => setLoading(value));
    const { loadCharacter } = setCharacter(renderer, scene, camera);
    const landingDiv = document.getElementById("landingDiv");
    let mouse = { x: 0, y: 0 };
    let interpolation = { x: 0.1, y: 0.2 };

    const onResize = () => {
      if (loadedCharacter) {
        handleResize(renderer, camera, canvasDiv, loadedCharacter);
      }
    };

    const onMouseMove = (event: MouseEvent) => {
      handleMouseMove(event, (x, y) => {
        mouse = { x, y };
      });
    };

    const onTouchMove = (event: TouchEvent) => {
      handleTouchMove(event, (x, y) => {
        mouse = { x, y };
      });
    };

    const onTouchStart = () => {
      debounce = window.setTimeout(() => {
        landingDiv?.addEventListener("touchmove", onTouchMove, {
          passive: true,
        });
      }, 200);
    };

    const onTouchEnd = () => {
      landingDiv?.removeEventListener("touchmove", onTouchMove);
      handleTouchEnd((x, y, interpolationX, interpolationY) => {
        mouse = { x, y };
        interpolation = { x: interpolationX, y: interpolationY };
      });
    };

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (headBone) {
        handleHeadRotation(
          headBone,
          mouse.x,
          mouse.y,
          interpolation.x,
          interpolation.y,
          THREE.MathUtils.lerp
        );
        light.setPointLight(screenLight);
      }
      const delta = clock.getDelta();
      mixer?.update(delta);
      renderer.render(scene, camera);
    };

    loadCharacter()
      .then((gltf) => {
        if (disposed) return;
        if (!gltf) {
          progress.clear();
          return;
        }

        const character = gltf.scene;
        const animations = setAnimations(gltf);
        removeHoverListeners = hoverDivRef.current
          ? animations.hover(gltf, hoverDivRef.current)
          : undefined;
        mixer = animations.mixer;
        loadedCharacter = character;
        scene.add(character);
        headBone = character.getObjectByName("spine006") ?? null;
        screenLight = character.getObjectByName("screenlight") as THREE.Mesh | null;

        progress.loaded().then(() => {
          if (disposed) return;
          introTimer = window.setTimeout(() => {
            light.turnOnLights();
            animations.startIntro();
          }, 2500);
        });

        window.addEventListener("resize", onResize);
      })
      .catch((error: unknown) => {
        console.error("Unable to load the character model:", error);
        if (!disposed) {
          progress.clear();
        }
      });

    document.addEventListener("mousemove", onMouseMove, { passive: true });
    landingDiv?.addEventListener("touchstart", onTouchStart, { passive: true });
    landingDiv?.addEventListener("touchend", onTouchEnd);
    animate();

    return () => {
      disposed = true;
      progress.clear();
      window.clearTimeout(debounce);
      window.clearTimeout(introTimer);
      cancelAnimationFrame(animationFrameId);
      removeHoverListeners?.();
      window.removeEventListener("resize", onResize);
      document.removeEventListener("mousemove", onMouseMove);
      landingDiv?.removeEventListener("touchstart", onTouchStart);
      landingDiv?.removeEventListener("touchend", onTouchEnd);
      landingDiv?.removeEventListener("touchmove", onTouchMove);
      scene.clear();
      renderer.dispose();
      if (canvas.contains(renderer.domElement)) {
        canvas.removeChild(renderer.domElement);
      }
    };
  }, [setLoading]);

  return (
    <div className="character-container">
      <div className="character-model" ref={canvasDiv}>
        <div className="character-rim"></div>
        <div className="character-hover" ref={hoverDivRef}></div>
      </div>
    </div>
  );
};

export default Scene;
