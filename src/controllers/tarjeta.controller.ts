import { Request, Response } from 'express';
import { storeProcedure } from '../classes/database';
import Methods from '../classes/methods';
import Configurations from '../config/config';
const config = new Configurations();

// Metodo para obtener la lista de tarjetas
export async function lista( req: any, res: Response ) : Promise<Response> {
    const data = {
        storeProcedure: 'sp_lista_open_pay_tarjetas',
        vid_cliente: req.usuario.id,
    };
    try {
        const sp = await storeProcedure(data)
        return res.status(200).json({
            estatus: true,
            data: sp[0]
        })
    } catch (err) {
        return res.status(400).json({ 
            estatus: false,
            mensaje: err
        })
    }
}

// Metodo para obtener un cliente
export async function obtener(req: Request, res: Response): Promise<Response> {
    try {
        // Se obtiene el cliente de openpay
        const clienteDB = await obtenerClienteDB( req );
        if (!clienteDB.estatus) {
            return res.status(200).json({ 
                estatus: false,
                code: 0,
                mensaje: clienteDB.mensaje
            })
        }
        // Busca el usuario de openpay 
        const clienteOpenpay = await Methods.getCustomerOpenpay( clienteDB.cliente.id_openpay );
        if (!clienteOpenpay.estatus) {
            return res.status(200).json({ 
                estatus: false,
                code: clienteOpenpay.code,
                mensaje: clienteOpenpay.mensaje
            });
        }
        return res.status(200).json({
            status: true,
            data: clienteDB.cliente
        })
    } catch (err) {
        return res.status(400).json({ 
            estatus: false,
            code: 0,
            mensaje: err
        })
    }

}

// Metodo para crear cliente
export async function crear( req: any, res: Response ) : Promise<any> {
    try {
        const clienteDB = await obtenerDB( req );
        // Cliente en la base de datos no existe
        if (!clienteDB.estatus) {
            return res.status(200).json({ 
                estatus: false,
                code: 0,
                mensaje: clienteDB.mensaje
            });
        }
        // Si ya existe cliente registrado en openpay
        if (clienteDB.cliente.id_openpay) {
            clienteDB.pass = ':)';
            const token = Methods.getJwtToken(clienteDB);
            return res.status(200).json({ 
                estatus: true,
                cliente: clienteDB.cliente,
                token: token,
                mensaje: 'Cliente registrado exitosamente!'
            });
        }
        const customerOpenpay = {
            name: clienteDB.cliente.nombre,
            last_name: `${ clienteDB.cliente.apellido_pat } ${ clienteDB.cliente.apellido_mat }`,
            email: clienteDB.cliente.mail
        };
        // Crea el cliente en openpay 
        const dataCliente = await Methods.createCustomerOpenpay( customerOpenpay );
        if (!dataCliente.estatus) {
            return res.status(200).json({ 
                estatus: false,
                code: dataCliente.code,
                mensaje: dataCliente.mensaje
            });
        }
        // Crea el cliente creado en openpay en base de datos
        await crearClienteDB( req, dataCliente.cliente);
        //
        clienteDB.pass = ':)';
        const token = Methods.getJwtToken(clienteDB)
        return res.status(200).json({ 
            estatus: true,
            cliente: clienteDB.cliente,
            token: token,
            mensaje: 'Cliente registrado exitosamente'
        });
    } catch (err) {
        return res.status(400).json({ 
            estatus: false,
            code: 0,
            mensaje: err
        })
    }
}

// Metodo para registrar tarjeta
export async function crearTarjeta(req: Request, res: Response): Promise<Response> {
    try {
        const cardData = {
            token_id: req.body.token_id,
            device_session_id: req.body.device_session_id
        };
        // Se obtiene el cliente de registrado
        const clienteDB = await obtenerDB( req );
        if (!clienteDB.estatus) {    
            return res.status(200).json({ 
                estatus: false,
                code: 0,
                mensaje: clienteDB.mensaje
            });  
        }
        // Crear la tarjeta del cliente en openpay 
        const dataCard = await Methods.createCardCustomerOpenpay( clienteDB.cliente.id_openpay, cardData );
        if (!dataCard.estatus) {
            return res.status(200).json({ 
                estatus: false,
                code: dataCard.code,
                mensaje: dataCard.mensaje
            });
        }
        // Guarda la tarjeta creada de openpay en la base de datos
        const crearTarjeta = await crearTarjetaDB( req, dataCard.tarjeta);
        if (!crearTarjeta.estatus) {
            return res.status(200).json({ 
                estatus: false,
                code: 0,
                mensaje: crearTarjeta.mensaje
            });
        }
        return res.status(200).json({ 
            estatus: true,
            data: crearTarjeta.tarjeta,
            mensaje: 'La tarjeta fue registrada exitosamente'
        });
    } catch (err) {
        return res.status(400).json({ 
            estatus: false,
            code: 0,
            mensaje: err
        })
    }
}

