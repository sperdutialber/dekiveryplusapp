const axios = require("axios");

async function obtenerClima(lat, lon) {
  const url = `${process.env.WEATHER_API_URL}/weather?lat=${lat}&lon=${lon}&appid=${process.env.WEATHER_API_KEY}&units=metric&lang=es`;

  const response = await axios.get(url);
  return {
    clima: response.data.weather[0].main,
    descripcion: response.data.weather[0].description,
    temperatura: response.data.main.temp
  };
}

module.exports = { obtenerClima };
