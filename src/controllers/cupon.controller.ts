import { Request, Response } from 'express';
import { storeProcedure } from '../classes/database';

// Crear cupon
export async function crear(req: Request, res: Response): Promise<Response> {
    try {
        const data = {
            storeProcedure: 'sp_crear_cupon',
            vnombre: req.body.nombre,
            vporcentaje: req.body.porcentaje,
            vid_tipo: req.body.id_tipo,
            vactivo: req.body.activo,
            
        };
        const sp = await storeProcedure(data);
        const dataDB = sp[0];
        if (!dataDB) {
            return res.status(200).json({ 
                estatus: false,
                mensaje: 'Cupon no creado'
            });
        }
        return res.status(200).json({
            estatus: true,
            data: dataDB,
            mensaje: 'Cupon creado correctamente'
        });
    } catch (err) {
        console.log('crear-err:', err);
        return res.status(400).json({ 
            status: false,
            mensaje: 'Error al crear cupon en el sistema'
        });
    }
}

// Actualizar cupon
export async function actualizar(req: Request, res: Response): Promise<Response> {  
    try {
        const data = {
            storeProcedure: 'sp_actualizar_cupon',
            vid: req.body.id,
            vnombre: req.body.nombre,
            vporcentaje: req.body.porcentaje,
            vid_tipo: req.body.id_tipo,
            vactivo: req.body.activo
        };         
        const sp = await storeProcedure(data);
        let dataDB = sp[0];
        if (!dataDB) {
            return res.status(200).json({ 
                estatus: false,
                mensaje: 'Cupon no encontrado en el sistema'
            });
        }
        return res.status(200).json({
            estatus: true,
            data: dataDB,
            mensaje: 'Cupon actualizado correctamente'
        });
    } catch (err) {
        console.log('actualizar-error:', err);
        return res.status(400).json({ 
            estatus: false,
            mensaje: 'Error al actualizar cupon'
        });
    }
}

// Borrar cupon
export async function borrar(req: Request, res: Response): Promise<Response> {
    try {
        const data = {
            storeProcedure: 'sp_borrar_cupon',
            vid: req.body.id
        }; 
        const sp = await storeProcedure(data);
        let dataDB = sp[0][0];
        if (!dataDB) {
            return res.status(200).json({ 
                estatus: false,
                mensaje: 'Cupon no encontrado en el sistema'
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
            mensaje: 'Cupon borrado correctamente'
        });
    } catch (err) {
        console.log('borrar-error:', err);
        return res.status(400).json({ 
            estatus: false,
            mensaje: 'Error al borrar cupon'
        });
    }
}

// Obtener cupon
export async function obtener(req: Request, res: Response): Promise<Response> {
    try {
        const data = {
            storeProcedure: 'sp_obtener_cupon',
            vid: req.body.id
        }; 
        const sp = await storeProcedure(data);
        let dataDB = sp[0];
        if (!dataDB) {
            return res.status(200).json({ 
                estatus: false,
                mensaje: 'Cupon no encontrado en el sistema'
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
            mensaje: 'Error cupon no encontrado'
        });
    }
}

// Obtener lista de cupones
export async function lista(req: Request, res: Response): Promise<Response> {
    try {
        const data = {
            storeProcedure: 'sp_lista_cupones'
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
            mensaje: 'Error cupones no encontrados'
        });
    }
}

// Buscar cupones
export async function buscar(req: Request, res: Response): Promise<Response> {
    try {
        const data = {
            storeProcedure: 'sp_buscar_cupones',
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
            mensaje: 'Error cupones no encontrados'
        });
    }
}

// Buscar cupones categorias y productos
export async function buscarCuponesDetalle(req: Request, res: Response): Promise<Response> {
    try {
        const data = {
            storeProcedure: 'sp_buscar_cupones_detalle',
            vid: req.body.id,
            vcriterio: req.body.criterio,
            vid_tipo: req.body.id_tipo
        }; 
        const sp = await storeProcedure(data);
        let dataDB = sp[0];
        return res.status(200).json({
            estatus: true,
            data: dataDB
        });
    } catch (err) {
        console.log('buscarCuponesDetalle-error:', err);
        return res.status(400).json({ 
            estatus: false,
            mensaje: 'Error cupones detalle no encontrados'
        });
    }
}

// Actualizar el detalle del cupon
export async function actualizarDetalleCupon(req: Request, res: Response): Promise<Response> {
    try {
        const data = {
            storeProcedure: 'sp_actualizar_detalle_cupon',
            vid_detalle: req.body.id_detalle,
            vseleccion: req.body.seleccion
        }; 
        const sp = await storeProcedure(data);
        let dataDB = sp[0];
        return res.status(200).json({
            estatus: true,
            data: dataDB
        });
    } catch (err) {
        console.log('actualizarDetalleCupon-error:', err);
        return res.status(400).json({ 
            estatus: false,
            mensaje: 'Error cupon detalle no actualizado'
        });
    }
}
