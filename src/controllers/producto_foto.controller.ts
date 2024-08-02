import { Request, Response } from 'express';
import { storeProcedure } from '../classes/database';
import Methods from '../classes/methods';

// Crear foto producto
export async function crear(req: any, res: Response): Promise<Response> {
    try {
        const data = {
            storeProcedure: 'sp_crear_fotos_producto',
            vid_producto: req.body.id_producto,
            vurl: req.body.url
        };
        
        // Guardar imagen
        if (req.files) {
            const files = req.files;
            const foto = files.foto_file;
            const fotoRes = await Methods.fileUpload('productos', foto);
            if (fotoRes.estatus) {
                data.vurl = fotoRes.ruta;
            }
        }
        const sp = await storeProcedure(data);
        const dataDB = sp[0][0];
        if (!dataDB) {
            return res.status(200).json({ 
                estatus: false,
                mensaje: 'Foto producto no creado'
            });
        }
        return res.status(200).json({
            estatus: true,
            mensaje: 'Foto producto creado correctamente'
        });
    } catch (err) {
        console.log('crear-err:', err);
        return res.status(400).json({ 
            status: false,
            mensaje: 'Error al crear foto producto en el sistema'
        });
    }
}

// Actualizar foto producto
export async function actualizar(req: Request, res: Response): Promise<Response> {  
    try {
        const data = {
            storeProcedure: 'sp_actualizar_fotos_producto',
            vid: req.body.id,
            vprincipal: req.body.principal
        };         
        const sp = await storeProcedure(data);
        let dataDB = sp[0][0];
        if (!dataDB) {
            return res.status(200).json({ 
                estatus: false,
                mensaje: 'Foto producto no encontrado en el sistema'
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
            mensaje: 'Foto producto actualizado correctamente'
        });
    } catch (err) {
        console.log('actualizar-error:', err);
        return res.status(400).json({ 
            estatus: false,
            mensaje: 'Error al actualizar foto producto'
        });
    }
}

// Borrar foto producto
export async function borrar(req: Request, res: Response): Promise<Response> {
    try {
        const data = {
            storeProcedure: 'sp_borrar_fotos_producto',
            vid: req.body.id
        }; 
        const sp = await storeProcedure(data);
        let dataDB = sp[0][0];
        if (!dataDB) {
            return res.status(200).json({ 
                estatus: false,
                mensaje: 'Foto producto no encontrado en el sistema'
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
            mensaje: 'Foto producto borrado correctamente'
        });
    } catch (err) {
        console.log('borrar-error:', err);
        return res.status(400).json({ 
            estatus: false,
            mensaje: 'Error al borrar foto producto'
        });
    }
}

// Obtener lista de foto producto
export async function lista(req: Request, res: Response): Promise<Response> {
    try {
        const data = {
            storeProcedure: 'sp_lista_fotos_productos',
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
            mensaje: 'Error foto productos no encontrados'
        });
    }
}

