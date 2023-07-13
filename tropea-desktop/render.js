
const { desktopCaputer, Notification } = require("electron");
const fs = require('fs');
const path = require("path");
const notifier = require('node-notifier');

const NOTIFICATION_TITLE_WRONG_INPUT = 'Wrong Input';
const NOTIFICATION_BODY_WRONG_INPUT = 'An error was detected in: ';
const NOTIFICATION_TITLE_GENERIC_ERROR = "Generic Error";
const NOTIFICATION_TITLE_CORRECT_INPUT = 'All is done!';
const NOTIFICATION_BODY_CORRECT_INPUT = 'Good, you request is satisfied.';
const NOTIFICATION_ICON_CONTENT = "icons/logo.png";
const NOTIFICATION_ICON_CORRECT = "icons/done.png";
const NOTIFICATION_ICON_WRONG = "icons/error.png";
const NOTIFICATION_TITLE_TOR_PATH = "Tor Path";
const NOTIFICATION_SUCCESS_AUTO_BODY_TOR_PATH = "It was possible to detect Tor Browser in the default path.";
const NOTIFICATION_WRONG_AUTO_BODY_TOR_PATH = "Tor Browser could not be detected in the default path.";
const NOTIFICATION_SUCCESS_SELECT_BODY_TOR_PATH = "It was possible to detect Tor Browser in the selected path.";
const NOTIFICATION_WRONG_SELECT_BODY_TOR_PATH = "Tor Browser could not be detected in the selected path.";

var FULL_PATH = {
    torrcPath: "",
    torPath: ""
};

var PATTERN = {
    EntryNodes: "EntryNodes",
    ExitNodes: "ExitNodes",
    ExcludeNodes: "ExcludeNodes",
    ExcludeExitNodes: "ExcludeExitNodes",
    GeoIPExcludeUnknown: "GeoIPExcludeUnknown"
};

var data = {
    TorBrowserPath: "No Data!",
    EntryNodes: "No Data!",
    ExitNodes: "No Data!",
    ExcludeNodes: "No Data!",
    ExcludeExitNodes: "No Data!",
    GeoIPExcludeUnknown: "No Data!"
};


document.getElementById("changeTorBrowserPathButtonSave").addEventListener("click", e => {
    var tmpPath = document.getElementById("newTorBrowserPath").value;
    tmpPath = tmpPath.replace(/\\/g, '/');

    tmpTorPath = '/Tor Browser/Browser/TorBrowser/Data/Tor/torrc';
    tmpTorrcPath = path.join(tmpPath, tmpTorPath);
    try {
        fs.statSync(tmpTorrcPath);
        FULL_PATH.torPath = tmpTorPath;
        FULL_PATH.torrcPath = tmpTorrcPath;
        document.getElementById("newTorBrowserPath").value = FULL_PATH.torPath;
        successSelectPathNotification()
        return
    } catch (err) { }

    tmpTorPath = '/Browser/TorBrowser/Data/Tor/torrc'
    tmpTorrcPath = path.join(tmpPath, tmpTorPath);
    try {
        fs.statSync(tmpTorrcPath);
        FULL_PATH.torPath = tmpTorPath;
        FULL_PATH.torrcPath = tmpTorrcPath;
        document.getElementById("newTorBrowserPath").value = FULL_PATH.torPath;
        successSelectPathNotification()
        return
    } catch (err) {
        wrongSelectPathNotification()
    }
});

document.getElementById("changeTorBrowserPathButtonAuto").addEventListener("click", e => {
    const basePath = process.env.USERPROFILE || process.env.HOME;
    tmpTorPath = path.join(basePath, 'Desktop/Tor Browser/');
    tmpTorrcPath = path.join(tmpTorPath, 'Browser/TorBrowser/Data/Tor/torrc');
    try {
        fs.statSync(tmpTorrcPath);
        FULL_PATH.torPath = tmpTorPath;
        FULL_PATH.torrcPath = tmpTorrcPath;
        document.getElementById("newTorBrowserPath").value = FULL_PATH.torPath;
        successAutoPathNotification()
    } catch (err) {
        wrongAutoPathNotification()
    }
});

document.getElementById("changeTorEntryNodeButton").addEventListener("click", e => {
    message = document.getElementById("entryNodeTor").value;
    pattern = PATTERN.EntryNodes;
    strict = document.getElementById("strictNodeEntryNode").checked;
    setNodesSettings(message, pattern, strict);
});

document.getElementById("changeTorExitNodeButton").addEventListener("click", e => {
    message = document.getElementById("exitNodeTor").value;
    pattern = PATTERN.ExitNodes;
    strict = document.getElementById("strictNodeExitNode").checked;
    setNodesSettings(message, pattern, strict);
});

document.getElementById("changeTorExcludedNodesButton").addEventListener("click", e => {
    message = document.getElementById("excludeTorNodes").value;
    pattern = PATTERN.ExcludeNodes;
    setNodesSettings(message, pattern);
});

document.getElementById("changeTorExcludedExitNodesButton").addEventListener("click", e => {
    message = document.getElementById("excludeExitTorNodes").value;
    pattern = PATTERN.ExcludeExitNodes;
    setNodesSettings(message, pattern);
});

document.getElementById("changeGeoIPExcludeUnknownButton").addEventListener("click", e => {
    message = document.querySelector('input[name="geoIPExcludeUnknownOptions"]:checked').value;
    setGeoIPExcludeUnknown(message);
});


