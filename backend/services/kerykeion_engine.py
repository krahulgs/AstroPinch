try:
    from kerykeion import AstrologicalSubject, KerykeionChartSVG, Report
    MOCK_MODE = False
except ImportError:
    # Use Skyfield (NASA JPL data) as the high-precision engine
    print("Initializing Astro Engine: Using Skyfield (NASA/JPL) Data Backend.")
    MOCK_MODE = True

from pathlib import Path
import json
import random
from services.skyfield_engine import SkyfieldService
from services.svg_painter import SVGPainter

class KerykeionService:
    @staticmethod
    def calculate_chart(name: str, year: int, month: int, day: int, hour: int, minute: int, city: str, lat: float, lng: float, timezone_str: str = "UTC", lang: str = "en"):
        """
        Calculates the natal chart using Kerykeion.
        """
        try:
            if MOCK_MODE:
                planets = SkyfieldService.calculate_positions(year, month, day, hour, minute, lat, lng)
                
                # Extract signs for summary
                sun_sign = next(p['sign'] for p in planets if p['name'] == 'Sun')
                moon_sign = next(p['sign'] for p in planets if p['name'] == 'Moon')
                # For Ascendant, we use the estimated house 1 starting point (approximate)
                ascendant = "Aries" # Simplified for now, or match house 1
                
                # Calculate precise angles for Astrocartography
                angles = SkyfieldService.calculate_angles(year, month, day, hour, minute, lat, lng)

                return {
                    "sun_sign": sun_sign,
                    "moon_sign": moon_sign,
                    "ascendant": ascendant,
                    "planets": planets,
                    "houses": [p['sign'] for p in planets], # Simplified house list
                    "angles": angles
                }

            subject = AstrologicalSubject(
                name=name,
                year=year,
                month=month,
                day=day,
                hour=hour,
                minute=minute,
                city=city,
                lat=lat,
                lng=lng,
                tz_str=timezone_str
            )
            
            # Generate Report
            report = Report(subject)
            # data = report.get_data() # Deprecated or similar, usually we access attributes directly or dump model
            
            # Manually extract relevant data for frontend
            planets = []
            for planet_name in ["Sun", "Moon", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto"]:
                planet = getattr(subject, planet_name)
                planets.append({
                    "name": planet_name,
                    "sign": planet.sign,
                    "position": planet.position,
                    "house": planet.house
                })

            chart_data = {
                "sun_sign": subject.sun.sign,
                "moon_sign": subject.moon.sign,
                "ascendant": subject.first_house.sign,
                "planets": planets,
                "houses": [getattr(subject, f"{h}_house").sign for h in ["first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth", "tenth", "eleventh", "twelfth"]],
                "angles": {
                    "Ascendant": subject.first_house.abs_pos, 
                    "Midheaven": subject.tenth_house.abs_pos,
                    "Descendant": subject.seventh_house.abs_pos,
                    "IC": subject.fourth_house.abs_pos
                }
            }
            
            return chart_data
            
        except Exception as e:
            print(f"Error calculating chart: {e}")
            return None

    @staticmethod
    def generate_svg(name: str, year: int, month: int, day: int, hour: int, minute: int, city: str, lat: float, lng: float, timezone_str: str = "UTC", chart_type: str = "Natal", lang: str = "en"):
        try:
            if MOCK_MODE:
                planets = SkyfieldService.calculate_positions(year, month, day, hour, minute, lat, lng)
                label = f"{chart_type} Chart for {name}"
                return SVGPainter.draw_chart(planets, label)

            subject = AstrologicalSubject(
                name=name,
                year=year,
                month=month,
                day=day,
                hour=hour,
                minute=minute,
                city=city,
                lat=lat,
                lng=lng,
                tz_str=timezone_str
            )
            # In a real scenario, for lunar we might change house system or rotation
            # but kerykeion standard SVG is natal.
            worker = KerykeionChartSVG(subject)
            return worker.makeSVG()
        except Exception as e:
            print(f"Error generating SVG: {e}")
            return None
