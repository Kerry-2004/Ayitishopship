import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ShippingnowUiUx } from "./screens/ShippingnowUiUx/ShippingnowUiUx";

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <ShippingnowUiUx />
  </StrictMode>,
);
