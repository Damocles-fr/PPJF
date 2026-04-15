## Guide and tips for Jellyfin
### => New external player launcher version also compatible with Jellyfin Media Player desktop App, Potplayer or MPC : [MPC-JF](https://github.com/Damocles-fr/MPC-JF)
---

This tutorial explain :

    Tips and tricks for Jellyfin
	
	Launch medias from the Jellyfin web interface directly with PotPlayer, MPC... : https://github.com/Damocles-fr/MPC-JF

    Clickable link to Windows File Explorer for the corresponding media (from the Jellyfin media information panel)

    Jellyfin Service Automation, Start and stop the Jellyfin server automatically with the Jellyfin interface and closing it. 

	Launch Jellyfin Web in fullscreen
    
    Select text and one click search selection on IMDB, YOUTUBE, or any websites

---

# GUIDE

## Small tips and tricks

* **Analyse library takes too long (JF 10.11) :** All seasons of a TV show must be stored together in the single folder that corresponds to that same show. Previously, I had seasons scattered across multiple folders, after moving them all into the correct show folder, the library scan time dropped from four hours to a few minutes.
* **Pin some Collections to the top** : Rename the Collection "sorting title" field so it sorts first alphabetically, handy to separate theme/studio Collections from a long list of sagas and keep them at the top. And/or use "• " in the "title" field to also visually separate them from the rest.
* **Use the generated splashscreen for nice Library/Collection card covers** : Jellyfin generates a splash screen image from your media (path : jellyfin/database/data/splashscreen.png). Feed it into Jellyfin Cover Maker ( [JF Cover Maker](https://jfcovers.jan.run/) ) to create great-looking Library tiles. After each library scan, the splashscreen.png change, so you can grab different variants for different Libraries.
* **Remove items from Home → Continue Watching** **/ Next Up** : you can do it with KefinTweaks plugin (adds a remove button), but you can also do it manually by quickly toggling the watched status : click the checkmark to mark played then immediately mark unplayed. After refreshing the Home screen, the item disappears and isn't consider as watched. For Next Up, maybe it needs to be done to the whole TV show checkmark.
* **Make subtitles less dazzling/distracting** : set the subtitle font color to a light gray instead of pure white. Essential for dark scenes, especially in HDR.
* **English posters, local-language overview** : set the Library’s metadata language to English, run Refresh metadata with Replace all metadata and Replace existing images checked. Then switch the Library metadata language back to your language and run Refresh metadata again with Replace all metadata enabled but without checking replacing images.
* **Edit a user’s preferences without logging in as them** : Dashboard → Users → open a user → click “Edit this user’s profile, image and personal preferences.”
* Also, update the library display order for each user (it's not always the same as the admin, ty for the tips CordedMink2).
* **Avoid useless video transcodes for users that don't need it** : in the user’s settings, disable “Allow video playback that requires transcoding."
* **Login background** : I find this login background awesome : [background jpg](https://static.videezy.com/system/resources/thumbnails/000/055/009/original/old_tv_glitches_and_static_noise_2838.jpg) .
* **Poster glitch / Dark Reader slowdown** : if you use Dark Reader (or similar), disable it for your Jellyfin server URL. It can heavily slow down Jellyfin Web page and even glitch posters loads.
* **Web browser extension to swiftly access your search engines in a popup panel.** Context menu also included! You can customize it to add any of your favorite websites like Letterboxd, Wikipedia, Youtube, google etc : [Swift Selection Search](https://addons.mozilla.org/en-US/firefox/addon/swift-selection-search/?utm_source=addons.mozilla.org&utm_medium=referral&utm_content=search)
* **TV series year display** : the thumb view does not show airing years, but Thumb with Card does show it.
* **Display a colored card box with custom text** on the home : the JavaScript Injector plugin can be use for that too ( [CSS card box example for JF 10.7](https://pastebin.com/5h4XwSuf) ).
* **Metadata isn’t being updated when refreshing**, double-check that the metadata isn’t locked. Also, when locking metadata on a collection, it seems to lock metadata on all items in the collection. (ty for the tips glandix)
* [Jellyfin FAQ](https://jellyfin.org/docs/general/server/media/movies) is great, here the naming rules, you don't need to strictly follow those rules, but the more you do, the faster the library scan will be, and the less you will have to manually click Identify media.
* **Auto detection not working to import new media on linux** : [ty for the tips Jandalslap-\_-](https://www.reddit.com/r/JellyfinCommunity/comments/1r9voiu/comment/o6ifpnc/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button)

## Install LibreWolf (a lighter and Privacy optimised Firefox) or Firefox, for using the next tips and scripts.

	- Not tested with Chrome – using LibreWolf is recommended and easier for the optionals in this setup.
	- You can install multiple Firefox/LibreWolf/Nightly/Any fork on the same computer. I strongly recommend to install LibreWolf separately from your main browser.
	- This way you can launch Jellyfin directly in full-screen mode and/or hide the browser menu bar, as well as enabling separate configurations such as a default zoom of 120%, differents firefox addons for this browser etc...
	- This also allows to use the Optional feature to start Jellyfin server automatically while launching the web interface and to stop jellyfin server after closing the window.
 	- "Local Filesystem Links extension" needed for the links feature have minors security flaws and display a notification in private mod, I recommend not to use your main browser with it.
- Install **LibreWolf** (or any Firefox fork that supporting **ViolentMonkey/TamperMonkey** extension, not tested with chromonium browser but it should should too).
- https://librewolf.net/installation/windows/
- Default path: `C:\Program Files\LibreWolf`

## If you want Local Files/folders Links in jellyfin media info

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
