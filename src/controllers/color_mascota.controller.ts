import { Request, Response } from 'express';
import { storeProcedure } from '../classes/database';


// Obtener lista de colores de mascotas por tipo
export async function lista(req: Request, res: Response): Promise<Response> {
    try {
        const { tipo } = req.body;
        const body = {
            storeProcedure: 'colorMascotas',
            vtipo: tipo,
        }; 
        const sp = await storeProcedure(body);
        const data = sp[0];
        return res.status(200).json({
            estatus: true,
            data
        });
    } catch (err) {
        console.log('lista-error:', err);
        return res.status(400).json({ 
            estatus: false,
            mensaje: 'Error lista de colores no encontradas'
        });
    }
}