import { EMAIL_LIST } from "../global/environment";
import jwt from 'jsonwebtoken';
import { sendEmail } from '../index';
import { updateOneCountry } from "../sockets/sockets";

const sendPendingEmails = () => {
    if ( EMAIL_LIST.length > 0 ) {
        console.log('Pending emails:', EMAIL_LIST.length);
        
        let countryName = EMAIL_LIST[0].newUpdate.country_name;
        let date = EMAIL_LIST[0].newUpdate.date;

        let body: string = '';
        let tittle: string = '';
        
        if ( EMAIL_LIST[0].newUpdate.new_cases ) {
            updateOneCountry( EMAIL_LIST[0].newUpdate.country_name );
            tittle = 'nuevos casos';
            body = 
            `
                <p> Nuevos casos: <strong>${ EMAIL_LIST[0].newUpdate.new_cases } </strong> </p> 
                <p> Total: ${ EMAIL_LIST[0].newUpdate.total_cases } </p>
            `;
        } else if ( EMAIL_LIST[0].newUpdate.new_deaths ) {
            tittle = 'nuevas muertes';
            body = 
            `
                <p> Nuevas muertes: <strong>${ EMAIL_LIST[0].newUpdate.new_deaths } </strong> </p> 
                <p> Total: ${ EMAIL_LIST[0].newUpdate.total_deaths } </p>
            `;
        } else if ( EMAIL_LIST[0].newUpdate.new_recovered ) {
            tittle = 'nuevos recuperados';
            body = 
            `
                <p> Nuevos recuperados: <strong>${ EMAIL_LIST[0].newUpdate.new_recovered } </strong> </p> 
                <p> Total: ${ EMAIL_LIST[0].newUpdate.total_recovered } </p>
            `;
        }
                
        let mailOptions = configEmail( countryName, EMAIL_LIST[0].email, body, date, tittle );
        sendEmail(mailOptions);
 
        EMAIL_LIST.splice(0 , 1);
    }
}

function configEmail(country: string, email: string, body: string, date: string, tittle: string ){
    const token = jwt.sign( { country, email }, process.env.SEED || '', { expiresIn: '1year' });

    const url = `https://covid19-reportes.herokuapp.com/#/unsubscribe/${token}`;

    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: `Reporte de ${ tittle } sobre COVID-19 para ${ country }`,
        html: 
        `
            ${ body }
            <p> Fecha: ${ date } hora central de México </p>
            <p> Visita nuestra página para más información <a href="https://covid19-reportes.herokuapp.com">Coronavirus reportes en tiempo real</a></p>
            <p> Para dejar de recibir mensajes como este, haz clic en el siguiente link: <a href="${ url }"> ${ url } </a></p>
        `
    };

    return mailOptions;
}

export default sendPendingEmails;