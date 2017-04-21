var fs = require('fs');
//var _ = require('lodash');

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
let slice = Array.prototype.slice;

class Imagify {

    constructor( file: string ) {
        this.index = 0;
        this.buffer = fs.readFileSync( file );
    }

    readBytes ( length: number ): Array<number> {

        let bytes = slice.call(this.buffer, this.index, this.index + length);
        this.index += length;
        return Buffer.from(bytes);

    }

    bufferToString ( buffer: Array<number> ): string {

        let str = '';
        for ( let i=0; i<buffer.length; i++ ) {
            str += String.fromCharCode(buffer[i]);
        }
        return str;

    }

    decode() {
        this.decodeHeader();
        this.decodeChunk();
    }

    decodeHeader() {
        let header = i.readBytes(8);
    }

    decodeChunk() {
        //tip: 获取某个chunk的length
        let IHDR_LENGTH = i.readBytes(4).readInt32BE();
        let type = i.readBytes(4);
        let data = i.readBytes(IHDR_LENGTH);
        let csc = i.readBytes(4);
    }

    log () {
        console.log(this.buffer);
    }

}

let i = new Imagify('./image/audio_play.png');





console.log(i.readBytes(4));
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