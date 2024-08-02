import { Request, Response } from 'express';
import path from 'path';
import bcrypt from 'bcryptjs'
import { storeProcedure } from '../classes/database';
import Methods from '../classes/methods';

// Login cliente
export async function login(req: Request, res: Response): Promise<Response> {
    try {
        const { mail, pass } = req.body;
        const data = {
            storeProcedure: 'login',
            vmail: mail,
            vpass: pass
        };
        const sp = await storeProcedure(data);
        const dataDB = sp[0][0];
        console.log(dataDB);
        
        // No existe email
        if (!dataDB) {
            return res.status(200).json({ 
                estatus: false,
                mensaje: 'Cliente no registrado en el sistema'
            });
        }
        /* const isCompare = Methods.comparePassword({ paswordDB: dataDB.pass, password: data.vpass });
        // Contraseñas diferentes
        if (!isCompare) {
            return res.status(200).json({ 
                estatus: false,
                mensaje: 'Cliente no registrado en el sistema'
            });
        } */
        // Genera token
        dataDB.pass = ':)';
        const token = Methods.getJwtToken(dataDB);
        // Cliente no activado
        if (dataDB.estatus === 'I') {
            // Envia correo para verificar cuenta
            await Methods.sendMailUserVerifyAccount(dataDB);
            return res.status(200).json({ 
                estatus: true,
                activo: false,
                mensaje: 'Código enviado al email registrado en el sistema',
                token: token,
            });
        }
        return res.status(200).json({
            estatus: true,
            activo: true,
            data:  dataDB,
            token: token,
            mensaje: `Bienvenido ${ dataDB.nombre }`
        });
    } catch (err) {
        console.log('login-error:', err);
        return res.status(200).json({ 
            estatus: false,
            mensaje: '!Error¡ cliente no registrado en el sistema'
        });
    }
}

// Registrar cliente
export async function registro(req: Request, res: Response): Promise<Response> {
    try {
        const { 
            nombre,
            apellido,
            contrasena,
            telefono,
            fechanac,
            mail,
            genero,
            cp,
            estado,
            municipio,
            colonia,
            calle,
            numeroe,
            numeroi,
            foto,
            nacionalidad,
            ne_nacionalidad,
            tipo
        } = req.body;
        let data = {
            storeProcedure: 'registro',
            vnombre: nombre,
            vapellido: apellido,
            vcontrasena: contrasena,
            /* vcontrasena: bcrypt.hashSync( contrasena, 10), */
            vtelefono: telefono,
            vmail: mail,
            vfechanac: fechanac,
            vgenero: genero,
            vcp: cp,
            vestado: estado,
            vmunicipio: municipio,
            vcolonia: colonia,
            vcalle: calle,
            vnumeroe: numeroe,
            vnumeroi: numeroi,
            vfoto: foto,
            vnacionalidad: nacionalidad,
            vne_nacionalidad: ne_nacionalidad,
            vtipo: tipo,
        };
        /* const address = `calle ${ data.vcalle } #${ data.vnumeroe }, col. ${ data.vcolonia }, ${data.vcp}, Méx`;
        const dataGeometry = await Methods.getGoogleMapsGeometry(address);
        if (!dataGeometry.estatus) {
            return res.status(200).json({ 
                estatus: false,
                mensaje: dataGeometry.mensaje
            })
        }

        data.vlatitud = dataGeometry.data.location.lat;
        data.vlongitud = dataGeometry.data.location.lng; */

        const sp = await storeProcedure(data);
        let dataDB = sp[0][0];
        if (!dataDB) {
            return res.status(200).json({ 
                estatus: false,
                mensaje: 'Cliente no registrado en el sistema'
            });
        }
        dataDB.pass = ':)';
        const token = Methods.getJwtToken(dataDB);
        // Cliente no activado
        if (dataDB.estatus === 'I') {
            // Envia correo para verificar cuenta
            await Methods.sendMailUserVerifyAccount(dataDB);
            return res.status(200).json({ 
                estatus: true,
                activo: false,
                mensaje: 'Código enviado al email registrado en el sistema',
                token: token,
            });
        }
        return res.status(200).json({
            estatus: true,
            token: token,
            activo: true,
            mensaje: 'Cliente registrado correctamente'
        });
    } catch (err) {
        console.log('registro-err:', err);
        return res.status(200).json({ 
            status: false,
            mensaje: '!Error¡ al registrar cliente en el sistema'
        });
    }
}

// Actualizar la contraseña del cliente
export async function cambiarPass(req: any, res: Response): Promise<Response> {  
    try {
        const data = {
            storeProcedure: 'sp_cambiar_pass_cliente',
            vid: req.usuario.id,
            vpass: bcrypt.hashSync( req.body.pass, 10),
        };
        const sp = await storeProcedure(data);
        const dataDB = sp[0][0];
        if (!dataDB) {
            return res.status(200).json({ 
                estatus: false,
                mensaje: 'Cliente no encontrado en el sistema'
            });
        }
        dataDB.pass = ':)'
        // Genera token
        const token = Methods.getJwtToken(dataDB)
        return res.status(200).json({
            estatus: true,
            data:  dataDB,
            token: token,
            mensaje: 'Contraseña actualizada correctamente'
        });
    } catch (err) {
        console.log('cambiarPass-error:', err);
        return res.status(200).json({ 
            estatus: false,
            mensaje: '!Error¡ contraseña no actulizada'
        });
    }
}

