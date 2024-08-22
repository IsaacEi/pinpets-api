import express, { Application } from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cros from 'cors';
import socketIO from 'socket.io';
import http from 'http';
import * as socket from '../sockets/sockets';
// RUTAS
import indexRoutes from '../routes/index.routes';
import authClienteRoutes from '../routes/auth.routes';
import configuracionRoutes from '../routes/configuracion.routes';
import mascotaRoutes from '../routes/mascota.routes';
import tipoMascotaRoutes from '../routes/tipo_mascota.routes';
import razaMascotaRoutes from '../routes/raza_mascota.routes';
import colorMascotaRoutes from '../routes/color_mascota.routes';
import generoMascotaRoutes from '../routes/genero_mascota.routes';
import tamanoMascotaRoutes from '../routes/tamano_mascota.routes';
import estadoRoutes from '../routes/estado.routes';
import nacionalidadRoutes from '../routes/nacionalidad.routes';
import mensajeRoutes from '../routes/mensaje.routes';
import detelleReporteRoutes from '../routes/detelle_reporte.routes';
import imageRoutes from '../routes/image.routes';
import Configurations from '../config/config';

const config = new Configurations();

export default class Server {
    private static _intance: Server;
    private app: Application;
    public port: number = 80;
    public io: socketIO.Server;
    public httpServer: http.Server;
    constructor() {
        this.app = express();
        this.httpServer = new http.Server( this.app );
        // Socket
        this.io = socketIO( this.httpServer );
        this.settings();
        this.cros();
        this.middlewares();
        this.routes();
        this.listenSocket();
    }

    public static get instance() {
        return this._intance || (  this._intance = new this() );
    }

    private settings(){
        this.app.set('port', config.getPort());
        this.port = this.app.get('port');
    }

    private cros() {
        this.app.use( cros() );
        this.app.use(cros({ origin: true, credentials: true }));
    }

    private middlewares() {
        this.app.use(morgan('dev'));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.json({ limit: config.getLimit() }));
        this.app.use(bodyParser.urlencoded({ limit: config.getLimit(), extended: true }));
        this.app.use(bodyParser.raw({ limit: config.getLimit() }));
        this.app.use(bodyParser.json({ type: 'application/json' }));
        this.app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
        this.app.use(bodyParser.json({ type: 'application/x-www-form-urlencoded' }));
        this.app.use(express.static(__dirname + '../../public'));
        this.app.engine('html', require('ejs').renderFile);
        this.app.set('views', __dirname + '../../public');
        this.app.set('view engine', 'html');
    }

    private routes() {
        this.app.use(indexRoutes);
        this.app.use('/api/auth', authClienteRoutes);
        this.app.use('/api/estado', estadoRoutes);
        this.app.use('/api/nacionalidad', nacionalidadRoutes);
        this.app.use('/api/configuracion', configuracionRoutes);
        this.app.use('/api/mascota', mascotaRoutes);
        this.app.use('/api/tipo-mascota', tipoMascotaRoutes);
        this.app.use('/api/raza-mascota', razaMascotaRoutes);
        this.app.use('/api/color-mascota', colorMascotaRoutes);
        this.app.use('/api/genero-mascota', generoMascotaRoutes);
        this.app.use('/api/tamano-mascota', tamanoMascotaRoutes);
        this.app.use('/api/mensaje', mensajeRoutes);
        this.app.use('/api/detalle-reporte', detelleReporteRoutes);
        this.app.use('/api/images', imageRoutes);
    }

    private listenSocket() {
        console.log('Escuchando conexiones - socket');
        this.io.on('connection', cliente => {
            // Configuracion
            socket.configuracion( cliente, this.io );
            // Desconectar
            socket.desconectar( cliente, this.io );
        })
    }

    public async start( callback: Function ) {
        this.httpServer.listen( this.app.get('port'), callback() );
    }
}
