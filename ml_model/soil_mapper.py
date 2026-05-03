import logging
import random

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

SOIL_NPK_MAP = {
    "Clay":     {"N": (70,100), "P": (40,60), "K": (35,50), "ph": 6.5},
    "Sandy":    {"N": (10,35),  "P": (30,60), "K": (10,25), "ph": 6.0},
    "Loamy":    {"N": (40,90),  "P": (30,60), "K": (15,40), "ph": 7.0},
    "Black":    {"N": (30,60),  "P": (20,40), "K": (15,35), "ph": 7.5},
    "Red":      {"N": (10,40),  "P": (40,70), "K": (10,30), "ph": 5.5},
    "Alluvial": {"N": (40,80),  "P": (30,60), "K": (15,35), "ph": 7.2},
}

SEASON_MULTIPLIERS = {
    "Monsoon": {"N": 1.10, "P": 0.95, "K": 1.10},
    "Summer":  {"N": 0.90, "P": 1.05, "K": 1.00},
    "Winter":  {"N": 0.85, "P": 1.10, "K": 0.95},
    "Spring":  {"N": 1.05, "P": 1.00, "K": 1.05},
}

def clamp(value, min_val, max_val):
    return max(min_val, min(value, max_val))

def map_farmer_inputs(farmer_input):
    soil_type = farmer_input.get("soil_type", "Loamy")
    season = farmer_input.get("season", "Summer")
    
    # Get values from weather data or default to Medium ranges
    input_temp = float(farmer_input.get("temperature", 25))
    input_humidity = float(farmer_input.get("humidity", 50))
    input_rainfall = float(farmer_input.get("rainfall", 100))

    base_values = SOIL_NPK_MAP.get(soil_type, SOIL_NPK_MAP["Loamy"])
    multipliers = SEASON_MULTIPLIERS.get(season, SEASON_MULTIPLIERS["Summer"])

    # Generate NPK
    n_val = random.randint(*base_values["N"])
    p_val = random.randint(*base_values["P"])
    k_val = random.randint(*base_values["K"])

    # Apply season logic and clamp to standard dataset limits
    mapped_n = float(clamp(round(n_val * multipliers["N"]), 0, 140))
    mapped_p = float(clamp(round(p_val * multipliers["P"]), 5, 145))
    mapped_k = float(clamp(round(k_val * multipliers["K"]), 5, 205))
    mapped_ph = float(clamp(base_values["ph"], 3.5, 9.9))

    # FINAL RETURN: Exactly 7 features in the order your model likely expects
    # [N, P, K, temperature, humidity, ph, rainfall]
    return {
        "N": mapped_n,
        "P": mapped_p,
        "K": mapped_k,
        "temperature": float(clamp(input_temp, 8, 44)),
        "humidity": float(clamp(input_humidity, 10, 100)),
        "ph": mapped_ph,
        "rainfall": float(clamp(input_rainfall, 20, 300))
    }