function setGeoIPExcludeUnknown(message) {
    const SEC_GEO_IP_REGEX = /^[a-z0-1]{0,4}$/g;

    if (message.match(SEC_GEO_IP_REGEX) != null) {
        pattern = PATTERN.GeoIPExcludeUnknown;
        payload = "\n" + pattern + " " + message

        // Remove old settings
        removeOldData(pattern);

        // Update file
        addLineToTorrcFile(payload, pattern);
    } else {
        genericErrorNotification("GeoIPExcludeUnknown");
    }
}

function setNodesSettings(message, pattern, strict = false) {

    const SEC_REGEX_WITH_STRICTNODES = /^[a-zA-Z,]{1,20}$/g;
    const nodesDataSplitted = message.split(',');

    if (message.match(SEC_REGEX_WITH_STRICTNODES) != null) {
        newLine = "";
        newLine = "\n" + pattern + " {" + nodesDataSplitted[0] + "}"; // Create initial like: EntryNodes {it} 
        nodesDataSplitted.forEach(function (value) {
            if (value != nodesDataSplitted[0]) {
                newLine += ",{";
                newLine += value;
                newLine += "} ";
            }
        });

        var oldData = getOldData(pattern)
        if (oldData.length != 0) {
            newLine += ",";
            newLine += oldData;
        }

        // StrictNode Setting
        if (strict) {
            newLine += " StrictNodes"
        }

        // Update file
        addLineToTorrcFile(newLine, pattern);
    } else {
        new Notification({
            title: NOTIFICATION_TITLE_WRONG_INPUT,
            body: NOTIFICATION_BODY_WRONG_INPUT + "Tor Browser Path"
        }).show()
    }
}

function removeOldData(pattern) {
    try {
        var lines = fs.readFileSync(FULL_PATH.torrcPath, 'utf8')
            .split('\n')
            .filter(Boolean);
        new_lines = ""
        lines.forEach(function (line, index) {
            if (!line.includes(pattern)) {
                new_lines += lines[index] + "\n";
            }
        });
        fs.writeFile(FULL_PATH.torrcPath, new_lines, (err) => {
            if (err) throw err;
            // console.log('Successfully updated the file!');
        });
    } catch (err) { }
}

function getOldData(pattern) {
    var matchDataOfFunction = [];
    try {
        var lines = fs.readFileSync(FULL_PATH.torrcPath, 'utf8')
            .split('\n')
            .filter(Boolean);
        lines.forEach(function (line) {
            if (line.includes(pattern)) { // Exist
                regexp = /\{(\w+)\}/g;
                matchDataOfFunction = [...line.match(regexp)];
                return matchDataOfFunction;
            }
        });
    } catch (err) {
        // console.log(err); // Debug
    }
    return matchDataOfFunction;
}

function addLineToTorrcFile(newLine, pattern) {
    try {
        torrcFileData = fs.readFileSync(FULL_PATH.torrcPath, 'utf8');
        regex = new RegExp(pattern + '\\s\\{'); // EntryNodes {
        match = torrcFileData.match(regex);

        if (match != null) { // Exist
            var lines = fs.readFileSync(FULL_PATH.torrcPath, 'utf8')
                .split('\n')
                .filter(Boolean);
            lines.forEach(function (line) {
                if (line.includes(pattern)) {
                    var formatted = torrcFileData.replace(line, newLine);
                    fs.writeFile(FULL_PATH.torrcPath, formatted, 'utf8', function (err) {
                        if (err) {
                            genericErrorNotification(err);
                            return;
                        }
                    });
                }
            });
        } else {
            fs.appendFile(FULL_PATH.torrcPath, newLine, (err) => {
                if (err) {
                    genericErrorNotification(err);
                    return;
                }
            });
        }
    } catch (err) {
        genericErrorNotification(err);
        return;
    }
    successSettingsChangeNotification();
    return;
}

function genericErrorNotification(addition = "") {
    notifier.notify({
        title: NOTIFICATION_TITLE_GENERIC_ERROR,
        body: NOTIFICATION_BODY_WRONG_INPUT + " Add line to file torrc function.\n" + addition,
        icon: NOTIFICATION_ICON_WRONG,
        sound: true
    });
}

function successSettingsChangeNotification(addition = "") {
    notifier.notify({
        title: NOTIFICATION_TITLE_CORRECT_INPUT,
        message: NOTIFICATION_BODY_CORRECT_INPUT + "\n" + addition,
        icon: NOTIFICATION_ICON_CORRECT,
        sound: true
    });
}

function successAutoPathNotification() {
    notifier.notify({
        title: NOTIFICATION_TITLE_TOR_PATH,
        message: NOTIFICATION_SUCCESS_AUTO_BODY_TOR_PATH,
        icon: path.join(__dirname, NOTIFICATION_ICON_CORRECT),
        sound: true
    });
}

function wrongAutoPathNotification(addition = "") {
    notifier.notify({
        title: NOTIFICATION_TITLE_TOR_PATH,
        message: NOTIFICATION_WRONG_AUTO_BODY_TOR_PATH,
        icon: path.join(__dirname, NOTIFICATION_ICON_WRONG),
        sound: true
    });
}

function successSelectPathNotification() {
    notifier.notify({
        title: NOTIFICATION_TITLE_TOR_PATH,
        message: NOTIFICATION_SUCCESS_SELECT_BODY_TOR_PATH,
        icon: path.join(__dirname, NOTIFICATION_ICON_CORRECT),
        sound: true
    });
}

function wrongSelectPathNotification() {
    notifier.notify({
        title: NOTIFICATION_TITLE_TOR_PATH,
        message: NOTIFICATION_WRONG_SELECT_BODY_TOR_PATH,
        icon: path.join(__dirname, NOTIFICATION_ICON_WRONG),
        sound: true
    });
}