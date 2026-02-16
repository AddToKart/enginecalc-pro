export const MOTORCYCLE_SPECS = {
    'honda-click-125i': {
        name: 'Honda Click 125i',
        stockBore: 52.4,
        stockStroke: 57.9,
        stockRollerWeight: 15, // grams
        type: 'scooter'
    },
    'honda-click-150i': {
        name: 'Honda Click 150i',
        stockBore: 57.3,
        stockStroke: 57.9,
        stockRollerWeight: 15.5,
        type: 'scooter'
    },
    'yamaha-mio-i125': {
        name: 'Yamaha Mio i 125 (M3)',
        stockBore: 52.4,
        stockStroke: 57.9,
        stockRollerWeight: 10,
        type: 'scooter'
    },
    'suzuki-raider-r150': {
        name: 'Suzuki Raider R150 Fi',
        stockBore: 62.0,
        stockStroke: 48.8,
        stockRollerWeight: 0, // Manual transmission
        type: 'underbone'
    },
    'yamaha-aerox-155': {
        name: 'Yamaha Aerox 155',
        stockBore: 58.0,
        stockStroke: 58.7,
        stockRollerWeight: 13,
        type: 'scooter'
    },
    'yamaha-nmax-155': {
        name: 'Yamaha NMAX 155',
        stockBore: 58.0,
        stockStroke: 58.7,
        stockRollerWeight: 13,
        type: 'scooter'
    }
} as const;

export type BikeModelId = keyof typeof MOTORCYCLE_SPECS;

export interface AftermarketPart {
    id: string;
    brand: string;
    name: string;
    type: 'block' | 'cam' | 'cvt' | 'exhaust' | 'ecu';
    specs: {
        bore?: number; // mm
        strokeAdded?: number; // mm (pin lift)
        rollerWeight?: number; // grams
        lift?: string; // for cams
    };
    priceRange: string; // "₱-₱₱₱"
}

export const CATALOG_PARTS: AftermarketPart[] = [
    // Cylinder Blocks
    { id: 'jvt-59-chrome', brand: 'JVT', name: '59mm Chrome Bore Kit', type: 'block', specs: { bore: 59 }, priceRange: '₱3,500 - ₱4,500' },
    { id: 'rs8-59-steel', brand: 'RS8', name: '59mm Steel Bore Kit', type: 'block', specs: { bore: 59 }, priceRange: '₱2,500 - ₱3,200' },
    { id: 'mtrt-63-ceramic', brand: 'MTRT', name: '63mm Ceramic Block', type: 'block', specs: { bore: 63 }, priceRange: '₱6,000 - ₱8,000' },
    { id: 'uma-65-ceramic', brand: 'UMA Racing', name: '65mm Superhead Block', type: 'block', specs: { bore: 65 }, priceRange: '₱9,000+' },
    
    // Camshafts
    { id: 'jvt-s1-cam', brand: 'JVT', name: 'Stage 1 Touring Cam', type: 'cam', specs: { lift: 'Low-Mid' }, priceRange: '₱1,800' },
    { id: 'mtrt-evo-cam', brand: 'MTRT', name: 'Evo Racing Cam', type: 'cam', specs: { lift: 'High' }, priceRange: '₱2,500' },

    // CVT
    { id: 'rs8-v4-pulley', brand: 'RS8', name: 'V4 Pulley Set', type: 'cvt', specs: { rollerWeight: 9 }, priceRange: '₱2,200' },
    { id: 'jvt-chrome-pulley', brand: 'JVT', name: 'Chrome Pulley Set', type: 'cvt', specs: { rollerWeight: 11 }, priceRange: '₱2,800' },
];