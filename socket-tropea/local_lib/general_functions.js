
module.exports = {
    debug,
    getOldData,
    addLineToTorrcFile
    };

function debug(a, b) {
    return a + b;
}

function getOldData(pattern, path) {
    var matchDataOfFunction = [];
    var fs = require('fs');
    try {
        torrcFileData = fs.readFileSync(path.torrcPath, 'utf8');
        regex = new RegExp(pattern + '\\s\\{');
        match = torrcFileData.match(regex);
        if (match != null) { // Exist

            const lineReader = require('read-each-line-sync');
            lineReader(path.torrcPath, 'utf8', function (line) {
                if (line.includes(pattern)) {
                    regexp = /\{(\w+)\}/g;
                    matchDataOfFunction = [...line.match(regexp)];
                    return matchDataOfFunction;
                }
            });
        }
    } catch (err) { console.log(err); }
    return matchDataOfFunction;
}

/*
    Type:
        0: Simple add

        1: Add for the following patter
            setEntryNodes
            setExitNodes
            setExcludedNodes
            setExcludedExitNodes

        2: setGeoIPExcludeUnknown
*/
function addLineToTorrcFile(lineToAdd, type, pattern, path) {

    var fs = require('fs');

    // nothing more than to add
    if (type == 0) {
        // console.log(path.torrcPath)
        fs.appendFile(path.torrcPath, lineToAdd, (err) => {
            if (err) console.log(err);
        });
    } else if (type == 1) {
        // verify if exist, then get data and merge info
        // Receive something like this
        // ExitNodes {ca},{eg} StrictNodes 1
        // Algorithm:
        // 1. Find if exist
        // 2. Get old info
        // 3. Merge old with new data
        // 4. Override data

        try {
            torrcFileData = fs.readFileSync(path.torrcPath, 'utf8');
            regex = new RegExp(pattern + '\\s\\{'); // /(${matchedTorrcFunction})\s\{/;
            match = torrcFileData.match(regex);

            if (match != null) { // Exist
                const lineReader = require('read-each-line-sync');
                lineReader(path.torrcPath, 'utf8', function (line) {
                    if (line.includes(pattern)) {
                        var formatted = torrcFileData.replace(line, lineToAdd);
                        fs.writeFile(path.torrcPath, formatted, 'utf8', function (err) {
                            if (err) console.log(err);
                        });
                    }
                });

            }
            else {
                fs.appendFile(path.torrcPath, lineToAdd, (err) => {
                    if (err) console.log(err);
                });
            }
        } catch (err) {
            console.error(err);
        }
    }
}