import { Request, Response } from 'express';
import { storeProcedure } from '../classes/database';
import Server from '../classes/server';

// Actualizar red social
export async function actualizar(req: Request, res: Response): Promise<Response> {  
    try {
        const data = {
            storeProcedure: 'sp_actualizar_redes_sociales',
            vid: req.body.id,
            vlink: req.body.link,
            vactivo: req.body.activo
        };         
        const sp = await storeProcedure(data);
        let dataDB = sp[0][0];
        if (!dataDB) {
            return res.status(200).json({ 
                estatus: false,
                mensaje: 'Red social no encontrada en el sistema'
            });
        }
        // Sockets
        const server = Server.instance;
        const { redes } = await listaRedesHomeDB();
        const payloadRedes = {
            estatus: true,
            data: redes,
            mensaje: 'Configuracion actualizada'
        };
        server.io.emit('configuracion-redes', payloadRedes);
        return res.status(200).json({
            estatus: true,
            mensaje: 'Red social actualizada correctamente'
        });
    } catch (err) {
        console.log('actualizar-error:', err);
        return res.status(400).json({ 
            estatus: false,
            mensaje: 'Error al actualizar red social'
        });
    }
}

// Obtener red social
export async function obtener(req: Request, res: Response): Promise<Response> {
    try {
        const data = {
            storeProcedure: 'sp_obtener_red_social',
            vid: req.body.id
        }; 
        const sp = await storeProcedure(data);
        let dataDB = sp[0][0];
        if (!dataDB) {
            return res.status(200).json({ 
                estatus: false,
                mensaje: 'Red social no encontrada en el sistema'
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
            mensaje: 'Error red social no encontrada'
        });
    }
}

// Obtener lista de redes sociales
export async function lista(req: Request, res: Response): Promise<Response> {
    try {
        const data = {
            storeProcedure: 'sp_lista_redes_sociales'
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
            mensaje: 'Error redes sociales no encontradas'
        });
    }
}

// Buscar redes sociales
export async function buscar(req: Request, res: Response): Promise<Response> {
    try {
        const data = {
            storeProcedure: 'sp_buscar_redes_sociales',
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
            mensaje: 'Error redes sociales no encontradas'
        });
    }
}

// Metodo para obtener configuracion (redes sociales) de base de datos
async function listaRedesHomeDB() : Promise<any> {
    return new Promise( async (resolve) => {
        try {
            const dataRedes = {
                storeProcedure: 'sp_lista_redes_sociales_home'
            }; 
            const spRedes = await storeProcedure(dataRedes);
            let dataRedesDB = spRedes[0] || [];
            return resolve({ 
                estatus: true,
                redes: dataRedesDB
            });
        } catch (err) {
            return resolve({ 
                estatus: false,
                mensaje: '!Error¡ configuracion no encontrada'
            });
        }
    });
}
