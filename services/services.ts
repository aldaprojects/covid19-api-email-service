import * as socket from '../sockets/sockets';

import moment from 'moment-timezone';

const Country = require('../classes/schema/country');
const Report = require('../classes/schema/reports');

// import unirest from 'unirest';
import { EMAIL_LIST } from '../global/environment';

const unirest = require('unirest');

const futureCases = ( reports: any[], startCases: number, actualDay: any ) => {
    let factor = 0;
        
    let start = reports.length-6 < 0 ? 0 : reports.length-6;
    for ( let k = start; k < reports.length - 1; k++ ) {
        factor = factor + reports[k+1].total_cases / reports[k].total_cases;
    }

    factor = reports.length === 1 ? 1 : factor / (reports.length-1-start);
    
    let nextCases = startCases;
    let futureCases = [];

    for ( let k = 0; k < 5; k++ ) {
        actualDay.add(1, 'days');
        nextCases = Math.floor(nextCases * factor);
        futureCases.push({
            'cases' : nextCases,
            'date'  : actualDay.format('DD/MM/YYYY')
        });
    }

    return futureCases;
}

let isNewReport = false;

const updateDatabase = () => {

    // if ( isNewReport ) {
    //     console.log('sockets');
    //     socket.updateGlobalCases();
    //     socket.updateRanking();
    //     socket.updateLatesCases();
    // }

    isNewReport = false;

    let actualDay = moment.utc(new Date()).tz('America/Mexico_City');

    console.log('Actualizando...', actualDay.format('DD/MM/YYYY LTS'));
    const req = unirest("GET", "https://coronavirus-monitor.p.rapidapi.com/coronavirus/cases_by_country.php");

    req.headers({
        "x-rapidapi-host": "coronavirus-monitor.p.rapidapi.com",
        "x-rapidapi-key": process.env.API_KEY
    });

    req.end((data: any ) => {
        if ( !data.error ) {
            
            let countries: any[] = [];
            try {
                countries = JSON.parse(data.body).countries_stat;
            } catch(e){
                return;
            }

            // console.log(countries[0].country_name);
            // countries[0].cases = "188540";
            // countries[0].deaths = "3905";
            countries[0].total_recovered = "3905";
 
            Country.find((err: any, countriesDB: any) => {

                if ( !err ) {
                    for ( let i = 0; i < countries.length; i++ ) {
                        for ( let j = 0; j < countriesDB.length; j++ ) {
                            if ( countries[i].country_name === countriesDB[j].country_name ) {
                                let subscriptions = countriesDB[j].subscriptions;

                                let newCases = Number.parseInt(countries[i].cases.replace(/,/g, '')) - countriesDB[j].cases;
                                let newDeaths = Number.parseInt(countries[i].deaths.replace(/,/g, '')) - countriesDB[j].deaths;
                                let newRecovered = Number.parseInt(countries[i].total_recovered.replace(/,/g, '')) - countriesDB[j].total_recovered;

                                if ( newCases != 0 ) {
                                    console.log(countries[i].country_name);
                                    console.log('newCases', newCases);

                                    const totalCases = newCases + countriesDB[j].cases;
                                    const todayDate = new Date().getDate();

                                    const newReport = {
                                        country_name: countriesDB[j].country_name,
                                        labelDate: actualDay.format('DD/MM/YYYY LTS'),
                                        date: actualDay.format(),
                                        new_cases: newCases,
                                        total_cases: totalCases,
                                        day : actualDay.date(),
                                        labelGraphicDate: actualDay.format('DD/MM/YYYY')
                                    };

                                    const newUpdate = new Report(newReport);

                                    newUpdate.save();

                                    for ( let i = 0; i < subscriptions.length; i++ ) {
                                        EMAIL_LIST.push({
                                            newUpdate,
                                            email: subscriptions[i],
                                        });
                                    }

                                    if ( countriesDB[j].last_updates[countriesDB[j].last_updates.length-1].day ===  todayDate ) {
                                        countriesDB[j].last_updates.pop();
                                    }

                                    countriesDB[j].last_updates.push(newReport);

                                    countriesDB[j].future_cases = futureCases(countriesDB[j].last_updates, totalCases, actualDay);
                                }
                                if ( newDeaths != 0 ) {
                                    console.log(countries[i].country_name);
                                    console.log('newDeaths', newDeaths);

                                    const newUpdate = new Report({
                                        country_name: countriesDB[j].country_name,
                                        labelDate: actualDay.format('DD/MM/YYYY  LTS'),
                                        new_deaths: newDeaths,
                                        date: actualDay.format(),
                                        total_deaths: newDeaths + countriesDB[j].deaths
                                    });

                                    newUpdate.save();

                                    for ( let i = 0; i < subscriptions.length; i++ ) {
                                        EMAIL_LIST.push({
                                            newUpdate,
                                            email: subscriptions[i],
                                        });
                                    }
                                }
                                if ( newRecovered != 0 ) {
                                    console.log(countries[i].country_name);
                                    console.log('newRecovered', newRecovered);

                                    const newUpdate = new Report({
                                        country_name: countriesDB[j].country_name,
                                        labelDate: actualDay.format('DD/MM/YYYY LTS'),
                                        date: actualDay.format(),
                                        new_recovered: newRecovered,
                                        total_recovered: newRecovered + countriesDB[j].total_recovered
                                    });

                                    newUpdate.save();

                                    for ( let i = 0; i < subscriptions.length; i++ ) {
                                        EMAIL_LIST.push({
                                            newUpdate,
                                            email: subscriptions[i],
                                        });
                                    }
                                }

                                if ( newCases != 0 || newDeaths != 0 || newRecovered != 0 ) {
                                    isNewReport = true;

                                    countriesDB[j].cases += newCases;
                                    countriesDB[j].deaths += newDeaths;
                                    countriesDB[j].total_recovered += newRecovered;

                                    countriesDB[j].save();
                                }
                                countriesDB.splice(j, 1);
                            }
                        }
                    }
                }
            });
        } else {
            console.log(data.body);
        }
    });
}

export default updateDatabase;