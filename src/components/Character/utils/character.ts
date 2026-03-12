import * as THREE from "three";
import { DRACOLoader, GLTF, GLTFLoader } from "three-stdlib";
import { setCharTimeline, setAllTimeline } from "../../utils/GsapScroll";
import { decryptFile } from "./decrypt";
import { withBasePath } from "../../../utils/basePath";

type ExtendedStandardMaterial = THREE.MeshStandardMaterial & {
  sheen?: number;
  specularIntensity?: number;
};

const createStyledMaterial = (
  material: THREE.Material,
  color: string,
  overrides: Partial<ExtendedStandardMaterial> = {}
) => {
  const nextMaterial = material.clone() as ExtendedStandardMaterial;
  nextMaterial.color = new THREE.Color(color);
  nextMaterial.map = null;
  nextMaterial.lightMap = null;
  nextMaterial.aoMap = null;
  nextMaterial.emissiveMap = null;
  nextMaterial.bumpMap = null;
  nextMaterial.normalMap = null;
  nextMaterial.roughnessMap = null;
  nextMaterial.metalnessMap = null;
  nextMaterial.alphaMap = null;
  nextMaterial.envMapIntensity = overrides.envMapIntensity ?? 0.03;
  nextMaterial.roughness = overrides.roughness ?? 0.92;
  nextMaterial.metalness = overrides.metalness ?? 0.02;
  if (typeof nextMaterial.sheen === "number") {
    nextMaterial.sheen = 0;
  }
  if (typeof nextMaterial.specularIntensity === "number") {
    nextMaterial.specularIntensity = 0.15;
  }
  Object.assign(nextMaterial, overrides);
  nextMaterial.needsUpdate = true;
  return nextMaterial;
};

const createBlackShirtMaterial = () =>
  new THREE.MeshBasicMaterial({
    color: new THREE.Color("#050505"),
    toneMapped: false,
  });

function addCapStyling(character: THREE.Object3D) {
  const crown = character.getObjectByName("CAP.002") as THREE.Mesh | null;
  if (!crown || !crown.parent || crown.parent.getObjectByName("custom-cap-shell")) {
    return;
  }

  character.updateMatrixWorld(true);
  const crownBounds = new THREE.Box3().setFromObject(crown);
  const size = crownBounds.getSize(new THREE.Vector3());
  const centerWorld = crownBounds.getCenter(new THREE.Vector3());
  const anchor = crown.parent;
  const center = anchor.worldToLocal(centerWorld.clone());

  const shellMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#050608"),
    roughness: 0.96,
    metalness: 0.02,
    side: THREE.DoubleSide,
  });

  const shell = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 30, 22, 0.1, Math.PI * 1.8, 0.08, Math.PI * 0.6),
    shellMaterial
  );
  shell.name = "custom-cap-shell";
  shell.scale.set(size.x * 0.95, size.y * 1.08, size.z * 0.95);
  shell.position.set(center.x, center.y + size.y * 0.08, center.z - size.z * 0.03);
  shell.rotation.x = -0.08;

  const frontPanel = new THREE.Mesh(
    new THREE.PlaneGeometry(size.x * 0.54, size.y * 0.32),
    shellMaterial.clone()
  );
  frontPanel.position.set(0, -size.y * 0.03, size.z * 0.46);
  frontPanel.rotation.x = -0.08;

  const swooshShape = new THREE.Shape();
  swooshShape.moveTo(-0.62, 0.04);
  swooshShape.quadraticCurveTo(-0.18, -0.08, 0.64, -0.31);
  swooshShape.quadraticCurveTo(0.18, -0.02, -0.2, 0.16);
  swooshShape.quadraticCurveTo(-0.34, 0.21, -0.62, 0.04);

  const swoosh = new THREE.Mesh(
    new THREE.ShapeGeometry(swooshShape, 24),
    new THREE.MeshStandardMaterial({
      color: new THREE.Color("#d11f2f"),
      roughness: 0.44,
      metalness: 0.03,
      side: THREE.DoubleSide,
    })
  );
  swoosh.position.set(size.x * 0.04, size.y * 0.01, 0.002);
  swoosh.scale.set(size.x * 0.18, size.y * 0.12, 1);
  swoosh.rotation.z = -0.12;

  frontPanel.add(swoosh);
  shell.add(frontPanel);
  anchor.add(shell);
}

function updateCharacterMaterials(mesh: THREE.Mesh) {
  const nodeName = mesh.name;
  const material = mesh.material as THREE.Material | THREE.Material[];

  if (nodeName === "BODY.SHIRT") {
    mesh.material = Array.isArray(material)
      ? material.map(() => createBlackShirtMaterial())
      : createBlackShirtMaterial();
    return;
  }

  if (Array.isArray(material)) {
    return;
  }

  if (nodeName === "Pant") {
    mesh.material = createStyledMaterial(material, "#355f9a", {
      roughness: 0.86,
      metalness: 0.03,
    });
    return;
  }

  if (nodeName === "Shoe") {
    mesh.material = createStyledMaterial(material, "#f6f7f8", {
      roughness: 0.84,
      metalness: 0.01,
    });
    return;
  }

  if (nodeName === "Sole") {
    mesh.material = createStyledMaterial(material, "#ffffff", {
      roughness: 0.9,
      metalness: 0,
    });
    return;
  }

  if (nodeName === "CAP.001" || nodeName === "CAP.002") {
    mesh.material = createStyledMaterial(material, "#050608", {
      roughness: 0.98,
      metalness: 0,
      envMapIntensity: 0.02,
    });
    return;
  }

  if (
    nodeName === "Face.002" ||
    nodeName === "Ear.001" ||
    nodeName === "Neck" ||
    nodeName === "Hand"
  ) {
    mesh.material = createStyledMaterial(
      material,
      nodeName === "Hand" ? "#e4b294" : "#efc2a5",
      {
        roughness: 0.95,
        metalness: 0,
      }
    );
  }

  if (nodeName === "Face.002" && mesh.morphTargetInfluences) {
    mesh.morphTargetInfluences[0] = 0.38;
  }
}

const setCharacter = (
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera
) => {
  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath(withBasePath("draco/"));
  loader.setDRACOLoader(dracoLoader);

  const loadCharacter = () => {
    return new Promise<GLTF | null>(async (resolve, reject) => {
      try {
        const encryptedBlob = await decryptFile(
          withBasePath("models/character.enc?v=2"),
          "MyCharacter12"
        );
        const blobUrl = URL.createObjectURL(new Blob([encryptedBlob]));

        let character: THREE.Object3D;
        loader.load(
          blobUrl,
          async (gltf) => {
            character = gltf.scene;
            await renderer.compileAsync(character, camera, scene);
            character.traverse((child: any) => {
              if (child.isMesh) {
                const mesh = child as THREE.Mesh;
                if (mesh.material) {
                  updateCharacterMaterials(mesh);
                }
                child.castShadow = true;
                child.receiveShadow = true;
                mesh.frustumCulled = true;
              }
            });
            addCapStyling(character);
            resolve(gltf);
            setCharTimeline(character, camera);
            setAllTimeline();
            character!.getObjectByName("footR")!.position.y = 3.36;
            character!.getObjectByName("footL")!.position.y = 3.36;
            dracoLoader.dispose();
          },
          undefined,
          (error) => {
            console.error("Error loading GLTF model:", error);
            reject(error);
          }
        );
      } catch (err) {
        reject(err);
        console.error(err);
      }
    });
  };

  return { loadCharacter };
};

export default setCharacter;
