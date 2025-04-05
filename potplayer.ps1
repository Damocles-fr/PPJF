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
# Lancer PotPlayer avec le chemin normalisé
& "C:\Program Files\DAUM\PotPlayer\PotPlayerMini64.exe" $path