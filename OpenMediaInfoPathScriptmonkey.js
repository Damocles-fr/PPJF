// ==UserScript==
// @name         Open local path directory
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Open with Potplayer or subfolder with the Addon Local Filesystem Links by austrALIENsun AWolf
// @author       Damocles
// @match        http://localhost:8096/web/index.html
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function replaceTextWithLinks(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            let text = node.nodeValue;
            let regex = /\b([A-Z]):\\(?:[^\\]+\\)*[^\\]+\.(mkv|mp4|avi)\b/gi; // Détecte les chemins vidéo

            if (regex.test(text)) {
                let span = document.createElement("span");
                span.dataset.converted = "true"; // Évite les boucles infinies

                span.innerHTML = text.replace(regex, function(match) {
                    let fileURL = "file:///" + match.replace(/\\/g, "/"); // Convertir \ en /
                    return `<a href="${fileURL}" target="_blank">${match}</a>`;
                });

                node.replaceWith(span);
            }
        } else if (!node.dataset || node.dataset.converted !== "true") {
            node.childNodes.forEach(replaceTextWithLinks);
        }
    }

    function processPage() {
        replaceTextWithLinks(document.body);
    }

    // Exécuter une première fois après le chargement de la page
    window.addEventListener('load', processPage);

    // Observer les changements dynamiques sans boucle infinie
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE && !node.dataset?.converted) {
                    // Vérifie que l'élément ou ses enfants ne sont pas déjà convertis
                    replaceTextWithLinks(node);
                }
            });
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Assurez-vous qu'il n'y ait pas de récursivité infinie dans le traitement des liens
    document.addEventListener('DOMContentLoaded', processPage, { once: true });
})();
