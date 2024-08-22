import jwt, { decode } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
const bearer = require('token-extractor');
import nodemailer from 'nodemailer';
import path from 'path';
import googleMaps  from '@google/maps';
import Configurations from '../config/config';
import { storeProcedure } from '../classes/database';
const config = new Configurations();
//Maps
const apiKeyMaps = config.getMapsApi() || '';
const googleMapsClient = googleMaps.createClient({
    key: apiKeyMaps,
    Promise: Promise
});

export default class Methods {
    private static seed = config.getSeed() || '';
    private static caducidad = '30d';

    static getJwtToken( payload: any ) : string {
        return jwt.sign({ usuario: payload }, this.seed, { expiresIn: this.caducidad });
    }

    static comparePassword({ paswordDB = '', password = '' }) : boolean {
        if (bcrypt.compareSync(password, paswordDB)) {
            return true;
        }
        return false;
    }

    static verifyToken( token: string ) : Promise<any> {
        return new Promise((resolve, reject) => {
            jwt.verify(token, this.seed, async(err, decoded) =>{
                if (err) {
                    if( err.name === 'TokenExpiredError' ) {
                        console.log('Token expirado...');
                        const payload = await Methods.verifyTokenExpiration(token);
                        return resolve(payload);
                    }
                    return reject(err);
                }
                return resolve(decoded);
            });
        });
    }

    static verifyTokenExpiration( token: string ): Promise<any> {
        return new Promise((resolve, reject) => {
            jwt.verify(token, this.seed, { ignoreExpiration: true } , (err, decoded) =>{
                if (err) {
                    return reject(err);
                }
                return resolve(decoded);
            });
        });
    }

    static extractToken( req: any ) : Promise<any> {
        return new Promise((resolve, reject) => {
            bearer( req, ( err: any, token: any ) => {
                if ( err ) return reject(err);
                return resolve(token);
            });
        });
    }

    static newPassword() : Promise<string> {
        const length: number = 8;
        let password: string = '';
        return new Promise( ( resolve, reject ) => {
            password = Math.round( ( Math.pow( 36, length + 1 ) - Math.random() * Math.pow( 36, length ) ) ).toString( 36 ).slice( 1 );
            return resolve(password);
        });
    }

    static sendMailUserUpdatePassword(context: any): Promise<string> {
        return new Promise(async (resolve, reject) => {
            try {
                const { emailConfig } = await Methods.configuracion();
                let transporter = nodemailer.createTransport(emailConfig);
                
                const mailOptions = {
                    from: `PINPETS ${emailConfig.auth.user}`,
                    to: context.email,
                    subject: 'Solicitud de recuperación de contraseña.',
                    html: await this.templateUpdatePassword(context)
                }
            
                transporter.sendMail(mailOptions, function (err, info) {
                    
                    if (err) {
                        console.log(err);
                        
                        return reject('No se pudo enviar la contraseña');
                        //return reject(err.message);
                    }
                    return resolve('Contraseña enviada al correo registrado');
                })
            } catch (error) {
                return reject(error)
            }

        });
    }

    static templateUpdatePassword(context: any): Promise<string> {
        return new Promise((resolve) => {
            return resolve(`
            <!DOCTYPE html>
            <html>
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                    <!-- Styles -->
                    <style type="text/css" rel="stylesheet" media="all">

                        .justify-content-center {
                            justify-content: center !important;
                        }

                        .row {
                            display: flex;
                            flex-wrap: wrap;
                            margin-right: -15px;
                            margin-left: -15px;
                        }

                        .col-md-8 {
                            flex: 0 0 66.6666666667%;
                            max-width: 66.6666666667%;
                        }

                        .col-md-8 {
                            position: relative;
                            width: 100%;
                            padding-right: 15px;
                            padding-left: 15px;
                        }

                        .card {
                            position: relative;
                            display: flex;
                            flex-direction: column;
                            min-width: 0;
                            word-wrap: break-word;
                            background-color: #fff;
                            background-clip: border-box;
                            border: 1px solid rgba(0, 0, 0, 0.125);
                            border-radius: 0.25rem;
                        }

                        .card-header:first-child {
                            border-radius: calc(0.25rem - 1px) calc(0.25rem - 1px) 0 0;
                        }

                        .card-header {
                            padding: 0.75rem 1.25rem;
                            margin-bottom: 0;
                            color: inherit;
                            background-color: rgba(0, 0, 0, 0.03);
                            border-bottom: 1px solid rgba(0, 0, 0, 0.125);
                        }

                        .card-body {
                            flex: 1 1 auto;
                            padding: 1.25rem;
                        }

                        .center {
                            text-align: center;
                        }

                        .table {
                            width: 100%;
                            max-width: 100%;
                            margin-bottom: 1rem;
                            background-color: transparent;
                            border-collapse: collapse;
                            display: table;
                            border-spacing: 2px;
                            border-color: grey;
                        }

                        thead {
                            display: table-header-group;
                            vertical-align: middle;
                            border-color: inherit;
                        }

                        tr {
                            display: table-row;
                            vertical-align: inherit;
                            border-color: inherit;
                        }

                        .table thead th {
                            vertical-align: bottom;
                            border-bottom: 2px solid #dee2e6;
                        }

                        .table td, .table th {
                            padding: .75rem;
                            border-top: 1px solid #dee2e6;
                        }

                        th {
                            text-align: inherit;
                            font-weight: bold;
                        }

                        tbody {
                            display: table-row-group;
                            vertical-align: middle;
                            border-color: inherit;
                        }

                        tbody tr {
                            display: table-row;
                            vertical-align: inherit;
                            border-color: inherit;
                        }


                    </style>

                </head>
                <body>
                    <div id="app">
                        <div class="container">
                            <div class="row justify-content-center">
                                <div class="col-md-8">
                                    <div class="card">
                                        <div class="card-body">
                                            
                                            <div class="col">
                                                <h3><strong>Pinpets</strong></h3>
                                            </div>

                                            <div class="col">
                                                <p>Recibimos una solicitud para restablecer tu contraseña. Tu nueva contraseña es: ${context.password}</p>
                                            </div>
                                            
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </body>
            </html>
            `);
        });
    }

