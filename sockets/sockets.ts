import Server from '../classes/server';
import * as controller from '../controller/country_controller';
import { sendEmail } from '..';

const server = Server.instance;
const jwt = require('jsonwebtoken');

export const updateRanking = () => {
    controller.getAllCountries((err: any, countries: any) => {
        if ( !err ) {
            server.io.emit('newCases', countries);
        }
    });
}

export const updateGlobalCases = () => {
    controller.getGlobalCases((err: any, global: any) => {
        if ( ! err ) {
            server.io.emit('globalCases', global);
        }
    });
}

export const updateLatesCases = () => {
    controller.getLatestCases((err: any, cases: any) => {
        if ( !err) {
            server.io.emit('latestCases', cases);
            updateOneCountry(cases[0]);
        }
    })
}

export const updateOneCountry = (newCase: any) => {
    controller.getOneCountry(newCase.country_name, (err: any, country: any) => {
        if ( !err) {
            let subscriptions = country.subscriptions;
            for ( let i = 0; i < subscriptions.length; i++ ) {
                let mailOptions = configEmail(newCase.country_name, subscriptions[i], newCase);
                sendEmail(mailOptions);
            }
            server.io.emit(`country${newCase.country_name}`, country);
        }
    });
}

function configEmail(country: string, email: string, newCase: any){
    const token = jwt.sign( { country, email }, process.env.SEED, { expiresIn: '1year' });

    const url = `https://covid19-reportes.herokuapp.com/#/unsubscribe/${token}`;

    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: `Reporte de nuevos casos sobre COVID-19 para ${ country }`,
        html: 
        `
            <p> Nuevos casos: <strong>${ newCase.new_cases } </strong> </p> 
            <p> Total: ${ newCase.total_cases } </p>
            <p> Fecha: ${ new Date(newCase.date).toLocaleString() } </p>
            <p> Visita nuestra página para más información <a href="https://covid19-reportes.herokuapp.com">Coronavirus reportes en tiempo real</a></p>
            <p> Para dejar de recibir mensajes como este, haz clic en el siguiente link: <a href="${ url }"> ${ url } </a></p>
        `
    };

    return mailOptions;
}
