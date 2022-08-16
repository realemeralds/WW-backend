const { gql } = require("apollo-server-express");

// getCityByName(name: String!, country: String, config: ConfigInput): [City!]!;
const typeDefs = gql`
    type Query {
        getForecastByCoords(lat: String!, lon: String!): [Forecast!]!;
    }

    type Forecast {
        dt: Int!,
        dt_txt: String!,
        main: ForecastDetails!,
        weather: WeatherDetails!,
        cloudCover: Int!,
        wind: WindDetails!,
        visibility: Int!,
        chanceOfRain: Int!,
        volumeOfRain: Int!,
        volumeOfSnow: Int!,
    }

    type ForecastDetails {
        temp: Int!,
        feelsLike: Int!,
        tempMin: Int!,
        tempMax: Int!,
        pressure: Int!,
        pressureSeaLevel: Int!,
        grndLevel: Int!,
        humidity: Int!,
    }

    type WeatherDetails {
        id: Int!,
        main: String!,
        description: String!,
        icon: String!
    }

    type WindDetails{
        speed: Float!,
        deg: Int!,
        gust: Float!,
    }
`;

export default typeDefs;
