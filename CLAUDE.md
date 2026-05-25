# roxabi-simulation — Instructions Claude Code

## Projet

Simulateur fiscal + comparateur d'investissements (HTML/CSS/JS vanilla, côté client).

## Stack

- HTML5 / CSS3 / Vanilla JavaScript ES modules (`type="module"`)
- Pas de framework frontend ni de build step
- Hébergement : Cloudflare Pages (projet `invest-sim`)

## Structure des fichiers

```
roxabi-simulation/
├── index.html        Shell + markup
├── css/main.css      Tous les styles
├── js/
│   ├── main.js       Point d'entrée (events, orchestration)
│   ├── data.js       Données : barèmes IR par année, abattements micro-entreprise
│   ├── format.js     Formatteurs EUR / pourcentage
│   ├── fiscal.js     Logique pure : calcul TMI, QF, impôt
│   └── ui.js         DOM : rendu résultats, modal, toggle collapse
```

## Règles de code

- **Pas de JS/CSS inline** dans `index.html` — tout passe par les fichiers dédiés.
- **Logique pure séparée de l'UI** : `fiscal.js` ne manipule pas le DOM ; `ui.js` ne calcule pas.
- **Modules ES** : utiliser `import`/`export`. Pas de variables globales.
- **Barèmes IR** (2024–2026) et **abattements micro** (71% / 50% / 34%) dans `js/data.js`.

## Déploiement

Avant de pousser sur GitHub :

```bash
cd ~/projects/roxabi-simulation
export CLOUDFLARE_ACCOUNT_ID="b5e90be971920ce406f7b679c4f1cd33"
export CLOUDFLARE_API_TOKEN="<token>"   # depuis ~/.roxabi/forge/.env — jamais commité
npx wrangler pages deploy . --project-name=invest-sim --branch=main --commit-dirty=true
```

## Sécurité

- **Aucun secret** (token, clé, mot de passe) ne doit être commité.
- `.gitignore` est configuré pour ignorer `.env`, `.wrangler/`, logs.
- Si un fichier sensible est créé par erreur, le retirer immédiatement de l'historique git (`git filter-repo` ou force-push rebase).

## Workflow

1. Modifier les fichiers source (HTML, CSS, JS).
2. Déployer sur Cloudflare Pages pour tester en live.
3. `git add`, `git commit`, `git push` vers `origin/main`.

## Notes métier

- **TMI** = dernière tranche active du barème IR appliquée au QF.
- Dividendes en **flat tax** (PFU) ne sont pas intégrés au revenu imposable pour le calcul de la TMI.
- Dividendes en **régime réel** : intégration avec abattement de 40%.
- Calcul théorique avant décote et réductions éventuelles.
