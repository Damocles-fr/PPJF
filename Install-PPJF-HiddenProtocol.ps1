$ErrorActionPreference = "Stop"

# Dossier d'installation
$dstDir = Join-Path $env:LOCALAPPDATA "PPJF"
New-Item -ItemType Directory -Path $dstDir -Force | Out-Null

# Copier le .ps1
$srcPs1 = Join-Path (Get-Location) "potplayer.ps1"
$dstPs1 = Join-Path $dstDir "potplayer.ps1"
Copy-Item -Path $srcPs1 -Destination $dstPs1 -Force

# Créer le wrapper VBS (aucune console)
$dstVbs = Join-Path $dstDir "ppjf-launch.vbs"
@'
Option Explicit
Dim fso, dir, ps1, arg, cmd
Set fso = CreateObject("Scripting.FileSystemObject")
dir = fso.GetParentFolderName(WScript.ScriptFullName)
ps1 = fso.BuildPath(dir, "potplayer.ps1")

arg = ""
If WScript.Arguments.Count > 0 Then
  arg = WScript.Arguments(0)
End If

cmd = "powershell.exe -NoLogo -NoProfile -NonInteractive -ExecutionPolicy Bypass -WindowStyle Hidden -File """ & ps1 & """ """ & arg & """"
CreateObject("WScript.Shell").Run cmd, 0, False
'@ | Set-Content -Path $dstVbs -Encoding ASCII

# Enregistrer le protocole potplayer:// pour l'utilisateur (HKCU)
$protoKey = "HKCU:\Software\Classes\potplayer"
New-Item -Path $protoKey -Force | Out-Null
Set-Item -Path $protoKey -Value "URL:PotPlayer (PPJF)" | Out-Null
New-ItemProperty -Path $protoKey -Name "URL Protocol" -Value "" -PropertyType String -Force | Out-Null

# Commande du protocole -> wscript (zéro fenêtre)
$cmdKey = "$protoKey\shell\open\command"
New-Item -Path $cmdKey -Force | Out-Null
$cmd = "`"$env:SystemRoot\System32\wscript.exe`" `"$dstVbs`" `"%1`""
Set-Item -Path $cmdKey -Value $cmd | Out-Null
