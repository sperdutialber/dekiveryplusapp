const { iaTexto } = require("./iaService");

async function tarifaClimatica(base, clima) {
  const prompt = `
Eres el motor de tarifas dinamicas de DeliveryPlus.
Clima actual: ${clima}
Tarifa base: ${base}

Calcula la tarifa final considerando:
- lluvia
- tormenta
- calor extremo
- viento fuerte
- riesgo para el repartidor

Devuelve solo un numero.
  `;

  const respuesta = await iaTexto(prompt);
  return parseFloat(respuesta);
}

module.exports = { tarifaClimatica };
