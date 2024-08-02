import { Request, Response } from 'express';
import { storeProcedure } from '../classes/database';

// Crear direccion del cliente
export async function crear(req: any, res: Response): Promise<Response> {
    try {
        const data = {
            storeProcedure: 'sp_crear_direccion_cliente',
            vid_cliente: req.usuario.id,
            vcalle: req.body.calle,
            vnumero_ext: req.body.numero_ext,
            vnumero_int: req.body.numero_int,
            vcolonia: req.body.colonia,
            vcp: req.body.cp,
            valcaldia: req.body.alcaldia,
            vid_estado: req.body.id_estado,
            valias: req.body.alias
        };
        const sp = await storeProcedure(data);
        const dataDB = sp[0][0];
        if (!dataDB) {
            return res.status(200).json({ 
                estatus: false,
                mensaje: 'Direccion no creado'
            });
        }
        return res.status(200).json({
            estatus: true,
            mensaje: 'Direccion creada correctamente',
            data:  dataDB
        });
    } catch (err) {
        console.log('direccion-err:', err);
        return res.status(200).json({ 
            status: false,
            mensaje: '!Error¡ al crear direccion en el sistema'
        });
    }
}

// Actualizar direccion del cliente
export async function actualizar(req: Request, res: Response): Promise<Response> {
    try {
        const data = {
            storeProcedure: 'sp_actualizar_direccion_cliente',
            vid: req.body.id,
            vcalle: req.body.calle,
            vnumero_ext: req.body.numero_ext,
            vnumero_int: req.body.numero_int,
            vcolonia: req.body.colonia,
            vcp: req.body.cp,
            valcaldia: req.body.alcaldia,
            vid_estado: req.body.id_estado,
            valias: req.body.alias
        };
        const sp = await storeProcedure(data);
        const dataDB = sp[0][0];
        if (!dataDB) {
            return res.status(200).json({ 
                estatus: false,
                mensaje: 'Direccion no encontrada'
            });
        }
        return res.status(200).json({
            estatus: true,
            mensaje: 'Direccion actualizada correctamente',
            data:  dataDB
        });
    } catch (err) {
        console.log('direccion-err:', err);
        return res.status(200).json({ 
            status: false,
            mensaje: '!Error¡ al actualizar direccion en el sistema'
        });
    }
}

// Obtener direccion del cliente
export async function obtenerInvitado(req: any, res: Response): Promise<Response> {
    try {
        const data = {
            storeProcedure: 'sp_obtener_direccion_carrito_invitado',
            vid_cliente: req.usuario.id
        };
        const sp = await storeProcedure(data);
        const dataDB = sp[0][0];
        if (!dataDB) {
            return res.status(200).json({ 
                estatus: false,
                mensaje: 'Direccion no encontrada'
            });
        }
        return res.status(200).json({
            estatus: true,
            data:  dataDB
        });
    } catch (err) {
        console.log('obtenerDireccionInvitado-err:', err);
        return res.status(200).json({ 
            status: false,
            mensaje: '!Error¡ al obtener direccion en el sistema'
        });
    }
}

// Borrar direccion del cliente
export async function borrar(req: Request, res: Response): Promise<Response> {
    try {
        const data = {
            storeProcedure: 'sp_borrar_direccion_cliente',
            vid: req.body.id
        };
        const sp = await storeProcedure(data);
        const dataDB = sp[0][0];
        if (!dataDB) {
            return res.status(200).json({ 
                estatus: false,
                mensaje: 'Direccion no encontrada en el sistema'
            });
        }
        return res.status(200).json({
            estatus: true,
            mensaje: 'Direccion borrada correctamente'
        });
    } catch (err) {
        console.log('borrarDireccion-err:', err);
        return res.status(200).json({ 
            status: false,
            mensaje: '!Error¡ al borrar direccion en el sistema'
        });
    }
}

// Lista de direcciones del cliente
export async function lista(req: any, res: Response): Promise<Response> {
    try {
        const data = {
            storeProcedure: 'sp_lista_direcciones_cliente',
            vid_cliente: req.usuario.id
        };
        const sp = await storeProcedure(data);
        const dataDB = sp[0];
        return res.status(200).json({
            estatus: true,
            data:  dataDB
        });
    } catch (err) {
        console.log('lista-err:', err);
        return res.status(200).json({ 
            status: false,
            mensaje: '!Error¡ direcciones no encontradas en el sistema'
        });
    }
}

// Obtener direccion del cliente
export async function obtener(req: Request, res: Response): Promise<Response> {
    try {
        const data = {
            storeProcedure: 'sp_obtener_direccion_cliente',
            vid: req.body.id
        };
        const sp = await storeProcedure(data);
        const dataDB = sp[0][0];
        if (!dataDB) {
            return res.status(200).json({ 
                estatus: false,
                mensaje: 'Direccion no encontrada en el sistema'
            });
        }
        return res.status(200).json({
            estatus: true,
            data:  dataDB
        });
    } catch (err) {
        console.log('lista-err:', err);
        return res.status(200).json({ 
            status: false,
            mensaje: '!Error¡ direcciones no encontradas en el sistema'
        });
    }
}

// Actualizar direccion del carrito
export async function carrito(req: any, res: Response): Promise<Response> {
    try {
        const data = {
            storeProcedure: 'sp_actualizar_direccion_carrito',
            vid_cliente: req.usuario.id,
            vid_direccion: req.body.id
        };
        const sp = await storeProcedure(data);
        const dataDB = sp[0][0];
        if (!dataDB) {
            return res.status(200).json({ 
                estatus: false,
                mensaje: 'Direccion no encontrada'
            });
        }
        return res.status(200).json({
            estatus: true,
            mensaje: 'Direccion carrito actualizada correctamente',
            data:  dataDB
        });
    } catch (err) {
        console.log('direccion-err:', err);
        return res.status(200).json({ 
            status: false,
            mensaje: '!Error¡ al actualizar direccion carrito en el sistema'
        });
    }
}
