import type { Motorcycle } from '../types'

export const STOCK_BORE_STROKE: Record<string, { bore: number; stroke: number }> = {
  'honda-click-125i': { bore: 52.4, stroke: 57.9 },
  'honda-click-160': { bore: 60, stroke: 55.5 },
  'honda-adv160': { bore: 60, stroke: 55.5 },
  'honda-pcx160': { bore: 60, stroke: 55.5 },
  'yamaha-aerox': { bore: 58, stroke: 58.7 },
  'yamaha-nmax': { bore: 58, stroke: 58.7 },
  'yamaha-sniper-155': { bore: 58, stroke: 58.7 },
  'yamaha-r15m': { bore: 58, stroke: 58.7 },
  'suzuki-raider-r150-fi': { bore: 62, stroke: 48.8 },
  'suzuki-raider-r150-carb': { bore: 62, stroke: 48.8 },
}

export function estimatePowerHp(bike: Motorcycle): number {
  const classLower = bike.class.toLowerCase()
  let factor = bike.cooling === 'Liquid' ? 0.1 : bike.cooling === 'Air/Oil' ? 0.095 : 0.088
  if (classLower.includes('sport')) {
    factor += 0.012
  }
  if (classLower.includes('scooter')) {
    factor -= 0.004
  }
  return Number((bike.cc * factor).toFixed(1))
}

export function estimateTorqueNm(bike: Motorcycle): number {
  return Number((estimatePowerHp(bike) * 0.94).toFixed(1))
}

export function estimateWeightKg(bike: Motorcycle): number {
  const classLower = bike.class.toLowerCase()
  const base =
    classLower.includes('scooter')
      ? 115
      : classLower.includes('underbone') || classLower.includes('moped')
        ? 108
        : classLower.includes('sport')
          ? 132
          : classLower.includes('dual')
            ? 125
            : 120

  return Math.round(base + (bike.cc - 110) * 0.18)
}

export function calcDisplacementCc(bore: number, stroke: number): number {
  return (Math.PI / 4) * bore * bore * stroke / 1000
}
