import { Request, Response } from 'express';
import { storeProcedure } from '../classes/database';

// Crear mascota
export async function crear(req: any, res: Response): Promise<Response> {
    try {
        const { id } = req.usuario;
        const { 
            color,
            ne_color,
            fecha_nac,
            genero,
            raza,
            ne_raza,
            tipo_mascota,
            ne_tipo_mascota,
            qr,
            nombre,
            senas_particulares,
            tamano,
            ne_tamano,
            idMascota,
        } = req.body;
        const body = {
            storeProcedure: 'nuevaMascota',
            vcolor: color,
            vne_color: ne_color,
            vfecha_nac: fecha_nac,
            vgenero: genero,
            vraza: raza,
            vne_raza: ne_raza,
            vtipo_mascota: tipo_mascota,
            vne_tipo_mascota: ne_tipo_mascota,
            vqr: qr,
            vnombre: nombre,
            vsenas_particulares: senas_particulares,
            vtamano: tamano,
            vne_tamano: ne_tamano,
            vusuario: id,
            vid: idMascota,
        };
        
        const sp = await storeProcedure(body);
        const data = sp[0][0];
        if (!data) {
            return res.status(200).json({ 
                estatus: false,
                mensaje: 'Mascota no creada'
            });
        }
        if (data.error === 1) {
            return res.status(200).json({ 
                estatus: false,
                mensaje: data.mensaje
            })
        }
        return res.status(200).json({
            estatus: true,
            mensaje: 'Mascota creada correctamente'
        });
    } catch (err) {
        console.log('crear-err:', err);
        return res.status(400).json({ 
            status: false,
            mensaje: 'Error al crear mascota'
        });
    }
}

// Actualizar mascota
export async function actualizar(req: any, res: Response): Promise<Response> {  
    try {
        const { id } = req.usuario;
        const { 
            color,
            ne_color,
            fecha_nac,
            genero,
            raza,
            ne_raza,
            tipo_mascota,
            ne_tipo_mascota,
            qr,
            nombre,
            senas_particulares,
            tamano,
            ne_tamano,
            idMascota,
        } = req.body;
        const body = {
            storeProcedure: 'nuevaMascota',
            vcolor: color,
            vne_color: ne_color,
            vfecha_nac: fecha_nac,
            vgenero: genero,
            vraza: raza,
            vne_raza: ne_raza,
            vtipo_mascota: tipo_mascota,
            vne_tipo_mascota: ne_tipo_mascota,
            vqr: qr,
            vnombre: nombre,
            vsenas_particulares: senas_particulares,
            vtamano: tamano,
            vne_tamano: ne_tamano,
            vusuario: id,
            vid: idMascota,
        };
        const sp = await storeProcedure(body);
        const data = sp[0][0];
        if (!data) {
            return res.status(200).json({ 
                estatus: false,
                mensaje: 'Mascota no encontrada'
            });
        }
        if (data.error === 1) {
            return res.status(200).json({ 
                estatus: false,
                mensaje: data.mensaje
            })
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
export async function borrar(req: any, res: Response): Promise<Response> {
    try {
        const { id } = req.usuario;
        const { idMascota } = req.body;
        const body = {
            storeProcedure: 'borrarMascota',
            vusuario: id,
            vmascota: idMascota
        }; 
        const sp = await storeProcedure(body);
        const data = sp[0][0];
        if (!data) {
            return res.status(200).json({ 
                estatus: false,
                mensaje: 'Mascota no encontrada'
            });
        }
        return res.status(200).json({
            estatus: true,
            mensaje: 'Mascota borrada correctamente'
        });
    } catch (err) {
        console.log('borrar-error:', err);
        return res.status(400).json({ 
            estatus: false,
            mensaje: 'Error al borrar mascota'
        });
    }
}

// Obtener mascota
export async function obtener(req: any, res: Response): Promise<Response> {
    try {
        const { id } = req.usuario;
        const { idMascota } = req.body;
        const body = {
            storeProcedure: 'obtenerMascota',
            vusuario: id,
            vidMascota: idMascota
        }; 
        const sp = await storeProcedure(body);
        const data = sp[0][0];
        if (!data) {
            return res.status(200).json({ 
                estatus: false,
                mensaje: 'Mascota no encontrada'
            });
        }
        return res.status(200).json({
            estatus: true,
            data
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
        const { id } = req.usuario;
        const body = {
            storeProcedure: 'mascotas',
            vusuario: id,
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
            mensaje: 'Error macotas no encontradas'
        });
    }
}
