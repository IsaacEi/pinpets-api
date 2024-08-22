import { Request, Response } from 'express';
import path from 'path';
import bcrypt from 'bcryptjs'
import { storeProcedure } from '../classes/database';
import Methods from '../classes/methods';

// Login cliente
export async function login(req: Request, res: Response): Promise<Response> {
    try {
        const { mail, pass } = req.body;
        const body = {
            storeProcedure: 'login',
            vmail: mail,
            vpass: pass
        };
        const sp = await storeProcedure(body);
        const data = sp[0][0];
        // No existe email
        if (!data) {
            return res.status(200).json({ 
                estatus: false,
                mensaje: 'Cliente no registrado'
            });
        }
        if (data.error === 1) {
            return res.status(200).json({ 
                estatus: false,
                mensaje: data.mensaje
            });
        }
        // Genera token
        data.pass = ':)';
        const token = Methods.getJwtToken(data);
        // Cliente no activado
        if (data.estatus === 'I') {
            // Envia correo para verificar cuenta
            await Methods.sendMailUserVerifyAccount(data);
            return res.status(200).json({ 
                estatus: true,
                activo: false,
                mensaje: 'Código enviado al email registrado',
                token,
            });
        }
        return res.status(200).json({
            estatus: true,
            activo: true,
            data,
            token,
            mensaje: `Bienvenido ${ data.nombre }`
        });
    } catch (err) {
        console.log('login-error:', err);
        return res.status(200).json({ 
            estatus: false,
            mensaje: '!Error¡ cliente no registrado'
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
        let body = {
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

        const sp = await storeProcedure(body);
        let data = sp[0][0];
        if (!data) {
            return res.status(200).json({ 
                estatus: false,
                mensaje: 'Cliente no registrado'
            });
        }
        data.pass = ':)';
        const token = Methods.getJwtToken(data);
        // Cliente no activado
        if (data.estatus === 'I') {
            // Envia correo para verificar cuenta
            await Methods.sendMailUserVerifyAccount(data);
            return res.status(200).json({ 
                estatus: true,
                activo: false,
                mensaje: 'Código enviado al email registrado',
                token,
            });
        }
        return res.status(200).json({
            estatus: true,
            token,
            activo: true,
            mensaje: 'Cliente registrado correctamente'
        });
    } catch (err) {
        console.log('registro-err:', err);
        return res.status(200).json({ 
            status: false,
            mensaje: '!Error¡ al registrar cliente'
        });
    }
}

// Actualizar la contraseña del cliente
export async function cambiarPass(req: any, res: Response): Promise<Response> {  
    try {
        const { id } = req.usuario;
        const { pass } = req.body;
        const body = {
            storeProcedure: 'sp_cambiar_pass_cliente',
            vid: id,
            vpass: bcrypt.hashSync( pass, 10),
        };
        const sp = await storeProcedure(body);
        const data = sp[0][0];
        if (!data) {
            return res.status(200).json({ 
                estatus: false,
                mensaje: 'Cliente no encontrado'
            });
        }
        data.pass = ':)'
        // Genera token
        const token = Methods.getJwtToken(data)
        return res.status(200).json({
            estatus: true,
            data,
            token,
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
        const { id } = req.usuario;
        const { codigo } = req.body;
        const body = {
            storeProcedure: 'activar',
            vid: id,
            vcodigo: codigo,
        };
        const sp = await storeProcedure(body);
        const data = sp[0][0];
        if (!data) {
            return res.status(200).json({ 
                estatus: false,
                mensaje: 'Cliente no encontrado'
            });
        }
        if (data.error === 1) {
            return res.status(200).json({ 
                estatus: false,
                mensaje: data.mensaje
            })
        }
        data.pass = ':)';
        // Genera token
        const token = Methods.getJwtToken(data)
        return res.status(200).json({
            estatus: true,
            data,
            token,
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
        const { id } = req.usuario;
        const body = {
            storeProcedure: 'perfil',
            vid: id
        }; 
        const sp = await storeProcedure(body);
        let data = sp[0][0];
        if (!data) {
            return res.status(200).json({ 
                estatus: false,
                mensaje: 'Cliente no encontrado'
            });
        }
        data.pass = ':)';
        return res.status(200).json({
            estatus: true,
            data
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
        const { id } = req.usuario;
        const { 
            nombre, 
            apellido_pat, 
            genero, 
            fecha_nac,
            tel,
            foto,
            id_direccion,
            calle,
            numero_ext,
            numero_int,
            colonia,
            cp,
            id_estado,
            id_municipio,
            latitud,
            longitud,
            tipo_cliente
        } = req.body;
        const body = {
            storeProcedure: 'sp_actualizar_cliente',
            vid: id,
            vnombre: nombre,
            vapellido_pat: apellido_pat,
            vgenero: genero,
            vfecha_nac: fecha_nac,
            vtel: tel,
            vfoto: foto,
            vid_direccion: id_direccion,
            vcalle: calle,
            vnumero_ext: numero_ext,
            vnumero_int: numero_int,
            vcolonia: colonia,
            vcp: cp,
            vid_estado: id_estado,
            vid_municipio: id_municipio,
            vlatitud: latitud,
            vlongitud: longitud,
            vtipo_cliente: tipo_cliente,
        };         
        const sp = await storeProcedure(body);
        let data = sp[0][0];
        if (!data) {
            return res.status(200).json({ 
                estatus: false,
                mensaje: 'Cliente no encontrado'
            });
        }
        data.pass = ':)';
        const token = Methods.getJwtToken(data)
        return res.status(200).json({
            estatus: true,
            data,
            token,
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
        const { mail } = req.body;
        const body = {
            storeProcedure: 'login',
            vmail: mail
        };
        const sp = await storeProcedure(body);
        const data = sp[0][0];
        // No existe email
        if (!data) {
            return res.status(200).json({ 
                estatus: false,
                mensaje: 'Cliente no registrado'
            });
        }
        
        // Envia correo para verificar cuenta
        await Methods.sendMailUserVerifyAccount(data);
        return res.status(200).json({ 
            estatus: true,
            mensaje: 'Código enviado al correo registrado'
        });
    } catch (err) {
        console.log('codigoMail-error:', err);
        return res.status(200).json({ 
            estatus: false,
            mensaje: '!Error¡ cliente no registrado'
        });
    }
}

// Genera una contraseña al azar y lo envia por email
export async function cambiarPassMail(req: Request, res: Response): Promise<Response> {
    try {
        const { mail } = req.body;
        // Se crea una nueva contraseña y se actualiza
        const newPassword = await Methods.newPassword();
        const body = {
            storeProcedure: 'sp_cambiar_pass_cliente_mail',
            vmail: mail,
            vpass: bcrypt.hashSync( newPassword, 10),
        };
        const sp = await storeProcedure(body);
        const data = sp[0][0];
        // No existe email
        if (!data) {
            return res.status(200).json({ 
                estatus: false,
                mensaje: 'Cliente no registrado'
            });
        }

        const context = {
            email: mail,
            password: newPassword
        }
        // Envia Correo para recuperar contraseña
        await Methods.sendMailUserUpdatePassword(context);
        return res.status(200).json({
            estatus: true,
            mensaje: 'Contraseña enviada al correo registrado'
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
        const cliente = req.usuario;
        return res.status(200).json({
            estatus: true,
            cliente
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
            estatus: false,
            mensaje: error
        })
    }

}
