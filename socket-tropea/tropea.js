// #!/usr/bin/node

const WebSocket = require("ws");
// const request = require('request');

var path = {
    torrcPath: "",
    torPath: ""
};

var data = {
    TorBrowserPath: "No Data!",
    EntryNodes: "No Data!",
    ExitNodes: "No Data!",
    ExcludeNodes: "No Data!",
    ExcludeExitNodes: "No Data!",
    GeoIPExcludeUnknown: "No Data!"
};

var PATTERN = {
    EntryNodes: "EntryNodes",
    ExitNodes: "ExitNodes",
    ExcludeNodes: "ExcludeNodes",
    ExcludeExitNodes: "ExcludeExitNodes",
    GeoIPExcludeUnknown: "GeoIPExcludeUnknown"
};

const ws = new WebSocket.Server({ port: 8082 });

ws.on("connection", ws => {
    console.log("Client connected!");
    ws.send("ActualPath " + path.torPath);

    ws.on("message", data => {
        message = `${data}`;
        console.log(message);
        ws.send("ActualPath " + path.torPath);

        if (path.torrcPath == "" && !message.includes("setTorrcFilePath")) {
            ws.send("NoPath");
        } else if (message.includes("setTorrcFilePath")) {
            setTorrcFilePath(message);
            ws.send("ActualPath " + path.torPath)
            ws.send("done");
        } else if (message == "reset") {
            reset(ws);
        } else if (message.includes("setEntryNodes")) {
            setEntryNodes(ws, message);
        } else if (message.includes("setExitNodes")) {
            setExitNodes(ws, message);
        } else if (message.includes("setExcludedNodes")) {
            setExcludedNodes(ws, message);
        } else if (message.includes("setExcludedExitNodes")) {
            setExcludedExitNodes(ws, message);
        } else if (message.includes("setGeoIPExcludeUnknown")) {
            setGeoIPExcludeUnknown(ws, message)
        } else if (message.includes("getAllSettings")) {
            generateAllSettings(ws);
        } else if (message.includes("remove")) {
            removeElementFromTropeaAdvanced(ws, message);
        } else if (message.includes("getRealIP")) {
            getAndSendIP(ws, true);
        } else if (message.includes("getTorifiedIp")) {
            getAndSendIP(ws, false);
        } else if (message.includes("torifyApp")) {
            torifyApp(ws, message);
        } else {
            console.log(`Client has sent us: ${data}`);
        }
    });

    ws.on("close", () => {
        console.log("Client has disconected!");
    });


});

// Execute command in shell
const { exec } = require("child_process");


/**Set Torrc File Path */
function setTorrcFilePath(message) {
    const getPath = message.split('$>', 2);
    path.torrcPath = getPath[1];
    const regex = /\\/g;
    path.torrcPath.replace(regex, '/');
    path.torPath = path.torrcPath
    if (path.torPath.slice(path.torPath.length - 1) == "/") {
        path.torrcPath += "Browser/TorBrowser/Data/Tor/torrc";
    } else {
        path.torrcPath += "/Browser/TorBrowser/Data/Tor/torrc";
    }
}



/**Reset function */
function reset(ws) {
    try {
        var fs = require('fs');
        fs.truncate(path.torrcPath, 0, function () {
            console.log('[+] Resetted!');
        });
    } catch {
        ws.send("error");
        return;
    }
    ws.send("done");
}

/**Change entry node for tor network
 * syntax example
 * EntryNodes {ca},{eg} StrictNodes 1
 */
function setEntryNodes(ws, message) {
    const getEntryNodes = message.split('$>');
    const entryNodeList = getEntryNodes[1].split(',');

    stringToBeSent = "";

    if (entryNodeList.length != 0) {
        stringToBeSent = "\nEntryNodes {" + entryNodeList[0] + "}";
        entryNodeList.forEach(function (value) {
            if (value != entryNodeList[0]) {
                stringToBeSent += ",{";
                stringToBeSent += value;
                stringToBeSent += "} ";
            }
        });

        var oldData = getOldData("EntryNodes")

        if (oldData.length != 0) {
            stringToBeSent += ",";
            stringToBeSent += oldData;
        }
    }

    // StrictNode Setting
    if (getEntryNodes[2] != undefined) {
        stringToBeSent += " " + getEntryNodes[2]
    }

    // Update file
    addLineToTorrcFile(ws, stringToBeSent, 1, "EntryNodes");
}

