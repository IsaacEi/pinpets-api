import express, { Application } from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cros from 'cors';
import socketIO from 'socket.io';
import http from 'http';
import * as socket from '../sockets/sockets';
import functions from 'firebase-functions';
const { onRequest } = require('firebase-functions/v2/https');
// RUTAS
import indexRoutes from '../routes/index.routes';
import authRoutes from '../routes/auth.routes';
import authClienteRoutes from '../routes/auth_cliente.routes';
import direccionClienteRoutes from '../routes/direccion_cliente.routes';
import usuarioRoutes from '../routes/usuario.routes';
import categoriaRoutes from '../routes/categoria.routes';
import productoRoutes from '../routes/producto.routes';
import productoFotoRoutes from '../routes/producto_foto.routes';
import productoAtributoRoutes from '../routes/producto_atributo.routes';
import atributoValorRoutes from '../routes/atributo_valor.routes';
import costoEnvioRoutes from '../routes/costo_envio.routes';
import configuracionRoutes from '../routes/configuracion.routes';
import redSocialRoutes from '../routes/red_social.routes';
import tipografiaRoutes from '../routes/tipografia.routes';
import cuponRoutes from '../routes/cupon.routes';
import tipoCuponRoutes from '../routes/tipo_cupon.routes';
import carritoRoutes from '../routes/carrito.routes';
import compraRoutes from '../routes/compra.routes';
import tarjetaRoutes from '../routes/tarjeta.routes';
import reporteRoutes from '../routes/reporte.routes';
import pedidoRoutes from '../routes/pedido.routes';
import contactoRoutes from '../routes/contacto.routes';
import mascotaRoutes from '../routes/mascota.routes';
import tipoMascotaRoutes from '../routes/tipo_mascota.routes';
import razaMascotaRoutes from '../routes/raza_mascota.routes';
import colorMascotaRoutes from '../routes/color_mascota.routes';
import generoMascotaRoutes from '../routes/genero_mascota.routes';
import tamanoMascotaRoutes from '../routes/tamano_mascota.routes';
import cpRoutes from '../routes/cp.routes';
import estadoRoutes from '../routes/estado.routes';
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
        this.app.use('/api/auth', authRoutes);
        this.app.use('/api/auth-cliente', authClienteRoutes);
        this.app.use('/api/direccion-cliente', direccionClienteRoutes);
        this.app.use('/api/cp', cpRoutes);
        this.app.use('/api/estado', estadoRoutes);
        this.app.use('/api/usuario', usuarioRoutes);
        this.app.use('/api/categoria', categoriaRoutes);
        this.app.use('/api/producto', productoRoutes);
        this.app.use('/api/producto-foto', productoFotoRoutes);
        this.app.use('/api/producto-atributo', productoAtributoRoutes);
        this.app.use('/api/atributo-valor', atributoValorRoutes);
        this.app.use('/api/costo-envio', costoEnvioRoutes);
        this.app.use('/api/configuracion', configuracionRoutes);
        this.app.use('/api/red-social', redSocialRoutes);
        this.app.use('/api/tipografia', tipografiaRoutes);
        this.app.use('/api/cupon', cuponRoutes);
        this.app.use('/api/tipo-cupon', tipoCuponRoutes);
        this.app.use('/api/carrito', carritoRoutes);
        this.app.use('/api/compra', compraRoutes);
        this.app.use('/api/tarjeta', tarjetaRoutes);
        this.app.use('/api/reporte', reporteRoutes);
        this.app.use('/api/pedido', pedidoRoutes);
        this.app.use('/api/contacto', contactoRoutes);
        this.app.use('/api/mascota', mascotaRoutes);
        this.app.use('/api/tipo-mascota', tipoMascotaRoutes);
        this.app.use('/api/raza-mascota', razaMascotaRoutes);
        this.app.use('/api/color-mascota', colorMascotaRoutes);
        this.app.use('/api/genero-mascota', generoMascotaRoutes);
        this.app.use('/api/tamano-mascota', tamanoMascotaRoutes);
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
        exports.widgets = onRequest(this.httpServer);
        
    }

    /* async start() {
        this.app.listen( this.app.get('port'));
        console.log(`servidor corriendo en el puerto ${this.app.get('port')}`); 
    } */
}
