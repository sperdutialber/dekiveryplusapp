const { iaTexto } = require("./iaService");

async function asignarPedidoIA(datos) {
  const prompt = `
Eres el despachador inteligente de DeliveryPlus.
Tu tarea es asignar el mejor repartidor segun:

- distancia
- clima
- trafico
- reputacion
- disponibilidad
- urgencia del pedido

Datos:
${JSON.stringify(datos)}

Devuelve un JSON con:
{
  "repartidor_id": number,
  "motivo": string
}
  `;

  const respuesta = await iaTexto(prompt);
  return JSON.parse(respuesta);
}

module.exports = { asignarPedidoIA };
