// Instant price estimation for custom rug orders.
// Base rate is per square foot, in INR, varying by material. These are
// placeholder rates — replace with your actual costed rates before launch.
export const MATERIAL_RATES_PER_SQFT: Record<string, number> = {
  "Wool": 1800,
  "Silk": 4200,
  "Wool & Silk Blend": 2800,
  "Bamboo Silk": 2400,
  "Cotton": 1200,
  "Jute": 900,
};

export function estimateCustomRugPrice(
  widthFt: number,
  heightFt: number,
  material: string
): number {
  const rate = MATERIAL_RATES_PER_SQFT[material] ?? MATERIAL_RATES_PER_SQFT["Wool"];
  const area = widthFt * heightFt;
  // Small custom rugs carry a setup surcharge; large ones get a mild per-sqft discount.
  const surcharge = area < 15 ? 4000 : 0;
  const discount = area > 100 ? 0.9 : 1;
  return Math.round(area * rate * discount + surcharge);
}