/**Change exit node for tor network
 * syntax example
 * ExitNodes {ca},{eg} StrictNodes 1
 */
function setExitNodes(ws, message) {
    const getExitNodes = message.split('$>');
    const exitNodeList = getExitNodes[1].split(',');
    
    stringToBeSent = "";

    if (exitNodeList.length != 0) {
        stringToBeSent = "\nExitNodes {" + exitNodeList[0] + "}";
        exitNodeList.forEach(function (value) {
            if (value != exitNodeList[0]) {
                stringToBeSent += ",{";
                stringToBeSent += value;
                stringToBeSent += "} ";
            }
        });

        var oldData = getOldData("ExitNodes")

        if (oldData.length != 0) {
            stringToBeSent += ",";
            stringToBeSent += oldData;
        }
    }
    // StrictNode Setting
    if (getExitNodes[2] != undefined) {
        stringToBeSent += " " + getExitNodes[2]
    }

    // Update file
    addLineToTorrcFile(ws, stringToBeSent, 1, "ExitNodes");
}

/**Change excluded nodes for tor network
 * syntax example
 * ExcludeNodes {ca},{eg}
 */
function setExcludedNodes(ws, message) {
    const getExcludedNodes = message.split('$>');

    const excludedNodeList = getExcludedNodes[1].split(',');
    stringToBeSent = "\nExcludeNodes {" + excludedNodeList[0] + "}";
    excludedNodeList.forEach(function (value) {
        if (value != excludedNodeList[0]) {
            stringToBeSent += ",{";
            stringToBeSent += value;
            stringToBeSent += "} ";
        }
    });

    var oldData = getOldData("ExcludeNodes")

    if (oldData.length != 0) {
        stringToBeSent += ",";
        stringToBeSent += oldData;
    }

    // Update file
    addLineToTorrcFile(ws, stringToBeSent, 1, "ExcludeNodes");
}

/**Change excluded exit nodes for tor network
 * syntax example
 *  ExcludeExitNodes {ca},{eg}
 */
function setExcludedExitNodes(ws, message) {
    const getExcludedExitNodes = message.split('$>');

    // ExcludeExitNodes Settings
    // excludedNodes = getExcludedExitNodes[1];
    const excludedExitNodeList = getExcludedExitNodes[1].split(',');
    stringToBeSent = "\nExcludeExitNodes {" + excludedExitNodeList[0] + "}";
    excludedExitNodeList.forEach(function (value) {
        if (value != excludedExitNodeList[0]) {
            stringToBeSent += ",{";
            stringToBeSent += value;
            stringToBeSent += "} ";
        }
    });

    var oldData = getOldData("ExcludeExitNodes")

    if (oldData.length != 0) {
        stringToBeSent += ",";
        stringToBeSent += oldData;
    }

    // Update file
    addLineToTorrcFile(ws, stringToBeSent, 1);
}

/**Change GeoIPExcludeUnknown for tor network
 * syntax example
 *  GeoIPExcludeUnknown 1
 */
function setGeoIPExcludeUnknown(ws, message) {
    const geoIPExcludeUnknown = message.split('$>');

    const selection = geoIPExcludeUnknown[1];
    stringToBeSent = "\nGeoIPExcludeUnknown " + selection;

    // Update file
    addLineToTorrcFile(ws, stringToBeSent, 1, "GeoIPExcludeUnknown");
}

/**
 * Advanced Tropea Function
 */

