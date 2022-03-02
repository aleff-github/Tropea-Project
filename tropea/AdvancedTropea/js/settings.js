
const ws = new WebSocket("ws://localhost:8082");

ws.addEventListener("open", () => {
    ws.send("getAllSettings");
});

ws.addEventListener("close", () => { });

// ws.addEventListener("message", message => {
//     alert()
// });

ws.onmessage = function (event) {
    e = event;
    if (e.data.includes("done")) {
        alert("done")
        location.reload();
    } else if (e.data.includes("error")) {
        alert("error")
    } else if (e.data.includes("RealIP")) {
        updateRealIP(e.data);
    } else if (e.data.includes("TorifiedIP")) {
        updateTorifiedIP(e.data);
    } else if (e.data.includes("TorifiedAPP")) {
        console.log("[+] " + e.data);
    } else {

        if (!e.data.includes("EntryNodes")) return

        var data = JSON.parse(e.data);
        var table = document.getElementById("settings-table");

        // torBrowserPathRow = data.TorBrowserPath
        // document.getElementById("settingsTable").append()
        includeOneLineData(data.TorBrowserPath, "TorBrowserPath", table);

        includeEntryNodesLike(data.EntryNodes, "EntryNodes", table);
        includeEntryNodesLike(data.ExitNodes, "ExitNodes", table);
        includeEntryNodesLike(data.ExcludeNodes, "ExcludeNodes", table);
        includeEntryNodesLike(data.ExcludeExitNodes, "ExcludeExitNodes", table);

        // alert(data.GeoIPExcludeUnknown);
    }
};

function includeOneLineData(Data, Setting, table) {

    var row = table.insertRow(-1);

    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);

    cell1.innerHTML = Setting;
    cell2.innerHTML = Data;
    cell3.innerHTML = '<button type="button" class="btn btn-tropea" id="' + Setting + '" >Remove</button>';
}
function includeEntryNodesLike(Key, pattern, table) {

    if (Key == "No Data!") return

    splitDataInitial = Key.split(pattern + ' ', 2);
    splitDataStrictNodes = splitDataInitial[1].split('StrictNodes ', 2);
    splitCountries = splitDataStrictNodes[0].split(',');

    i = 0;

    while (i < splitCountries.length) {

        if (splitCountries[i] != "") {
            var row = table.insertRow(-1);

            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);
            var cell3 = row.insertCell(2);

            cell1.innerHTML = pattern;
            cell2.innerHTML = splitCountries[i];
            cell3.innerHTML = '<button type="button" class="btn btn-tropea" id="' + pattern + '_' + splitCountries[i] + '" >Remove</button>';
        }
        i++;
    }

    if (splitDataStrictNodes[1] === undefined) return;

    var row = table.insertRow(-1);

    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);

    cell1.innerHTML = pattern + " - StrictNodes";
    cell2.innerHTML = splitDataStrictNodes[1];
    cell3.innerHTML = '<button type="button" class="btn btn-tropea" id="' + pattern + "_StrictNodes 1" + '" >Remove</button>';


}

/**
 * EVENT LISTENER
 */
function removeSettingEvent(event) {
    if (event.target.nodeName != "BUTTON") return
    ws.send("remove$>" + event.target.id);

}
document.getElementById("settings-table").addEventListener("click", removeSettingEvent);


/**
 * Real IP Function
 */
function updateRealIP(realIPNotSplitted){
    realIP = realIPNotSplitted.split('$>', 2);
    document.getElementById("realIp").value = realIP[1]
}

function loadRealIP(event) {
    ws.send("getRealIP");
}
document.getElementById("loadRealIp").addEventListener("click", loadRealIP);

/**
 * Torified IP Function
 */
 function updateTorifiedIP(torifiedIPNotSplitted){
    torifiedIP = torifiedIPNotSplitted.split('$>', 2);
    document.getElementById("torifiedIp").value = torifiedIP[1]
}

function loadTorifiedIP(event) {
    ws.send("getTorifiedIp");
}
document.getElementById("loadTorifiedIp").addEventListener("click", loadTorifiedIP);

/**
 * Torify App
 */

 function torifyApp(event) {
    path = document.getElementById("torifyAppPath").value
    ws.send("torifyApp$>" + path);
}
document.getElementById("torifyAppButton").addEventListener("click", torifyApp);