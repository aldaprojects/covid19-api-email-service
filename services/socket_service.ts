import { COUNTRY_LIST } from '../global/environment';
import * as socket from '../sockets/sockets';

const emitSockets = () => {
    
    if ( COUNTRY_LIST.length > 0 ) {
        console.log('Emiting sockets:', COUNTRY_LIST.length);
        if ( COUNTRY_LIST.length === 1 ) {
            socket.updateGlobalCases();
            socket.updateRanking();
            socket.updateLatesCases();
        }
        socket.updateOneCountry( COUNTRY_LIST[0] );
        COUNTRY_LIST.splice( 0, 1 );
    }
}

export default emitSockets;