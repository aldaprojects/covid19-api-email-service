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
const express_1 = __importDefault(require("express"));
const environment_1 = require("../global/environment");
const socket_io_1 = __importDefault(require("socket.io"));
const http_1 = __importDefault(require("http"));
const controller = __importStar(require("../utils/country_controller"));
class Server {
    constructor() {
        this.app = express_1.default();
        this.port = environment_1.SERVER_PORT;
        this.httpServer = new http_1.default.Server(this.app);
        this.io = socket_io_1.default(this.httpServer);
        this.listenSockets();
    }
    static get instance() {
        return this._instance || (this._instance = new this());
    }
    listenSockets() {
        console.log('Escuchando sockets');
        this.io.on('connection', client => {
            console.log('Cliente conectado');
            controller.getViews((err, views) => {
                let newData = {
                    views: views.data.views + 1
                };
                views.data = newData;
                this.io.emit('views', views.data.views);
                console.log('Visitas: ', views.data.views);
                views.save();
            });
            client.on('disconnect', () => {
                console.log('Cliente desconectado');
            });
        });
    }
    start(callback) {
        this.httpServer.listen(this.port, callback);
    }
}
exports.default = Server;
