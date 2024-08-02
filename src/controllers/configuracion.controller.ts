import { Request, Response } from 'express';
import { storeProcedure } from '../classes/database';
import Methods from '../classes/methods';
import Server from '../classes/server';

// Actualizar configuracion
export async function actualizar(req: any, res: Response): Promise<Response> {
    try {
        let data = {
            storeProcedure: 'sp_actualizar_configuraciones',
            vopenpay_activo: req.body.openpay_activo,
            vpaypal_activo: req.body.paypal_activo,
            vpruebas: req.body.pruebas,
            vopenpay_llave_prod_pub: req.body.openpay_llave_prod_pub,
            vopenpay_llave_prod_pri: req.body.openpay_llave_prod_pri,
            vopenpay_llave_prue_pub: req.body.openpay_llave_prue_pub,
            vopenpay_llave_prue_pri: req.body.openpay_llave_prue_pri,
            vopenpay_id_comercio: req.body.openpay_id_comercio,
            vpaypal_llave_prod_pub: req.body.paypal_llave_prod_pub,
            vpaypal_llave_prod_pri: req.body.paypal_llave_prod_pri,
            vpaypal_llave_prue_pub: req.body.paypal_llave_prue_pub,
            vpaypal_llave_prue_pri: req.body.paypal_llave_prue_pri,
            vpaypal_id_comercio: req.body.paypal_id_comercio,
            vusuario_modif: req.body.usuario_modif,
            vimagen_home: req.body.imagen_home,
            vtexto_home: req.body.texto_home,
            vaviso_privacidad: req.body.aviso_privacidad,
            vterminos_y_condiciones: req.body.terminos_y_condiciones,
            vlogo: req.body.logo,
            vcolor_fondo: req.body.color_fondo,
            vcolor_texto: req.body.color_texto,
            vid_tipografia: req.body.id_tipografia,
            vcolor_botones: req.body.color_botones,
            vcolor_texto_botones: req.body.color_texto_botones,
            vmaster_mail: req.body.master_mail,
            vmaster_mail_pass: req.body.master_mail_pass,
            vimagen_login: req.body.imagen_login,
            vfavicon: req.body.favicon,
            vservidor: req.body.servidor,
            vpuerto: req.body.puerto,
            vcomercio: req.body.comercio
        };

        // Guardar imagenes
        if (req.files) {
            const files = req.files;

            const logo = await Methods.fileUpload('configuraciones', files.logo_file);
            if (logo.estatus) {
                data.vlogo = logo.ruta;
            }

            const imagen_home = await Methods.fileUpload('configuraciones', files.imagen_home_file);
            if (imagen_home.estatus) {
                data.vimagen_home = imagen_home.ruta;
            }

            const imagen_login = await Methods.fileUpload('configuraciones', files.imagen_login_file);
            if (imagen_login.estatus) {
                data.vimagen_login = imagen_login.ruta;
            }
            
            const favicon = await Methods.fileUpload('configuraciones', files.favicon_file);
            if (favicon.estatus) {
                data.vfavicon = favicon.ruta;
            }
        }

        const sp = await storeProcedure(data);
        let dataDB = sp[0][0];
        if (!dataDB) {
            return res.status(200).json({ 
                estatus: false,
                mensaje: 'Configuracion no encontrada en el sistema'
            });
        }
        const configuracion = {
            estatus: true,
            data: dataDB,
            mensaje: 'Configuracion actualizada correctamente'
        };
        // enviar configuracion home, openpay y paypal por SOCKET
        // Sockets
        const server = Server.instance;
        const { home } = await homeDB();
        const { openpay } = await openpayDB();
        const { paypal } = await paypalDB();
        const { terminos } = await terminosDB();
        const { aviso } = await avisoDB();
        const payloadHome = {
            estatus: true,
            data: home,
            mensaje: 'Configuracion actualizada'
        };
        const payloadOpenpay = {
            estatus: true,
            data: openpay,
            mensaje: 'Configuracion actualizada'
        };
        const payloadPaypal = {
            estatus: true,
            data: paypal,
            mensaje: 'Configuracion actualizada'
        };
        const payloadTerminos = {
            estatus: true,
            terminos: terminos,
            mensaje: 'Configuracion actualizada'
        };
        const payloadAviso = {
            estatus: true,
            aviso: aviso,
            mensaje: 'Configuracion actualizada'
        };
        server.io.emit('configuracion-home', payloadHome);
        server.io.emit('configuracion-openpay', payloadOpenpay);
        server.io.emit('configuracion-paypal', payloadPaypal);
        server.io.emit('configuracion-terminos', payloadTerminos);
        server.io.emit('configuracion-aviso', payloadAviso);
        
        return res.status(200).json(configuracion);
    } catch (err) {
        console.log('actualizar-error:', err);
        return res.status(400).json({ 
            estatus: false,
            mensaje: 'Error al actualizar configuracion'
        });
    }
}

