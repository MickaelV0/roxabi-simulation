export const DATA = {
  baremes: {},
  micro: {},
};

export async function loadData() {
  const [baremes, micro] = await Promise.all([
    fetch('data/baremes.json').then(r => r.json()),
    fetch('data/micro-abattements.json').then(r => r.json()),
  ]);
  DATA.baremes = baremes;
  DATA.micro = micro;
}
