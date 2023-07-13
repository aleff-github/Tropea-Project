/**
 * Read file line by line, synchronously.
 *
 * Example:
 *
 * var readEachLine = require('read-each-line')
 *
 * readEachLine('test.txt', 'utf8', function(line) {
 *   console.log(line)
 * })
 *
 * Encoding can optionally be omitted, in which case it will default to utf8:
 *
 * readEachLine('test.txt', function(line) {
 *   console.log(line)
 * })
 *
 * End-Of-Line can be specified along with encoding if necessary, otherwise it defaults to your operating system EOF:
 * 
 * readEachLineSync('test.txt', 'utf-8', '\n', function(line) {
 *   console.log(line)
 * })
 * 
 * 
 * Github: https://github.com/gkovacs/read-each-line
 * Author: Geza Kovacs http://www.gkovacs.com/
 * Based on readLineSync https://gist.github.com/Basemm/9700229
 * License: MIT
 */


var fs = require('fs'),
    os = require('os');

/**
 * Get a line from buffer & return it + remaining buffer
 *
 * @param {Buffer} buffer
 */
function getLine(buffer, eol) {
    var i, line, newBuffer, end;

    for(i = 0; i < buffer.length; i++) {
        //detect end of line '\n'
        if ( buffer[i] === 0x0a) {

            end = i;

            if ( eol.length > 1 ) {
                //account for windows '\r\n'
                end = i - 1;
            }

            return {
                line: buffer.slice(0, end).toString(),
                newBuffer: buffer.slice(i + 1)
            }
        }
    }

    return null;
}

/**
 * Read file line by line synchronous
 *
 * @param {String} path
 * @param {String} encoding - "optional" encoding in same format as nodejs Buffer
 * @param {String} eol - "optional" eol, if user wants to specify an End-Of-Line different than the OS
 */
module.exports = function readEachLine(path, encoding, eol, processline) {

    if (typeof(encoding) == 'function') { 
        // no encoding or eol specified, encoding defaults to utf-8 and eol to os.EOL
        processline = encoding;
        encoding = 'utf8';
        eol = os.EOL;
    }else if (typeof(eol) == 'function') { // encoding is specified but eol is not, eol defaults to os.EOL
        processline = eol;
        eol = os.EOL;
    }

    var buf_alloc = function(buf_size) {
      if (Buffer.alloc) {
        return Buffer.alloc(buf_size, encoding=encoding);
      } else {
        return new Buffer(buf_size, encoding=encoding);
      }
    }

    var fsize,
        fd,
        chunkSize = 64 * 1024, //64KB
        bufferSize = chunkSize,
        remainder,
        curBuffer = buf_alloc(0),
        readBuffer,
        numOfLoops;

    if ( !fs.existsSync( path ) ) {
        throw new Error("no such file or directory '" + path + "'");
    }

    fsize = fs.statSync(path).size;

    if ( fsize < chunkSize ) {
        bufferSize = fsize;
    }

    numOfLoops = Math.floor( fsize / bufferSize );
    remainder = fsize % bufferSize;

    fd = fs.openSync(path, 'r');

    for (var i = 0; i < numOfLoops; i++) {
        readBuffer = buf_alloc(bufferSize);

        fs.readSync(fd, readBuffer, 0, bufferSize, bufferSize * i);

        curBuffer = Buffer.concat( [curBuffer, readBuffer], curBuffer.length + readBuffer.length );
        var lineObj;
        while( lineObj = getLine( curBuffer , eol) ) {
            curBuffer = lineObj.newBuffer;
            processline(lineObj.line);
        }
    }

    if ( remainder > 0 ) {
        readBuffer = buf_alloc(remainder);

        fs.readSync(fd, readBuffer, 0, remainder, bufferSize * i);

        curBuffer = Buffer.concat( [curBuffer, readBuffer], curBuffer.length + readBuffer.length );
        var lineObj;
        while( lineObj = getLine( curBuffer , eol ) ) {
            curBuffer = lineObj.newBuffer;
            processline(lineObj.line);
        }
    }

    //return last remainings in the buffer in case
    //it didn't have any more lines
    if ( curBuffer.length ) {
        processline(curBuffer.toString());
    }

    fs.closeSync(fd);
}
