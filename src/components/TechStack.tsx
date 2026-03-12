import * as THREE from "three";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Decal } from "@react-three/drei";
import {
  BallCollider,
  Physics,
  RapierRigidBody,
  RigidBody,
} from "@react-three/rapier";

const textureLoader = new THREE.TextureLoader();

const techItems = [
  { label: "React", image: "/images/logos/react.svg" },
  { label: "Next.js", image: "/images/logos/nextjs.svg" },
  { label: "Node.js", image: "/images/logos/nodejs.svg" },
  { label: "Express", image: "/images/logos/express.svg" },
  { label: "MongoDB", image: "/images/logos/mongodb.svg" },
  { label: "MySQL", image: "/images/logos/mysql.svg", hideLabel: true },
  { label: "TypeScript", image: "/images/logos/typescript.svg" },
  { label: "JavaScript", image: "/images/logos/javascript.svg" },
  { label: "Python", image: "/images/logos/python.svg" },
  { label: "FastAPI", image: "/images/logos/fastapi.svg" },
  { label: "PostgreSQL", image: "/images/logos/postgresql.svg" },
  { label: "Redis", image: "/images/logos/redis.svg" },
  { label: "Docker", image: "/images/logos/docker.svg" },
  { label: "AWS", image: "/images/logos/aws.svg" },
  { label: "GCP", image: "/images/logos/gcp.svg" },
  { label: "PyTorch", image: "/images/logos/pytorch.svg" },
  { label: "TensorFlow", image: "/images/logos/tensorflow.svg" },
  { label: "Colab", image: "/images/logos/googlecolab.svg" },
  { label: "OpenAI", image: "/images/logos/openai.svg" },
  { label: "Claude", image: "/images/logos/claude.svg" },
  { label: "Antigravity", image: "/images/logos/antigravity.svg" },
  { label: "HuggingFace", image: "/images/logos/huggingface.svg" },
  { label: "LangChain", image: "/images/logos/langchain.svg" },
  { label: "Kafka", image: "/images/logos/kafka.svg" },
].filter(
  (item, index, items) =>
    items.findIndex((current) => current.label === item.label) === index
);

const iconTextures = techItems.map(({ image }) => {
  const texture = textureLoader.load(image);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  texture.flipY = false;
  texture.needsUpdate = true;
  return texture;
});

const sphereGeometry = new THREE.SphereGeometry(1, 18, 18);