// Metodo para borrar tarjeta
export async function eliminarTarjeta(req: Request, res: Response) : Promise<Response> {
    try {
        // Se obtiene la tarjeta del cliente de base de datos
        const dataTarjeta = await obtenerTarjetaDB( req );
        if (!dataTarjeta.estatus) {
            return res.status(200).json({ 
                estatus: false,
                code: 0,
                mensaje: dataTarjeta.mensaje
            })
        }
        // Se obtiene el cliente de openpay
        const clienteDB = await obtenerDB( req );
        if (!clienteDB.estatus) {
            return res.status(200).json({ 
                estatus: false,
                code: 0,
                mensaje: clienteDB.mensaje
            })
        }
        // Elimina la tarjeta del cliente en openpay
        const deleteCard = await Methods.deleteCardCustomerOpenpay( clienteDB.cliente.id_openpay, dataTarjeta.tarjeta.token );
        if (!deleteCard.estatus) {
            return res.status(200).json({ 
                estatus: false,
                code: deleteCard.code,
                mensaje: deleteCard.mensaje
            });
        }
        // Eliminar la tarjeta del cliente en base de datos
        const eliminarTarjeta = await eliminarTarjetaDB( req );
        if (!eliminarTarjeta.estatus) {
            return res.status(200).json({ 
                estatus: false,
                code: 0,
                mensaje: eliminarTarjeta.mensaje
            });
        }
        return res.status(200).json({ 
            estatus: true,
            mensaje: 'Tarjeta borrada exitosamente'
        });
    } catch (err) {
        return res.status(400).json({ 
            estatus: false,
            code: 0,
            mensaje: err
        })
    }
}

// Metodo para generar cobro OPENPAY con cliente registrado
export async function cobroCliente(req: Request, res: Response) : Promise<Response> {
    try {
        const chargeOpenPay = {
            method: 'card',
            source_id: req.body.source_id,
            amount: Number(req.body.amount),
            description: req.body.description,
            device_session_id: req.body.device_session_id,
            redirect_url: config.getRedirectUrlOpenpay(),
            use_3d_secure: 'true',
        };
        // Se obtiene el cliente de openpay
        const clienteDB = await obtenerDB( req );
        if (!clienteDB.estatus) {
            return res.status(200).json({ 
                estatus: false,
                code: 0,
                mensaje: clienteDB.mensaje
            })
        }
        // Realiza el cargo del cliente en openpay 
        const dataCharge = await Methods.chargeCustomerOpenpay( clienteDB.cliente.id_openpay, chargeOpenPay );
        if (!dataCharge.estatus) {
            return res.status(200).json({ 
                estatus: false,
                code: dataCharge.code,
                mensaje: dataCharge.mensaje
            });
        }
        return res.status(200).json({ 
            estatus: true,
            data: dataCharge.cargo,
            mensaje: 'Tu pago se realizo correctamente'
        })
    } catch (err) {
        console.log('err', err);
        return res.status(400).json({ 
            estatus: false,
            code: 0,
            mensaje: err
        })
    }

}

// Metodo para generar cobro OPENPAY sin cliente registrado
export async function cobro(req: Request, res: Response): Promise<Response> {
    try {
        let chargeOpenPay = {
            method: 'card',
            source_id: req.body.source_id,
            amount: Number(req.body.amount),
            currency : 'MXN',
            description: req.body.description,
            device_session_id: req.body.device_session_id,
            redirect_url: config.getRedirectUrlOpenpay(),
            use_3d_secure: 'true',
            customer: {
                name: 'Juan',
                last_name: 'Vazquez Juarez',
                phone_number: '4423456723',
                email: 'juan.vazquez@empresa.com.mx'
            }
        };
        const clienteDB = await obtenerDB( req );
        chargeOpenPay.customer.name = (clienteDB.estatus) ? clienteDB.cliente.nombre : 'Juan';
        chargeOpenPay.customer.last_name = (clienteDB.estatus) ? `${ clienteDB.cliente.apellido_pat } ${ clienteDB.cliente.apellido_mat }` : 'Vazquez Juarez';
        chargeOpenPay.customer.email = (clienteDB.estatus) ? clienteDB.cliente.mail : 'juan.vazquez@empresa.com.mx';
        // Realiza el cargo en openpay
        const dataCargo = await Methods.chargeOpenpay( chargeOpenPay );
        if (!dataCargo.estatus) {
            return res.status(200).json({ 
                estatus: false,
                code: dataCargo.code,
                mensaje: dataCargo.mensaje
            });
        }
        return res.status(200).json({ 
            estatus: true,
            data: dataCargo.cargo,
            mensaje: 'Tu pago se realizo correctamente'
        });
    } catch (err) {
        console.log('err', err);
        
        return res.status(400).json({ 
            estatus: false,
            code: 0,
            mensaje: err
        });
    }
}

// Metodo para obtener el estatus del cobro
export async function estatusCobro(req: Request, res: Response) : Promise<Response> {
    try {
        // Obtener el cobro generado en openpay 
        const dataCharge = await Methods.getChargeOpenpay( req.body.transactionId );
        if (!dataCharge.estatus) {
            return res.status(200).json({ 
                estatus: false,
                code: dataCharge.code,
                mensaje: dataCharge.mensaje
            });
        }
        return res.status(200).json({ 
            estatus: true,
            data: dataCharge.cargo,
            mensaje: 'Tu pago se realizo correctamente'
        })
    } catch (err) {
        console.log('err', err);
        return res.status(400).json({ 
            estatus: false,
            code: 0,
            mensaje: err
        })
    }

}

