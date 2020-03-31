import mongoose from 'mongoose';

let Schema = mongoose.Schema;

let caseSchema = new Schema({
    country_name: { type: String },
    new_cases: { type: Number },
    total_cases: { type: Number },
    date: { type: Date },
});

module.exports = mongoose.model( 'case', caseSchema );
