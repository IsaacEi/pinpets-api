import { number } from '@hapi/joi';
import { filter } from 'bluebird';
import { Request, Response } from 'express';
import path from 'path';
import { storeProcedure } from '../classes/database';
import Methods from '../classes/methods';

export async function prueba(req: Request, res: Response): Promise<Response> {
    try {
        //multiple()
        //console.log(aVeryBigSum([1000000001, 1000000002, 1000000003, 1000000004, 1000000005]));
        //console.log(diagonalDifference([[11, 2, 4],[4, 5, 6],[10, 8, 12]]));
        //console.log(plusMinus([-4, 3, -9, 0, 4, 1]));
        //console.log(staircase(4));
        //console.log(miniMaxSum([1, 2, 3, 4, 5]));
        //console.log(birthdayCakeCandles([4, 4, 1, 3]));
        console.log(timeConversion('12:01:05PM'));
        console.log(timeConversion('12:01:03AM'));
        console.log(timeConversion('07:05:45PM'));
        return res.status(200).json({
            estatus: true,
            mensaje: 'Correcto'
        });

    } catch (error) {
        return res.status(400).json({ 
            ok: false,
            mensaje: error
        })
    }

}

function multiple() {
    const max = 15;
    for (let index = 1; index <= max; index++) {
        if (esMultiple(index, 3) && esMultiple(index, 5) ) {
            console.log('FizzBuzz');
        } else if(esMultiple(index, 3)) {
            console.log('Fizz');
        } else if(esMultiple(index, 5)) {
            console.log('Buzz');
        } else {
            console.log(index);
        }
    }

}

function aVeryBigSum(ar: number[]) {
    let suma = 0;
    for (const a of ar) {
        suma = suma + a;
    }
    return suma;
}

function esMultiple(valor: number, multiplo: number) {
    const resp = valor % multiplo;
    if (resp == 0) {
        return true;    
    }
    return false;
}

function diagonalDifference(arr: number[][]) {
    let i = 0;
    let izqDiagonal = 0;
    let derDiagonal = 0;
    let totalDiagonal = 0;
    for (const n of arr) {
        izqDiagonal = izqDiagonal + fnDireccion( i, 'izquierda', n)
        derDiagonal =  derDiagonal + fnDireccion( i, 'derecha', n)
        i++;
    }
    console.log('izqDiagonal', izqDiagonal);
    console.log('derDiagonal', derDiagonal);
    totalDiagonal = izqDiagonal - derDiagonal;
    console.log('totalDiagonal', totalDiagonal);
    return totalDiagonal < 0 ? ( - totalDiagonal) : totalDiagonal ;
}

function fnDireccion( posicion: number, direccion: string = 'izquierda', array: number[]) {
    if (direccion === 'izquierda') {
        return array[posicion];
    } else {
        return array.reverse()[posicion];
    }
}

function plusMinus(arr: number[]) {
    const lenArr = arr.length;
    const numPositivos = arr.filter( (nu) => nu > 0).length;
    const numNegativos = arr.filter( (nu) => nu < 0).length;
    const numCeros = arr.filter( (nu) => nu === 0).length;
    const positivos = Number(( numPositivos / lenArr )).toFixed(6);
    const negativos = Number(( numNegativos / lenArr )).toFixed(6);
    const ceros = Number(( numCeros / lenArr )).toFixed(6);
    return `
        ${ positivos }
        ${ negativos } 
        ${ ceros }
    `;
}

function fnUnique(value: any, index: any, self: any) {
    return self.indexOf(value) === index;
}

function staircase(n: number) {
    let simbolo = '#';
    for (let index = 0; index < n; index++) {
        console.log(simbolo.padStart(n));
        simbolo = `#${ simbolo }`; 
    }

    return simbolo;
}

function miniMaxSum(arr: number[]) {
    const min = Math.min(...arr);
    const max = Math.max(...arr);
    /* const minArray = arr.filter( num => num != max );
    const maxArray = arr.filter( num => num != min ); */
    let minSum = 0;
    let maxSum = 0;
    for (const num of arr) {
        minSum = minSum + num;
    }
    minSum = minSum - max;

    for (const num of arr) {
        maxSum = maxSum + num;
    }

    maxSum = maxSum - min;
    
    const minMax = `${ minSum } ${ maxSum }`;
    /* console.log('min', min);
    console.log('max', max);
    console.log('minSum', minSum);
    console.log('maxSum', maxSum);
    console.log(minMax); */
    return minMax;
}

function birthdayCakeCandles(candles: number[]) {
    const max = Math.max(...candles);    
    const maxVelas = candles.filter( vela => vela === max ).length;
    //console.log(maxVelas);
    return maxVelas;
}

function timeConversion(s: string) {
    let [h, minutes, seconds] = s.split(':');
    let hours = Number(h);
    const segundos = seconds.replace('AM', '').replace('PM', '');
    const pm = s.split('PM').length;
    let format = 'PM';
    if ( pm === 1) {
        format = 'PM';
    } else {
        format = 'AM';
    }

    if (format === 'PM' && hours < 12) {
        hours = hours + 12;
    }

    if (format === 'AM' && hours === 12) {
        hours = hours - 12;
    }
    const resultado = `${('0' + hours).slice(-2)}:${minutes}:${segundos}`;
    //console.log(resultado);
    return resultado;
}

