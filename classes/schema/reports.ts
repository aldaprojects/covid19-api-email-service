import mongoose from 'mongoose';

let Schema = mongoose.Schema;

let reportSchema = new Schema({
    country_name: { type: String },
    new_cases: { type: Number },
    new_deaths: { type: Number },
    new_recovered: { type: Number },
    total_cases: { type: Number },
    total_deaths: { type: Number },
    total_recovered: { type: Number },
    day: { type: Number },
    date: { type: Date },
    labelGraphicDate: { type: String },
    labelDate: { type: String }
});

module.exports = mongoose.model( 'report', reportSchema );
