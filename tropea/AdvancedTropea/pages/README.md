# Tropea-Project
Tropea-Project is an open-source project undertaken by a university student for a thesis work at the University of Calabria UNICAL and the only goal is to give everyone (even less experienced average users) the opportunity to modify at their own I plan the tunneling phase of the tor connection in a clear and simple way as you want.


How To General Settings
    How to run correctly the extension
    How to run local script
    How to get TorBrowser Path
How To Use Extension Functions
    TorBrowser Path
    EntryNodes and StrictNodes
    ExitNodes and StrictNodes
    ExcludeNodes
    ExcludeExitNodes
    GeoIPExcludeUnknow
How To Use Advanced Tropea
    Torify
    Settings


# How to run correctly the extension
1. Installare l'estensione nel proprio browser tramite il link ufficiale
2. Scaricare dal sito ufficiale di Tropea-Project l'eseguibile corretto per il tuo sistema operativo denominato 'tropea'
3. Solo dopo aver avviato l'eseguibile possiamo cliccare sull'estensione e inserire il percorso esatto della cartella di TorBrowser, se non sai come fare [clicca qui](www.redirect.org) per vedere come si fa
4. Estensione avviata correttamente, solo adesso potete iniziare a modificare il vostro tunneling come ritenete più opportuno fare

*N.B. State molto attenti a seguire correttamente le varie sintassi delle funzionalità che potete trovare in questa pagina in base alla funzionalità d'interesse*

# How to run local script
Ci sono diverse modalità per eseguire lo script, dipende dal vostro sistema operativo e quindi dal tipo di eseguibile che avete scaricato.
**tropea.js** - Dovete aprire un terminale(una shell o un cmd), spostarvi tramite il comando 'cd' all'interno della cartella contenente il file e scrivere il comando `node tropea.js`
**tropea.sh** - Assegnate al file i permessi di esecuzione tramite linea di comando usando il comando 'chmod +x tropea.sh' ed eseguitelo come fareste per qualunque altro programma, ad esempio tramite il comando './tropea.sh'
**tropea.exe** - Dovrebbe bastare doppio click (?)

*N.B. Se cliccando sull'estensione non vedete scritto 'ActualPath' sotto la voce 'TorBrowser Path' allora sicuramente lo script locale non è stato eseguito correttamente.*

# How to get TorBrowser Path
Subito dopo aver avviato l'eseguibile è fondamentale settare il percorso(path) assoluto corretto della cartella dov'è contenuto TorBrowser.
*Se ancora non avete scaricato TorBrowser è necessario farlo e potete farlo tramite [questo link](https://www.torproject.org/it/download/).*
Esempio per sistemi operativi **Linux**:
    Andate nella cartella dove è stato scaricato TorBrowser
    Aprite un terminale e lanciate il comando 'tar -xf < archive name >' ad esempio, nel mio caso, 'tar -xf tor-browser-linux64-11.0.6_it.tar.xz '
    Dopodiché navigate all'interno della cartella appena estratta tramite il comando 'cd' ad esempio, nel mio caso, 'cd tor-browser_it/'
    Lanciate il comando 'pwd'
    Copiate l'output del comando..
    
Esempio per sistemi operativi **Windows**:
    Andate nella cartella dove è stato installato TorBrowser
    Click con tasto destro sull'eseguibile
    Proprietà
    Copiate la voce 'percorso'..
Esempio per sistemi operativi **MacOS**:
    *non ne ho idea*

..Aprite l'estensione Tropea-Project
Incollate e premete il tasto 'Edit!'

# TorBrowser Path
Il percorso che selezionate, relativo alla cartella contenente il launcher di TorBrowser, deve essere completo, di seguito riporto alcuni esempi.
Se la cartella 'tor-browser' contenente il launcher di TorBrowser e la cartella 'Browser' è sul Desktop allora il percorso potrebbe essere simile a questo:
|Sistema Operativo|Path|
|--|--|
|Windows|C://Users/ale/Desktop/tor-browser/|
|Linux|/home/ale/Desktop/tor-browser/|
|MacOS|(???)|

Una volta acquisito il percorso corretto non dovrete fare altro che aprire l'estensione e incollare il percorso nella barra di testo sotto la voce 'TorBrowser Path', come viene mostrato in foto.
Una volta cliccato 'Edit!', ammesso che abbiate correttamente avviato l'eseguibile in locale(Se non sapete come fare [cliccate qui](www.redirect.org)), vedrete scritto di fianco ad 'Actualpath' il percorso da voi inserito.
