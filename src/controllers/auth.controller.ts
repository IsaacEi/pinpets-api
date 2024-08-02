import { Request, Response } from 'express';
import path from 'path';
import bcrypt from 'bcryptjs'
import { storeProcedure } from '../classes/database';
import Methods from '../classes/methods';

// Login
export async function login(req: Request, res: Response): Promise<Response> {
    try {
        const data = {
            storeProcedure: 'sp_login',
            vmail: req.body.mail,
            vpass: req.body.pass
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
        //const passEncr =  bcrypt.hashSync( data.vpass, 10);
        //console.log('passEncr', passEncr);
        const isCompare = Methods.comparePassword({ paswordDB: userDB.pass, password: data.vpass });
        // Contraseñas diferentes
        if (!isCompare) {
            return res.status(200).json({ 
                estatus: false,
                mensaje: 'Usuario no registrado en el sistema'
            });
        }
        // Usuario no activado
        if (userDB.activo === 0) {
            return res.status(200).json({ 
                estatus: false,
                mensaje: 'Usuario no registrado en el sistema'
            });
        }
        // Genera token
        userDB.pass = ':)';
        const token = Methods.getJwtToken(userDB);

        return res.status(200).json({
            estatus: true,
            token: token
        });
    } catch (err) {
        console.log('login-error:', err);
        return res.status(400).json({ 
            estatus: false,
            mensaje: 'Error usuario no registrado en el sistema'
        });
    }
}

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
        // Genera token
        userDB.pass = ':)'
        const token = Methods.getJwtToken(userDB)
        return res.status(200).json({
            estatus: true,
            token: token
        });
    } catch (err) {
        console.log('registro-err:', err);
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
        const token = Methods.getJwtToken(userDB)
        return res.status(200).json({
            estatus: true,
            mensaje: 'Usuario actualizado correctamente',
            token: token
        });
    } catch (err) {
        console.log('usuario-error:', err);
        return res.status(400).json({ 
            estatus: false,
            mensaje: 'Error al actualizar usuario'
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
        console.log('usuario-error:', err);
        return res.status(400).json({ 
            estatus: false,
            mensaje: 'Error usario no encontrado'
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
            storeProcedure: 'sp_cambiar_pass_mail_usuario',
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
            email: req.body.mail,
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
            mensaje: 'Error contraseña no enviada'
        });
    }
}

// Token
export async function token(req: any, res: Response): Promise<Response> {
    try {
        const usuario = req.usuario
        return res.status(200).json({
            estatus: true,
            usuario: usuario
        })
    } catch (err) {
        console.log('token-error:', err);
        return res.status(400).json({ 
            estatus: false,
            mensaje: err
        })
    }
}

// Imagen
export async function image(req: any, res: any): Promise<Response> {
    try {
        /* const tipo = req.params.tipo;
        const foto = req.params.foto;
        const pathImg = path.join( __dirname, `../uploads/${ tipo }/${ foto }` );
        // imagen por defecto
        if ( fs.existsSync( pathImg ) ) {
            res.sendFile( pathImg );
        } else {
            const pathImg = path.join( __dirname, `../uploads/no-img.jpg` );
            res.sendFile( pathImg );
        } */
        const pathImg = path.join( __dirname, `../uploads/user.png` );
        return res.sendFile( pathImg );
    } catch (error) {
        return res.status(400).json({ 
            ok: false,
            mensaje: error
        })
    }

}
