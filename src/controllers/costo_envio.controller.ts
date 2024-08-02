import { Request, Response } from 'express';
import { storeProcedure } from '../classes/database';

// Actualizar costo envio
export async function actualizar(req: Request, res: Response): Promise<Response> {  
    try {
        const data = {
            storeProcedure: 'sp_actualizar_costo_envio',
            vid: req.body.id,
            vprecio: req.body.precio,
            vid_usuario: req.body.id_usuario
        };         
        const sp = await storeProcedure(data);
        let dataDB = sp[0][0];
        if (!dataDB) {
            return res.status(200).json({ 
                estatus: false,
                mensaje: 'Costo envio no encontrado en el sistema'
            });
        }
        return res.status(200).json({
            estatus: true,
            mensaje: 'Costo envio actualizado correctamente'
        });
    } catch (err) {
        console.log('actualizar-error:', err);
        return res.status(400).json({ 
            estatus: false,
            mensaje: 'Error al actualizar costo envio'
        });
    }
}

// Obtener costo envio
export async function obtener(req: Request, res: Response): Promise<Response> {
    try {
        const data = {
            storeProcedure: 'sp_obtener_costo_envio',
            vid: req.body.id
        }; 
        const sp = await storeProcedure(data);
        let dataDB = sp[0][0];
        if (!dataDB) {
            return res.status(200).json({ 
                estatus: false,
                mensaje: 'Costo envio no encontrado en el sistema'
            });
        }
        return res.status(200).json({
            estatus: true,
            data: dataDB
        });
    } catch (err) {
        console.log('obtener-error:', err);
        return res.status(400).json({ 
            estatus: false,
            mensaje: 'Error costo envio no encontrado'
        });
    }
}

// Obtener lista de costo envios
export async function lista(req: Request, res: Response): Promise<Response> {
    try {
        const data = {
            storeProcedure: 'sp_lista_costos_envio'
        }; 
        const sp = await storeProcedure(data);
        let dataDB = sp[0];
        return res.status(200).json({
            estatus: true,
            data: dataDB
        });
    } catch (err) {
        console.log('lista-error:', err);
        return res.status(400).json({ 
            estatus: false,
            mensaje: 'Error costo envios no encontrados'
        });
    }
}

// Buscar costo envios
export async function buscar(req: Request, res: Response): Promise<Response> {
    try {
        const data = {
            storeProcedure: 'sp_buscar_costos_envio',
            vcriterio: req.body.criterio
        }; 
        const sp = await storeProcedure(data);
        let dataDB = sp[0];
        return res.status(200).json({
            estatus: true,
            data: dataDB
        });
    } catch (err) {
        console.log('lista-error:', err);
        return res.status(400).json({ 
            estatus: false,
            mensaje: 'Error costo envios no encontrados'
        });
    }
}

// Estados de costo envio carrito
export async function listaEstados(req: Request, res: Response): Promise<Response> {
    try {
        const data = {
            storeProcedure: 'sp_lista_estados_carrito'
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
            mensaje: 'Error Estados no encontrado'
        });
    }
}

// Estados de costo envio carrito
export async function costoEnvioCarrito(req: any, res: Response): Promise<Response> {
    try {
        const data = {
            storeProcedure: 'sp_costo_envio_carrito',
            vid_cliente: req.usuario.id,
            vid_estado: req.body.id_estado
        }; 
        const sp = await storeProcedure(data);
        let dataDB = sp[0][0];
        if (!dataDB) {
            return res.status(200).json({ 
                estatus: false,
                mensaje: 'Costo envio carrito no encontrado en el sistema'
            });
        }
        return res.status(200).json({
            estatus: true,
            data: dataDB,
            mensaje: 'Costo envio carrito actualizado correctamente'
        });
    } catch (err) {
        console.log('obtener-error:', err);
        return res.status(400).json({ 
            estatus: false,
            mensaje: 'Error costo envio carrito no encontrado'
        });
    }
}
