"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket = __importStar(require("../sockets/sockets"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const Country = require('../classes/schema/country');
const Case = require('../classes/schema/cases');
// import unirest from 'unirest';
const unirest = require('unirest');
const futureCases = (reports, startCases) => {
    let factor = 0;
    let start = reports.length - 6 < 0 ? 0 : reports.length - 6;
    for (let k = start; k < reports.length - 1; k++) {
        factor = factor + reports[k + 1].cases / reports[k].cases;
    }
    factor = reports.length === 1 ? 1 : factor / (reports.length - 1 - start);
    let nextCases = startCases;
    let futureCases = [];
    for (let k = 0; k < 5; k++) {
        nextCases = Math.floor(nextCases * factor);
        futureCases.push({
            'cases': nextCases
        });
    }
    return futureCases;
};
let isNewCases = false;
let isNewDeaths = false;
let isNewRecovered = false;
const updateDatabase = () => {
    console.log('Actualizando...');
    if (isNewDeaths || isNewCases || isNewRecovered) {
        console.log('sockets');
        socket.updateGlobalCases();
        socket.updateRanking();
        socket.updateLatesCases();
    }
    let actualDay = moment_timezone_1.default.utc(new Date()).tz('America/Mexico_City');
    console.log(actualDay.format());
    const req = unirest("GET", "https://coronavirus-monitor.p.rapidapi.com/coronavirus/cases_by_country.php");
    req.headers({
        "x-rapidapi-host": "coronavirus-monitor.p.rapidapi.com",
        "x-rapidapi-key": "a893474679msh25dd76472c39840p1ed318jsn8e77fa160749"
    });
    req.end((data) => {
        if (!data.error) {
            let countries = [];
            try {
                countries = JSON.parse(data.body).countries_stat;
            }
            catch (e) {
                return;
            }
            // console.log(countries[0].country_name);
            // countries[0].cases = "82288";
            Country.find((err, countriesDB) => {
                isNewCases = false;
                isNewDeaths = false;
                isNewRecovered = false;
                if (!err) {
                    for (let i = 0; i < countries.length; i++) {
                        for (let j = 0; j < countriesDB.length; j++) {
                            let isNewCasesB = false;
                            let isNewDeathsB = false;
                            let isNewRecoveredB = false;
                            if (countries[i].country_name === countriesDB[j].country_name) {
                                let newCases = Number.parseInt(countries[i].cases.replace(/,/g, ''));
                                let newDeaths = Number.parseInt(countries[i].deaths.replace(/,/g, ''));
                                let newRecovered = Number.parseInt(countries[i].total_recovered.replace(/,/g, ''));
                                if (countriesDB[j].deaths != newDeaths) {
                                    isNewDeathsB = true;
                                    isNewDeaths = true;
                                    console.log(countriesDB[j].country_name);
                                    console.log('new Deaths');
                                    console.log(countriesDB[j].deaths, newDeaths);
                                    countriesDB[j].deaths = newDeaths;
                                }
                                if (countriesDB[j].total_recovered != newRecovered) {
                                    isNewRecoveredB = true;
                                    isNewRecovered = true;
                                    console.log(countriesDB[j].country_name);
                                    console.log('new Recovered');
                                    console.log(countriesDB[j].total_recovered, newRecovered);
                                    countriesDB[j].total_recovered = newRecovered;
                                }
                                if (countriesDB[j].cases != newCases) {
                                    isNewCasesB = true;
                                    isNewCases = true;
                                    let actualDay = moment_timezone_1.default.utc(new Date()).tz('America/Mexico_City');
                                    const newCase = new Case({
                                        country_name: countriesDB[j].country_name,
                                        new_cases: newCases - countriesDB[j].cases,
                                        total_cases: newCases,
                                        date: actualDay.format()
                                    });
                                    newCase.save();
                                    let reports = countriesDB[j].last_updates;
                                    let size = reports.length;
                                    let dateDB = reports[size - 1].day;
                                    let dayNow = new Date().getDate();
                                    if (dateDB === dayNow) {
                                        reports.pop();
                                    }
                                    reports.push({
                                        'country_name': countries[i].country_name,
                                        'day': dayNow,
                                        'cases': newCases
                                    });
                                    countriesDB[j].future_cases = futureCases(reports, newCases);
                                    console.log(countriesDB[j].country_name);
                                    console.log('new Cases');
                                    console.log(countriesDB[j].cases, newCases);
                                    countriesDB[j].cases = newCases;
                                }
                                if (isNewCasesB || isNewDeathsB || isNewRecoveredB) {
                                    countriesDB[j].save();
                                }
                                countriesDB.splice(j, 1);
                            }
                        }
                    }
                }
            });
        }
    });
};
exports.default = updateDatabase;