// Activar cliente
export async function activar(req: any, res: Response): Promise<Response> {  
    try {
        const data = {
            storeProcedure: 'activar',
            vid: req.usuario.id,
            vcodigo: req.body.codigo,
        };
        const sp = await storeProcedure(data);
        const dataDB = sp[0][0];
        if (!dataDB) {
            return res.status(200).json({ 
                estatus: false,
                mensaje: 'Cliente no encontrado en el sistema'
            });
        }
        if (dataDB.error === 1) {
            return res.status(200).json({ 
                estatus: false,
                mensaje: dataDB.mensaje
            })
        }
        dataDB.pass = ':)';
        // Genera token
        const token = Methods.getJwtToken(dataDB)
        return res.status(200).json({
            estatus: true,
            data:  dataDB,
            token: token,
            mensaje: 'Cliente activado correctamente'
        });
    } catch (err) {
        console.log('activar-error:', err);
        return res.status(200).json({ 
            estatus: false,
            mensaje: '!Error¡ Cliente no activado'
        });
    }
}

// Obtener cliente
export async function obtener(req: any, res: Response): Promise<Response> {
    try {
        const data = {
            storeProcedure: 'getperfil',
            vid: req.usuario.id
        }; 
        const sp = await storeProcedure(data);
        let dataDB = sp[0][0];
        console.log('dataDB',dataDB);
        
        if (!dataDB) {
            return res.status(200).json({ 
                estatus: false,
                mensaje: 'Cliente no encontrado en el sistema'
            });
        }
        dataDB.pass = ':)';
        return res.status(200).json({
            estatus: true,
            data: dataDB
        });
    } catch (err) {
        console.log('cliente-error:', err);
        return res.status(400).json({ 
            estatus: false,
            mensaje: 'Error cliente no encontrado'
        });
    }
}

// Actualizar cliente
export async function actualizar(req: any, res: Response): Promise<Response> {  
    try {
        const data = {
            storeProcedure: 'sp_actualizar_cliente',
            vid: req.usuario.id,
            vnombre: req.body.nombre,
            vapellido_pat: req.body.apellido_pat,
            vgenero: req.body.genero,
            vfecha_nac: req.body.fecha_nac,
            vtel: req.body.tel,
            vfoto: req.body.foto,
            vid_direccion: req.body.id_direccion,
            vcalle: req.body.calle,
            vnumero_ext: req.body.numero_ext,
            vnumero_int: req.body.numero_int,
            vcolonia: req.body.colonia,
            vcp: req.body.cp,
            vid_estado: req.body.id_estado,
            vid_municipio: req.body.id_municipio,
            vlatitud: req.body.latitud,
            vlongitud: req.body.longitud,
            vtipo_cliente: req.body.tipo_cliente,
        };         
        const sp = await storeProcedure(data);
        let dataDB = sp[0][0];
        if (!dataDB) {
            return res.status(200).json({ 
                estatus: false,
                mensaje: 'Cliente no encontrado en el sistema'
            });
        }
        dataDB.pass = ':)';
        const token = Methods.getJwtToken(dataDB)
        return res.status(200).json({
            estatus: true,
            data:  dataDB,
            token: token,
            mensaje: 'Cliente actualizar correctamente'
        });
    } catch (err) {
        console.log('actualizarPerfil-error:', err);
        return res.status(200).json({ 
            estatus: false,
            mensaje: '!Error¡ al actualizar perfil del cliente'
        });
    }
}

// Vuelve enviar el codigo por correo
export async function codigoMail(req: any, res: Response): Promise<Response> {
    try {
        const data = {
            storeProcedure: 'login',
            vmail: req.body.mail
        };
        const sp = await storeProcedure(data);
        const dataDB = sp[0][0];
        // No existe email
        if (!dataDB) {
            return res.status(200).json({ 
                estatus: false,
                mensaje: 'Cliente no registrado en el sistema'
            });
        }
        
        // Envia correo para verificar cuenta
        await Methods.sendMailUserVerifyAccount(dataDB);
        return res.status(200).json({ 
            estatus: true,
            mensaje: 'Código enviado al correo registrado en el sistema'
        });
    } catch (err) {
        console.log('codigoMail-error:', err);
        return res.status(200).json({ 
            estatus: false,
            mensaje: '!Error¡ cliente no registrado en el sistema'
        });
    }
}

// Genera una contraseña al azar y lo envia por email
export async function cambiarPassMail(req: Request, res: Response): Promise<Response> {
    try {
        // Se crea una nueva contraseña y se actualiza
        const newPassword = await Methods.newPassword();
        const data = {
            storeProcedure: 'sp_cambiar_pass_cliente_mail',
            vmail: req.body.mail,
            vpass: bcrypt.hashSync( newPassword, 10),
        };
        const sp = await storeProcedure(data);
        const dataDB = sp[0][0];
        // No existe email
        if (!dataDB) {
            return res.status(200).json({ 
                estatus: false,
                mensaje: 'Cliente no registrado en el sistema'
            });
        }

        const context = {
            email: req.body.mail,
            password: newPassword
        }
        // Envia Correo para recuperar contraseña
        await Methods.sendMailUserUpdatePassword(context);
        return res.status(200).json({
            estatus: true,
            mensaje: 'Contraseña enviada al correo registrado en el sistema'
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
        const cliente = req.usuario
        return res.status(200).json({
            estatus: true,
            cliente: cliente
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
        // Arma la respuesta y no sabe donde
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
