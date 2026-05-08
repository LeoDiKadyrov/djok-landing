// Real benchmark data — peek engagements only, clean (≤2000ms), median values
// donk: regenerated 2026-05-07 from analytics.db (n=448 peek, post-T2-cluster-bleed-fix)
// shoke / strogo: historical static — Cybershoke / WW Team analysis from earlier sessions, not in current analytics.db
const BENCHMARK_DATA = {
  players: ["donk", "shoke", "strogo", "You"],
  // Median T0→T1 (ms): time from enemy visible to crosshair starts moving
  t0_t1_median: [172, 234, 266, null],
  // Median T1→T2 (ms): time from aim start to first hit
  t1_t2_median: [312, 328, 313, null],
  // Percentile distribution for T0→T2 total reaction time
  t0_t2_percentiles: {
    donk:    { p25: 375, p50: 516, p75: 844 },
    shoke:   { p25: 328, p50: 500, p75: 754 },
    strogo:  { p25: 344, p50: 547, p75: 797 },
  },
  // % of engagements landing in 125-200ms bucket for T0→T1
  fast_aim_pct: {
    donk:    57,
    shoke:   59,
    strogo:  39,
  },
  // Median crosshair angle at T0 (degrees, lower = better crosshair placement)
  crosshair_angle_median: {
    donk:    5.2,
    shoke:   3.3,
    strogo:  6.9,
  },
};
