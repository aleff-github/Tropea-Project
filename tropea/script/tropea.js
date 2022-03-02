function openMyPage() {
    browser.tabs.create({
        "url": "/tropea.html"
    });
}
browser.browserAction.onClicked.addListener(openMyPage);

const ws = new WebSocket("ws://localhost:8082");

ws.addEventListener("open", () => { });

ws.addEventListener("close", () => { });

ws.addEventListener("message", message => {
    response = message.data
    if (response == "done") {
        var title = "Done!";
        var content = "Everything is done, close all browser opened, then run your TorBrowser!";
        browser.notifications.create({
            "type": "basic",
            "iconUrl": browser.extension.getURL("https://img.icons8.com/flat-round/48/000000/checkmark.png"),
            "title": title,
            "message": content
        });
    } else if (response == "NoPath") {
        alert("Attenction! You must use a correct path!")
    } else if (response.includes("ActualPath")) {
        document.getElementById("actualPath").innerHTML = response;
    } else if (response == "NoPath") {
        var title = "Error!";
        var content = "An error is occurred!";
        browser.notifications.create({
            "type": "basic",
            "iconUrl": browser.extension.getURL("https://img.icons8.com/flat-round/48/000000/checkmark.png"),
            "title": title,
            "message": content
        });
    }
});

// TorBrowser Path
function changeTorBrowserPath() {
    newPath = document.getElementById('newTorBrowserPath').value;
    ws.send("setTorrcFilePath$>" + newPath)
}

document.getElementById("changeTorBrowserPathButton").addEventListener("click", changeTorBrowserPath);

// EntryNodes
function changeTorEntryNode() {
    newPath = document.getElementById('entryNodeTor').value;

    if (document.getElementById("strictNodeEntryNode").checked == true) {
        ws.send("setEntryNodes$>" + newPath + "$>StrictNodes 1")
    } else {
        ws.send("setEntryNodes$>" + newPath) //+ "$>StrictNodes 0")
    }

}
document.getElementById("changeTorEntryNodeButton").addEventListener("click", changeTorEntryNode);

// ExitNodes
function changeTorExitNode() {
    exitNode = document.getElementById('exitNodeTor').value;

    if (document.getElementById("strictNodeExitNode").checked == true) {
        ws.send("setExitNodes$>" + exitNode + "$>StrictNodes 1")
    } else {
        ws.send("setExitNodes$>" + exitNode) //+ "$>StrictNodes 0")
    }
}
document.getElementById("changeTorExitNodeButton").addEventListener("click", changeTorExitNode);

// ExcludeNodes
function changeTorExcludedNodes() {
    excludedNodes = document.getElementById('excludeTorNodes').value;
    ws.send("setExcludedNodes$>" + excludedNodes)

}
document.getElementById("changeTorExcludedNodesButton").addEventListener("click", changeTorExcludedNodes);

// ExcludeExitNodes
function changeTorExcludedExitNodes() {
    excludedExitNodes = document.getElementById('excludeExitTorNodes').value;
    ws.send("setExcludedExitNodes$>" + excludedExitNodes)

}
document.getElementById("changeTorExcludedExitNodesButton").addEventListener("click", changeTorExcludedExitNodes);

// Geo Check
function changeGeoSettings() {
    selection = document.querySelector('input[name="geoIPExcludeUnknownOptions"]:checked').value;
    ws.send("setGeoIPExcludeUnknown$>" + selection)
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

