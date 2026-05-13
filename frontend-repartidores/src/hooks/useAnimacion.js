import { useState } from "react";

export function useAnimacion() {
  const [animacion, setAnimacion] = useState(null);

  function activar(nombre) {
    setAnimacion(nombre);
    setTimeout(() => setAnimacion(null), 3000);
  }

  return { animacion, activar };
}
