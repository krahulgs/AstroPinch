import math
from datetime import datetime, timedelta
from services.skyfield_engine import SkyfieldService

class VedicAstroEngine:
    # Constants for Lahiri Ayanamsa
    # Reference: Spica at 0 Libra in 285 AD (approx)
    LAHIRI_EPOCH = 285.0
    PRECESSION_RATE_ANNUAL = 50.2388475 # arc seconds

    NAKSHATRAS = [
        "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", 
        "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni", 
        "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha", 
        "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", 
        "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
    ]

    TITHIS = [
        "Shukla Pratipada", "Shukla Dwitiya", "Shukla Tritiya", "Shukla Chaturthi", "Shukla Panchami",
        "Shukla Shashthi", "Shukla Saptami", "Shukla Ashtami", "Shukla Navami", "Shukla Dashami",
        "Shukla Ekadashi", "Shukla Dwadashi", "Shukla Trayodashi", "Shukla Chaturdashi", "Purnima",
        "Krishna Pratipada", "Krishna Dwitiya", "Krishna Tritiya", "Krishna Chaturthi", "Krishna Panchami",
        "Krishna Shashthi", "Krishna Saptami", "Krishna Ashtami", "Krishna Navami", "Krishna Dashami",
        "Krishna Ekadashi", "Krishna Dwadashi", "Krishna Trayodashi", "Krishna Chaturdashi", "Amavasya"
    ]

    YOGAS = [
        "Vishkumbha", "Priti", "Ayushman", "Saubhagya", "Shobhana", "Atiganda", "Sukarma", "Dhriti",
        "Shula", "Ganda", "Vriddhi", "Dhruva", "Vyaghata", "Harshan", "Vajra", "Siddhi", "Vyatipata",
        "Variyan", "Parigha", "Shiva", "Siddha", "Sadhya", "Shubha", "Shukla", "Brahma", "Indra", "Vaidhriti"
    ]
    
    DASHA_PLANETS = [
        ("Ketu", 7), ("Venus", 20), ("Sun", 6), ("Moon", 10), 
        ("Mars", 7), ("Rahu", 18), ("Jupiter", 16), ("Saturn", 19), ("Mercury", 17)
    ]

    @staticmethod
    def calculate_ayanamsa(year, month, day):
        """
        Calculates approximate Lahiri Ayanamsa for a given date.
        """
        # Decimal year
        start_of_year = datetime(year, 1, 1)
        current_date = datetime(year, month, day)
        days_passed = (current_date - start_of_year).days
        decimal_year = year + (days_passed / 365.25)
        
        # Years since epoch
        years_diff = decimal_year - VedicAstroEngine.LAHIRI_EPOCH
        
        # Total precession in degrees
        precession_deg = (years_diff * VedicAstroEngine.PRECESSION_RATE_ANNUAL) / 3600.0
        
        return precession_deg

    @staticmethod
    def calculate_sidereal_planets(year, month, day, hour, minute, lat, lng, timezone_str="Asia/Kolkata"):
        """
        Get Sidereal (Nirayana) planetary positions.
        Converts local time to UTC before calculation if timezone provided.
        """
        # Ensure lat/lng are floats
        try:
            lat = float(lat)
            lng = float(lng)
        except:
            pass

        # SMART OVERRIDE & DEFAULT: 
        # 1. If timezone is missing, empty, or None, default to Asia/Kolkata for Indian coords
        # 2. If timezone is explicitly UTC but coords are in India, force Asia/Kolkata
        # India bounds approx: Lat 6 to 38, Lng 68 to 98
        is_india = (6.0 <= lat <= 38.0 and 68.0 <= lng <= 98.0)
        
        if not timezone_str or str(timezone_str).upper() == "NONE":
            # Smart Default extraction
            if is_india:
                timezone_str = "Asia/Kolkata"
            else:
                timezone_str = "UTC"

        # Convert to UTC
        import pytz
        try:
            local = datetime(year, month, day, hour, minute)
            # Handle possible string/None in timezone_str
            tz_name = str(timezone_str)
            try:
                tz = pytz.timezone(tz_name)
            except:
                # Fallback for common Indian naming variants
                if "Kolkata" in tz_name or "Calcutta" in tz_name or is_india:
                    tz = pytz.timezone("Asia/Kolkata")
                else:
                    tz = pytz.UTC
                    
            local_dt = tz.localize(local)
            utc_dt = local_dt.astimezone(pytz.UTC)
            
            # Use UTC components
            u_year, u_month, u_day = utc_dt.year, utc_dt.month, utc_dt.day
            u_hour, u_minute = utc_dt.hour, utc_dt.minute
        except Exception as e:
            # Final fallback: If everything fails, and it's India, subtract 5.5 hours manually
            if is_india:
                dt = datetime(year, month, day, hour, minute) - timedelta(hours=5, minutes=30)
                u_year, u_month, u_day, u_hour, u_minute = dt.year, dt.month, dt.day, dt.hour, dt.minute
            else:
                u_year, u_month, u_day, u_hour, u_minute = year, month, day, hour, minute
            print(f"Timezone conversion emergency fallback for {timezone_str} at {lat},{lng}")

        ayanamsa = VedicAstroEngine.calculate_ayanamsa(year, month, day)
        
        # Get Tropical positions from Skyfield using UTC time
        # CRITICAL: We must explicitly pass timezone_str='UTC' because u_year, u_month, etc. are ALREADY in UTC
        # If we don't specify, the default 'Asia/Kolkata' will cause double conversion!
        tropical_data = SkyfieldService.calculate_positions(u_year, u_month, u_day, u_hour, u_minute, lat, lng, timezone_str='UTC')
        
        # Get Tropical Ascendant using UTC time
        # CRITICAL: Same as above - already UTC, must specify to prevent double conversion
        angles = SkyfieldService.calculate_angles(u_year, u_month, u_day, u_hour, u_minute, lat, lng, timezone_str='UTC')
        tropical_asc = angles['Ascendant']
        sidereal_asc = (tropical_asc - ayanamsa) % 360
        asc_sign_index = int(sidereal_asc // 30) % 12
        
        signs = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"]
        
        sidereal_data = []
        for p in tropical_data:
            # Subtract Ayanamsa from Tropical Longitude
            sid_lon = (p['longitude'] - ayanamsa) % 360
            
            # Recalculate Zodiac Sign
            sign_index = int(sid_lon // 30) % 12
            pos_in_sign = sid_lon % 30
            
            # Whole Sign House Calculation
            # House 1 = Sign containing Ascendant
            # House = (SignIndex - AscSignIndex) + 1
            house_num = (sign_index - asc_sign_index) % 12 + 1
            
            sidereal_data.append({
                "name": p['name'],
                "tropical_longitude": p['longitude'],
                "sidereal_longitude": round(sid_lon, 4),
                "sign": signs[sign_index],
                "position": round(pos_in_sign, 2),
                "house": house_num, 
                "nakshatra": VedicAstroEngine._calculate_nakshatra(sid_lon),
                "sanskrit_name": VedicAstroEngine.PLANET_SANSKRIT.get(p['name'], p['name']),
                "dignity": VedicAstroEngine._calculate_dignity(p['name'], signs[sign_index], pos_in_sign),
                "retrograde": p.get('retrograde', False)
            })
            
        return {
            "ayanamsa": round(ayanamsa, 4),
            "ascendant": {
                "longitude": round(sidereal_asc, 4),
                "sign": signs[asc_sign_index],
                "sign_id": asc_sign_index + 1
            },
            "planets": sidereal_data
        }

    @staticmethod
    def _calculate_nakshatra(longitude):
        # 360 degrees / 27 nakshatras = 13.3333... degrees per nakshatra
        nakshatra_span = 360 / 27
        index = int(longitude / nakshatra_span)
        
        # Pada calculation (4 padas per nakshatra)
        pada_span = nakshatra_span / 4
        rem_deg = longitude % nakshatra_span
        pada = int(rem_deg / pada_span) + 1
        
        return {
            "name": VedicAstroEngine.NAKSHATRAS[index],
            "index": index + 1,
            "pada": pada
        }

    PLANET_SANSKRIT = {
        "Sun": "Surya", "Moon": "Chandra", "Mars": "Mangal", "Mercury": "Budh",
        "Jupiter": "Guru", "Venus": "Shukra", "Saturn": "Shani", "Rahu": "Rahu", "Ketu": "Ketu"
    }

    @staticmethod
    def _calculate_dignity(planet, sign, position):
        """
        Calculates Dignity (Status) of a planet.
        Uchcha (Exalted), Neecha (Debilitated), Swakshetra (Own Sign), etc.
        """
        # Exaltation/Debilitation points
        dignities = {
            "Sun": {"uchcha": ("Aries", 10), "neecha": ("Libra", 10), "own": ["Leo"]},
            "Moon": {"uchcha": ("Taurus", 3), "neecha": ("Scorpio", 3), "own": ["Cancer"]},
            "Mars": {"uchcha": ("Capricorn", 28), "neecha": ("Cancer", 28), "own": ["Aries", "Scorpio"]},
            "Mercury": {"uchcha": ("Virgo", 15), "neecha": ("Pisces", 15), "own": ["Gemini", "Virgo"]},
            "Jupiter": {"uchcha": ("Cancer", 5), "neecha": ("Capricorn", 5), "own": ["Sagittarius", "Pisces"]},
            "Venus": {"uchcha": ("Pisces", 27), "neecha": ("Virgo", 27), "own": ["Taurus", "Libra"]},
            "Saturn": {"uchcha": ("Libra", 20), "neecha": ("Aries", 20), "own": ["Capricorn", "Aquarius"]},
            "Rahu": {"uchcha": ("Taurus", 15), "neecha": ("Scorpio", 15), "own": ["Virgo"]}, # Varied opinions, common school
            "Ketu": {"uchcha": ("Scorpio", 15), "neecha": ("Taurus", 15), "own": ["Pisces"]}
        }

        if planet not in dignities:
            return {"status": "Neutral", "sanskrit": "Sama"}

        data = dignities[planet]
        uch_sign, uch_deg = data["uchcha"]
        nee_sign, nee_deg = data["neecha"]

        # 1. Exaltation (Uchcha)
        if sign == uch_sign:
            if abs(position - uch_deg) < 1: # Deep exaltation
                return {"status": "Deeply Exalted", "sanskrit": "Parama Uchcha"}
            return {"status": "Exalted", "sanskrit": "Uchcha"}

        # 2. Debilitation (Neecha)
        if sign == nee_sign:
            if abs(position - nee_deg) < 1: # Deep debilitation
                return {"status": "Deeply Debilitated", "sanskrit": "Parama Neecha"}
            return {"status": "Debilitated", "sanskrit": "Neecha"}

        # 3. Own Sign (Swakshetra)
        if sign in data["own"]:
            return {"status": "Own Sign", "sanskrit": "Swakshetra"}

        return {"status": "Neutral", "sanskrit": "Sama"}

    @staticmethod
    def calculate_panchang(year, month, day, hour, minute, lat, lng, timezone_str="Asia/Kolkata"):
        """
        Calculates Panchang elements: Tithi, Nakshatra, Yoga.
        IRONCLAD TIMEZONE SAFETY: Enforces Asia/Kolkata for Indian coordinates.
        """
        # IRONCLAD OVERRIDE: Strict geographical enforcement for India
        is_india = (6.0 <= lat <= 38.0 and 68.0 <= lng <= 98.0)
        if not timezone_str or str(timezone_str).upper() in ["UTC", "GMT", "NONE"]:
            if is_india:
                timezone_str = "Asia/Kolkata"
            else:
                timezone_str = "UTC"
        
        sidereal_data = VedicAstroEngine.calculate_sidereal_planets(year, month, day, hour, minute, lat, lng, timezone_str=timezone_str)
        planets = sidereal_data['planets']
        
        sun_lon = next(p for p in planets if p['name'] == 'Sun')['sidereal_longitude']
        moon_lon = next(p for p in planets if p['name'] == 'Moon')['sidereal_longitude']
        
        # 1. Tithi
        # Difference between Moon and Sun longitude divided by 12 degrees
        diff = (moon_lon - sun_lon) % 360
        tithi_index = int(diff / 12)
        tithi_name = VedicAstroEngine.TITHIS[tithi_index]
        
        # 2. Nakshatra (Moon)
        nakshatra_data = VedicAstroEngine._calculate_nakshatra(moon_lon)
        
        # 3. Yoga
        # (Sun Longitude + Moon Longitude) / 13 deg 20 min (13.333 deg)
        yoga_sum = (sun_lon + moon_lon) % 360
        yoga_span = 360 / 27
        yoga_index = int(yoga_sum / yoga_span)
        yoga_name = VedicAstroEngine.YOGAS[yoga_index]
        
        # 4. Karana
        # 60 Karanas in 30 Tithis (6 degrees each)
        diff = (moon_lon - sun_lon) % 360
        karana_idx = int(diff / 6)
        chara_karanas = ["Bava", "Balava", "Kaulava", "Taitila", "Gar", "Vanija", "Vishti"]
        
        if karana_idx == 0:
            karana_name = "Kintughna"
        elif 1 <= karana_idx <= 56:
            karana_name = chara_karanas[(karana_idx - 1) % 7]
        elif karana_idx == 57:
            karana_name = "Shakuni"
        elif karana_idx == 58:
            karana_name = "Chatushpada"
        else:
            karana_name = "Naga"

        # 5. Ascendant (Sidereal)
        asc_info = sidereal_data.get('ascendant', {})
        if asc_info:
            asc_sign_name = asc_info['sign']
            sid_asc = asc_info['longitude']
        else:
            # Fallback
            ayanamsa = VedicAstroEngine.calculate_ayanamsa(year, month, day)
            angles = SkyfieldService.calculate_angles(year, month, day, hour, minute, lat, lng, timezone_str=timezone_str)
            sid_asc = (angles['Ascendant'] - ayanamsa) % 360
            signs = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"]
            asc_sign_idx = int(sid_asc // 30) % 12
            asc_sign_name = signs[asc_sign_idx]

        return {
            "tithi": {
                "name": tithi_name,
                "index": tithi_index + 1
            },
            "nakshatra": nakshatra_data,
            "yoga": {
                "name": yoga_name,
                "index": yoga_index + 1
            },
            "karana": {
                "name": karana_name,
                "index": karana_idx + 1
            },
            "ascendant": {
                "name": asc_sign_name,
                "longitude": round(sid_asc, 4)
            },
            "sun_sign": next(p for p in planets if p['name'] == 'Sun')['sign'],
            "moon_sign": next(p for p in planets if p['name'] == 'Moon')['sign']
        }

    @staticmethod
    def calculate_divisional_charts(sidereal_data):
        """
        Calculates divisional charts, specifically D9 (Navamsa).
        Input: Result from calculate_sidereal_planets
        """
        planets = sidereal_data['planets']
        d9_planets = []
        
        signs = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", 
                 "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"]
        
        for p in planets:
            # Navamsa Calculation
            # Each sign (30 deg) is divided into 9 parts of 3 deg 20 min (3.333 deg)
            # The 9th harmonic mapping depends on the element of the sign
            
            # 1. Get Planet Longitude and Sign Index
            lon = p['sidereal_longitude']
            sign_idx = int(lon // 30) % 12
            pos_in_sign = lon % 30
            
            # 2. Determine Pada (1-9) in the sign
            # 3 deg 20 min = 3.3333... degrees
            pada = int(pos_in_sign / (30/9)) + 1
            
            # 3. Calculate Navamsa Sign Index
            # Rule:
            # Fire Signs (Aries 1, Leo 5, Sag 9): Start from Aries (0)
            # Earth Signs (Taurus 2, Virgo 6, Cap 10): Start from Capricorn (9)
            # Air Signs (Gemini 3, Libra 7, Aqua 11): Start from Libra (6)
            # Water Signs (Cancer 4, Scorpio 8, Pisces 12): Start from Cancer (3)
            
            # Simplified Logic:
            # Navamsa Sign Index = (SignIndex * 9 + (Pada - 1)) % 12
            # Wait, standard calculation is easier:
            # Absolute Longitude in minutes / 200 (3deg20min in min) % 12? No.
            
            # Let's use the start offset rule:
            # Group 1 (1, 5, 9): Offset 0 (Aries)
            # Group 2 (2, 6, 10): Offset 9 (Capricorn)
            # Group 3 (3, 7, 11): Offset 6 (Libra)
            # Group 4 (4, 8, 12): Offset 3 (Cancer)
            
            element_group = (sign_idx) % 4 # 0=Fire, 1=Earth, 2=Air, 3=Water
            
            if element_group == 0: # Fire
                start_offset = 0
            elif element_group == 1: # Earth
                start_offset = 9
            elif element_group == 2: # Air
                start_offset = 6
            else: # Water
                start_offset = 3
                
            navamsa_sign_idx = (start_offset + (pada - 1)) % 12
            
            d9_planets.append({
                "name": p['name'],
                "sign": signs[navamsa_sign_idx],
                "house": navamsa_sign_idx + 1 # Rough house relative to Aries, frontend will rotate
            })
            
        return {
            "D9": d9_planets
        }

    @staticmethod
    def calculate_vimshottari_dasha(year, month, day, hour, minute, lat, lng, timezone_str="Asia/Kolkata"):
        """
        Calculates Vimshottari Dasha details based on Moon's Nakshatra.
        Includes Mahadasha and Antardasha (Bhukti).
        IRONCLAD TIMEZONE SAFETY: Enforces Asia/Kolkata for Indian coordinates.
        """
        # IRONCLAD OVERRIDE: Strict geographical enforcement for India
        is_india = (6.0 <= lat <= 38.0 and 68.0 <= lng <= 98.0)
        if not timezone_str or str(timezone_str).upper() in ["UTC", "GMT", "NONE"]:
            if is_india:
                timezone_str = "Asia/Kolkata"
            else:
                timezone_str = "UTC"
        
        sidereal_data = VedicAstroEngine.calculate_sidereal_planets(year, month, day, hour, minute, lat, lng, timezone_str=timezone_str)
        moon = next(p for p in sidereal_data['planets'] if p['name'] == 'Moon')
        
        nak_info = moon['nakshatra']
        nak_index = nak_info['index'] - 1 # 0-indexed
        
        # Ruler Index in sequence
        ruler_index = nak_index % 9
        
        # Calculate balance of Dasha
        # 360 degrees / 27 nakshatras = 13.3333... deg per nakshatra
        nak_span = 360 / 27
        current_nak_start = nak_index * nak_span
        traversed = moon['sidereal_longitude'] - current_nak_start
        
        # Current Dasha at birth
        current_dasha_lord, total_years = VedicAstroEngine.DASHA_PLANETS[ruler_index]
        balance_years = ((nak_span - traversed) / nak_span) * total_years
        
        birth_date = datetime(year, month, day, hour, minute)
        timeline = []
        
        # 1. First Dasha (Balance)
        d_start = birth_date
        d_end = d_start + timedelta(days=balance_years * 365.2425)
        
        # Calculate Antardashas for this first dasha
        # Since it's a balance dasha, we need to find where in the Antardasha sequence the birth occurs
        traversed_years = total_years - balance_years
        
        # All Mahadashas (Full Cycle)
        current_time = birth_date - timedelta(days=traversed_years * 365.2425)
        
        all_dashas = []
        for i in range(15): # Calculate enough for a lifetime
            idx = (ruler_index + i) % 9
            m_lord, m_years = VedicAstroEngine.DASHA_PLANETS[idx]
            m_end = current_time + timedelta(days=m_years * 365.2425)
            
            # Sub-periods (Antardashas)
            sub_periods = []
            s_time = current_time
            for j in range(9):
                s_idx = (idx + j) % 9
                s_lord, s_years = VedicAstroEngine.DASHA_PLANETS[s_idx]
                # Antardasha = (M_Years * S_Years) / 120
                ant_years = (m_years * s_years) / 120.0
                s_end = s_time + timedelta(days=ant_years * 365.2425)
                
                sub_periods.append({
                    "planet": s_lord,
                    "start": s_time,
                    "end": s_end
                })
                s_time = s_end
            
            all_dashas.append({
                "planet": m_lord,
                "start": current_time,
                "end": m_end,
                "antardashas": sub_periods
            })
            current_time = m_end
            
        # Filter for relevant periods (current and future)
        now = datetime.now()
        active_m = None
        active_a = None
        
        results = []
        for m in all_dashas:
            # We want current phase and future ones for the UI
            if m['end'] > now:
                # If this is the active Mahadasha, find the active Antardasha
                current_ant = None
                if m['start'] <= now:
                    active_m = m['planet']
                    for a in m['antardashas']:
                        if a['start'] <= now < a['end']:
                            active_a = a['planet']
                            current_ant = a
                            break
                            
                results.append({
                    "planet": m['planet'],
                    "start": m['start'].strftime("%Y-%m-%d"),
                    "end": m['end'].strftime("%Y-%m-%d"),
                    "is_active": (m['start'] <= now < m['end']),
                    "active_antardasha": active_a if (m['start'] <= now < m['end']) else None
                })
                
        return {
            "active_mahadasha": active_m,
            "active_antardasha": active_a,
            "timeline": results[:10] # Return next few periods
        }
    @staticmethod
    def calculate_remedies(sidereal_data, lang="en"):
        """
        Calculates Vedic Remedies (Gemstone, Rudraksha, Mantra) based on Lagna (Ascendant) and Moon Sign.
        Supports 'en' (English) and 'hi' (Hindi).
        """
        planets = sidereal_data['planets']
        
        ascendant = next((p for p in planets if p['name'] == 'Ascendant'), None)
        moon = next((p for p in planets if p['name'] == 'Moon'), None)
        
        primary_sign = ascendant['sign'] if ascendant else (moon['sign'] if moon else "Aries")
        moon_sign = moon['sign'] if moon else "Aries"
        
        # English Map
        remedy_map_en = {
            "Aries": {"lord": "Mars", "gem": "Red Coral", "rudra": "3 Mukhi", "mantra": "Om Ang Angarakaya Namaha", "deity": "Hanuman"},
            "Taurus": {"lord": "Venus", "gem": "Diamond or White Sapphire", "rudra": "6 Mukhi", "mantra": "Om Shum Shukraya Namaha", "deity": "Lakshmi"},
            "Gemini": {"lord": "Mercury", "gem": "Emerald", "rudra": "4 Mukhi", "mantra": "Om Budh Budhaya Namaha", "deity": "Vishnu"},
            "Cancer": {"lord": "Moon", "gem": "Pearl", "rudra": "2 Mukhi", "mantra": "Om Som Somaya Namaha", "deity": "Shiva"},
            "Leo": {"lord": "Sun", "gem": "Ruby", "rudra": "12 Mukhi", "mantra": "Om Suryaya Namaha", "deity": "Surya"},
            "Virgo": {"lord": "Mercury", "gem": "Emerald", "rudra": "4 Mukhi", "mantra": "Om Budh Budhaya Namaha", "deity": "Vishnu"},
            "Libra": {"lord": "Venus", "gem": "Diamond or Opal", "rudra": "6 Mukhi", "mantra": "Om Shum Shukraya Namaha", "deity": "Lakshmi"},
            "Scorpio": {"lord": "Mars", "gem": "Red Coral", "rudra": "3 Mukhi", "mantra": "Om Ang Angarakaya Namaha", "deity": "Kartikeya"},
            "Sagittarius": {"lord": "Jupiter", "gem": "Yellow Sapphire", "rudra": "5 Mukhi", "mantra": "Om Brim Brihaspataye Namaha", "deity": "Dakshinamurthy"},
            "Capricorn": {"lord": "Saturn", "gem": "Blue Sapphire", "rudra": "7 Mukhi", "mantra": "Om Sham Shanaishcharaya Namaha", "deity": "Hanuman"},
            "Aquarius": {"lord": "Saturn", "gem": "Blue Sapphire", "rudra": "7 Mukhi", "mantra": "Om Sham Shanaishcharaya Namaha", "deity": "Shiva"},
            "Pisces": {"lord": "Jupiter", "gem": "Yellow Sapphire", "rudra": "5 Mukhi", "mantra": "Om Brim Brihaspataye Namaha", "deity": "Vishnu"}
        }

        # Hindi Map
        remedy_map_hi = {
            "Aries": {"lord": "मंगल", "gem": "लाल मूंगा", "rudra": "3 मुखी", "mantra": "ॐ अं अंगारकाय नमः", "deity": "हनुमान"},
            "Taurus": {"lord": "शुक्र", "gem": "हीरा या सफेद पुखराज", "rudra": "6 मुखी", "mantra": "ॐ शुं शुक्राय नमः", "deity": "लक्ष्मी"},
            "Gemini": {"lord": "बुध", "gem": "पन्ना", "rudra": "4 मुखी", "mantra": "ॐ बुं बुधाय नमः", "deity": "विष्णु"},
            "Cancer": {"lord": "चंद्र", "gem": "मोती", "rudra": "2 मुखी", "mantra": "ॐ सों सोमाय नमः", "deity": "शिव"},
            "Leo": {"lord": "सूर्य", "gem": "माणिक्य", "rudra": "12 मुखी", "mantra": "ॐ घृणि सूर्याय नमः", "deity": "सूर्य"},
            "Virgo": {"lord": "बुध", "gem": "पन्ना", "rudra": "4 मुखी", "mantra": "ॐ बुं बुधाय नमः", "deity": "विष्णु"},
            "Libra": {"lord": "शुक्र", "gem": "हीरा या ओपल", "rudra": "6 मुखी", "mantra": "ॐ शुं शुक्राय नमः", "deity": "लक्ष्मी"},
            "Scorpio": {"lord": "मंगल", "gem": "लाल मूंगा", "rudra": "3 मुखी", "mantra": "ॐ अं अंगारकाय नमः", "deity": "कार्तिकेय"},
            "Sagittarius": {"lord": "गुरु", "gem": "पुखराज", "rudra": "5 मुखी", "mantra": "ॐ बृं बृहस्पतये नमः", "deity": "दक्षिणामूर्ति"},
            "Capricorn": {"lord": "शनि", "gem": "नीलम", "rudra": "7 मुखी", "mantra": "ॐ शं शनैश्चराय नमः", "deity": "हनुमान"},
            "Aquarius": {"lord": "शनि", "gem": "नीलम", "rudra": "7 मुखी", "mantra": "ॐ शं शनैश्चराय नमः", "deity": "शिव"},
            "Pisces": {"lord": "गुरु", "gem": "पुखराज", "rudra": "5 मुखी", "mantra": "ॐ बृं बृहस्पतये नमः", "deity": "विष्णु"}
        }
        
        # Translation helpers
        trans = {
            "en": {
                "health": "Health, Vitality & General Fortune",
                "metal": "Gold or Silver",
                "wear": "Ring Finger or Middle Finger (depending on stone)",
                "balance": "Balances the mind and emotions ruled by {lord}.",
                "instructions": "Chant 108 times daily during morning puja."
            },
            "hi": {
                "health": "स्वास्थ्य, जीवन शक्ति और सामान्य भाग्य",
                "metal": "सोना या चांदी",
                "wear": "अनामिका या मध्यमा उंगली (रत्न के अनुसार)",
                "balance": "{lord} द्वारा शासित मन और भावनाओं को संतुलित करता है।",
                "instructions": "सुबह की पूजा के दौरान रोजाना 108 बार जाप करें।"
            }
        }

        # Select dictionary based on lang
        remedy_map = remedy_map_hi if lang == "hi" else remedy_map_en
        t = trans.get(lang, trans["en"])
        
        lagna_rem = remedy_map.get(primary_sign, remedy_map["Aries"])
        moon_rem = remedy_map.get(moon_sign, remedy_map["Aries"])
        
        return {
            "gemstone": {
                "stone": lagna_rem['gem'],
                "life_area": t["health"],
                "metal": t["metal"],
                "wear_finger": t["wear"]
            },
            "rudraksha": {
                "type": moon_rem['rudra'],
                "benefits": t["balance"].format(lord=moon_rem['lord']),
                "deity": moon_rem['deity']
            },
            "mantra": {
                "sanskrit": lagna_rem['mantra'],
                "deity": lagna_rem['deity'],
                "instructions": t["instructions"]
            }
        }

    @staticmethod
    def calculate_kp_system(sidereal_data):
        """
        Calculates KP System (Krishnamurti Paddhati) Details:
        - Star Lord (Nakshatra Lord)
        - Sub Lord
        """
        kp_data = []
        planets = sidereal_data['planets']
        
        # 120 Years Total Dasha Cycle
        # Planets order: Ketu, Venus, Sun, Moon, Mars, Rahu, Jupiter, Saturn, Mercury
        # Years: 7, 20, 6, 10, 7, 18, 16, 19, 17
        kp_lords = [
            ("Ketu", 7), ("Venus", 20), ("Sun", 6), ("Moon", 10), 
            ("Mars", 7), ("Rahu", 18), ("Jupiter", 16), ("Saturn", 19), ("Mercury", 17)
        ]
        
        for p in planets:
            lon = p['sidereal_longitude']
            
            # --- Star Lord & Sub Lord Calculation ---
            lords = VedicAstroEngine._calculate_kp_lords(lon, kp_lords)
            
            kp_data.append({
                "planet": p['name'],
                "sign": p['sign'],
                "star_lord": lords['star_lord'],
                "sub_lord": lords['sub_lord'],
                "source": "KP System"
            })
            
        return kp_data

    @staticmethod
    def calculate_kp_cusps(tropical_cusps, ayanamsa):
        """
        Calculates KP Lords for House Cusps (Cuspal Sub Lords - CSL).
        Expects tropical_cusps dict: { "1": deg, "10": deg, ... }
        """
        kp_cusps = {}
        kp_lords = [
            ("Ketu", 7), ("Venus", 20), ("Sun", 6), ("Moon", 10), 
            ("Mars", 7), ("Rahu", 18), ("Jupiter", 16), ("Saturn", 19), ("Mercury", 17)
        ]
        
        signs = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", 
                 "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"]

        for house_num, tropical_deg in tropical_cusps.items():
            sidereal_deg = (tropical_deg - ayanamsa) % 360
            
            lords = VedicAstroEngine._calculate_kp_lords(sidereal_deg, kp_lords)
            sign_idx = int(sidereal_deg // 30) % 12
            
            kp_cusps[house_num] = {
                "cusp": house_num,
                "degree": round(sidereal_deg, 4),
                "sign": signs[sign_idx],
                "sign_lord": VedicAstroEngine._get_sign_lord(signs[sign_idx]),
                "star_lord": lords['star_lord'],
                "sub_lord": lords['sub_lord']
            }
            
        return kp_cusps

    @staticmethod
    def _calculate_kp_lords(longitude, kp_lords):
        """Helper to calculate Star and Sub Lord for a given longitude"""
        nak_span = 360 / 27 
        nak_index = int(longitude / nak_span)
        ruler_start_idx = nak_index % 9
        star_lord_name = kp_lords[ruler_start_idx][0]
        
        rem_deg = longitude % nak_span
        current_sub_idx = ruler_start_idx
        accumulated_deg = 0.0
        sub_lord_name = "Unknown"
        
        for i in range(9):
            idx = (current_sub_idx + i) % 9
            p_name, p_years = kp_lords[idx]
            span = (p_years / 120.0) * nak_span
            
            if rem_deg < (accumulated_deg + span):
                sub_lord_name = p_name
                break
            accumulated_deg += span
            
        return {"star_lord": star_lord_name, "sub_lord": sub_lord_name}

    @staticmethod
    def _get_sign_lord(sign_name):
        lords = {
            "Aries": "Mars", "Taurus": "Venus", "Gemini": "Mercury", "Cancer": "Moon",
            "Leo": "Sun", "Virgo": "Mercury", "Libra": "Venus", "Scorpio": "Mars",
            "Sagittarius": "Jupiter", "Capricorn": "Saturn", "Aquarius": "Saturn", "Pisces": "Jupiter"
        }
        return lords.get(sign_name, "Unknown")

    @staticmethod
    def calculate_doshas(sidereal_data):
        from services.dosha_calculator import DoshaCalculator
        return DoshaCalculator.calculate_doshas(sidereal_data)

    @staticmethod
    def calculate_avakhada(sidereal_data):
        """
        Calculates Avakhada Chakra details based on Moon's position.
        """
        moon = next((p for p in sidereal_data['planets'] if p['name'] == 'Moon'), None)
        if not moon:
            return {}

        signs = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"]
        moon_sign_idx = signs.index(moon['sign'])
        nak_info = moon['nakshatra']
        nak_idx = nak_info['index'] - 1 # 0-indexed (Ashwini=0)

        # 1. Varna (Sign based)
        varna_map = {
            "Cancer": "Brahmin", "Scorpio": "Brahmin", "Pisces": "Brahmin",
            "Aries": "Kshatriya", "Leo": "Kshatriya", "Sagittarius": "Kshatriya",
            "Taurus": "Vaishya", "Virgo": "Vaishya", "Capricorn": "Vaishya",
            "Gemini": "Shudra", "Libra": "Shudra", "Aquarius": "Shudra"
        }
        varna = varna_map.get(moon['sign'], "Unknown")

        # 2. Vashya (Sign based)
        if moon['sign'] in ["Aries", "Taurus"]:
            vashya = "Chatushpada"
        elif moon['sign'] == "Leo":
            vashya = "Vanachar"
        elif moon['sign'] in ["Gemini", "Virgo", "Libra", "Aquarius"]:
            vashya = "Dwipada"
        elif moon['sign'] == "Sagittarius":
            vashya = "Chatushpada" if moon['position'] < 15 else "Dwipada"
        elif moon['sign'] == "Capricorn":
            vashya = "Chatushpada" if moon['position'] < 15 else "Jalachar"
        elif moon['sign'] in ["Cancer", "Pisces"]:
            vashya = "Jalachar"
        elif moon['sign'] == "Scorpio":
            vashya = "Keeta"
        else:
            vashya = "Unknown"

        # 3. Gana (Nakshatra based)
        deva_nak = [1, 5, 7, 8, 13, 15, 17, 22, 27]
        manushya_nak = [2, 4, 6, 11, 12, 20, 21, 25, 26]
        
        if (nak_idx + 1) in deva_nak: gana = "Deva"
        elif (nak_idx + 1) in manushya_nak: gana = "Manushya"
        else: gana = "Rakshasa"

        # 4. Yoni (Nakshatra based)
        yoni_list = [
            "Horse", "Elephant", "Sheep", "Serpent", "Serpent", "Dog", "Cat", "Sheep", "Cat",
            "Rat", "Rat", "Cow", "Buffalo", "Tiger", "Buffalo", "Tiger", "Deer", "Deer",
            "Dog", "Monkey", "Mongoose", "Monkey", "Lion", "Horse", "Lion", "Cow", "Elephant"
        ]
        yoni = yoni_list[nak_idx] if 0 <= nak_idx < 27 else "Unknown"

        # 5. Nadi (Nakshatra based)
        adi = [1, 6, 7, 12, 13, 18, 19, 24, 25]
        madhya = [2, 5, 8, 11, 14, 17, 20, 23, 26]
        
        if (nak_idx + 1) in adi: nadi = "Adi"
        elif (nak_idx + 1) in madhya: nadi = "Madhya"
        else: nadi = "Antya"

        # 6. Paya (House from Lagna based)
        m_house = moon['house']
        if m_house in [1, 6, 11]: paya = "Gold"
        elif m_house in [2, 5, 9]: paya = "Silver"
        elif m_house in [3, 7, 10]: paya = "Copper"
        else: paya = "Iron"

        # 7. Yunja
        yunja_list = ["Madhya", "Madhya", "Antya", "Adi", "Adi", "Antya", "Madhya", "Madhya", "Antya", "Adi", "Adi", "Antya", "Madhya", "Madhya", "Antya", "Adi", "Adi", "Antya", "Madhya", "Madhya", "Antya", "Adi", "Adi", "Antya", "Madhya", "Madhya", "Antya"]
        yunja = yunja_list[nak_idx] if 0 <= nak_idx < 27 else "Unknown"

        # 8. Tatwa
        tatwas = ["Fire", "Earth", "Air", "Water"]
        tatwa = tatwas[moon_sign_idx % 4]

        return {
            "varna": varna,
            "vashya": vashya,
            "gana": gana,
            "yoni": yoni,
            "nadi": nadi,
            "paya": paya,
            "yunja": yunja,
            "tatwa": tatwa,
            "moon_sign": moon['sign'],
            "nakshatra": nak_info['name'],
            "pada": nak_info['pada']
        }
