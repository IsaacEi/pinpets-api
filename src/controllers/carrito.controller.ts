import { Request, Response } from 'express';
import { storeProcedure } from '../classes/database';

// Crear atributo carrito
export async function crearAtributoCarrito(req: any, res: Response): Promise<Response> {  
    try {
        const data = {
            storeProcedure: 'sp_crear_atributos_carrito',
            vid_cliente: req.usuario.id,
            vid_producto: req.body.id_producto,
            vcantidad: req.body.cantidad,
            vid_atributo: req.body.id_atributo,
            vid_valor_atributo: req.body.id_valor_atributo
        };         
        const sp = await storeProcedure(data);
        let dataDB = sp[0][0];
        if (!dataDB) {
            return res.status(200).json({ 
                estatus: false,
                mensaje: 'Atributo del carrito no creado'
            });
        }
        return res.status(200).json({
            estatus: true,
            data: dataDB,
            mensaje: 'Atributo carrito creado correctamente'
        });
    } catch (err) {
        console.log('crear-error:', err);
        return res.status(400).json({ 
            estatus: false,
            mensaje: 'Error al actualizar  atributo carrito'
        });
    }
}

// Agregar a carrito
export async function agregarCarrito(req: any, res: Response): Promise<Response> {  
    try {
        const data = {
            storeProcedure: 'sp_agregar_carrito',
            vid_cliente: req.usuario.id,
            vid_producto: req.body.id_producto
        };         
        const sp = await storeProcedure(data);
        let dataDB = sp[0][0];
        if (!dataDB) {
            return res.status(200).json({ 
                estatus: false,
                mensaje: 'Agregar a carrito no creado'
            });
        }
        if (dataDB.correcto === 0) {
            return res.status(200).json({ 
                estatus: false,
                mensaje: dataDB.mensaje
            });
        }
        return res.status(200).json({
            estatus: true,
            mensaje: dataDB.mensaje
        });
    } catch (err) {
        console.log('agregar-error:', err);
        return res.status(400).json({ 
            estatus: false,
            mensaje: 'Error al actualizar agregar a carrito'
        });
    }
}

// Obtener carrito
export async function obtenerCarrito(req: any, res: Response): Promise<Response> {  
    try {
        const data = {
            storeProcedure: 'sp_obtener_carrito',
            vid_cliente: req.usuario.id
        };         
        const sp = await storeProcedure(data);
        let dataDB = sp[0];
        
        return res.status(200).json({
            estatus: true,
            data: dataDB
        });
    } catch (err) {
        console.log('obtener-error:', err);
        return res.status(400).json({ 
            estatus: false,
            mensaje: 'Error al obtener carrito'
        });
    }
}

// Eliminar carrito
export async function eliminarCarrito(req: any, res: Response): Promise<Response> {  
    try {
        const data = {
            storeProcedure: 'sp_eliminar_carrito',
            vid_detalle: req.body.id_detalle
        };         
        const sp = await storeProcedure(data);
        let dataDB = sp[0][0];
        if (!dataDB) {
            return res.status(200).json({ 
                estatus: false,
                mensaje: 'Carrito no encontrado en el sistema'
            });
        }
        return res.status(200).json({
            estatus: true,
            data: dataDB,
            mensaje: 'Carrito borrado correctamente'
        });
    } catch (err) {
        console.log('obtener-error:', err);
        return res.status(400).json({ 
            estatus: false,
            mensaje: 'Error al borrar carrito'
        });
    }
}

// Cantidad carrito
export async function cantidadCarrito(req: any, res: Response): Promise<Response> {  
    try {
        const data = {
            storeProcedure: 'sp_actualizar_cantidad_carrito',
            vid_detalle: req.body.id_detalle,
            vcantidad: req.body.cantidad
        };         
        const sp = await storeProcedure(data);
        let dataDB = sp[0][0];
        if (!dataDB) {
            return res.status(200).json({ 
                estatus: false,
                mensaje: 'Carrito no encontrado en el sistema'
            });
        }
        return res.status(200).json({
            estatus: true,
            data: dataDB,
            mensaje: 'Carrito cantidad actualizado correctamente'
        });
    } catch (err) {
        console.log('obtener-error:', err);
        return res.status(400).json({ 
            estatus: false,
            mensaje: 'Error al actualizar carrito cantidad'
        });
    }
}

// Cupon carrito
export async function cuponCarrito(req: any, res: Response): Promise<Response> {  
    try {
        const data = {
            storeProcedure: 'sp_aplicar_cupon_carrito',
            vid_cliente: req.usuario.id,
            vcupon: req.body.cupon
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
            data: dataDB,
            mensaje: dataDB.mensaje
        });
    } catch (err) {
        console.log('obtener-error:', err);
        return res.status(400).json({ 
            estatus: false,
            mensaje: 'Error al actualizar carrito cupon'
        });
    }
}