// Metodo para crear cliente openpay en base de datos
async function crearClienteDB( req: any, clienteOpenpay: any ) : Promise<any> {
    return new Promise( async(resolve) => {
        try {
            const data = {
                storeProcedure: 'sp_crear_open_pay_cliente',
                vid_cliente: req.usuario.id,
                vid_openpay: clienteOpenpay.id
            };
            const sp = await storeProcedure(data);
            const dataDB = sp[0][0];
            return resolve({
                estatus: true,
                cliente: dataDB,
                mensaje: 'Cliente openpay creado correctamente'
            })
        } catch (err) {
            return resolve({ 
                estatus: false,
                mensaje: 'Error al crear cliente openpay en el sistema'
            })
        }
    });
}

// Metodo para obtener cliente openpay en base de datos
async function obtenerClienteDB( req: any ) : Promise<any> {
    return new Promise( async (resolve) => {
        try {
            const data = {
                storeProcedure: 'sp_obtener_open_pay_cliente',
                vid_cliente: req.usuario.id
            };
            const sp = await storeProcedure(data);
            const dataDB = sp[0][0];
            if (!dataDB) {
                return resolve({ 
                    estatus: false,
                    mensaje: 'Cliente openpay no encontrado en el sistema'
                });
            }
            return resolve({ 
                estatus: true,
                cliente: dataDB
            });
        } catch (err) {
            return resolve({ 
                estatus: false,
                mensaje: 'Error cliente openpay no encontrada en el sistema'
            });
        }
    });
}

// Metodo para crear la tarjeta openpay en base de datos
async function crearTarjetaDB( req: any, tarjetaOpenpay: any ) : Promise<any> {
    return new Promise( async(resolve) => {
        try {
            const data = {
                storeProcedure: 'sp_crear_open_pay_tarjeta',
                vid_cliente: req.usuario.id,
                vtoken: tarjetaOpenpay.id,
                vtarjeta: tarjetaOpenpay.card_number
            };
            const sp = await storeProcedure(data);
            const dataDB = sp[0][0];
            return resolve({ 
                estatus: true,
                tarjeta: dataDB,
                mensaje: 'Tarjeta Cliente openpay creada correctamente'
            })
        } catch (err) {
            return resolve({ 
                estatus: false,
                mensaje: 'Error al crear tarjeta cliente openpay en el sistema'
            })
        }
    });
}

// Metodo para obtener tarjeta openpay de base de datos
async function obtenerTarjetaDB( req: any ) : Promise<any> {
    return new Promise( async (resolve) => {
        try {
            const data = {
                storeProcedure: 'sp_obtener_open_pay_tarjeta',
                vtoken: req.body.token
            };
            const sp = await storeProcedure(data);
            const dataDB = sp[0][0];
            if (!dataDB) {
                return resolve({ 
                    estatus: false,
                    mensaje: 'Tarjeta no encontrado en el sistema'
                });
            }
            return resolve({ 
                estatus: true,
                tarjeta: dataDB
            });
        } catch (err) {
            return resolve({ 
                estatus: false,
                mensaje: 'Error tarjeta no encontrada en el sistema'
            });
        }
    });
}

// Metodo para eliminar Tarjeta del cliente en openpay en base de datos
async function eliminarTarjetaDB( req: any ) : Promise<any> {
    return new Promise( async (resolve) => {
        try {
            const data = {
                storeProcedure: 'sp_borrar_open_pay_tarjeta',
                vid_cliente: req.usuario.id,
                vtoken: req.body.token
            };
            const sp = await storeProcedure(data);
            const dataDB = sp[0][0];
            if (!dataDB) {
                return resolve({ 
                    estatus: false,
                    mensaje: 'Tarjeta no encontrado en el sistema'
                });
            }
            if (dataDB.correcto === 0) {
                return resolve({ 
                    estatus: false,
                    mensaje: dataDB.mensaje
                });
            }
            return resolve({ 
                estatus: true,
                mensaje: 'Tarjeta borrada correctamente'
            });
        } catch (err) {
            return resolve({ 
                estatus: false,
                mensaje: 'Error tarjeta no encontrada en el sistema'
            });
        }
    });
}

// Metodo para obtener cliente de base de datos
async function obtenerDB( req: any ) : Promise<any> {
    return new Promise( async (resolve) => {
        try {
            const data = {
                storeProcedure: 'sp_obtener_cliente',
                vid: req.usuario.id
            };
            const sp = await storeProcedure(data);
            const dataDB = sp[0][0];
            if (!dataDB) {
                return resolve({ 
                    estatus: false,
                    mensaje: 'Cliente no encontrado en el sistema'
                });
            }
            return resolve({ 
                estatus: true,
                cliente: dataDB
            });
        } catch (err) {
            return resolve({ 
                estatus: false,
                mensaje: 'Error cliente no encontrada en el sistema'
            });
        }
    });
}