// Obtener configuracion
export async function obtener(req: Request, res: Response): Promise<Response> {
    try {
        const data = {
            storeProcedure: 'sp_obtener_configuracion'
        }; 
        const sp = await storeProcedure(data);
        let dataDB = sp[0][0];
        if (!dataDB) {
            return res.status(200).json({ 
                estatus: false,
                mensaje: 'Configuracion no encontrada en el sistema'
            });
        }
        return res.status(200).json({
            estatus: true,
            data: dataDB
        });
    } catch (err) {
        console.log('obtener-error:', err);
        return res.status(400).json({ 
            estatus: false,
            mensaje: 'Error configuracion no encontrado'
        });
    }
}

// Obtener configuracion home
export async function home(req: Request, res: Response): Promise<Response> {
    try {
        const configDB = await homeDB();
        // Configuracion en la base de datos no existe
        if (!configDB.estatus) {
            return res.status(200).json({ 
                estatus: false,
                mensaje: configDB.mensaje
            });
        }
        return res.status(200).json({
            estatus: true,
            data: configDB.home
        });
    } catch (err) {
        console.log('obtener-error:', err);
        return res.status(200).json({ 
            estatus: false,
            mensaje: '!Error¡ configuracion no encontrado'
        });
    }
}

// Obtener configuracion openpay
export async function openpay(req: Request, res: Response): Promise<Response> {
    try {
        const configDB = await openpayDB();
        // Configuracion en la base de datos no existe
        if (!configDB.estatus) {
            return res.status(200).json({ 
                estatus: false,
                mensaje: configDB.mensaje
            });
        }
        return res.status(200).json({
            estatus: true,
            data: configDB.openpay
        });
    } catch (err) {
        console.log('obtener-error:', err);
        return res.status(200).json({ 
            estatus: false,
            mensaje: '!Error¡ configuracion no encontrado'
        });
    }
}

// Obtener configuracion paypal
export async function paypal(req: Request, res: Response): Promise<Response> {
    try {
        const configDB = await paypalDB();
        // Configuracion en la base de datos no existe
        if (!configDB.estatus) {
            return res.status(200).json({ 
                estatus: false,
                mensaje: configDB.mensaje
            });
        }
        return res.status(200).json({
            estatus: true,
            data: configDB.paypal
        });
    } catch (err) {
        console.log('obtener-error:', err);
        return res.status(200).json({ 
            estatus: false,
            mensaje: '!Error¡ configuracion no encontrado'
        });
    }
}

// Obtener configuracion (redes sociales, aviso de privacidad y terminos y condiciones)
export async function footer(req: Request, res: Response): Promise<Response> {
    try {
        const configTerminosDB = await terminosDB();
        const configAvisoDB = await avisoDB();
        const configRedesDB = await listaRedesHomeDB();
        return res.status(200).json({
            estatus: true,
            terminos: configTerminosDB.terminos,
            aviso: configAvisoDB.aviso,
            redes: configRedesDB.redes
        });
    } catch (err) {
        console.log('footer-error:', err);
        return res.status(200).json({ 
            estatus: false,
            mensaje: '!Error¡ configuracion no encontrada'
        });
    }
}

