import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "FieldDemo Pulse",
    short_name: "Pulse",
    description: "Agentic field-force intelligence plugin for agribusinesses.",
    start_url: "/",
    display: "standalone",
    background_color: "#f3f9f1",
    theme_color: "#1d7f62",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
