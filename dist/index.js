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
const nodemailer_1 = __importDefault(require("nodemailer"));
const email_service_1 = __importDefault(require("./services/email_service"));
const country_service_1 = __importDefault(require("./services/country_service"));
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});
function sendEmail(mailOptions) {
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        }
        else {
            console.log('Email sent: ' + info.response);
        }
    });
}
exports.sendEmail = sendEmail;
;
// BodyParser
server.app.use(body_parser_1.default.urlencoded({ extended: true }));
server.app.use(body_parser_1.default.json());
// CORS
server.app.use(cors_1.default({ origin: true, credentials: true }));
console.log(process.env.URL_DB);
// connect bd
mongo_1.default.connect(process.env.URL_DB || '');
setInterval(services_1.default, 4000);
setInterval(email_service_1.default, 2000);
setInterval(country_service_1.default, 200);
// Rutas
server.app.use('/', routes_1.default);
server.start(() => {
    console.log(`Servidor corriendo en el puerto ${server.port}`);
});
