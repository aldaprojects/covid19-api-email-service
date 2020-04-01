"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
let Schema = mongoose_1.default.Schema;
let utilsSchema = new Schema({
    about: { type: String },
    data: { type: Number || Object },
}, { collection: 'utils' });
module.exports = mongoose_1.default.model('utils', utilsSchema);
