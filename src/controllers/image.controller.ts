import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
/* // Guardar imagen
export async function fileUpload(req: Request, res: Response): Promise<any> {
    const folder = req.params.path;
    const imagen = req.params.image;
    // Validar que exista un archivo
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: 'No hay ningún archivo'
        });
    }
    // Procesar la imagen...
    const file = req.files.picture;
    const nombreCortado = file.name.split('.');
    const extensionArchivo = nombreCortado[ nombreCortado.length - 1 ];
    // Validar extension
    const extensionesValidas = [ 'png', 'jpg', 'jpeg', 'gif', 'svg'];
    if ( !extensionesValidas.includes( extensionArchivo ) ) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No es una extensión permitida'
        });
    }
    // Path para guardar la imagen
    const pathImg = path.join( __dirname, `../public/${ folder }/${ imagen }` );
    // Mover la imagen
    file.mv( pathImg , (err) => {
        if (err){
            console.log(err)
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover la imagen'
            });
        }

        return res.json({
            ok: true,
            mensaje: 'Archivo subido',
        });
    });

} */

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