// Obtener configuracion faqs
export async function faqs(req: Request, res: Response): Promise<Response> {
    try {
        const configDB = await faqsDB();
        // Configuracion en la base de datos no existe
        if (!configDB.estatus) {
            return res.status(200).json({ 
                estatus: false,
                mensaje: configDB.mensaje
            });
        }
        return res.status(200).json({
            estatus: true,
            data: configDB.faqs
        });
    } catch (err) {
        console.log('obtener-error:', err);
        return res.status(200).json({ 
            estatus: false,
            mensaje: '!Error¡ faqs no encontradas'
        });
    }
}

// Obtener configuracion tienda online
export async function tiendaOnline(req: Request, res: Response): Promise<Response> {
    try {
        const configDB = await tiendaOnlineDB();
        // Configuracion en la base de datos no existe
        if (!configDB.estatus) {
            return res.status(200).json({ 
                estatus: false,
                mensaje: configDB.mensaje
            });
        }
        return res.status(200).json({
            estatus: true,
            data: configDB.tiendaOnline
        });
    } catch (err) {
        console.log('obtener-error:', err);
        return res.status(200).json({ 
            estatus: false,
            mensaje: '!Error¡ tienda online no encontrada'
        });
    }
}

// Obtener configuracion sitio web
export async function sitioWeb(req: Request, res: Response): Promise<Response> {
    try {
        const configDB = await sitioWebDB();
        // Configuracion en la base de datos no existe
        if (!configDB.estatus) {
            return res.status(200).json({ 
                estatus: false,
                mensaje: configDB.mensaje
            });
        }
        return res.status(200).json({
            estatus: true,
            data: configDB.sitioWeb
        });
    } catch (err) {
        console.log('obtener-error:', err);
        return res.status(200).json({ 
            estatus: false,
            mensaje: '!Error¡ sitio web no encontrado'
        });
    }
}

// Obtener configuracion terminos y condiciones
export async function terminosYCondiciones(req: Request, res: Response): Promise<Response> {
    try {
        const configDB = await terminosYCondicionesDB();
        // Configuracion en la base de datos no existe
        if (!configDB.estatus) {
            return res.status(200).json({ 
                estatus: false,
                mensaje: configDB.mensaje
            });
        }
        return res.status(200).json({
            estatus: true,
            data: configDB.terminos
        });
    } catch (err) {
        console.log('obtener-error:', err);
        return res.status(200).json({ 
            estatus: false,
            mensaje: '!Error¡ terminos y condiciones no encontrada'
        });
    }
}

// Obtener configuracion contacto
export async function contacto(req: Request, res: Response): Promise<Response> {
    try {
        const configDB = await contactoDB();
        // Configuracion en la base de datos no existe
        if (!configDB.estatus) {
            return res.status(200).json({ 
                estatus: false,
                mensaje: configDB.mensaje
            });
        }
        return res.status(200).json({
            estatus: true,
            data: configDB.contacto
        });
    } catch (err) {
        console.log('obtener-error:', err);
        return res.status(200).json({ 
            estatus: false,
            mensaje: '!Error¡ contacto no encontrado'
        });
    }
}

// Obtener configuracion contacto
export async function quienesSomos(req: Request, res: Response): Promise<Response> {
    try {
        const configDB = await quienesSomosDB();
        // Configuracion en la base de datos no existe
        if (!configDB.estatus) {
            return res.status(200).json({ 
                estatus: false,
                mensaje: configDB.mensaje
            });
        }
        return res.status(200).json({
            estatus: true,
            data: configDB.quienesSomos
        });
    } catch (err) {
        console.log('obtener-error:', err);
        return res.status(200).json({ 
            estatus: false,
            mensaje: '!Error¡ contacto no encontrado'
        });
    }
}




