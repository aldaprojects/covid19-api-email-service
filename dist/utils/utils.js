"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Utils = require('../classes/schema/utils');
exports.updateDBGlobalData = (newCases, newDeaths, newRecovered) => {
    Utils.findOne({ about: 'global' }, (err, global) => {
        let newData = {
            total_cases: global.data.total_cases + newCases,
            total_deaths: global.data.total_deaths + newDeaths,
            total_recovered: global.data.total_recovered + newRecovered
        };
        global.data = newData;
        global.save();
    });
};