/**Remove function */
function removeElementFromTropeaAdvanced(ws, message) {

    messageSplitted = message.split("$>", 2);
    pattern = messageSplitted[1];
    console.log("[+]" + pattern)

    if (pattern.includes("TorBrowserPath")) {
        path.torPath = "";
        path.torrcPath = "";
    } else if ((pattern.includes("EntryNodes") && !pattern.includes("StrictNodes")) ||
        (pattern.includes("ExitNodes") && !pattern.includes("StrictNodes")) ||
        pattern.includes("ExcludeNodes") || pattern.includes("ExcludeExitNodes")) {
        // Accept online like EntryNodes_{it}
        tmp = pattern.split("_", 2);
        pattern = tmp[0];
        toBeRemoved = tmp[1];

        const lineReader = require('read-each-line-sync');
        lineReader(path.torrcPath, 'utf8', function (line) {
            if (line.includes(pattern)) {

                var fs = require('fs');
                toBeRemovedRegex = toBeRemoved.replace("}", "\\}")

                torrcFileData = fs.readFileSync(path.torrcPath, 'utf8');
                conditionOne = new RegExp(toBeRemovedRegex + ',');
                conditionTwo = new RegExp(',' + toBeRemovedRegex);
                conditionFive = new RegExp(' ' + toBeRemovedRegex + ' ');

                /**
                 * Le possibili condizioni sono molteplici:
                 * 
                 * 1. EntryNodes {aa},{bb} StrictNodes 1
                 *      Se si vuole eliminare {aa} dobbiamo assicurarci di eliminare
                 *      anche la virgola per evitare questa situazione 
                 *      EntryNodes ,{bb} StrictNodes 1
                 * 2. EntryNodes {aa},{bb} StrictNodes 1
                 *      Se si vuole eliminare {bb} dobbiamo assicurarci di eliminare
                 *      anche la virgola per evitare questa situazione
                 *      EntryNodes {aa}, StrictNodes 1
                 * 3. EntryNodes {aa},{bb},{cc} StrictNodes 1
                 *      Se si vuole eliminare {bb} in questo caso ci basterà una
                 *      delle due condizioni precedenti visto che il risultato
                 *      sarà uguale EntryNodes {aa},{cc} StrictNodes 1
                 * 4. ExcludeNodes {aa},{bb}
                 *      In questo caso se si vuole eliminare {bb} , sapendo che
                 *      non c'è StrictNodes dobbiamo essere certi che il 
                 *      il punto 2 venga attivato, viceversa con {aa} e 
                 *      il punto 1
                 * 5. EntryNodes {aa} StrictNodes 1
                 *      Volendo eliminare {aa} in questa situazioni dobbiamo
                 *      essere certi di eliminare completamente tutta la righa
                 *      per evitare questa situaizone 
                 *      EntryNodes StrictNodes 1 che causerebbe un errore
                 *      limitante all'apertura di TorBrowser 
                 */

                var lineToChange = "";

                if (line.match(conditionOne)) {
                    lineToChange = line.replace(toBeRemoved + ",", '');
                    formatted = torrcFileData.replace(line, lineToChange);
                } else if (line.match(conditionTwo)) {
                    lineToChange = line.replace("," + toBeRemoved, '');
                    formatted = torrcFileData.replace(line, lineToChange);
                }

                var formatted = torrcFileData.replace(line, lineToChange);

                fs.writeFile(path.torrcPath, formatted, 'utf8', function (err) {
                    if (err) {
                        console.log(err);
                        ws.send("error");
                    } else {
                        ws.send("done");
                    }
                });
            }
        });
    } else if (pattern.includes("StrictNodes")) {
        tmp = pattern.split("_", 2);
        pattern = tmp[0];
        toBeRemoved = tmp[1];

        const lineReader = require('read-each-line-sync');
        lineReader(path.torrcPath, 'utf8', function (line) {
            if (line.includes(pattern)) {
                var fs = require('fs');
                torrcFileData = fs.readFileSync(path.torrcPath, 'utf8');
                var lineToChange = line.replace(toBeRemoved, '');
                var formatted = torrcFileData.replace(line, lineToChange);
                fs.writeFile(path.torrcPath, formatted, 'utf8', function (err) {
                    if (err) {
                        console.log(err);
                        ws.send("error");
                    } else {
                        ws.send("done");
                    }
                });
            }
        });
    }

}

