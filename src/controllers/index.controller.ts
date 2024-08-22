import { Request, Response } from 'express';

export function index(req: Request, res: Response): Response {
    return res.json({
        estatus: true,
        message: 'Bienvenido api rest'
    })
}

export function getHtml(req: Request, res: Response) {
    return res.render('index.html');
}
