import { gql } from "https://deno.land/x/oak_graphql/mod.ts";

// TODO: Implement localNames for geocaching
export const typeDefs = gql`
  type Query {
    getForecastByCoords(
      lat: String!
      lon: String!
      config: Config
    ): CombinedForecast!
    getLocationByName(name: String!, config: Config): [Location!]
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
    volumeOfRain: Float
    volumeOfSnow: Float
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

  type CombinedForecast {
    current: CurrentWeather!
    threeday: Forecast!
    fiveday: Forecast!
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
