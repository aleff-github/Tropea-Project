# VirusTotal Check

|File|Virus Total Check|
|--|--|
|[Linux Local Script](https://github.com/aleff-github/Tropea-Project/releases/)|[Checked ✅](https://www.virustotal.com/gui/file/a1c025a9a0d4404edd26d2e037786a0ffff3e4a6d3327a5b7e97b92b9618b519)|
|[MacOS Local Script](https://github.com/aleff-github/Tropea-Project/releases/)|[Checked ✅](https://www.virustotal.com/gui/file/337d2e5c6ce0ef09b0cbd7574882470bf7c8bf82cf3e0fa08a56a9ba5271f739)|
|[Windows Local Script](https://github.com/aleff-github/Tropea-Project/releases/)|[1 Vulnerability ❌](https://www.virustotal.com/gui/file/6592bb329a9b18984075d7910b59227e0a2bcb6e6740d046c49e170f25ce4fe1)|


# Regex Controlls

## Set Functions

**Regex**:
- ```^[a-zA-Z,]{1,20}\$>[a-zA-Z,]{1,20}\$*>*[a-zA-Z]{0,11}\s*1*$```

**Example**:
- setEntryNodes$>ca,eg,it,ru$>StrictNodes 1
- setEntryNodes$>ca,ru
- setEntryNodes$>ef$>StrictNodes 1
- setExitNodes$>ef$>StrictNodes 1
- setExcludedNodes$>ef
- setExcludedExitNodes$>er

## Remove Function 

**Regex**:
- ``` ^remove\$>[a-zA-Z]{1,16}_\{*[a-zA-Z]*\}*\s*1*$```

**Example**:
- remove$>EntryNodes_{ca}
- remove$>EntryNodes_StrictNodes 1
- remove$>ExitNodes_{ds} 
- remove$>ExitNodes_StrictNodes 1
- remove$>ExcludeNodes_{we}
- remove$>ExcludeExitNodes_{as}

## Geo Functions

**Regex**:
- ``` ^setGeoIPExcludeUnknown\$>[a-z0-1]{0,4}$```

**Example**:
- GeoIPExcludeUnknown 1
- GeoIPExcludeUnknown 0
- GeoIPExcludeUnknown auto
