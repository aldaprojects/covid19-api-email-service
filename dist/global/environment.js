"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SERVER_PORT = Number(process.env.PORT) || 3000;
process.env.VISITAS = "0";
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
if (process.env.NODE_ENV === 'dev') {
    exports.URL_DB = 'mongodb://localhost/covid';
}
else {
    exports.URL_DB = 'mongodb+srv://aldair:U87sJjtcdl8YHbge@apipuerta-fcejs.mongodb.net/covid';
}
console.log(exports.URL_DB);
