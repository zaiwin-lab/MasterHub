/** Deterministic PRNG so every demo session shows the same, defensible dataset. */
export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type Rng = () => number;

export const pick = <T,>(rng: Rng, items: readonly T[]): T => items[Math.floor(rng() * items.length)];
export const int = (rng: Rng, min: number, max: number) => Math.floor(rng() * (max - min + 1)) + min;
export const chance = (rng: Rng, p: number) => rng() < p;
export const money = (rng: Rng, min: number, max: number) =>
  Math.round((min + rng() * (max - min)) * 100) / 100;
