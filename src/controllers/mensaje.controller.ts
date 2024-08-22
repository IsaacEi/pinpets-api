import { Request, Response } from 'express';
import { storeProcedure } from '../classes/database';

// Enviar mensaje
export async function enviarMensaje(req: any, res: Response): Promise<Response> {
    try {
        const { id } = req.usuario;
        const { usuariorecibe, mensaje } = req.body;
        const body = {
            storeProcedure: 'enviarMensaje',
            vusuario: id,
            vusuariorecibe: usuariorecibe,
            vmensaje: mensaje
        }; 
        const sp = await storeProcedure(body);
        const data = sp[0][0];
        return res.status(200).json({
            estatus: true,
            data
        });
    } catch (err) {
        console.log('enviarMensaje-error:', err);
        return res.status(400).json({ 
            estatus: false,
            mensaje: 'Error! al enviar mensaje'
        });
    }
}

// Encontaron mi mascota mensaje
export async function encontraronMascota(req: any, res: Response): Promise<Response> {
    try {
        const { id } = req.usuario;
        const { reporte } = req.body;
        const body = {
            storeProcedure: 'encontraronMiMascota',
            vreporte: reporte,
            vusuario: id,
        }; 
        const sp = await storeProcedure(body);
        const data = sp[0][0];
        return res.status(200).json({
            estatus: true,
            data
        });
    } catch (err) {
        console.log('enviarMensaje-error:', err);
        return res.status(400).json({ 
            estatus: false,
            mensaje: 'Error! al encontaron mi mascota'
        });
    }
}

