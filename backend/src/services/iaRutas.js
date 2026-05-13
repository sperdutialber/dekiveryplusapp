const { iaTexto } = require("./iaService");

async function rutaOptima(datos) {
  const prompt = `
Eres el optimizador de rutas de DeliveryPlus.
Debes calcular la mejor ruta considerando:

- distancia
- clima
- trafico
- zonas calientes
- seguridad
- rapidez

Datos:
${JSON.stringify(datos)}

Devuelve un JSON con:
{
  "ruta": ["lat,lng", "lat,lng", ...],
  "motivo": "texto explicando por que"
}
  `;

  const respuesta = await iaTexto(prompt);
  return JSON.parse(respuesta);
}

module.exports = { rutaOptima };
