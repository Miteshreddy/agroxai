const express = require('express');
const router = express.Router();

const organicData = {
    'Rice': {
        is_organic_suitable: true,
        organic_transition_period: "3 Years",
        yield_comparison: "Organic yield may initially decrease by 15-20% but stabilizes within 3 years.",
        price_premium: "40-60%",
        estimated_organic_profit_increase: 35, // percent
        organic_inputs: [
            {
                input_name: "Jeevamrut",
                replaces: "Chemical NPK / Urea",
                preparation_method: "Mix 200L water, 10kg cow dung, 10L cow urine, 2kg jaggery, 2kg pulse flour, and 1kg forest soil. Ferment for 7 days.",
                quantity_per_acre: "200 Litres",
                cost_per_acre: "₹1,200"
            },
            {
                input_name: "Beejamrut",
                replaces: "Chemical Seed Treatment",
                preparation_method: "Mix cow dung, urine, lime, and water. Dip seeds for 10-15 minutes before sowing.",
                quantity_per_acre: "As per requirement",
                cost_per_acre: "₹300"
            },
            {
                input_name: "Vermicompost",
                replaces: "DAP / Chemical Fertilizers",
                preparation_method: "Produced using earthworms and organic waste over 60-90 days.",
                quantity_per_acre: "2-3 Tonnes",
                cost_per_acre: "₹6,000"
            }
        ],
        pest_management: [
            {
                pest: "Stem Borer",
                solution: "Neem Oil Spray",
                preparation: "Mix 10ml Neem oil with 5ml liquid soap in 1L water.",
                application: "Spray every 15 days during early growth stages."
            },
            {
                pest: "Leaf Folder",
                solution: "Dashparni Ark",
                preparation: "Extract from 10 types of toxic leaves fermented in cow urine.",
                application: "Spray 500ml diluted in 15L water."
            }
        ],
        market_linkage: [
            { name: "Organic India", icon: "Leaf", url: "https://www.organicindia.com" },
            { name: "BigBasket Organic", icon: "ShoppingCart", url: "https://www.bigbasket.com/cl/organic-fruits-vegetables" },
            { name: "Amazon Fresh Organic", icon: "ShoppingBag", url: "https://www.amazon.in/fresh" },
            { name: "Local Mandi (APMC Organic)", icon: "Store", url: "#" }
        ],
        do_and_dont: {
            dos: [
                "Use native/desi seeds only.",
                "Maintain a multi-crop cycle.",
                "Ensure strict boundary isolation (buffer zones).",
                "Regularly monitor soil microbial activity."
            ],
            donts: [
                "Never use GMO or chemically treated seeds.",
                "Do not use non-organic manure (market waste).",
                "Strictly avoid synthetic pesticides, even in small amounts.",
                "Avoid using polluted water for irrigation."
            ]
        }
    },
    'Wheat': {
        is_organic_suitable: true,
        organic_transition_period: "2-3 Years",
        yield_comparison: "Yield holds steady at 90% of conventional methods.",
        price_premium: "30-50%",
        estimated_organic_profit_increase: 25,
        organic_inputs: [
            {
                input_name: "Ghan-Jeevamrut",
                replaces: "Urea / Solid Fertilizer",
                preparation_method: "Solid Jeevamrut dried in shade and powdered.",
                quantity_per_acre: "200 kg",
                cost_per_acre: "₹2,500"
            },
            {
                input_name: "Neem Cake",
                replaces: "Soil Insecticides",
                preparation_method: "Pressed residue of neem seeds.",
                quantity_per_acre: "100 kg",
                cost_per_acre: "₹4,000"
            }
        ],
        pest_management: [
            {
                pest: "Aphids",
                solution: "Agniastra",
                preparation: "Boil cow urine with tobacco, ginger, garlic, and green chilies.",
                application: "Spray 250ml diluted in 15L water."
            }
        ],
        market_linkage: [
            { name: "Aditi Organic", icon: "Landmark", url: "#" },
            { name: "Gourmet Garden", icon: "Sprout", url: "https://gourmetgarden.in" }
        ],
        do_and_dont: {
            dos: ["Crop rotation with legumes.", "Incorporate wheat straw back into the soil."],
            donts: ["Burning of crop residue.", "Use of chemical growth promoters."]
        }
    }
};

// Generic filler for other crops
const genericOrganic = (crop) => ({
    is_organic_suitable: true,
    organic_transition_period: "3 Years",
    yield_comparison: `Transition to organic ${crop} takes time for soil restoration. Yield stabilizes at 85-90% of conventional.`,
    price_premium: "50% avg",
    estimated_organic_profit_increase: 30,
    organic_inputs: [
        {
            input_name: "Panchagavya",
            replaces: "Growth Hormones",
            preparation_method: "Mix 5 cow products: Milk, Curd, Ghee, Urine, Dung. Ferment for 30 days.",
            quantity_per_acre: "20L",
            cost_per_acre: "₹3,500"
        },
        {
            input_name: "Vermicompost",
            replaces: "Chemical NPK",
            preparation_method: "Decomposed organic waste by earthworms.",
            quantity_per_acre: "2 Tonnes",
            cost_per_acre: "₹6,000"
        }
    ],
    pest_management: [
        {
            pest: "Common Pests",
            solution: "Brahmaastra",
            preparation: "Leaves of neem, peepal, pomegranate etc. boiled in cow urine.",
            application: "Spray diluted as 1:20 with water."
        }
    ],
    market_linkage: [
        { name: "Global Organic Hub", icon: "Globe", url: "#" },
        { name: "Farm-to-Fork India", icon: "Box", url: "#" }
    ],
    do_and_dont: {
        dos: ["Maintain 10% area for diversity.", "Trap cropping."],
        donts: ["Monocultures.", "Synthetic growth regulators."]
    }
});

router.post('/organic-farming', (req, res) => {
    try {
        const { crop, soil_type, land_area_acres } = req.body;
        const normalizedCrop = Object.keys(organicData).find(
            k => k.toLowerCase() === crop?.toLowerCase()
        );

        let data = normalizedCrop ? organicData[normalizedCrop] : genericOrganic(crop || 'Selected Crop');

        const certificationSteps = [
            { step: 1, name: "Registration", desc: "Register at APEDA (NPOP) or Regional Council for PGS-India.", cost: "₹2,000 - ₹5,000", time: "1 Month" },
            { step: 2, name: "Inspection", desc: "Government inspectors visit to verify soil and inputs.", cost: "Based on travel", time: "Ongoing" },
            { step: 3, name: "Transition Mode", desc: "Farm is marked 'In-conversion' (C1, C2, C3).", cost: "Zero", time: "1-3 Years" },
            { step: 4, name: "Certification", desc: "Receive 'India Organic' or 'Jaivik Bharat' seal.", cost: "Renewable annually", time: "Final Week" }
        ];

        res.json({
            ...data,
            certification: certificationSteps,
            institution_contacts: ["NPOP - National Programme for Organic Production", "NHM - National Horticulture Mission", "Jaivik Kheti Portal"],
            disclaimer: "Organic yields depend heavily on local soil microbiology health and boundary isolation sincerity."
        });
    } catch (err) {
        console.error('Error in organic route:', err.message);
        res.status(500).json({ error: 'Internal server error in organic engine' });
    }
});

module.exports = router;
