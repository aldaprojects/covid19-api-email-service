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
            updateOneCountry(cases[0]);
        }
    })
}

export const updateOneCountry = (newCase: any) => {
    controller.getOneCountry(newCase.country_name, (err: any, country: any) => {
        if ( !err) {
            server.io.emit(`country${newCase.country_name}`, country);
        }
    });
}
