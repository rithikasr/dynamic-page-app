
export interface PhoneModel {
    id: string;
    name: string;
    brand: string;
    frameWidth: number;
    frameHeight: number;
    printArea: { x: number; y: number; width: number; height: number };
    camera: {
        type: 'dual-diagonal' | 'triple-square' | 'triple-vertical' | 'quad-vertical' | 'circular-module' | 'horizontal-bar' | 'pill-vertical';
        x: number;
        y: number;
        width: number;
        height: number;
        borderRadius: string;
    };
    available?: boolean;
}

// Helper for consistent print areas
const standardPrintArea = (fw: number, fh: number) => ({
    x: 25,
    y: 125,
    width: fw - 50,
    height: fh - 150 // Leave space for camera generally
});

export const PHONE_MODELS: PhoneModel[] = [
    // --- Apple ---
    {
        id: 'iphone-15-pro-max',
        name: 'iPhone 15 Pro Max',
        brand: 'Apple',
        frameWidth: 370,
        frameHeight: 760,
        printArea: { x: 30, y: 140, width: 310, height: 550 },
        camera: { type: 'triple-square', x: 30, y: 30, width: 100, height: 100, borderRadius: '25px' },
        available: true
    },
    {
        id: 'iphone-15-pro',
        name: 'iPhone 15 Pro',
        brand: 'Apple',
        frameWidth: 350,
        frameHeight: 710,
        printArea: { x: 25, y: 130, width: 300, height: 500 },
        camera: { type: 'triple-square', x: 30, y: 30, width: 95, height: 95, borderRadius: '25px' },
        available: true
    },
    {
        id: 'iphone-15-plus',
        name: 'iPhone 15 Plus',
        brand: 'Apple',
        frameWidth: 370,
        frameHeight: 760,
        printArea: { x: 30, y: 130, width: 310, height: 560 },
        camera: { type: 'dual-diagonal', x: 30, y: 30, width: 90, height: 90, borderRadius: '22px' },
        available: true
    },
    {
        id: 'iphone-15',
        name: 'iPhone 15',
        brand: 'Apple',
        frameWidth: 350,
        frameHeight: 710,
        printArea: { x: 25, y: 125, width: 300, height: 510 },
        camera: { type: 'dual-diagonal', x: 30, y: 30, width: 90, height: 90, borderRadius: '22px' },
        available: true
    },
    {
        id: 'iphone-14-pro-max',
        name: 'iPhone 14 Pro Max',
        brand: 'Apple',
        frameWidth: 370,
        frameHeight: 760,
        printArea: { x: 30, y: 140, width: 310, height: 550 },
        camera: { type: 'triple-square', x: 30, y: 30, width: 100, height: 100, borderRadius: '25px' },
        available: true
    },
    {
        id: 'iphone-14-pro',
        name: 'iPhone 14 Pro',
        brand: 'Apple',
        frameWidth: 350,
        frameHeight: 710,
        printArea: { x: 25, y: 130, width: 300, height: 500 },
        camera: { type: 'triple-square', x: 30, y: 30, width: 95, height: 95, borderRadius: '25px' },
        available: true
    },
    {
        id: 'iphone-14-plus',
        name: 'iPhone 14 Plus',
        brand: 'Apple',
        frameWidth: 370,
        frameHeight: 760,
        printArea: { x: 30, y: 130, width: 310, height: 560 },
        camera: { type: 'dual-diagonal', x: 30, y: 30, width: 90, height: 90, borderRadius: '22px' },
        available: true
    },
    {
        id: 'iphone-14',
        name: 'iPhone 14',
        brand: 'Apple',
        frameWidth: 350,
        frameHeight: 700,
        printArea: { x: 25, y: 120, width: 300, height: 500 },
        camera: { type: 'dual-diagonal', x: 30, y: 30, width: 80, height: 80, borderRadius: '20px' },
        available: true
    },
    {
        id: 'iphone-13-pro-max',
        name: 'iPhone 13 Pro Max',
        brand: 'Apple',
        frameWidth: 370,
        frameHeight: 760,
        printArea: { x: 30, y: 135, width: 310, height: 555 },
        camera: { type: 'triple-square', x: 30, y: 30, width: 95, height: 95, borderRadius: '25px' },
        available: true
    },
    {
        id: 'iphone-13',
        name: 'iPhone 13',
        brand: 'Apple',
        frameWidth: 350,
        frameHeight: 700,
        printArea: { x: 25, y: 120, width: 300, height: 500 },
        camera: { type: 'dual-diagonal', x: 30, y: 30, width: 80, height: 80, borderRadius: '20px' },
        available: true
    },
     {
        id: 'iphone-12',
        name: 'iPhone 12/12 Pro',
        brand: 'Apple',
        frameWidth: 350,
        frameHeight: 700,
        printArea: { x: 25, y: 120, width: 300, height: 500 },
        camera: { type: 'dual-diagonal', x: 30, y: 30, width: 80, height: 80, borderRadius: '20px' },
        available: true
    },

    // --- Samsung ---
    {
        id: 'samsung-s24-ultra',
        name: 'Samsung Galaxy S24 Ultra',
        brand: 'Samsung',
        frameWidth: 375,
        frameHeight: 780,
        printArea: { x: 35, y: 140, width: 305, height: 560 },
        camera: { type: 'quad-vertical', x: 30, y: 30, width: 85, height: 140, borderRadius: '10px' }, // More separate lenses
        available: true
    },
    {
        id: 'samsung-s24-plus',
        name: 'Samsung Galaxy S24+',
        brand: 'Samsung',
        frameWidth: 360,
        frameHeight: 750,
        printArea: { x: 30, y: 130, width: 300, height: 540 },
        camera: { type: 'triple-vertical', x: 30, y: 30, width: 70, height: 120, borderRadius: '35px' },
        available: true
    },
    {
        id: 'samsung-s24',
        name: 'Samsung Galaxy S24',
        brand: 'Samsung',
        frameWidth: 350,
        frameHeight: 710,
        printArea: { x: 25, y: 125, width: 300, height: 500 },
        camera: { type: 'triple-vertical', x: 30, y: 30, width: 70, height: 120, borderRadius: '35px' },
        available: true
    },
    {
        id: 'samsung-s23-ultra',
        name: 'Samsung Galaxy S23 Ultra',
        brand: 'Samsung',
        frameWidth: 375,
        frameHeight: 780,
        printArea: { x: 35, y: 140, width: 305, height: 560 },
        camera: { type: 'quad-vertical', x: 30, y: 30, width: 80, height: 135, borderRadius: '38px' }, // Using existing logic
        available: true
    },
    {
        id: 'samsung-s23',
        name: 'Samsung Galaxy S23',
        brand: 'Samsung',
        frameWidth: 350,
        frameHeight: 720,
        printArea: { x: 25, y: 125, width: 300, height: 510 },
        camera: { type: 'triple-vertical', x: 30, y: 30, width: 70, height: 110, borderRadius: '35px' },
        available: true
    },

    // --- Google ---
    {
        id: 'pixel-8-pro',
        name: 'Google Pixel 8 Pro',
        brand: 'Google',
        frameWidth: 365,
        frameHeight: 760,
        printArea: { x: 30, y: 140, width: 305, height: 550 },
        camera: { type: 'horizontal-bar', x: 0, y: 80, width: 365, height: 60, borderRadius: '0px' }, // Uses full width bar
        available: true
    },
    {
        id: 'pixel-8',
        name: 'Google Pixel 8',
        brand: 'Google',
        frameWidth: 350,
        frameHeight: 710,
        printArea: { x: 25, y: 135, width: 300, height: 500 },
        camera: { type: 'horizontal-bar', x: 0, y: 75, width: 350, height: 55, borderRadius: '0px' },
        available: true
    },
    {
        id: 'pixel-7-pro',
        name: 'Google Pixel 7 Pro',
        brand: 'Google',
        frameWidth: 365,
        frameHeight: 760,
        printArea: { x: 30, y: 140, width: 305, height: 550 },
        camera: { type: 'horizontal-bar', x: 0, y: 80, width: 365, height: 60, borderRadius: '0px' },
        available: true
    },

    // --- OnePlus ---
    {
        id: 'oneplus-12',
        name: 'OnePlus 12',
        brand: 'OnePlus',
        frameWidth: 360,
        frameHeight: 760,
        printArea: { x: 30, y: 140, width: 300, height: 550 },
        camera: { type: 'circular-module', x: 30, y: 40, width: 110, height: 110, borderRadius: '50%' },
        available: true
    },
    {
        id: 'oneplus-11',
        name: 'OnePlus 11',
        brand: 'OnePlus',
        frameWidth: 350,
        frameHeight: 710,
        printArea: { x: 25, y: 140, width: 300, height: 500 },
        camera: { type: 'circular-module', x: 30, y: 40, width: 100, height: 100, borderRadius: '50%' },
        available: true
    },
];
