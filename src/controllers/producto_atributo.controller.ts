import { Request, Response } from 'express';
import { storeProcedure } from '../classes/database';

// Crear atributo producto
export async function crear(req: Request, res: Response): Promise<Response> {
    try {
        const data = {
            storeProcedure: 'sp_crear_atributo_producto',
            vid_producto: req.body.id_producto,
            vnombre: req.body.nombre,
            vactivo: req.body.activo
        };
        const sp = await storeProcedure(data);
        const dataDB = sp[0][0];
        if (!dataDB) {
            return res.status(200).json({ 
                estatus: false,
                mensaje: 'Atributo producto no creado'
            });
        }
        return res.status(200).json({
            estatus: true,
            data: dataDB,
            mensaje: 'Atributo producto creado correctamente'
        });
    } catch (err) {
        console.log('crear-err:', err);
        return res.status(400).json({ 
            status: false,
            mensaje: 'Error al crear atributo producto en el sistema'
        });
    }
}

// Actualizar atributo producto
export async function actualizar(req: Request, res: Response): Promise<Response> {  
    try {
        const data = {
            storeProcedure: 'sp_actualizar_atributo_producto',
            vid: req.body.id,
            vnombre: req.body.nombre,
            vactivo: req.body.activo
        };         
        const sp = await storeProcedure(data);
        let dataDB = sp[0][0];
        if (!dataDB) {
            return res.status(200).json({ 
                estatus: false,
                mensaje: 'Atributo producto no encontrado en el sistema'
            });
        }
        return res.status(200).json({
            estatus: true,
            data: dataDB,
            mensaje: 'Atributo producto actualizado correctamente'
        });
    } catch (err) {
        console.log('actualizar-error:', err);
        return res.status(400).json({ 
            estatus: false,
            mensaje: 'Error al actualizar atributo producto'
        });
    }
}

// Borrar atributo producto
export async function borrar(req: Request, res: Response): Promise<Response> {
    try {
        const data = {
            storeProcedure: 'sp_borrar_atributo_producto',
            vid: req.body.id
        }; 
        const sp = await storeProcedure(data);
        let dataDB = sp[0][0];
        if (!dataDB) {
            return res.status(200).json({ 
                estatus: false,
                mensaje: 'Atributo producto no encontrado en el sistema'
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
            mensaje: 'Atributo producto borrado correctamente'
        });
    } catch (err) {
        console.log('borrar-error:', err);
        return res.status(400).json({ 
            estatus: false,
            mensaje: 'Error al borrar atributo producto'
        });
    }
}

// Obtener atributo producto
export async function obtener(req: Request, res: Response): Promise<Response> {
    try {
        const data = {
            storeProcedure: 'sp_obtener_atributo_producto',
            vid: req.body.id
        }; 
        const sp = await storeProcedure(data);
        let dataDB = sp[0][0];
        if (!dataDB) {
            return res.status(200).json({ 
                estatus: false,
                mensaje: 'Atributo producto no encontrado en el sistema'
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
            mensaje: 'Error atributo producto no encontrado'
        });
    }
}

// Obtener lista de atributos producto
export async function lista(req: Request, res: Response): Promise<Response> {
    try {
        const data = {
            storeProcedure: 'sp_lista_atributos_productos',
            vid_producto: req.body.id_producto
        }; 
        const sp = await storeProcedure(data);
        let userDB = sp[0];
        return res.status(200).json({
            estatus: true,
            data: userDB
        });
    } catch (err) {
        console.log('lista-error:', err);
        return res.status(400).json({ 
            estatus: false,
            mensaje: 'Error atributos producto no encontrados'
        });
    }
}

// Buscar atributos producto
export async function buscar(req: Request, res: Response): Promise<Response> {
    try {
        const data = {
            storeProcedure: 'sp_buscar_atributos_productos',
            vcriterio: req.body.criterio,
            vid_producto: req.body.id_producto
        }; 
        const sp = await storeProcedure(data);
        let userDB = sp[0];
        return res.status(200).json({
            estatus: true,
            data: userDB
        });
    } catch (err) {
        console.log('lista-error:', err);
        return res.status(400).json({ 
            estatus: false,
            mensaje: 'Error atributos producto no encontrados'
        });
    }
}
