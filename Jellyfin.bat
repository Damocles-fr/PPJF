@echo off

tasklist /FI "IMAGENAME eq jellyfin.exe" 2>NUL | find /I "jellyfin.exe" >NUL
if errorlevel 1 (
    net start JellyfinServer
)

:waitForServer
tasklist /FI "IMAGENAME eq jellyfin.exe" 2>NUL | find /I "jellyfin.exe" >NUL
if errorlevel 1 (
    net start JellyfinServer
)

curl -s http://localhost:8096 > nul
if %errorlevel% neq 0 (ping -n 1 -w 100 127.0.0.1 > nul & goto waitForServer)
start "" "C:\Program Files\LibreWolf\librewolf.exe" -url "http://localhost:8096/web/index.html#/home.html"

:EXECUTEserv
tasklist /FI "IMAGENAME eq jellyfin.exe" 2>NUL | find /I "jellyfin.exe" >NUL
if errorlevel 1 (
    net start JellyfinServer
)

timeout /t 1 >nul

:LOOP

tasklist | find /i "jellyfin.exe" >nul
IF ERRORLEVEL 1 GOTO EXECUTEserv
timeout /t 1 >nul


tasklist | find /i "librewolf.exe" >nul
IF ERRORLEVEL 1 GOTO EXECUTE
timeout /t 1 >nul
GOTO LOOP

:EXECUTE
net stop JellyfinServer
timeout /t 1 >nul
net stop JellyfinServer
exit