function generateAllSettings(ws) {

    resetData();

    data.TorBrowserPath = path.torPath;

    try {

        const lineReader = require('read-each-line-sync');
        lineReader(path.torrcPath, 'utf8', function (line) {
            if (line.includes(PATTERN.EntryNodes)) {
                data.EntryNodes = line;
            } else if (line.includes(PATTERN.ExcludeExitNodes)) {
                data.ExcludeExitNodes = line;
            } else if (line.includes(PATTERN.ExcludeNodes)) {
                data.ExcludeNodes = line;
            } else if (line.includes(PATTERN.ExitNodes)) {
                data.ExitNodes = line;
            } else if (line.includes(PATTERN.GeoIPExcludeUnknown)) {
                data.GeoIPExcludeUnknown = line;
            }
        });

    } catch (err) { console.log(err); }

    ws.send(JSON.stringify(data))

}

function resetData() {
    data.TorBrowserPath = "No Data!";
    data.EntryNodes = "No Data!";
    data.ExcludeExitNodes = "No Data!";
    data.ExcludeNodes = "No Data!";
    data.ExitNodes = "No Data!";
    data.GeoIPExcludeUnknown = "No Data!";

}


/**
 * 
 * GENERAL FUNCTION
 */

function getOldData(pattern) {
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
function addLineToTorrcFile(ws, lineToAdd, type, pattern) {

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
            if(pattern == "GeoIPExcludeUnknown"){
                regex = new RegExp(pattern);
            } else {
                regex = new RegExp(pattern + '\\s\\{');
            }
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
                    if (err) {
                        console.log(err);
                        ws.send("error");
                        return;
                    }
                });
            }
        } catch (err) {
            console.error(err);
            ws.send("error");
            return;
        }
    }
    ws.send("done");
}

/**
 * Torify Function
 */


function getAndSendIP(ws, realOrTorified) {
    const { exec } = require("child_process");
    var opsys = process.platform;
    if (realOrTorified) {
        if (opsys == "darwin") {
            // exec("ls -la", (error, stdout, stderr) => {
            //     console.log(`stdout: ${stdout}`);
            // });
        } else if (opsys == "win32" || opsys == "win64") {
            // exec("ls -la", (error, stdout, stderr) => {
            //     console.log(`stdout: ${stdout}`);
            // });
        } else if (opsys == "linux") {
            exec("curl ifconfig.me 2> /dev/null", (error, stdout, stderr) => {
                ws.send(`RealIP$>${stdout}`);
            });
        }
    } else {
        if (opsys == "darwin") {
            // exec("ls -la", (error, stdout, stderr) => {
            //     console.log(`stdout: ${stdout}`);
            // });
        } else if (opsys == "win32" || opsys == "win64") {
            // exec("ls -la", (error, stdout, stderr) => {
            //     console.log(`stdout: ${stdout}`);
            // });
        } else if (opsys == "linux") {
            exec("torify curl ifconfig.me 2> /dev/null", (error, stdout, stderr) => {
                ws.send(`TorifiedIP$>${stdout}`);
            });
        }
    }
}

function torifyApp(ws, message) {
    messageSplitted = message.split("$>", 2);
    path = messageSplitted[1];
    const { exec } = require("child_process");
    var opsys = process.platform;
    if (opsys == "darwin") {
        // exec("ls -la", (error, stdout, stderr) => {
        //     console.log(`stdout: ${stdout}`);
        // });
    } else if (opsys == "win32" || opsys == "win64") {
        ws.send("TorifiedAPP$>Windows");
    } else if (opsys == "linux") {
        exec("torify " + path + " 2> /dev/null", (error, stdout, stderr) => {
            ws.send(`TorifiedAPP$>${stdout}`);
        });
    }

}
