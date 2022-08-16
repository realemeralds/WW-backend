require("dotenv").config();
const axios = require("axios").default;

const BASE_URL = `api.openweathermap.org/data/2.5/forecast`;
const resolvers = {
  Query: {
    getForecastByCoords: async (parent, args) => {
      const QUERY_URL = BASE_URL + `lat=${args.lat}&lon=${args.lon}`;

      try {
        const { data } = await axios.get(QUERY_URL, {
          params: {
            lat: args.lat,
            lon: args.lon,
            appid: process.env.API_KEY,
          },
        });

        console.log(data.list);
        return data;
      } catch (err) {
        console.log(err);

        return { test: "hello" };
      }
    },
  },
};
module.exports = { resolvers };
