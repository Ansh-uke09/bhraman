from flask import Flask, jsonify, request
from flask_cors import CORS
import random
from datetime import datetime, timedelta, timezone
import threading
import time
import os
app = Flask(__name__)
# Configure CORS
CORS(
    app,
    resources={r"/api/*": {
        "origins": os.getenv("CORS_ALLOWED_ORIGINS", "http://localhost:3000")
    }}
)


# Updated City database with 50 Indian cities
CITIES = {
    # Major Indian Cities
    "mumbai": {"lat": 19.0760, "lon": 72.8777, "timezone": "Asia/Kolkata"},
    "delhi": {"lat": 28.6139, "lon": 77.2090, "timezone": "Asia/Kolkata"},
    "bangalore": {"lat": 12.9716, "lon": 77.5946, "timezone": "Asia/Kolkata"},
    "hyderabad": {"lat": 17.3850, "lon": 78.4867, "timezone": "Asia/Kolkata"},
    "chennai": {"lat": 13.0827, "lon": 80.2707, "timezone": "Asia/Kolkata"},
    "kolkata": {"lat": 22.5726, "lon": 88.3639, "timezone": "Asia/Kolkata"},
    "pune": {"lat": 18.5204, "lon": 73.8567, "timezone": "Asia/Kolkata"},
    "ahmedabad": {"lat": 23.0225, "lon": 72.5714, "timezone": "Asia/Kolkata"},
    "surat": {"lat": 21.1702, "lon": 72.8311, "timezone": "Asia/Kolkata"},
    "jaipur": {"lat": 26.9124, "lon": 75.7873, "timezone": "Asia/Kolkata"},
    "lucknow": {"lat": 26.8467, "lon": 80.9462, "timezone": "Asia/Kolkata"},
    "kanpur": {"lat": 26.4499, "lon": 80.3319, "timezone": "Asia/Kolkata"},
    "nagpur": {"lat": 21.1458, "lon": 79.0882, "timezone": "Asia/Kolkata"},
    "indore": {"lat": 22.7196, "lon": 75.8577, "timezone": "Asia/Kolkata"},
    "thane": {"lat": 19.2183, "lon": 72.9781, "timezone": "Asia/Kolkata"},
    "bhopal": {"lat": 23.2599, "lon": 77.4126, "timezone": "Asia/Kolkata"},
    "visakhapatnam": {"lat": 17.6868, "lon": 83.2185, "timezone": "Asia/Kolkata"},
    "patna": {"lat": 25.5941, "lon": 85.1376, "timezone": "Asia/Kolkata"},
    "vadodara": {"lat": 22.3072, "lon": 73.1812, "timezone": "Asia/Kolkata"},
    "ghaziabad": {"lat": 28.6692, "lon": 77.4538, "timezone": "Asia/Kolkata"},
    "ludhiana": {"lat": 30.9010, "lon": 75.8573, "timezone": "Asia/Kolkata"},
    "agra": {"lat": 27.1767, "lon": 78.0081, "timezone": "Asia/Kolkata"},
    "nashik": {"lat": 20.0059, "lon": 73.7910, "timezone": "Asia/Kolkata"},
    "faridabad": {"lat": 28.4089, "lon": 77.3178, "timezone": "Asia/Kolkata"},
    "meerut": {"lat": 28.6139, "lon": 77.2090, "timezone": "Asia/Kolkata"},
    "rajkot": {"lat": 22.3039, "lon": 70.8022, "timezone": "Asia/Kolkata"},
    "varanasi": {"lat": 25.3176, "lon": 82.9739, "timezone": "Asia/Kolkata"},
    "srinagar": {"lat": 34.0836, "lon": 74.7973, "timezone": "Asia/Kolkata"},
    "aurangabad": {"lat": 19.8762, "lon": 75.3433, "timezone": "Asia/Kolkata"},
    "dhanbad": {"lat": 23.7957, "lon": 86.4304, "timezone": "Asia/Kolkata"},
    "amritsar": {"lat": 31.6340, "lon": 74.8723, "timezone": "Asia/Kolkata"},
    "allahabad": {"lat": 25.4358, "lon": 81.8463, "timezone": "Asia/Kolkata"},
    "ranchi": {"lat": 23.3441, "lon": 85.3096, "timezone": "Asia/Kolkata"},
    "howrah": {"lat": 22.5958, "lon": 88.2636, "timezone": "Asia/Kolkata"},
    "jabalpur": {"lat": 23.1815, "lon": 79.9864, "timezone": "Asia/Kolkata"},
    "gwalior": {"lat": 26.2183, "lon": 78.1828, "timezone": "Asia/Kolkata"},
    "coimbatore": {"lat": 11.0168, "lon": 76.9558, "timezone": "Asia/Kolkata"},
    "vijayawada": {"lat": 16.5062, "lon": 80.6480, "timezone": "Asia/Kolkata"},
    "jodhpur": {"lat": 26.2389, "lon": 73.0243, "timezone": "Asia/Kolkata"},
    "madurai": {"lat": 9.9252, "lon": 78.1198, "timezone": "Asia/Kolkata"},
    "raipur": {"lat": 21.2514, "lon": 81.6296, "timezone": "Asia/Kolkata"},
    "kota": {"lat": 25.2138, "lon": 75.8648, "timezone": "Asia/Kolkata"},
    "guwahati": {"lat": 26.1445, "lon": 91.7362, "timezone": "Asia/Kolkata"},
    "chandigarh": {"lat": 30.7333, "lon": 76.7794, "timezone": "Asia/Kolkata"},
    "solapur": {"lat": 17.6599, "lon": 75.9064, "timezone": "Asia/Kolkata"},
    "hubli": {"lat": 15.3647, "lon": 75.1240, "timezone": "Asia/Kolkata"},
    "mysore": {"lat": 12.2958, "lon": 76.6394, "timezone": "Asia/Kolkata"},
    "tiruchirappalli": {"lat": 10.7905, "lon": 78.7047, "timezone": "Asia/Kolkata"},
    "bareilly": {"lat": 28.3670, "lon": 79.4304, "timezone": "Asia/Kolkata"},
    "moradabad": {"lat": 28.8389, "lon": 78.7768, "timezone": "Asia/Kolkata"},
    "jamshedpur": {"lat": 22.8046, "lon": 86.2029, "timezone": "Asia/Kolkata"},
}

