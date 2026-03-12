import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");

  return {
    base: env.VITE_BASE_PATH || "/",
    plugins: [react()],
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes("node_modules")) return;

            if (id.includes("@react-three/fiber")) {
              return "fiber-stack";
            }

            if (id.includes("@react-three/drei") || id.includes("three-stdlib")) {
              return "drei-stack";
            }

            if (
              id.includes("@react-three/postprocessing") ||
              id.includes("postprocessing")
            ) {
              return "postprocessing-stack";
            }

            if (
              id.includes("@react-three/rapier") ||
              id.includes("@dimforge") ||
              id.includes("rapier")
            ) {
              return "rapier-stack";
            }

            if (id.includes("three")) {
              return "three-core";
            }

            if (id.includes("gsap")) {
              return "gsap-stack";
            }

            if (id.includes("react-dom") || id.includes("react/")) {
              return "react-vendor";
            }

            if (id.includes("react-icons")) {
              return "icons-vendor";
            }
          },
        },
      },
    },
    server: {
      host: "127.0.0.1",
      port: 4321,
      strictPort: true,
    },
    preview: {
      host: "127.0.0.1",
      port: 4322,
      strictPort: true,
    },
  };
});
