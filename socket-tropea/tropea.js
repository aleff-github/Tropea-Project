const WebSocket = require("ws");
var fs = require('fs');

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
            setNodesSettings(ws, message, PATTERN.EntryNodes);
        } else if (message.includes("setExitNodes")) {
            setNodesSettings(ws, message, PATTERN.ExitNodes);
        } else if (message.includes("setExcludedNodes")) {
            setNodesSettings(ws, message, PATTERN.ExcludeNodes);
        } else if (message.includes("setExcludedExitNodes")) {
            setNodesSettings(ws, message, PATTERN.ExcludeExitNodes);
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
        fs.truncate(path.torrcPath, 0, function () {
            console.log('[+] Resetted!');
        });
    } catch {
        ws.send("error");
    }
    ws.send("done");
}

/**Change GeoIPExcludeUnknown for tor network
 * syntax example
 *  GeoIPExcludeUnknown 1
 */
function setGeoIPExcludeUnknown(ws, message) {
    const geoIPExcludeUnknown = message.split('$>');

    const selection = geoIPExcludeUnknown[1].split(',');
    stringToBeSent = "\n" + PATTERN.GeoIPExcludeUnknown + " " + selection

    // Update file
    addLineToTorrcFile(ws, stringToBeSent, PATTERN.GeoIPExcludeUnknown);
}

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

                toBeRemovedRegex = toBeRemoved.replace("}", "\\}")

                torrcFileData = fs.readFileSync(path.torrcPath, 'utf8');
                conditionOne = new RegExp(toBeRemovedRegex + ',');
                conditionTwo = new RegExp(',' + toBeRemovedRegex);

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
            //console.log("[.]" + line)
            if (line.startsWith(PATTERN.EntryNodes)) {
                //console.log("[@]" + line)
                data.EntryNodes = line;
            } else if (line.startsWith(PATTERN.ExitNodes)) {
                // console.log("[*]" + line)
                data.ExitNodes = line;
            } else if (line.startsWith(PATTERN.ExcludeNodes)) {
                //  console.log("[+]" + line)
                data.ExcludeNodes = line;
            } else if (line.startsWith(PATTERN.ExcludeExitNodes)) {
                // console.log("[-]" + line)
                data.ExcludeExitNodes = line;
            } else if (line.startsWith(PATTERN.GeoIPExcludeUnknown)) {
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

function getOldData(pattern) {
    var matchDataOfFunction = [];
    try {
        var lines = fs.readFileSync(path.torrcPath, 'utf8')
            .split('\n')
            .filter(Boolean);
        lines.forEach(function (line) {
            if (line.includes(pattern)) { // Exist
                regexp = /\{(\w+)\}/g;
                matchDataOfFunction = [...line.match(regexp)];
                return matchDataOfFunction;
            }
        });
    } catch (err) { console.log(err); }
    return matchDataOfFunction;
}

function addLineToTorrcFile(ws, newLine, pattern) {
    try {
        torrcFileData = fs.readFileSync(path.torrcPath, 'utf8');
        regex = new RegExp(pattern + '\\s\\{'); // EntryNodes {
        match = torrcFileData.match(regex);

        if (match != null) { // Exist
            var lines = fs.readFileSync(path.torrcPath, 'utf8')
                .split('\n')
                .filter(Boolean);
            lines.forEach(function (line) {
                if (line.includes(pattern)) {
                    var formatted = torrcFileData.replace(line, newLine);
                    fs.writeFile(path.torrcPath, formatted, 'utf8', function (err) {
                        if (err) {
                            ws.send("error");
                            return;
                        }
                    });
                }
            });
        } else {
            fs.appendFile(path.torrcPath, newLine, (err) => {
                if (err) {
                    ws.send("error");
                    return;
                }
            });
        }
    } catch (err) {
        ws.send("error");
        return;
    }
    ws.send("done");
    return;
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
            // exec("curl ifconfig.me", (error, stdout, stderr) => {
            //     ws.send(`RealIP$>${stdout}`);
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

function setNodesSettings(ws, message, pattern) {
    // Split for get data
    const getNewData = message.split('$>');
    // Split node by node the user input
    const nodesDataSplitted = getNewData[1].split(',');
    newLine = "";

    if (nodesDataSplitted.length != 0) { // No data
        newLine = "\n" + pattern + " {" + nodesDataSplitted[0] + "}"; // Create initial like: EntryNodes {it} 
        nodesDataSplitted.forEach(function (value) {
            if (value != nodesDataSplitted[0]) {
                newLine += ",{";
                newLine += value;
                newLine += "} ";
            }
        });

        var oldData = getOldData(pattern)
        console.log("Debug 4 " + oldData)
        console.log("Debug 5 " + newLine)
        if (oldData.length != 0) {
            newLine += ",";
            newLine += oldData;
        }
        console.log("Debug 6 " + newLine)
    }

    // StrictNode Setting
    if (getNewData[2] != undefined) {
        newLine += " " + getNewData[2]
    }

    // Update file
    addLineToTorrcFile(ws, newLine, pattern);
}