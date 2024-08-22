import { Request, Response } from 'express';
import { storeProcedure } from '../classes/database';
import Methods from '../classes/methods';
import Server from '../classes/server';

// Obtener configuracion faqs
export async function faqs(req: Request, res: Response): Promise<Response> {
    try {
        const data = await faqsDB();
        // Configuracion en la base de datos no existe
        if (!data.estatus) {
            return res.status(200).json({ 
                estatus: false,
                mensaje: data.mensaje
            });
        }
        return res.status(200).json({
            estatus: true,
            data: data.faqs
        });
    } catch (err) {
        console.log('obtener-error:', err);
        return res.status(200).json({ 
            estatus: false,
            mensaje: '!Error¡ faqs no encontradas'
        });
    }
}

// Obtener configuracion sitio web
export async function sitioWeb(req: Request, res: Response): Promise<Response> {
    try {
        const data = await sitioWebDB();
        // Configuracion en la base de datos no existe
        if (!data.estatus) {
            return res.status(200).json({ 
                estatus: false,
                mensaje: data.mensaje
            });
        }
        return res.status(200).json({
            estatus: true,
            data: data.sitioWeb
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
        const data = await terminosYCondicionesDB();
        // Configuracion en la base de datos no existe
        if (!data.estatus) {
            return res.status(200).json({ 
                estatus: false,
                mensaje: data.mensaje
            });
        }
        return res.status(200).json({
            estatus: true,
            data: data.terminos
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
        const data = await contactoDB();
        // Configuracion en la base de datos no existe
        if (!data.estatus) {
            return res.status(200).json({ 
                estatus: false,
                mensaje: data.mensaje
            });
        }
        return res.status(200).json({
            estatus: true,
            data: data.contacto
        });
    } catch (err) {
        console.log('obtener-error:', err);
        return res.status(200).json({ 
            estatus: false,
            mensaje: '!Error¡ contacto no encontrado'
        });
    }
}

// Obtener configuracion quienes somos 
export async function quienesSomos(req: Request, res: Response): Promise<Response> {
    try {
        const data = await quienesSomosDB();
        // Configuracion en la base de datos no existe
        if (!data.estatus) {
            return res.status(200).json({ 
                estatus: false,
                mensaje: data.mensaje
            });
        }
        return res.status(200).json({
            estatus: true,
            data: data.quienesSomos
        });
    } catch (err) {
        console.log('obtener-error:', err);
        return res.status(200).json({ 
            estatus: false,
            mensaje: '!Error¡ contacto no encontrado'
        });
    }
}

// Metodo para obtener la lista de faqs de base de datos
async function faqsDB() : Promise<any> {
    return new Promise( async (resolve) => {
        try {
            const body = {
                storeProcedure: 'faq'
            }; 
            const sp = await storeProcedure(body);
            let faqs = sp[0];
            
            if (!faqs) {
                return resolve({ 
                    estatus: false,
                    mensaje: 'Faqs no encontradas en el sistema'
                });
            }
            return resolve({ 
                estatus: true,
                faqs
            });
        } catch (err) {
            return resolve({ 
                estatus: false,
                mensaje: '!Error¡ faqs no encontradas'
            });
        }
    });
}

// Metodo para obtener sitio web de base de datos
async function sitioWebDB() : Promise<any> {
    return new Promise( async (resolve) => {
        try {
            const body = {
                storeProcedure: 'web'
            }; 
            const sp = await storeProcedure(body);
            let sitioWeb = sp[0][0];
            if (!sitioWeb) {
                return resolve({ 
                    estatus: false,
                    mensaje: 'Sitio web no encontradas en el sistema'
                });
            }
            return resolve({ 
                estatus: true,
                sitioWeb
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
            const body = {
                storeProcedure: 'terminosCondiciones'
            }; 
            const sp = await storeProcedure(body);
            let terminos = sp[0][0];
            if (!terminos) {
                return resolve({ 
                    estatus: false,
                    mensaje: 'Terminos y condiciones no encontrada en el sistema'
                });
            }
            return resolve({ 
                estatus: true,
                terminos
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
            const body = {
                storeProcedure: 'mailContacto'
            }; 
            const sp = await storeProcedure(body);
            let contacto = sp[0][0];
            if (!contacto) {
                return resolve({ 
                    estatus: false,
                    mensaje: 'Contacto no encontrado en el sistema'
                });
            }
            return resolve({ 
                estatus: true,
                contacto
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
            const body = {
                storeProcedure: 'quienesSomos'
            }; 
            const sp = await storeProcedure(body);
            let quienesSomos = sp[0][0];
            if (!quienesSomos) {
                return resolve({ 
                    estatus: false,
                    mensaje: 'Quienes somos no encontrado en el sistema'
                });
            }
            return resolve({ 
                estatus: true,
                quienesSomos
            });
        } catch (err) {
            return resolve({ 
                estatus: false,
                mensaje: '!Error¡ quienes somos no encontrado'
            });
        }
    });
}