def generate_city_air_quality(city):
    # Adjusting pollution ranges for Indian cities (higher PM2.5/PM10)
    base_aqi = random.randint(50, 400)  # Wider range for India
    return {
        "aqi": base_aqi,
        "pm25": round(random.uniform(20, 300), 1),  # Higher PM2.5 in India
        "pm10": round(random.uniform(30, 400)),     # Higher PM10 in India
        "co": round(random.uniform(0.5, 15), 1),
        "no2": round(random.uniform(10, 150)),
        "so2": round(random.uniform(5, 100)),
        "o3": round(random.uniform(30, 250)),
        "nh3": round(random.uniform(2, 50), 1),
        "pb": round(random.uniform(0.2, 8), 2),
        "benzene": round(random.uniform(1, 25), 2),
        "toluene": round(random.uniform(1, 20), 2),
        "xylene": round(random.uniform(0.5, 15), 2),
        "air_quality_index": base_aqi,
        "dominant_pollutant": random.choice(["pm25", "pm10", "no2", "so2", "o3"]),
        "last_updated": datetime.now(timezone.utc).isoformat()
    }

def generate_city_weather(city):
    # Adjusted for Indian climate (warmer temps, monsoon conditions)
    base_temp = random.uniform(10, 45)  # Wider range for India
    conditions = random.choice([
        "Sunny", "Partly Cloudy", "Cloudy", "Rain", "Thunderstorm",
        "Humid", "Haze", "Fog", "Clear", "Dusty"
    ])
    return {
        "temperature": round(base_temp, 1),
        "feels_like": round(base_temp + random.uniform(-2, 5), 1),  # Feels hotter
        "humidity": random.randint(40, 95),  # Higher humidity
        "conditions": conditions,
        "wind_speed": round(random.uniform(0, 20), 1),
        "wind_direction": random.randint(0, 359),
        "pressure": random.randint(980, 1040),
        "visibility": random.randint(1000, 8000),  # Lower due to pollution
        "uv_index": round(random.uniform(3, 12), 1),  # Stronger UV in India
        "dew_point": round(base_temp - random.uniform(0, 8), 1),
        "cloud_cover": random.randint(0, 100),
        "precipitation": round(random.uniform(0, 30), 1) if conditions in ["Rain", "Thunderstorm"] else 0,
        "sunrise": (datetime.now(timezone.utc) - timedelta(hours=random.randint(1, 6))).isoformat(),
        "sunset": (datetime.now(timezone.utc) + timedelta(hours=random.randint(1, 6))).isoformat(),
        "last_updated": datetime.now(timezone.utc).isoformat()
    }

