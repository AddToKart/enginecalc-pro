// src/utils/gearRatio.ts

export const calculateGearRatio = (primary: number, secondary: number) => {
    return primary / secondary;
};
  
export const calculateSpeed = (
    primaryRatio: number,
    gearRatio: number,
    finalDriveRatio: number,
    tireCircumferenceMm: number
) => {
    // Speed (km/h) = (RPM * Tire Circumference) / (Total Ratio * 1000 * 1000 / 60)
    // Simplified: (RPM * TireCircumference(m) * 60) / (OverallRatio * 1000)
    const overallRatio = primaryRatio * gearRatio * finalDriveRatio;
    const tireCircumferenceM = tireCircumferenceMm / 1000;
    
    if (overallRatio === 0) return 0;

    return (currentRpm: number) => { // Returns a function to calculate speed at varying RPM
      return (currentRpm * tireCircumferenceM * 60) / (overallRatio * 1000); 
    }
};

export const DEFAULT_GEARING = {
    primaryRatio: 3.0, // Example average
    gearRatios: [2.5, 1.8, 1.4, 1.1, 0.9, 0.8], // 1st to 6th
    sprockets: { front: 14, rear: 42 },
    tire: { width: 110, aspect: 70, rim: 17 } // 110/70-17
};

export const getTireCircumference = (width: number, aspect: number, rim: number) => {
    const sidewallHeight = width * (aspect / 100);
    const rimDiameterMm = rim * 25.4;
    const diameter = rimDiameterMm + (2 * sidewallHeight);
    return diameter * Math.PI;
}
