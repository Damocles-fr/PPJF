## Guide and tips for using Jellyfin on a web browser
### => New external player launcher version also compatible with Jellyfin Media Player desktop App, Potplayer or MPC : [MPC-JF](https://github.com/Damocles-fr/MPC-JF)
---

This tutorial explains how to:

    Launch medias from the Jellyfin web interface directly with PotPlayer, MPC... : https://github.com/Damocles-fr/MPC-JF

    Clickable link to Windows File Explorer for the corresponding media (from the Jellyfin media information panel)

    Jellyfin Service Automation, Start and stop the Jellyfin server automatically with the Jellyfin interface and closing it. 

	Launch Jellyfin Web in fullscreen
    
    Select text and one click search selection on IMDB, YOUTUBE, or any websites

---

# GUIDE

## Install LibreWolf (a lighter and Privacy optimised Firefox) or Firefox

	- Not tested with Chrome – using LibreWolf is recommended and easier for the optionals in this setup.
	- You can install multiple Firefox/LibreWolf/Nightly/Any fork on the same computer. I strongly recommend to install LibreWolf separately from your main browser.
	- This way you can launch Jellyfin directly in full-screen mode and/or hide the browser menu bar, as well as enabling separate configurations such as a default zoom of 120%, differents firefox addons for this browser etc...
	- This also allows to use the Optional feature to start Jellyfin server automatically while launching the web interface and to stop jellyfin server after closing the window.
 	- "Local Filesystem Links extension" needed for the links feature have minors security flaws and display a notification in private mod, I recommend not to use your main browser with it.
- Install **LibreWolf** (or any Firefox fork that supporting **ViolentMonkey/TamperMonkey** extension, not tested with chromonium browser but it should should too).
- https://librewolf.net/installation/windows/
- Default path: `C:\Program Files\LibreWolf`

