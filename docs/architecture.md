# Architecture technique

## Stack

| Couche | Technologie |
|---|---|
| Markup | HTML5 vanilla |
| Styles | CSS3 avec custom properties (variables) |
| Logique | Vanilla JavaScript ES modules (`type="module"`) |
| Graphes | Chart.js 4.x via CDN |
| Hébergement | Cloudflare Pages (projet `invest-sim`) |

Pas de framework frontend, pas de build step, pas de bundler.

## Design system Roxabi

Tokens CSS définis dans `:root` et `[data-theme="light"]` :

| Token | Dark | Light |
|---|---|---|
| `--bg` | `#0d1117` | `#f8f7f4` |
| `--surface` | `#161b22` | `#ffffff` |
| `--accent` | `#f0b429` (gold) | `#d97706` |
| `--text` | `#f0ede6` | `#1c1917` |
| `--text-muted` | `#9ca3af` | `#57534e` |
| `--danger` | `#f87171` | `#dc2626` |
| `--cyan` | `#22d3ee` | `#0891b2` |

Mode sombre/clair basculé via `data-theme` sur `<html>`, lu/écrit dans `localStorage`.

## Structure des modules

### Calculateur d'impôt

```
simulateur.html
├── js/main.js        → orchestration (events, init, run)
├── js/fiscal.js      → logique pure (IR, QF, TMI, abattements)
├── js/ui.js          → DOM (rendu résultats, modal détail, toggle)
├── js/data.js        → loader JSON barèmes + fallback inline
├── js/storage.js     → persistance localStorage (max 5 sims)
└── js/theme.js       → toggle dark/light
```

**Pattern** : `main.js` appelle `fiscal.js` pour le calcul, `ui.js` pour le rendu, `storage.js` pour la persistence. `ui.js` n'importe jamais `fiscal.js`.

### Comparateur immobilier

```
comparateur-immo.html
├── js/comparateur-immo.js  → logique pure + graphe + modal
├── js/format.js            → formatteurs EUR / %
└── js/theme.js             → toggle dark/light
```

**Pattern** : fichier unique pour cette page (plus simple, pas de persistance nécessaire). Chart.js chargé via CDN.

## Séparation des responsabilités

| Règle | Application |
|---|---|
| Logique pure sans DOM | `fiscal.js`, `comparateur-immo.js` (functions `compute*`) |
| DOM sans calcul | `ui.js`, `comparateur-immo.js` (functions `render*`) |
| Pas de JS/CSS inline | Tout passe par fichiers dédiés |
| Pas de variables globales | Modules ES avec `import`/`export` |

## Persistance

### Calculateur d'impôt

- Clé `localStorage` : `roxabi-sim:data:tmi:<id>` et `roxabi-sim:meta:tmi:<id>`
- Max 5 simulations (LRU pruning par `lastUsed`)
- Sélection par URL hash (`#sim-xxxx`)
- Nommage + suppression

### Comparateurs immo & multi-investissements

Pas de persistance pour l'instant. Les paramètres sont perdus au rechargement de page.

## Données fiscales

Fichiers JSON dans `data/` :

- `baremes.json` — barèmes IR par année (2024–2026)
- `micro-abattements.json` — abattements micro-entreprise par type d'activité

Chargés via `fetch()` avec fallback inline en cas d'erreur réseau.

## Déploiement

```bash
npx wrangler pages deploy . --project-name=invest-sim --branch=main --commit-dirty=true
```

Token Cloudflare dans `~/.roxabi/forge/.env` (hors repo).
