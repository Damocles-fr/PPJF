# PPJF
# Jellyfin with PotPlayer – Setup Guide  ## SRY for my english, translation done with AI

This tutorial explains how to set up Jellyfin Server on Windows to:

    Launch medias from the Jellyfin web interface directly in PotPlayer.

    Enable access to the corresponding media folder in Windows File Explorer from the Jellyfin media information panel.

    Start and stop the Jellyfin server automatically while launching the browser web interface and closing it.
	
	Bonus : Select text and one click search selection on IMDB, YOUTUBE, or any websites

---

Please use Notepad++
Jellyfin Server is installed as a service.
All applications (Jellyfin, PotPlayer, LibreWolf) are installed in their **default paths** on drive C.
Not tested with Chrome – using LibreWolf is recommended for this setup.
I strongly recommend to install LibreWolf separately from your main browser.
You can install Firefox/LibreWolf/Nightly/Any fork on the same computer.
This allows to start the Jellyfin server automatically while launching the web interface and to stop jellyfin server after closing it.
Also this way you launch Jellyfin directly in full-screen mode and/or hide the browser menu bar, as well as enabling separate configurations such as a default zoom of 120%, differents firefox addons for this browser etc...

---

## Security Notice

- For local folder link, you need to install "LienExplorerFirefoxnative-app-setup.exe" and the firefox extension "Local Filesystem Links" by austrALIENsun, AWolf
[GitHub Repository](https://github.com/feinstaub/webextension_local_filesystem_links)
- If you have security concerns, feel free not to install it.
- I have no affiliation with this extension or its creators.
- Use a separate LibreWolf/Firefox installation to minimize risks.

---

## Installation Steps
It's much better to use Notepad++ to view this and the scripts to edits.
https://notepad-plus-plus.org/downloads/

### 0. Download PPJF.zip

Download https://github.com/Damocles-fr/PPJF/blob/main/PPJF.zip

### 1. Install Jellyfin Server

- Choose **“Install as a Service”** during the installation process
- Default path

If it don't work with your already saved Jellyfin settings, you can reset some settings by deleting files in C:\ProgramData\Jellyfin\Server\config like network.xml and maybe other files too idk.
/!\ This will reset your server settings /!\

### 2. Install LibreWolf (a lighter and Privacy optimised Firefox)

- Install **LibreWolf** (or any fork that supporting **ViolentMonkey/TamperMonkey** extension).
https://librewolf.net/installation/windows/
- Default path: `C:\Program Files\LibreWolf`

### 3. Install PotPlayer

- No need to reinstall if already installed
- Default path: `C:\Program Files\DAUM\PotPlayer`

### 4. Place Required Files

- Move the PotPlayerJellyfin folder to :
  ```
  C:\ProgramData\
  ```
If you put it anywhere else, adapt any lines with your own path.

so you should have C:\ProgramData\PotPlayerJellyfin\
With nine files in it.

### 5. Edit `potplayer.ps1`

- Open potplayer.ps1 with **Notepad++** or Edit/Modify

Here, the weird "^D\\" "\\" and ":\\?" are completely normal phenomenon, please don't ask me why, and just don't touch it if it works.

Replace all and ONLY the letter `D` and `T` with your Jellyfin media library drive letters.
Then, in the second part, replace ONLY the path after ":\\?" and ":\" with your jellyfin library corresponding paths.
Add as many lines as different library and drives you use with jellyfin.
Here for exemple with two media library in Jellyfin located in "D:\folder\yourlibrary" and "T:\Media" :

  ```# Corriger les chemins de base (uniquement au début de la chaîne)
$path = $path -replace "^D\\", "D:\"
$path = $path -replace "^T\\", "T:\"
$path = $path -replace "^D/", "D:\"
$path = $path -replace "^T/", "T:\"

# Assurer les chemins spécifiques
$path = $path -replace "D:\\?folder\yourlibrary", "D:\folder\yourlibrary"
$path = $path -replace "T:\\?Media", "T:\Media"
  ```
  
- If you use a different Potplayer installation path, modify the last line that is set to PotPlayer defaut installation folder C:\Program Files\DAUM\PotPlayer\PotPlayerMini64.exe

### 6. If don't use default settings for Jellyfin network and Librewolf, edit `Jellyfin.bat` `OpenMediaInfoPathScriptmonkey.js` & `OpenWithPotplayerUserscript.js`

- Those files are set to LibreWolf default path and Jellyfin Server default URL :
http://localhost:8096 and librewolf.exe path C:\Program Files\LibreWolf\librewolf.exe"
- If you use those settings, default settings, skip to 7.
- If not, edit the files.
- In Jellyfin.bat modify it for your **LibreWolf/Firefox path**, **process name** (Firefox.exe or LibreWolf.exe), and **Jellyfin URL**:
  ```
  curl -s http://localhost:8096 > nul
	if %errorlevel% neq 0 (ping -n 1 -w 100 127.0.0.1 > nul & goto waitForServer)
	start "" "C:\Program Files\LibreWolf\librewolf.exe" -url "http://localhost:8096/web/index.html#/home.html"


	tasklist | find /i "librewolf.exe" >nul
  ```

- If your Jellyfin Server is not set the default adress "http://localhost:8096/"
	Edit the two `.js` scripts to replace "http://localhost:8096/ with your Jellyfin web URL :
  ```
  javascript
  // @match        http://localhost:8096/web/index.html


  ```
Jellyfin.bat detects when there is no more "LibreWolf.exe" process running, then it stop Jellyfin server service process.

### 7. Install ViolentMonkey and my scripts

- In Librewolf, install ViolentMonkey extension
https://addons.mozilla.org/fr/firefox/addon/violentmonkey/
- Librewolf → settings → Extensions → ViolentMonkey → click on the three dot → click option
- Go to intalled Scripts
- Click on + , then click new
- The editor window will open with some default metadata for the script. Delete all the lines of the default code. Don't Close.
- Go to C:\ProgramData\PotPlayerJellyfin\
- Open OpenWithPotplayerUserscript.js with notepad to edit it, select all, copy
- Paste all into the ViolentMonkey editor page you just kept open in LibreWolf.
- Click Save and Exit on upper right corner

If you want Local Files Links in jellyfin media info
- Do the same in ViolentMonkey, +, new, delete all the lines, but copy/paste from the file OpenMediaInfoPathScriptmonkey.js, save and exit.


### 8. Enable PowerShell Scripts Execution (Windows)

- In Windows 11, go to, Settings → Developers → PowerShell → Allow unsigned scripts
- Or if you can't find it :
	- Search for `PowerShell` in the Start menu, right-click it, and select **Run as Administrator**.
	- Type the following command and press Enter:
     ```
     Set-ExecutionPolicy RemoteSigned -Force
     ```

### 9. Configure Jellyfin Service to only Start with Librewolf and stop at closing Librewolf

- Search and Open for **Services**. in the windows start menu. Or Press `Win + R`, type `services.msc`, and press `Enter`.
  - Scroll down to find **Jellyfin** in the list.
  - Right-click it and select **Properties**.
  - In the **Startup type** dropdown, select **Manual**. (so it will start only via shortcut and not at the system boot)
  - Click **Apply** and then **OK**.

### 10. Configure Windows Admin Prompt Skip

Everytime you launch Jellyfin service with a shorcut, there is an admin window, to prevent that :
- Go to C:\ProgramData\PotPlayerJellyfin
- Right-click the shortcut "Jellyfin" and select **Properties**.
- Click **Advanced...** and check **Run as administrator**.
- Apply and save changes.

### 11. Skip Windows Admin Prompt by Setting Up Windows Task Scheduler

- Run Windows Task Scheduler
- On the right panel, click import a task
- In the window, select the XML file JellyfinUAC.xml located in C:\ProgramData\PotPlayerJellyfin\
- In the new windows, click Users or groups, then find your UserName, you can type your windows Username in the box then click Verify, then OK
- You can customize other settings if you want but it should work like that.
- Save & exit

### 12. If you want local files links, Install Local File Path Support, if not, go to 13.

- LibreWolf, Install **Local Filesystem Links** extension from:
  - [https://addons.mozilla.org/fr/firefox/addon/local-filesystem-links/](https://addons.mozilla.org/fr/firefox/addon/local-filesystem-links/)
  - Or [GitHub Repository](https://github.com/feinstaub/webextension_local_filesystem_links)
  
- If not already done when asked, Install `LienExplorerFirefoxnative-app-setup.exe` *(for local file explorer links)*.
https://github.com/AWolf81/webextension_local_filesystem_links-native-host-binaries/raw/master/win32/native-app-setup.exe


### 13. Librewolft settings

- In Librewolf, go to settings, then Privacy & Security on the left side panel
- Cookies and Site Data, click on manage exeption
- In the new box, add http://localhost:8096/ (default) or your Jellyfin server URL
- Save changes
- Now go to LibreWolf on the left side panel
- Uncheck ResistFingerprinting
- If you use local files links, Go to Extensions in the settings page, then Local Filesystem Links, Option
		Check the first box, check the second if you also want a folder icon next to the folder paths, and put 0 in Retries on failure.


### 14. Adjust LibreWolf Full-Screen Settings, facultatif

- Only if you want to use Jellyfin in Full-screen mod and still be able to see the Windows Task bar
- In LibreWolf
- Type `about:config` in the adress bar, agree if ask anything
- In the new page, search, type : full-screen-api.ignore-widgets
- It should be false
- Double click on it so you see it as true
  ```
  full-screen-api.ignore-widgets true
  ```

### 15. Auto enable Full-Screen at launch, facultatif

- Install **Auto Fullscreen** extension by *tazeat*.
https://addons.mozilla.org/en-US/firefox/addon/autofullscreen/


### 16. Apply PotPlayer Registry Settings

- Run `PotPlayerMini64.reg` and confirm changes.


### 17. Create a shortcut
Go to C:\ProgramData\PotPlayerJellyfin
JellyfinUAC is the main shorcut, DO NOT MOVE IT.
Right click on it, copy, then go to
C:\ProgramData\Microsoft\Windows\Start Menu\Programs
There, right click and "paste as shorcut"
Now, you can right click on it and Send to Desktop (Create a shortcut)
Or Right click on it, copy, then "paste as shorcut" anywhere you want, rename it and change the icon.
Jellyfin icons are in C:\Program Files\Jellyfin\Server

## IMPORTANT ##

- If you close the .bat (black window) before closing the browser, the Jellyfin Server will keep running in the background.
- Sometimes if it stop working, because of idk wtf, **PotPlayer updates** or some specific settings change, just **re-run** `PotPlayerMini64.reg`.
Should be fine but if it happens too often, you can add a line in the .bat to run PotPlayerMini64.reg everytime.


### BONUS.  
- Swift Selection Search by Daniel Lobo
https://addons.mozilla.org/fr/firefox/addon/swift-selection-search/
With this extension, when you select a text in Firefox, like a movie title or the name of an actor, a box appear next to it with the logo of websites.
- Click on it and it automatically go to a new tab and search on the website the selected text
You can Add Youtube, IMDB, Wikipedia, Steam, Google Maps, lots of legal website, or you can customize to any website search you want in the extension settings...

## Need Help?

- Visit: [Jellyfin Forum Thread](https://forum.jellyfin.org/t-jellyfin-with-potplayer-and-clickable-link-to-the-video-s-local-folder) or **DM me** https://forum.jellyfin.org/u-damocles