// Metodo para obtener configuracion de base de datos
async function homeDB() : Promise<any> {
    return new Promise( async (resolve) => {
        try {
            const data = {
                storeProcedure: 'sp_obtener_configuracion_home'
            }; 
            const sp = await storeProcedure(data);
            let dataDB = sp[0][0];
            if (!dataDB) {
                return resolve({ 
                    estatus: false,
                    mensaje: 'Configuracion no encontrada en el sistema'
                });
            }
            return resolve({ 
                estatus: true,
                home: dataDB
            });
        } catch (err) {
            return resolve({ 
                estatus: false,
                mensaje: '!Error¡ configuracion no encontrada'
            });
        }
    });
}

// Metodo para obtener configuracion openpay de base de datos
async function openpayDB() : Promise<any> {
    return new Promise( async (resolve) => {
        try {
            const data = {
                storeProcedure: 'sp_obtener_datos_open_pay'
            }; 
            const sp = await storeProcedure(data);
            let dataDB = sp[0][0];
            if (!dataDB) {
                return resolve({ 
                    estatus: false,
                    mensaje: 'Configuracion no encontrada en el sistema'
                });
            }
            return resolve({ 
                estatus: true,
                openpay: dataDB
            });
        } catch (err) {
            return resolve({ 
                estatus: false,
                mensaje: '!Error¡ configuracion no encontrada'
            });
        }
    });
}

// Metodo para obtener configuracion paypal de base de datos
async function paypalDB() : Promise<any> {
    return new Promise( async (resolve) => {
        try {
            const data = {
                storeProcedure: 'sp_obtener_datos_paypal'
            }; 
            const sp = await storeProcedure(data);
            let dataDB = sp[0][0];
            if (!dataDB) {
                return resolve({ 
                    estatus: false,
                    mensaje: 'Configuracion no encontrada en el sistema'
                });
            }
            return resolve({ 
                estatus: true,
                paypal: dataDB
            });
        } catch (err) {
            return resolve({ 
                estatus: false,
                mensaje: '!Error¡ configuracion no encontrada'
            });
        }
    });
}

// Metodo para obtener configuracion (terminos y condiciones) de base de datos
async function terminosDB() : Promise<any> {
    return new Promise( async (resolve) => {
        try {
            const dataTerminos = {
                storeProcedure: 'sp_terminos_y_condiciones'
            };
            
            const spTerminos = await storeProcedure(dataTerminos);
            let dataTerminoDB = spTerminos[0][0];
            return resolve({ 
                estatus: true,
                terminos: dataTerminoDB
            });
        } catch (err) {
            return resolve({ 
                estatus: false,
                mensaje: '!Error¡ configuracion no encontrada'
            });
        }
    });
}

// Metodo para obtener configuracion (aviso de privacidad) de base de datos
async function avisoDB() : Promise<any> {
    return new Promise( async (resolve) => {
        try {
            const dataAviso = {
                storeProcedure: 'sp_aviso_privacidad'
            };
            
            const spAviso = await storeProcedure(dataAviso);
            let dataAvisoDB = spAviso[0][0];
            return resolve({ 
                estatus: true,
                aviso: dataAvisoDB
            });
        } catch (err) {
            return resolve({ 
                estatus: false,
                mensaje: '!Error¡ configuracion no encontrada'
            });
        }
    });
}

// Metodo para obtener configuracion (redes sociales) de base de datos
async function listaRedesHomeDB() : Promise<any> {
    return new Promise( async (resolve) => {
        try {
            const dataRedes = {
                storeProcedure: 'sp_lista_redes_sociales_home'
            }; 
            const spRedes = await storeProcedure(dataRedes);
            let dataRedesDB = spRedes[0] || [];
            return resolve({ 
                estatus: true,
                redes: dataRedesDB
            });
        } catch (err) {
            return resolve({ 
                estatus: false,
                mensaje: '!Error¡ configuracion no encontrada'
            });
        }
    });
}

