
class DoshaCalculator:
    @staticmethod
    def calculate_doshas(sidereal_data):
        """
        Detects major Vedic Doshas based on planetary positions with robust logic.
        """
        planets = sidereal_data['planets']
        asc_info = sidereal_data.get('ascendant', {})
        
        def get_p(name):
            return next((p for p in planets if p['name'] == name), None)
            
        mars = get_p('Mars')
        rahu = get_p('Rahu')
        ketu = get_p('Ketu')
        sun = get_p('Sun')
        moon = get_p('Moon')
        saturn = get_p('Saturn')
        jupiter = get_p('Jupiter')
        venus = get_p('Venus')
        mercury = get_p('Mercury')
        
        # Helpers
        def is_conjunct(p1, p2, orb_deg=None):
            if not p1 or not p2: return False
            if p1['sign'] == p2['sign']:
                if orb_deg:
                    dist = abs(p1['sidereal_longitude'] - p2['sidereal_longitude'])
                    dist = min(dist, 360 - dist)
                    return dist <= orb_deg
                return True
            return False

        def get_distance(p1, p2):
             if not p1 or not p2: return 360
             dist = abs(p1['sidereal_longitude'] - p2['sidereal_longitude'])
             return min(dist, 360 - dist)

        def get_sign_lord(sign_name):
            lords = {
                "Aries": "Mars", "Taurus": "Venus", "Gemini": "Mercury", "Cancer": "Moon",
                "Leo": "Sun", "Virgo": "Mercury", "Libra": "Venus", "Scorpio": "Mars",
                "Sagittarius": "Jupiter", "Capricorn": "Saturn", "Aquarius": "Saturn", "Pisces": "Jupiter"
            }
            return lords.get(sign_name, "Unknown")

        doshas = {
            "manglik": {"present": False, "intensity": "None", "reason": "", "remedy": ""},
            "kaal_sarp": {"present": False, "intensity": "None", "reason": "", "remedy": ""},
            "pitru_dosha": {"present": False, "intensity": "None", "reason": "", "remedy": ""},
            "guru_chandal": {"present": False, "intensity": "None", "reason": "", "remedy": ""},
            "shrapit_dosha": {"present": False, "intensity": "None", "reason": "", "remedy": ""},
            "grahan_dosha": {"present": False, "intensity": "None", "reason": "", "remedy": ""},
            "kemadrum_dosha": {"present": False, "intensity": "None", "reason": "", "remedy": ""},
            "chandra_dosha": {"present": False, "intensity": "None", "reason": "", "remedy": ""},
            "daridra_dosha": {"present": False, "intensity": "None", "reason": "", "remedy": ""},
            "gandmool_dosha": {"present": False, "intensity": "None", "reason": "", "remedy": ""}
        }

        # 1. Manglik Dosha
        is_manglik_lagna = False
        is_manglik_moon = False
        m_reasons = []
        
        if mars:
            m_h = mars['house']
            if m_h in [1, 2, 4, 7, 8, 12]:
                is_manglik_lagna = True
                m_reasons.append(f"Mars in House {m_h} (Lagna Chart)")
        
        if moon and mars:
            m_h_moon = (mars['house'] - moon['house']) % 12 + 1
            if m_h_moon in [1, 2, 4, 7, 8, 12]:
                is_manglik_moon = True
                m_reasons.append(f"Mars in House {m_h_moon} from Moon")

        if is_manglik_lagna or is_manglik_moon:
            is_cancelled = False
            cancel_reasons = []
            
            if mars['sign'] in ["Aries", "Scorpio"]:
                is_cancelled = True
                cancel_reasons.append("Mars in Own Sign")
            elif mars['sign'] == "Capricorn":
                is_cancelled = True
                cancel_reasons.append("Mars is Exalted")
            elif mars['sign'] == "Cancer":
                pass 
                
            if is_conjunct(mars, jupiter):
                is_cancelled = True
                cancel_reasons.append("Mars conjunct Jupiter")
            
            if saturn and saturn['house'] in [1, 4, 7, 8, 12]:
                cancel_reasons.append("Saturn in Kendra/8/12 mitigates intensity")

            if is_cancelled and "mitigates" not in "".join(cancel_reasons):
                # Strict Astrology: Cancellation means Dosha is Nullified (Absent)
                doshas['manglik']['present'] = False
                doshas['manglik']['reason'] = "Cancelled: " + ", ".join(cancel_reasons)
            else:
                doshas['manglik']['present'] = True
                doshas['manglik']['reason'] = "; ".join(m_reasons)
                if is_cancelled: 
                     doshas['manglik']['intensity'] = "Low (Mitigated)"
                     doshas['manglik']['reason'] += f". Mitigated by: {', '.join(cancel_reasons)}"
                else:
                    m_houses = []
                    if mars: m_houses.append(mars['house'])
                    if moon and mars: m_houses.append((mars['house'] - moon['house']) % 12 + 1)
                    
                    if 7 in m_houses or 8 in m_houses:
                        doshas['manglik']['intensity'] = "High"
                    else:
                        doshas['manglik']['intensity'] = "Moderate"
                        
                doshas['manglik']['remedy'] = "Chant Hanuman Chalisa, visit Hanuman temple on Tuesdays. For marriage, consider Kumbh Vivah protocol."

        # 2. Kaal Sarp Dosha
        if rahu and ketu:
            r_lon = rahu['sidereal_longitude']
            k_lon = ketu['sidereal_longitude']
            
            non_nodal_planets = [p for p in planets if p['name'] not in ['Rahu', 'Ketu', 'Uranus', 'Neptune', 'Pluto', 'Ascendant']]
            
            if non_nodal_planets:
                # To check if all are on one side, we check if the max range of non-nodal planets < 180 when normalized
                # Or count how many are to the "left" vs "right" of Rahu-Ketu axis
                
                # Simplified robust check:
                # Sort all longitudes relative to Rahu
                # Actually, simpler: Count how many are in Arc(Rahu->Ketu) vs Arc(Ketu->Rahu)
                
                # Arc 1: Rahu to Ketu (Clockwise/Increasing Longitude)
                # Handle wrapping:
                # If r < k: range is [r, k]
                # If r > k: range is [r, 360] U [0, k]
                
                def in_arc(val, start, end):
                    # Strict check only
                    return start < end and start <= val <= end or start > end and (start <= val or val <= end)

                in_rahu_ketu = 0
                in_ketu_rahu = 0
                total = len(non_nodal_planets)
                
                for p in non_nodal_planets:
                    l = p['sidereal_longitude']
                    if in_arc(l, r_lon, k_lon):
                        in_rahu_ketu += 1
                    
                    if in_arc(l, k_lon, r_lon):
                        in_ketu_rahu += 1
                
                is_kaalsarp = False
                ks_type = ""
                
                if in_rahu_ketu == total:
                    is_kaalsarp = True
                    ks_type = "Savya (Direct)"
                elif in_ketu_rahu == total:
                    is_kaalsarp = True
                    ks_type = "Apasavya (Reverse)"

                
                if is_kaalsarp:
                    doshas['kaal_sarp']['present'] = True
                    doshas['kaal_sarp']['intensity'] = "High"
                    doshas['kaal_sarp']['reason'] = f"{ks_type} Kaal Sarp Yoga detected. All planets are strictly hemmed between the Rahu-Ketu axis."
                    doshas['kaal_sarp']['remedy'] = "Perform Rudrabhishek on Shivaratri or Nag Panchami. Chant Mahamrityunjaya Mantra."
                else:
                    # Explicitly mention cancellation as requested by user
                    moon_p = next((p for p in non_nodal_planets if p['name'] == 'Moon'), None)
                    m_lon = moon_p['sidereal_longitude'] if moon_p else 0
                    doshas['kaal_sarp']['present'] = False
                    doshas['kaal_sarp']['reason'] = f"ABSENT: Cancelled because Moon at {m_lon:.2f}° is outside the Rahu({r_lon:.2f}°)-Ketu({k_lon:.2f}°) axis."



        # 3. Pitru Dosha
        pitru_reasons = []
        is_pitru = False
        
        # A. Sun + Nodes (Conjunction within 15 deg)
        if sun and rahu and is_conjunct(sun, rahu, orb_deg=15):
            pitru_reasons.append(f"Sun and Rahu conjunct in {sun['sign']}")
            is_pitru = True
        elif sun and ketu and is_conjunct(sun, ketu, orb_deg=15):
            pitru_reasons.append(f"Sun and Ketu conjunct in {sun['sign']}")
            is_pitru = True
            
        # B. Sun + Saturn (Conjunction within 15 deg)
        if sun and saturn and is_conjunct(sun, saturn, orb_deg=15):
            pitru_reasons.append(f"Sun and Saturn conjunct in {sun['sign']}")
            is_pitru = True
            
        # C. Rahu in 9th
        if rahu and rahu['house'] == 9:
            pitru_reasons.append("Rahu in 9th House")
            is_pitru = True
            
        # D. 9th Lord Affliction
        if asc_info:
            signs = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"]
            asc_idx = signs.index(asc_info['sign'])
            sign_9 = signs[(asc_idx + 8) % 12]
            lord_9 = get_sign_lord(sign_9)
            lord_p = get_p(lord_9)
            
            if lord_p and lord_p['house'] in [6, 8, 12]:
                 pitru_reasons.append(f"9th Lord ({lord_9}) in House {lord_p['house']}")
                 is_pitru = True

        if is_pitru:
            doshas['pitru_dosha']['present'] = True
            doshas['pitru_dosha']['reason'] = "; ".join(pitru_reasons)
            doshas['pitru_dosha']['intensity'] = "High" if "Conjunction" in str(pitru_reasons) else "Moderate"
            doshas['pitru_dosha']['remedy'] = "Offer water to ancestors (Tarpan), respect elders, and perform acts of charity on Amavasya."

        # 4. Guru Chandal
        if jupiter:
            # Jupiter-Rahu/Ketu conjunction usually effective if close, e.g. 10-15 deg
            if rahu and is_conjunct(jupiter, rahu, orb_deg=15):
                 doshas['guru_chandal']['present'] = True
                 doshas['guru_chandal']['reason'] = f"Jupiter and Rahu conjunct in {jupiter['sign']}"
                 doshas['guru_chandal']['intensity'] = "High"
                 doshas['guru_chandal']['remedy'] = "Worship Lord Vishnu, wear Yellow Sapphire (if advised), and respect teachers."
            elif ketu and is_conjunct(jupiter, ketu, orb_deg=15):
                 doshas['guru_chandal']['present'] = True
                 doshas['guru_chandal']['reason'] = f"Jupiter and Ketu conjunct in {jupiter['sign']}"
                 doshas['guru_chandal']['intensity'] = "Moderate"
                 doshas['guru_chandal']['remedy'] = "Chant Vishnu Sahasranama and engage in spiritual learning."

        # 5. Shrapit Dosha
        if saturn and rahu and is_conjunct(saturn, rahu, orb_deg=15):
            doshas['shrapit_dosha']['present'] = True
            doshas['shrapit_dosha']['reason'] = f"Saturn and Rahu conjunct in {saturn['sign']}"
            doshas['shrapit_dosha']['intensity'] = "High"
            doshas['shrapit_dosha']['remedy'] = "Perform Shani-Rahu Shanti Puja, serve the physically challenged, and chant Shani Mantra."

        # 6. Grahan Dosha (Eclipse)
        # Strictly requires close proximity of Sun/Moon with Nodes
        grahan_reasons = []
        is_grahan = False
        
        grahan_orb_limit = 12 # Standard tight orb for Eclipse effects
        
        if sun:
            if rahu and is_conjunct(sun, rahu, orb_deg=grahan_orb_limit):
                grahan_reasons.append("Sun-Rahu Close Conjunction")
                is_grahan = True
            if ketu and is_conjunct(sun, ketu, orb_deg=grahan_orb_limit):
                grahan_reasons.append("Sun-Ketu Close Conjunction")
                is_grahan = True
        
        if moon:
            if rahu and is_conjunct(moon, rahu, orb_deg=grahan_orb_limit):
                grahan_reasons.append("Moon-Rahu Close Conjunction")
                is_grahan = True
            if ketu and is_conjunct(moon, ketu, orb_deg=grahan_orb_limit):
                grahan_reasons.append("Moon-Ketu Close Conjunction")
                is_grahan = True
                
        if is_grahan:
            doshas['grahan_dosha']['present'] = True
            doshas['grahan_dosha']['reason'] = ", ".join(grahan_reasons)
            doshas['grahan_dosha']['intensity'] = "High"
            doshas['grahan_dosha']['remedy'] = "Chant Gayatri Mantra daily. Donate white items (rice, sugar) on Mondays."

        # 7. Kemadrum Dosha
        if moon:
            m_h = moon['house']
            prev_h = (m_h - 2) % 12 + 1 
            next_h = m_h % 12 + 1     
            
            solid_planets = [mars, mercury, jupiter, venus, saturn] 
            has_support = False
            
            for p in solid_planets:
                if p and p['house'] in [prev_h, next_h]:
                    has_support = True
                    break
            
            if not has_support:
                for p in solid_planets:
                    if p:
                        dist_from_moon = (p['house'] - moon['house']) % 12 + 1
                        if dist_from_moon in [1, 4, 7, 10]:
                            has_support = True
                            break
            
            if not has_support:
                for p in solid_planets: # Kendra from Lagna
                    if p and p['house'] in [1, 4, 7, 10]:
                        has_support = True
                        break

            if not has_support:
                doshas['kemadrum_dosha']['present'] = True
                doshas['kemadrum_dosha']['reason'] = "No planets in 2nd/12th from Moon & lack of Kendra support"
                doshas['kemadrum_dosha']['intensity'] = "High"
                doshas['kemadrum_dosha']['remedy'] = "Keep a solid silver square piece. Chant 'Om Namah Shivaya'. Worship moon on Purnima."

        # 8. Daridra Dosha
        if asc_info:
            signs = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"]
            asc_idx = signs.index(asc_info['sign'])
            
            sign_11 = signs[(asc_idx + 10) % 12]
            lord_11 = get_sign_lord(sign_11)
            l11_p = get_p(lord_11)
            
            sign_2 = signs[(asc_idx + 1) % 12]
            lord_2 = get_sign_lord(sign_2)
            l2_p = get_p(lord_2)
            
            daridra_reasons = []
            if l11_p and l11_p['house'] in [6, 8, 12]:
                daridra_reasons.append(f"11th Lord ({lord_11}) in House {l11_p['house']}")
            if l2_p and l2_p['house'] in [6, 8, 12]:
                daridra_reasons.append(f"2nd Lord ({lord_2}) in House {l2_p['house']}")
                
            if daridra_reasons:
                 doshas['daridra_dosha']['present'] = True
                 doshas['daridra_dosha']['reason'] = "; ".join(daridra_reasons)
                 doshas['daridra_dosha']['intensity'] = "Moderate"
                 doshas['daridra_dosha']['remedy'] = "Worship Goddess Lakshmi. Donate food or clothes to the needy on Fridays."

        # 9. Chandra Dosha
        chandra_reasons = []
        is_chandra = False
        if moon:
            if moon['sign'] == "Scorpio":
                chandra_reasons.append("Moon Debilitated (Scorpio)")
                is_chandra = True
            
            if saturn and is_conjunct(moon, saturn):
                chandra_reasons.append("Moon-Saturn Conjunction (Vish Yoga)")
                is_chandra = True
            
            if ketu and is_conjunct(moon, ketu):
                chandra_reasons.append("Moon-Ketu Conjunction")
                is_chandra = True
                
            if is_chandra:
                doshas['chandra_dosha']['present'] = True
                doshas['chandra_dosha']['reason'] = "; ".join(chandra_reasons)
                doshas['chandra_dosha']['intensity'] = "Moderate"
                doshas['chandra_dosha']['remedy'] = "Fast on Mondays. Offer water/milk to Shivling. Meditate."

        # 10. Gandmool Dosha
        gandmool_naks = ["Ashwini", "Ashlesha", "Magha", "Jyeshtha", "Moola", "Revati"]
        if moon and moon.get('nakshatra'):
             nak_name = moon['nakshatra'].get('name', '').split(' ')[0]
             is_gandmool = False
             found_nak = ""
             for g in gandmool_naks:
                 if g in nak_name:
                     is_gandmool = True
                     found_nak = g
                     break
             
             if is_gandmool:
                 doshas['gandmool_dosha']['present'] = True
                 doshas['gandmool_dosha']['reason'] = f"Moon in Gandmool Nakshatra ({found_nak})"
                 doshas['gandmool_dosha']['intensity'] = "High"
                 doshas['gandmool_dosha']['remedy'] = "Perform Gandmool Shanti Puja within 27 days of birth. Worship Lord Ganesha."

        return doshas
