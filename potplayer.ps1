Add-Type -Assembly System.Web

# Récupérer le chemin depuis les arguments
$path = $args[0]
$path = $path -replace "potplayer://", ""

# Décoder l'URL
$path = $path -replace "\+", "%2B"
$path = [System.Web.HttpUtility]::UrlDecode($path)

# Nettoyer les slashes et backslashes multiples
$path = $path -replace "///", "\"
$path = $path -replace "\\\", "\"
$path = $path -replace "\\", "\"
$path = $path -replace "//", "\"

# Est-ce un chemin UNC (réseau) ?
$estUNC = $false
if ($path -match "^\\\\") {
    $estUNC = $true
}

# Cas : \\?\UNC\ => \\serveur\...
$path = $path -replace "^\\\\\?\\UNC\\", "\\"

# Cas : \\?\X:\... => X:\...
$path = $path -replace "^\\\\\?\\", ""

# Tenter de remplacer un chemin partiel style "\movies\..." par un lecteur réseau mappé (ex : "M:\")
$drives = Get-PSDrive -PSProvider FileSystem | Where-Object { $_.DisplayRoot -ne $null }

foreach ($drive in $drives) {
    # Exemple : si le lecteur M: pointe vers \\NAS\movies, on cherche à faire correspondre "\movies"
    $remotePath = $drive.DisplayRoot.ToLower()
    $driveLetter = $drive.Name + ":\"

    # On récupère le dernier dossier du partage (ex: "movies")
    $shareName = Split-Path $remotePath -Leaf

    # Si le chemin commence par \movies\, on remplace par M:\ (ou autre lettre)
    if ($path -match "^\\$shareName\\") {
        $path = $path -replace "^\\$shareName\\", "$driveLetter"
        break  # On arrête dès qu’on a trouvé une correspondance
    }
}

# Supprimer un seul backslash initial si ce n’est ni un chemin UNC ni un chemin avec lettre de lecteur
if ($path -match "^\\[^\\]" -and -not ($path -match "^[A-Z]:") -and -not ($path -match "^\\\\")) {
    $path = $path.Substring(1)
}

# Corriger tous les chemins en début de chaîne pour tous les disques
$path = $path -replace "^([A-Z]):\\", '$1:\'
$path = $path -replace "^([A-Z])/", '$1:\'
$path = $path -replace "^([A-Z]):", '$1:\'

# Remplacer tous les chemins spécifiques utilisant \\?\ pour n'importe quel dossier
$path = $path -replace "([A-Z]):\\\\\?\\", '$1:\'  # Corriger pour tous les disques et tous les dossiers
$path = $path -replace "\\\\\?\\", "\"  # Remplacer \\?\ par un seul backslash pour tout le reste

# Normaliser tous les slashes restants en backslashes
$path = $path -replace "/", "\"

echo "Chemin normalisé : $path"

# Lancer PotPlayer
& "C:\Program Files\DAUM\PotPlayer\PotPlayerMini64.exe" "`"$path`""
