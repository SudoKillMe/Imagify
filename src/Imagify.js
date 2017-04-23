"use strict";
exports.__esModule = true;
var fs = require('fs');
//var _ = require('lodash');
var U = require("./Util.js");
var Imagify = (function () {
    function Imagify(file) {
        this.info = {
            width: 0,
            height: 0,
            bit_dep: 0,
            c_type: 0,
            c_meth: 0,
            f_meth: 0,
            i_meth: 0
        };
        this.handle = {
            'IHDR': function (data) {
                var read = U.readBytes.curry(data);
                console.log(read(0, 4));
            },
            'IDAT': function (data) { },
            'IEND': function (data) { }
        };
        this.index = 0;
        this.result = Buffer.alloc(0);
        this.buffer = fs.readFileSync(file);
    }
    Imagify.prototype.readBytes = function (length) {
        var bytes = U.readBytes(this.buffer, this.index, this.index += length);
        // let bytes = slice.call(this.buffer, this.index, this.index + length);
        //this.index += length;
        return Buffer.from(bytes);
    };
    // bufferToString ( buffer: Buffer ): string {
    //     let str = '';
    //     for ( let i=0; i<buffer.length; i++ ) {
    //         str += String.fromCharCode(buffer[i]);
    //     }
    //     return str;
    // }
    Imagify.prototype.decode = function () {
        console.log('before', this.buffer.length);
        this.decodeHeader();
        this.decodeChunk();
        //console.log(this.result);
        console.log('after:', this.result.length);
        fs.writeFile('./image/com.png', this.result, function (err) {
            if (err)
                throw err;
            console.log('Finished');
        });
    };
    /**
     * Header 8字节 代表png三个字母
     */
    Imagify.prototype.decodeHeader = function () {
        var buffer = this.readBytes(8);
        var header = U.readString(buffer);
        console.log(header);
        // let header = this.bufferToString(buffer);
        if (!/PNG/i.test(header)) {
            throw new Error('This is not a PNG file');
        }
        this.result = Buffer.concat([this.result, buffer]);
    };
    /**
     * 循环遍历每一个chunk，依次做出相应的处理
     */
    Imagify.prototype.decodeChunk = function () {
        do {
            var cur_chunk = Buffer.alloc(0);
            var length_buffer = this.readBytes(4);
            var type_buffer = this.readBytes(4);
            var length_1 = U.readUInt32(length_buffer);
            var type = U.readString(type_buffer);
            var data_buffer = this.readBytes(length_1);
            var csc_buffer = this.readBytes(4);
            cur_chunk = Buffer.concat([length_buffer, type_buffer, data_buffer, csc_buffer]);
            console.log('type:', type);
            this.handle[type](data_buffer);
            // switch ( type ) {
            //     case 'IHDR':
            //         //console.log(data);
            //         this.result = Buffer.concat([this.result, cur_chunk]);
            //         this.decodeIHDR(data_buffer);
            //         break;
            //     case 'IDAT':
            //         this.result = Buffer.concat([this.result, cur_chunk]);
            //         this.decodeIDAT(data_buffer);
            //         break;
            //     case 'IEND':
            //         this.result = Buffer.concat([this.result, cur_chunk]);
            //         break;
            // }
        } while (this.buffer.length != this.index);
    };
    Imagify.prototype.decodeIHDR = function (data) {
        var info = this.info;
        var read = U.readBytes.curry(data);
        console.log(read);
        // console.log(U.readUInt32(U.readBytes(data, 0, 4))); return;
        info.width = U.readUInt32(U.readBytes(data, 0, 4));
        info.height = U.readUInt32(U.readBytes(data, 4, 8));
        info.bit_dep = U.readUInt8(U.readBytes(data, 8, 9));
        info.c_type = U.readUInt8(U.readBytes(data, 9, 10));
        info.c_meth = U.readUInt8(U.readBytes(data, 10, 11));
        info.f_meth = U.readUInt8(U.readBytes(data, 11, 12));
        info.i_meth = U.readUInt8(U.readBytes(data, 12, 13));
        //this.result = Buffer.concat([this.result, data]);
    };
    Imagify.prototype.decodeIDAT = function (data) {
    };
    return Imagify;
}());
var i = new Imagify('./image/test2.png');
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
