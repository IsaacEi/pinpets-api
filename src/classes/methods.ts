import jwt, { decode } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
const bearer = require('token-extractor');
import nodemailer from 'nodemailer';
import path from 'path';
import googleMaps  from '@google/maps';
import Configurations from '../config/config';
import { storeProcedure } from '../classes/database';
const Openpay = require('openpay');
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

    static getCustomerOpenpay( openpay_id: string ) : Promise<any> {
        return new Promise( async ( resolve ) => {
            // Se obtiene datos de openpay de la configuracion
            const dataOpenpay = await this.obtenerOpenPay();
            if (!dataOpenpay.estatus) {
                return resolve({ 
                    estatus: false,
                    code: 0,
                    mensaje: dataOpenpay.mensaje
                });
            }
            const openpay = await this.intanceOpenPay(dataOpenpay.openpay);
            openpay.customers.get( openpay_id, ( error: any, customer: any ) => {
                if (error) {
                    return resolve({ 
                        estatus: false, 
                        code: error.error_code,
                        mensaje: error.description
                    }); 
                }
                return resolve({
                    estatus: true,
                    cliente: customer
                });
            });
        });
    }

    static createCustomerOpenpay( customerOpenPay: any ) : Promise<any> {
        return new Promise( async (resolve) => {
            // Primero de diciembre cambiar a true 
            const customerRequest = {
                requires_account: false,
                name: customerOpenPay.name,
                last_name: customerOpenPay.last_name,
                email: customerOpenPay.email,
                phone_number: '',
                address: {
                    line1: 'Durango 25',
                    line2: 'Col. Progreso Tizapan',
                    line3: 'México',
                    postal_code: '01080',
                    state: 'CDMX',
                    city: 'CDMX',
                    country_code : 'MX'
                }
            };
            // Se obtiene datos de openpay de la configuracion
            const dataOpenpay = await this.obtenerOpenPay();
            if (!dataOpenpay.estatus) {
                return resolve({ 
                    estatus: false,
                    code: 0,
                    mensaje: dataOpenpay.mensaje
                });
            }
            const openpay = await this.intanceOpenPay(dataOpenpay.openpay);
            openpay.customers.create( customerRequest, ( error: any, customer: any ) => {
                if (error) {
                    return resolve({ 
                        estatus: false, 
                        code: error.error_code,
                        mensaje: error.description
                    }); 
                }
                return resolve({
                    estatus: true,
                    cliente: customer
                });
            });
        });
    }

    static deleteCustomerOpenpay( openpay_id: string ) : Promise<any> {
        return new Promise( async (resolve) => {
            // Se obtiene datos de openpay de la configuracion
            const dataOpenpay = await this.obtenerOpenPay();
            if (!dataOpenpay.estatus) {
                return resolve({ 
                    estatus: false,
                    code: 0,
                    mensaje: dataOpenpay.mensaje
                });
            }
            const openpay = await this.intanceOpenPay(dataOpenpay.openpay);
            openpay.customers.delete( openpay_id, ( error: any ) => {
                if (error) {
                    return resolve({ 
                        estatus: false, 
                        code: error.error_code,
                        mensaje: error.description
                    });
                }
                return resolve({
                    estatus: true
                });
            });
        });
    }

    static createCardCustomerOpenpay( openpay_id: string, cardOpenPay: any ) : Promise<any> {
        return new Promise( async (resolve) => {
            // Se obtiene datos de openpay de la configuracion
            const dataOpenpay = await this.obtenerOpenPay();
            if (!dataOpenpay.estatus) {
                return resolve({ 
                    estatus: false,
                    code: 0,
                    mensaje: dataOpenpay.mensaje
                });
            }
            const openpay = await this.intanceOpenPay(dataOpenpay.openpay);
            openpay.customers.cards.create( openpay_id, cardOpenPay, ( error: any, card: any ) => {
                if (error) {
                    return resolve({ 
                        estatus: false, 
                        code: error.error_code,
                        mensaje: error.description
                    });
                }
                return resolve({
                    estatus: true,
                    tarjeta: card
                });
            });
        });
    }

    static deleteCardCustomerOpenpay( openpay_id: string, card_id: string ) : Promise<any> {
        return new Promise( async (resolve) => {
            // Se obtiene datos de openpay de la configuracion
            const dataOpenpay = await this.obtenerOpenPay();
            if (!dataOpenpay.estatus) {
                return resolve({ 
                    estatus: false,
                    code: 0,
                    mensaje: dataOpenpay.mensaje
                });
            }
            const openpay = await this.intanceOpenPay(dataOpenpay.openpay);
            openpay.customers.cards.delete( openpay_id, card_id, ( error: any ) => {
                if (error) {
                    return resolve({ 
                        estatus: false, 
                        code: error.error_code,
                        mensaje: error.description
                    });
                }
                return resolve({
                    estatus: true
                });
            });
        });
    }

    static chargeCustomerOpenpay( openpay_id: string, chargeOpenPay: any ) : Promise<any> {
        return new Promise( async (resolve) => {
            // Se obtiene datos de openpay de la configuracion
            const dataOpenpay = await this.obtenerOpenPay();
            if (!dataOpenpay.estatus) {
                return resolve({ 
                    estatus: false,
                    code: 0,
                    mensaje: dataOpenpay.mensaje
                });
            }
            const openpay = await this.intanceOpenPay(dataOpenpay.openpay);
            openpay.customers.charges.create( openpay_id, chargeOpenPay, ( error: any, charge: any) => {
                if (error) {
                    return resolve({ 
                        estatus: false, 
                        code: error.error_code,
                        mensaje: error.description
                    });
                }
                return resolve({
                    estatus: true,
                    cargo: charge
                });
            });
        });
    }

    static chargeOpenpay( chargeOpenPay: any ) : Promise<any> {
        return new Promise( async (resolve) => {
            // Se obtiene datos de openpay de la configuracion
            const dataOpenpay = await this.obtenerOpenPay();
            if (!dataOpenpay.estatus) {
                return resolve({ 
                    estatus: false,
                    code: 0,
                    mensaje: dataOpenpay.mensaje
                });
            }
            const openpay = await this.intanceOpenPay(dataOpenpay.openpay);
            openpay.charges.create( chargeOpenPay, ( error: any, charge: any) => {
                if (error) {
                    return resolve({ 
                        estatus: false, 
                        code: error.error_code,
                        mensaje: error.description
                    });
                }
                return resolve({
                    estatus: true,
                    cargo: charge
                });
            });
        });
    }

    static getChargeOpenpay( transactionId: string ) : Promise<any> {
        return new Promise( async (resolve) => {
            // Se obtiene datos de openpay de la configuracion
            const dataOpenpay = await this.obtenerOpenPay();
            if (!dataOpenpay.estatus) {
                return resolve({ 
                    estatus: false,
                    code: 0,
                    mensaje: dataOpenpay.mensaje
                });
            }
            const openpay = await this.intanceOpenPay(dataOpenpay.openpay);
            openpay.charges.get( transactionId, ( error: any, charge: any) => {
                if (error) {
                    return resolve({ 
                        estatus: false, 
                        code: error.error_code,
                        mensaje: error.description
                    });
                }
                if (charge.status === 'failed') {
                    return resolve({ 
                        estatus: false, 
                        code: charge.error_code,
                        mensaje: charge.error_message
                    });
                }
                return resolve({
                    estatus: true,
                    cargo: charge
                });
            });
        });
    }

    static sendMailRecomendado(context: any): Promise<any> {
        return new Promise(async (resolve, reject) => {
            const emailConfig = config.getEmail();
            
            try {
                let transporter = nodemailer.createTransport(emailConfig);
                const mailOptions = {
                    from: `ECOMMERCE ${emailConfig.auth.user}`,
                    cc: 'chiclucach@gmail.com',
                    to: context.mail_recomendado,
                    subject: 'Gracias por recomendarnos',
                    html: await this.templateRecomendado(context)
                }
            
                transporter.sendMail(mailOptions, function (err, info) {
                    if (err) {
                        return resolve({ status: false, mensaje: err.message });
                    }
                    return resolve({ status: true, mensaje: 'Correo recomendado enviado correctamente' })
                })
            } catch (error) {
                return resolve({ status: false, mensaje: error });
            }

        });
    }
    
    static templateRecomendado(context: any): Promise<string> {
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
                                            <h3><strong>Chic Mua</strong></h3>
                                        </div>
            
                                        <div class="col">
                                            <p>${context.mensaje_recomendado}</p>
                                        </div>
            
                                        <div class="col">
                                            <p>Cualquier duda contáctanos a: ${context.contacto_email}</p>
                                            <p>Síguenos en: <a href="${context.pagina}">${context.pagina}</a></p>
                                            <p>Instagram: ${context.instagram}</p>
                                            <p>Facebook: ${context.facebook}</p>
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

    static sendMailContactanos(context: any): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const { emailConfig } = await Methods.configuracion();
                //console.log('context', context)
                let transporter = nodemailer.createTransport( emailConfig );
                const mailOptions = {
                    from: `${ emailConfig.auth.user }`,
                    to: emailConfig.auth.user,
                    subject: `Contactanos`,
                    html: await this.templateContactanos(context)
                }
            
                transporter.sendMail(mailOptions, function (err, info) {
                    if (err) {
                        console.log('err', err);
                        return resolve({ estatus: false, mensaje: err.message });
                    }
                    return resolve({ estatus: true, mensaje: 'Correo pedido enviado correctamente' })
                })
            } catch (error) {
                return resolve({ estatus: false, mensaje: error });
            }
        });
    }

    static templateContactanos(context: any): Promise<string> {
        return new Promise((resolve) => {
            return resolve(`

                <!DOCTYPE html>
                <html lang="en">
                
                    <head>
                        <meta charset="utf-8">
                        <meta http-equiv="X-UA-Compatible" content="IE=edge">
                        <meta name="viewport" content="width=device-width, initial-scale=1">
                        <title>Pedido</title>
                        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
                        <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,700" rel="stylesheet">
                
                        <style>
                            html {
                                position: relative;
                                min-height: 100%;
                                background: #ffffff;
                                -webkit-font-smoothing: antialiased;
                                -moz-osx-font-smoothing: grayscale;
                            }
                            body {
                                margin: 0;
                                font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
                                font-size: 0.9em;
                                color: #424242;
                                background-color: #fff;
                            }
                            .container {
                                padding: 25px;
                            }
                            .card {
                                display: -ms-flexbox;
                                display: flex;
                                -ms-flex-direction: column;
                                flex-direction: column;
                                min-width: 0;
                                word-wrap: break-word;
                                background-color: #fff;
                                background-clip: border-box;
                                border: 1px solid rgba(0,0,0,.125);
                                border-radius: .25rem;
                                box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
                            }
                            .card-body {
                                margin: 10px;
                            }
                            
                        </style>
                        
                    </head>
                
                    <body>
                        <div class="container">
                
                            <div class="card">
                
                                <div class="card-body">
                
                                    <h4>
                                        GRACIAS POR CONTACTARNOS
                                    </h4>
                        
                                </div>
                                
                            </div>
                
                            <br>
                
                            <div class="card">
                
                                <div class="card-body">
                
                                    <h4>
                                        Datos de contacto
                                    </h4>
                
                                    <p>
                                        <small>
                                            <strong>Nombre: </strong>${ context.contacto.nombre }
                                        </small>
                                    </p>
                
                                    <p>
                                        <small>
                                            <strong>Correo: </strong>${ context.contacto.mail }
                                        </small>
                                    </p>
                                    
                                    <p>
                                        <small>
                                            <strong>Telefono: </strong>${ context.contacto.tel }
                                        </small>
                                    </p>

                                    <p>
                                        <small>
                                            <strong>Mensaje: </strong>${ context.contacto.mensaje }
                                        </small>
                                    </p>
                        
                                </div>
                                
                            </div>
                
                        </div>
                        
                    </body>
                
                </html>
            
            `);
        });
    }

    static sendMailPedido(context: any): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const { emailConfig } = await Methods.configuracion();
                //console.log('context', context)
                let transporter = nodemailer.createTransport( emailConfig );
                const mailOptions = {
                    from: `${ context.comercio } ${ emailConfig.auth.user }`,
                    cc: emailConfig.auth.user,
                    to: context.cliente.mail,
                    subject: `Gracias por comprar en ${ context.comercio }`,
                    html: await this.templatePedido(context)
                }
            
                transporter.sendMail(mailOptions, function (err, info) {
                    if (err) {
                        console.log('err', err);
                        return resolve({ estatus: false, mensaje: err.message });
                    }
                    return resolve({ estatus: true, mensaje: 'Correo pedido enviado correctamente' })
                })
            } catch (error) {
                return resolve({ estatus: false, mensaje: error });
            }
        });
    }
    
    static templatePedido(context: any): Promise<string> {
        return new Promise((resolve) => {
            return resolve(`

                <!DOCTYPE html>
                <html lang="en">
                
                    <head>
                        <meta charset="utf-8">
                        <meta http-equiv="X-UA-Compatible" content="IE=edge">
                        <meta name="viewport" content="width=device-width, initial-scale=1">
                        <title>Pedido</title>
                        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
                        <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,700" rel="stylesheet">
                
                        <style>
                            html {
                                position: relative;
                                min-height: 100%;
                                background: #ffffff;
                                -webkit-font-smoothing: antialiased;
                                -moz-osx-font-smoothing: grayscale;
                            }
                            body {
                                margin: 0;
                                font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
                                font-size: 0.9em;
                                color: #424242;
                                background-color: #fff;
                            }
                            .container {
                                padding: 25px;
                            }
                            .card {
                                display: -ms-flexbox;
                                display: flex;
                                -ms-flex-direction: column;
                                flex-direction: column;
                                min-width: 0;
                                word-wrap: break-word;
                                background-color: #fff;
                                background-clip: border-box;
                                border: 1px solid rgba(0,0,0,.125);
                                border-radius: .25rem;
                                box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
                            }
                            .card-body {
                                margin: 10px;
                            }
                            .table {
                                border-collapse: collapse;
                                border-radius: .25rem;
                                overflow: hidden;
                                width: 100%;
                                box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
                            }
                            .table thead tr {
                                background-color: #f3f3f3;
                                color: #6E6E6E;
                                text-align: left;
                            }
                            .table th,
                            .table td {
                                padding: 10px 15px;
                            }
                            .table tbody tr {
                                border-bottom: 1px solid #dddddd;
                            }
                        </style>
                        
                    </head>
                
                    <body>
                        <div class="container">
                
                            <div class="card">
                
                                <div class="card-body">
                
                                    <h4>
                                        GRACIAS POR COMPRAR EN ${ context.comercio }
                                    </h4>
                
                                    <p>
                                        <small>
                                            Tu pedido ha sido recibido
                                        </small>
                                    </p>
                        
                                </div>
                                
                            </div>
                
                            <br>
                
                            <div class="card">
                
                                <div class="card-body">
                
                                    <h4>
                                        Datos del cliente
                                    </h4>
                
                                    <p>
                                        <small>
                                            <strong>Nombre: </strong>${ context.cliente.nombre }
                                        </small>
                                    </p>
                
                                    <p>
                                        <small>
                                            <strong>Correo: </strong>${ context.cliente.mail }
                                        </small>
                                    </p>
                                    
                                    <p>
                                        <small>
                                            <strong>Telefono: </strong>${ context.cliente.tel }
                                        </small>
                                    </p>
                        
                                </div>
                                
                            </div>
                
                            <br>
                
                            <div class="card">
                
                                <div class="card-body">
                
                                    <h4>
                                        Dirección de envío
                                    </h4>
                
                                    <p>
                                        <small>
                                        ${ context.direccion.direccion }
                                        </small>
                                    </p>
                        
                                </div>
                                
                            </div>
                
                            <br>
                
                            ${ context.tabla }
                
                        </div>
                        
                    </body>
                
                </html>
            
            `);
        });
    }

    static tableItems( header: any, items: any[]): Promise<string> {
        return new Promise(async (resolve, reject) => {
            try {
                const thead = `
                <thead>
                    <tr>
                        <th scope="col">imagen</th>
                        <th scope="col">Modelo</th>
                        <th scope="col">Talla</th>
                        <th scope="col">Precio</th>
                    </tr>
                </thead>`;
                const subTotal = `
                <tr>
                    <td></td>
                    <td></td>
                    <td><strong>SubTotal</strong></td>
                    <td>$ ${header.subtotal}</td>
                </tr>`;
                const descuentoCliente = `
                <tr>
                    <td></td>
                    <td></td>
                    <td><strong>Descuento cliente</strong></td>
                    <td>$ ${header.descuento_cliente}</td>
                </tr>`;
                const descuentoCupon = `
                <tr>
                    <td></td>
                    <td></td>
                    <td><strong>Descuento cupon</strong></td>
                    <td>$ ${header.descuento_cupon}</td>
                </tr>`;
                const precioEnvio = `
                <tr>
                    <td></td>
                    <td></td>
                    <td><strong>Precio envío</strong></td>
                    <td>$ ${header.precio_envio}</td>
                </tr>`;
                const total = `
                <tr>
                    <td></td>
                    <td></td>
                    <td><strong>Total</strong></td>
                    <td>$ ${header.total}</td>
                </tr>`;
                let modelos = '';
                for (const item of items) {
                    modelos += `
                    <tr>
                        <td>
                        </td>
                        <td>${item.modelo}</td>
                        <td>${item.talla}</td>
                        <td>$ ${item.precio}</td>
                    </tr>`;            
                }

                const displayData = `
                <table class="table">
                    ${thead}
                    <tbody>
                        ${modelos} 
                        ${subTotal} 
                        ${descuentoCliente}
                        ${descuentoCupon}
                        ${precioEnvio}
                        ${total}
                    </tbody>
                </table>`

                return resolve(displayData)
            } catch (error) {
                return reject(error)
            }

        });
    }

    static templatePedidoWeb(context: any): Promise<string> {
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
                                                <h3><strong>Chic Mua</strong></h3>
                                            </div>

                                            <div class="col">
                                                <p>Hola ${context.nombre_cliente} gracias por comprar en CHIC MUA confirmamos que tu pedido #${context.order_id} ha sido recibido con los datos mostrados a continuación y está en proceso de elaboración.</p>
                                            </div>

                                            <div class="col">
                                                <p>Te notificaremos vía mail o telefónicamente cuando esté listo.</p>
                                            </div>

                                            <div class="col">
                                            <p>${context.mensaje}</p>
                                            </div>

                                            <div class="col">
                                                <p>Método de entrega es: ${context.direccion_entrega}</p>
                                            </div>

                                            <div class="col">
                                                <h4>Detalles de la compra:</h4>
                                                <p>Nombre: ${context.nombre_completo}</p>
                                                <p>Tel: ${context.telefono}</p>
                                                <p>Mail: ${context.email}</p>
                                                <p>Fecha: ${context.fecha_pedido}</p>
                                                <br>
                                            </div>

                                            <div class="col">
                                            ${context.displayData}
                                            </div>

                                            <div class="col">
                                                <p>Cualquier duda contáctanos a: ${context.contacto_email}</p>
                                                <p>Síguenos en: <a href="${context.pagina}">${context.pagina}</a></p>
                                                <p>Instagram: ${context.instagram}</p>
                                                <p>Facebook: ${context.facebook}</p>
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

    static tableItemsWeb( totales: any, items: any[]): Promise<string> {
        return new Promise(async (resolve, reject) => {
            try {
                const thead = `
                <thead>
                    <tr>
                        <th></th>
                        <th>Producto</th>
                        <th>Precio unitario</th>
                        <th>Cantidad</th>
                        <th>Total</th>
                    </tr>
                </thead>`;
                const subTotal = `
                <tr>
                    <td>
                    </td>
                    <td>
                    </td>
                    <td>
                    </td>
                    <td>
                        <small class="text-muted">
                        <strong>Subtotal</strong>
                        </small>
                    </td>
                    <td>
                        <small class="text-muted">
                        <strong>$${ totales.subtotal }</strong>
                        </small>
                    </td>
                </tr>`;
                const descuento = (totales.descuento > 0) ? `
                <tr>
                    <td>
                    </td>
                    <td>
                    </td>
                    <td>
                    </td>
                    <td>
                        <small class="text-muted">
                        <strong>Descuento</strong>
                        </small>
                    </td>
                    <td>
                        <small class="text-muted">
                        <strong>$${ totales.descuento }</strong>
                        </small>
                    </td>
                </tr>` : '';
                const envio = (totales.envio > 0) ? `
                <tr>
                    <td>
                    </td>
                    <td>
                    </td>
                    <td>
                    </td>
                    <td>
                        <small class="text-muted">
                        <strong>Envío</strong>
                        </small>
                    </td>
                    <td>
                        <small class="text-muted">
                        <strong>$${ totales.envio }</strong>
                        </small>
                    </td>
                </tr>` : '';
                const total = `
                <tr>
                    <td>
                    </td>
                    <td>
                    </td>
                    <td>
                    </td>
                    <td>
                        <small class="text-muted">
                        <strong>Total</strong>
                        </small>
                    </td>
                    <td>
                        <small class="text-muted">
                        <strong>$${ totales.total }</strong>
                        </small>
                    </td>
                </tr>`;
                let productos = '';
                for (const item of items) {
                    productos += `
                    <tr>
                        <td>
                            <img src="${ item.imagen }" width="60" height="60">
                        </td>
                        <td>
                            <small class="text-muted">${ item.producto }</small>
                        </td>
                        <td>
                            <small class="text-muted">$${ item.precio_unitario }</small>
                        </td>
                        <td>
                            <small class="text-muted">${ item.cantidad }</small>
                        </td>
                        <td>
                            <small class="text-muted">$${ item.precio }</small>
                        </td>
                    </tr>
                    `;
                }

                const tablaData = `
                <table class="table">
                    ${thead}
                    <tbody>
                        ${productos} 
                        ${subTotal} 
                        ${descuento}
                        ${envio}
                        ${total}
                    </tbody>
                </table>`

                return resolve(tablaData)
            } catch (error) {
                return reject(error)
            }

        });
    }

    static itemsPathImg(items: any[]): Promise<any[]> {
        return new Promise(async (resolve, reject) => {
            try {
                let itemsImg = [];
                for (const item of items) {
                    item.imagen = `http://ec2-18-188-0-254.us-east-2.compute.amazonaws.com:81/${ item.foto_principal }`;
                    itemsImg.push(item);
                }
                return resolve(itemsImg)
            } catch (error) {
                console.log(error);
                return reject(error)
            }

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

    static async obtenerOpenPay() : Promise<any> {
        return new Promise( async(resolve) => {
            try {
                const data = {
                    storeProcedure: 'sp_obtener_datos_open_pay'
                };
                const sp = await storeProcedure(data);
                let dataDB = sp[0][0];
                if (!dataDB) {
                    return resolve({ 
                        estatus: false,
                        mensaje: 'Configuracion openy no encontrada en el sistema'
                    })
                }
                dataDB.sandbox_mode = (dataDB.sandbox_mode === 1) ? true : false;
                dataDB.set_production_ready = (dataDB.set_production_ready === 1) ? true : false;
                return resolve({ 
                    estatus: true,
                    openpay: dataDB
                })
            } catch (err) {
                return resolve({ 
                    estatus: false,
                    mensaje: 'Error configuracion openpay no encontrada en el sistema'
                })
            }
        });
    }

    static async intanceOpenPay( dataOpenpay: any ): Promise<any> {
        return new Promise( async (resolve) => {
            const openPayKey = dataOpenpay.llave_privada_openpay;
            const openPayId = dataOpenpay.id_comercio_openpay;
            const openPayProductive = dataOpenpay.set_production_ready;
            const openpay = new Openpay( openPayId, openPayKey);
            openpay.setProductionReady(openPayProductive);
            return resolve( openpay );
        });
    }
    
}
