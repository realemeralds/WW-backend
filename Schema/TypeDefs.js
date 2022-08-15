const { gql } = require("apollo-server-express");

const typeDefs = gql`
    type Query {
        cities: cityType;
        forecast: forecastType;
    }
`;

/**
 * I need two types:
 * 1. For the geocaching, which I can use to go all the way
 * 2. For just the location + weather from the coordinates, which
 * I can manipulate into an array of past temperatures.
 */
