import { Request, Response } from 'express';
import { storeProcedure } from '../classes/database';

// Crear mascota
export async function crear(req: any, res: Response): Promise<Response> {
    try {
        const data = {
            storeProcedure: 'sp_crear_mascota',
            vid_cliente: req.usuario.id,
            vfoto: req.body.foto,
            vnombre: req.body.nombre,
            vid_tipo_mascota: req.body.id_tipo_mascota,
            vid_raza: req.body.id_raza,
            vfecha_nac: req.body.fecha_nac,
            vid_color: req.body.id_color,
            vid_genero: req.body.id_genero,
            vid_tamaño: req.body.id_tamaño,
            vsenas: req.body.vsenas,
            vqr: req.body.qr,
        };
        const sp = await storeProcedure(data);
        const dataDB = sp[0][0];
        if (!dataDB) {
            return res.status(200).json({ 
                estatus: false,
                mensaje: 'Mascota no creada'
            });
        }
        return res.status(200).json({
            estatus: true,
            mensaje: 'Mascota creada correctamente'
        });
    } catch (err) {
        console.log('crear-err:', err);
        return res.status(400).json({ 
            status: false,
            mensaje: 'Error al crear mascota en el sistema'
        });
    }
}

// Actualizar mascota
export async function actualizar(req: any, res: Response): Promise<Response> {  
    try {
        const data = {
            storeProcedure: 'sp_actualizar_mascota',
            vid: req.body.id,
            vid_cliente: req.usuario.id,
            vfoto: req.body.foto,
            vnombre: req.body.nombre,
            vid_tipo_mascota: req.body.id_tipo_mascota,
            vid_raza: req.body.id_raza,
            vfecha_nac: req.body.fecha_nac,
            vid_color: req.body.id_color,
            vid_genero: req.body.id_genero,
            vid_tamaño: req.body.id_tamaño,
            vsenas: req.body.vsenas,
            vqr: req.body.qr,
        };         
        const sp = await storeProcedure(data);
        let dataDB = sp[0][0];
        if (!dataDB) {
            return res.status(200).json({ 
                estatus: false,
                mensaje: 'Mascota no encontrada en el sistema'
            });
        }
        return res.status(200).json({
            estatus: true,
            mensaje: 'Mascota actualizada correctamente'
        });
    } catch (err) {
        console.log('actualizar-error:', err);
        return res.status(400).json({ 
            estatus: false,
            mensaje: 'Error al actualizar mascota'
        });
    }
}

// Borrar mascota
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

// Obtener mascota
export async function obtener(req: Request, res: Response): Promise<Response> {
    try {
        const data = {
            storeProcedure: 'sp_obtener_mascota',
            vid: req.body.id
        }; 
        const sp = await storeProcedure(data);
        let dataDB = sp[0][0];
        if (!dataDB) {
            return res.status(200).json({ 
                estatus: false,
                mensaje: 'Mascota no encontrada en el sistema'
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
            mensaje: 'Error mascota no encontrada'
        });
    }
}

// Obtener lista de mascotas
export async function lista(req: any, res: Response): Promise<Response> {
    try {
        const data = {
            storeProcedure: 'sp_lista_mascotas',
            vid_cliente: req.usuario.id,
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
            mensaje: 'Error macotas no encontradas'
        });
    }
}

// Obtener lista de colores
export async function listaApp(req: Request, res: Response): Promise<Response> {
    try {
        const data = {
            storeProcedure: 'sp_lista_colores',
            vid_tipo_mascota: req.body.id_tipo_mascota,
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
            mensaje: 'Error colores no encontradas'
        });
    }
}