    static sendMailUserVerifyAccount(context: any): Promise<string> {
        return new Promise(async (resolve, reject) => {
            try {
                /* const { emailConfig } = await Methods.configuracion(); */
                const emailConfig = config.getEmail();
                console.log('emailConfig', emailConfig);
                console.log('context', context);
                
                let transporter = nodemailer.createTransport(emailConfig);
                const mailOptions = {
                    from: `PINPETS ${emailConfig.auth.user}`,
                    to: context.mail,
                    subject: 'Verifica tu cuenta.',
                    html: await this.templateVerifyAccount(context)
                }
                transporter.sendMail(mailOptions, function (err, info) {
                    if (err) {
                        console.log(err);
                        return reject('No se pudo enviar la contraseña');
                    }
                    return resolve('Contraseña enviada al correo registrado');
                })
            } catch (error) {
                return reject(error)
            }

        });
    }

    static templateVerifyAccount(context: any): Promise<string> {
        return new Promise((resolve) => {
            return resolve(`
            <!DOCTYPE html>
            <html>
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                    <!-- Styles -->
                    <style type="text/css" rel="stylesheet" media="all">
                        .blue {
                            color: #0000FF;
                            font-weight: bold;
                            font-size: 30px;
                        }
                        .justify-content-center {
                            justify-content: center !important;
                        }
                        .row {
                            display: flex;
                            flex-wrap: wrap;
                            margin-right: -15px;
                            margin-left: -15px;
                        }
                        .col-md-8 {
                            flex: 0 0 66.6666666667%;
                            max-width: 66.6666666667%;
                        }
                        .col-md-8 {
                            position: relative;
                            width: 100%;
                            padding-right: 15px;
                            padding-left: 15px;
                        }
                        .card {
                            position: relative;
                            display: flex;
                            flex-direction: column;
                            min-width: 0;
                            word-wrap: break-word;
                            background-color: #fff;
                            background-clip: border-box;
                            border: 1px solid rgba(0, 0, 0, 0.125);
                            border-radius: 0.25rem;
                        }
                        .card-header:first-child {
                            border-radius: calc(0.25rem - 1px) calc(0.25rem - 1px) 0 0;
                        }
                        .card-header {
                            padding: 0.75rem 1.25rem;
                            margin-bottom: 0;
                            color: inherit;
                            background-color: rgba(0, 0, 0, 0.03);
                            border-bottom: 1px solid rgba(0, 0, 0, 0.125);
                        }
                        .card-body {
                            flex: 1 1 auto;
                            padding: 1.25rem;
                        }
                        .center {
                            text-align: center;
                        }
                        .table {
                            width: 100%;
                            max-width: 100%;
                            margin-bottom: 1rem;
                            background-color: transparent;
                            border-collapse: collapse;
                            display: table;
                            border-spacing: 2px;
                            border-color: grey;
                        }
                        thead {
                            display: table-header-group;
                            vertical-align: middle;
                            border-color: inherit;
                        }
                        tr {
                            display: table-row;
                            vertical-align: inherit;
                            border-color: inherit;
                        }
                        .table thead th {
                            vertical-align: bottom;
                            border-bottom: 2px solid #dee2e6;
                        }
                        .table td, .table th {
                            padding: .75rem;
                            border-top: 1px solid #dee2e6;
                        }
                        th {
                            text-align: inherit;
                            font-weight: bold;
                        }
                        tbody {
                            display: table-row-group;
                            vertical-align: middle;
                            border-color: inherit;
                        }
                        tbody tr {
                            display: table-row;
                            vertical-align: inherit;
                            border-color: inherit;
                        }
                    </style>

                </head>
                <body>
                    <div id="app">
                        <div class="container">
                            <div class="row justify-content-center">
                                <div class="col-md-8">
                                    <div class="card">
                                        <div class="card-body">
                                            <div class="col">
                                                <h3 class="blue"><strong>Hola ${context.nombre} ${context.apellido_pat}</strong></h3>
                                            </div>
                                            <div class="col">
                                                <p>Verifica tu cuenta con este código para tener acceso a todas sus funcionalidades de Pinpets</p>
                                                <h3 class="blue"><strong>${context.codigo}</strong></h3>
                                                <p>Gracias</p>
                                                <p>Aviso: Si tú no hiciste está solicitud, es probable que alguien lo haya hecho por error</p>
                                                <p>No te preocupes, tu cuenta se mantendrá segura</p>
                                                <p>www.pinpets.org</p>
                                            </div>
                                            
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </body>
            </html>
            `);
        });
    }

