import { Request, Response } from 'express';
import { storeProcedure } from '../classes/database';

// Confirmar compra
export async function confirmarCompra(req: any, res: Response): Promise<Response> {  
    try {
        const data = {
            storeProcedure: 'sp_confirmar_compra',
            vid_cliente: req.usuario.id
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
        console.log('confirmarCompra-error:', err);
        return res.status(400).json({ 
            estatus: false,
            mensaje: 'Error al confirmar compra'
        });
    }
}
