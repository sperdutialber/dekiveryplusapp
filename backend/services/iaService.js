const axios = require("axios");

async function iaTexto(mensaje) {
  const response = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      model: process.env.OPENAI_MODEL_TEXT,
      messages: [{ role: "user", content: mensaje }]
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      }
    }
  );

  return response.data.choices[0].message.content;
}

async function iaVoz(texto) {
  const response = await axios.post(
    "https://api.openai.com/v1/audio/speech",
    {
      model: process.env.OPENAI_MODEL_VOICE,
      input: texto
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      responseType: "arraybuffer"
    }
  );

  return response.data;
}

async function iaEscuchar(audioBuffer) {
  const response = await axios.post(
    "https://api.openai.com/v1/audio/transcriptions",
    audioBuffer,
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "audio/mpeg"
      }
    }
  );

  return response.data.text;
}

module.exports = { iaTexto, iaVoz, iaEscuchar };
