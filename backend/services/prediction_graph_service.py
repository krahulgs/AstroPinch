from datetime import datetime, timedelta
from services.vedic_astro_engine import VedicAstroEngine

class PredictionGraphService:
    @staticmethod
    async def generate_prediction_graph(details):
        """
        Calculates a 60-year prediction graph based on Dasha periods and planetary dignities.
        """
        try:
            # 1. Fetch Birth Chart (Sidereal) for Dignities
            sidereal_data = VedicAstroEngine.calculate_sidereal_planets(
                details.get('year'), details.get('month'), details.get('day'), 
                details.get('hour'), details.get('minute'), 
                details.get('lat'), details.get('lng'),
                timezone_str=details.get('timezone', 'UTC')
            )
            
            # Build Dignity Map for weighting
            dignity_weights = {
                "Deeply Exalted": 1.6,
                "Exalted": 1.4,
                "Own Sign": 1.15,
                "Neutral": 1.0,
                "Debilitated": 0.75,
                "Deeply Debilitated": 0.6
            }
            
            planet_stats = {}
            for p in sidereal_data['planets']:
                status = p.get('dignity', {}).get('status', 'Neutral')
                planet_stats[p['name']] = dignity_weights.get(status, 1.0)
                
            # 2. Get Full Dasha Cycle
            planets_order = [("Ketu", 7), ("Venus", 20), ("Sun", 6), ("Moon", 10), 
                             ("Mars", 7), ("Rahu", 18), ("Jupiter", 16), ("Saturn", 19), ("Mercury", 17)]
            
            moon = next(p for p in sidereal_data['planets'] if p['name'] == 'Moon')
            nak_index = moon['nakshatra']['index'] - 1
            ruler_index = nak_index % 9
            
            nak_span = 360 / 27
            traversed = moon['sidereal_longitude'] - (nak_index * nak_span)
            balance_years = ((nak_span - traversed) / nak_span) * planets_order[ruler_index][1]
            
            birth_date = datetime(details.get('year'), details.get('month'), details.get('day'), 
                                details.get('hour'), details.get('minute'))
            
            # Calculate full cycle start
            traversed_total = planets_order[ruler_index][1] - balance_years
            cycle_start = birth_date - timedelta(days=traversed_total * 365.2425)
            
            # Build Flat Dasha Timeline for lookup
            flat_timeline = []
            curr = cycle_start
            for i in range(15): # 15 mahadashas
                idx = (ruler_index + i) % 9
                m_lord, m_years = planets_order[idx]
                m_end = curr + timedelta(days=m_years * 365.2425)
                
                s_curr = curr
                for j in range(9):
                    s_idx = (idx + j) % 9
                    s_lord, s_years = planets_order[s_idx]
                    ant_years = (m_years * s_years) / 120.0
                    s_end = s_curr + timedelta(days=ant_years * 365.2425)
                    
                    flat_timeline.append({
                        "m_lord": m_lord,
                        "a_lord": s_lord,
                        "start": s_curr,
                        "end": s_end
                    })
                    s_curr = s_end
                curr = m_end

            # 3. Determine Lagna (Ascendant) Sign Index
            ascendant = next((p for p in sidereal_data['planets'] if p['name'] == 'Ascendant'), None)
            lagna_sign_id = ascendant['sign_id'] if ascendant else 1

            # 4. Functional Nature Table
            functional_nature = {
                1: {"benefic": ["Sun", "Mars", "Jupiter"], "malefic": ["Mercury", "Venus", "Saturn"]},
                2: {"benefic": ["Sun", "Saturn", "Mercury"], "malefic": ["Jupiter", "Moon", "Mars"]},
                3: {"benefic": ["Mercury", "Venus", "Saturn"], "malefic": ["Jupiter", "Mars", "Sun"]},
                4: {"benefic": ["Moon", "Mars", "Jupiter"], "malefic": ["Saturn", "Mercury", "Venus"]},
                5: {"benefic": ["Sun", "Mars", "Jupiter"], "malefic": ["Venus", "Saturn", "Mercury"]},
                6: {"benefic": ["Mercury", "Venus", "Saturn"], "malefic": ["Jupiter", "Sun", "Mars"]},
                7: {"benefic": ["Venus", "Mercury", "Saturn"], "malefic": ["Jupiter", "Sun", "Mars"]},
                8: {"benefic": ["Jupiter", "Moon", "Sun"], "malefic": ["Mercury", "Venus", "Saturn"]},
                9: {"benefic": ["Jupiter", "Sun", "Mars"], "malefic": ["Venus", "Saturn", "Mercury"]},
                10: {"benefic": ["Saturn", "Venus", "Mercury"], "malefic": ["Jupiter", "Moon", "Mars"]},
                11: {"benefic": ["Saturn", "Venus", "Mercury"], "malefic": ["Jupiter", "Moon", "Mars"]},
                12: {"benefic": ["Jupiter", "Moon", "Mars"], "malefic": ["Venus", "Saturn", "Mercury"]}
            }
            
            lagna_nature = functional_nature.get(lagna_sign_id, {"benefic": [], "malefic": []})

            # 5. House Placements
            planet_houses = {}
            for p in sidereal_data['planets']:
                if p['name'] == 'Ascendant': continue
                h_idx = (p['sign_id'] - lagna_sign_id) % 12
                planet_houses[p['name']] = h_idx + 1

            # 6. Moon Sign for Sade Sati
            moon_data = next((p for p in sidereal_data['planets'] if p['name'] == 'Moon'), None)
            moon_sign_id = moon_data['sign_id'] if moon_data else 1

            # 7. Generate Year-by-Year Graph Data
            # Generate for 100 years starting from birth year to cover a full lifetime
            birth_year_val = details.get('year')
            total_range = 100
            
            graph_data = []

            for i in range(total_range):
                year_val = birth_year_val + i
                mid_year = datetime(year_val, 7, 1)
                
                # --- DASHA COMPONENT (55%) ---
                active_dasha = next((p for p in flat_timeline if p['start'] <= mid_year < p['end']), None)
                m_lord = active_dasha['m_lord'] if active_dasha else "Jupiter"
                a_lord = active_dasha['a_lord'] if active_dasha else "Mercury"

                def get_planet_strength(planet_name):
                    score = 50
                    dignity_mult = planet_stats.get(planet_name, 1.0)
                    score += (dignity_mult - 1.0) * 50
                    if planet_name in lagna_nature['benefic']: score += 15
                    elif planet_name in lagna_nature['malefic']: score -= 10
                    
                    house = planet_houses.get(planet_name, 1)
                    is_malefic_natural = planet_name in ["Sun", "Mars", "Saturn", "Rahu", "Ketu"]
                    
                    if house in [1, 4, 7, 10]: score += 10
                    elif house in [5, 9]: score += 15
                    elif house == 11: score += 15
                    elif house == 6 and is_malefic_natural: score += 10
                    elif house == 6: score -= 15
                    elif house == 8: score -= 20
                    elif house == 12: score -= 15
                    return max(10, min(100, score))

                m_score = get_planet_strength(m_lord)
                a_score = get_planet_strength(a_lord)
                
                # Contextual bonus (Profession & Marital)
                prof = details.get('profession', '').lower() if details.get('profession') else ''
                prof_sig = []
                if "government" in prof: prof_sig = ["Sun", "Saturn", "Mars"]
                elif "business" in prof: prof_sig = ["Mercury", "Jupiter", "Venus"]
                elif "student" in prof: prof_sig = ["Mercury", "Jupiter", "Moon"]
                
                if m_lord in prof_sig: m_score += 10
                if a_lord in prof_sig: a_score += 10
                
                dasha_score = (m_score * 0.45) + (a_score * 0.55)

                # --- TRANSIT COMPONENT (45%) ---
                try:
                    transit_data = VedicAstroEngine.calculate_sidereal_planets(
                        year_val, 7, 1, 12, 0, details.get('lat'), details.get('lng'), 
                        timezone_str=details.get('timezone', 'UTC')
                    )
                    transit_planets = {p['name']: p for p in transit_data['planets']}
                    sat_t_sign = transit_planets['Saturn']['sign_id']
                    jup_t_sign = transit_planets['Jupiter']['sign_id']
                    
                    transit_score = 50
                    sat_from_moon = (sat_t_sign - moon_sign_id) % 12 + 1
                    if sat_from_moon in [12, 1, 2]: transit_score -= 30 # Sade Sati
                    elif sat_from_moon in [3, 6, 11]: transit_score += 20
                        
                    jup_from_moon = (jup_t_sign - moon_sign_id) % 12 + 1
                    if jup_from_moon in [2, 5, 7, 9, 11]: transit_score += 25
                except:
                    transit_score = 50

                total_score = (dasha_score * 0.55) + (transit_score * 0.45)
                final_score = min(99, max(20, total_score))
                
                status = "Neutral"
                if final_score > 75: status = "Excellent"
                elif final_score > 60: status = "Favorable"
                elif final_score < 40: status = "Challenging"
                
                graph_data.append({
                    "year": year_val,
                    "score": int(final_score),
                    "status": status,
                    "planetary_influence": m_lord,
                    "sub_lord": a_lord
                })
            
            return {
                "source": "Astro-Temporal Forecast Engine (Vedic Precision)",
                "graph_data": graph_data,
                "meta": {
                    "user": details.get('name'),
                    "calculation_method": "Vimshottari Dignity Weighting",
                    "engine": "VedAstro v4.2"
                }
            }
        except Exception as e:
            print(f"Prediction Graph Service Error: {e}")
            return None
