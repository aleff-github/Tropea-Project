# Tropea-Project
Tropea-Project is an open-source project undertaken by a university student for a thesis work at the University of Calabria UNICAL and the only goal is to give everyone (even less experienced average users) the opportunity to modify at their own I plan the tunneling phase of the tor connection in a clear and simple way as you want.

*Color: #9e264c*

# How to use Tropea-Project?
Follow [this guide]() to install correctly the Tropea-Project Extension.

# How it works?
Tropea-Project extension work in local from the extension command whit node.js and javascript that get the input from the extension and edit torrc file in the TorBrowser folder as the user want, so as the input sent.

# Extension Panel
|Function|Status|
|--|--|
|EntryNodes|Work|
|ExitNodes|Work|
|ExcludeNodes|Work|
|ExcludeExitNodes|Work|
|GeoIPExcludeUnknow|Work|
|Reset|Work|

# Advanced Tropea
|Function|Status|
|--|--|
|TorifyApp|It depends on the application launched, [Working Application]()|
|Remove EntryNodes|Work|
|Remove ExitNodes|Work|
|Remove ExcludeNodes|Work|
|Remove ExcludeExitNodes|Work|

# Styntax Index
|Element/s|Syntax|
|--|--|
|\[Add\]EntryNodes|it,de,...|
|\[Add\]ExitNodes|it,de,...|
|\[Add\]ExcludeNodes|it,de,...|
|\[Add\]ExcludeExitNodes|it,de,...|
|Torify App|\<application\>|

# FAQs

## Torify function works in every OS?
<strong><u>No Unfortunately!</u></strong> No options for Windows, sadly. They haven’t found a good way to do network isolation there. On macOS, you should be able to “just” use torify but you must copy the binaries over to /tmp for example to torify them.<a href="https://forum.torproject.net/t/how-can-i-use-torify-command-on-else-operating-system/2207">-learn more... -</a>

## Torify function works with every Application?
<strong><u>Not for all!</u></strong> Unfortunately establishing a 100% secure Tor connection is not easy and therefore development in general is very slow to favor a secure system. There is a list of applications where it has been tested and you can find it by <a href="https://gitlab.torproject.org/legacy/trac/-/wikis/doc/torsocks#security">clicking
 here!</a> Else if you want to see the official response on TorProject Forum <a href="https://forum.torproject.net/t/torify-problem-in-applications-launch/2220/3">click here</a>.

## Why i must run tropea.js on my computer before use tropea extension?
Tropea-Project's priority is to have anyone modify the tunneling of the tor network, so it was decided to create an interface already known as that of six websites. Fortunately, however, we cannot modify your files simply from an extension, which is why it is necessary to start node.js from your computer to perform all the requests made by the user through the extension.

## How can i be sure that a country works on Tor Network?
<strong><u> <a href="https://metrics.torproject.org/rs.html#search/country:it">Whit this website</a> </u></strong> you can find all what you need. It is a TorProject service that you can use freely and for free to find Tor Relay for every country. If you don't know what is a Country ID you can use Google or <a href="https://laendercode.net/en/">this website</a>

## Tropea-Project is secure?
<strong><u>It depends on you</u></strong> Tropea-Project does not interact in any way with your connection, nor does it take any data relating to your device or browser, all the changes you actually make, so it is up to you to be careful to follow the correct syntax but, where you are wrong, simply you would not be able to navigate and in that case it would be enough for you to reset everything using the Reset button and start over.
 
 ## How can i install Tor on my computer?
<strong><u> <a href="https://tb-manual.torproject.org/installation/">Follow this guide</a></u>.</strong> Is really simple and you can do it in every OS(Windows, MacOS or Linux).
 
