import { Request, Response } from 'express';
import { storeProcedure } from '../classes/database';

// Crear valor atributo
export async function crear(req: Request, res: Response): Promise<Response> {
    try {
        const data = {
            storeProcedure: 'sp_crear_valor_atributo_producto',
            vid_atributo: req.body.id_atributo,
            vnombre: req.body.nombre,
            vincremento: req.body.incremento,
            vactivo: req.body.activo
        };
        const sp = await storeProcedure(data);
        const dataDB = sp[0][0];
        if (!dataDB) {
            return res.status(200).json({ 
                estatus: false,
                mensaje: 'Valor atributo no creado'
            });
        }
        return res.status(200).json({
            estatus: true,
            data: dataDB,
            mensaje: 'Valor atributo creado correctamente'
        });
    } catch (err) {
        console.log('crear-err:', err);
        return res.status(400).json({ 
            status: false,
            mensaje: 'Error al crear valor atributo en el sistema'
        });
    }
}

// Actualizar atributo producto
export async function actualizar(req: Request, res: Response): Promise<Response> {  
    try {
        const data = {
            storeProcedure: 'sp_actualizar_valor_atributo_producto',
            vid: req.body.id,
            vnombre: req.body.nombre,
            vincremento: req.body.incremento,
            vactivo: req.body.activo
        };         
        const sp = await storeProcedure(data);
        let dataDB = sp[0][0];
        if (!dataDB) {
            return res.status(200).json({ 
                estatus: false,
                mensaje: 'Valor atributo no encontrado en el sistema'
            });
        }
        return res.status(200).json({
            estatus: true,
            data: dataDB,
            mensaje: 'Valor atributo actualizado correctamente'
        });
    } catch (err) {
        console.log('actualizar-error:', err);
        return res.status(400).json({ 
            estatus: false,
            mensaje: 'Error al actualizar valor atributo'
        });
    }
}

// Borrar atributo producto
export async function borrar(req: Request, res: Response): Promise<Response> {
    try {
        const data = {
            storeProcedure: 'sp_borrar_valor_atributo_producto',
            vid: req.body.id
        }; 
        const sp = await storeProcedure(data);
        let dataDB = sp[0][0];
        if (!dataDB) {
            return res.status(200).json({ 
                estatus: false,
                mensaje: 'Valor atributo no encontrado en el sistema'
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
            mensaje: 'Valor atributo borrado correctamente'
        });
    } catch (err) {
        console.log('borrar-error:', err);
        return res.status(400).json({ 
            estatus: false,
            mensaje: 'Error al borrar valor atributo'
        });
    }
}

// Obtener valor atributo
export async function obtener(req: Request, res: Response): Promise<Response> {
    try {
        const data = {
            storeProcedure: 'sp_obtener_valor_atributo_producto',
            vid: req.body.id
        }; 
        const sp = await storeProcedure(data);
        let dataDB = sp[0][0];
        if (!dataDB) {
            return res.status(200).json({ 
                estatus: false,
                mensaje: 'Valor atributo no encontrado en el sistema'
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
            mensaje: 'Error valor atributo no encontrado'
        });
    }
}

// Obtener lista de valores atributo
export async function lista(req: Request, res: Response): Promise<Response> {
    try {
        const data = {
            storeProcedure: 'sp_lista_valores_atributos_productos',
            vid_atributo: req.body.id_atributo
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
            mensaje: 'Error valores atributo no encontrados'
        });
    }
}

// Buscar valores atributo
export async function buscar(req: Request, res: Response): Promise<Response> {
    try {
        const data = {
            storeProcedure: 'sp_buscar_valores_atributos_productos',
            vcriterio: req.body.criterio,
            vid_atributo: req.body.id_atributo
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
            mensaje: 'Error valores atributo no encontrados'
        });
    }
}
