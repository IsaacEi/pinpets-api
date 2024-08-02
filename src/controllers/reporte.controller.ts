import { Request, Response } from 'express';
import { storeProcedure } from '../classes/database';


// Buscar pedidos por rango de fechas
export async function pedidos(req: Request, res: Response): Promise<Response> {
    try {
        const data = {
            storeProcedure: 'sp_reporte_pedidos',
            vfecha_ini: req.body.fecha_ini,
            vfecha_fin: req.body.fecha_fin
        }; 
        const sp = await storeProcedure(data);
        let dataDB = sp[0];
        return res.status(200).json({
            estatus: true,
            data: dataDB
        });
    } catch (err) {
        console.log('pedidos-error:', err);
        return res.status(400).json({ 
            estatus: false,
            mensaje: '¡Error! pedidos no encontrados'
        });
    }
}

// Pedido detalle 
export async function pedido(req: Request, res: Response): Promise<Response> {
    try {
        const dataCliente = {
            storeProcedure: 'sp_reporte_pedidos_cliente',
            vid: req.body.id
        };
        const dataDireccion = {
            storeProcedure: 'sp_reporte_pedidos_cliente_direccion',
            vid: req.body.id
        };
        const dataProductos = {
            storeProcedure: 'sp_reporte_pedidos_detalle',
            vid: req.body.id
        }; 
        const dataTotales = {
            storeProcedure: 'sp_reporte_pedidos_totales',
            vid: req.body.id
        }; 
        const spCliente = await storeProcedure(dataCliente);
        const dataClienteDB = spCliente[0][0];

        const spDireccion = await storeProcedure(dataDireccion);
        const dataDireccionDB = spDireccion[0][0];

        const spProductos = await storeProcedure(dataProductos);
        const dataProductosDB = spProductos[0] || [];

        const spTotales = await storeProcedure(dataTotales);
        const dataTotalesDB = spTotales[0][0];

        return res.status(200).json({
            estatus: true,
            cliente: dataClienteDB,
            direccion: dataDireccionDB,
            productos: dataProductosDB,
            totales: dataTotalesDB
        });
    } catch (err) {
        console.log('pedidoDetalle-error:', err);
        return res.status(400).json({ 
            estatus: false,
            mensaje: '¡Error! pedido detalle no encontrado'
        });
    }
}

// Estado de cuenta
export async function estadoCuenta(req: Request, res: Response): Promise<Response> {
    try {
        const dataPedidos = {
            storeProcedure: 'sp_reporte_estado_cuenta',
            vfecha_ini: req.body.fecha_ini,
            vfecha_fin: req.body.fecha_fin
        }; 
        const dataTotales = {
            storeProcedure: 'sp_reporte_estado_cuenta_totales',
            vfecha_ini: req.body.fecha_ini,
            vfecha_fin: req.body.fecha_fin
        };

        const spPedidos = await storeProcedure(dataPedidos);
        const dataPedidosDB = spPedidos[0] || [];

        const spTotales = await storeProcedure(dataTotales);
        const dataTotalesDB = spTotales[0][0];
        
        return res.status(200).json({
            estatus: true,
            pedidos: dataPedidosDB,
            totales: dataTotalesDB
        });
    } catch (err) {
        console.log('estadoCuenta-error:', err);
        return res.status(400).json({ 
            estatus: false,
            mensaje: '¡Error! estado de cuenta no encontrados'
        });
    }
}

