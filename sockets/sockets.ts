import Server from '../classes/server';
import * as controller from '../utils/country_controller';

const server = Server.instance;

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
        }
    })
}

export const updateOneCountry = (countryName: any) => {
    controller.getOneCountry(countryName, (err: any, country: any) => {
        if ( !err) {
            server.io.emit(`country${countryName}`, country);
        }
    });
}
