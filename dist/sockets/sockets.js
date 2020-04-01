"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("../classes/server"));
const controller = __importStar(require("../utils/country_controller"));
const server = server_1.default.instance;
exports.updateRanking = () => {
    controller.getAllCountries((err, countries) => {
        if (!err) {
            server.io.emit('newCases', countries);
        }
    });
};
exports.updateGlobalCases = () => {
    controller.getGlobalCases((err, global) => {
        if (!err) {
            server.io.emit('globalCases', global);
        }
    });
};
exports.updateLatesCases = () => {
    controller.getLatestCases((err, cases) => {
        if (!err) {
            server.io.emit('latestCases', cases);
        }
    });
};
exports.updateOneCountry = (countryName) => {
    controller.getOneCountry(countryName, (err, country) => {
        if (!err) {
            server.io.emit(`country${countryName}`, country);
        }
    });
};
