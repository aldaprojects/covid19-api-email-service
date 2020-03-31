"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./classes/server"));
const routes_1 = __importDefault(require("./routes/routes"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const mongo_1 = __importDefault(require("./classes/mongo"));
const server = server_1.default.instance;
const services_1 = __importDefault(require("./services/services"));
const environment_1 = require("./global/environment");
// BodyParser
server.app.use(body_parser_1.default.urlencoded({ extended: true }));
server.app.use(body_parser_1.default.json());
// CORS
server.app.use(cors_1.default({ origin: true, credentials: true }));
// connect bd
mongo_1.default.connect(environment_1.URL_DB);
setInterval(services_1.default, 3000);
// Rutas
server.app.use('/', routes_1.default);
server.start(() => {
    console.log(`Servidor corriendo en el puerto ${server.port}`);
});
