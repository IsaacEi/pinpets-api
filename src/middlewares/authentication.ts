import { Request, Response, NextFunction } from 'express';
import Methods from '../classes/methods';

export const verifyToken = async(req: any, res: Response, next: NextFunction) => {
    try {
        let token = req.headers.authorization;
        let decoded = null;
        //Valida que no venga vacio el parametro token
        if (!token) {
            return res.status( 401 ).json({
                estatus: false,
                mensaje: 'Not authorized.'
            });
        }
        //Extrae el token
        token = await Methods.extractToken(req);
        //decodifica el token 
        decoded = await Methods.verifyToken(token);
        if (!decoded) {
          return res.status( 401 ).json({
            estatus: false,
            mensaje: 'Not authorized.'
          });
        }
        //
        if (!decoded.usuario) {
          return res.status( 401 ).json({
            estatus: false,
            mensaje: 'Not authorized.'
          });
        }
    
        req.usuario = decoded.usuario;
        next();   
    } catch (error) {
        return res.status( 401 ).json({
          estatus: false,
          mensaje: 'Not authorized.'
        });
    }
}