require("dotenv").config();
const axios = require("axios").default;

const FORECAST_URL = `https://api.openweathermap.org/data/2.5/forecast`;
const GEOCODING_URL = "http://api.openweathermap.org/geo/1.0/direct";
const CURRENT_WEATHER_URL = "https://api.openweathermap.org/data/2.5/weather";

const unitMapping = {
  CELCIUS: "metric",
  FARENHEIT: "imperial",
  KELVIN: "standard",
};

const resolvers = {
  Query: {
    /* getForecastByCoords(
      lat: String!
      lon: String!
      config: Config
    ): [Forecast!]! */
    getForecastByCoords: async (parent, args) => {
      try {
        const { data } = await axios.get(FORECAST_URL, {
          params: {
            lat: args.lat,
            lon: args.lon,
            units:
              args.config && args.config.units
                ? unitMapping[args.config.units]
                : "metric",
            lang: args.config && args.config.lang ? args.config.lang : "en",
            appid: process.env.API_KEY,
          },
        });
        console.log(data.list);

        const populatedList = data.list.map((json) => ({
          ...json,
          dtTxt: json.dt_txt,
          main: {
            ...json.main,
            feelsLike: json.main.feels_like,
            tempMin: json.main.temp_min,
            tempMax: json.main.temp_max,
            seaLevel: json.main.sea_level,
            grndLevel: json.main.grnd_level,
            tempKf: json.main.temp_kf,
          },
          cloudCover: json.clouds.all,
          chanceOfRain: json.pop,
          volumeOfRain: json.rain ? json.rain["3h"] : 0.0,
          volumeOfSnow: json.snow ? json.snow["3h"] : 0.0,
        }));
        console.log(populatedList);

        return populatedList;
      } catch (err) {
        console.log(err);
      }
    },

    // getLocationByName(name: String!, config: Config): [Location!]
    getLocationByName: async (parent, args) => {
      try {
        const currentFetchResults = [];

        const { data: firstFetch } = await axios.get(GEOCODING_URL, {
          params: {
            q: args.name,
            limit: 3,
            appid: process.env.API_KEY,
          },
        });

        console.log("firstFetch: ...");
        console.log(firstFetch);

        await Promise.all(
          firstFetch.map(async (result, index) => {
            let { data } = await axios.get(CURRENT_WEATHER_URL, {
              params: {
                lat: result.lat,
                lon: result.lon,
                units:
                  args.config && args.config.units
                    ? unitMapping[args.config.units]
                    : "metric",
                lang: args.config && args.config.lang ? args.config.lang : "en",
                appid: process.env.API_KEY,
              },
            });

            console.log(`Index ${index}`);
            console.log(data);

            currentFetchResults.push({
              ...firstFetch[index],
              currentWeather: {
                ...data,
                main: {
                  ...data.main,
                  feelsLike: data.main.feels_like,
                  tempMin: data.main.temp_min,
                  tempMax: data.main.temp_max,
                  seaLevel: data.main.sea_level,
                  grndLevel: data.main.grnd_level,
                  tempKf: data.main.temp_kf,
                },
                cloudCover: data.clouds.all,
                volumeOfRain: data.rain ? json.rain["3h"] : 0.0,
                volumeOfSnow: data.snow ? json.snow["3h"] : 0.0,
              },
            });
          })
        );

        console.log(currentFetchResults);
        return currentFetchResults;
      } catch (err) {
        console.log(err);
      }
    },
  },
};
module.exports = { resolvers };
