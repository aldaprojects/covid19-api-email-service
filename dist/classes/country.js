"use strict";
const mongoose = require('mongoose');
let Schema = mongoose.Schema;
let countrySchema = new Schema({
    country_name: { type: String },
    cases: { type: Number },
    deaths: { type: Number },
    region: { type: String },
    total_recovered: { type: Number },
    new_deaths: { type: Number },
    new_cases: { type: Number },
    serious_critical: { type: Number },
    active_cases: { type: Number },
    total_cases_per_1m_population: { type: Number },
    last_updates: { type: Array },
    ranking: { type: Number },
    ranking_pos: { type: Number },
    future_cases: { type: Array },
    subscriptions: { type: Array }
}, { collection: 'countries' });
module.exports = mongoose.model('country', countrySchema);
