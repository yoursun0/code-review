/** Workshop model — illustrative, calibrated to a 2024 80/20 balance. Not a published statistic. */

export const TEAM = 15;

/** A full day of review clears this many "clear diff" units. 20% of a day cleared an 80% writing day. */
const REVIEW_POWER = 4;

export type SimInput = {
  highs: number;
  brief: boolean;
  triage: boolean;
  fear: boolean;
};

export type SimResult = {
  lows: number;
  highDiff: number;
  lowDiff: number;
  highCleanPr: number;
  lowCleanPr: number;
  demand: number;
  supply: number;
  gap: number;
  writeShare: number;
  reviewShare: number;
  fiveDayBacklog: number;
};

export function simulate(input: SimInput): SimResult {
  const highs = clamp(Math.round(input.highs), 0, TEAM);
  const lows = TEAM - highs;

  const highDiffEach = 5 * 0.2;
  const lowDiffEach = 2 * 0.7;
  const highCleanEach = highDiffEach * 0.9;
  const lowCleanEach = input.brief ? lowDiffEach * 0.55 : lowDiffEach * 0.28;

  const highCost = 0.55;
  const lowCost = input.brief ? 1.05 : 1.9;
  const fear = input.fear ? 1.5 : 1;
  const triage = input.triage ? 0.55 : 1;

  const demand =
    (highs * highDiffEach * highCost + lows * lowDiffEach * lowCost) * fear * triage;

  const supply = highs * 0.8 * REVIEW_POWER + lows * 0.3 * REVIEW_POWER;
  const gap = demand - supply;

  const writeShare = (highs * 0.2 + lows * 0.7) / TEAM;
  const reviewShare = 1 - writeShare;

  return {
    lows,
    highDiff: highs * highDiffEach,
    lowDiff: lows * lowDiffEach,
    highCleanPr: highs * highCleanEach,
    lowCleanPr: lows * lowCleanEach,
    demand,
    supply,
    gap,
    writeShare,
    reviewShare,
    fiveDayBacklog: Math.max(0, gap * 5),
  };
}

export function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export function fmt(n: number, digits = 1) {
  const v = Math.abs(n) >= 10 ? n.toFixed(0) : n.toFixed(digits);
  return v.replace(/\.0$/, "");
}
