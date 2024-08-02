import { Request, Response } from 'express';
import { storeProcedure } from '../classes/database';

// Crear producto
export async function crear(req: Request, res: Response): Promise<Response> {
    try {
        const data = {
            storeProcedure: 'sp_crear_producto',
            vid_categoria: req.body.id_categoria,
            vnombre: req.body.nombre,
            vdescripcion: req.body.descripcion,
            vporcentaje_of: req.body.porcentaje_of,
            vprecio: req.body.precio,
            vfecha_ini_of: req.body.fecha_ini_of,
            vfecha_fin_of: req.body.fecha_fin_of,
            vactivo_of: req.body.activo_of,
            vactivo: req.body.activo,
            vid_usuario: req.body.id_usuario
        };
        const sp = await storeProcedure(data);
        const dataDB = sp[0][0];
        if (!dataDB) {
            return res.status(200).json({ 
                estatus: false,
                mensaje: 'Producto no creado'
            });
        }
        return res.status(200).json({
            estatus: true,
            data: dataDB,
            mensaje: 'Producto creado correctamente'
        });
    } catch (err) {
        console.log('crear-err:', err);
        return res.status(400).json({ 
            status: false,
            mensaje: 'Error al crear producto en el sistema'
        });
    }
}

// Actualizar producto
export async function actualizar(req: Request, res: Response): Promise<Response> {  
    try {
        const data = {
            storeProcedure: 'sp_actualizar_producto',
            vid: req.body.id,
            vid_categoria: req.body.id_categoria,
            vnombre: req.body.nombre,
            vdescripcion: req.body.descripcion,
            vprecio: req.body.precio,
            vporcentaje_of: req.body.porcentaje_of,
            vfecha_ini_of: req.body.fecha_ini_of,
            vfecha_fin_of: req.body.fecha_fin_of,
            vactivo_of: req.body.activo_of,
            vactivo: req.body.activo,
            vid_usuario: req.body.id_usuario
        };         
        const sp = await storeProcedure(data);
        let dataDB = sp[0][0];
        if (!dataDB) {
            return res.status(200).json({ 
                estatus: false,
                mensaje: 'Producto no encontrado en el sistema'
            });
        }
        return res.status(200).json({
            estatus: true,
            data: dataDB,
            mensaje: 'Producto actualizado correctamente'
        });
    } catch (err) {
        console.log('actualizar-error:', err);
        return res.status(400).json({ 
            estatus: false,
            mensaje: 'Error al actualizar producto'
        });
    }
}

// Borrar producto
export async function borrar(req: Request, res: Response): Promise<Response> {
    try {
        const data = {
            storeProcedure: 'sp_borrar_producto',
            vid: req.body.id
        }; 
        const sp = await storeProcedure(data);
        let dataDB = sp[0][0];
        if (!dataDB) {
            return res.status(200).json({ 
                estatus: false,
                mensaje: 'Producto no encontrado en el sistema'
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
            mensaje: 'Producto borrado correctamente'
        });
    } catch (err) {
        console.log('borrar-error:', err);
        return res.status(400).json({ 
            estatus: false,
            mensaje: 'Error al borrar producto'
        });
    }
}

// Obtener producto
export async function obtener(req: Request, res: Response): Promise<Response> {
    try {
        const data = {
            storeProcedure: 'sp_obtener_producto',
            vid: req.body.id
        }; 
        const sp = await storeProcedure(data);
        let dataDB = sp[0][0];
        if (!dataDB) {
            return res.status(200).json({ 
                estatus: false,
                mensaje: 'Producto no encontrado en el sistema'
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
            mensaje: 'Error producto no encontrado'
        });
    }
}

// Obtener lista de productos
export async function lista(req: Request, res: Response): Promise<Response> {
    try {
        const data = {
            storeProcedure: 'sp_lista_productos'
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
            mensaje: 'Error productos no encontrados'
        });
    }
}

// Buscar productos
export async function buscar(req: Request, res: Response): Promise<Response> {
    try {
        const data = {
            storeProcedure: 'sp_buscar_productos',
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
            mensaje: 'Error productos no encontrados'
        });
    }
}

// Obtener lista de productos
export async function listaHome(req: Request, res: Response): Promise<Response> {
    try {
        const data = {
            storeProcedure: 'sp_lista_productos_home'
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
            mensaje: 'Error productos no encontrados'
        });
    }
}

// Obtener producto
export async function obtenerProductoTienda(req: Request, res: Response): Promise<Response> {
    try {
        const data = {
            storeProcedure: 'sp_obtener_producto_tienda',
            vid: req.body.id
        };
        const dataAtributos = {
            storeProcedure: 'sp_obtener_atributos_producto_tienda',
            vid_producto: req.body.id
        };
        const dataImagenes = {
            storeProcedure: 'sp_obtener_fotos_producto_tienda',
            vid_producto: req.body.id
        }; 
        const sp = await storeProcedure(data);
        let dataDB = sp[0][0];
        if (!dataDB) {
            return res.status(200).json({ 
                estatus: false,
                mensaje: 'Producto no encontrado en el sistema'
            });
        }
        const spAtributos = await storeProcedure(dataAtributos);
        let dataDBAtributos = spAtributos[0] || [];
        const spImagenes = await storeProcedure(dataImagenes);
        let dataDBImagenes = spImagenes[0] || [];
        return res.status(200).json({
            estatus: true,
            data: {
                producto: dataDB,
                atributos: dataDBAtributos,
                imagenes: dataDBImagenes
            }
        });
    } catch (err) {
        console.log('obtener-error:', err);
        return res.status(400).json({ 
            estatus: false,
            mensaje: 'Error producto no encontrado'
        });
    }
}
