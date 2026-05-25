# roxabi-simulation

Suite de simulateurs patrimoniaux côté client — calcul de la Tranche Marginale d'Imposition (TMI) et comparaison de scénarios (immobilier vs placement, multi-investissements à venir).

## Simulateurs

| Simulateur | Page | Description |
|---|---|---|
| **Calculateur d'impôt** | [`simulateur.html`](simulateur.html) | TMI, QF, IR — salaires, micro-entreprise, dividendes |
| **Comparateur immobilier** | [`comparateur-immo.html`](comparateur-immo.html) | Acheter vs louer + investir sur un horizon donné |
| **Comparateur placements** | _à venir_ | ETF, SCPI, assurance-vie, PER... |

## Stack

- HTML5 / CSS3 / Vanilla JavaScript (ES modules)
- Chart.js via CDN (graphes comparateur immo)
- Hébergement : Cloudflare Pages

## Structure

| Fichier | Description |
|---|---|
| `index.html` | Landing page |
| `simulateur.html` | Calculateur d'impôt |
| `comparateur-immo.html` | Comparateur immobilier |
| `css/main.css` | Styles globaux + simulateur impôt |
| `css/landing.css` | Styles landing |
| `css/comparateur-immo.css` | Styles comparateur immo |
| `js/main.js` | Orchestration calculateur impôt |
| `js/fiscal.js` | Moteur fiscal (IR, QF, TMI) |
| `js/ui.js` | DOM calculateur impôt |
| `js/data.js` | Loader JSON barèmes + abattements |
| `js/format.js` | Formatteurs (€, %) |
| `js/storage.js` | Persistance localStorage (5 sims max) |
| `js/theme.js` | Toggle dark/light |
| `js/comparateur-immo.js` | Logique + graphe comparateur immobilier |
| `docs/simulateurs.md` | Documentation métier détaillée |
| `docs/architecture.md` | Architecture technique |

## Déploiement

Voir [`cloud.md`](cloud.md).
