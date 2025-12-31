Full guide with many tips and optionnal features for the best Jellyfin experience on a standalone browser at https://github.com/Damocles-fr/PPJF

PPJF.10.11.5 : PotPlayer launcher for Jellyfin Web

Quick install PPJF
1) Place required files

    Extract and move the PotPlayerJellyfin folder to: C:\ProgramData\
    You should end up with: C:\ProgramData\PotPlayerJellyfin\ (with all files inside).

2) Install PotPlayer (default path)

    No need to reinstall if it’s already installed
    Default path: C:\Program Files\DAUM\PotPlayer

3) Install a browser + Violentmonkey, then add my userscript

    Standalone Firefox/LibreWolf is good (many tips for the best Jellyfin experience in the full README)
    Install Violentmonkey
    Firefox add-on: https://addons.mozilla.org/fr/firefox/addon/violentmonkey/
    Browser settings → Extensions → Violentmonkey → three dots → Options
    Go to Installed Scripts
    Click + → New
    The editor opens with default content: delete everything (don’t close the editor)
    Go to: C:\ProgramData\PotPlayerJellyfin\
    Open OpenWithPotplayerUserscript.js with Notepad, select all, copy
    Paste everything into the Violentmonkey editor
    Click Save & Exit (top right)
    If your Jellyfin server is not the default address http://localhost:8096/, edit the .js script and replace it with your Jellyfin Web URL
    Example: http://192.168.1.10:8096/*
    Don’t forget the * at the end

4) Enable PowerShell script execution (Windows)

    In Windows 11: Settings → System → For developers → PowerShell → allow local PowerShell scripts / unsigned scripts (wording may vary)
    If you can’t find it:
        Search for PowerShell in the Start menu → right-click → Run as Administrator
        Run:
            Set-ExecutionPolicy RemoteSigned
        Or:
            Set-ExecutionPolicy RemoteSigned -Force

5) Apply PotPlayer registry settings

    Run potplayer.reg and confirm the changes
    You may need to re-run potplayer.reg after major PotPlayer updates
    Check the full README on GitHub for extra quality-of-life improvements
    Test it — done (if not, see workaround below)
    Many tips for the best jellyfin experience in the full readme

6) Optionnal : Hide the Powerscript windows at Potplayer launch
    Install-PPJF-HiddenProtocol.ps1 must be in default PotPlayerJellyfin folder.
    it require VBScript installed on Windows 11
	Run the file Install-PPJF-HiddenProtocol.ps1 (Right click and Run with PowerShell)


WORKAROUND : PotPlayer starts but fails to open the media

    Your NAS / network drives / HDD must be mapped to a drive letter in Windows (e.g. D:\, E:\, etc.)
    Edit potplayer.ps1 located in: C:\ProgramData\PotPlayerJellyfin\
        Near the end of the file, just before:
            echo "Normalized path: $path"
        Add this line:
            $path = $path -replace "\\share\\SHAREFOLDER\\", "D:"
        Replace "\\share\\SHAREFOLDER\\" with the beginning of the wrong path shown in PotPlayer “More info” when it fails
        Use double backslashes \\ (single \ will not work)
        Replace "D:" with your mapped drive letter
        Example (works for everything on my NAS mapped as D:):
            $path = $path -replace "\\share\\_MEDIA\\", "D:"
        The \\share\\_MEDIA\\ part depends on your NAS setup (use PotPlayer “More info” to identify what needs replacing)
		


IMPORTANT :
- Sometimes if it stop working, because of idk, PotPlayer updates or some specific settings change, just re-run potplayer.reg .
- If Potplayer takes time to launch, it's because your HDD is in standby, the script is waiting for your HDD to respond.
- To uninstall Install-PPJF-HiddenProtocol.ps1 : run in Powershell :
Remove-Item -Recurse -Force "HKCU:\Software\Classes\potplayer" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force (Join-Path $env:LOCALAPPDATA "PPJF") -ErrorAction SilentlyContinue
- The .js userscript can be put in Jellyfin JavaScript Injector plugin instead, but every play buttons in Jellyfin Web won't work anywhere else without the .ps1 and Potplayer.


FILES in C:\ProgramData\PotPlayerJellyfin
    potplayer.ps1 : Do not delete. Main Script.
    potplayer.reg : Do not delete. You may need to run it again, especially after a Potplayer Update.
    Install-PPJF-HiddenProtocol.ps1 : One time run to hide the Powershell window at Potplayer launch.
    OpenWithPotplayerUserscript.js : backup file of the main browser script, it's in ViolentMonkey in your browser
    OpenMediaInfoPathScriptmonkey.js : Only needed for local links (see Full guide on the GitHub)
    Jellyfin.bat, Jellyfin, JellyfinUAC, JellyfinUAC.xml : Only needed for optionnal features (see Full guide on the GitHub)
	
	
Full guide with many tips and optionnal features for the best Jellyfin experience on a standalone browser, like :
Optional :  Fullscreen or Semi-fullscreen (with the Windows Task bar)
Optional :  Clickable link to Windows File Explorer for the corresponding media (from the Jellyfin media information panel)
Optional : Jellyfin Service Automation, Start and stop the Jellyfin server automatically with the Jellyfin interface and closing it. 
Bonus : Select text and one click search selection on IMDB, YOUTUBE, or any websites

Full guide at https://github.com/Damocles-fr/PPJF


