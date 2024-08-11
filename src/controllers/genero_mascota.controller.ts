import { Request, Response } from 'express';
import { storeProcedure } from '../classes/database';

// Obtener lista de generos
export async function lista(req: Request, res: Response): Promise<Response> {
    try {
        const data = {
            storeProcedure: 'sp_lista_generos'
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
            mensaje: 'Error lista de mascotas generos no encontradas'
        });
    }
}
