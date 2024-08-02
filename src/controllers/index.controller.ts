import { Request, Response } from 'express';

export function index(req: Request, res: Response): Response {
    return res.json({
        ok: true,
        message: 'Bienbenido api rest'
    })
}

export function getHtml(req: Request, res: Response) {
    return res.render('index.html');
}
