### PPJF - PotPlayer launcher for Jellyfin
### -Update- PPJF 10.11 Compatible with Jellyfin 10.11.+
- Update OpenWithPotplayerUserscript.js

---

> [!NOTE]
> <details>
> <summary><strong>(click to expand) Quick install PPJF - PotPlayer launcher for Jellyfin </strong></summary>
>
> ## 0) Download
> - Download PPJF for Jellyfin 10.7 or the **latest for Jellyfin 10.11.+** : [PPJF.10.11.5.zip](https://github.com/Damocles-fr/PPJF/releases/tag/10.11.5)
>
> ## 1) Place required files
> - Extract and move the `PotPlayerJellyfin` folder to: `C:\ProgramData\`  
>   You should end up with: `C:\ProgramData\PotPlayerJellyfin\` (with all files inside).
>
> ## 2) Install PotPlayer (default path)
> - No need to reinstall if it’s already installed
> - Default path: `C:\Program Files\DAUM\PotPlayer`
>
> ## 3) Install a browser + Violentmonkey, then add my userscript
> - Standalone Firefox/LibreWolf is good (many tips for the best Jellyfin experience in the full README)
> - Install [Violentmonkey](https://violentmonkey.github.io/)  
>   Firefox add-on: https://addons.mozilla.org/fr/firefox/addon/violentmonkey/
> - Browser settings → Extensions → Violentmonkey → three dots → Options
> - Go to **Installed Scripts**
> - Click **+** → **New**
> - The editor opens with default content: delete everything (don’t close the editor)
> - Go to: `C:\ProgramData\PotPlayerJellyfin\`
> - Open `OpenWithPotplayerUserscript.js` with Notepad, select all, copy
> - Paste everything into the Violentmonkey editor
> - Click **Save & Exit** (top right)
> - If your Jellyfin server is **not** the default address `http://localhost:8096/`, edit the `.js` script and replace it with your Jellyfin Web URL  
>   Example: `// @match        http://192.168.1.10:8096/*`  
>   Don’t forget the `*` at the end
>
> ## 4) Enable PowerShell script execution (Windows)
> - In Windows 11: Settings → System → For developers → PowerShell → allow local PowerShell scripts / unsigned scripts (wording may vary)
> - If you can’t find it:
>   - Search for `PowerShell` in the Start menu → right-click → **Run as Administrator**
>   - Run:
>     - `Set-ExecutionPolicy RemoteSigned`
>   - Or:
>     - `Set-ExecutionPolicy RemoteSigned -Force`
>
> ## 5) Apply PotPlayer registry settings
> - Run `potplayer.reg` and confirm the changes
> - You may need to re-run `potplayer.reg` after major PotPlayer updates
> - Test it — done (if not, see workaround below)
> - Check the full README on GitHub for extra quality-of-life improvements
>
> ## 6) Optionnal : Hide the Powerscript window at Potplayer launch
> - `Install-PPJF-HiddenProtocol.ps1` must be in your default PotPlayerJellyfin folder.
> - It **require VBScript** installed (may not be installed by default on all Windows 11 installation)
> - Run the file `Install-PPJF-HiddenProtocol.ps1` (Right click and Run with PowerShell)
>
> ---
>
> ## Workaround: PotPlayer starts but fails to open the media
> - Your NAS / network drives / HDD must be mapped to a drive letter in Windows (e.g. `D:\`, `E:\`, etc.)
> - Edit `potplayer.ps1` located in: `C:\ProgramData\PotPlayerJellyfin\`
>   - Near the end of the file, just below :
>     - `# YOUR NAS CONFIG, IF NEEDED, ADD YOUR OWN WORKAROUND JUST BELOW`
>   - Add this line:
>     - `$path = $path -replace "\\share\\SHAREFOLDER\\", "D:"`
>   - Replace `"\\share\\SHAREFOLDER\\"` with the beginning of the *wrong* path shown in PotPlayer “More info” when it fails
>   - Use double backslashes `\\` (single `\` will not work)
>   - Replace `"D:"` with your mapped drive letter
>   - Example (works for everything on my NAS mapped as `D:`):
>     - `$path = $path -replace "\\share\\_MEDIA\\", "D:"`
>   - The `\\share\\_MEDIA\\` part depends on your NAS setup (use PotPlayer “More info” to identify what needs replacing)
>
> </details>


---
This tutorial explains how to:

    Launch medias from the Jellyfin web interface directly with PotPlayer. Steps 1 to 6 required.

    Optional :  Clickable link to Windows File Explorer for the corresponding media (from the Jellyfin media information panel)

    Optional : Jellyfin Service Automation, Start and stop the Jellyfin server automatically with the Jellyfin interface and closing it. 
    
    Bonus : Select text and one click search selection on IMDB, YOUTUBE, or any websites

---
### -Update- for Optional : Jellyfin Service Automation, Start and stop. Cleaner solution, no console popup window, multi browser auto-install, possibility for custom .bat at launch, notification etc..  :
- Standalone and/or replace Steps 13. 14. 15. 16. 17. that are for manual installation of an older version of JellyfinServiceAutomation
- Start and stop the Jellyfin server automatically at launching the interface and closing it.
- Add **Custom scripts** - Run additional .bat files at server startup (ex : MountNetworkDrives, SpinUpDrives)
- Works with Jellyfin Media Player, web browsers (recommended), or you can enter any executable path manually (for using Jellyfin MPV Shim or anything else)
- Download and follow the instruction from the Readme in : [WIP.JellyfinServiceAutomation.zip](https://github.com/Damocles-fr/PPJF/releases/tag/10.7)
---

# INSTALLATION - PPJF - Jellyfin with PotPlayer ##
## Installation Steps

- Steps 1 to 6 are required.

### 0. Download PPJF.zip

Download PPJF for Jellyfin 10.7 or the **latest for Jellyfin 10.11.+** : [PPJF.10.11.5.zip](https://github.com/Damocles-fr/PPJF/releases/tag/10.11.5)

### 1. Place Required Files

- Extract and move the PotPlayerJellyfin folder to :
  ```
  C:\ProgramData\
  ```
If you put it anywhere else, adapt any lines with your own path.

so you should have C:\ProgramData\PotPlayerJellyfin\
With the files in it.

### 2. Install PotPlayer

- No need to reinstall if already installed
- Default path: `C:\Program Files\DAUM\PotPlayer`

### 3. Install LibreWolf (a lighter and Privacy optimised Firefox) or Firefox

	- Not tested with Chrome – using LibreWolf is recommended and easier for the optionals in this setup.
	- You can install multiple Firefox/LibreWolf/Nightly/Any fork on the same computer. I strongly recommend to install LibreWolf separately from your main browser.
	This way you can launch Jellyfin directly in full-screen mode and/or hide the browser menu bar, as well as enabling separate configurations such as a default zoom of 120%, differents firefox addons for this browser etc...
	This also allows to use the Optional feature to start Jellyfin server automatically while launching the web interface and to stop jellyfin server after closing the window.
 	"Local Filesystem Links extension" needed for the optional links feature have minors security flaws and display a notification in private mod, I recommend not to use your main browser with it.
- Install **LibreWolf** (or any Firefox fork that supporting **ViolentMonkey/TamperMonkey** extension).
https://librewolf.net/installation/windows/
- Default path: `C:\Program Files\LibreWolf`
- if you want to use the optionals with your current browser or a different one, don't forget step 10

### 4. Install ViolentMonkey and my scripts

- In Librewolf or own browser, install ViolentMonkey extension
https://addons.mozilla.org/fr/firefox/addon/violentmonkey/
- Settings → Extensions → ViolentMonkey → click on the three dot → click option
- Go to intalled Scripts
- Click on + , then click new
- The editor window will open with some default metadata for the script. Delete all the lines of the default code. Don't Close.
- Go to ``` C:\ProgramData\PotPlayerJellyfin\ ```
- Open ``` OpenWithPotplayerUserscript.js ``` with notepad to edit it, select all, copy
- Paste all into the ViolentMonkey editor page you just kept open in LibreWolf.
- Click Save and Exit on upper right corner
- If your Jellyfin Server is not set the default adress ``` http://localhost:8096/ ```
	Edit the `.js` scripts to replace ``` http://localhost:8096/ ``` with your Jellyfin web URL, for exemple :
  ```
  // @match        http://192.168.1.10:8096/*
  ```
Don't forget the * at the end.

- Optional : If you want Local Files Links in jellyfin media info
	- Do the same in ViolentMonkey, +, new, delete all the lines, but copy/paste from the file ``` OpenMediaInfoPathScriptmonkey.js ```, save and exit.

### 5. Enable PowerShell Scripts Execution to allow potplayer.ps1 (Windows)

- In Windows 11, go to, Settings → Developers → PowerShell → Allow unsigned scripts
- Or if you can't find it :
	- Search for `PowerShell` in the Start menu, right-click it, and select **Run as Administrator**.
	- Type the following command and press Enter:
     ```
     Set-ExecutionPolicy RemoteSigned
     ```
- Or
     ```
     Set-ExecutionPolicy RemoteSigned -Force
     ```

### 6. Apply PotPlayer Registry Settings

- Run `potplayer.reg` and confirm changes.
- You may need to re-run `potplayer.reg` after major Potplayer Updates.
- The next steps are optional, but I recommend checking them out for quality-of-life improvements
- You can test if it works already. If not, see Workaround below.
- Done !

### Optionnal : Hide the Powerscript window at Potplayer launch
- `Install-PPJF-HiddenProtocol.ps1` must be in your default PotPlayerJellyfin folder.
- It **require VBScript** installed (may not be installed by default on all Windows 11 installation)
- Run the file `Install-PPJF-HiddenProtocol.ps1` (Right click and Run with PowerShell)

### Workaround : If PotPlayer starts but fail to launch the media
- Your NAS/network drives must be mount with a letter like D:\ E:\ ... in Windows.
- Edit "potplayer.ps1" located in ``` C:\ProgramData\PotPlayerJellyfin ```
  	- At the end of the file, just below : ``` # YOUR NAS CONFIG, IF NEEDED, ADD YOUR OWN WORKAROUND JUST BELOW ```
  	- Add this line : ``` $path = $path -replace "\\share\\SHAREFOLDER\\", "D:" ```
  	- In this, change ``` "\\share\\SHAREFOLDER\\" ``` with the start of the the wrong path shown if you click on "more info" when Potplayer fail to launch the media from Jellyfin,
  	  It should be the part of the path that appear in "more info" but not in the Windows explorer path of your movies. 
  	- Add double backslash ``` \\ ``` instead of single backslash ``` \ ``` in your own path, they are essential
  	- Replace "D:" with the drive letter of your NAS or drive in Windows.
  	- For exemple ``` $path = $path -replace "\\share\\_MEDIA\\", "D:" ```
	That works for everything located in my NAS mounted as the D: drive in Windows, so D:\FILMS, D:\SERIES etc.
	``` "\\share\\\_MEDIA\\" ``` depends of your NAS/drives configuration (see "more info" in Potplayer when it fail to launch the media from Jellyfin to identify your issue)

---

### 7. Optional : Preserving User login and settings in the browser

- For the browser to remember your session settings and passwords.
- In Librewolf, go to settings, then Privacy & Security on the left side panel
- Cookies and Site Data, click on manage exeption
- In the new box, add ``` http://localhost:8096/ ``` (default) or your Jellyfin server URL
- Save changes
- Now go to LibreWolf on the left side panel
- Uncheck ``` ResistFingerprinting ```

### 8. Optional : Adjust LibreWolf Full-Screen Settings

- Only if you want to use Jellyfin in Full-screen mod and still be able to see the Windows Task bar
- In LibreWolf
- Type `about:config` in the adress bar, agree if ask anything
- In the new page, search, type : ``` full-screen-api.ignore-widgets ```
- It should be false
- Double click on it so you see it as true
  ```
  full-screen-api.ignore-widgets true
  ```

### 9. Optional : Auto enable Full-Screen at launch

- Install **Auto Fullscreen** extension by *tazeat*.
https://addons.mozilla.org/en-US/firefox/addon/autofullscreen/

### 10. Optional : Needed if you don't use default path and URL for Jellyfin, Librewolf and PotPlayer

- Edit `Jellyfin.bat` `OpenMediaInfoPathScriptmonkey.js` & `OpenWithPotplayerUserscript.js`
- Those files are set to LibreWolf default path and Jellyfin Server default URL :
``` http://localhost:8096 ``` and librewolf.exe path ``` C:\Program Files\LibreWolf\librewolf.exe ``` Potplayer path ``` C:\Program Files\DAUM\PotPlayer\PotPlayerMini64.exe ```
- In Jellyfin.bat modify it for your **LibreWolf/Firefox path**, **process name** (Firefox.exe or LibreWolf.exe), and **Jellyfin URL**:
  ```
  curl -s http://localhost:8096 > nul
	if %errorlevel% neq 0 (ping -n 1 -w 100 127.0.0.1 > nul & goto waitForServer)
	start "" "C:\Program Files\LibreWolf\librewolf.exe" -url "http://localhost:8096/web/index.html#/home.html"

	tasklist | find /i "librewolf.exe" >nul
  ```

- If your Jellyfin Server is not set the default adress ``` http://localhost:8096/ ```
	Edit the two `.js` scripts to replace ``` http://localhost:8096/ ``` with your Jellyfin web URL :
  ```
  javascript
  // @match        http://localhost:8096/web/index.html

  ```
Jellyfin.bat detects when there is no more "LibreWolf.exe" process running, then it stop Jellyfin server service process.

- potplayer.ps1 support all A-Z local drive, it may need edit if you use network drives
- If you use a different Potplayer installation path, modify the last line that is set to PotPlayer defaut installation folder C:\Program Files\DAUM\PotPlayer\PotPlayerMini64.exe

### 11. Optional : Media info link to the local file folder, if you don't want it, skip to 12.
--- Security Notice ---
- For the Optional local folder link, you need to install "native-app-setup.exe" and the firefox extension "Local Filesystem Links" by austrALIENsun, AWolf
[GitHub Repository](https://github.com/feinstaub/webextension_local_filesystem_links)
- If you have security concerns, feel free not to install it.
- I have no affiliation with this extension or its creators.
- Use a separate LibreWolf/Firefox installation to minimize risks.

- LibreWolf, Install **Local Filesystem Links** extension from:
  - [https://addons.mozilla.org/fr/firefox/addon/local-filesystem-links/](https://addons.mozilla.org/fr/firefox/addon/local-filesystem-links/)
  - Or [GitHub Repository](https://github.com/feinstaub/webextension_local_filesystem_links)
  
- If not already done when asked during the addon installation, Install `LienExplorerFirefoxnative-app-setup.exe` *(for local file explorer links)*.
https://github.com/AWolf81/webextension_local_filesystem_links-native-host-binaries/raw/master/win32/native-app-setup.exe

- Go to Extensions settings in the settings page, then Local Filesystem Links, Option
- Uncheck the first box, check the second if you also want a folder icon next to the folder paths
- Check "Reveal link (open containing folder)"

### 12. Optional : Next steps are only required if you want the Jellyfin server on your PC to be only running when you use it. Otherwise skip to 17.

- Install Jellyfin Server as a service
- Choose **“Install as a Service”** during the installation process
- Default path

If it don't work with your already saved Jellyfin settings, you can reset some settings by deleting files in C:\ProgramData\Jellyfin\Server\config like network.xml and maybe other files too idk.
/!\ This will reset your server settings /!\

### 13. Configure Jellyfin Service to only Start with the browser and stop at closing it

- For auto-install, cleaner solution, no console popup window, all major browsers support, possibility for custom .bat at launch, notifications :
  Download and follow the instructions from the Readme in : [WIP.JellyfinServiceAutomation.zip](https://github.com/Damocles-fr/PPJF/releases/tag/10.7) (after each Jellyfin Server updates, go to Windows `services.msc` and set back **Jellyfin** **Startup type** **Manual**)
- Next Steps 13. 14. 15. 16. 17. are for manual installation of an older version of JellyfinServiceAutomation
- Search and Open for **Services**. in the windows start menu. Or Press `Win + R`, type `services.msc`, and press `Enter`.
  - Scroll down to find **Jellyfin** in the list.
  - Right-click it and select **Properties**.
  - In the **Startup type** dropdown, select **Manual**. (so it will start only via shortcut and not at the system boot)
  - Click **Apply** and then **OK**.
  - **This should be done again after each Jellyfin Server Updates**

### 14. Configure Windows Admin Prompt Skip

Everytime you launch Jellyfin service with a shorcut, there is an admin window, to prevent that :
- Go to ``` C:\ProgramData\PotPlayerJellyfin ```
- Right-click the shortcut "Jellyfin" and select **Properties**.
- Click **Advanced...** and check **Run as administrator**.
- Apply and save changes.

### 15. Skip Windows Admin Prompt by Setting Up Windows Task Scheduler

- Run Windows Task Scheduler
- On the right panel, click import a task
- In the window, select the XML file JellyfinUAC.xml located in ``` C:\ProgramData\PotPlayerJellyfin\ ```
- In the new windows, click Users or groups, then find your UserName, you can type your windows Username in the box then click Verify, then OK
- You can customize other settings if you want but it should work like that.
- Save & exit

### 16. Create a shortcut
- Go to ``` C:\ProgramData\PotPlayerJellyfin ```
- JellyfinUAC is the main shorcut, DO NOT MOVE IT.
- Right click on it, copy, then go to ``` C:\ProgramData\Microsoft\Windows\Start Menu\Programs ```
- There, right click and "paste as shorcut"
- Now, you can right click on it and Send to Desktop (Create a shortcut)
- Or Right click on it, copy, then "paste as shorcut" anywhere you want, rename it and change the icon.
- if you want to make it looks like an app, without any tabs and firefox bars edit the .bat and add -kiosk at the line 16 next to -url
 	- -kiosk don't work with local file links and prevent from using new tabs or 18. Bonus, and need ALT+F4 or right click close to exit, use Step 8 and 9 instead

### 17. Optional : Customize a shorcut (without start/stop the Jellyfin server)
- On your desktop, right click, new shortcut, enter : ``` "C:\Program Files\LibreWolf\librewolf.exe" http://localhost:8096/web/index.html#/home.html ```
- Or if you want to make it looks like an app, without any tabs and firefox bars, add -kiosk : ``` "C:\Program Files\LibreWolf\librewolf.exe" -kiosk http://localhost:8096/web/index.html#/home.html ```
  	- -kiosk don't work with local file links and prevent from using new tabs or 18. Bonus, use Step 8 and 9 instead
- Name it Jellyfin, on the new icon shortcut, right click, change icon, Browser... , ``` C:\Program Files\Jellyfin\Server ```, select the icon
- For having jellyfin icon instead of LibreWolf in the Windows taskbar, go C:\Program Files\LibreWolf and do the same with LibreWolf.exe
- Or you can just Bookmark Jellyfin or make it the start page of Librewolf

### 18. Optional : BONUS 
- Swift Selection Search by Daniel Lobo
https://addons.mozilla.org/fr/firefox/addon/swift-selection-search/
With this extension, when you select a text in the browser, like a movie title or the name of an actor, a box appear with the logo of websites.
- Click on it and it automatically go to a new tab and search on the website the selected text
You can Add IMDB, Youtube, Wikipedia, Steam, Google Maps, translators, lots of legal websites, or you can customize to any website search you want in the extension settings...

---

## Files in C:\ProgramData\PotPlayerJellyfin
- ``` potplayer.ps1 ``` : Do not delete. Main Script.
- ``` potplayer.reg ``` : Do not delete. You may need to run it again, especially after a Potplayer Update.
- ``` Install-PPJF-HiddenProtocol.ps1 ``` : One time run to hide the Powershell window at Potplayer launch.
- ``` OpenWithPotplayerUserscript.js ``` : backup file of the main browser script, it's in ViolentMonkey in your browser
- ``` OpenMediaInfoPathScriptmonkey.js ``` : backup file, it's in ViolentMonkey in your browser, only needed for local links
- Jellyfin.bat, Jellyfin, JellyfinUAC, JellyfinUAC.xml : Only needed for the server start and stop and and shortcuts without [WIP.JellyfinServiceAutomation.zip](https://github.com/Damocles-fr/PPJF/releases/tag/10.7)


---

## IMPORTANT
- Sometimes if it stop working, because of idk, **PotPlayer updates** or some specific settings change, just **re-run** `potplayer.reg` .
- If Potplayer takes time to launch, it's because your HDD is in standby, the script is waiting for your HDD to respond.
- To uninstall `Install-PPJF-HiddenProtocol.ps1` : run in Powershell :

     ```
     Remove-Item -Recurse -Force "HKCU:\Software\Classes\potplayer" -ErrorAction SilentlyContinue
     Remove-Item -Recurse -Force (Join-Path $env:LOCALAPPDATA "PPJF") -ErrorAction SilentlyContinue
     ```
- Workaround for some NAS and network drives :
  Edit "potplayer.ps1" located in ``` "C:\ProgramData\PotPlayerJellyfin" ```
  	- At the end of the file, just below : ``` # YOUR NAS CONFIG, IF NEEDED, ADD YOUR OWN WORKAROUND JUST BELOW ```
  	- Add this line : ``` $path = $path -replace "\\share\\SHAREFOLDER\\", "D:" ```
  	- In this, change ``` "\\share\\SHAREFOLDER\\" ``` with the start of the the wrong path shown if you click on "more info" when Potplayer fail to launch the media from Jellyfin,
  	  It should be the part of the path that appear in "more info" but not in the Windows explorer path of your movies
  	- Add double backslash ``` \\ ``` instead of single backslash ``` \ ``` in your own path, they are essential
  	- Replace "D:" with the drive letter of your NAS or drive in Windows
  	- Your NAS/network drives must be mount with a letter like D:\ E:\ ... in Windows.
  	- For exemple ``` $path = $path -replace "\\share\\_MEDIA\\", "D:" ```
	That works for everything located in my NAS mounted as the D: drive in Windows, so D:\FILMS, D:\SERIES etc.
	``` "\\share\\\_MEDIA\\" ``` depends of your NAS/drives configuration (see "more info" in Potplayer when it fail to launch the media from Jellyfin to identify your issue)
- The .js userscript can be put in Jellyfin JavaScript Injector plugin instead, but every play buttons in Jellyfin Web won't work anywhere else without the .ps1 and Potplayer.
- [Start and stop the Jellyfin server] and [WIP.JellyfinServiceAutomation] After each Jellyfin Server updates, go to Windows `services.msc` and set back **Jellyfin** **Startup type** **Manual** 
- If you use the Firefox extension ``` Dark Reader ``` , it breaks Jellyfin pictures loading in browsers, desactivate it only for jellyfin : Go into Dark Reader settings while you have the Jellyfin page open (firefox menu bar), click to uncheck Jellyfin URL.

## Need Help?
- Visit: [Jellyfin Forum Thread](https://forum.jellyfin.org/t-guide-jellyfin-with-potplayer) or **DM me** https://forum.jellyfin.org/u-damocles
- GitHub https://github.com/Damocles-fr/