# Initialize data store
# Initialize the data store
data_store = {
    city: {
        "air_quality": generate_city_air_quality(city),
        "weather": generate_city_weather(city)
    } for city in CITIES
}

def update_data_task():
    global data_store
    while True:
        for city in CITIES:
            data_store[city]["air_quality"] = generate_city_air_quality(city)
            data_store[city]["weather"] = generate_city_weather(city)
        time.sleep(300)

data_update_thread = threading.Thread(target=update_data_task, daemon=True)
data_update_thread.start()

@app.route('/api/data', methods=['GET'])
def get_data():
    city = request.args.get('city', default='agra').lower()
    if city not in CITIES:
        return jsonify({"error": "City not found"}), 404
    return jsonify(data_store[city])

@app.route('/api/cities', methods=['GET'])
def get_cities():
    return jsonify({
        "cities": list(CITIES.keys()),
        "details": CITIES
    })

@app.route('/api/recommendation', methods=['GET'])
def get_recommendation():
    city = request.args.get('city', default='delhi').lower()
    if city not in CITIES:
        return jsonify({"error": "City not found"}), 404

    air = data_store[city]["air_quality"]
    weather = data_store[city]["weather"]

    aqi = air["aqi"]
    temp = weather["temperature"]
    conditions = weather["conditions"]
    uv = weather["uv_index"]


    # AIR QUALITY RECOMMENDATIONS
    if aqi <= 50:
        air_rec = {
            "level": "Good",
            "message": "Excellent air quality - perfect for outdoor activities!",
            "icon": "😊",
            "activities": ["Hiking", "Cycling", "Outdoor sports", "Picnics"]
        }
    elif aqi <= 100:
        air_rec = {
            "level": "Moderate",
            "message": "Air quality is acceptable for most individuals.",
            "icon": "🙂",
            "activities": ["Walking", "Light outdoor activities", "Shopping"]
        }
    elif aqi <= 150:
        air_rec = {
            "level": "Unhealthy for Sensitive Groups",
            "message": "People with respiratory issues should limit outdoor activities.",
            "icon": "😷",
            "activities": ["Short walks", "Indoor activities"]
        }
    elif aqi <= 200:
        air_rec = {
            "level": "Unhealthy",
            "message": "Everyone may experience health effects. Limit outdoor exertion.",
            "icon": "😨",
            "activities": ["Essential travel only", "Indoor activities"]
        }
    elif aqi <= 300:
        air_rec = {
            "level": "Very Unhealthy",
            "message": "Health alert! Everyone may experience serious health effects.",
            "icon": "😱",
            "activities": ["Stay indoors", "Use air purifiers"]
        }
    else:
        air_rec = {
            "level": "Hazardous",
            "message": "Health warning! Avoid all outdoor activities.",
            "icon": "☠️",
            "activities": ["Stay indoors", "Wear masks if going out"]
        }

    # WEATHER RECOMMENDATIONS
    if temp < 0:
        weather_rec = {
            "level": "Freezing",
            "message": "Extremely cold - wear multiple layers!",
            "icon": "❄️",
            "clothing": ["Thermal wear", "Heavy coat", "Gloves", "Scarf", "Hat"]
        }
    elif temp < 10:
        weather_rec = {
            "level": "Cold",
            "message": "Cold weather - bundle up!",
            "icon": "🥶",
            "clothing": ["Jacket", "Sweater", "Long pants", "Closed shoes"]
        }
    elif temp < 20:
        weather_rec = {
            "level": "Cool",
            "message": "Cool weather - light jacket recommended.",
            "icon": "🧥",
            "clothing": ["Light jacket", "Long sleeves", "Comfortable shoes"]
        }
    elif temp < 28:
        weather_rec = {
            "level": "Pleasant",
            "message": "Perfect weather for outdoor activities!",
            "icon": "😊",
            "clothing": ["T-shirt", "Shorts or light pants", "Comfortable shoes"]
        }
    elif temp < 35:
        weather_rec = {
            "level": "Warm",
            "message": "Warm weather - stay hydrated!",
            "icon": "🥵",
            "clothing": ["Light clothing", "Sun hat", "Sunglasses", "Sunscreen"]
        }
    else:
        weather_rec = {
            "level": "Hot",
            "message": "Extreme heat - limit outdoor activities!",
            "icon": "🔥",
            "clothing": ["Light, breathable clothing", "Wide-brimmed hat", "Sunscreen"]
        }

    # UV INDEX RECOMMENDATIONS
    if uv <= 2:
        uv_rec = {
            "level": "Low",
            "message": "Low UV - no protection needed",
            "icon": "😎",
            "protection": ["No special protection needed"]
        }
    elif uv <= 5:
        uv_rec = {
            "level": "Moderate",
            "message": "Moderate UV - wear sunscreen",
            "icon": "🧴",
            "protection": ["SPF 15+ sunscreen", "Hat if outside for long"]
        }
    elif uv <= 7:
        uv_rec = {
            "level": "High",
            "message": "High UV - protection required",
            "icon": "🧢",
            "protection": ["SPF 30+ sunscreen", "Sunglasses", "Hat", "Seek shade"]
        }
    elif uv <= 10:
        uv_rec = {
            "level": "Very High",
            "message": "Very high UV - extra protection needed",
            "icon": "🕶️",
            "protection": ["SPF 50+ sunscreen", "Wide-brimmed hat", "UV-blocking sunglasses", "Limit sun exposure"]
        }
    else:
        uv_rec = {
            "level": "Extreme",
            "message": "Extreme UV - avoid sun exposure",
            "icon": "⚠️",
            "protection": ["SPF 50+ sunscreen", "Full coverage clothing", "Stay indoors during peak hours"]
        }

    # TRAVEL SCORE CALCULATION
    travel_score = sum([
        aqi <= 100,
        15 <= temp <= 28,
        conditions in ["Sunny", "Partly Cloudy", "Clear"],
        uv <= 6
    ])

    concerns = []
    if aqi > 100: concerns.append("Poor air quality")
    if temp < 10 or temp > 30: concerns.append("Extreme temperatures")
    if conditions in ["Rain", "Thunderstorm", "Snow"]: concerns.append("Inclement weather")
    if uv > 6: concerns.append("High UV index")

    recommendation = {
        "city": city,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "details": {
            "air_quality": air_rec,
            "weather": weather_rec,
            "uv": uv_rec
        },
        "travel": {
            "suitable": travel_score >= 3,
            "score": travel_score,
            "message": "Ideal for travel!" if travel_score >= 3 else "Conditions may not be ideal for travel",
            "icon": "🌟" if travel_score >= 3 else "⚠️",
            "concerns": concerns if travel_score < 3 else []
        }
    }

    return jsonify(recommendation)

if __name__ == '__main__':
    if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
