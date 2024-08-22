import { Request, Response } from 'express';
import { storeProcedure } from '../classes/database';

// Crear detalle reporte
export async function crear(req: any, res: Response): Promise<Response> {
    try {
        const { id } = req.usuario;
        const { reporte, latitud, longitud, latengo } = req.body;
        const body = {
            storeProcedure: 'crearDetalleReporte',
            vreporte: reporte,
            vusuario: id,
            vlatitud: latitud,
            vlongitud: longitud,
            vlatengo: latengo,
        }; 
        const sp = await storeProcedure(body);
        const data = sp[0][0];
        return res.status(200).json({
            estatus: true,
            data
        });
    } catch (err) {
        console.log('crearReporte-error:', err);
        return res.status(400).json({ 
            estatus: false,
            mensaje: 'Error! Crear detalle reporte'
        });
    }
}

// Detalle reporte
export async function detalleReporte(req: Request, res: Response): Promise<Response> {
    try {
        const { reporte } = req.body;
        const body = {
            storeProcedure: 'detalleReporte',
            vreporte: reporte
        }; 
        const sp = await storeProcedure(body);
        const data = sp[0];
        return res.status(200).json({
            estatus: true,
            data
        });
    } catch (err) {
        console.log('detalleReporte-error:', err);
        return res.status(400).json({ 
            estatus: false,
            mensaje: 'Error! Detalle reporte'
        });
    }
}

