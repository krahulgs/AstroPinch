    @staticmethod
    def get_career_analysis(western_data):
        """
        Generates thorough Career, Money & Public Life analysis.
        Based on: Midheaven (10H), 2nd/6th Houses, Saturn, Jupiter, Elements.
        """
        if not western_data:
            return None
            
        analysis = {}
        
        # 1. Extract Key Data
        try:
            planets = western_data.get('planets', [])
            houses = western_data.get('houses', []) # List of signs for houses 1-12
            
            mc_sign = houses[9] if len(houses) > 9 else "Unknown"
            second_house_sign = houses[1] if len(houses) > 1 else "Unknown"
            sixth_house_sign = houses[5] if len(houses) > 5 else "Unknown"
            
            saturn = next((p for p in planets if p['name'] == 'Saturn'), None)
            jupiter = next((p for p in planets if p['name'] == 'Jupiter'), None)
            
            # --- Elemental Dominance ---
            elements = {"Fire": 0, "Earth": 0, "Air": 0, "Water": 0}
            sign_elements = {
                "Aries": "Fire", "Leo": "Fire", "Sagittarius": "Fire",
                "Taurus": "Earth", "Virgo": "Earth", "Capricorn": "Earth",
                "Gemini": "Air", "Libra": "Air", "Aquarius": "Air",
                "Cancer": "Water", "Scorpio": "Water", "Pisces": "Water"
            }
            
            for p in planets:
                elem = sign_elements.get(p['sign'], "Unknown")
                if elem in elements:
                    elements[elem] += 1
                    
            dominant_element = max(elements, key=elements.get)
            earth_score = elements["Earth"]
            
        except Exception as e:
            print(f"Error extracting career data: {e}")
            return {"error": "Could not calculate career analysis"}

        # 2. Answer Question 1: What career paths suit me best? (MC + 10th House)
        mc_interpretations = {
            "Fire": "You are meant to Lead and Create. Careers in management, entertainment, entrepreneurship, or any field allowing autonomy suit you best.",
            "Earth": "You are meant to Build and Organize. Structures, finance, administration, and tangible results driven fields are your domain.",
            "Air": "You are meant to Communicate and Connect. Media, technology, law, social networks, and intellectual pursuits are ideal.",
            "Water": "You are meant to Heal and Support. Psychology, arts, healthcare, and roles requiring emotional intelligence are your strength."
        }
        mc_elem = sign_elements.get(mc_sign, "Fire") # Default
        analysis["career_path"] = {
            "title": "What career paths suit me best?",
            "midheaven_sign": mc_sign,
            "core_answer": mc_interpretations.get(mc_elem),
            "detail": f"With the Midheaven in **{mc_sign}**, your public reputation is built on qualities of {mc_sign}. You shine when you embody this energy publicly."
        }
        
        # 3. Answer Question 2: How do I handle responsibility? (Saturn)
        saturn_sign = saturn['sign'] if saturn else "Unknown"
        saturn_house = saturn['house'] if saturn else "Unknown"
        analysis["responsibility"] = {
            "title": "How do I handle responsibility?",
            "factor": f"Saturn in {saturn_sign}",
            "answer": f"Saturn in **{saturn_sign}** suggests you approach authority with specific lessons. You are learning to master {saturn_sign}'s themes through patience. " + 
                      ("It creates a steady, ambitious climb." if saturn_sign in ['Capricorn', 'Aquarius', 'Libra'] else "It requires you to build self-discipline over time.")
        }
        
        # 4. Answer Question 3: Where does financial stability come from? (2nd House + Jupiter)
        money_interpretations = {
            "Fire": "Initiative and self-promotion. Income grows when you take risks.",
            "Earth": "Steady work, assets, and practical skills. Stability is key.",
            "Air": "Ideas, networks, and communication. Your mind is your mint.",
            "Water": "Intuition, care-giving, or creative flow. trusting feelings brings gain."
        }
        h2_elem = sign_elements.get(second_house_sign, "Earth")
        jupiter_sign = jupiter['sign'] if jupiter else "Unknown"
        
        analysis["finance"] = {
            "title": "Where does financial stability come from?",
            "factors": f"2nd House in {second_house_sign} & Jupiter in {jupiter_sign}",
            "answer": f"Your 2nd House in **{second_house_sign}** suggests money comes through {money_interpretations.get(h2_elem)}. "
                      f"Additionally, **Jupiter in {jupiter_sign}** acts as an abundance multiplier, indicating luck when you expand your horizons in {jupiter_sign}-related areas."
        }
        
        # 5. Answer Question 4: What blocks professional growth? (Saturn + 6th House)
        # Simplified block logic
        block_text = f"Saturn often indicates the primary hurdle. In **{saturn_sign}**, the fear of inadequate {saturn_sign} qualities (like structure or expression) can hold you back."
        if earth_score < 2:
            block_text += " Also, a lack of Earth placements suggests you may struggle with practical grounding—focus on routine."
        else:
            block_text += " Your strong Earth presence helps you build, but beware of becoming too rigid or risk-averse."
            
        analysis["blockers"] = {
            "title": "What blocks professional growth?",
            "answer": block_text
        }
        
        # 6. Answer Question 5: Am I meant to lead, support, create, or specialize? (Elemental Dominance)
        roles = {
            "Fire": "LEAD & CREATE. You are a spark generator.",
            "Earth": "SPECIALIZE & BUILD. You are the pillar of structure.",
            "Air": "CONNECT & IDEATE. You are the networker.",
            "Water": "SUPPORT & FEEL. You are the intuitive guide."
        }
        analysis["role"] = {
            "title": "Am I meant to lead, support, or create?",
            "dominant_element": dominant_element,
            "answer": f"With **{dominant_element}** dominance ({elements[dominant_element]} planets), you are fundamentally wired to: **{roles.get(dominant_element)}**"
        }
        
        return analysis