    static fileUpload(folder: string, file: any): Promise<any> {
        return new Promise<any>(async (resolve) => {
            try {
                // Validar que exista un archivo
                if (!file) {
                    return resolve({
                        estatus: false,
                        ruta: '',
                        mensaje: 'No hay ningún archivo'
                    });
                }
                // Procesar la imagen...
                const nombreCortado = file.name.split('.');
                const imagen = nombreCortado[0];
                const extensionArchivo = nombreCortado[ nombreCortado.length - 1 ];
                // Validar extension
                const extensionesValidas = [ 'png', 'jpg', 'jpeg', 'gif', 'svg', 'ico'];
                if ( !extensionesValidas.includes( extensionArchivo ) ) {
                    return resolve({
                        estatus: false,
                        ruta: '',
                        mensaje: 'No es una extensión permitida'
                    });
                }
                const newPath = `${ folder }/${ Date.now() }.${ extensionArchivo }`;
                // Path para guardar la imagen
                const pathImg = path.join( __dirname, `../public/${ newPath }` );
                // Mover la imagen
                file.mv( pathImg , (err: any) => {
                    if (err) {
                        return resolve({
                            estatus: false,
                            ruta: '',
                            mensaje: 'Error imagen no subida'
                        });
                    }
            
                    return resolve({
                        estatus: true,
                        ruta: newPath,
                        mensaje: 'Imagen subida'
                    });
                });
            } catch (error) {
                return resolve({
                    estatus: false,
                    ruta: '',
                    mensaje: 'Error imagen no subida'
                });
            }
        });
    }

    static async getGoogleMapsGeometry(address: any): Promise<any> {
        return new Promise(async(resolve) => {
            try {
                googleMapsClient.geocode({ address }).asPromise()
                .then((response: any) => {
                    const result = response.json.results[0];
                    if (!result) {
                        return resolve({
                            estatus: false,
                            mensaje: 'No se pudo localizar su dirección con los servicios de google, favor de verificar su dirección.'
                        }) 
                    }
                    const geometry = result.geometry;
                    if (!geometry) {
                        return resolve({
                            estatus: false,
                            mensaje: 'No se pudo localizar su dirección con los servicios de google, favor de verificar su dirección.'
                        })
                    }
                    return resolve({
                        estatus: true,
                        data: geometry
                    })
                })
                .catch((err: any) => {
                    return resolve({
                        estatus: false,
                        mensaje: err
                    })
                });
            } catch (error) {
                return resolve({
                    estatus: false,
                    mensaje: error
                })
            }
        })
    }

    static async configuracion(): Promise<any> {
        try {
            let emailConfig = null;
            const data = {
                storeProcedure: 'sp_obtener_configuracion'
            }; 
            const sp = await storeProcedure(data);
            let dataDB = sp[0][0];
            if (!dataDB) {
                return { 
                    estatus: false,
                    mensaje: 'Configuracion no encontrada en el sistema'
                };
            }

            if (dataDB.servidor === 'hotmail') {
                emailConfig = {
                    service: dataDB.servidor,
                    auth: {
                        user: dataDB.master_mail,
                        pass: dataDB.master_mail_pass
                    }
                }
            } else if (dataDB.servidor === 'smtp.gmail.com') {
                emailConfig = {
                    host: dataDB.servidor,
                    port: dataDB.puerto,
                    secure: true,
                    auth: {
                        user: dataDB.master_mail,
                        pass: dataDB.master_mail_pass
                    }
                }
            } else if (dataDB.servidor === 'smtp-mail.outlook.com') {
                emailConfig = {
                    host: dataDB.servidor,
                    secureConnection: false,
                    port: dataDB.puerto,
                    secure: true,
                    tls: {
                        ciphers:'SSLv3'
                     },
                    auth: {
                        user: dataDB.master_mail,
                        pass: dataDB.master_mail_pass
                    }
                }
            } else {
                emailConfig = {
                    host: dataDB.servidor,
                    port: dataDB.puerto,
                    secure: true,
                    auth: {
                        user: dataDB.master_mail,
                        pass: dataDB.master_mail_pass
                    }
                }
            }

            return {
                estatus: true,
                emailConfig: emailConfig
            };
        } catch (err) {
            console.log('obtener-error:', err);
            return { 
                estatus: false,
                mensaje: 'Error configuracion no encontrado'
            };
        }
    }
    
}
