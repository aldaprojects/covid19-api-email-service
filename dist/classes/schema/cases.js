"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
let Schema = mongoose_1.default.Schema;
let caseSchema = new Schema({
    country_name: { type: String },
    new_cases: { type: Number },
    total_cases: { type: Number },
    date: { type: Date },
});
module.exports = mongoose_1.default.model('case', caseSchema);
