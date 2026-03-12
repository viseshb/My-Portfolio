import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import * as RAPIER from "@dimforge/rapier3d-compat";
import App from "./App.tsx";
import "./index.css";

const bootstrap = async () => {
  await RAPIER.init();

  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
};

void bootstrap();
