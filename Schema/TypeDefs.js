const { gql } = require("apollo-server-express");

// TODO: Implement localNames for geocaching
const typeDefs = gql`
  type Query {
    getForecastByCoords(
      lat: String!
      lon: String!
      config: Config
    ): [Forecast!]!
    getLocationByName(name: String!, config: Config): [Location!]!
  }

  type Location {
    name: String!
    country: String!
    state: String
    lat: String!
    lon: String!
    currentWeather: CurrentWeather!
  }

  type CurrentWeather {
    dt: Int!
    timezone: Int!
    weather: [WeatherDetails!]!
    main: ForecastDetails!
    visibility: String!
    wind: WindDetails!
    cloudCover: Float!
  }

  input Config {
    units: UnitFormat
    lang: LanguageFormat
  }

  enum UnitFormat {
    CELCIUS
    FARENHEIT
    KELVIN
  }

  enum LanguageFormat {
    af
    al
    ar
    az
    bg
    ca
    cz
    da
    de
    el
    en
    eu
    fa
    fi
    fr
    gl
    he
    hi
    hr
    hu
    id
    it
    ja
    kr
    la
    lt
    mk
    no
    nl
    pl
    pt
    pt_br
    ro
    ru
    sv
    se
    sk
    sl
    sp
    es
    sr
    th
    tr
    ua
    uk
    vi
    zh_cn
    zh_tw
    zu
  }

  type Forecast {
    dt: Int!
    dtTxt: String!
    main: ForecastDetails!
    weather: [WeatherDetails!]!
    cloudCover: Int!
    wind: WindDetails!
    visibility: Int!
    chanceOfRain: Float!
    volumeOfRain: Float!
    volumeOfSnow: Float!
  }

  type ForecastDetails {
    temp: Float!
    feelsLike: Float!
    humidity: Int!
    tempMin: Float!
    tempMax: Float!
    pressure: Int!
    seaLevel: Int
    grndLevel: Int
  }

  type WeatherDetails {
    id: Int!
    main: String!
    description: String!
    icon: String!
  }

  type WindDetails {
    speed: Float!
    deg: Int!
    gust: Float
  }
`;

module.exports = { typeDefs };
