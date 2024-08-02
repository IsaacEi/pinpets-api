import { Request, Response } from 'express';
import { storeProcedure } from '../classes/database';

// Crear categoria
export async function crear(req: Request, res: Response): Promise<Response> {
    try {
        const data = {
            storeProcedure: 'sp_crear_categoria',
            vnombre: req.body.nombre,
            vactivo: req.body.activo,
            
        };
        const sp = await storeProcedure(data);
        const dataDB = sp[0][0];
        if (!dataDB) {
            return res.status(200).json({ 
                estatus: false,
                mensaje: 'Categoria no creada'
            });
        }
        return res.status(200).json({
            estatus: true,
            mensaje: 'Categoria creada correctamente'
        });
    } catch (err) {
        console.log('crear-err:', err);
        return res.status(400).json({ 
            status: false,
            mensaje: 'Error al crear categoria en el sistema'
        });
    }
}

// Actualizar categoria
export async function actualizar(req: Request, res: Response): Promise<Response> {  
    try {
        const data = {
            storeProcedure: 'sp_actualizar_categoria',
            vid: req.body.id,
            vnombre: req.body.nombre,
            vactivo: req.body.activo
        };         
        const sp = await storeProcedure(data);
        let dataDB = sp[0][0];
        if (!dataDB) {
            return res.status(200).json({ 
                estatus: false,
                mensaje: 'Categoria no encontrada en el sistema'
            });
        }
        return res.status(200).json({
            estatus: true,
            mensaje: 'Categoria actualizada correctamente'
        });
    } catch (err) {
        console.log('actualizar-error:', err);
        return res.status(400).json({ 
            estatus: false,
            mensaje: 'Error al actualizar categoria'
        });
    }
}

// Borrar categoria
export async function borrar(req: Request, res: Response): Promise<Response> {
    try {
        const data = {
            storeProcedure: 'sp_borrar_categoria',
            vid: req.body.id
        }; 
        const sp = await storeProcedure(data);
        let dataDB = sp[0][0];
        if (!dataDB) {
            return res.status(200).json({ 
                estatus: false,
                mensaje: 'Categoria no encontrada en el sistema'
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
            mensaje: 'Categoria borrada correctamente'
        });
    } catch (err) {
        console.log('borrar-error:', err);
        return res.status(400).json({ 
            estatus: false,
            mensaje: 'Error al borrar categoria'
        });
    }
}

// Obtener categoria
export async function obtener(req: Request, res: Response): Promise<Response> {
    try {
        const data = {
            storeProcedure: 'sp_obtener_categoria',
            vid: req.body.id
        }; 
        const sp = await storeProcedure(data);
        let dataDB = sp[0][0];
        if (!dataDB) {
            return res.status(200).json({ 
                estatus: false,
                mensaje: 'Categoria no encontrada en el sistema'
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
            mensaje: 'Error categoria no encontrada'
        });
    }
}

// Obtener lista de categorias
export async function lista(req: Request, res: Response): Promise<Response> {
    try {
        const data = {
            storeProcedure: 'sp_lista_categorias'
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
            mensaje: 'Error categorias no encontradas'
        });
    }
}

// Buscar categorias
export async function buscar(req: Request, res: Response): Promise<Response> {
    try {
        const data = {
            storeProcedure: 'sp_buscar_categorias',
            vcriterio: req.body.criterio
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
            mensaje: 'Error categorias no encontradas'
        });
    }
}

// Obtener lista de categorias
export async function listaHome(req: Request, res: Response): Promise<Response> {
    try {
        const data = {
            storeProcedure: 'sp_lista_categorias_home'
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
            mensaje: 'Error categorias no encontradas'
        });
    }
}
