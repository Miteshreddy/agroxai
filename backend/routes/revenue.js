const express = require('express');
const router = express.Router();

const baseYields = {
    'Rice': 2.5, 'Wheat': 2.0, 'Maize': 3.0, 'Millet': 1.2, 'Sugarcane': 35.0,
    'Cotton': 0.8, 'Jute': 2.8, 'Coffee': 0.6, 'Coconut': 3.5, 'Banana': 10.0
};

const mspPrices = {
    'Rice': 2183, 'Wheat': 2275, 'Maize': 1962, 'Millet': 2500,
    'Sugarcane': 315, // per tonne
    'Cotton': 6620, 'Jute': 4750, 'Coffee': 4254, 'Coconut': 2700, 'Banana': 1500
};

const soilMultipliers = {
    'Excellent': 1.20, 'Good': 1.00, 'Average': 0.80, 'Poor': 0.60
};

const rainfallMultipliers = {
    'High': 1.10, 'Medium': 1.00, 'Low': 0.85
};

router.post('/revenue-prediction', (req, res) => {
    try {
        const { crop, soil_type, rainfall_level, land_area_acres, soil_quality } = req.body;

        const area = parseFloat(land_area_acres) || 1;
        const normalizedCrop = Object.keys(baseYields).find(k => k.toLowerCase() === crop?.toLowerCase()) || 'Rice';

        const base_yield = baseYields[normalizedCrop];
        const soil_mult = soilMultipliers[soil_quality] || 1.00;
        const rain_mult = rainfallMultipliers[rainfall_level] || 1.00;
        const msp = mspPrices[normalizedCrop];

        const estimated_yield = base_yield * area * soil_mult * rain_mult;

        let gross_revenue;
        if (normalizedCrop === 'Sugarcane') {
            gross_revenue = estimated_yield * msp;
        } else {
            // 1 Tonne = 10 Quintals
            gross_revenue = (estimated_yield * 10) * msp;
        }

        const input_cost = gross_revenue * 0.35;
        const net_profit = gross_revenue - input_cost;
        const profit_per_acre = net_profit / area;

        res.json({
            crop_used: normalizedCrop,
            estimated_yield: parseFloat(estimated_yield.toFixed(2)),
            gross_revenue: Math.round(gross_revenue),
            input_cost: Math.round(input_cost),
            net_profit: Math.round(net_profit),
            profit_per_acre: Math.round(profit_per_acre),
            msp_used: msp,
            revenue_range: {
                optimistic: Math.round(net_profit * 1.15),
                realistic: Math.round(net_profit),
                conservative: Math.round(net_profit * 0.80)
            },
            yield_breakdown: [
                { factor: "Base Yield", value: `${base_yield} Tonnes/Acre` },
                { factor: "Land Area", value: `${area} Acres` },
                { factor: "Soil Quality Multiplier", value: `x${soil_mult}` },
                { factor: "Rainfall Multiplier", value: `x${rain_mult}` }
            ],
            disclaimer: "Figures are based on 2024-25 MSP rates. Actual market prices and yield may vary due to weather fluctuations, exact pest management, and local trading conditions."
        });

    } catch (err) {
        console.error('Error calculating revenue:', err.message);
        res.status(500).json({ error: 'Revenue engine failed to calculate' });
    }
});

module.exports = router;
