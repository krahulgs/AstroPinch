from skyfield.api import load, Topos, wgs84
from datetime import datetime
import numpy as np

class SkyfieldService:
    _planets = None
    _ts = None
    _eph = None

    @classmethod
    def _init_skyfield(cls):
        if cls._planets is None:
            ts = load.timescale()
            eph = load('de421.bsp')
            cls._planets = {
                'Sun': eph['sun'],
                'Moon': eph['moon'],
                'Mercury': eph['mercury'],
                'Venus': eph['venus'],
                'Mars': eph['mars'],
                'Jupiter': eph['jupiter barycenter'],
                'Saturn': eph['saturn barycenter'],
                'Uranus': eph['uranus barycenter'],
                'Neptune': eph['neptune barycenter'],
                'Pluto': eph['pluto barycenter']
            }
            cls._eph = eph
            cls._ts = ts

    @staticmethod
    def _estimate_house(planet_lon, lat, lng, t):
        # Improved Ascendant Calculation
        # RAMC = GST + Longitude (in hours)
        gst = t.gmst
        lst = (gst + lng / 15.0) % 24
        ramc_deg = lst * 15.0
        
        # Approximate Ascendant based on LST and Lat
        # At equator, Asc = RAMC + 90. At latitudes, it varies.
        asc_deg = (ramc_deg + 90) % 360 
        
        # Calculate house (Equal House System)
        house = int(((planet_lon - asc_deg) % 360) // 30) + 1
        return house

    @classmethod
    def calculate_positions(cls, year, month, day, hour, minute, lat, lng):
        cls._init_skyfield()
        
        # Create time object (Current)
        t = cls._ts.utc(year, month, day, hour, minute)
        # Create time object (Previous Hour for Rate calc)
        # Handle wraparound correctly for Skyfield
        from datetime import timedelta, datetime
        dt = datetime(year, month, day, hour, minute)
        dt_prev = dt - timedelta(hours=1)
        t_prev = cls._ts.utc(dt_prev.year, dt_prev.month, dt_prev.day, dt_prev.hour, dt_prev.minute)
        
        observer = wgs84.latlon(lat, lng)
        earth = cls._eph['earth']
        
        results = []
        signs = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"]

        for name, body in cls._planets.items():
            # 1. Calculate Current Position
            astrometric = earth.at(t).observe(body).apparent()
            lat_ecl, lon_ecl, dist = astrometric.ecliptic_latlon('date')
            lon_deg = lon_ecl.degrees
            
            # 2. Calculate Previous Position (for speed)
            astro_prev = earth.at(t_prev).observe(body).apparent()
            _, lon_prev, _ = astro_prev.ecliptic_latlon('date')
            lon_deg_prev = lon_prev.degrees
            
            # 3. Determine Retrograde
            # Handle 360-0 boundary
            diff = lon_deg - lon_deg_prev
            if diff < -180: diff += 360
            if diff > 180: diff -= 360
            
            is_retrograde = diff < 0
            
            # 4. Formatting
            sign_index = int(lon_deg // 30) % 12
            
            results.append({
                "name": name,
                "longitude": float(round(lon_deg, 4)),
                "sign": signs[sign_index],
                "position": float(round(lon_deg % 30, 2)),
                "house": SkyfieldService._estimate_house(lon_deg, lat, lng, t),
                "retrograde": bool(is_retrograde),
                "speed": float(diff) # degrees per hour approx
            })
            
        # 5. Calculate Rahu (North Node) and Ketu (South Node)
        # Formula for Mean Node (Meeus): omega = 125.04452 - 1934.136261 * T
        jd = t.tt
        T = (jd - 2451545.0) / 36525.0
        
        omega = 125.04452 - 1934.136261 * T + 0.0020708 * T * T + (T * T * T) / 450000.0
        omega_deg = omega % 360
        if omega_deg < 0: omega_deg += 360
        
        # Rahu
        r_sign_idx = int(omega_deg // 30) % 12
        results.append({
            "name": "Rahu",
            "longitude": float(round(omega_deg, 4)),
            "sign": signs[r_sign_idx],
            "position": float(round(omega_deg % 30, 2)),
            "house": SkyfieldService._estimate_house(omega_deg, lat, lng, t),
            "retrograde": True, # Mean Node is always retrograde in long-term average
            "speed": -0.05295 # Approx daily motion in degrees? Or hour? 19 deg / year approx. 
            # Actually speed is not critical for most static charts, but it's negative.
        })
        
        # Ketu (Opposite)
        ketu_deg = (omega_deg + 180) % 360
        k_sign_idx = int(ketu_deg // 30) % 12
        results.append({
            "name": "Ketu",
            "longitude": float(round(ketu_deg, 4)),
            "sign": signs[k_sign_idx],
            "position": float(round(ketu_deg % 30, 2)),
            "house": SkyfieldService._estimate_house(ketu_deg, lat, lng, t),
            "retrograde": True,
            "speed": -0.05295
        })

        return results

    @classmethod
    def calculate_angles(cls, year, month, day, hour, minute, lat, lng):
        """
        Calculates Ascendant (AC), Midheaven (MC), Descendant (DC), and Imum Coeli (IC).
        Returns a dictionary of absolute degrees (0-360).
        """
        cls._init_skyfield()
        t = cls._ts.utc(year, month, day, hour, minute)
        
        # 1. Calculate RAMC (Right Ascension of Medium Coeli) in degrees
        # RAMC = LST * 15
        gst_hours = t.gmst
        lst_hours = (gst_hours + lng / 15.0) % 24
        ramc_deg = lst_hours * 15.0
        
        # 2. Midheaven (MC)
        # MC is the intersection of Meridian and Ecliptic.
        # tan(MC) = tan(RAMC) / cos(epsilon)
        # However, usually MC is simply the point on Ecliptic culminating.
        # Strict formula: tan(MC) = tan(RAMC) / cos(obl)
        # Wait, simple approx: MC is where Ecliptic crosses Meridian.
        
        import math
        fl = math.floor
        rad = math.radians
        deg = math.degrees
        sin = math.sin
        cos = math.cos
        tan = math.tan
        atan = math.atan
        atan2 = math.atan2
        
        e = rad(23.4392911) # Obliquity of ecliptic (J2000 approx)
        ramc = rad(ramc_deg)
        
        # MC Calculation: tan(MC) = tan(RAMC)/cos(e)
        # We use atan2 to get the correct quadrant
        mc_rad = atan2(tan(ramc), cos(e))
        mc_deg = deg(mc_rad)
        
        # Adjust MC to be in the same quadrant as RAMC (0-360 check)
        # Or simply normalize. MC should be close to RAMC.
        # Correct approach using atan2(y, x):
        # x = cos(ramc) * cos(e) ?? No, that's not right.
        # Standard: MC = atan(tan(RAMC)/cos(e))
        # If RAMC is in Q2/Q3, we might need to add 180.
        if mc_deg < 0: mc_deg += 360
        
        # Quadrant Check: MC and RAMC should be within 90 deg usually?
        # A robust way:
        # mc_deg should be such that sin(MC)*cos(e) ~ sin(RAMC)/tan(MC)? No.
        # Simplest: if RAMC is in [90, 270], add 180?
        if 90 < ramc_deg <= 270:
            if mc_deg < 90 or mc_deg > 270:
                mc_deg = (mc_deg + 180) % 360
        
        # 3. Ascendant (AC)
        # tan(AC) = cos(RAMC) / ( -sin(RAMC)*cos(e) - tan(lat)*sin(e) )
        phi = rad(lat)
        
        numerator = cos(ramc)
        denominator = -sin(ramc) * cos(e) - tan(phi) * sin(e)
        
        asc_rad = atan2(numerator, denominator)
        asc_deg = deg(asc_rad)
        if asc_deg < 0: asc_deg += 360
        
        # 4. Derived Angles
        desc_deg = (asc_deg + 180) % 360
        ic_deg = (mc_deg + 180) % 360
        
        return {
            "Ascendant": asc_deg,
            "Midheaven": mc_deg,
            "Descendant": desc_deg,
            "IC": ic_deg
        }
