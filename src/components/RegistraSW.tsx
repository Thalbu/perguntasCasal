"use client";

import { useEffect } from "react";

/**
 * Registra o service worker depois que a página carrega. Em dev fica de
 * fora: o SW competiria com o hot reload e cacharia versões velhas.
 */
export function RegistraSW() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;

    const registrar = () =>
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // sem offline; o app continua funcionando normalmente
      });

    if (document.readyState === "complete") registrar();
    else {
      window.addEventListener("load", registrar);
      return () => window.removeEventListener("load", registrar);
    }
  }, []);

  return null;
}
