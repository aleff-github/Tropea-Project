
function openMyPage() {
    browser.tabs.create({
        "url": "/tropea.html"
    });
}
browser.browserAction.onClicked.addListener(openMyPage);

let ws;
const SEC_REGEX_WITH_STRICTNODES = /^[a-zA-Z,]{1,20}\$>[a-zA-Z,]{1,20}\$*>*[a-zA-Z]{0,11}\s*1*$/g;

function error_notify(content){
    if(content == null || content == ""){
        content = "Generic error occurred, please retry or report.";
    }
    return browser.notifications.create({
        "type": "basic",
        "iconUrl": browser.extension.getURL("../icons/error.png"),
        "title": "Error!",
        "message": content
    });
}

function connection() {
    ws = new WebSocket("ws://localhost:8095");

    ws.addEventListener("message", message => {
        response = message.data
        if (response == "done") {
            var title = "Done!";
            var content = "Everything is done, close all browser opened, then run your TorBrowser!";
            browser.notifications.create({
                "type": "basic",
                "iconUrl": browser.extension.getURL("../icons/done.png"),
                "title": title,
                "message": content
            });
        } else if (response == "NoPath") {
            alert("Attenction! You must use a correct path!")
        } else if (response.includes("ActualPath")) {
            localStorage.setItem("PATH",response);
            document.getElementById("actualPath").innerHTML = localStorage.getItem("PATH");
        } else if (response == "error") {
            error_notify();
        }
    });
}

if(localStorage.getItem("TROPEA_CONNECTION") == null){
    localStorage.setItem("TROPEA_CONNECTION","active");
}

if(localStorage.getItem("TROPEA_CONNECTION") == "active") {
    document.getElementById("tropeaConnection").checked = true;

    connection();
} else {
    document.getElementById("tropeaConnection").checked = false;
    var functions = document.getElementsByClassName("tropea-function");
    for (let element of functions){
        element.classList.add("opacity");
    }

}

// Tropea Connection
function tropeaConnection() {
    if (document.getElementById("tropeaConnection").checked == true) {
        localStorage.setItem("TROPEA_CONNECTION", "active");
        var functions = document.getElementsByClassName("tropea-function");
        for (let element of functions){
            element.classList.remove("opacity");
        }
        connection()
    } else {
        localStorage.setItem("TROPEA_CONNECTION", "inactive");
        var functions = document.getElementsByClassName("tropea-function");
        for (let element of functions){
            element.classList.add("opacity");
        }
    }
}
document.getElementById("tropeaConnection").addEventListener("change", tropeaConnection);

// TorBrowser Path
function changeTorBrowserPath() {
    newPath = document.getElementById('newTorBrowserPath').value;
    const SEC_TORRC_FILE_PATH_REGEX = /^[\/:a-zA-Z0-9$>]{1,150}$/g;
    if(newPath.match(SEC_TORRC_FILE_PATH_REGEX) != null){
        ws.send("setTorrcFilePath$>" + newPath);
    } else {
        error_notify("Error in path, be sure to use only /:a-zA-Z0-9 charapters");
    }
}

document.getElementById("changeTorBrowserPathButton").addEventListener("click", changeTorBrowserPath);

function checkSetSettingsAndSend(message) {
    if(message.match(SEC_REGEX_WITH_STRICTNODES) != null){
        ws.send(message);
    } else {
        error_notify("Pou probably entered too many arguments in input");
    }
}

// EntryNodes
function changeTorEntryNode() {
    newPath = document.getElementById('entryNodeTor').value;
    message = "setEntryNodes$>" + newPath
    if (document.getElementById("strictNodeEntryNode").checked == true) {
        message += "$>StrictNodes 1"
    }
    checkSetSettingsAndSend(message);
}
document.getElementById("changeTorEntryNodeButton").addEventListener("click", changeTorEntryNode);

// ExitNodes
function changeTorExitNode() {
    exitNode = document.getElementById('exitNodeTor').value;
    message = "setExitNodes$>" + exitNode;
    if (document.getElementById("strictNodeExitNode").checked == true) {
        message += "$>StrictNodes 1";
    }
    checkSetSettingsAndSend(message);
}
document.getElementById("changeTorExitNodeButton").addEventListener("click", changeTorExitNode);

// ExcludeNodes
function changeTorExcludedNodes() {
    excludedNodes = document.getElementById('excludeTorNodes').value;
    message = "setExcludedNodes$>" + excludedNodes
    
    checkSetSettingsAndSend(message);
}
document.getElementById("changeTorExcludedNodesButton").addEventListener("click", changeTorExcludedNodes);

// ExcludeExitNodes
function changeTorExcludedExitNodes() {
    excludedExitNodes = document.getElementById('excludeExitTorNodes').value;
    message = "setExcludedExitNodes$>" + excludedExitNodes

    checkSetSettingsAndSend(message);
}
document.getElementById("changeTorExcludedExitNodesButton").addEventListener("click", changeTorExcludedExitNodes);

// Geo Check
function changeGeoSettings() {
    selection = document.querySelector('input[name="geoIPExcludeUnknownOptions"]:checked').value;
    message = "setGeoIPExcludeUnknown$>" + selection;

    const SEC_GEO_IP_REGEX = /^setGeoIPExcludeUnknown\$>[a-z0-1]{0,4}$/g;
    
    if(message.match(SEC_GEO_IP_REGEX) != null){
        ws.send(message);
    } else {
        console.log(message.match(SEC_GEO_IP_REGEX_YES_NOT))
        console.log(message.match(SEC_GEO_IP_REGEX_AUTO))
        
        error_notify("Invalid argument");
    }
}
document.getElementById("changeGeoIPExcludeUnknownButton").addEventListener("click", changeGeoSettings);

// Relay Check
function checkRelay() {
    browser.tabs.create({
        "url": "https://metrics.torproject.org/rs.html#search/country:it"
    });
}
document.getElementById("checkTorRelay").addEventListener("click", checkRelay);

// Reset
function reset() {
    ws.send("reset")
}
document.getElementById("reset").addEventListener("click", reset);

// Advanced Tropea
function advancedTropea() {
    browser.tabs.create({
        "url": "./AdvancedTropea/index.html"
    });
}
document.getElementById("advancedTropea").addEventListener("click", advancedTropea);

