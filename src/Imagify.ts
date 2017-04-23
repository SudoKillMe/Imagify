var fs = require('fs');
//var _ = require('lodash');
import * as U from './Util.js';
/**
 * Critical chunks:
 * IHDR: 49 48 44 52   -->   73 72 68 82
 * PLTE:                     80 76 84 69 (当IHDR的color type为2或6时,该项为可选项)
 * IDAT: 49 44 41 54   -->   73 68 65 84
 * IEND: 49 45 4E 44   -->   73 69 78 68
 * General chunks:  可能会被decoder忽略
 *
 * chunk 长度组成:
 * 4字节的长度(仅代表该chunk的数据长度)
 * 4字节的类型(IHDR,PLTE之类的)
 * chunk数据(长度由4字节的长度的值决定)
 * 4字节的crc(冗余检测)
 */

type ImageType = {
    width?: number;
    height?: number;
    bit_dep?: number;
    c_type?: number;
    c_meth?: number;
    f_meth?: number;
    i_meth?: number;
}

class Imagify {

    // index: number;
    // buffer: Buffer;
    private index: number;
    private buffer: Buffer;
    private info = {
        width: 0,
        height: 0,
        bit_dep: 0,
        c_type: 0,
        c_meth: 0,
        f_meth: 0,
        i_meth: 0
    };
    private result: Buffer;

    constructor( file: string ) {
        this.index = 0;
        this.result = Buffer.alloc(0);
        this.buffer = fs.readFileSync( file );
    }

    readBytes ( length: number ): Buffer {

        let bytes = U.readBytes(this.buffer, this.index, this.index += length);
        // let bytes = slice.call(this.buffer, this.index, this.index + length);
        //this.index += length;
        return Buffer.from(bytes);

    }

    // bufferToString ( buffer: Buffer ): string {

    //     let str = '';
    //     for ( let i=0; i<buffer.length; i++ ) {
    //         str += String.fromCharCode(buffer[i]);
    //     }
    //     return str;

    // }

    decode() {
        console.log('before',this.buffer.length);
        this.decodeHeader();
        this.decodeChunk();
        //console.log(this.result);
        console.log('after:', this.result.length);
        fs.writeFile('./image/com.png', this.result, function (err) {
            if (err) throw err;
            console.log('Finished');
           
        });
    }
    /**
     * Header 8字节 代表png三个字母
     */
    decodeHeader(): void {
        let buffer = this.readBytes(8);
        let header = U.readString(buffer);console.log(header);
        // let header = this.bufferToString(buffer);
        if ( !/PNG/i.test(header) ) {
            throw new Error('This is not a PNG file');
        }

        this.result = Buffer.concat([this.result, buffer]);
    }
    /**
     * 循环遍历每一个chunk，依次做出相应的处理
     */
    decodeChunk() {
        do {
            let cur_chunk = Buffer.alloc(0);

            let length_buffer = this.readBytes(4);
            let type_buffer = this.readBytes(4);
        
            let length = U.readUInt32(length_buffer);
            let type = U.readString(type_buffer);

            let data_buffer = this.readBytes(length);
            let csc_buffer = this.readBytes(4);

            cur_chunk = Buffer.concat([length_buffer, type_buffer, data_buffer, csc_buffer]);
            console.log('type:', type);
            switch ( type ) {
                case 'IHDR':
                    //console.log(data);
                    this.result = Buffer.concat([this.result, cur_chunk]);
                    this.decodeIHDR(data_buffer);
                    break;
                case 'IDAT':
                    this.result = Buffer.concat([this.result, cur_chunk]);
                    this.decodeIDAT(data_buffer);
                    break;
                case 'IEND':
                    this.result = Buffer.concat([this.result, cur_chunk]);
                    break;
            }
        } while ( this.buffer.length != this.index );
    }


    decodeIHDR(data: Buffer): void {
        let info = this.info;  
        // console.log(U.readUInt32(U.readBytes(data, 0, 4))); return;
        info.width = U.readUInt32(U.readBytes(data, 0, 4));
        info.height = U.readUInt32(U.readBytes(data, 4, 8));
        info.bit_dep = U.readUInt8(U.readBytes(data, 8, 9));
        info.c_type = U.readUInt8(U.readBytes(data, 9, 10));
        info.c_meth = U.readUInt8(U.readBytes(data, 10, 11));
        info.f_meth = U.readUInt8(U.readBytes(data, 11, 12));
        info.i_meth = U.readUInt8(U.readBytes(data, 12, 13));

        //this.result = Buffer.concat([this.result, data]);
 
    }

    decodeIDAT(data: Buffer): void {

    }

}

let i = new Imagify('./image/test2.png');
i.decode();




//console.log(i.readBytes(4));
// let header;
// let IHDR;
// let IDAT;
// let IEND;

// fs.readFile( './image/audio_play.png', (err, data) => {
//     if (err) throw err;
//     header = readBytes(data, 0, 8);
//     IHDR = readBytes(data, 8, 8);
//     console.log(data.readInt32BE(4));
//     console.log(data.length);
//     console.log(data);
//     console.log(findIDAT(data));
// } );

// function decodeHeader () {

// }

// function findIDAT(
//     buffer: Array
// ): number
// {
//     return buffer.indexOf(0x49);
// }

// function readBytes(
//     buffer: Array<number>,
//     begin : number,
//     length: number
// ): Array<number>
// {
//     return Array.prototype.slice.call(buffer, begin, begin + length);
// }

// let test = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];
// console.log(test[0] << 24);
// console.log(test[0+1] << 16);
// console.log(test[0+2] << 8);
// console.log(test[0+3] << 0);

//console.log(String.fromCharCode(137,80,78,71,13,10,26,10));