"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Country = require('../classes/schema/country');
const Case = require('../classes/schema/cases');
exports.getAllCountries = (callback) => {
    Country.find({}, 'country_name ranking cases')
        .sort({ 'cases': -1 })
        .exec(callback);
};
exports.getLatestCases = (callback) => {
    Case.find()
        .sort({ 'date': -1 })
        .limit(9)
        .exec(callback);
};
exports.getAllCountriesName = (callback) => {
    Country.find({}, 'country_name')
        .sort({ 'country_name': 1 })
        .exec(callback);
};
exports.getGlobalCases = (callback) => {
    Country.find()
        .map((countries) => {
        let total_cases = 0;
        let total_deaths = 0;
        let total_recovered = 0;
        for (let i = 0; i < countries.length; i++) {
            total_cases += countries[i].cases;
            total_deaths += countries[i].deaths;
            total_recovered += countries[i].total_recovered;
        }
        return {
            total_cases,
            total_deaths,
            total_recovered
        };
    })
        .exec(callback);
};
exports.getOneCountry = (name, callback) => {
    Country.findOne({ 'country_name': name }, callback);
};
