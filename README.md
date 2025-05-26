# PPJF
# Jellyfin with PotPlayer – Setup Guide  ##

This tutorial explains how to set up Jellyfin Server on Windows to:

    Launch medias from the Jellyfin web interface directly in PotPlayer. Steps 1 to 6 required.

    Optional :  One click link to the corresponding media local folder from the Jellyfin media information panel.

    Optional : Start and stop the Jellyfin server automatically at launching the web interface and closing it.
    
    Bonus : Select text and one click search selection on IMDB, YOUTUBE, or any websites

---

- Not tested with Chrome – using LibreWolf is recommended and easier for this setup.
- You can install multiple Firefox/LibreWolf/Nightly/Any fork on the same computer. I strongly recommend to install LibreWolf separately from your main browser.
- This way you can launch Jellyfin directly in full-screen mode and/or hide the browser menu bar, as well as enabling separate configurations such as a default zoom of 120%, differents firefox addons for this browser etc...
- This also allows to use the Optional feature to start Jellyfin server automatically while launching the web interface and to stop jellyfin server after closing the window.
---

## Security Notice

- For the Optional local folder link, you need to install "native-app-setup.exe" and the firefox extension "Local Filesystem Links" by austrALIENsun, AWolf
[GitHub Repository](https://github.com/feinstaub/webextension_local_filesystem_links)
- If you have security concerns, feel free not to install it.
- I have no affiliation with this extension or its creators.
- Use a separate LibreWolf/Firefox installation to minimize risks.

---

## Installation Steps

- Steps 1 to 6 are required.

### 0. Download PPJF.zip

Download [PPJF.zip](https://github.com/Damocles-fr/PPJF/releases/tag/v1.0)

### 1. Place Required Files

- Extract and move the PotPlayerJellyfin folder to :
  ```
  C:\ProgramData\
  ```
If you put it anywhere else, adapt any lines with your own path.

so you should have C:\ProgramData\PotPlayerJellyfin\
With eight files in it.

### 2. Install PotPlayer

- No need to reinstall if already installed
- Default path: `C:\Program Files\DAUM\PotPlayer`

### 3. Install LibreWolf (a lighter and Privacy optimised Firefox)

- Install **LibreWolf** (or any fork that supporting **ViolentMonkey/TamperMonkey** extension).
https://librewolf.net/installation/windows/
- Default path: `C:\Program Files\LibreWolf`
- if you want to use with your current browser or a different one, don't forget step 10
- Local Filesystem Links extension needed for the optional links feature have minors security flaws, I recommend not to use your main browser with it.

### 4. Install ViolentMonkey and my scripts

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

- Optional : If you want Local Files Links in jellyfin media info
	- Do the same in ViolentMonkey, +, new, delete all the lines, but copy/paste from the file OpenMediaInfoPathScriptmonkey.js, save and exit.

### 5. Enable PowerShell Scripts Execution (Windows)

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

- Run `PotPlayerMini64.reg` and confirm changes.
- You may need to re-run PotPlayerMini64.reg after major Potplayer Updates.
- You can test if it works now.
- The next steps are optional, but I recommend checking them out for quality-of-life improvements

### 7. Optional : Preserving User login and settings in the browser

- For the browser to remember your session settings and passwords.
- In Librewolf, go to settings, then Privacy & Security on the left side panel
- Cookies and Site Data, click on manage exeption
- In the new box, add http://localhost:8096/ (default) or your Jellyfin server URL
- Save changes
- Now go to LibreWolf on the left side panel
- Uncheck ResistFingerprinting

### 8. Optional : Adjust LibreWolf Full-Screen Settings

- Only if you want to use Jellyfin in Full-screen mod and still be able to see the Windows Task bar
- In LibreWolf
- Type `about:config` in the adress bar, agree if ask anything
- In the new page, search, type : full-screen-api.ignore-widgets
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
http://localhost:8096 and librewolf.exe path C:\Program Files\LibreWolf\librewolf.exe" Potplayer path C:\Program Files\DAUM\PotPlayer\PotPlayerMini64.exe
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

- potplayer.ps1 support all A-Z local drive, it may need edit if you use network drives I don't know
- If you use a different Potplayer installation path, modify the last line that is set to PotPlayer defaut installation folder C:\Program Files\DAUM\PotPlayer\PotPlayerMini64.exe


### 11. Optional : Media info link to the local file folder, if you don't want it, skip to 12.

- LibreWolf, Install **Local Filesystem Links** extension from:
  - [https://addons.mozilla.org/fr/firefox/addon/local-filesystem-links/](https://addons.mozilla.org/fr/firefox/addon/local-filesystem-links/)
  - Or [GitHub Repository](https://github.com/feinstaub/webextension_local_filesystem_links)
  
- If not already done when asked, Install `LienExplorerFirefoxnative-app-setup.exe` *(for local file explorer links)*.
https://github.com/AWolf81/webextension_local_filesystem_links-native-host-binaries/raw/master/win32/native-app-setup.exe

- Go to Extensions settings in the settings page, then Local Filesystem Links, Option
- Uncheck the first box, check the second if you also want a folder icon next to the folder paths
- Check "Reveal link (open containing folder)"

### 12. Optional : Next steps are only required if you want the Jellyfin server to be only running when you use it on your PC. Otherwise skip to 17.

- Install Jellyfin Server as a service
- Choose **“Install as a Service”** during the installation process
- Default path

If it don't work with your already saved Jellyfin settings, you can reset some settings by deleting files in C:\ProgramData\Jellyfin\Server\config like network.xml and maybe other files too idk.
/!\ This will reset your server settings /!\

### 13. Configure Jellyfin Service to only Start with Librewolf and stop at closing Librewolf

- Search and Open for **Services**. in the windows start menu. Or Press `Win + R`, type `services.msc`, and press `Enter`.
  - Scroll down to find **Jellyfin** in the list.
  - Right-click it and select **Properties**.
  - In the **Startup type** dropdown, select **Manual**. (so it will start only via shortcut and not at the system boot)
  - Click **Apply** and then **OK**.

### 14. Configure Windows Admin Prompt Skip

Everytime you launch Jellyfin service with a shorcut, there is an admin window, to prevent that :
- Go to C:\ProgramData\PotPlayerJellyfin
- Right-click the shortcut "Jellyfin" and select **Properties**.
- Click **Advanced...** and check **Run as administrator**.
- Apply and save changes.

### 15. Skip Windows Admin Prompt by Setting Up Windows Task Scheduler

- Run Windows Task Scheduler
- On the right panel, click import a task
- In the window, select the XML file JellyfinUAC.xml located in C:\ProgramData\PotPlayerJellyfin\
- In the new windows, click Users or groups, then find your UserName, you can type your windows Username in the box then click Verify, then OK
- You can customize other settings if you want but it should work like that.
- Save & exit

### 16. Create a shortcut
- Go to C:\ProgramData\PotPlayerJellyfin
- JellyfinUAC is the main shorcut, DO NOT MOVE IT.
- Right click on it, copy, then go to C:\ProgramData\Microsoft\Windows\Start Menu\Programs
- There, right click and "paste as shorcut"
- Now, you can right click on it and Send to Desktop (Create a shortcut)
- Or Right click on it, copy, then "paste as shorcut" anywhere you want, rename it and change the icon.
- if you want to make it looks like an app, without any tabs and firefox bars edit the .bat and add -kiosk at the line 16 next to -url
 	- -kiosk don't work with local file links and prevent from using new tabs or 18. Bonus, use Step 8 and 9 instead

### 17. Optional : Customize a shorcut (without start/stop the Jellyfin server)
- On your desktop, right click, new shortcut, enter : "C:\Program Files\LibreWolf\librewolf.exe" http://localhost:8096/web/index.html#/home.html
- Or if you want to make it looks like an app, without any tabs and firefox bars, add -kiosk : "C:\Program Files\LibreWolf\librewolf.exe" -kiosk http://localhost:8096/web/index.html#/home.html
  	- -kiosk don't work with local file links and prevent from using new tabs or 18. Bonus, use Step 8 and 9 instead
- Name it Jellyfin, on the new icon shortcut, right click, change icon, Browser... , C:\Program Files\Jellyfin\Server, select the icon
- For having jellyfin icon instead of LibreWolf in the Windows taskbar, go C:\Program Files\LibreWolf and do the same with LibreWolf.exe
- Or you can just Bookmark Jellyfin or make it the start page of Librewolf

### 18. Optional : BONUS 
- Swift Selection Search by Daniel Lobo
https://addons.mozilla.org/fr/firefox/addon/swift-selection-search/
With this extension, when you select a text in the browser, like a movie title or the name of an actor, a box appear with the logo of websites.
- Click on it and it automatically go to a new tab and search on the website the selected text
You can Add IMDB, Youtube, Wikipedia, Steam, Google Maps, translators, lots of legal websites, or you can customize to any website search you want in the extension settings...

### 19. Optional : Files in C:\ProgramData\PotPlayerJellyfin
- potplayer.ps1 : Do not delete. Main Script.
- potplayer.reg : Do not delete. You may need to run it, especially after a Potplayer Update.
- README.md : You are reading it right now
- Jellyfin.bat, Jellyfin, JellyfinUAC, JellyfinUAC.xml : Only needed for the server start and stop and and shortcuts
- OpenMediaInfoPathScriptmonkey.js : backup file, it's in ViolentMonkey in your browser, only needed for local links
- OpenWithPotplayerUserscript.js : backup file, it's in ViolentMonkey in your browser

## IMPORTANT ##
- Sometimes if it stop working, because of idk, **PotPlayer updates** or some specific settings change, just **re-run** `PotPlayerMini64.reg`.
Should be fine but if it happens too often, you can add a line or create .bat to run PotPlayerMini64.reg everytime or at system startup.
- Not tested with NAS or network drives, let me know if it works, if not, .ps1 may need some tweaking.
- [Start and stop the Jellyfin server] If you close the .bat (black window) before closing the browser, the Jellyfin Server will keep running in the background.
- [Start and stop the Jellyfin server] Go to Windows `services.msc` **Jellyfin** **Startup type** **Manual** after each Jellyfin Server updates.

## Need Help?
- Visit: [Jellyfin Forum Thread](https://forum.jellyfin.org/t-guide-jellyfin-with-potplayer) or **DM me** https://forum.jellyfin.org/u-damocles
- GitHub https://github.com/Damocles-fr/PPJF/
