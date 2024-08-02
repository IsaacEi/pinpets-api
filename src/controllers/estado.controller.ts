import { Request, Response } from 'express';
import { storeProcedure } from '../classes/database';


// Lista de estados y municipos filtrados por el codigo postal
export async function lista(req: Request, res: Response): Promise<Response> {
    try {
        const data = {
            storeProcedure: 'ciudades'
        }; 
        const sp = await storeProcedure(data);
        let dataDB = sp[0];
        return res.status(200).json({
            estatus: true,
            data: dataDB
        });
    } catch (err) {
        console.log('listaCP-error:', err);
        return res.status(400).json({ 
            estatus: false,
            mensaje: 'Error! estados no encontrados'
        });
    }
}

