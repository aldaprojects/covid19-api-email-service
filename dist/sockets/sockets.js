"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("../classes/server"));
const controller = __importStar(require("../controller/country_controller"));
const server = server_1.default.instance;
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
exports.updateRanking = () => {
    controller.getAllCountries((err, countries) => {
        if (!err) {
            server.io.emit('newCases', countries);
        }
    });
};
exports.updateGlobalCases = () => {
    controller.getGlobalCases((err, global) => {
        if (!err) {
            server.io.emit('globalCases', global);
        }
    });
};
exports.updateLatesCases = () => {
    controller.getLatestCases((err, cases) => {
        if (!err) {
            server.io.emit('latestCases', cases);
            exports.updateOneCountry(cases[0]);
        }
    });
};
exports.updateOneCountry = (newCase) => {
    controller.getOneCountry(newCase.country_name, (err, country) => {
        if (!err) {
            let subscriptions = country.subscriptions;
            for (let i = 0; i < subscriptions.length; i++) {
                let mailOptions = configEmail(newCase.country_name, subscriptions[i], newCase);
                sendEmail(mailOptions);
            }
            server.io.emit(`country${newCase.country_name}`, country);
        }
    });
};
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'noreply.covidreports@gmail.com',
        pass: 'covidreports11'
    }
});
function configEmail(country, email, newCase) {
    const token = jwt.sign({ country, email }, 'seed', { expiresIn: '1year' });
    const url = `https://covid19-reportes.herokuapp.com/#/unsubscribe/${token}`;
    const mailOptions = {
        from: 'noreply.sectec@gmail.com',
        to: email,
        subject: `Reporte de nuevos casos sobre COVID-19 para ${country}`,
        html: `
            <p> Nuevos casos: <strong>${newCase.new_cases} </strong> </p> 
            <p> Total: ${newCase.total_cases} </p>
            <p> Fecha: ${new Date(newCase.date).toLocaleString()} </p>
            <p> Visita nuestra página para más información <a href="https://covid19-reportes.herokuapp.com">Coronavirus reportes en tiempo real</a></p>
            <p> Para dejar de recibir mensajes como este, haz clic en el siguiente link: <a href="${url}"> ${url} </a></p>
        `
    };
    return mailOptions;
}
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
