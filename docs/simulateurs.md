# Documentation des simulateurs

## 1. Calculateur d'impôt sur le revenu (TMI)

### Objectif
Déterminer la **tranche marginale d'imposition (TMI)** et l'impôt théorique d'un foyer fiscal à partir de ses revenus (salaires, micro-entreprise, dividendes).

### Sources de revenus

| Source | Input | Traitement |
|---|---|---|
| Salaires nets imposables | `salaire` | Intégration directe au revenu imposable |
| Micro-entreprise (CA) | `micro-ca` + `micro-type` | Abattement forfaitaire (vente 71%, service 50%, BNC 34%) |
| Dividendes bruts | `div-brut` + `div-mode` | PFU 30% **ou** barème avec abattement 40% |

### Quotient familial (QF)

```
QF = Revenu imposable total / Nombre de parts
```

Le nombre de parts dépend de la situation familiale (célibataire = 1, couple = 2, demi-part par enfant).

### Barème IR

Barèmes 2024–2026 chargés depuis `data/baremes.json` (fallback inline) :

| Année | Tranche 1 | Tranche 2 | Tranche 3 | Tranche 4 | Tranche 5 |
|---|---|---|---|---|---|
| 2024 | 0% ≤11 294€ | 11% ≤28 797€ | 30% ≤82 341€ | 41% ≤177 106€ | 45% >177 106€ |
| 2025 | 0% ≤11 497€ | 11% ≤29 315€ | 30% ≤83 823€ | 41% ≤180 660€ | 45% >180 660€ |
| 2026 | 0% ≤11 818€ | 11% ≤30 144€ | 30% ≤86 060€ | 41% ≤185 320€ | 45% >185 320€ |

### Dividendes — deux modes

- **Flat tax / PFU (30%)** : les dividendes ne sont **pas** intégrés au barème IR. Ils n'affectent pas la TMI. L'impôt est de 30% à la source.
- **Barème progressif (régime réel)** : les dividendes sont intégrés avec un abattement de 40% sur le brut. Ils participent au calcul de la TMI.

### Sorties

- Revenu imposable total
- Quotient familial
- Impôt théorique IR
- Taux moyen d'imposition
- TMI (dernière tranche active)
- Modal avec détail tranche par tranche

### Persistance

- 5 simulations max par navigateur (LRU pruning).
- Nommage + suppression possible.
- Auto-recalc après la première saisie.

---

## 2. Comparateur immobilier — Acheter vs Louer + Investir

### Objectif
Comparer le patrimoine net accumulé sur un horizon donné entre deux stratégies :
- **Achat** d'un bien avec crédit
- **Location** du même type de bien + placement de l'argent épargné

### Hypothèses achat

| Paramètre | Défaut | Description |
|---|---|---|
| Prix du bien | 300 000 € | Valeur d'acquisition |
| Frais de notaire | 8% (auto-calc) | Calculé automatiquement en % du prix |
| Apport | 50 000 € | Capital personnel injecté |
| Taux crédit | 3.5% | Taux annuel du prêt immobilier |
| Durée crédit | 20 ans | Amortissement constant |
| Travaux | 0 € | Investissement initial hors prix |
| Entretien annuel | 1 500 € | Charges courantes propriétaire |
| Taxe foncière | 1 200 € | Impôt local annuel |
| Plus-value annuelle | 3% | Hausse de la valeur du bien |

### Hypothèses location

| Paramètre | Défaut | Description |
|---|---|---|
| Loyer mensuel | 1 200 € | Loyer payé chaque mois |
| Charges locatives | 100 € | Charges mensuelles locatives |
| Rendement placement | 5% | Rendement annuel du portefeuille financier |
| Horizon | 20 ans | Durée de comparaison |

### Formules clés

**Mensualité de crédit** (amortissement standard) :
```
M = K × i / (1 - (1+i)^-n)
K = prix + notaire + travaux - apport
i = taux_annuel / 12
n = duree_annees × 12
```

**Capital restant dû (CRD)** après t années :
```
CRD(t) = K × ((1+i)^n - (1+i)^(t×12)) / ((1+i)^n - 1)
```

**Patrimoine achat** à l'année t :
```
ValeurBien(t) = (prix + travaux) × (1 + plus_value)^t
PatrimoineAchat(t) = ValeurBien(t) - CRD(t) + potAcheteur(t)
```

**Patrimoine location** à l'année t :
```
CapitalInitial = apport + notaire + travaux
potLoc(0) = CapitalInitial
potLoc(t) = (potLoc(t-1) + EconomieAnnuelle) × (1 + rendement)
PatrimoineLoc(t) = potLoc(t)
```

### Logique de cash-flow (différence de dépenses)

```
DepenseAchat = mensualite×12 + entretien + taxe_fonciere
DepenseLoc   = loyer×12 + charges_locatives×12
Diff         = DepenseAchat - DepenseLoc
```

- Si **Diff > 0** : le locataire dépense **moins** → il place `Diff` chaque année.
- Si **Diff < 0** : l'acheteur dépense **moins** → il place `|Diff|` chaque année.
- Si **Diff = 0** : pas d'économie de part et d'autre.

Les deux "pots" (épargne acheteur et épargne locataire) capitalisent au **même rendement** défini dans les paramètres location.

### Limites et hypothèses simplificatrices

- Pas de fiscalité (IFI, plus-value immobilière, prélèvements sociaux sur le placement).
- Pas d'inflation (loyer, crédit, charges figés).
- Pas de variation du rendement placement sur l'horizon.
- Crédit à taux fixe sur toute la durée.
- Les travaux sont intégrés dans la valeur du bien (pas de valeur résiduelle séparée).

---

## 3. Comparateur multi-investissements

### Objectif (à venir)
Comparer 2 à 3 types de placements (ETF, SCPI, assurance-vie, PER, crypto, etc.) sur un horizon temporel donné, en intégrant fiscalité, frais de gestion et rendement net.

### Paramètres envisagés

| Placement | Rendement | Frais | Fiscalité sortie |
|---|---|---|---|
| PEA/ETF | ~7-8% | Faibles | 0% après 5 ans (plafond) |
| Assurance-vie (fonds euros) | ~2-3% | Gestion | Abattement selon ancienneté |
| SCPI | ~4-6% | Acquisition | Revenus fonciers / IR |
| PER | Variable | Gestion | Déductible entrée, imposition sortie |

### Sorties envisagées

- Graphe comparatif de la valeur liquidative nette par année
- Tableau avec capital, intérêts composés, frais cumulés, impôts
- Scénario "tout retirer en une fois" vs "rente programmée"
