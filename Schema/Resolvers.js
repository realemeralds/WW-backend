import "https://deno.land/std@0.152.0/dotenv/load.ts";
import axiod from "https://deno.land/x/axiod/mod.ts";

const FORECAST_URL = `https://api.openweathermap.org/data/2.5/forecast`;
const GEOCODING_URL = "http://api.openweathermap.org/geo/1.0/direct";
const CURRENT_WEATHER_URL = "https://api.openweathermap.org/data/2.5/weather";

const unitMapping = {
  CELCIUS: "metric",
  FARENHEIT: "imperial",
  KELVIN: "standard",
};

export const resolvers = {
  Query: {
    /* getForecastByCoords(
      lat: String!
      lon: String!
      config: Config
    ): [Forecast!]! */
    getForecastByCoords: async (parent, args) => {
      try {
        const { data: firstFetch } = await axiod.get(CURRENT_WEATHER_URL, {
          params: {
            lat: args.lat,
            lon: args.lon,
            units:
            args.config && args.config.units
              ? unitMapping[args.config.units]
              : "metric",
            lang: args.config && args.config.lang ? args.config.lang : "en",
            appid: Deno.env.get("API_KEY"),
          },
        });

        console.log("firstFetch: ...");
        console.log(firstFetch);

        const populatedCurrentWeather = {
          ...firstFetch,
          main: {
            ...firstFetch.main,
            feelsLike: firstFetch.main.feels_like,
            tempMin: firstFetch.main.temp_min,
            tempMax: firstFetch.main.temp_max,
            seaLevel: firstFetch.main.sea_level,
            grndLevel: firstFetch.main.grnd_level,
            tempKf: firstFetch.main.temp_kf,
          },
          cloudCover: firstFetch.clouds.all,
          volumeOfRain: firstFetch.rain ? firstFetch.rain["3h"] : 0.0,
          volumeOfSnow: firstFetch.snow ? firstFetch.snow["3h"] : 0.0,
        };

        console.log(populatedCurrentWeather);

        const { data: secondFetch } = await axiod.get(FORECAST_URL, {
          params: {
            lat: args.lat,
            lon: args.lon,
            units:
              args.config && args.config.units
                ? unitMapping[args.config.units]
                : "metric",
            lang: args.config && args.config.lang ? args.config.lang : "en",
            appid: Deno.env.get("API_KEY"),
          },
        });

        const initalHourOfDay = secondFetch.list[0].dt / 3600;

        const forecasts = {
          twoday: secondFetch.list.find(
            (forecast) =>
            ([10, 11, 12].includes(
              (forecast.dt + firstFetch.timezone) / 3600 % 24
            )) && (forecast.dt / 3600 - initalHourOfDay >= 36)
          ),
          fourday: secondFetch.list.find(
            (forecast) =>
            ([10, 11, 12, 13, 14, 15].includes(
              (forecast.dt + firstFetch.timezone) / 3600 % 24
            )) % 24 && (forecast.dt / 3600 - initalHourOfDay >= 84)
          ),
        };

        console.log('-----------------------FORECASTS---------------------------')
        console.log(forecasts)

        const populatedForecasts = {}
        console.log(
          "\n------------------POPULATED FORECASTS -----------------------"
        );
        secondFetch.list.forEach((input) => {
          console.log((input.dt + firstFetch.timezone) / 3600 % 24) ;
          console.log([10, 11, 12].includes(
            (input.dt + firstFetch.timezone) / 3600 % 24
          ))
          console.log(input.dt / 3600 - initalHourOfDay);
          console.log((input.dt / 3600 - initalHourOfDay >= 58))
          console.log("---------------------------")
        });


        for (const key in forecasts) {
          const json = forecasts[key]

          populatedForecasts[key] = {
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
          }
        }

        console.log(populatedForecasts);

        const populatedDict = {
          current: populatedCurrentWeather,
          ...populatedForecasts,
        };
        console.log(populatedDict);

        return populatedDict;
      } catch (err) {
        console.log(err);
      }
    },

    // getLocationByName(name: String!, config: Config): [Location!]
    getLocationByName: async (parent, args) => {
      try {
        const currentFetchResults = [];

        const { data: firstFetch } = await axiod.get(GEOCODING_URL, {
          params: {
            q: args.name,
            limit: 3,
            appid: Deno.env.get("API_KEY"),
          },
        });

        console.log("firstFetch: ...");
        console.log(firstFetch);

        await Promise.all(
          firstFetch.map(async (result, index) => {
            let { data } = await axiod.get(CURRENT_WEATHER_URL, {
              params: {
                lat: result.lat,
                lon: result.lon,
                units:
                  args.config && args.config.units
                    ? unitMapping[args.config.units]
                    : "metric",
                lang: args.config && args.config.lang ? args.config.lang : "en",
                appid: Deno.env.get("API_KEY"),
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
                volumeOfRain: data.rain ? data.rain["3h"] : 0.0,
                volumeOfSnow: data.snow ? data.snow["3h"] : 0.0,
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
