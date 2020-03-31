"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
let Schema = mongoose_1.default.Schema;
let viewsSchema = new Schema({
    about: { type: String, default: 'covidpage' },
    views: { type: Number, default: 0 },
}, { collection: 'views' });
module.exports = mongoose_1.default.model('view', viewsSchema);
