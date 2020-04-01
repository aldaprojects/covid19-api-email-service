"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const environment_1 = require("../global/environment");
const socket = __importStar(require("../sockets/sockets"));
const emitSockets = () => {
    if (environment_1.COUNTRY_LIST.length > 0) {
        console.log('Emiting sockets:', environment_1.COUNTRY_LIST.length);
        if (environment_1.COUNTRY_LIST.length === 1) {
            socket.updateGlobalCases();
            socket.updateRanking();
            socket.updateLatesCases();
        }
        socket.updateOneCountry(environment_1.COUNTRY_LIST[0]);
        environment_1.COUNTRY_LIST.splice(0, 1);
    }
};
exports.default = emitSockets;
