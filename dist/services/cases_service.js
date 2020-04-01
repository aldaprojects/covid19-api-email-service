"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const environment_1 = require("../global/environment");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const updateCases = () => {
    console.log(environment_1.EMAIL_LIST);
    if (environment_1.EMAIL_LIST.length > 0) {
        console.log(environment_1.EMAIL_LIST);
        // let countryName = EMAIL_LIST[0].country_name;
        // let date = EMAIL_LIST[0].date;
        // let body: string;
        // let tittle: string;
        // if ( EMAIL_LIST[0].new_cases ) {
        //     tittle = 'nuevos casos';
        //     body = 
        //     `
        //         <p> Nuevos casos: <strong>${ EMAIL_LIST[0].new_cases } </strong> </p> 
        //         <p> Total: ${ EMAIL_LIST[0].total_cases } </p>
        //     `;
        // } else if ( EMAIL_LIST[0].new_deaths ) {
        //     tittle = 'nuevas muertes';
        //     body = 
        //     `
        //         <p> Nuevas muertes: <strong>${ EMAIL_LIST[0].new_deaths } </strong> </p> 
        //         <p> Total: ${ EMAIL_LIST[0].total_deaths } </p>
        //     `;
        // } else if ( EMAIL_LIST[0].new_recovered ) {
        //     tittle = 'nuevos recuperados';
        //     body = 
        //     `
        //         <p> Nuevos recuperados: <strong>${ EMAIL_LIST[0].new_recovered } </strong> </p> 
        //         <p> Total: ${ EMAIL_LIST[0].total_recovered } </p>
        //     `;
        // }
        // getOneCountry(EMAIL_LIST[0].country_name, (err: any, country: any) => {
        //     if ( !err ) {
        //         let subscriptions = country.subscriptions;
        //             let mailOptions = configEmail( countryName, subscriptions, body, date, tittle );
        //         sendEmail(mailOptions);
        //     }
        // });
        // EMAIL_LIST.splice(0 , 1);
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
exports.default = updateCases;
