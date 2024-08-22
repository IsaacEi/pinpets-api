import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { v4 as uuid } from 'uuid';
// Guardar imagen
export async function fileUpload(req: Request, res: Response): Promise<any> {
    const folder = req.params.path;
    // Validar que exista un archivo
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            estatus: false,
            mensaje: 'No hay ningún archivo'
        });
    }
    // Procesar la imagen...
    const file = req.files.picture as any;
    const nombreCortado = file.name.split('.');
    const extensionArchivo = nombreCortado[ nombreCortado.length - 1 ];
    const imagen = `${uuid()}.${extensionArchivo}`.split(' ').join('');
    console.log('imagen', imagen);
    // Validar extension
    const extensionesValidas = [ 'png', 'jpg', 'jpeg', 'gif', 'svg'];
    if ( !extensionesValidas.includes( extensionArchivo ) ) {
        return res.status(400).json({
            estatus: false,
            mensaje: 'No es una extensión permitida'
        });
    }
    // Path para guardar la imagen
    const pathImg = path.join( __dirname, `../public/${ folder }/${imagen}`);
    const pathFolder = path.join( __dirname, `../public/${ folder }`);
    // Crear la carpeta si no existe
    await createFolder(pathFolder);
    // Mover la imagen
    file.mv( pathImg , (err: any) => {
        if (err){
            console.log(err)
            return res.status(500).json({
                estatus: false,
                mensaje: 'Error al mover la imagen'
            });
        }

        return res.json({
            estatus: true,
            mensaje: 'Archivo subido',
        });
    });

}

// Mostrar imagen
export async function image(req: Request, res: Response): Promise<any> {
    const pathImgDefecto = path.join( __dirname, `../public/no-img.jpg` );
    try {
        const folder = req.params.path;
        const image = req.params.image;
        const pathImg = path.join( __dirname, `../public/${ folder }/${ image }` );
        // Si existe imagen muestra la que esta en la ruta solicitada
        if ( fs.existsSync( pathImg ) ) {
            return res.sendFile( pathImg );
        }
        // No existe ninguna imagen muestra una por defecto   
        return res.sendFile( pathImgDefecto );
    } catch (err) {
        return res.sendFile( pathImgDefecto );
    }

}

// Descargar imagen
export async function download(req: Request, res: Response): Promise<any> {
    const pathImgDefecto = path.join( __dirname, `../public/no-img.jpg` );
    try {
        const folder = req.params.path;
        const image = req.params.image;
        const pathImg = path.join( __dirname, `../public/${ folder }/${ image }` );
        // Si existe imagen muestra la que esta en la ruta solicitada
        if ( fs.existsSync( pathImg ) ) {
            return res.download( pathImg );
        }
        // No existe ninguna imagen muestra una por defecto   
        return res.download( pathImgDefecto );
    } catch (err) {
        return res.download( pathImgDefecto );
    }

}


// Metodo para crear carpeta
async function createFolder(folderPath: string) : Promise<any> {
    return new Promise( async (resolve) => {
        try {

            if (!fs.existsSync(folderPath)) {
                fs.mkdirSync(folderPath)
                return resolve({ 
                    estatus: true,
                    mensaje: 'Folder creado correctamente'
                });
            }

            return resolve({ 
                estatus: true,
                mensaje: 'Folder exite'
            });
            
        } catch (err) {
            return resolve({ 
                estatus: false,
                mensaje: '!Error¡ folder no creado'
            });
        }
    });
}


