@echo off
:: Jellyfin Service Automation v3.0 - IMPROVED VERSION
:: GitHub: https://github.com/Damocles-fr/

:: Detect mode from command line
if /i "%~1"=="LAUNCHER" goto :LAUNCHER_MODE
if /i "%~1"=="UNINSTALL" goto :UNINSTALL_MODE

:: ============================================
:: INSTALLATION MODE
:: ============================================
setlocal enabledelayedexpansion
color 0E
title Jellyfin Service Automation v3.0 - Installation

:: Check admin rights first
>nul 2>&1 "%SYSTEMROOT%\system32\cacls.exe" "%SYSTEMROOT%\system32\config\system"
if %errorlevel% neq 0 (
    echo ============================================
    echo  JELLYFIN SERVICE AUTOMATION v3.0
    echo ============================================
    echo.
    echo This installer requires administrator rights.
    echo.
    echo Restarting with admin privileges...
    echo.
    powershell -Command "Start-Process '%~f0' -Verb RunAs -WindowStyle Normal"
    exit /b
)

:: Set variables
set "INSTALL_DIR=C:\ProgramData\JellyfinServiceAutomation"
set "DESKTOP=%USERPROFILE%\Desktop"

:: Welcome screen
cls
echo ============================================
echo  JELLYFIN SERVICE AUTOMATION v3.0
echo ============================================
echo.
echo This tool automates Jellyfin service lifecycle:
echo - One click to start service + browser
echo - Close browser to stop service
echo - No UAC prompts after setup
echo.
echo REQUIREMENT: Jellyfin must be installed as Windows Service
echo.
pause

:: Check Jellyfin service
echo.
echo Checking Jellyfin service...
sc query JellyfinServer >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Jellyfin service not found!
    echo.
    echo Please install Jellyfin Server with the
    echo "Install as Windows Service" option
    echo.
    pause
    exit /b
)
echo [OK] Jellyfin service found

:: Set service to Manual mode
echo Setting service to Manual startup...
sc config JellyfinServer start=demand >nul 2>&1
if errorlevel 1 (
    echo [WARNING] Could not set service to Manual
) else (
    echo [OK] Service set to Manual startup
)

:: Create installation directory
echo Creating installation directory...
if not exist "%INSTALL_DIR%" mkdir "%INSTALL_DIR%"

:: Browser selection
cls
echo ============================================
echo  SELECT YOUR BROWSER
echo ============================================
echo.
echo 1. Firefox (BEST for PotPlayer)
echo 2. LibreWolf (BEST for PotPlayer)
echo 3. Waterfox (BEST for PotPlayer)
echo 4. Chrome
echo 5. Brave
echo 6. Opera
echo 7. Vivaldi
echo 8. Jellyfin Media Player (NO extensions/PotPlayer)
echo 9. Enter custom path
echo.
set /p "CHOICE=Your choice (1-9): "

if "%CHOICE%"=="1" (
    set "CLIENT_NAME=Firefox"
    set "CLIENT_PATH=C:\Program Files\Mozilla Firefox\firefox.exe"
    set "CLIENT_EXE=firefox.exe"
    set "CLIENT_TYPE=BROWSER"
) else if "%CHOICE%"=="2" (
    set "CLIENT_NAME=LibreWolf"
    set "CLIENT_PATH=C:\Program Files\LibreWolf\librewolf.exe"
    set "CLIENT_EXE=librewolf.exe"
    set "CLIENT_TYPE=BROWSER"
) else if "%CHOICE%"=="3" (
    set "CLIENT_NAME=Waterfox"
    set "CLIENT_PATH=C:\Program Files\Waterfox\waterfox.exe"
    set "CLIENT_EXE=waterfox.exe"
    set "CLIENT_TYPE=BROWSER"
) else if "%CHOICE%"=="4" (
    set "CLIENT_NAME=Chrome"
    set "CLIENT_PATH=C:\Program Files\Google\Chrome\Application\chrome.exe"
    set "CLIENT_EXE=chrome.exe"
    set "CLIENT_TYPE=BROWSER"
) else if "%CHOICE%"=="5" (
    set "CLIENT_NAME=Brave"
    set "CLIENT_PATH=C:\Program Files\BraveSoftware\Brave-Browser\Application\brave.exe"
    set "CLIENT_EXE=brave.exe"
    set "CLIENT_TYPE=BROWSER"
) else if "%CHOICE%"=="6" (
    set "CLIENT_NAME=Opera"
    set "CLIENT_PATH=C:\Program Files\Opera\opera.exe"
    set "CLIENT_EXE=opera.exe"
    set "CLIENT_TYPE=BROWSER"
) else if "%CHOICE%"=="7" (
    set "CLIENT_NAME=Vivaldi"
    set "CLIENT_PATH=C:\Program Files\Vivaldi\Application\vivaldi.exe"
    set "CLIENT_EXE=vivaldi.exe"
    set "CLIENT_TYPE=BROWSER"
) else if "%CHOICE%"=="8" (
    set "CLIENT_NAME=Jellyfin Media Player"
    set "CLIENT_PATH=C:\Program Files\Jellyfin\Jellyfin Media Player\JellyfinMediaPlayer.exe"
    set "CLIENT_EXE=JellyfinMediaPlayer.exe"
    set "CLIENT_TYPE=PLAYER"
) else (
    set /p "CLIENT_PATH=Enter full path: "
    set /p "CLIENT_NAME=Enter name: "
    for %%F in ("!CLIENT_PATH!") do set "CLIENT_EXE=%%~nxF"
    set "CLIENT_TYPE=BROWSER"
)

