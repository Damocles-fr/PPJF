Add-Type -Assembly System.Web

# Récupérer le chemin depuis les arguments
$path = $args[0]
$path = $path -replace "potplayer://" , ""

# Décoder l'URL
$path = $path -replace "\+", "%2B"
$path = [System.Web.HttpUtility]::UrlDecode($path)

# Nettoyer les slashes et backslashes multiples
$path = $path -replace "///", "\"
$path = $path -replace "\\\", "\"
$path = $path -replace "\\", "\"
$path = $path -replace "//", "\"

# Corriger les chemins de base (uniquement au début de la chaîne)
$path = $path -replace "^D\\", "D:\"
$path = $path -replace "^T\\", "T:\"
$path = $path -replace "^D/", "D:\"
$path = $path -replace "^T/", "T:\"

# Assurer les chemins spécifiques
$path = $path -replace "D:\\?Torrents", "D:\Torrents"
$path = $path -replace "T:\\?Media", "T:\Media"

# Normaliser tous les slashes restants en backslashes
$path = $path -replace "/", "\"

echo "Chemin normalisé : $path"
# Lancer PotPlayer avec le chemin normalisé
& "C:\Program Files\DAUM\PotPlayer\PotPlayerMini64.exe" $path