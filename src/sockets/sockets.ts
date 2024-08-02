import { Socket } from 'socket.io';
import socketIO from 'socket.io';

export const desconectar = ( cliente: Socket, io: socketIO.Server ) => {
    cliente.on('disconnect', () => {
        console.log('Cliente desconectado');
        /* usuariosConectados.borrar(cliente.id);
        io.emit('usuarios-activos', usuariosConectados.getUsuarios()) */
    });
}

// Escuchar configuracion
export const configuracion = ( cliente: Socket, io: socketIO.Server ) => {
    cliente.on('configuracion', (  payload: { estatus: boolean,  data: any, mensaje: string }  ) => {
        console.log(' ---------- Configuracion recibida  ---------- ');
        /* io.emit('configuracion-home', { estatus: payload.estatus, data: payload.data.home, mensaje: payload.mensaje } );
        io.emit('configuracion-openpay', { estatus: payload.estatus, data: payload.data.openpay, mensaje: payload.mensaje } );
        io.emit('configuracion-paypal', { estatus: payload.estatus, data: payload.data.paypal, mensaje: payload.mensaje } );
        io.emit('configuracion-terminos', { estatus: payload.estatus, data: payload.data.terminos, mensaje: payload.mensaje } );
        io.emit('configuracion-aviso', { estatus: payload.estatus, data: payload.data.aviso, mensaje: payload.mensaje } );
        io.emit('configuracion-redes', { estatus: payload.estatus, data: payload.data.redes, mensaje: payload.mensaje } ); */
    });

}