:: Options
echo.
echo Notifications (1=Yes with sound, 2=Yes no sound, 3=No): 
choice /C 123 /N
set NOTIF=!errorlevel!

if !NOTIF!==1 (
    set "SHOW_NOTIF=1"
    set "NOTIF_SOUND=1"
) else if !NOTIF!==2 (
    set "SHOW_NOTIF=1"
    set "NOTIF_SOUND=0"
) else (
    set "SHOW_NOTIF=0"
    set "NOTIF_SOUND=0"
)

:: Custom scripts option
echo.
set "CUSTOM_SCRIPTS=0"
choice /C YN /N /M "Add custom startup scripts? (Y/N): "
if !errorlevel! equ 1 (
    set "CUSTOM_SCRIPTS=1"
    echo.
    echo Enter script filenames (include .bat extension)
    echo Example: MountNetworkDrives.bat
    echo Place them in: %INSTALL_DIR%
    echo Press Enter to skip
    echo.
    
    for /l %%i in (1,1,3) do (
        set "SCRIPT%%i="
        set /p "SCRIPT%%i=Script %%i (optional): "
        if defined SCRIPT%%i (
            if exist "!SCRIPT%%i!" (
                copy /Y "!SCRIPT%%i!" "%INSTALL_DIR%\" >nul 2>&1
                echo   Copied: !SCRIPT%%i!
            )
        )
    )
)

:: Install files
echo.
echo Installing files...

:: Copy this file
copy /Y "%~f0" "%INSTALL_DIR%\JellyfinServiceAutomation.bat" >nul

:: Create config.ini
(
echo ; Jellyfin Service Automation Configuration
echo CLIENT_NAME=!CLIENT_NAME!
echo CLIENT_PATH=!CLIENT_PATH!
echo CLIENT_EXE=!CLIENT_EXE!
echo CLIENT_TYPE=!CLIENT_TYPE!
echo JELLYFIN_URL=http://localhost:8096
echo SHOW_NOTIFICATIONS=!SHOW_NOTIF!
echo NOTIFICATION_SOUND=!NOTIF_SOUND!
echo CHECK_INTERVAL=2
) > "%INSTALL_DIR%\config.ini"

:: Add custom scripts to config
if !CUSTOM_SCRIPTS! equ 1 (
    echo. >> "%INSTALL_DIR%\config.ini"
    echo ; Custom Scripts >> "%INSTALL_DIR%\config.ini"
    for /l %%i in (1,1,3) do (
        if defined SCRIPT%%i (
            echo CUSTOM_BAT_%%i=!SCRIPT%%i! >> "%INSTALL_DIR%\config.ini"
        )
    )
)

:: Create scheduled task
echo Creating scheduled task...
schtasks /create /tn "JellyfinServiceAutomation" ^
    /tr "\"%INSTALL_DIR%\JellyfinServiceAutomation.bat\" LAUNCHER" ^
    /sc ONCE /st 00:00 /sd 01/01/2099 /rl HIGHEST /f >nul 2>&1

:: Create shortcuts
echo Creating shortcuts...

:: Desktop launcher with Jellyfin icon
powershell -Command "$s=(New-Object -COM WScript.Shell).CreateShortcut('%DESKTOP%\Jellyfin Service.lnk');$s.TargetPath='C:\Windows\System32\schtasks.exe';$s.Arguments='/run /tn \"JellyfinServiceAutomation\"';$s.IconLocation='C:\Program Files\Jellyfin\Server\icon.ico';$s.WindowStyle=7;$s.Save()" >nul

:: Uninstall shortcuts
powershell -Command "$s=(New-Object -COM WScript.Shell).CreateShortcut('%DESKTOP%\Uninstall Jellyfin Automation.lnk');$s.TargetPath='%INSTALL_DIR%\JellyfinServiceAutomation.bat';$s.Arguments='UNINSTALL';$s.IconLocation='C:\Windows\System32\shell32.dll,31';$s.Save()" >nul
powershell -Command "$s=(New-Object -COM WScript.Shell).CreateShortcut('%INSTALL_DIR%\Uninstall.lnk');$s.TargetPath='%INSTALL_DIR%\JellyfinServiceAutomation.bat';$s.Arguments='UNINSTALL';$s.IconLocation='C:\Windows\System32\shell32.dll,31';$s.Save()" >nul

