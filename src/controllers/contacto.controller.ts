import { Request, Response } from 'express';
import { storeProcedure } from '../classes/database';
import Methods from '../classes/methods';

export async function enviar(req: Request, res: Response): Promise<Response> {
    try {
        const context = {
            contacto: req.body
        };
        // Envia el pedido por email
        await Methods.sendMailContactanos(context);
        return res.status(200).json({
            estatus: true,
            mensaje: 'Correo enviado correctamente'
        })
    } catch (err) {
        console.log('confirmarPedido-error', err);
        return res.status(400).json({ 
            estatus: false,
            mensaje: 'Error al confirmar pedido'
        })
    }
}
