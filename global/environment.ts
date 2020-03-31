export const SERVER_PORT: number = Number( process.env.PORT ) || 3000;

let URL_DB: string;
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

if ( process.env.NODE_ENV === 'dev' ) {
    URL_DB = 'mongodb://localhost/covid';
} else {
    URL_DB = process.env.MONGO_URI || '';
}

process.env.URL_DB = URL_DB;

console.log('URL_DB', URL_DB);

