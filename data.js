// Real benchmark data — peek engagements only, clean (≤2000ms), median values
// Regenerated 2026-05-12 from worktree analytics.db (Phase 10a multi-pipeline + Faze rerun).
// 12 pros across Spirit + FaZe, N≥142 peek trials each (max 956 = donk).
// Sorted by T0→T1 ASC (best perception first).
const BENCHMARK_DATA = {
  players: ["donk", "broky", "frozen", "sh1ro", "karrigan", "tN1R", "twistzz", "jcobbb", "zweih", "chopper", "zont1x", "magixx"],
  teams:   ["Spirit","FaZe", "FaZe",   "Spirit","FaZe",    "Spirit","FaZe",   "FaZe",   "Spirit","Spirit", "Spirit","Spirit"],
  n_peek:  [956,     153,    335,      180,     559,       324,    301,       272,      192,     142,      276,     168],
  // Median T0→T1 (ms): enemy visible → crosshair starts moving
  t0_t1_median: [172, 172, 188, 188, 203, 203, 203, 203, 219, 219, 234, 234],
  // Median T1→T2 (ms): aim start → first hit
  t1_t2_median: [344, 422, 266, 273, 375, 297, 250, 281, 281, 273, 297, 258],
  // Median crosshair angle at T0 (°, lower = better pre-aim)
  crosshair_angle_median: [5.2, 6.4, 4.4, 4.9, 5.8, 4.8, 5.3, 5.2, 4.8, 4.3, 5.2, 4.7],
  // Hero player (single donk reference, kept for legacy hero/meta blocks)
  donk_n: 956,
  donk_t0_t1: 172,
  donk_t1_t2: 344,
  donk_crosshair: 5.2,
};
