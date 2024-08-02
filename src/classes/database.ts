import { createPool } from 'mysql2/promise';
import Configurations from '../config/config';
const config = new Configurations();

export async function connect() {
    try {
        return createPool(config.getCredencialsMysql());
    } catch (error) {
        return null;
    }
}

export async function storeProcedure(parameters: any): Promise<any> {
    console.log('parametros enviados:', parameters)
    return new Promise( async(resolve,reject) => {
        let data: any = parameters
        let storeProcedure: string = data.storeProcedure
        let query: string = ''
        let queryInfoSP: string = ''
        let params: any = []
        let sql: any = []
        let spInfo: any = []
        //Quita el nombre de la tabla 
        delete data['storeProcedure']
        //Valida que no venga vacio el nombre del store procedure
        if (storeProcedure === undefined || storeProcedure === '') {   
            return reject('Error name store procedure empty')
        }
        query = `CALL ??`;
        queryInfoSP = `SELECT DISTINCT PARAMETER_NAME as name, ORDINAL_POSITION FROM information_schema.parameters WHERE SPECIFIC_SCHEMA = '${config.getCredencialsMysql().database}' AND SPECIFIC_NAME = '${storeProcedure}' ORDER BY ORDINAL_POSITION;`;
        sql.push(storeProcedure)
        //Agregar los parametros del store procedure
        query += '( ?)' 
        //Conexion a la base
        const conn = await connect()
        if (!conn) {
            return reject('Error in connection database')
        }
        //Se obtienen los parametros del sp solicitados por posicion y nombre
        const [rows] = await conn.query(queryInfoSP)
        spInfo = rows
        console.log('consulta de parametros sp:', spInfo);
        try {
            //Se recorren json para obtener los valores del sp en el orden indicado
            spInfo.forEach(function (param: { name: string; }) {
                //Parametros del json
                Object.keys(data).forEach(function (k) {
                    if (param.name === k) {
                        params.push(data[k])
                        
                    }
                })
            })
            sql.push(params)
            //Query que ejecuta el los store procedure
            const [rows, fields] = await conn.query(query, sql)
            conn.end()
            return resolve(rows)
        } catch (error: any) {
            conn.end()
            console.log('error result sp', error)
            if(error.code === 'ER_SP_DOES_NOT_EXIST'){
                return reject(`Procedure ${storeProcedure} does not exist`)
            }
            return reject(error.code)
        }
    })
    
}