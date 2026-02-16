// src/utils/engineBuilder.ts

export const calculateDisplacement = (bore: number, stroke: number, cylinders = 1) => {
    // Volume = PI * r^2 * h
    const radius = bore / 2;
    const volumeMm3 = Math.PI * Math.pow(radius, 2) * stroke;
    const cc = (volumeMm3 * cylinders) / 1000;
    return Math.round(cc * 10) / 10;
};

export const estimatePower = (cc: number, type: 'stock' | 'street' | 'race' = 'stock') => {
    // Very rough heuristics for PH market scooters (approximate!)
    const multipliers = {
        'stock': 0.09, // ~11hp for 125cc
        'street': 0.11, // ~13.7hp for 125cc tuned
        'race': 0.14,   // ~17.5hp for 125cc race
    };
    return Math.round(cc * multipliers[type] * 10) / 10;
};

export const calculateCompressionRatio = (displacementCc: number, combustionChamberCc: number, gasketThickMm: number, pistonDishCc: number) => {
    // This is complex without detailed inputs, but simplified for now:
    const deckVolume = 0; // standard deck height assumption
    // CR = (Vd + Vc) / Vc
    // Vd = Displacement
    // Vc = Combustion Volume (Head + Gasket + Deck + Piston)
    // We'll leave this as a placeholder for V2 features
    const cr = (displacementCc + combustionChamberCc + gasketThickMm + pistonDishCc + deckVolume) / (combustionChamberCc + gasketThickMm + pistonDishCc + deckVolume);
    return Math.round(cr * 10) / 10;
};