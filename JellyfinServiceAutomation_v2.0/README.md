# Jellyfin Service Automation v2.0

Automates Jellyfin Windows Service lifecycle - One click to start everything, close browser to stop service too.
Custom scripts - Run additional .bat files at startup (ex : MountNetworkDrives)

## ⚠️ Requirements

- **Jellyfin Server installed as Windows Service** (select this option during Jellyfin Server installation)
- **A web browser** (recommended) or Jellyfin Media Player

## ⚡ Quick Start INSTALLATION, but please read in full

1. **Install**: Right-click `JellyfinServiceAutomation_v2.bat` → Run as administrator
2. **Done!**: Desktop → shortcut "Jellyfin Service" (no UAC!)
Service starts/stops automatically with the new shortcut

**TIPS**:
- After a new Jellyfin Server Update, you may need to put back "Jellyfin Server" to "manual" in services.msc (search and run "services" in windows start menu)
- **Custom scripts** - Run additional .bat files at startup (ex : MountNetworkDrives)
- **Notifications** - Optional Windows notifications
- Edit config.ini to change settings path**: `C:\ProgramData\JellyfinServiceAutomation\`
 - **Custom path** - You can enter any executable path manually (for using Jellyfin MPV Shim or anything else)
- **Browser Benefits**: Web browsers allow you to use extensions for enhanced functionality:
- Use Firefox/LibreWolf/Waterfox as a dedicated browser just for jellyfin to install all of the firefox ADD-ONS you wants:
addons.mozilla.org
- Quick searches on YouTube, IMDB, TMDB searches, etc. : https://addons.mozilla.org/fr/firefox/ad...on-search/
- Clickable link to the local media folder (from the video media information panel) https://github.com/Damocles-fr/PPJF
- Swift Selection Search : https://addons.mozilla.org/fr/firefox/addon/swift-selection-search/
- Replaces jellyfin ratings with ratings from various sources: https://github.com/Druidblack/jellyfin_ratings
Select text and one click search selection on IMDB, YouTube, any websites you configure...
- **PotPlayer as a player** - Browsers only, with my Scripts and Guide: https://github.com/Damocles-fr/PPJF

**Jellyfin Media Player** does NOT support external players (like PotPlayer), browser extensions, or plugins.


## 📦 Installation

1. Ensure Jellyfin is installed as Windows Service
2. Run installer as administrator
3. Select your browser from the list OR choose custom path option
4. Configure options (notifications, scripts)
5. Use desktop shortcut
6. After a new Jellyfin Server Update, you may need to put back "Jellyfin Server" to "manual" in services.msc (search and run "services" in windows start menu)

**Installation path**: `C:\ProgramData\JellyfinServiceAutomation\`

The installer automatically creates a Windows scheduled task to bypass UAC prompts.

## 🎮 Daily Usage

**Start**: Double-click "Jellyfin Service" on desktop  
**Stop**: Close your browser - service stops automatically

## ⚙️ Configuration

Edit `C:\ProgramData\JellyfinServiceAutomation\config.ini`:

```ini
CLIENT_NAME=Firefox
CLIENT_PATH=C:\Program Files\Mozilla Firefox\firefox.exe
CLIENT_TYPE=BROWSER
JELLYFIN_URL=http://localhost:8096
SHOW_NOTIFICATIONS=1
NOTIFICATION_SOUND=0
```

## 🔧 Custom Scripts

Add up to 5 .bat scripts to run at startup:
1. Place scripts in installation folder
2. Reference in config.ini or during installation
3. Scripts run in parallel at startup

## 🗑️ Uninstall

Use "Uninstall Jellyfin Automation" shortcut on:
- Desktop
- Or Installation folder: `C:\ProgramData\JellyfinServiceAutomation\`

The uninstaller will:
- Remove the scheduled task
- Delete all files and folders
- Remove desktop shortcuts
- Stop Jellyfin service if running

## ❓ Troubleshooting

**Service won't start or start at session opening**
- Verify Jellyfin was installed as Windows Service during setup
- Check `services.msc` for "Jellyfin Server", it needs to be in manual mode

**Client not found**
- Check path in config.ini
- Reinstall and select correct browser

**Task scheduler issues**
1. First try: Delete task and reinstall
   ```
   schtasks /delete /tn "JellyfinServiceAutomation" /f
   ```
2. If that fails, import manually:
   - Open Task Scheduler (search in Windows)
   - Click "Import Task"
   - Browse to: `C:\ProgramData\JellyfinServiceAutomation\JellyfinTask.xml`
   - Click OK
   - In the new windows, click Users or groups, then find your UserName, you can type your Windows Username in the box then click Verify, then OK
	Save & exit

## 📊 Supported Browsers

The installer will detect installed browsers automatically.

**Best for PotPlayer:**
- **LibreWolf** ⭐ (Recommended)
- **Firefox** ⭐ (All editions)
- **Waterfox** ⭐ (All editions)

**Also supported:**
- Chrome
- Brave
- Vivaldi
- Opera/Opera GX
- Zen Browser
- Arc
- **Custom path** - You can enter any executable path manually (for using Jellyfin MPV Shim or anything else)

**Different approach:**
- Jellyfin Media Player - Native app, does NOT support external players, browser extensions, or plugins

GitHub: https://github.com/Damocles-fr/
Jellyfin Service Automation & PotPlayer Integration Guide: https://github.com/Damocles-fr/PPJF
