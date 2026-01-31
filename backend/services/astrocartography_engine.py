from services.kerykeion_engine import KerykeionService
from datetime import datetime
import pytz

class AstrocartographyEngine:
    # Curated List of Global Power Centers
    CITIES = [
        {"name": "New York, USA", "lat": 40.7128, "lng": -74.0060},
        {"name": "London, UK", "lat": 51.5074, "lng": -0.1278},
        {"name": "Tokyo, Japan", "lat": 35.6762, "lng": 139.6503},
        {"name": "Paris, France", "lat": 48.8566, "lng": 2.3522},
        {"name": "Sydney, Australia", "lat": -33.8688, "lng": 151.2093},
        {"name": "Mumbai, India", "lat": 19.0760, "lng": 72.8777},
        {"name": "Dubai, UAE", "lat": 25.2048, "lng": 55.2708},
        {"name": "Los Angeles, USA", "lat": 34.0522, "lng": -118.2437},
        {"name": "Singapore", "lat": 1.3521, "lng": 103.8198},
        {"name": "Berlin, Germany", "lat": 52.5200, "lng": 13.4050},
        {"name": "Rome, Italy", "lat": 41.9028, "lng": 12.4964},
        {"name": "Rio de Janeiro, Brazil", "lat": -22.9068, "lng": -43.1729},
        {"name": "Cape Town, South Africa", "lat": -33.9249, "lng": 18.4241},
        {"name": "Bali, Indonesia", "lat": -8.4095, "lng": 115.1889},
        {"name": "Bangkok, Thailand", "lat": 13.7563, "lng": 100.5018},
        {"name": "Istanbul, Turkey", "lat": 41.0082, "lng": 28.9784},
        {"name": "Toronto, Canada", "lat": 43.6510, "lng": -79.3470},
        {"name": "Hong Kong", "lat": 22.3193, "lng": 114.1694},
        {"name": "Moscow, Russia", "lat": 55.7558, "lng": 37.6173},
        {"name": "Cairo, Egypt", "lat": 30.0444, "lng": 31.2357}
    ]

    LINE_MEANINGS = {
        "Sun": {"text": "Vitality Line", "desc": "Fame, recognition, and self-expression shine here."},
        "Moon": {"text": "Emotional Line", "desc": "Feels like home. Good for family and emotional healing."},
        "Mercury": {"text": "Intellect Line", "desc": "Great for writing, communication, and business deals."},
        "Venus": {"text": "Love Line", "desc": "Romance, beauty, and social grace flourish here."},
        "Mars": {"text": "Action Line", "desc": "High energy and ambition, but potential for conflict."},
        "Jupiter": {"text": "Luck Line", "desc": "Abundance, expansion, and good fortune."},
        "Saturn": {"text": "Structure Line", "desc": "Hard work and discipline required, but builds lasting legacy."},
        "Uranus": {"text": "Change Line", "desc": "Unexpected events and freedom. Good for innovation."},
        "Neptune": {"text": "Spiritual Line", "desc": "Good for art and spirituality, but risk of confusion."},
        "Pluto": {"text": "Power Line", "desc": "Deep transformation and intensity. Life-changing experiences."}
    }

    ANGLE_MEANINGS = {
        "Ascendant": "Personal Identity (Best for Self-Reinvention)",
        "Midheaven": "Career & Public Image (Best for Professional Success)",
        "Descendant": "Partnerships (Best for Marriage & Business Partners)",
        "IC": "Home & Roots (Best for Retirement or Settling Down)"
    }

    @staticmethod
    def calculate_power_zones(name, year, month, day, hour, minute):
        """
        Identify cities where planets are on the angles (AC, MC, DC, IC)
        """
        results = []
        
        # We assume simple UTC input for broad scan to avoid timezone hell in loops
        # Ideally, we convert user birth time to UTC once, then use that.
        
        for city in AstrocartographyEngine.CITIES:
            # Calculate chart for this city
            # Kerykeion handles the math. We rely on the fact that if we use the same UTC instant,
            # the planetary longitudes are constant, but the Angles (Asc/MC) rotate with the location (Lat/Lng).
            
            try:
                chart = KerykeionService.calculate_chart(
                    name, year, month, day, hour, minute, 
                    city['name'], city['lat'], city['lng'], 
                    timezone_str="UTC" 
                )
                
                if not chart or 'angles' not in chart: continue
                
                angles = chart['angles'] # Ascendant, Midheaven, Descendant, IC (abs degrees)
                planets = chart['planets']
                
                # Check for Conjunctions (Planet w/ Angle)
                # Orb: 6 degrees
                ORB = 6.0
                
                for p in planets:
                    p_pos = float(p['position']) # Absolute degree 0-360
                    
                    for angle_name, angle_pos in angles.items():
                        angle_val = float(angle_pos)
                        
                        # Calculate difference on circle
                        diff = abs(p_pos - angle_val)
                        if diff > 180: diff = 360 - diff
                        
                        if diff <= ORB:
                            # HIT!
                            planet_meta = AstrocartographyEngine.LINE_MEANINGS.get(p['name'], {"text": f"{p['name']} Line", "desc": "Powerful influence."})
                            angle_desc = AstrocartographyEngine.ANGLE_MEANINGS.get(angle_name, "Angle")
                            
                            results.append({
                                "city": city['name'],
                                "lat": city['lat'],
                                "lng": city['lng'],
                                "planet": p['name'],
                                "angle": angle_name,
                                "line_title": f"{p['name']}/{angle_name} Line",
                                "effect_title": planet_meta['text'],
                                "description": f"{planet_meta['desc']} ({angle_desc})",
                                "intensity": round(10 - diff, 1) # Higher is closer
                            })
                            
            except Exception as e:
                print(f"ACG Error for {city['name']}: {e}")
                continue

        # Sort by Intensity (Closeness to angle)
        results.sort(key=lambda x: x['intensity'], reverse=True)
        
        # Limit to top 5 locations to avoid noise
        return results[:5]