const makeLabelTexture = (label: string) => {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 320;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return new THREE.CanvasTexture(canvas);
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.lineJoin = "round";
  ctx.miterLimit = 2;

  const maxLabelWidth = canvas.width * 0.84;
  let fontSize = 212;
  ctx.font = `700 ${fontSize}px Segoe UI, Arial, sans-serif`;

  while (fontSize > 120 && ctx.measureText(label).width > maxLabelWidth) {
    fontSize -= 6;
    ctx.font = `700 ${fontSize}px Segoe UI, Arial, sans-serif`;
  }

  ctx.lineWidth = Math.max(10, Math.round(fontSize * 0.08));
  ctx.strokeStyle = "rgba(255, 255, 255, 0.98)";
  ctx.strokeText(label, canvas.width / 2, canvas.height / 2);
  ctx.fillStyle = "#000000";
  ctx.fillText(label, canvas.width / 2, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  texture.flipY = false;
  texture.needsUpdate = true;
  return texture;
};

type SphereConfig = {
  labelMap?: THREE.Texture;
  iconMap: THREE.Texture;
  position: [number, number, number];
  scale: number;
};

type SphereProps = SphereConfig & {
  isActive: boolean;
  sphereMaterial: THREE.MeshBasicMaterial;
};

function SphereGeo({
  iconMap,
  isActive,
  labelMap,
  position,
  scale,
  sphereMaterial,
}: SphereProps) {
  const bodyRef = useRef<RapierRigidBody | null>(null);
  const impulseVec = useMemo(() => new THREE.Vector3(), []);

  useFrame((_state, delta) => {
    if (!isActive || !bodyRef.current) {
      return;
    }

    const body = bodyRef.current;
    const cappedDelta = Math.min(1 / 30, delta);
    const translation = body.translation();

    impulseVec
      .set(translation.x, translation.y, translation.z)
      .normalize()
      .multiply(
        new THREE.Vector3(
          -30 * cappedDelta * scale,
          -90 * cappedDelta * scale,
          -30 * cappedDelta * scale
        )
      );

    body.applyImpulse(impulseVec, true);
  });

  return (
    <RigidBody
      ref={bodyRef}
      position={position}
      colliders={false}
      canSleep
      linearDamping={0.82}
      angularDamping={0.55}
      friction={0.3}
      restitution={0.22}
      enabledRotations={[false, false, false]}
    >
      <BallCollider args={[scale]} />
      <mesh scale={scale} geometry={sphereGeometry} material={sphereMaterial}>
        <Decal position={[0, scale * 0.2, 1.02]} scale={0.94}>
          <meshBasicMaterial
            color="#ffffff"
            toneMapped={false}
            polygonOffset
            polygonOffsetFactor={-2}
          />
        </Decal>

        <Decal position={[0, scale * 0.2, 1.03]} scale={0.86}>
          <meshBasicMaterial
            map={iconMap}
            transparent
            toneMapped={false}
            depthWrite={false}
            polygonOffset
            polygonOffsetFactor={-3}
          />
        </Decal>

        {labelMap ? (
          <Decal position={[-0.06, -scale * 0.78, 1.03]} scale={[1.24, 0.4, 1]}>
            <meshBasicMaterial
              map={labelMap}
              transparent
              toneMapped={false}
              depthWrite={false}
              polygonOffset
              polygonOffsetFactor={-3}
            />
          </Decal>
        ) : null}
      </mesh>
    </RigidBody>
  );
}

function Pointer() {
  const bodyRef = useRef<RapierRigidBody | null>(null);
  const pointerVec = useMemo(() => new THREE.Vector3(100, 100, 100), []);
  const targetVec = useMemo(() => new THREE.Vector3(100, 100, 100), []);

  useFrame(({ pointer, viewport }) => {
    targetVec.set(
      (pointer.x * viewport.width) / 2,
      (pointer.y * viewport.height) / 2 - 1.6,
      0
    );

    pointerVec.lerp(targetVec, 0.18);
    bodyRef.current?.setNextKinematicTranslation(pointerVec);
  });

  return (
    <RigidBody
      ref={bodyRef}
      type="kinematicPosition"
      position={[100, 100, 100]}
      colliders={false}
    >
      <BallCollider args={[1.8]} />
    </RigidBody>
  );
}

const TechStack = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 900);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 900px)");
    const updateMobile = (event?: MediaQueryListEvent) => {
      setIsMobile(event ? event.matches : mediaQuery.matches);
    };

    updateMobile();

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", updateMobile);
      return () => mediaQuery.removeEventListener("change", updateMobile);
    }

    mediaQuery.addListener(updateMobile);
    return () => mediaQuery.removeListener(updateMobile);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsActive(Boolean(entry?.isIntersecting));
      },
      {
        rootMargin: "160px 0px",
        threshold: 0.08,
      }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const sphereMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: "#ffffff",
        toneMapped: false,
      }),
    []
  );

  const labelTextures = useMemo(
    () =>
      techItems.map(({ label, hideLabel }) =>
        hideLabel ? undefined : makeLabelTexture(label)
      ),
    []
  );

  const spheres = useMemo<SphereConfig[]>(() => {
    const scales = [0.62, 0.72, 0.78, 0.88];

    return techItems.map((_item, index) => ({
      scale: scales[index % scales.length],
      iconMap: iconTextures[index],
      labelMap: labelTextures[index],
      position: [
        THREE.MathUtils.randFloatSpread(isMobile ? 5.5 : 7.5),
        THREE.MathUtils.randFloatSpread(isMobile ? 4.5 : 6) - 0.8,
        THREE.MathUtils.randFloatSpread(isMobile ? 3.2 : 4.5) - 2.2,
      ] as [number, number, number],
    }));
  }, [isMobile, labelTextures]);

  return (
    <div ref={sectionRef} className="techstack">
      <h2> My Techstack</h2>

      <Canvas
        className="tech-canvas"
        frameloop={isActive ? "always" : "demand"}
        dpr={isMobile ? 1 : [1, 1.2]}
        performance={{ min: 0.75 }}
        gl={{
          alpha: true,
          antialias: !isMobile,
          depth: true,
          powerPreference: "high-performance",
          stencil: false,
        }}
        camera={{ position: [0, 0, 20], fov: 32.5, near: 1, far: 80 }}
        onCreated={({ gl }) => {
          gl.toneMappingExposure = 1.2;
          gl.setClearColor(new THREE.Color("#000000"), 0);
        }}
      >
        <ambientLight intensity={0.95} />
        <spotLight
          position={[20, 20, 25]}
          penumbra={1}
          angle={0.2}
          color="white"
          intensity={1.05}
        />
        <directionalLight position={[0, 5, -4]} intensity={1} />

        <Suspense fallback={null}>
          <Physics gravity={[0, 0, 0]} interpolate={false} timeStep={1 / 60}>
            {isActive ? <Pointer /> : null}
            {spheres.map((sphere, index) => (
              <SphereGeo
                key={index}
                {...sphere}
                isActive={isActive}
                sphereMaterial={sphereMaterial}
              />
            ))}
          </Physics>
        </Suspense>
      </Canvas>
    </div>
  );
};

export default TechStack;
