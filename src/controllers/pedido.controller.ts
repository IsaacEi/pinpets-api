import { Request, Response } from 'express';
import { storeProcedure } from '../classes/database';
import Methods from '../classes/methods';

// Actualizar estatus del pedido
export async function estatusPedido(req: Request, res: Response): Promise<Response> {  
    try {
        const data = {
            storeProcedure: 'sp_actualizar_estatus_pedido',
            vid: req.body.id,
            vestatus: req.body.estatus
        };         
        const sp = await storeProcedure(data);
        let dataDB = sp[0][0];
        if (dataDB.correcto === 0) {
            return res.status(200).json({ 
                estatus: false,
                data: dataDB,
                mensaje: dataDB.mensaje
            });
        }
        return res.status(200).json({
            estatus: true,
            mensaje: dataDB.mensaje
        });
    } catch (err) {
        console.log('estatusPedido-error:', err);
        return res.status(400).json({ 
            estatus: false,
            mensaje: 'Error al actualizar estatus del pedido'
        });
    }
}

// Confirmar pedido
export async function confirmarPedido(req: any, res: Response): Promise<Response> {
    try {
        const data = {
            storeProcedure: 'sp_actualizar_forma_pago',
            vid_cliente: req.usuario.id,
            vforma_pago: req.body.forma_pago
        };
        const sp = await storeProcedure(data);
        const formaPago = sp[0][0];
        if (!formaPago) {
            return res.status(200).json({ 
                status: false,
                message: 'Pedido no encontrado'
            })
        }
        //Datos del cliente
        const dataCliente = {
            storeProcedure: 'sp_enviar_mail_cliente',
            vid: formaPago.id
        };
        const spCliente = await storeProcedure(dataCliente);
        let cliente = spCliente[0][0];
        //Datos de la direccion
        const dataDireccion = {
            storeProcedure: 'sp_enviar_mail_cliente_direccion',
            vid: formaPago.id
        };
        const spDireccion = await storeProcedure(dataDireccion);
        const direccion = spDireccion[0][0];
        //Productos
        const dataProductos = {
            storeProcedure: 'sp_detalle_mail',
            vid: formaPago.id
        };
        const spProductos = await storeProcedure(dataProductos);
        const productos = spProductos[0];
        const productosImagenes = await Methods.itemsPathImg(productos);
        //Totales
        const dataTotales = {
            storeProcedure: 'sp_totales_mail',
            vid: formaPago.id
        };
        const spTotales = await storeProcedure(dataTotales);
        const totales = spTotales[0][0];
        // Tabla con todos productos
        const tabla = await Methods.tableItemsWeb(totales, productosImagenes);
        const context = {
            cliente: cliente,
            direccion: direccion,
            tabla: tabla,
            comercio: cliente.vcomercio
        };
        // Envia el pedido por email
        await Methods.sendMailPedido(context);
        return res.status(200).json({
            estatus: true,
            mensaje: 'Correo enviado correctamente'
        })
    } catch (err) {
        console.log('confirmarPedido-error', err);
        return res.status(400).json({ 
            estatus: false,
            mensaje: 'Error al confirmar pedido'
        })
    }
}
