import express from 'express';
import { SERVER_PORT } from '../global/environment';
import socketIO from 'socket.io';
import http from 'http';

const Utils = require('./schema/utils');

export default class Server {

    private static _instance: Server;

    public app: express.Application;
    public port: number;

    public io: socketIO.Server;
    private httpServer: http.Server;

    private constructor() {
        this.app = express();
        this.port = SERVER_PORT;

        this.httpServer = new http.Server( this.app );
        this.io = socketIO( this.httpServer );

        this.listenSockets();
    }

    public static get instance() {
        return this._instance || ( this._instance = new this() );
    }

    private listenSockets() {
        console.log('Escuchando sockets');

        this.io.on('connection', client => {
            console.log('Cliente conectado');

            Utils.findOne({ about: 'covidcases' }, (err: any, views: any ) =>{

                let newData = {
                    views: views.data.views + 1
                }
                views.data = newData;
                console.log('Visitas: ', views.data.views);
                views.save();  
            });
    
            client.on('disconnect', () => {
                console.log('Cliente desconectado');
            });
        });
    }

    start( callback: () => void ) {
        this.httpServer.listen( this.port, callback );
    }
}