:: Done
cls
echo ============================================
echo  INSTALLATION COMPLETE!
echo ============================================
echo.
echo Client: !CLIENT_NAME!
echo Installed to: %INSTALL_DIR%
echo Service mode: Manual (won't start with Windows)
echo.
echo Desktop shortcuts created:
echo - "Jellyfin Service" (launcher - NO UAC!)
echo - "Uninstall Jellyfin Automation"
echo.
echo To start: Double-click "Jellyfin Service"
echo To stop: Close your browser
echo.
echo PotPlayer guide: https://github.com/Damocles-fr/PPJF
echo.
pause
exit

:: ============================================
:: LAUNCHER MODE
:: ============================================
:LAUNCHER_MODE
@echo off
setlocal enabledelayedexpansion
cd /d "%~dp0"

:: Load config
for /f "tokens=1,* delims==" %%A in (config.ini) do (
    set "%%A=%%B"
)

:: Launch custom scripts if defined
for /l %%i in (1,1,3) do (
    if defined CUSTOM_BAT_%%i (
        if exist "%~dp0!CUSTOM_BAT_%%i!" (
            start "Script%%i" /MIN cmd /c "%~dp0!CUSTOM_BAT_%%i!"
        )
    )
)

:: Start service
net start JellyfinServer >nul 2>&1

:: Wait for Jellyfin
:wait
timeout /t 1 /nobreak >nul
curl -s -o nul "%JELLYFIN_URL%" >nul 2>&1
if errorlevel 1 goto :wait

:: Launch client
if "%CLIENT_TYPE%"=="BROWSER" (
    start "" "%CLIENT_PATH%" "%JELLYFIN_URL%"
) else (
    start "" "%CLIENT_PATH%"
)

:: Show notification if enabled
if "%SHOW_NOTIFICATIONS%"=="1" (
    powershell -WindowStyle Hidden -Command "[System.Reflection.Assembly]::LoadWithPartialName('System.Windows.Forms')|Out-Null;$n=New-Object System.Windows.Forms.NotifyIcon;$n.Icon=[System.Drawing.SystemIcons]::Information;$n.Visible=$true;$n.ShowBalloonTip(3000,'Jellyfin','Service started with %CLIENT_NAME%',[System.Windows.Forms.ToolTipIcon]::Info);Start-Sleep 3;$n.Dispose()" >nul 2>&1
)

:: Monitor
:monitor
timeout /t 2 /nobreak >nul
tasklist /FI "IMAGENAME eq %CLIENT_EXE%" 2>NUL | find /I "%CLIENT_EXE%" >NUL
if errorlevel 1 goto :stop
goto :monitor

:stop
:: Stop notification if enabled
if "%SHOW_NOTIFICATIONS%"=="1" (
    powershell -WindowStyle Hidden -Command "[System.Reflection.Assembly]::LoadWithPartialName('System.Windows.Forms')|Out-Null;$n=New-Object System.Windows.Forms.NotifyIcon;$n.Icon=[System.Drawing.SystemIcons]::Information;$n.Visible=$true;$n.ShowBalloonTip(2000,'Jellyfin','Stopping service...',[System.Windows.Forms.ToolTipIcon]::Info);Start-Sleep 2;$n.Dispose()" >nul 2>&1
)

net stop JellyfinServer >nul 2>&1
exit

:: ============================================
:: UNINSTALL MODE
:: ============================================
:UNINSTALL_MODE
@echo off
color 0C
echo.
echo ============================================
echo  UNINSTALLATION
echo ============================================
echo.
echo This will remove:
echo - Scheduled task
echo - Desktop shortcuts
echo - Installation folder
echo - Restore Jellyfin to automatic startup
echo.
choice /C YN /N /M "Continue? (Y/N): "
if errorlevel 2 exit /b

:: Get admin if needed
>nul 2>&1 "%SYSTEMROOT%\system32\cacls.exe" "%SYSTEMROOT%\system32\config\system"
if errorlevel 1 (
    echo Getting admin rights...
    powershell -Command "Start-Process '%~f0' 'UNINSTALL' -Verb RunAs"
    exit /b
)

echo.
echo Uninstalling...

:: Stop service if running
sc query JellyfinServer | find "RUNNING" >nul 2>&1
if not errorlevel 1 (
    echo - Stopping Jellyfin service...
    net stop JellyfinServer >nul 2>&1
)

:: Restore service to automatic
echo - Restoring service to automatic startup...
sc config JellyfinServer start=auto >nul 2>&1

:: Remove task
echo - Removing scheduled task...
schtasks /delete /tn "JellyfinServiceAutomation" /f >nul 2>&1

:: Remove shortcuts
echo - Removing shortcuts...
del "%USERPROFILE%\Desktop\Jellyfin Service.lnk" >nul 2>&1
del "%USERPROFILE%\Desktop\Uninstall Jellyfin Automation.lnk" >nul 2>&1

:: Remove folder
echo - Removing installation folder...
cd /d "%TEMP%"
timeout /t 2 /nobreak >nul
rmdir /s /q "C:\ProgramData\JellyfinServiceAutomation" >nul 2>&1

echo.
echo ============================================
echo  UNINSTALL COMPLETE!
echo ============================================
echo.
echo - Jellyfin service restored to automatic startup
echo - All files and shortcuts removed
echo.
pause
exit