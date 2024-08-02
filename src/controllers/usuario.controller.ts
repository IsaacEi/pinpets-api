import { Request, Response } from 'express';
import bcrypt from 'bcryptjs'
import { storeProcedure } from '../classes/database';
import Methods from '../classes/methods';

// Crear usuario
export async function crear(req: Request, res: Response): Promise<Response> {
    try {
        const dataExist = {
            storeProcedure: 'sp_login',
            vmail: req.body.mail, 
        };
        const data = {
            storeProcedure: 'sp_crear_usuario',
            vnombre: req.body.nombre,
            vmail: req.body.mail,
            vactivo: req.body.activo,
            vpass: bcrypt.hashSync( req.body.pass, 10)
        };
        const spe = await storeProcedure(dataExist);
        const userE = spe[0][0];
        // Valida que usuario no exista
        if (userE) {
            return res.status(200).json({ 
                ok: false,
                mensaje: 'Usuario ya existe en el sistema'
            });
        }
        const sp = await storeProcedure(data);
        const userDB = sp[0][0];
        if (!userDB) {
            return res.status(200).json({ 
                estatus: false,
                mensaje: 'Usuario no creado'
            });
        }
        userDB.pass = ':)'
        return res.status(200).json({
            estatus: true,
            mensaje: 'Usuario creado correctamente'
        });
    } catch (err) {
        console.log('crear-err:', err);
        return res.status(400).json({ 
            status: false,
            mensaje: 'Error al crear usuario en el sistema'
        });
    }
}

// Actualizar usuario
export async function actualizar(req: Request, res: Response): Promise<Response> {  
    try {
        const data = {
            storeProcedure: 'sp_actualizar_usuario',
            vid: req.body.id,
            vnombre: req.body.nombre,
            vactivo: req.body.activo
        };         
        const sp = await storeProcedure(data);
        let userDB = sp[0][0];
        if (!userDB) {
            return res.status(200).json({ 
                estatus: false,
                mensaje: 'Usuario no encontrado en el sistema'
            });
        }
        userDB.pass = ':)';
        return res.status(200).json({
            estatus: true,
            mensaje: 'Usuario actualizado correctamente'
        });
    } catch (err) {
        console.log('actualizar-error:', err);
        return res.status(400).json({ 
            estatus: false,
            mensaje: 'Error al actualizar usuario'
        });
    }
}

// Borrar usuario
export async function borrar(req: Request, res: Response): Promise<Response> {
    try {
        const data = {
            storeProcedure: 'sp_borrar_usuario',
            vid: req.body.id
        }; 
        const sp = await storeProcedure(data);
        let userDB = sp[0][0];
        if (!userDB) {
            return res.status(200).json({ 
                estatus: false,
                mensaje: 'Usuario no encontrado en el sistema'
            });
        }
        return res.status(200).json({
            estatus: true,
            mensaje: 'Usuario borrado correctamente'
        });
    } catch (err) {
        console.log('borrar-error:', err);
        return res.status(400).json({ 
            estatus: false,
            mensaje: 'Error al borrar usuario'
        });
    }
}

// Obtener usuario
export async function obtener(req: Request, res: Response): Promise<Response> {
    try {
        const data = {
            storeProcedure: 'sp_obtener_usuario',
            vid: req.body.id
        }; 
        const sp = await storeProcedure(data);
        let userDB = sp[0][0];
        if (!userDB) {
            return res.status(200).json({ 
                estatus: false,
                mensaje: 'Usuario no encontrado en el sistema'
            });
        }
        userDB.pass = ':)';
        return res.status(200).json({
            estatus: true,
            data: userDB
        });
    } catch (err) {
        console.log('obtener-error:', err);
        return res.status(400).json({ 
            estatus: false,
            mensaje: 'Error usuario no encontrado'
        });
    }
}

// Obtener lista de usuario
export async function lista(req: Request, res: Response): Promise<Response> {
    try {
        const data = {
            storeProcedure: 'sp_lista_usuarios'
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
            mensaje: 'Error usarios no encontrados'
        });
    }
}

// Buscar usuarios
export async function buscar(req: Request, res: Response): Promise<Response> {
    try {
        const data = {
            storeProcedure: 'sp_buscar_usuarios',
            vcriterio: req.body.criterio
        }; 
        const sp = await storeProcedure(data);
        let userDB = sp[0];
        return res.status(200).json({
            estatus: true,
            data: userDB
        });
    } catch (err) {
        console.log('buscar-error:', err);
        return res.status(400).json({ 
            estatus: false,
            mensaje: 'Error usarios no encontrados'
        });
    }
}

// Actualizar la contraseña del usuario
export async function cambiarPass(req: Request, res: Response): Promise<Response> {  
    try {
        const data = {
            storeProcedure: 'sp_cambiar_pass_usuario',
            vid: req.body.id,
            vpass: bcrypt.hashSync( req.body.pass, 10),
        };
        const sp = await storeProcedure(data);
        const userDB = sp[0][0];
        if (!userDB) {
            return res.status(200).json({ 
                estatus: false,
                mensaje: 'Usuario no encontrado en el sistema'
            });
        }
        return res.status(200).json({
            estatus: true,
            mensaje: 'Contraseña actualizada correctamente'
        });
    } catch (err) {
        console.log('cambiarPass-error:', err);
        return res.status(400).json({ 
            estatus: false,
            mensaje: 'Error contraseña no actulizada'
        });
    }
}

// Genera una contraseña al azar y lo envia por email
export async function cambiarPassMail(req: Request, res: Response): Promise<Response> {
    try {
        // Se crea una nueva contraseña y se actualiza
        const newPassword = await Methods.newPassword();
        const data = {
            storeProcedure: 'sp_cambiar_pass_usuario',
            vmail: req.body.mail,
            vpass: bcrypt.hashSync( newPassword, 10),
        };
        const sp = await storeProcedure(data);
        const userDB = sp[0][0];
        // No existe email
        if (!userDB) {
            return res.status(200).json({ 
                estatus: false,
                mensaje: 'Usuario no registrado en el sistema'
            });
        }

        const context = {
            email: req.body.email,
            password: newPassword
        }

        await Methods.sendMailUserUpdatePassword(context);

        return res.status(200).json({
            estatus: true,
            mensaje: 'Contraseña enviada al email registrado en el sistema'
        });
    } catch (err) {
        console.log('cambiarPassMail-error:', err);
        return res.status(400).json({ 
            estatus: false,
            mensaje: 'Error contraseña no actualizada'
        });
    }
}
