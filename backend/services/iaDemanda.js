const { iaTexto } = require("./iaService");

async function predecirDemanda(datos) {
  const prompt = `
Eres el analista de demanda de DeliveryPlus.
Usa los datos historicos para predecir:

- horas pico
- zonas calientes
- dias de mayor actividad
- recomendaciones para negocios

Datos:
${JSON.stringify(datos)}

Devuelve un JSON con:
{
  "horas_pico": [...],
  "zonas_calientes": [...],
  "recomendaciones": [...]
}
  `;

  const respuesta = await iaTexto(prompt);
  return JSON.parse(respuesta);
}

module.exports = { predecirDemanda };
