"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const environment_1 = require("../global/environment");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const index_1 = require("../index");
const sockets_1 = require("../sockets/sockets");
const sendPendingEmails = () => {
    if (environment_1.EMAIL_LIST.length > 0) {
        console.log('Pending emails:', environment_1.EMAIL_LIST.length);
        let countryName = environment_1.EMAIL_LIST[0].newUpdate.country_name;
        let date = environment_1.EMAIL_LIST[0].newUpdate.date;
        let body = '';
        let tittle = '';
        if (environment_1.EMAIL_LIST[0].newUpdate.new_cases) {
            sockets_1.updateOneCountry(environment_1.EMAIL_LIST[0].newUpdate.country_name);
            tittle = 'nuevos casos';
            body =
                `
                <p> Nuevos casos: <strong>${environment_1.EMAIL_LIST[0].newUpdate.new_cases} </strong> </p> 
                <p> Total: ${environment_1.EMAIL_LIST[0].newUpdate.total_cases} </p>
            `;
        }
        else if (environment_1.EMAIL_LIST[0].newUpdate.new_deaths) {
            tittle = 'nuevas muertes';
            body =
                `
                <p> Nuevas muertes: <strong>${environment_1.EMAIL_LIST[0].newUpdate.new_deaths} </strong> </p> 
                <p> Total: ${environment_1.EMAIL_LIST[0].newUpdate.total_deaths} </p>
            `;
        }
        else if (environment_1.EMAIL_LIST[0].newUpdate.new_recovered) {
            tittle = 'nuevos recuperados';
            body =
                `
                <p> Nuevos recuperados: <strong>${environment_1.EMAIL_LIST[0].newUpdate.new_recovered} </strong> </p> 
                <p> Total: ${environment_1.EMAIL_LIST[0].newUpdate.total_recovered} </p>
            `;
        }
        let mailOptions = configEmail(countryName, environment_1.EMAIL_LIST[0].email, body, date, tittle);
        index_1.sendEmail(mailOptions);
        environment_1.EMAIL_LIST.splice(0, 1);
    }
};
function configEmail(country, email, body, date, tittle) {
    const token = jsonwebtoken_1.default.sign({ country, email }, process.env.SEED || '', { expiresIn: '1year' });
    const url = `https://covid19-reportes.herokuapp.com/#/unsubscribe/${token}`;
    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: `Reporte de ${tittle} sobre COVID-19 para ${country}`,
        html: `
            ${body}
            <p> Fecha: ${date} hora central de México </p>
            <p> Visita nuestra página para más información <a href="https://covid19-reportes.herokuapp.com">Coronavirus reportes en tiempo real</a></p>
            <p> Para dejar de recibir mensajes como este, haz clic en el siguiente link: <a href="${url}"> ${url} </a></p>
        `
    };
    return mailOptions;
}
exports.default = sendPendingEmails;
