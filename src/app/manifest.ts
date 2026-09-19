import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Nós Dois — Perguntas de Casal",
    short_name: "Nós Dois",
    description: "Um jogo de perguntas pra vocês dois se conhecerem melhor.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#ff6b6b",
    theme_color: "#ff6b6b",
    lang: "pt-BR",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
