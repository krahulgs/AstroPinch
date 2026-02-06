from services.vedic_astro_engine import VedicAstroEngine
from services.ai_service import client, model
import json

class MatchingService:
    @staticmethod
    def calculate_ashta_koota(bride_details, groom_details, lang="en"):
        """
        Calculates Ashta-Koota points between bride and groom.
        bride_details, groom_details: dicts with year, month, day, hour, minute, lat, lng, timezone
        """
        # 1. Get Astrological Info for both
        bride_astro = VedicAstroEngine.calculate_sidereal_planets(
            bride_details['year'], bride_details['month'], bride_details['day'],
            bride_details['hour'], bride_details['minute'], bride_details['lat'], bride_details['lng'],
            timezone_str=bride_details.get('timezone', 'UTC')
        )
        groom_astro = VedicAstroEngine.calculate_sidereal_planets(
            groom_details['year'], groom_details['month'], groom_details['day'],
            groom_details['hour'], groom_details['minute'], groom_details['lat'], groom_details['lng'],
            timezone_str=groom_details.get('timezone', 'UTC')
        )

        def get_planet(astro_raw, name):
            for p in astro_raw['planets']:
                if p['name'] == name:
                    return p
            return None

        b_moon = get_planet(bride_astro, 'Moon')
        g_moon = get_planet(groom_astro, 'Moon')

        if not b_moon or not g_moon:
            raise Exception("Moon position not found in calculations.")

        # Extract Indices
        # Nakshatra Index (0-26)
        b_nak_idx = MatchingService._get_nak_idx(b_moon['nakshatra']['name'])
        g_nak_idx = MatchingService._get_nak_idx(g_moon['nakshatra']['name'])
        
        # Rashi Index (0-11: Aries is 0)
        rashis = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"]
        b_rashi_idx = rashis.index(b_moon['sign'])
        g_rashi_idx = rashis.index(g_moon['sign'])

        kootas = []
        total_score = 0

        # --- 1. VARNA (Max 1) ---
        varna_points, b_varna, g_varna = MatchingService._calc_varna(b_rashi_idx, g_rashi_idx)
        kootas.append({"name": "Varna", "significance": "Working personality & Ego", "bride_val": b_varna, "groom_val": g_varna, "points": varna_points, "max_points": 1})
        total_score += varna_points

        # --- 2. VASHYA (Max 2) ---
        vashya_points, b_vashya, g_vashya = MatchingService._calc_vashya(b_rashi_idx, g_rashi_idx)
        kootas.append({"name": "Vashya", "significance": "Dominance and Control", "bride_val": b_vashya, "groom_val": g_vashya, "points": vashya_points, "max_points": 2})
        total_score += vashya_points

        # --- 3. TARA (Max 3) ---
        tara_points = MatchingService._calc_tara(b_nak_idx, g_nak_idx)
        kootas.append({"name": "Tara", "significance": "Destiny and Luck", "bride_val": "Nakshatra " + str(b_nak_idx + 1), "groom_val": "Nakshatra " + str(g_nak_idx + 1), "points": tara_points, "max_points": 3})
        total_score += tara_points

        # --- 4. YONI (Max 4) ---
        yoni_points, b_yoni, g_yoni = MatchingService._calc_yoni(b_nak_idx, g_nak_idx)
        kootas.append({"name": "Yoni", "significance": "Physical & Intimate Compatibility", "bride_val": b_yoni, "groom_val": g_yoni, "points": yoni_points, "max_points": 4})
        total_score += yoni_points

        # --- 5. GRAHA MAITRI (Max 5) ---
        maitri_points, b_lord, g_lord = MatchingService._calc_maitri(b_rashi_idx, g_rashi_idx)
        kootas.append({"name": "Graha Maitri", "significance": "Mental and Intellectual Bond", "bride_val": b_lord, "groom_val": g_lord, "points": maitri_points, "max_points": 5})
        total_score += maitri_points

        # --- 6. GANA (Max 6) ---
        gana_points, b_gana, g_gana = MatchingService._calc_gana(b_nak_idx, g_nak_idx)
        kootas.append({"name": "Gana", "significance": "Temperament and Behavior", "bride_val": b_gana, "groom_val": g_gana, "points": gana_points, "max_points": 6})
        total_score += gana_points

        # --- 7. BHAKOOT (Max 7) ---
        bhakoot_points = MatchingService._calc_bhakoot(b_rashi_idx, g_rashi_idx)
        kootas.append({"name": "Bhakoot", "significance": "Emotional and Family Life", "bride_val": rashis[b_rashi_idx], "groom_val": rashis[g_rashi_idx], "points": bhakoot_points, "max_points": 7})
        total_score += bhakoot_points

        # --- 8. NADI (Max 8) ---
        nadi_points, b_nadi, g_nadi = MatchingService._calc_nadi(b_nak_idx, g_nak_idx)
        kootas.append({"name": "Nadi", "significance": "Health and Genetic Compatibility", "bride_val": b_nadi, "groom_val": g_nadi, "points": nadi_points, "max_points": 8})
        total_score += nadi_points

        # Manglik Analysis
        b_manglik = MatchingService._is_manglik_check(bride_astro, get_planet)
        g_manglik = MatchingService._is_manglik_check(groom_astro, get_planet)
        
        doshas = MatchingService._get_dosha_analysis(kootas)

        # Advanced Analysis
        dasha_sync = MatchingService._analyze_dasha_synchronization(bride_astro, groom_astro, bride_details, groom_details)
        navamsa_compat = MatchingService._analyze_navamsa_compatibility(bride_astro, groom_astro)
        transit_analysis = MatchingService._analyze_transits(bride_details, groom_details)
        marriage_windows = MatchingService._calculate_marriage_windows(bride_astro, groom_astro, bride_details, groom_details)

        # AI Summary
        ai_analysis = MatchingService.generate_ai_analysis(
            bride_details['name'], groom_details['name'],
            kootas, total_score, b_manglik, g_manglik, doshas, lang=lang
        )

        return {
            "total_score": total_score,
            "summary": MatchingService._get_static_summary(total_score),
            "koota_details": kootas,
            "bride": {
                "name": bride_details['name'],
                "is_manglik": b_manglik['is_manglik'],
                "manglik_status": b_manglik['status'],
                "rashi": b_moon['sign'],
                "nakshatra": b_moon['nakshatra']['name']
            },
            "groom": {
                "name": groom_details['name'],
                "is_manglik": g_manglik['is_manglik'],
                "manglik_status": g_manglik['status'],
                "rashi": g_moon['sign'],
                "nakshatra": g_moon['nakshatra']['name']
            },
            "manglik_summary": MatchingService._get_manglik_summary(b_manglik, g_manglik),
            "doshas": doshas,
            "ai_analysis": ai_analysis,
            "dasha_synchronization": dasha_sync,
            "navamsa_compatibility": navamsa_compat,
            "transit_analysis": transit_analysis,
            "marriage_windows": marriage_windows
        }

    @staticmethod
    def _is_manglik_check(astro_data, find_func):
        mars = find_func(astro_data, 'Mars')
        if not mars: return {"is_manglik": False, "status": "Unknown", "house": 0}
        house = mars['house']
        # Manglik houses: 1, 4, 7, 8, 12
        is_manglik = house in [1, 4, 7, 8, 12]
        status = "Manglik" if is_manglik else "Non-Manglik"
        return {"is_manglik": is_manglik, "status": status, "house": house}

    @staticmethod
    def _get_nak_idx(nak_name):
        naks = [
            "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", "Punarvasu", "Pushya", "Ashlesha",
            "Magha", "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
            "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishtha", "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
        ]
        return naks.index(nak_name) if nak_name in naks else 0

    @staticmethod
    def _calc_varna(b_idx, g_idx):
        mapping = {3: 4, 7: 4, 11: 4, 0: 3, 4: 3, 8: 3, 1: 2, 5: 2, 9: 2, 2: 1, 6: 1, 10: 1}
        names = {4: "Brahmin", 3: "Kshatriya", 2: "Vaishya", 1: "Shudra"}
        b_rank = mapping.get(g_idx, 1) # Boy
        g_rank = mapping.get(b_idx, 1) # Girl
        return (1 if b_rank >= g_rank else 0), names[g_rank], names[b_rank]

    @staticmethod
    def _calc_vashya(b_idx, g_idx):
        vashya_map = [0, 0, 1, 2, 3, 1, 1, 4, 0, 0, 1, 2]
        names = ["Chatuspada", "Manav", "Jalchar", "Vanachar", "Keeta"]
        b_type = vashya_map[g_idx]
        g_type = vashya_map[b_idx]
        if b_type == g_type: return 2, names[g_type], names[b_type]
        if (b_type == 3 and g_type != 3) or (g_type == 3 and b_type != 3): return 0, names[g_type], names[b_type]
        return 1, names[g_type], names[b_type]

    @staticmethod
    def _calc_tara(b_nak, g_nak):
        dist1 = (g_nak - b_nak) % 27
        tara1 = (dist1 % 9) + 1
        dist2 = (b_nak - g_nak) % 27
        tara2 = (dist2 % 9) + 1
        points = 0
        if tara1 not in [3, 5, 7]: points += 1.5
        if tara2 not in [3, 5, 7]: points += 1.5
        return int(points)

    @staticmethod
    def _calc_yoni(b_nak, g_nak):
        yoni_map = ["Horse", "Elephant", "Sheep", "Serpent", "Serpent", "Dog", "Cat", "Cat", "Rat", "Rat", "Cow", "Cow", "Buffalo", "Buffalo", "Tiger", "Tiger", "Deer", "Deer", "Dog", "Monkey", "Monkey", "Elephant", "Lion", "Lion", "Horse", "Sheep", "Monkey"]
        b_yoni, g_yoni = yoni_map[g_nak], yoni_map[b_nak]
        if b_yoni == g_yoni: return 4, g_yoni, b_yoni
        hostile = {"Snake": "Mongoose", "Rat": "Cat", "Lion": "Elephant", "Tiger": "Cow", "Horse": "Buffalo", "Dog": "Deer", "Monkey": "Sheep"}
        if hostile.get(b_yoni) == g_yoni or hostile.get(g_yoni) == b_yoni: return 0, g_yoni, b_yoni
        return 2, g_yoni, b_yoni

    @staticmethod
    def _calc_maitri(b_idx, g_idx):
        lord_names = ["Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter"]
        b_lord, g_lord = lord_names[g_idx], lord_names[b_idx]
        if b_lord == g_lord: return 5, g_lord, b_lord
        g1, g2 = ["Sun", "Moon", "Mars", "Jupiter"], ["Mercury", "Venus", "Saturn"]
        if (b_lord in g1 and g_lord in g1) or (b_lord in g2 and g_lord in g2): return 4, g_lord, b_lord
        if (b_lord == "Mercury" and g_lord in g1) or (g_lord == "Mercury" and b_lord in g1): return 3, g_lord, b_lord
        return 0.5, g_lord, b_lord

    @staticmethod
    def _calc_gana(b_nak, g_nak):
        ganas = [0, 1, 0, 1, 0, 1, 0, 0, 2, 2, 1, 1, 0, 2, 0, 2, 0, 2, 2, 1, 0, 0, 2, 2, 1, 1, 0]
        names = ["Deva", "Manushya", "Rakshasa"]
        b_gana, g_gana = ganas[g_nak], ganas[b_nak]
        if b_gana == g_gana: return 6, names[g_gana], names[b_gana]
        if (b_gana == 0 and g_gana == 1) or (b_gana == 1 and g_gana == 0): return 5, names[g_gana], names[b_gana]
        return 1, names[g_gana], names[b_gana]

    @staticmethod
    def _calc_bhakoot(b_idx, g_idx):
        dist = (g_idx - b_idx) % 12 + 1
        return 0 if dist in [2, 12, 5, 9, 6, 8] and b_idx != g_idx else 7

    @staticmethod
    def _calc_nadi(b_nak, g_nak):
        nadis = [0, 1, 2, 2, 1, 0, 0, 1, 2, 2, 1, 0, 0, 1, 2, 2, 1, 0, 0, 1, 2, 2, 1, 0, 0, 1, 2]
        names = ["Adi", "Madhya", "Antya"]
        return (8, names[nadis[b_nak]], names[nadis[g_nak]]) if nadis[b_nak] != nadis[g_nak] else (0, names[nadis[b_nak]], names[nadis[g_nak]])

    @staticmethod
    def _get_static_summary(score):
        if score >= 33: return "Excellent Match"
        if score >= 25: return "Good Match"
        if score >= 18: return "Average Match"
        return "Challenging Match"

    @staticmethod
    def _get_manglik_summary(b, g):
        if not b['is_manglik'] and not g['is_manglik']: return "Both Non-Manglik"
        if b['is_manglik'] and g['is_manglik']: return "Both Manglik (Canceled)"
        return "One Manglik"

    @staticmethod
    def _get_dosha_analysis(kootas):
        nadi = next(k for k in kootas if k['name'] == "Nadi")
        bhakoot = next(k for k in kootas if k['name'] == "Bhakoot")
        gana = next(k for k in kootas if k['name'] == "Gana")
        return [
            {"name": "Nadi Dosha", "is_present": nadi['points'] == 0, "description": "Genetic/Health compatibility."},
            {"name": "Bhakoot Dosha", "is_present": bhakoot['points'] == 0, "description": "Emotional/Family harmony."},
            {"name": "Gana Dosha", "is_present": gana['points'] <= 1, "description": "Temperament differences."}
        ]

    @staticmethod
    def generate_ai_analysis(b_name, g_name, kootas, total_score, b_manglik, g_manglik, doshas, lang="en"):
        # Combine everything into a structured prompt
        koota_str = "\n".join([f"- {k['name']}: {k['points']}/{k['max_points']} ({k['bride_val']} vs {k['groom_val']})" for k in kootas])
        dosha_str = "\n".join([f"- {d['name']}: {'Present' if d['is_present'] else 'Absent'}" for d in doshas])
        
        prompt = f"""You are a Vedic Astrology Kundali Matching Expert for an astrology application called “AstroPinch”. 

Your role is to analyze Kundali matching results that are already calculated programmatically and present them in a clear, neutral, and user-friendly manner for common users.

**Bride**: {b_name}
**Groom**: {g_name}
**Total Guna Score**: {total_score}/36

**Ashta-Koota Breakdown**:
{koota_str}

**Manglik Status**:
- Bride: {b_manglik['status']}
- Groom: {g_manglik['status']}

**Major Doshas**:
{dosha_str}

### Your Responsibilities:
1. Explain the **overall compatibility** in simple, non-alarming language.
2. Interpret the **total Guna score** using defined ranges: 0-17 (Challenging), 18-24 (Average), 25-32 (Good), 33-36 (Excellent).
3. Explain **each Koota** in 2–3 lines using everyday language.
4. Highlight major risks and strong compatibility areas.
5. If Manglik dosha exists, explain it calmly and mention standard cancellation conditions.
6. Provide **practical remedies or suggestions**.
7. End with a **balanced conclusion**.

### Tone & Style:
- Neutral, respectful, modern, Easy English.
- No emojis. No absolute predictions of failure or guaranteed success.

### Output Structure:
1. Overall Match Summary
2. Guna Score Interpretation
3. Koota-wise Compatibility Table (summary form)
4. Dosha Analysis
5. Strengths of the Match
6. Challenges to Be Aware Of
7. Remedies / Practical Advice
8. Final Guidance Note

{ "Respond in Hindi (Devanagari script)." if lang == "hi" else "" }
"""

        # Try Groq first
        if client:
            try:
                response = client.chat.completions.create(
                    messages=[{"role": "user", "content": prompt}], 
                    model="llama-3.3-70b-versatile", 
                    temperature=0.7,
                    timeout=15 
                )
                return response.choices[0].message.content
            except Exception as e:
                print(f"Groq AI Match Error: {e}")

        # Fallback to Gemini
        if model:
            try:
                response = model.generate_content(prompt)
                return response.text
            except Exception as e:
                print(f"Gemini AI Match Error: {e}")

        return "AI Match Analysis is currently undergoing cosmic recalibration. Please check back in a moment for your personalized compatibility insights."

    @staticmethod
    def _analyze_dasha_synchronization(bride_astro, groom_astro, bride_details, groom_details):
        """Analyze Dasha period synchronization between bride and groom"""
        from datetime import datetime, timedelta
        from services.vedic_astro_engine import VedicAstroEngine
        
        try:
            # Calculate Dasha for both
            print(f"Calculating Dasha for Bride: {bride_details.get('name', 'Unknown')}")
            bride_dasha = VedicAstroEngine.calculate_vimshottari_dasha(
                bride_details['year'], bride_details['month'], bride_details['day'],
                bride_details['hour'], bride_details['minute'],
                bride_details['lat'], bride_details['lng']
            )
            
            print(f"Calculating Dasha for Groom: {groom_details.get('name', 'Unknown')}")
            groom_dasha = VedicAstroEngine.calculate_vimshottari_dasha(
                groom_details['year'], groom_details['month'], groom_details['day'],
                groom_details['hour'], groom_details['minute'],
                groom_details['lat'], groom_details['lng']
            )
            
            print(f"Bride Dasha timeline count: {len(bride_dasha.get('timeline', []))}")
            print(f"Groom Dasha timeline count: {len(groom_dasha.get('timeline', []))}")
            
            # Get current Mahadasha for both
            current_date = datetime.now()
            bride_current = None
            groom_current = None
            
            for d in bride_dasha.get('timeline', []):
                if d.get('start') and d.get('end'):
                    try:
                        start_date = datetime.strptime(d['start'], '%Y-%m-%d')
                        end_date = datetime.strptime(d['end'], '%Y-%m-%d')
                        if start_date <= current_date <= end_date:
                            bride_current = d
                            break
                    except Exception as e:
                        print(f"Date parsing error for bride: {e}")
                        continue
            
            for d in groom_dasha.get('timeline', []):
                if d.get('start') and d.get('end'):
                    try:
                        start_date = datetime.strptime(d['start'], '%Y-%m-%d')
                        end_date = datetime.strptime(d['end'], '%Y-%m-%d')
                        if start_date <= current_date <= end_date:
                            groom_current = d
                            break
                    except Exception as e:
                        print(f"Date parsing error for groom: {e}")
                        continue
            
            print(f"Bride current Dasha: {bride_current}")
            print(f"Groom current Dasha: {groom_current}")
            
            # Analyze compatibility of current Dashas
            compatibility_score = 5
            analysis = []
            
            if bride_current and groom_current:
                b_planet = bride_current.get('planet', '')
                g_planet = groom_current.get('planet', '')
                
                # Friendly planet combinations
                friendly_pairs = [
                    ('Sun', 'Moon'), ('Sun', 'Mars'), ('Sun', 'Jupiter'),
                    ('Moon', 'Mercury'), ('Moon', 'Venus'),
                    ('Mars', 'Sun'), ('Mars', 'Moon'), ('Mars', 'Jupiter'),
                    ('Mercury', 'Sun'), ('Mercury', 'Venus'),
                    ('Jupiter', 'Sun'), ('Jupiter', 'Moon'), ('Jupiter', 'Mars'),
                    ('Venus', 'Mercury'), ('Venus', 'Saturn'),
                    ('Saturn', 'Mercury'), ('Saturn', 'Venus')
                ]
                
                if (b_planet, g_planet) in friendly_pairs or (g_planet, b_planet) in friendly_pairs:
                    compatibility_score = 8
                    analysis.append(f"Current Dasha periods are harmonious ({b_planet} & {g_planet})")
                elif b_planet == g_planet:
                    compatibility_score = 9
                    analysis.append(f"Both running {b_planet} Dasha - excellent synchronization")
                else:
                    compatibility_score = 5
                    analysis.append(f"Neutral Dasha combination ({b_planet} & {g_planet})")
                
                analysis.append(f"Bride: {b_planet} Dasha until {bride_current.get('end', 'N/A')}")
                analysis.append(f"Groom: {g_planet} Dasha until {groom_current.get('end', 'N/A')}")
            else:
                # If we can't find current Dasha, use the first available
                if bride_dasha.get('timeline') and groom_dasha.get('timeline'):
                    bride_current = bride_dasha['timeline'][0] if bride_dasha['timeline'] else None
                    groom_current = groom_dasha['timeline'][0] if groom_dasha['timeline'] else None
                    
                    if bride_current and groom_current:
                        b_planet = bride_current.get('planet', 'Unknown')
                        g_planet = groom_current.get('planet', 'Unknown')
                        analysis.append(f"Bride's primary Dasha: {b_planet}")
                        analysis.append(f"Groom's primary Dasha: {g_planet}")
                    else:
                        analysis.append("Dasha periods calculated successfully")
                else:
                    analysis.append("Dasha timeline data unavailable")
            
            return {
                "score": compatibility_score,
                "bride_current_dasha": bride_current.get('planet', 'Unknown') if bride_current else 'Unknown',
                "groom_current_dasha": groom_current.get('planet', 'Unknown') if groom_current else 'Unknown',
                "analysis": analysis,
                "recommendation": "Favorable" if compatibility_score >= 7 else ("Moderate" if compatibility_score >= 5 else "Challenging")
            }
        except Exception as e:
            print(f"Dasha Sync Error: {e}")
            import traceback
            traceback.print_exc()
            return {"score": 5, "analysis": [f"Dasha analysis error: {str(e)}"], "recommendation": "Moderate"}

    @staticmethod
    def _analyze_navamsa_compatibility(bride_astro, groom_astro):
        """Analyze D9 (Navamsa) chart compatibility for marriage harmony"""
        try:
            # Extract Navamsa positions (D9 division)
            def get_navamsa_sign(longitude):
                # Each sign is 30°, each Navamsa is 3°20' (10/3 degrees)
                navamsa_num = int((longitude % 30) / (30/9))
                sign_num = int(longitude / 30)
                # Navamsa calculation: (sign_num * 9 + navamsa_num) % 12
                return (sign_num * 9 + navamsa_num) % 12
            
            signs = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", 
                    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"]
            
            # Get Venus (marriage significator) positions
            bride_venus = next((p for p in bride_astro['planets'] if p['name'] == 'Venus'), None)
            groom_venus = next((p for p in groom_astro['planets'] if p['name'] == 'Venus'), None)
            
            compatibility_points = 0
            analysis = []
            
            if bride_venus and groom_venus:
                b_nav = get_navamsa_sign(bride_venus['sidereal_longitude'])
                g_nav = get_navamsa_sign(groom_venus['sidereal_longitude'])
                
                # Check if Navamsa signs are compatible
                distance = abs(b_nav - g_nav)
                if distance == 0:
                    compatibility_points = 10
                    analysis.append("Venus in same Navamsa sign - excellent marital harmony")
                elif distance in [4, 8]:  # Trine
                    compatibility_points = 9
                    analysis.append("Venus in trine Navamsa - very harmonious")
                elif distance in [5, 7]:  # Sextile/opposite
                    compatibility_points = 6
                    analysis.append("Venus in moderate Navamsa aspect")
                else:
                    compatibility_points = 5
                    analysis.append("Venus Navamsa requires conscious effort")
                
                analysis.append(f"Bride Venus D9: {signs[b_nav]}")
                analysis.append(f"Groom Venus D9: {signs[g_nav]}")
            
            # Check 7th house lord compatibility in Navamsa
            bride_asc_nav = get_navamsa_sign(bride_astro['ascendant']['longitude'])
            groom_asc_nav = get_navamsa_sign(groom_astro['ascendant']['longitude'])
            
            analysis.append(f"Bride Ascendant D9: {signs[bride_asc_nav]}")
            analysis.append(f"Groom Ascendant D9: {signs[groom_asc_nav]}")
            
            return {
                "score": compatibility_points,
                "analysis": analysis,
                "recommendation": "Excellent" if compatibility_points >= 8 else ("Good" if compatibility_points >= 6 else "Moderate")
            }
        except Exception as e:
            print(f"Navamsa Analysis Error: {e}")
            return {"score": 6, "analysis": ["Navamsa analysis unavailable"], "recommendation": "Moderate"}

    @staticmethod
    def _analyze_transits(bride_details, groom_details):
        """Analyze current planetary transits affecting the couple"""
        from datetime import datetime
        from services.vedic_astro_engine import VedicAstroEngine
        
        try:
            # Get current transit positions
            now = datetime.now()
            transit_data = VedicAstroEngine.calculate_sidereal_planets(
                now.year, now.month, now.day, now.hour, now.minute,
                0, 0, timezone_str='UTC'  # Generic location for transits
            )
            
            analysis = []
            favorability_score = 5
            
            # Check Jupiter transit (expansion, marriage)
            jupiter = next((p for p in transit_data['planets'] if p['name'] == 'Jupiter'), None)
            if jupiter:
                jup_sign = jupiter['sign']
                analysis.append(f"Jupiter transiting {jup_sign} - influences growth and expansion")
                if jup_sign in ['Sagittarius', 'Pisces', 'Cancer']:  # Jupiter's favorable signs
                    favorability_score += 2
                    analysis.append("Jupiter in favorable sign - auspicious for marriage")
            
            # Check Saturn transit (commitment, stability)
            saturn = next((p for p in transit_data['planets'] if p['name'] == 'Saturn'), None)
            if saturn:
                sat_sign = saturn['sign']
                analysis.append(f"Saturn transiting {sat_sign} - influences commitment and structure")
                if sat_sign in ['Capricorn', 'Aquarius', 'Libra']:  # Saturn's favorable signs
                    favorability_score += 1
                    analysis.append("Saturn well-placed for long-term commitment")
            
            # Check Venus transit (love, relationships)
            venus = next((p for p in transit_data['planets'] if p['name'] == 'Venus'), None)
            if venus:
                ven_sign = venus['sign']
                analysis.append(f"Venus transiting {ven_sign} - influences love and harmony")
                if ven_sign in ['Taurus', 'Libra', 'Pisces']:  # Venus's favorable signs
                    favorability_score += 1
            
            return {
                "score": min(10, favorability_score),
                "current_transits": {
                    "jupiter": jupiter['sign'] if jupiter else 'Unknown',
                    "saturn": saturn['sign'] if saturn else 'Unknown',
                    "venus": venus['sign'] if venus else 'Unknown'
                },
                "analysis": analysis,
                "recommendation": "Highly Favorable" if favorability_score >= 8 else ("Favorable" if favorability_score >= 6 else "Moderate")
            }
        except Exception as e:
            print(f"Transit Analysis Error: {e}")
            return {"score": 5, "analysis": ["Transit analysis unavailable"], "recommendation": "Moderate"}

    @staticmethod
    def generate_ai_analysis(bride_name, groom_name, kootas, total_score, b_manglik, g_manglik, doshas, lang="en"):
        """
        Generates AI summary of the match. 
        If lang='hi', generates in English first for accuracy, then translates to Hindi.
        """
        try:
            # 1. Construct the Analysis Prompt (English)
            koota_summary = ", ".join([f"{k['name']}: {k['points']}/{k['max_points']}" for k in kootas])
            dosha_summary = ", ".join([d['name'] for d in doshas if d['is_present']]) or "None"
            
            prompt = f"""
            You are an expert Vedic Astrologer with deep knowledge of Ashta-Koota and relationship psychology.
            Analyze the marriage compatibility for:
            Bride: {bride_name}
            Groom: {groom_name}
            
            Data:
            - Total Guna Score: {total_score}/36
            - Manglik Status: Bride ({b_manglik['status']}), Groom ({g_manglik['status']})
            - Key Doshas Present: {dosha_summary}
            - Koota Scores: {koota_summary}
            
            Task:
            Write a professional, insightful 2-paragraph summary of their compatibility.
            - Paragraph 1: Focus on the emotional connection, mental compatibility (Bhakoot), and longevity/health (Nadi).
            - Paragraph 2: Provide a final verdict/recommendation on whether to proceed and what remedies (if any) are needed.
            
            Tone: Compassionate, traditional yet practical.
            Output: Plain text only, no markdown formatting.
            """
            
            # 2. Generate English Analysis (Using Gemini for best reasoning)
            analysis_text = ""
            try:
                response = model.generate_content(prompt)
                analysis_text = response.text
            except Exception as e:
                print(f"Gemini Gen Error: {e}")
                # Fallback to Groq if Gemini fails
                chat_completion = client.chat.completions.create(
                    messages=[{"role": "user", "content": prompt}],
                    model="llama-3.3-70b-versatile",
                )
                analysis_text = chat_completion.choices[0].message.content

            # 3. Translate if Hindi requested
            if lang == "hi":
                # Debug: Print English length
                print(f"Translating English text of length: {len(analysis_text)}")
                
                translation_prompt = f"""
                You are a professional English-to-Hindi translator specializing in Vedic Astrology.
                
                TASK:
                Translate the text below into strictly formal, high-quality Hindi (Devanagari).
                
                CRITICAL INSTRUCTIONS:
                1. Translate EVERY single sentence. DO NOT summarize. DO NOT omit any details.
                2. The output MUST contain all the information from the original text.
                3. Use appropriate astrological terminology:
                   - 'Groom' -> 'वर' (Var)
                   - 'Bride' -> 'वधू' (Vadhu)
                   - 'Dosha' -> 'दोष' (Dosha)
                   - 'Compatible' -> 'अनुकूल' (Anukul)
                4. Maintain the professional and compassionate tone.
                
                TEXT TO TRANSLATE:
                ----------------
                {analysis_text}
                ----------------
                
                OUTPUT (Hindi Translation Only):
                """
                
                try:
                    # Use Gemini for translation
                    trans_response = model.generate_content(translation_prompt)
                    hindi_text = trans_response.text
                    print(f"Translated Hindi text length: {len(hindi_text)}")
                    
                    if len(hindi_text) < len(analysis_text) * 0.5:
                        print("Warning: Translation seems too short. Falling back to English + Warning.")
                        return hindi_text + "\n\n(नोट: अनुवाद में कुछ जानकारी संक्षेप की गई हो सकती है।)"
                        
                    return hindi_text
                except Exception as e:
                    print(f"Translation Error: {e}")
                    return analysis_text + " (Hindi translation unavailable)"
            
            return analysis_text

        except Exception as e:
            print(f"AI Generation Error: {e}")
            msg = "AI Expert analysis is currently unavailable. Please rely on the score calculation."
            return "AI विशेषज्ञ विश्लेषण वर्तमान में अनुपलब्ध है।" if lang == "hi" else msg

    @staticmethod
    def _calculate_marriage_windows(bride_astro, groom_astro, bride_details, groom_details):
        """Calculate auspicious marriage timing windows"""
        from datetime import datetime, timedelta
        from services.vedic_astro_engine import VedicAstroEngine
        
        try:
            # Calculate Dasha periods
            bride_dasha = VedicAstroEngine.calculate_vimshottari_dasha(
                bride_details['year'], bride_details['month'], bride_details['day'],
                bride_details['hour'], bride_details['minute'],
                bride_details['lat'], bride_details['lng']
            )
            
            groom_dasha = VedicAstroEngine.calculate_vimshottari_dasha(
                groom_details['year'], groom_details['month'], groom_details['day'],
                groom_details['hour'], groom_details['minute'],
                groom_details['lat'], groom_details['lng']
            )
            
            # Beneficial planets for marriage
            beneficial_planets = ['Venus', 'Jupiter', 'Mercury', 'Moon']
            
            # Find upcoming favorable periods (next 2 years for more practical results)
            current_date = datetime.now()
            end_date = current_date + timedelta(days=365*2)
            
            favorable_windows = []
            
            # Get bride's current and upcoming Mahadashas
            bride_timeline = bride_dasha.get('timeline', [])
            groom_timeline = groom_dasha.get('timeline', [])
            
            # Strategy: Find periods where either person is in a beneficial Mahadasha
            # and create windows for the next 2 years
            for b_period in bride_timeline:
                if not b_period.get('start') or not b_period.get('end'):
                    continue
                
                try:
                    b_start = datetime.strptime(b_period['start'], '%Y-%m-%d')
                    b_end = datetime.strptime(b_period['end'], '%Y-%m-%d')
                except:
                    continue
                
                # Skip if period is completely in the past or too far in future
                if b_end < current_date or b_start > end_date:
                    continue
                
                b_planet = b_period.get('planet', '')
                
                # Check if bride's Mahadasha is beneficial
                if b_planet in beneficial_planets:
                    # Find groom's Mahadasha during this period
                    for g_period in groom_timeline:
                        if not g_period.get('start') or not g_period.get('end'):
                            continue
                        
                        try:
                            g_start = datetime.strptime(g_period['start'], '%Y-%m-%d')
                            g_end = datetime.strptime(g_period['end'], '%Y-%m-%d')
                        except:
                            continue
                        
                        # Check for overlap
                        overlap_start = max(b_start, g_start, current_date)
                        overlap_end = min(b_end, g_end, end_date)
                        
                        if overlap_start < overlap_end:
                            g_planet = g_period.get('planet', '')
                            
                            # Calculate favorability
                            if b_planet == g_planet and b_planet in beneficial_planets:
                                favorability = "Excellent"
                                score = 10
                            elif g_planet in beneficial_planets:
                                favorability = "Very Good"
                                score = 8
                            else:
                                favorability = "Good"
                                score = 6
                            
                            # Only add if duration is at least 30 days
                            duration = (overlap_end - overlap_start).days
                            if duration >= 30:
                                favorable_windows.append({
                                    "start_date": overlap_start.strftime('%Y-%m-%d'),
                                    "end_date": overlap_end.strftime('%Y-%m-%d'),
                                    "bride_dasha": b_planet,
                                    "groom_dasha": g_planet,
                                    "favorability": favorability,
                                    "score": score,
                                    "duration_days": duration
                                })
            
            # Also check when groom is in beneficial Dasha (to catch cases we might have missed)
            for g_period in groom_timeline:
                if not g_period.get('start') or not g_period.get('end'):
                    continue
                
                try:
                    g_start = datetime.strptime(g_period['start'], '%Y-%m-%d')
                    g_end = datetime.strptime(g_period['end'], '%Y-%m-%d')
                except:
                    continue
                
                if g_end < current_date or g_start > end_date:
                    continue
                
                g_planet = g_period.get('planet', '')
                
                if g_planet in beneficial_planets:
                    for b_period in bride_timeline:
                        if not b_period.get('start') or not b_period.get('end'):
                            continue
                        
                        try:
                            b_start = datetime.strptime(b_period['start'], '%Y-%m-%d')
                            b_end = datetime.strptime(b_period['end'], '%Y-%m-%d')
                        except:
                            continue
                        
                        overlap_start = max(b_start, g_start, current_date)
                        overlap_end = min(b_end, g_end, end_date)
                        
                        if overlap_start < overlap_end:
                            b_planet = b_period.get('planet', '')
                            
                            # Check if we already have this window
                            window_exists = any(
                                w['start_date'] == overlap_start.strftime('%Y-%m-%d') and 
                                w['end_date'] == overlap_end.strftime('%Y-%m-%d')
                                for w in favorable_windows
                            )
                            
                            if not window_exists:
                                if b_planet == g_planet and b_planet in beneficial_planets:
                                    favorability = "Excellent"
                                    score = 10
                                elif b_planet in beneficial_planets:
                                    favorability = "Very Good"
                                    score = 8
                                else:
                                    favorability = "Good"
                                    score = 6
                                
                                duration = (overlap_end - overlap_start).days
                                if duration >= 30:
                                    favorable_windows.append({
                                        "start_date": overlap_start.strftime('%Y-%m-%d'),
                                        "end_date": overlap_end.strftime('%Y-%m-%d'),
                                        "bride_dasha": b_planet,
                                        "groom_dasha": g_planet,
                                        "favorability": favorability,
                                        "score": score,
                                        "duration_days": duration
                                    })
            
            # Sort by score (best first) and then by start date
            favorable_windows.sort(key=lambda x: (-x['score'], x['start_date']))
            
            # Remove duplicates and limit to top 5
            seen = set()
            unique_windows = []
            for w in favorable_windows:
                key = (w['start_date'], w['end_date'])
                if key not in seen:
                    seen.add(key)
                    unique_windows.append(w)
                    if len(unique_windows) >= 5:
                        break
            
            favorable_windows = unique_windows
            
            analysis = []
            if favorable_windows:
                analysis.append(f"Found {len(favorable_windows)} auspicious marriage periods in next 2 years")
                for i, window in enumerate(favorable_windows[:3], 1):
                    duration_months = window['duration_days'] // 30
                    analysis.append(f"{i}. {window['start_date']} to {window['end_date']} - {window['favorability']} ({duration_months} months)")
                if len(favorable_windows) > 3:
                    analysis.append(f"Plus {len(favorable_windows) - 3} more favorable periods available")
            else:
                # If no windows found, provide current period info
                analysis.append("Based on current Dasha periods, marriage can be planned")
                analysis.append("Consult astrologer for specific muhurat selection")
            
            return {
                "windows": favorable_windows,
                "analysis": analysis,
                "recommendation": f"{len(favorable_windows)} favorable periods identified" if favorable_windows else "Current period suitable - consult for muhurat"
            }
        except Exception as e:
            print(f"Marriage Windows Error: {e}")
            import traceback
            traceback.print_exc()
            return {"windows": [], "analysis": [f"Marriage timing analysis error: {str(e)}"], "recommendation": "Consult astrologer"}


