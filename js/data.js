export const DATA = {
  baremes: {},
  micro: {},
};

export async function loadData() {
  try {
    const [baremes, micro] = await Promise.all([
      fetch('data/baremes.json').then(r => { if (!r.ok) throw new Error('baremes.json ' + r.status); return r.json(); }),
      fetch('data/micro-abattements.json').then(r => { if (!r.ok) throw new Error('micro-abattements.json ' + r.status); return r.json(); }),
    ]);
    DATA.baremes = baremes;
    DATA.micro = micro;
  } catch (e) {
    console.error('Failed to load fiscal data:', e);
    // Fallback inline data so the app never breaks
    DATA.baremes = {
      2024: [{ max: 11294, taux: 0 }, { max: 28797, taux: 0.11 }, { max: 82341, taux: 0.30 }, { max: 177106, taux: 0.41 }, { max: null, taux: 0.45 }],
      2025: [{ max: 11497, taux: 0 }, { max: 29315, taux: 0.11 }, { max: 83823, taux: 0.30 }, { max: 180660, taux: 0.41 }, { max: null, taux: 0.45 }],
      2026: [{ max: 11818, taux: 0 }, { max: 30144, taux: 0.11 }, { max: 86060, taux: 0.30 }, { max: 185320, taux: 0.41 }, { max: null, taux: 0.45 }],
    };
    DATA.micro = { vente: 0.71, service: 0.50, bnc: 0.34 };
  }
}
