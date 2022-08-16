require("dotenv").config;
const axios = require("axios");
const BASE_URL = `https://api.openweathermap.org/data/2.5/forecast`;

const test = async (args) => {
  const QUERY_URL = BASE_URL + `lat=${args.lat}&lon=${args.lon}`;
  try {
    const { data } = await axios.get(QUERY_URL, {
      params: {
        lat: args.lat,
        lon: args.lon,
        appid: process.env.API_KEY,
      },
    });

    console.log(process.env);
  } catch (err) {
    console.log(err);
    console.log(process.env);

    return { test: "hello" };
  }
};

test({
  lat: "0.0",
  lon: "0.0",
});
