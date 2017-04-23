
let slice = Array.prototype.slice;

export function readBytes(
    buffer: Buffer, 
    begin: number, 
    end: number): Buffer 
{
    return Buffer.from(slice.call(buffer, begin, end));
}

export function readUInt32(buffer: Buffer, offset: number=0): number {
    return buffer.readUInt32BE(offset);
}

export function readUInt16(buffer: Buffer, offset: number=0): number {
    return buffer.readUInt16BE(offset);
}

export function readUInt8(buffer: Buffer, offset: number=0): number {
    return buffer.readUInt8(offset);
}

export function readString(buffer: Buffer): string {
    let str = '';
    for (let i = 0; i < buffer.length; i++) {
        str += String.fromCharCode(buffer[i]);
    }
    return str;
}


( function () {
    if ( !Function.prototype.curry ) {
        Function.prototype.curry = function () {
            let fn = this;
            let args = slice.call( arguments );

            return function() {
                fn.apply(this, args.concat( 
                    slice.call( arguments )
                 ) );
            }
        }
    }
} )();