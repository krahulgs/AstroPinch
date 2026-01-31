"""
KP Analysis Service
Implements rules from 'KPAstrology.pdf' to generate plain English analysis.
"""

class KPAnalysisService:
    @staticmethod
    def generate_analysis(kp_system_data, kp_cusps, lang="en"):
        """
        Generates analysis based on KP rules.
        """
        analysis = []
        
        # 1. PLANETARY ANALYSIS (Based on 'Reading a Script' section)
        # Rule: Planet = Source, Star Lord = Result, Sub Lord = Quality
        for planet in kp_system_data:
            p_name = planet['planet']
            star = planet['star_lord']
            sub = planet['sub_lord']
            
            # Simple, Friendly English formulation
            analysis.append({
                "type": "General",
                "meaning": f"**{p_name}** is guided by **{star}**, and the final positive outcome is shaped by **{sub}**."
            })

        # 2. HOUSE SPECIFIC RULES (Health, Job, etc.)
        # We need CSLs for this.
        if kp_cusps:
            # --- Health & Longevity (1st CSL) ---
            # Rule: 1st CSL signifying 1, 5, 9, 11 (Good) vs 6, 8, 12 (Bad).
            # Simplified: Look at the 1st CSL Planet itself and its nature.
            csl_1 = kp_cusps.get("1", {}).get("sub_lord")
            if csl_1:
                analysis.append({
                    "type": "Health",
                    "meaning": f"**Vitality**: The planet **{csl_1}** is a key guardian of your health. Focusing on positive habits related to this planet will boost your energy and well-being."
                })

            # --- Job vs Business (10th CSL) ---
            # Rule: 10th CSL signifying 7 (Business) or 6 (Job).
            csl_10 = kp_cusps.get("10", {}).get("sub_lord")
            if csl_10:
                analysis.append({
                    "type": "Career",
                    "meaning": f"**Career Path**: Your professional success is influenced by **{csl_10}**. This suggests you have unique talents that can shine brightly in a path suited to your true nature."
                })
                
                # GOLDEN RULE 1 (from PDF):
                # "The house occupied by the nakshatra of 10th Cuspal Sub lord is the most important house in your career."
                # We need to find the Nakshatra Lord of the 10th CSL.
                # 1. Find the 10th CSL planet in our planet list.
                csl_10_planet_data = next((p for p in kp_system_data if p['planet'] == csl_10), None)
                if csl_10_planet_data:
                    star_of_csl_10 = csl_10_planet_data['star_lord']
                    analysis.append({
                        "type": "Career Secret",
                        "meaning": f"**Success Tip**: A special 'Golden Rule' for you! Your career will flourish when you align with the energy of **{star_of_csl_10}**. Trust your instincts here for great results."
                    })

            # --- Marriage (7th CSL) ---
            csl_7 = kp_cusps.get("7", {}).get("sub_lord")
            if csl_7:
                analysis.append({
                    "type": "Relationships",
                    "meaning": f"**Love & Harmony**: The planet **{csl_7}** plays a role in your relationships. It brings its own flavor to your connections, helping you find balance and happiness with partners."
                })

        return analysis
