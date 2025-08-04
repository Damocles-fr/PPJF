@echo off
:: Example script: Mount Network Drives for Jellyfin
:: Place this file in C:\ProgramData\JellyfinServiceAutomation\
:: Then add "MountNetworkDrives.bat" to config.ini or during installation

echo Mounting network drives for Jellyfin...

:: Example 1: Mount a network share as drive Z:
:: Uncomment and modify the line below:
:: net use Z: \\192.168.1.100\MediaShare /persistent:no

:: Example 2: Mount with credentials
:: Uncomment and modify the line below:
:: net use Y: \\NAS\Movies /user:username password /persistent:no

:: Example 3: Mount multiple drives
:: net use X: \\SERVER\TV_Shows /persistent:no
:: net use W: \\SERVER\Music /persistent:no

:: Example 4: Check if drive already mounted before mounting
:: if not exist Z:\ (
::     net use Z: \\192.168.1.100\MediaShare /persistent:no
::     echo Drive Z: mounted successfully
:: ) else (
::     echo Drive Z: already mounted
:: )

:: Add your actual network drive commands here:

echo Network drives ready for Jellyfin
exit