// Metodo para obtener la lista de faqs de base de datos
async function faqsDB() : Promise<any> {
    return new Promise( async (resolve) => {
        try {
            const data = {
                storeProcedure: 'faq'
            }; 
            const sp = await storeProcedure(data);
            let dataDB = sp[0];
            console.log('sp', sp);
            
            if (!dataDB) {
                return resolve({ 
                    estatus: false,
                    mensaje: 'Faqs no encontradas en el sistema'
                });
            }
            return resolve({ 
                estatus: true,
                faqs: dataDB
            });
        } catch (err) {
            return resolve({ 
                estatus: false,
                mensaje: '!Error¡ faqs no encontradas'
            });
        }
    });
}

// Metodo para obtener tienda online de base de datos
async function tiendaOnlineDB() : Promise<any> {
    return new Promise( async (resolve) => {
        try {
            const data = {
                storeProcedure: 'sp_obtener_tienda_online'
            }; 
            const sp = await storeProcedure(data);
            let dataDB = sp[0][0];
            if (!dataDB) {
                return resolve({ 
                    estatus: false,
                    mensaje: 'Tienda online no encontradas en el sistema'
                });
            }
            return resolve({ 
                estatus: true,
                tiendaOnline: dataDB
            });
        } catch (err) {
            return resolve({ 
                estatus: false,
                mensaje: '!Error¡ tienda online no encontrada'
            });
        }
    });
}

// Metodo para obtener sitio web de base de datos
async function sitioWebDB() : Promise<any> {
    return new Promise( async (resolve) => {
        try {
            const data = {
                storeProcedure: 'web'
            }; 
            const sp = await storeProcedure(data);
            let dataDB = sp[0][0];
            if (!dataDB) {
                return resolve({ 
                    estatus: false,
                    mensaje: 'Sitio web no encontradas en el sistema'
                });
            }
            return resolve({ 
                estatus: true,
                sitioWeb: dataDB
            });
        } catch (err) {
            return resolve({ 
                estatus: false,
                mensaje: '!Error¡ sitio web no encontrada'
            });
        }
    });
}

// Metodo para obtener terminos y condiciones de base de datos
async function terminosYCondicionesDB() : Promise<any> {
    return new Promise( async (resolve) => {
        try {
            const data = {
                storeProcedure: 'terminos_condiciones'
            }; 
            const sp = await storeProcedure(data);
            let dataDB = sp[0][0];
            if (!dataDB) {
                return resolve({ 
                    estatus: false,
                    mensaje: 'Terminos y condiciones no encontrada en el sistema'
                });
            }
            return resolve({ 
                estatus: true,
                terminos: dataDB
            });
        } catch (err) {
            return resolve({ 
                estatus: false,
                mensaje: '!Error¡ terminos y condiciones no encontrada'
            });
        }
    });
}

// Metodo para obtener contacto de base de datos
async function contactoDB() : Promise<any> {
    return new Promise( async (resolve) => {
        try {
            const data = {
                storeProcedure: 'mail_contacto'
            }; 
            const sp = await storeProcedure(data);
            let dataDB = sp[0][0];
            if (!dataDB) {
                return resolve({ 
                    estatus: false,
                    mensaje: 'Contacto no encontrado en el sistema'
                });
            }
            return resolve({ 
                estatus: true,
                contacto: dataDB
            });
        } catch (err) {
            return resolve({ 
                estatus: false,
                mensaje: '!Error¡ contacto no encontrado'
            });
        }
    });
}

// Metodo para obtener quienes somos de base de datos
async function quienesSomosDB() : Promise<any> {
    return new Promise( async (resolve) => {
        try {
            const data = {
                storeProcedure: 'quienes_somos'
            }; 
            const sp = await storeProcedure(data);
            let dataDB = sp[0][0];
            if (!dataDB) {
                return resolve({ 
                    estatus: false,
                    mensaje: 'Quienes somos no encontrado en el sistema'
                });
            }
            return resolve({ 
                estatus: true,
                quienesSomos: dataDB
            });
        } catch (err) {
            return resolve({ 
                estatus: false,
                mensaje: '!Error¡ quienes somos no encontrado'
            });
        }
    });
}