## If you want Local Files Links in jellyfin media info

	--- Security Notice ---
	- For the Optional local folder link, you need to install "native-app-setup.exe" and the firefox extension "Local Filesystem Links" by austrALIENsun, AWolf
	[GitHub Repository](https://github.com/feinstaub/webextension_local_filesystem_links)
	- If you have security concerns, feel free not to install it.
	- I have no affiliation with this extension or its creators.
	- Use a separate LibreWolf/Firefox installation to minimize risks.
- LibreWolf, Install **Local Filesystem Links** extension from :
  - [https://addons.mozilla.org/fr/firefox/addon/local-filesystem-links/](https://addons.mozilla.org/fr/firefox/addon/local-filesystem-links/)
  - Or [GitHub Repository](https://github.com/feinstaub/webextension_local_filesystem_links)
- In Librewolf or own browser, install ViolentMonkey extension :
https://addons.mozilla.org/fr/firefox/addon/violentmonkey/
- Settings → Extensions → ViolentMonkey → click on the three dot → click option
- Go to intalled Scripts
- Click on + , then click new
- The editor window will open with some default metadata for the script. Delete all the lines of the default code. Don't Close.
- Open ``` OpenMediaInfoPathScriptmonkey.js ``` with notepad to edit it, select all, copy
- Paste all into the ViolentMonkey editor page you just kept open in LibreWolf.
- Click Save and Exit on upper right corner
- If your Jellyfin Server is not set the default adress ``` http://localhost:8096/ ```
	Edit the `.js` scripts to replace ``` http://localhost:8096/ ``` with your Jellyfin web URL, for exemple :
  ```
  // @match        http://192.168.1.10:8096/*
  ```
- Don't forget the * at the end.

- If not already done when asked during the addon installation, Install `LienExplorerFirefoxnative-app-setup.exe` :
https://github.com/AWolf81/webextension_local_filesystem_links-native-host-binaries/raw/master/win32/native-app-setup.exe
- Go to Extensions settings in the settings page, then Local Filesystem Links, Option
- Uncheck the first box, check the second if you also want a folder icon next to the folder paths
- Check "Reveal link (open containing folder)"

## For preserving Jellyfin user login and settings in Librewolf

- For the browser to remember your session settings and passwords.
- In Librewolf, go to settings, then Privacy & Security on the left side panel
- Cookies and Site Data, click on manage exeption
- In the new box, add ``` http://localhost:8096/ ``` (default) or your Jellyfin server URL
- Save changes
- Also, on the left side panel
- Uncheck ``` ResistFingerprinting ```

## Adjust LibreWolf Full-Screen Settings (with visible Windows Task bar)

- Only if you want to use Jellyfin in Full-screen mod and still be able to see the Windows Task bar
- In LibreWolf
- Type `about:config` in the adress bar, agree if ask anything
- In the new page, search, type : ``` full-screen-api.ignore-widgets ```
- (It should be false by default)
- Double click on it so you see it as true
  ```
  full-screen-api.ignore-widgets true
  ```

## Alternative : Auto enable Full-Screen at launch (hide the Windows Task bar)

- Install **Auto Fullscreen** extension by *tazeat*.
https://addons.mozilla.org/en-US/firefox/addon/autofullscreen/

## If you want the Jellyfin server on your PC to be only running when you use it.

#### -Update- : Jellyfin Service Automation, Start and stop. Cleaner solution, no console popup window, multi browser auto-install, possibility for custom .bat at launch, notification etc..  :
	- Start and stop the Jellyfin server automatically at launching the interface and closing it.
	- Add **Custom scripts** - Run additional .bat files at server startup (ex : MountNetworkDrives, SpinUpDrives...)
	- Works with Jellyfin Media Player, web browsers (recommended), or you can enter any executable path manually (for using Jellyfin MPV Shim or anything else)
- Download and follow the instruction from the Readme in : [WIP.JellyfinServiceAutomation.zip](https://github.com/Damocles-fr/PPJF/releases/tag/10.7)

## Customize a shorcut (without Jellyfin Service Automation)
- On your desktop, right click, new shortcut, enter : ``` "C:\Program Files\LibreWolf\librewolf.exe" http://localhost:8096/web/index.html#/home.html ```
- Or if you want to make it looks like an app, without any tabs and firefox bars, add -kiosk : ``` "C:\Program Files\LibreWolf\librewolf.exe" -kiosk http://localhost:8096/web/index.html#/home.html ```
  	- -kiosk don't work with local file links and prevent from using new tabs.
- Name it Jellyfin, on the new icon shortcut, right click, change icon, Browser... , ``` C:\Program Files\Jellyfin\Server ```, select the icon
- For having jellyfin icon instead of LibreWolf in the Windows taskbar, go C:\Program Files\LibreWolf and do the same with LibreWolf.exe
- Or you can just Bookmark Jellyfin or make it the start page of Librewolf

## Swift Selection Search by Daniel Lobo
https://addons.mozilla.org/fr/firefox/addon/swift-selection-search/
With this extension, when you select a text in the browser, like a movie title or the name of an actor, a box appear with the logo of websites.
- Click on it and it automatically go to a new tab and search on the website the selected text
You can Add IMDB, Youtube, Wikipedia, Steam, Google Maps, translators, lots of *legal* websites, or you can customize to any website search you want in the extension settings...

---

## IMPORTANT
- [WIP.JellyfinServiceAutomation] : After each Jellyfin Server updates, go to Windows `services.msc` and set back **Jellyfin** **Startup type** to **Manual** 
- If you use the Firefox extension ``` Dark Reader ``` , it breaks Jellyfin pictures loading in browsers, desactivate it only for jellyfin : Go into Dark Reader settings while you have the Jellyfin page open (firefox menu bar), click to uncheck Jellyfin URL.

### Need Help?
- Don't hesitate to open an [issue](https://github.com/Damocles-fr/PPJF/issues)
- **DM me** https://forum.jellyfin.org/u-damocles
- GitHub https://github.com/Damocles-fr/
